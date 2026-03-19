import process from 'node:process';
import { loadKmsOpnetRelaySigners } from './opnet-kms-signer.mjs';
import { loadKmsEvmRelaySigners } from './evm-kms-signer.mjs';

function parseRelayIndexFromEnv() {
  const relayIndexFromEnvRaw = process.env.RELAYER_INDEX?.trim();
  return relayIndexFromEnvRaw && /^\d+$/.test(relayIndexFromEnvRaw) ? Number(relayIndexFromEnvRaw) : null;
}

function normalizeMode(rawMode, envName) {
  const mode = (rawMode?.trim() || 'kms').toLowerCase();
  if (mode !== 'kms') {
    throw new Error(`Only KMS signer mode is supported. Set ${envName}=kms.`);
  }
}

export async function loadOpnetRelaySigners({ relayerId, opnetNetwork }) {
  const relayIndexFromEnv = parseRelayIndexFromEnv();
  normalizeMode(process.env.RELAYER_SIGNER_MODE, 'RELAYER_SIGNER_MODE');
  return loadKmsOpnetRelaySigners({ relayerId, relayIndexFromEnv, opnetNetwork });
}

export async function loadEvmRelaySigners({ relayerId }) {
  const relayIndexFromEnv = parseRelayIndexFromEnv();
  normalizeMode(process.env.RELAYER_EVM_SIGNER_MODE, 'RELAYER_EVM_SIGNER_MODE');
  return loadKmsEvmRelaySigners({ relayerId, relayIndexFromEnv });
}
