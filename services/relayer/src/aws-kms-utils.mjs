import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { createHash } from 'node:crypto';
import { computeAddress, recoverAddress, Signature } from 'ethers';

const execFileAsync = promisify(execFile);

function readLength(bytes, offset) {
  const first = bytes[offset];
  if (first < 0x80) {
    return { length: first, nextOffset: offset + 1 };
  }
  const lengthBytes = first & 0x7f;
  if (lengthBytes === 0 || lengthBytes > 4) {
    throw new Error(`Unsupported DER length encoding at offset ${offset}.`);
  }
  let length = 0;
  for (let i = 0; i < lengthBytes; i++) {
    length = (length << 8) | bytes[offset + 1 + i];
  }
  return { length, nextOffset: offset + 1 + lengthBytes };
}

function readDer(bytes, offset = 0) {
  if (offset >= bytes.length) {
    throw new Error('Unexpected end of DER data.');
  }
  const tag = bytes[offset];
  const { length, nextOffset } = readLength(bytes, offset + 1);
  const start = nextOffset;
  const end = start + length;
  if (end > bytes.length) {
    throw new Error('DER length exceeds available bytes.');
  }
  return {
    tag,
    length,
    start,
    end,
    value: bytes.slice(start, end),
    nextOffset: end,
  };
}

function trimInteger(bytes) {
  let offset = 0;
  while (offset < bytes.length - 1 && bytes[offset] === 0x00) {
    offset += 1;
  }
  return bytes.slice(offset);
}

function leftPad32(bytes) {
  if (bytes.length > 32) {
    throw new Error(`Expected at most 32 bytes, received ${bytes.length}.`);
  }
  const out = new Uint8Array(32);
  out.set(bytes, 32 - bytes.length);
  return out;
}

export function bytesToHex(bytes) {
  return `0x${Buffer.from(bytes).toString('hex')}`;
}

export function hexToBytes(raw) {
  const normalized = String(raw ?? '').trim().replace(/^0x/, '');
  if (!/^[0-9a-fA-F]+$/.test(normalized) || normalized.length % 2 !== 0) {
    throw new Error(`Invalid hex string: ${raw}`);
  }
  return Uint8Array.from(Buffer.from(normalized, 'hex'));
}

export async function runAwsCliJson(args) {
  try {
    const { stdout } = await execFileAsync('aws', args, {
      env: process.env,
      maxBuffer: 1024 * 1024 * 4,
    });
    return JSON.parse(stdout);
  } catch (error) {
    const message =
      error instanceof Error && 'stderr' in error && typeof error.stderr === 'string'
        ? error.stderr.trim() || error.message
        : error instanceof Error
          ? error.message
          : String(error);
    throw new Error(`AWS CLI command failed: ${message}`);
  }
}

export async function kmsGetPublicKey(keyId) {
  return runAwsCliJson(['kms', 'get-public-key', '--key-id', keyId, '--output', 'json']);
}

export async function kmsSign({ keyId, signingAlgorithm, messageBytes, messageType }) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'heptad-kms-sign-'));
  const messagePath = path.join(tempDir, 'message.bin');
  return runAwsCliJson([
    ...(await (async () => {
      await fs.writeFile(messagePath, Buffer.from(messageBytes));
      return [
        'kms',
        'sign',
        '--key-id',
        keyId,
        '--signing-algorithm',
        signingAlgorithm,
        '--message-type',
        messageType,
        '--message',
        `fileb://${messagePath}`,
        '--output',
        'json',
      ];
    })()),
  ]).finally(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });
}

export async function kmsVerify({ keyId, signingAlgorithm, messageBytes, messageType, signatureBytes }) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'heptad-kms-verify-'));
  const messagePath = path.join(tempDir, 'message.bin');
  const signaturePath = path.join(tempDir, 'signature.bin');
  return runAwsCliJson([
    ...(await (async () => {
      await fs.writeFile(messagePath, Buffer.from(messageBytes));
      await fs.writeFile(signaturePath, Buffer.from(signatureBytes));
      return [
        'kms',
        'verify',
        '--key-id',
        keyId,
        '--signing-algorithm',
        signingAlgorithm,
        '--message-type',
        messageType,
        '--message',
        `fileb://${messagePath}`,
        '--signature',
        `fileb://${signaturePath}`,
        '--output',
        'json',
      ];
    })()),
  ]).finally(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });
}

export function decodeSpkiBitString(spkiDerBytes) {
  const top = readDer(spkiDerBytes);
  if (top.tag !== 0x30) {
    throw new Error('SPKI must start with a DER sequence.');
  }
  const algorithm = readDer(top.value, 0);
  if (algorithm.tag !== 0x30) {
    throw new Error('SPKI algorithm identifier must be a sequence.');
  }
  const publicKey = readDer(top.value, algorithm.nextOffset);
  if (publicKey.tag !== 0x03) {
    throw new Error('SPKI public key must be a BIT STRING.');
  }
  if (publicKey.value.length < 1 || publicKey.value[0] !== 0x00) {
    throw new Error('Unsupported BIT STRING padding in SPKI public key.');
  }
  return publicKey.value.slice(1);
}

export function decodeDerEcdsaSignature(derBytes) {
  const top = readDer(derBytes);
  if (top.tag !== 0x30) {
    throw new Error('ECDSA signature must be a DER sequence.');
  }
  const rNode = readDer(top.value, 0);
  const sNode = readDer(top.value, rNode.nextOffset);
  if (rNode.tag !== 0x02 || sNode.tag !== 0x02) {
    throw new Error('ECDSA signature must contain INTEGER r and s.');
  }
  const r = leftPad32(trimInteger(rNode.value));
  const s = leftPad32(trimInteger(sNode.value));
  return { r, s };
}

export function deriveEthereumAddressFromSpki(spkiDerBytes) {
  const publicKey = decodeSpkiBitString(spkiDerBytes);
  return computeAddress(bytesToHex(publicKey));
}

export function recoverEthereumPackedSignature(digestHex, derSignatureBytes, expectedAddress) {
  const { r, s } = decodeDerEcdsaSignature(derSignatureBytes);
  const rHex = bytesToHex(r);
  const sHex = bytesToHex(s);
  for (const v of [27, 28]) {
    const recovered = recoverAddress(digestHex, Signature.from({ r: rHex, s: sHex, v }));
    if (recovered.toLowerCase() === expectedAddress.toLowerCase()) {
      const packed = new Uint8Array(65);
      packed.set(r, 0);
      packed.set(s, 32);
      packed[64] = v;
      return {
        recovered,
        packedSignature: packed,
        v,
        rHex,
        sHex,
      };
    }
  }
  throw new Error(`Could not derive Ethereum recovery id for expected signer ${expectedAddress}.`);
}

export function deriveOpnetRelayId(publicKeyBytes) {
  const relayPubKeyHashHex = bytesToHex(createHash('sha256').update(Buffer.from(publicKeyBytes)).digest());
  return {
    publicKeyHex: bytesToHex(publicKeyBytes),
    publicKeyBytes: publicKeyBytes.length,
    relayPubKeyHashHex,
  };
}
