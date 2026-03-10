import fs from 'node:fs';
import process from 'node:process';
import { ethers } from 'ethers';
import { loadJsonSecretPayload, loadSecretString } from '../secret-provider.mjs';

const DEFAULT_KEYS_FILE = 'services/relayer/.data/relay-keys.json';

async function loadRelayKeyPayload(defaultKeysFile) {
  const keysFile = process.env.RELAYER_EVM_KEYS_FILE?.trim() || defaultKeysFile || DEFAULT_KEYS_FILE;
  const filePath = fs.existsSync(keysFile) ? keysFile : '';
  return loadJsonSecretPayload({
    directJson: process.env.RELAYER_EVM_KEYS_JSON,
    secretRef: process.env.RELAYER_EVM_KEYS_SECRET_REF,
    filePath,
    csv: process.env.RELAYER_EVM_PRIVATE_KEYS,
    csvField: 'relayEvmPrivateKeys',
  });
}

export async function loadLocalEvmRelaySigners({ relayerId, relayIndexFromEnv, defaultKeysFile }) {
  const singlePrivateKey =
    process.env.RELAYER_EVM_PRIVATE_KEY?.trim() ||
    (process.env.RELAYER_EVM_PRIVATE_KEY_SECRET_REF?.trim()
      ? (await loadSecretString(process.env.RELAYER_EVM_PRIVATE_KEY_SECRET_REF)).trim()
      : '');

  if (singlePrivateKey) {
    if (relayIndexFromEnv == null) {
      throw new Error('RELAYER_INDEX is required in single-relayer mode.');
    }
    const wallet = new ethers.Wallet(singlePrivateKey);
    return [
      {
        relayIndex: relayIndexFromEnv,
        relayerId,
        signerId: wallet.address,
        signerPubKeyHex: wallet.signingKey.publicKey,
        signDigestHex: (digestHex) => wallet.signingKey.sign(digestHex).serialized,
      },
    ];
  }

  const payload = await loadRelayKeyPayload(defaultKeysFile);
  if (!payload) return [];

  const keys =
    (Array.isArray(payload.relayEvmPrivateKeys) ? payload.relayEvmPrivateKeys : null) ??
    (Array.isArray(payload.relayPrivateKeys) ? payload.relayPrivateKeys : []);
  const payloadStartIndex =
    payload?.startIndex != null && Number.isInteger(Number(payload.startIndex))
      ? Number(payload.startIndex)
      : null;
  const indexOffset =
    payloadStartIndex != null ? payloadStartIndex : keys.length === 1 && relayIndexFromEnv != null ? relayIndexFromEnv : 0;

  return keys.map((key, position) => {
    const relayIndex = indexOffset + position;
    const wallet = new ethers.Wallet(String(key).trim());
    return {
      relayIndex,
      relayerId,
      signerId: wallet.address,
      signerPubKeyHex: wallet.signingKey.publicKey,
      signDigestHex: (digestHex) => wallet.signingKey.sign(digestHex).serialized,
    };
  });
}
