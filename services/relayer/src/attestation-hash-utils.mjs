import { createHash } from 'node:crypto';
import { Address } from '@btc-vision/transaction';

export function hexToBytes(raw) {
  const value = String(raw ?? '').trim();
  const normalized = value.startsWith('0x') ? value.slice(2) : value;
  if (!/^[0-9a-fA-F]+$/.test(normalized) || normalized.length % 2 !== 0) {
    throw new Error(`Invalid hex string: ${raw}`);
  }
  return Uint8Array.from(Buffer.from(normalized, 'hex'));
}

export function bytesToHex(bytes) {
  return `0x${Buffer.from(bytes).toString('hex')}`;
}

export function concatBytes(parts) {
  const totalLength = parts.reduce((acc, part) => acc + part.length, 0);
  const out = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

export function u256ToBytes(value) {
  const bigint = BigInt(value);
  if (bigint < 0n) throw new Error('u256 must be non-negative.');
  const out = new Uint8Array(32);
  let cursor = bigint;
  for (let i = 31; i >= 0; i--) {
    out[i] = Number(cursor & 0xffn);
    cursor >>= 8n;
  }
  return out;
}

export function leftPadTo32(bytes, fieldName) {
  if (bytes.length > 32) {
    throw new Error(`${fieldName} exceeds 32 bytes.`);
  }
  if (bytes.length === 32) return bytes;
  const out = new Uint8Array(32);
  out.set(bytes, 32 - bytes.length);
  return out;
}

export function resolveWord32(raw, fieldName) {
  const value = String(raw ?? '').trim();
  if (!value) {
    throw new Error(`${fieldName} is required.`);
  }
  if (value.startsWith('0x')) {
    const bytes = hexToBytes(value);
    if (bytes.length === 20 || bytes.length === 32) {
      return leftPadTo32(bytes, fieldName);
    }
    throw new Error(`${fieldName} must be 20 or 32 bytes (got ${bytes.length}).`);
  }
  return leftPadTo32(hexToBytes(Address.fromString(value).toHex()), fieldName);
}

export function buildMintAttestationHash(message) {
  const payload = concatBytes([
    new Uint8Array([Number(message.version)]),
    resolveWord32(message.ethereumVault, 'ethereumVault'),
    resolveWord32(message.opnetBridgeHex ?? message.opnetBridge, 'opnetBridge'),
    resolveWord32(message.ethereumUser, 'ethereumUser'),
    resolveWord32(message.opnetUser ?? message.recipient, 'opnetUser'),
    new Uint8Array([Number(message.assetId)]),
    u256ToBytes(message.amount),
    new Uint8Array([Number(message.direction ?? 1)]),
    u256ToBytes(message.nonce),
  ]);
  return new Uint8Array(createHash('sha256').update(payload).digest());
}

export function buildReleaseAttestationHash(message) {
  const payload = concatBytes([
    new Uint8Array([Number(message.version)]),
    resolveWord32(message.ethereumVault, 'ethereumVault'),
    resolveWord32(message.opnetBridgeHex ?? message.opnetBridge, 'opnetBridge'),
    leftPadTo32(hexToBytes(String(message.ethereumUser)), 'ethereumUser'),
    leftPadTo32(hexToBytes(String(message.opnetUser)), 'opnetUser'),
    new Uint8Array([Number(message.assetId)]),
    u256ToBytes(message.amount),
    new Uint8Array([Number(message.direction ?? 2)]),
    u256ToBytes(message.nonce),
  ]);
  return new Uint8Array(createHash('sha256').update(payload).digest());
}
