import type { BridgeMessageV1 } from '@opbridge/shared';

export interface EthereumDepositObservation {
  depositId: bigint;
  assetId: number;
  depositor: string;
  amount: bigint;
  opnetRecipient: string;
  blockNumber: bigint;
  txHash: string;
  logIndex: number;
}

export interface PendingAttestation {
  observationId: string;
  message: BridgeMessageV1;
  canonicalPayload: string;
  payloadHashHex: string;
  signerIds: string[];
}

export interface RelayerStateSnapshot {
  observations: number;
  pendingAttestations: number;
}
