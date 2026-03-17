import fs from 'node:fs';
import process from 'node:process';
import { Address, MLDSASecurityLevel, QuantumBIP32Factory } from '@btc-vision/transaction';
import { loadJsonSecretPayload, loadSecretString } from '../secret-provider.mjs';
import { hexToBytes } from '../byte-utils.mjs';

const ZERO_CHAIN_CODE = new Uint8Array(32);
const DEFAULT_KEYS_FILE = 'services/relayer/.data/relay-keys.json';

function parseMldsaPrivateKey(raw) {
  const value = String(raw ?? '').trim();
  if (!value) {
    throw new Error('Relay private key is required.');
  }

  const keyBytes = hexToBytes(value);
  const mldsa44PrivateSize = 2560;
  const mldsa44PrivatePlusPublicSize = 3872;
  if (keyBytes.length === mldsa44PrivateSize) {
    return keyBytes;
  }
  if (keyBytes.length === mldsa44PrivatePlusPublicSize) {
    return keyBytes.slice(0, mldsa44PrivateSize);
  }
  throw new Error(
    `Relay private key has invalid size (${keyBytes.length} bytes). Expected ${mldsa44PrivateSize} or ${mldsa44PrivatePlusPublicSize}.`,
  );
}

function buildRelaySigner(rawKey, relayIndex, relayerId, opnetNetwork) {
  const privateKey = parseMldsaPrivateKey(rawKey);
  const signer = QuantumBIP32Factory.fromPrivateKey(
    privateKey,
    ZERO_CHAIN_CODE,
    opnetNetwork,
    MLDSASecurityLevel.LEVEL2,
  );
  const publicKey = new Uint8Array(signer.publicKey);
  const signerId = new Address(publicKey).toHex();
  return {
    relayIndex,
    relayerId,
    signerId,
    publicKey,
    sign: (messageHashBytes) => signer.sign(messageHashBytes),
  };
}

async function loadRelayKeyPayload(defaultKeysFile) {
  const keysFile = process.env.RELAYER_KEYS_FILE?.trim() || defaultKeysFile || DEFAULT_KEYS_FILE;
  const filePath = fs.existsSync(keysFile) ? keysFile : '';
  return loadJsonSecretPayload({
    directJson: process.env.RELAYER_KEYS_JSON,
    secretRef: process.env.RELAYER_KEYS_SECRET_REF,
    filePath,
    csv: process.env.RELAYER_PRIVATE_KEYS,
    csvField: 'relayPrivateKeys',
  });
}

export async function loadLocalOpnetRelaySigners({ relayerId, relayIndexFromEnv, opnetNetwork, defaultKeysFile }) {
  const singlePrivateKey =
    process.env.RELAYER_PRIVATE_KEY?.trim() ||
    (process.env.RELAYER_PRIVATE_KEY_SECRET_REF?.trim()
      ? (await loadSecretString(process.env.RELAYER_PRIVATE_KEY_SECRET_REF)).trim()
      : '');

  if (singlePrivateKey) {
    if (relayIndexFromEnv == null) {
      throw new Error('RELAYER_INDEX is required in single-relayer mode (RELAYER_PRIVATE_KEY).');
    }
    if (!Number.isInteger(relayIndexFromEnv) || relayIndexFromEnv < 0 || relayIndexFromEnv > 255) {
      throw new Error('RELAYER_INDEX must be an integer in [0,255].');
    }
    return [buildRelaySigner(singlePrivateKey, relayIndexFromEnv, relayerId, opnetNetwork)];
  }

  const payload = await loadRelayKeyPayload(defaultKeysFile);
  if (!payload) return [];

  const keys = Array.isArray(payload.relayPrivateKeys) ? payload.relayPrivateKeys : [];
  const payloadStartIndex =
    payload?.startIndex != null && Number.isInteger(Number(payload.startIndex))
      ? Number(payload.startIndex)
      : null;
  const indexOffset =
    payloadStartIndex != null ? payloadStartIndex : keys.length === 1 && relayIndexFromEnv != null ? relayIndexFromEnv : 0;

  return keys
    .map((raw, position) => buildRelaySigner(raw, indexOffset + position, relayerId, opnetNetwork))
    .filter(Boolean);
}
