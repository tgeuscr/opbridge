import process from 'node:process';
import { loadLocalOpnetRelaySigners } from './opnet-local-signer.mjs';
import { loadKmsOpnetRelaySigners } from './opnet-kms-signer.mjs';
import { loadLocalEvmRelaySigners } from './evm-local-signer.mjs';
import { loadKmsEvmRelaySigners } from './evm-kms-signer.mjs';

function parseRelayIndexFromEnv() {
  const relayIndexFromEnvRaw = process.env.RELAYER_INDEX?.trim();
  return relayIndexFromEnvRaw && /^\d+$/.test(relayIndexFromEnvRaw) ? Number(relayIndexFromEnvRaw) : null;
}

export async function loadOpnetRelaySigners({ relayerId, opnetNetwork, defaultKeysFile }) {
  const relayIndexFromEnv = parseRelayIndexFromEnv();
  const mode = (process.env.RELAYER_SIGNER_MODE?.trim() || '').toLowerCase();
  if (mode === 'kms') {
    return loadKmsOpnetRelaySigners({ relayerId, relayIndexFromEnv, opnetNetwork });
  }
  return loadLocalOpnetRelaySigners({ relayerId, relayIndexFromEnv, opnetNetwork, defaultKeysFile });
}

export async function loadEvmRelaySigners({ relayerId, defaultKeysFile }) {
  const relayIndexFromEnv = parseRelayIndexFromEnv();
  const mode = (process.env.RELAYER_EVM_SIGNER_MODE?.trim() || '').toLowerCase();
  if (mode === 'kms') {
    return loadKmsEvmRelaySigners({ relayerId, relayIndexFromEnv });
  }
  return loadLocalEvmRelaySigners({ relayerId, relayIndexFromEnv, defaultKeysFile });
}
