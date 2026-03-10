import process from 'node:process';
import { buildReleaseAttestationHash, bytesToHex, hexToBytes } from './attestation-hash-utils.mjs';
import {
  deriveEthereumAddressFromSpki,
  kmsGetPublicKey,
  kmsSign,
  kmsVerify,
  recoverEthereumPackedSignature,
} from './aws-kms-utils.mjs';

function loadDigestBytes() {
  if (process.env.EVM_MESSAGE_DIGEST_HEX?.trim()) {
    const bytes = hexToBytes(process.env.EVM_MESSAGE_DIGEST_HEX);
    if (bytes.length !== 32) {
      throw new Error(`EVM_MESSAGE_DIGEST_HEX must be 32 bytes, received ${bytes.length}.`);
    }
    return bytes;
  }
  if (process.env.EVM_RELEASE_JSON?.trim()) {
    const message = JSON.parse(process.env.EVM_RELEASE_JSON);
    return buildReleaseAttestationHash(message);
  }
  throw new Error('Set EVM_MESSAGE_DIGEST_HEX or EVM_RELEASE_JSON.');
}

async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`KMS Spike: Ethereum secp256k1 Relay Signing

Required:
  KMS_KEY_ID

Digest input (one required):
  EVM_MESSAGE_DIGEST_HEX    0x-prefixed 32-byte digest
  EVM_RELEASE_JSON          JSON message object to hash with Heptad release attestation format

Optional:
  KMS_EVM_SIGNING_ALGORITHM default: ECDSA_SHA_256
  KMS_EVM_MESSAGE_TYPE      default: DIGEST

This script checks:
  - KMS can sign the digest
  - KMS verify succeeds
  - DER signature can be converted to packed 65-byte Ethereum format
  - recovered signer matches the KMS public key
`);
    return;
  }

  const keyId = process.env.KMS_KEY_ID?.trim();
  if (!keyId) throw new Error('Missing KMS_KEY_ID.');
  const signingAlgorithm = process.env.KMS_EVM_SIGNING_ALGORITHM?.trim() || 'ECDSA_SHA_256';
  const messageType = process.env.KMS_EVM_MESSAGE_TYPE?.trim() || 'DIGEST';
  const digestBytes = loadDigestBytes();
  const digestHex = bytesToHex(digestBytes);

  const publicKeyResponse = await kmsGetPublicKey(keyId);
  const spkiDer = Buffer.from(String(publicKeyResponse.PublicKey), 'base64');
  const ethereumAddress = deriveEthereumAddressFromSpki(spkiDer);

  const signResponse = await kmsSign({
    keyId,
    signingAlgorithm,
    messageBytes: digestBytes,
    messageType,
  });
  const derSignatureBytes = Buffer.from(String(signResponse.Signature), 'base64');
  const verifyResponse = await kmsVerify({
    keyId,
    signingAlgorithm,
    messageBytes: digestBytes,
    messageType,
    signatureBytes: derSignatureBytes,
  });
  const packed = recoverEthereumPackedSignature(digestHex, derSignatureBytes, ethereumAddress);

  console.log(
    JSON.stringify(
      {
        ok: verifyResponse.SignatureValid === true && packed.packedSignature.length === 65,
        kmsKeyId: keyId,
        keySpec: publicKeyResponse.KeySpec,
        keyUsage: publicKeyResponse.KeyUsage,
        signingAlgorithms: publicKeyResponse.SigningAlgorithms,
        selectedSigningAlgorithm: signingAlgorithm,
        messageType,
        digestHex,
        ethereumAddress,
        derSignatureHex: bytesToHex(derSignatureBytes),
        derSignatureBytes: derSignatureBytes.length,
        packedSignatureHex: bytesToHex(packed.packedSignature),
        packedSignatureBytes: packed.packedSignature.length,
        v: packed.v,
        rHex: packed.rHex,
        sHex: packed.sHex,
        recoveredAddress: packed.recovered,
        kmsVerify: verifyResponse.SignatureValid === true,
        vaultCompatibility: {
          packedSignatureLengthMatches: packed.packedSignature.length === 65,
          recoveredMatchesExpected: packed.recovered.toLowerCase() === ethereumAddress.toLowerCase(),
        },
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
