import process from 'node:process';
import { Address } from '@btc-vision/transaction';
import { decodeSpkiBitString, kmsGetPublicKey, kmsSign } from '../aws-kms-utils.mjs';

export async function loadKmsOpnetRelaySigners({ relayerId, relayIndexFromEnv }) {
  if (relayIndexFromEnv == null) {
    throw new Error('RELAYER_INDEX is required for KMS OPNet signer mode.');
  }
  const keyId =
    process.env.RELAYER_KMS_KEY_ID?.trim() ||
    process.env.KMS_OPNET_KEY_ID?.trim() ||
    process.env.KMS_KEY_ID?.trim();
  if (!keyId) {
    throw new Error('RELAYER_KMS_KEY_ID or KMS_OPNET_KEY_ID is required for KMS OPNet signer mode.');
  }

  const signingAlgorithm = process.env.KMS_OPNET_SIGNING_ALGORITHM?.trim() || 'ML_DSA_SHAKE_256';
  const messageType = process.env.KMS_OPNET_MESSAGE_TYPE?.trim() || 'RAW';
  const publicKeyResponse = await kmsGetPublicKey(keyId);
  const spkiDer = Buffer.from(String(publicKeyResponse.PublicKey), 'base64');
  const publicKey = decodeSpkiBitString(spkiDer);
  const signerId = new Address(publicKey).toHex();

  return [
    {
      relayIndex: relayIndexFromEnv,
      relayerId,
      signerId,
      publicKey,
      keyId,
      sign: async (messageHashBytes) => {
        const signResponse = await kmsSign({
          keyId,
          signingAlgorithm,
          messageBytes: messageHashBytes,
          messageType,
        });
        return new Uint8Array(Buffer.from(String(signResponse.Signature), 'base64'));
      },
    },
  ];
}
