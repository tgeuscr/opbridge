import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { Address } from '@btc-vision/transaction';
import { decodeSpkiBitString, deriveEthereumAddressFromSpki, kmsGetPublicKey } from './aws-kms-utils.mjs';
import { bytesToHex, concatBytes } from './byte-utils.mjs';
import { MLDSA_PUBKEY_BYTES } from './relay-key-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../../..');
const DEFAULT_OUTPUT_FILE = path.join(REPO_ROOT, 'services/relayer/.data/relay-public-config.json');

function parseCsvEnv(name, { required = false } = {}) {
  const raw = process.env[name]?.trim() || '';
  const values = raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
  if (required && values.length === 0) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return values;
}

function normalizeNetworkName(raw) {
  return String(raw || 'testnet').trim().toLowerCase();
}

function thresholdSuggestion(relayCount) {
  if (relayCount <= 1) return relayCount;
  return Math.min(2, relayCount);
}

async function loadMldsaRelayRows(mldsaKeyIds) {
  const rows = [];
  for (const [relayIndex, keyId] of mldsaKeyIds.entries()) {
    const publicKeyResponse = await kmsGetPublicKey(keyId);
    const spkiDer = Buffer.from(String(publicKeyResponse.PublicKey), 'base64');
    const publicKey = decodeSpkiBitString(new Uint8Array(spkiDer));
    if (publicKey.length !== MLDSA_PUBKEY_BYTES) {
      throw new Error(
        `KMS key ${keyId} returned ML-DSA public key length ${publicKey.length}; expected ${MLDSA_PUBKEY_BYTES}.`,
      );
    }

    rows.push({
      relayIndex,
      kmsKeyId: keyId,
      relayId: new Address(publicKey).toHex(),
      mldsaPublicKeyHex: bytesToHex(publicKey),
      mldsaPublicKeyHashHex: bytesToHex(createHash('sha256').update(publicKey).digest()),
    });
  }
  return rows;
}

async function loadEthereumAddresses(evmKeyIds, relayCount) {
  if (evmKeyIds.length === 0) return new Map();
  if (evmKeyIds.length !== relayCount) {
    throw new Error(
      `RELAYER_EVM_KMS_KEY_IDS count (${evmKeyIds.length}) must match RELAYER_KMS_KEY_IDS count (${relayCount}).`,
    );
  }

  const entries = await Promise.all(
    evmKeyIds.map(async (keyId, relayIndex) => {
      const publicKeyResponse = await kmsGetPublicKey(keyId);
      const spkiDer = Buffer.from(String(publicKeyResponse.PublicKey), 'base64');
      return [
        relayIndex,
        {
          kmsKeyId: keyId,
          ethereumAddress: deriveEthereumAddressFromSpki(new Uint8Array(spkiDer)),
          ethereumPublicKey: bytesToHex(decodeSpkiBitString(new Uint8Array(spkiDer))),
        },
      ];
    }),
  );
  return new Map(entries);
}

function buildPayload({ opnetNetworkName, relayRows, evmRows }) {
  return {
    generatedAt: new Date().toISOString(),
    generatedFrom: 'aws-kms',
    opnetNetwork: opnetNetworkName,
    relayCount: relayRows.length,
    relayThresholdSuggested: thresholdSuggestion(relayRows.length),
    relayPubKeysPackedHex: bytesToHex(
      concatBytes(relayRows.map((row) => Buffer.from(row.mldsaPublicKeyHex.slice(2), 'hex'))),
    ),
    relays: relayRows.map((row) => {
      const evm = evmRows.get(row.relayIndex);
      return {
        relayIndex: row.relayIndex,
        opnetRelayId: row.relayId,
        opnetKmsKeyId: row.kmsKeyId,
        mldsaPublicKeyHex: row.mldsaPublicKeyHex,
        mldsaPublicKeyHashHex: row.mldsaPublicKeyHashHex,
        ethereumAddress: evm?.ethereumAddress,
        ethereumPublicKey: evm?.ethereumPublicKey,
        ethereumKmsKeyId: evm?.kmsKeyId,
      };
    }),
  };
}

async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`Generate relay-public-config.json from AWS KMS keys

Required:
  RELAYER_KMS_KEY_IDS          comma-separated ML-DSA KMS key IDs/ARNs in relay index order

Optional:
  RELAYER_EVM_KMS_KEY_IDS      comma-separated ECDSA KMS key IDs/ARNs in relay index order
  RELAYER_PUBLIC_CONFIG_FILE   output path (default: ${DEFAULT_OUTPUT_FILE})
  OPNET_NETWORK                metadata only (default: testnet)

Output:
  Writes relayPubKeysPackedHex and per-relay metadata for use with scripts/addpubkeystobridge.sh
`);
    return;
  }

  const mldsaKeyIds = parseCsvEnv('RELAYER_KMS_KEY_IDS', { required: true });
  const evmKeyIds = parseCsvEnv('RELAYER_EVM_KMS_KEY_IDS');
  const opnetNetworkName = normalizeNetworkName(process.env.OPNET_NETWORK);
  const outputFile = process.env.RELAYER_PUBLIC_CONFIG_FILE?.trim() || DEFAULT_OUTPUT_FILE;

  const relayRows = await loadMldsaRelayRows(mldsaKeyIds);
  const evmRows = await loadEthereumAddresses(evmKeyIds, relayRows.length);
  const payload = buildPayload({ opnetNetworkName, relayRows, evmRows });

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ outputFile, relayCount: payload.relayCount, generatedFrom: payload.generatedFrom }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
