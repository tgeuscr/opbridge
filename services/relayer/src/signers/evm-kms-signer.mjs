import process from 'node:process';
import { bytesToHex, deriveEthereumAddressFromSpki, kmsGetPublicKey, kmsSign, recoverEthereumPackedSignature } from '../aws-kms-utils.mjs';

export async function loadKmsEvmRelaySigners({ relayerId, relayIndexFromEnv }) {
  if (relayIndexFromEnv == null) {
    throw new Error('RELAYER_INDEX is required for KMS EVM signer mode.');
  }
  const keyId =
    process.env.RELAYER_EVM_KMS_KEY_ID?.trim() ||
    process.env.KMS_EVM_KEY_ID?.trim() ||
    process.env.KMS_KEY_ID?.trim();
  if (!keyId) {
    throw new Error('RELAYER_EVM_KMS_KEY_ID or KMS_EVM_KEY_ID is required for KMS EVM signer mode.');
  }

  const signingAlgorithm = process.env.KMS_EVM_SIGNING_ALGORITHM?.trim() || 'ECDSA_SHA_256';
  const messageType = process.env.KMS_EVM_MESSAGE_TYPE?.trim() || 'DIGEST';
  const publicKeyResponse = await kmsGetPublicKey(keyId);
  const spkiDer = Buffer.from(String(publicKeyResponse.PublicKey), 'base64');
  const signerAddress = deriveEthereumAddressFromSpki(spkiDer);

  return [
    {
      relayIndex: relayIndexFromEnv,
      relayerId,
      signerId: signerAddress,
      signerPubKeyHex: bytesToHex(spkiDer),
      keyId,
      signDigestHex: async (digestHex) => {
        const signResponse = await kmsSign({
          keyId,
          signingAlgorithm,
          messageBytes: Buffer.from(String(digestHex).replace(/^0x/, ''), 'hex'),
          messageType,
        });
        const derSignature = Buffer.from(String(signResponse.Signature), 'base64');
        const packed = recoverEthereumPackedSignature(digestHex, derSignature, signerAddress);
        return bytesToHex(packed.packedSignature);
      },
    },
  ];
}
