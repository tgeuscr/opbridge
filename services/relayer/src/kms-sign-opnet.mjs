import process from 'node:process';
import { Address } from '@btc-vision/transaction';
import { buildMintAttestationHash, bytesToHex, hexToBytes } from './attestation-hash-utils.mjs';
import {
  decodeSpkiBitString,
  deriveOpnetRelayId,
  kmsGetPublicKey,
  kmsSign,
  kmsVerify,
} from './aws-kms-utils.mjs';

const EXPECTED_PUBLIC_KEY_BYTES = 1312;
const EXPECTED_SIGNATURE_BYTES = 2420;

function loadMessageBytes() {
  if (process.env.OPNET_MESSAGE_HEX?.trim()) {
    return hexToBytes(process.env.OPNET_MESSAGE_HEX);
  }
  if (process.env.OPNET_ATTESTATION_JSON?.trim()) {
    const message = JSON.parse(process.env.OPNET_ATTESTATION_JSON);
    return buildMintAttestationHash(message);
  }
  throw new Error('Set OPNET_MESSAGE_HEX or OPNET_ATTESTATION_JSON.');
}

async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`KMS Spike: OPNet ML-DSA Relay Signing

Required:
  KMS_KEY_ID

Message input (one required):
  OPNET_MESSAGE_HEX         0x-prefixed message bytes to sign
  OPNET_ATTESTATION_JSON    JSON message object to hash with Heptad mint attestation format

Optional:
  KMS_OPNET_SIGNING_ALGORITHM   default: ML_DSA_SHAKE_256
  KMS_OPNET_MESSAGE_TYPE        default: RAW

This script checks:
  - KMS can sign the message
  - KMS verify succeeds
  - public key length matches OPNet bridge expectation
  - signature length matches OPNet bridge expectation
`);
    return;
  }

  const keyId = process.env.KMS_KEY_ID?.trim();
  if (!keyId) throw new Error('Missing KMS_KEY_ID.');
  const signingAlgorithm = process.env.KMS_OPNET_SIGNING_ALGORITHM?.trim() || 'ML_DSA_SHAKE_256';
  const messageType = process.env.KMS_OPNET_MESSAGE_TYPE?.trim() || 'RAW';
  const messageBytes = loadMessageBytes();

  const publicKeyResponse = await kmsGetPublicKey(keyId);
  const spkiDer = Buffer.from(String(publicKeyResponse.PublicKey), 'base64');
  const publicKeyBytes = decodeSpkiBitString(spkiDer);
  const opnetRelayId = new Address(publicKeyBytes).toHex();
  const relayMeta = deriveOpnetRelayId(publicKeyBytes);

  const signResponse = await kmsSign({
    keyId,
    signingAlgorithm,
    messageBytes,
    messageType,
  });
  const signatureBytes = Buffer.from(String(signResponse.Signature), 'base64');
  const verifyResponse = await kmsVerify({
    keyId,
    signingAlgorithm,
    messageBytes,
    messageType,
    signatureBytes,
  });

  console.log(
    JSON.stringify(
      {
        ok:
          verifyResponse.SignatureValid === true &&
          publicKeyBytes.length === EXPECTED_PUBLIC_KEY_BYTES &&
          signatureBytes.length === EXPECTED_SIGNATURE_BYTES,
        kmsKeyId: keyId,
        keySpec: publicKeyResponse.KeySpec,
        keyUsage: publicKeyResponse.KeyUsage,
        signingAlgorithms: publicKeyResponse.SigningAlgorithms,
        selectedSigningAlgorithm: signingAlgorithm,
        messageType,
        messageHex: bytesToHex(messageBytes),
        messageBytes: messageBytes.length,
        publicKeyHex: relayMeta.publicKeyHex,
        publicKeyBytes: publicKeyBytes.length,
        expectedPublicKeyBytes: EXPECTED_PUBLIC_KEY_BYTES,
        relayPubKeyHashHex: relayMeta.relayPubKeyHashHex,
        opnetRelayId,
        signatureHex: bytesToHex(signatureBytes),
        signatureBytes: signatureBytes.length,
        expectedSignatureBytes: EXPECTED_SIGNATURE_BYTES,
        kmsVerify: verifyResponse.SignatureValid === true,
        bridgeCompatibility: {
          publicKeyLengthMatches: publicKeyBytes.length === EXPECTED_PUBLIC_KEY_BYTES,
          signatureLengthMatches: signatureBytes.length === EXPECTED_SIGNATURE_BYTES,
          note: 'This proves KMS sign/verify and size compatibility. Final proof still requires a live Heptad bridge attestation submission.',
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
