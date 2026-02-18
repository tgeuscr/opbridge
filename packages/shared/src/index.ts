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

export const ASSET_CONFIGS: AssetConfig[] = [
  { symbol: 'USDT', assetId: 0, decimals: 6 },
  { symbol: 'WBTC', assetId: 1, decimals: 8 },
  { symbol: 'ETH', assetId: 2, decimals: 18 },
  { symbol: 'PAXG', assetId: 3, decimals: 18 },
];

export const SUPPORTED_ASSETS: SupportedAsset[] = ASSET_CONFIGS.map((asset) => asset.symbol);
