import { createHash } from 'node:crypto';
import { canonicalPayloadForEthereumDeposit, type RelayerProtocolConfig } from './protocol';
import { InMemoryRelayStore } from './store';
import type {
  EthereumDepositObservation,
  PendingAttestation,
  RelayerStateSnapshot,
} from './types';

export interface RelayerRuntime {
  ingestEthereumDeposit: (observation: EthereumDepositObservation) => PendingAttestation | null;
  listPendingAttestations: () => PendingAttestation[];
  snapshot: () => RelayerStateSnapshot;
}

export const startRelayer = (config: RelayerProtocolConfig): RelayerRuntime => {
  const store = new InMemoryRelayStore();

  const ingestEthereumDeposit = (
    observation: EthereumDepositObservation,
  ): PendingAttestation | null => {
    const observationId = `${observation.txHash}:${observation.logIndex}`;
    const isNew = store.markObserved(observationId);
    if (!isNew) return null;

    const canonicalPayload = canonicalPayloadForEthereumDeposit(observation, config);
    const payloadHashHex = `0x${createHash('sha256').update(canonicalPayload).digest('hex')}`;

    const attestation: PendingAttestation = {
      observationId,
      message: {
        version: 1,
        direction: 1,
        ethereumVault: config.ethereumVault,
        opnetBridge: config.opnetBridge,
        ethereumUser: observation.depositor,
        opnetUser: observation.opnetRecipient,
        assetId: observation.assetId,
        amount: observation.amount.toString(),
        nonce: observation.depositId.toString(),
      },
      canonicalPayload,
      payloadHashHex,
      signerIds: [],
    };

    store.upsertPending(attestation);
    return attestation;
  };

  return {
    ingestEthereumDeposit,
    listPendingAttestations: () => store.listPending(),
    snapshot: () => ({
      observations: store.observationCount(),
      pendingAttestations: store.listPending().length,
    }),
  };
};
