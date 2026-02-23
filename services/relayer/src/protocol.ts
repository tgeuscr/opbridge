import {
  MESSAGE_PROTOCOL_VERSION,
  canonicalizeBridgeMessage,
  type BridgeMessageV1,
} from '@heptad/shared';
import type { EthereumDepositObservation } from './types';

export interface RelayerProtocolConfig {
  ethereumVault: string;
  opnetBridge: string;
}

export function buildMessageFromEthereumDeposit(
  observation: EthereumDepositObservation,
  config: RelayerProtocolConfig,
): BridgeMessageV1 {
  return {
    version: MESSAGE_PROTOCOL_VERSION,
    direction: 1,
    ethereumVault: config.ethereumVault,
    opnetBridge: config.opnetBridge,
    ethereumUser: observation.depositor,
    opnetUser: observation.opnetRecipient,
    assetId: observation.assetId,
    amount: observation.amount.toString(),
    nonce: observation.depositId.toString(),
  };
}

export function canonicalPayloadForEthereumDeposit(
  observation: EthereumDepositObservation,
  config: RelayerProtocolConfig,
): string {
  return canonicalizeBridgeMessage(buildMessageFromEthereumDeposit(observation, config));
}
