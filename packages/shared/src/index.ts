export type SupportedAsset = string;

export type AssetConfig = {
  symbol: string;
  assetId: number;
  decimals: number;
};

export type BridgeDirection = 'ETHEREUM_TO_OPNET' | 'OPNET_TO_ETHEREUM';

export interface BridgeIntent {
  direction: BridgeDirection;
  asset: SupportedAsset;
  amount: string;
  destinationAddress: string;
  sourceAddress: string;
}

export const MESSAGE_PROTOCOL_VERSION = 1 as const;

export type BridgeDirectionCode = 1 | 2;

export interface BridgeMessageV1 {
  version: typeof MESSAGE_PROTOCOL_VERSION;
  direction: BridgeDirectionCode;
  ethereumVault: string;
  opnetBridge: string;
  ethereumUser: string;
  opnetUser: string;
  assetId: number;
  amount: string;
  nonce: string;
}

export function toBridgeDirectionCode(direction: BridgeDirection): BridgeDirectionCode {
  return direction === 'ETHEREUM_TO_OPNET' ? 1 : 2;
}

export function canonicalizeBridgeMessage(message: BridgeMessageV1): string {
  return [
    `v=${message.version}`,
    `vault=${message.ethereumVault.toLowerCase()}`,
    `bridge=${message.opnetBridge.toLowerCase()}`,
    `ethUser=${message.ethereumUser.toLowerCase()}`,
    `opUser=${message.opnetUser.toLowerCase()}`,
    `asset=${message.assetId}`,
    `amount=${message.amount}`,
    `d=${message.direction}`,
    `nonce=${message.nonce}`,
  ].join('|');
}

export const ASSET_CONFIGS: AssetConfig[] = [
  { symbol: 'USDT', assetId: 0, decimals: 6 },
  { symbol: 'WBTC', assetId: 1, decimals: 8 },
  { symbol: 'ETH', assetId: 2, decimals: 18 },
  { symbol: 'PAXG', assetId: 3, decimals: 18 },
];

export const SUPPORTED_ASSETS: SupportedAsset[] = ASSET_CONFIGS.map((asset) => asset.symbol);
