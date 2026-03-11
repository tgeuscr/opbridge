import { SupportedWallets, useWalletConnect } from '@btc-vision/walletconnect';
import { networks } from '@btc-vision/bitcoin';
import { Address, UnisatSigner } from '@btc-vision/transaction';
import { ABIDataTypes, BitcoinAbiTypes, OP_NET_ABI, getContract } from 'opnet';
import { useEffect, useState } from 'react';

type EthereumProvider = {
  isMetaMask?: boolean;
  isRabby?: boolean;
  providers?: EthereumProvider[];
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

type EthereumWindow = Window & {
  ethereum?: EthereumProvider;
  rabby?: EthereumProvider;
};

const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7';
const SEPOLIA_CHAIN_ID_DEC = 11155111;
const OPSCANN_TX_BASE_URL = 'https://opscan.org/transactions/';
const DEFAULT_STATUS_API_URL = import.meta.env.VITE_STATUS_API_URL?.trim() || '';
const OPNET_BRIDGE_ADDRESS = import.meta.env.VITE_OPNET_BRIDGE_ADDRESS?.trim() || '';
const ETH_GAS_LIMIT_CAP = Number(import.meta.env.VITE_ETHEREUM_GAS_LIMIT_CAP?.trim() || '15000000');
const ETH_GAS_FALLBACK = BigInt(import.meta.env.VITE_ETHEREUM_GAS_FALLBACK?.trim() || '800000');
const OPNET_FEE_RATE = Number(import.meta.env.VITE_OPNET_FEE_RATE?.trim() || '2');
const OPNET_MAX_SAT_SPEND = BigInt(import.meta.env.VITE_OPNET_MAX_SAT_SPEND?.trim() || '20000');
const ERC20_APPROVE_SELECTOR = '0x095ea7b3';
const ERC20_BALANCE_OF_SELECTOR = '0x70a08231';
const TEST_TOKEN_CLAIM_SELECTOR = '0x4e71d92d';
const TEST_TOKEN_CLAIM_AMOUNT_SELECTOR = '0x830953ab';
const TEST_TOKEN_CLAIM_COOLDOWN_SELECTOR = '0xfdea3657';
const TEST_TOKEN_CLAIMABLE_AT_SELECTOR = '0x37adc2d2';
const TEST_TOKEN_FAUCET_ENABLED_SELECTOR = '0x5d1c3f04';
const VAULT_DEPOSIT_ERC20_SELECTOR = '0x1eaa9083';
const VAULT_RELEASE_SELECTOR = '0x82c19770';

const ETH_VAULT_ADDRESS = import.meta.env.VITE_ETHEREUM_VAULT_ADDRESS?.trim() || '';
const ETH_TOKEN_ADDRESSES = {
  USDT: import.meta.env.VITE_ETHEREUM_USDT_ADDRESS?.trim() || '',
  WBTC: import.meta.env.VITE_ETHEREUM_WBTC_ADDRESS?.trim() || '',
  WETH: import.meta.env.VITE_ETHEREUM_WETH_ADDRESS?.trim() || '',
  PAXG: import.meta.env.VITE_ETHEREUM_PAXG_ADDRESS?.trim() || '',
} as const;
const OPNET_TOKEN_ADDRESSES = {
  USDT: import.meta.env.VITE_OPNET_USDT_ADDRESS?.trim() || '',
  WBTC: import.meta.env.VITE_OPNET_WBTC_ADDRESS?.trim() || '',
  WETH: import.meta.env.VITE_OPNET_WETH_ADDRESS?.trim() || '',
  PAXG: import.meta.env.VITE_OPNET_PAXG_ADDRESS?.trim() || '',
} as const;

const ETH_ASSET_CONFIG = {
  USDT: { assetId: 0, decimals: 6 },
  WBTC: { assetId: 1, decimals: 8 },
  WETH: { assetId: 2, decimals: 18 },
  PAXG: { assetId: 3, decimals: 18 },
} as const;
const UX_GUIDE_DISMISSED_KEY = 'heptad.site.uxGuideDismissed.v1';
const THEME_MODE_KEY = 'heptad.site.themeMode.v1';

type AssetSymbol = keyof typeof ETH_ASSET_CONFIG;
const ASSET_OPTIONS: Array<{ symbol: AssetSymbol; logo: string; alt: string }> = [
  { symbol: 'USDT', logo: '/branding/usdt.svg', alt: 'Tether USD' },
  { symbol: 'WBTC', logo: '/branding/btc.svg', alt: 'Wrapped Bitcoin' },
  { symbol: 'WETH', logo: '/branding/eth.svg', alt: 'Wrapped Ether' },
  { symbol: 'PAXG', logo: '/branding/paxg.svg', alt: 'PAX Gold' },
];
type BridgeDirection = 'ethToBtc' | 'btcToEth';
type EvmWalletType = 'metamask' | 'rabby';
type BridgeConfirmState = {
  direction: BridgeDirection;
  asset: AssetSymbol;
  amountText: string;
  receivedText: string;
  fromAddress: string;
  toAddress: string;
};

type FaucetAssetState = {
  balanceRaw: bigint | null;
  claimAmountRaw: bigint | null;
  claimCooldownSec: bigint | null;
  claimableAtSec: bigint | null;
  faucetEnabled: boolean | null;
  error?: string;
};

type OpnetAssetBalanceState = {
  balanceRaw: bigint | null;
  error?: string;
};

type MintSubmission = {
  assetId?: number | string;
  ethereumUser?: string;
  recipient?: string;
  amount?: string;
  nonce?: string;
  attestationVersion?: number | string;
  relayIndexesPackedHex?: string;
  relaySignaturesPackedHex?: string;
};

type MintCandidate = {
  depositId?: string;
  ready?: boolean;
  status?: string;
  state?: string;
  processed?: boolean | number | string;
  message?: Record<string, unknown> | null;
  mintSubmission?: MintSubmission;
};

type ReleaseSubmission = {
  assetId?: number | string;
  opnetUser?: string;
  recipient?: string;
  amount?: string;
  withdrawalId?: string;
  attestationVersion?: number | string;
  relayIndexesPackedHex?: string;
  relaySignaturesPackedHex?: string;
};

type ReleaseCandidate = {
  withdrawalId?: string;
  status?: string;
  state?: string;
  processed?: boolean | number | string;
  message?: Record<string, unknown> | null;
  releaseSubmission?: ReleaseSubmission;
};

const BRIDGE_BURN_ABI = [
  {
    name: 'requestBurn',
    inputs: [
      { name: 'asset', type: ABIDataTypes.UINT8 },
      { name: 'from', type: ABIDataTypes.ADDRESS },
      { name: 'ethereumRecipient', type: ABIDataTypes.ADDRESS },
      { name: 'amount', type: ABIDataTypes.UINT256 },
    ],
    outputs: [],
    type: BitcoinAbiTypes.Function,
  },
];

const BRIDGE_MINT_ABI = [
  {
    name: 'mintWithRelaySignatures',
    inputs: [
      { name: 'asset', type: ABIDataTypes.UINT8 },
      { name: 'ethereumUser', type: ABIDataTypes.BYTES32 },
      { name: 'recipient', type: ABIDataTypes.ADDRESS },
      { name: 'amount', type: ABIDataTypes.UINT256 },
      { name: 'depositId', type: ABIDataTypes.UINT256 },
      { name: 'attestationVersion', type: ABIDataTypes.UINT8 },
      { name: 'relayIndexesPacked', type: ABIDataTypes.BYTES },
      { name: 'relaySignaturesPacked', type: ABIDataTypes.BYTES },
    ],
    outputs: [],
    type: BitcoinAbiTypes.Function,
  },
];

const OPNET_TOKEN_BALANCE_ABI = [
  {
    name: 'balanceOf',
    inputs: [{ name: 'account', type: ABIDataTypes.ADDRESS }],
    outputs: [{ name: 'balance', type: ABIDataTypes.UINT256 }],
    type: BitcoinAbiTypes.Function,
  },
  ...OP_NET_ABI,
];

function short(value?: string | null) {
  if (!value) return '-';
  if (value.length < 14) return value;
  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

function isThemeMode(value: string): value is 'light' | 'dark' {
  return value === 'light' || value === 'dark';
}

function resolveSystemTheme(): 'light' | 'dark' {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

function getEthereumProvider(targetWallet?: EvmWalletType): EthereumProvider | null {
  const { ethereum, rabby } = window as EthereumWindow;
  const providers = ethereum && Array.isArray(ethereum.providers) ? ethereum.providers : [];

  if (targetWallet === 'rabby' && rabby) {
    return rabby;
  }

  if (targetWallet === 'rabby') {
    const rabbyFromList = providers.find((provider) => provider.isRabby);
    if (rabbyFromList) return rabbyFromList;
    if (ethereum?.isRabby) return ethereum;
    return null;
  }

  if (targetWallet === 'metamask') {
    const strictMetaMask = providers.find((provider) => provider.isMetaMask && !provider.isRabby && provider !== rabby);
    if (strictMetaMask) return strictMetaMask;

    const relaxedMetaMask = providers.find((provider) => provider.isMetaMask && provider !== rabby);
    if (relaxedMetaMask) return relaxedMetaMask;

    const firstNonRabby = providers.find((provider) => !provider.isRabby && provider !== rabby);
    if (firstNonRabby) return firstNonRabby;

    if (ethereum && ethereum !== rabby && !ethereum.isRabby) return ethereum;
    if (ethereum?.isMetaMask && ethereum !== rabby) return ethereum;
    return null;
  }

  if (providers.length > 0) return providers[0] ?? null;
  if (ethereum) return ethereum;
  return rabby ?? null;
}

function isChainMissingError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const row = error as { code?: unknown; message?: unknown };
  const code = Number(row.code);
  const message = String(row.message ?? '').toLowerCase();
  return code === 4902 || message.includes('unrecognized chain') || message.includes('chain not added');
}

function padHexToBytes(hexWithoutPrefix: string, bytes: number): string {
  if (hexWithoutPrefix.length > bytes * 2) {
    throw new Error(`Hex value exceeds ${bytes} bytes.`);
  }
  return hexWithoutPrefix.padStart(bytes * 2, '0');
}

function normalizeEthereumAddress(raw: string, fieldName: string): string {
  const value = raw.trim();
  if (!/^0x[0-9a-fA-F]{40}$/.test(value)) {
    throw new Error(`${fieldName} must be a valid 20-byte hex address.`);
  }
  return value;
}

function normalizeBytes32Hex(raw: string, fieldName: string): string {
  const value = raw.trim();
  const normalized = value.startsWith('0x') ? value.slice(2) : value;
  if (!/^[0-9a-fA-F]{64}$/.test(normalized)) {
    throw new Error(`${fieldName} must be a 32-byte hex value.`);
  }
  return `0x${normalized.toLowerCase()}`;
}

function encodeAddressWord(address: string): string {
  return padHexToBytes(address.replace(/^0x/, '').toLowerCase(), 32);
}

function encodeUintWord(value: bigint | number): string {
  const n = typeof value === 'number' ? BigInt(value) : value;
  if (n < 0n) throw new Error('Unsigned integer cannot be negative.');
  return padHexToBytes(n.toString(16), 32);
}

function encodeBytes32Word(value: string): string {
  return normalizeBytes32Hex(value, 'bytes32').replace(/^0x/, '');
}

function encodeBytesWord(raw: string, fieldName: string): string {
  const bytes = hexToBytes(raw, fieldName);
  const lengthWord = encodeUintWord(bytes.length);
  const dataHex = Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  const remainder = dataHex.length % 64;
  const paddedData = remainder === 0 ? dataHex : `${dataHex}${'0'.repeat(64 - remainder)}`;
  return `${lengthWord}${paddedData}`;
}

function buildApproveCalldata(spender: string, amount: bigint): string {
  return `${ERC20_APPROVE_SELECTOR}${encodeAddressWord(spender)}${encodeUintWord(amount)}`;
}

function buildBalanceOfCalldata(account: string): string {
  return `${ERC20_BALANCE_OF_SELECTOR}${encodeAddressWord(account)}`;
}

function buildClaimableAtCalldata(account: string): string {
  return `${TEST_TOKEN_CLAIMABLE_AT_SELECTOR}${encodeAddressWord(account)}`;
}

function buildDepositErc20Calldata(assetId: number, amount: bigint, recipient: string): string {
  return `${VAULT_DEPOSIT_ERC20_SELECTOR}${encodeUintWord(assetId)}${encodeUintWord(amount)}${encodeBytes32Word(recipient)}`;
}

function buildReleaseCalldata(params: {
  assetId: number;
  opnetUser: string;
  recipient: string;
  amount: bigint;
  withdrawalId: bigint;
  attestationVersion: number;
  relayIndexesPackedHex: string;
  relaySignaturesPackedHex: string;
}): string {
  const relayIndexesWord = encodeBytesWord(params.relayIndexesPackedHex, 'releaseSubmission.relayIndexesPackedHex');
  const relaySignaturesWord = encodeBytesWord(params.relaySignaturesPackedHex, 'releaseSubmission.relaySignaturesPackedHex');

  const headWordCount = 8;
  const relayIndexesOffset = BigInt(headWordCount * 32);
  const relaySignaturesOffset = relayIndexesOffset + BigInt(relayIndexesWord.length / 2);

  return (
    `${VAULT_RELEASE_SELECTOR}` +
    `${encodeUintWord(params.assetId)}` +
    `${encodeBytes32Word(params.opnetUser)}` +
    `${encodeAddressWord(params.recipient)}` +
    `${encodeUintWord(params.amount)}` +
    `${encodeUintWord(params.withdrawalId)}` +
    `${encodeUintWord(params.attestationVersion)}` +
    `${encodeUintWord(relayIndexesOffset)}` +
    `${encodeUintWord(relaySignaturesOffset)}` +
    `${relayIndexesWord}` +
    `${relaySignaturesWord}`
  );
}

function ethereumAddressToAddressWord(raw: string): Address {
  const value = normalizeEthereumAddress(raw, 'Ethereum recipient');
  const padded = `0x${padHexToBytes(value.replace(/^0x/, ''), 32)}`;
  return Address.fromBigInt(BigInt(padded));
}

function parseHumanAmount(raw: string, decimals: number): bigint {
  const value = raw.trim();
  if (!value) throw new Error('Amount is required.');
  if (!/^\d+(\.\d+)?$/.test(value)) throw new Error('Amount must be a positive decimal number.');
  const [whole, fraction = ''] = value.split('.');
  if (fraction.length > decimals) {
    throw new Error(`Amount has too many decimal places (max ${decimals}).`);
  }
  const scaled = `${whole}${fraction.padEnd(decimals, '0')}`;
  const normalized = scaled.replace(/^0+/, '') || '0';
  return BigInt(normalized);
}

function formatTokenAmount(raw: bigint, decimals: number): string {
  const base = 10n ** BigInt(decimals);
  const whole = raw / base;
  const fraction = raw % base;
  if (fraction === 0n) return whole.toString();
  const fractionText = fraction.toString().padStart(decimals, '0').replace(/0+$/, '');
  return `${whole.toString()}.${fractionText}`;
}

function formatOpnetTicker(symbol: AssetSymbol): string {
  return `h${symbol}`;
}

function buildOpscanTxUrl(txid: string): string {
  const normalized = txid.trim().replace(/^0x/i, '');
  return `${OPSCANN_TX_BASE_URL}${encodeURIComponent(normalized)}?network=op_testnet`;
}

function formatDurationShort(totalSeconds: bigint): string {
  if (totalSeconds <= 0n) return '0s';
  const day = 86400n;
  const hour = 3600n;
  const minute = 60n;

  if (totalSeconds % day === 0n) return `${(totalSeconds / day).toString()}d`;
  if (totalSeconds % hour === 0n) return `${(totalSeconds / hour).toString()}h`;
  if (totalSeconds % minute === 0n) return `${(totalSeconds / minute).toString()}m`;
  return `${totalSeconds.toString()}s`;
}

function symbolForAssetId(assetId: number): AssetSymbol | null {
  const entries = Object.entries(ETH_ASSET_CONFIG) as Array<[AssetSymbol, { assetId: number; decimals: number }]>;
  const match = entries.find(([, cfg]) => cfg.assetId === assetId);
  return match?.[0] ?? null;
}

function formatCandidateAmount(assetIdRaw: unknown, amountRaw: unknown): string {
  const assetId = Number(assetIdRaw);
  const amount = BigInt(String(amountRaw ?? '0'));
  if (!Number.isInteger(assetId) || amount <= 0n) return String(amountRaw ?? '-');
  const symbol = symbolForAssetId(assetId);
  if (!symbol) return amount.toString();
  return `${formatTokenAmount(amount, ETH_ASSET_CONFIG[symbol].decimals)} ${symbol}`;
}

function formatMintClaimAmount(assetIdRaw: unknown, amountRaw: unknown): string {
  const base = formatCandidateAmount(assetIdRaw, amountRaw);
  const parts = base.split(' ');
  if (parts.length !== 2) return base;
  const [amount, symbol] = parts;
  if (!Object.hasOwn(ETH_ASSET_CONFIG, symbol)) return base;
  return `${amount} h${symbol}`;
}

function parseEvmUint256Result(raw: unknown, fieldName: string): bigint {
  const value = String(raw ?? '').trim();
  if (!/^0x[0-9a-fA-F]+$/.test(value)) {
    throw new Error(`${fieldName} returned invalid hex.`);
  }
  return BigInt(value);
}

function parseUintResult(raw: unknown, fieldName: string): bigint {
  if (typeof raw === 'bigint') return raw;
  if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0) return BigInt(Math.trunc(raw));
  if (typeof raw === 'string') {
    const value = raw.trim();
    if (/^0x[0-9a-fA-F]+$/.test(value) || /^\d+$/.test(value)) return BigInt(value);
  }
  if (Array.isArray(raw) && raw.length > 0) {
    return parseUintResult(raw[0], fieldName);
  }

  if (raw && typeof raw === 'object') {
    const row = raw as Record<string, unknown>;
    for (const key of ['balance', 'value', 'result', 'amount', '0', '_hex', 'hex']) {
      if (Object.hasOwn(row, key)) {
        try {
          return parseUintResult(row[key], fieldName);
        } catch {
          // Continue to other keys before failing.
        }
      }
    }

    if (typeof (row as { toString?: unknown }).toString === 'function') {
      try {
        const text = (row as { toString: () => string }).toString().trim();
        if (/^0x[0-9a-fA-F]+$/.test(text) || /^\d+$/.test(text)) return BigInt(text);
      } catch {
        // Fall through to error below.
      }
    }
  }

  throw new Error(`${fieldName} returned invalid uint result.`);
}

function toHexQuantity(value: bigint): string {
  if (value < 0n) throw new Error('Hex quantity cannot be negative.');
  return `0x${value.toString(16)}`;
}

function parseHexQuantity(raw: unknown, fieldName: string): bigint {
  const value = String(raw ?? '').trim();
  if (!/^0x[0-9a-fA-F]+$/.test(value)) {
    throw new Error(`${fieldName} must be a hex quantity.`);
  }
  return BigInt(value);
}

async function withEstimatedGasCap(
  provider: EthereumProvider,
  tx: Record<string, unknown>,
  onEstimateWarning?: (message: string) => void,
): Promise<Record<string, unknown>> {
  const cap = BigInt(Math.max(21000, ETH_GAS_LIMIT_CAP));
  const fallback = ETH_GAS_FALLBACK > cap ? cap : ETH_GAS_FALLBACK;
  let gas = fallback;

  try {
    const estimateRaw = await provider.request({ method: 'eth_estimateGas', params: [tx] });
    const estimated = parseHexQuantity(estimateRaw, 'eth_estimateGas');
    // 20% headroom + small fixed buffer for calldata-heavy calls.
    const padded = (estimated * 12n) / 10n + 10000n;
    gas = padded > cap ? cap : padded;
  } catch (error) {
    onEstimateWarning?.(
      `Gas estimate failed (${formatEthereumError(error)}). Using fallback gas=${fallback.toString()}.`,
    );
  }

  return { ...tx, gas: toHexQuantity(gas) };
}

function hexToBytes(raw: string, fieldName: string): Uint8Array {
  const value = raw.trim().toLowerCase();
  const normalized = value.startsWith('0x') ? value.slice(2) : value;
  if (!normalized || normalized.length % 2 !== 0 || !/^[0-9a-f]+$/.test(normalized)) {
    throw new Error(`${fieldName} must be a valid hex string.`);
  }
  const out = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = Number.parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function parseEthereumUserForMint(raw: string): Uint8Array {
  const bytes = hexToBytes(raw, 'mintSubmission.ethereumUser');
  if (bytes.length !== 20 && bytes.length !== 32) {
    throw new Error(`mintSubmission.ethereumUser must be 20 or 32 bytes; got ${bytes.length}.`);
  }
  return bytes.length === 20
    ? hexToBytes(`0x${padHexToBytes(raw.replace(/^0x/, ''), 32)}`, 'mintSubmission.ethereumUser')
    : bytes;
}

function normalizeHex(raw: string): string {
  const value = raw.trim();
  if (!value) return '';
  return value.startsWith('0x') ? value.toLowerCase() : `0x${value.toLowerCase()}`;
}

function isLikelyHex(raw: string): boolean {
  const value = normalizeHex(raw).replace(/^0x/, '');
  return value.length > 0 && value.length % 2 === 0 && /^[0-9a-f]+$/.test(value);
}

function hex32ToBigInt(raw: string, fieldName: string): bigint {
  const bytes = hexToBytes(raw, fieldName);
  if (bytes.length !== 32) {
    throw new Error(`${fieldName} must be 32 bytes; got ${bytes.length}.`);
  }
  return BigInt(normalizeHex(raw));
}

function hasValidTweakedKey(address: Address): boolean {
  try {
    const tweaked = (address as { tweakedToHex?: () => string }).tweakedToHex?.();
    if (!isLikelyHex(String(tweaked ?? ''))) return false;
    const bytes = hexToBytes(String(tweaked), 'tweakedPubkey');
    return bytes.length === 32;
  } catch {
    return false;
  }
}

function parseExpectedSenderHash(rawHash: string): string {
  const hash = rawHash.trim();
  if (!hash) {
    throw new Error('Hashed MLDSA key unavailable from OP_WALLET.');
  }
  return normalizeBytes32Hex(hash, 'Connected OP_WALLET hashed MLDSA key');
}

function tryBuildAddressFromRawInfo(
  info: unknown,
  expectedHashHex: string,
  sourceLabel: string,
): Address | null {
  if (!info || typeof info !== 'object' || Object.hasOwn(info as object, 'error')) return null;
  const row = info as Record<string, unknown>;
  const tweakedPubkeyHex = normalizeHex(String(row.tweakedPubkey ?? ''));
  const hashHex = normalizeHex(String(row.mldsaHashedPublicKey ?? ''));
  if (!isLikelyHex(tweakedPubkeyHex) || !isLikelyHex(hashHex)) return null;
  if (hashHex !== expectedHashHex) {
    throw new Error(`Resolved key hash mismatch from ${sourceLabel}: resolved=${hashHex} expected=${expectedHashHex}`);
  }
  return Address.fromBigInt(
    hex32ToBigInt(hashHex, `${sourceLabel}.mldsaHashedPublicKey`),
    hex32ToBigInt(tweakedPubkeyHex, `${sourceLabel}.tweakedPubkey`),
  );
}

async function resolveAddressWithTweaked(
  address: Address,
  provider: unknown,
  expectedHashHex: string,
  addressHint: string,
  sourceLabel: string,
): Promise<Address> {
  if (hasValidTweakedKey(address)) {
    const tweakedHex = normalizeHex((address as { tweakedToHex: () => string }).tweakedToHex());
    const normalized = Address.fromBigInt(
      hex32ToBigInt(expectedHashHex, `${sourceLabel}.expectedHashHex`),
      hex32ToBigInt(tweakedHex, `${sourceLabel}.tweakedPubkey`),
    );
    const normalizedHex = normalizeHex(typeof (normalized as { toHex?: () => string }).toHex === 'function' ? normalized.toHex() : '');
    if (normalizedHex !== expectedHashHex) {
      throw new Error(`Normalized ${sourceLabel} hash mismatch: normalized=${normalizedHex} expected=${expectedHashHex}`);
    }
    return normalized;
  }

  if (typeof (provider as { getPublicKeysInfoRaw?: unknown }).getPublicKeysInfoRaw === 'function') {
    try {
      const keys = [expectedHashHex];
      const hint = addressHint.trim();
      if (hint) keys.push(hint);
      const rpcInfoMap = await (provider as { getPublicKeysInfoRaw: (keys: string[]) => Promise<Record<string, unknown>> }).getPublicKeysInfoRaw(keys);
      const infos: unknown[] = [];
      if (rpcInfoMap && typeof rpcInfoMap === 'object') {
        if (Object.hasOwn(rpcInfoMap, expectedHashHex)) infos.push(rpcInfoMap[expectedHashHex]);
        if (hint && Object.hasOwn(rpcInfoMap, hint)) infos.push(rpcInfoMap[hint]);
        infos.push(...Object.values(rpcInfoMap));
      }
      for (const info of infos) {
        const built = tryBuildAddressFromRawInfo(info, expectedHashHex, sourceLabel);
        if (built) return built;
      }
    } catch {
      // Try RPC fallback below.
    }
  }

  if (typeof (provider as { getPublicKeyInfo?: unknown }).getPublicKeyInfo === 'function' && addressHint.trim()) {
    try {
      const resolved = await (provider as { getPublicKeyInfo: (address: string, trusted: boolean) => Promise<Address> }).getPublicKeyInfo(
        addressHint.trim(),
        false,
      );
      const resolvedHex = normalizeHex(typeof (resolved as { toHex?: () => string }).toHex === 'function' ? resolved.toHex() : '');
      if (resolvedHex === expectedHashHex && hasValidTweakedKey(resolved)) return resolved;
    } catch {
      // Hard failure below.
    }
  }

  throw new Error(`Unable to resolve Schnorr/tweaked key for ${sourceLabel}.`);
}

async function parseRecipientForMint(
  rawRecipient: string,
  connectedAddress: Address | null,
  provider: unknown,
  addressHint: string,
): Promise<Address> {
  const recipientHex = normalizeBytes32Hex(rawRecipient, 'mintSubmission.recipient');
  const hint = addressHint.trim();

  // Prefer parsing from the connected OP_WALLET address string. This yields the
  // runtime-native address form and avoids malformed Schnorr serialization edge cases.
  if (hint) {
    try {
      const hinted = Address.fromString(hint);
      const hintedHex = normalizeHex(typeof (hinted as { toHex?: () => string }).toHex === 'function' ? hinted.toHex() : '');
      if (hintedHex === recipientHex) {
        return hinted;
      }
      throw new Error(`Recipient mismatch: candidate=${recipientHex} connectedWallet=${hintedHex}`);
    } catch {
      // Fall through to existing connected/rpc resolution below.
    }
  }

  if (!connectedAddress) throw new Error('Connected OP_WALLET address is unavailable.');
  const connectedHex = normalizeHex(typeof (connectedAddress as { toHex?: () => string }).toHex === 'function' ? connectedAddress.toHex() : '');
  if (!connectedHex) throw new Error('Connected OP_WALLET address could not be serialized.');
  if (connectedHex !== recipientHex) {
    throw new Error(`Recipient mismatch: candidate=${recipientHex} connectedWallet=${connectedHex}`);
  }
  return await resolveAddressWithTweaked(connectedAddress, provider, recipientHex, addressHint, 'recipient');
}

class OPWalletSigner extends UnisatSigner {
  public override get unisat() {
    const module = (window as Window & { opnet?: unknown }).opnet;
    if (!module) {
      throw new Error('OP_WALLET extension not found');
    }
    return module as any;
  }
}

function normalizeHexBytes(raw: string, fieldName: string): string {
  const value = raw.trim();
  const normalized = value.startsWith('0x') ? value.slice(2) : value;
  if (!normalized || normalized.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(normalized)) {
    throw new Error(`${fieldName} must be valid hex bytes.`);
  }
  return `0x${normalized.toLowerCase()}`;
}

function formatEthereumError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function getAddressDebugInfo(address: Address | null): { hex: string; tweakedHex: string } {
  if (!address) return { hex: '', tweakedHex: '' };
  let hex = '';
  let tweakedHex = '';
  try {
    hex = normalizeHex(typeof (address as { toHex?: () => string }).toHex === 'function' ? address.toHex() : '');
  } catch {
    hex = '';
  }
  try {
    tweakedHex = normalizeHex(
      typeof (address as { tweakedToHex?: () => string }).tweakedToHex === 'function' ? (address as { tweakedToHex: () => string }).tweakedToHex() : '',
    );
  } catch {
    tweakedHex = '';
  }
  return { hex, tweakedHex };
}

function resolveAddressForOpnetRead(opnetAddressObject: unknown, walletAddress: string): Address | null {
  if (!opnetAddressObject) return null;

  if (
    typeof (opnetAddressObject as { equals?: unknown }).equals === 'function' &&
    typeof (opnetAddressObject as { toHex?: unknown }).toHex === 'function'
  ) {
    return opnetAddressObject as Address;
  }

  const raw = typeof (opnetAddressObject as { toHex?: () => string }).toHex === 'function'
    ? (opnetAddressObject as { toHex: () => string }).toHex()
    : String(opnetAddressObject);

  if (/^0x[0-9a-fA-F]{64}$/.test(raw)) {
    return Address.fromBigInt(BigInt(raw));
  }

  try {
    if (walletAddress.trim()) {
      return Address.fromString(walletAddress.trim());
    }
  } catch {
    // Fallback null below.
  }

  return null;
}

export function App() {
  const {
    connectToWallet,
    disconnect,
    walletAddress,
    walletType,
    publicKey,
    hashedMLDSAKey,
    network,
    connecting,
    address: opnetAddressObject,
    provider: opnetProvider,
    signer: opnetSigner,
  } = useWalletConnect();

  const [ethAddress, setEthAddress] = useState('');
  const [ethChainId, setEthChainId] = useState('');
  const [ethStatus, setEthStatus] = useState('Not connected');
  const [statusApiUrl, setStatusApiUrl] = useState(DEFAULT_STATUS_API_URL);
  const [statusApiState, setStatusApiState] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [statusApiMessage, setStatusApiMessage] = useState('No status check yet.');
  const [statusApiUpdatedAt, setStatusApiUpdatedAt] = useState('');
  const [statusApiSummary, setStatusApiSummary] = useState<Record<string, unknown> | null>(null);
  const [statusApiRelayers, setStatusApiRelayers] = useState<
    Array<{ relayerName: string; role: string; status: string; detail?: string | null; updatedAt?: string }>
  >([]);
  const [depositLookupId, setDepositLookupId] = useState('0');
  const [depositLookupBusy, setDepositLookupBusy] = useState(false);
  const [depositLookupResult, setDepositLookupResult] = useState('No deposit lookup yet.');
  const [withdrawalLookupId, setWithdrawalLookupId] = useState('0');
  const [withdrawalLookupBusy, setWithdrawalLookupBusy] = useState(false);
  const [withdrawalLookupResult, setWithdrawalLookupResult] = useState('No withdrawal lookup yet.');
  const [depositAsset, setDepositAsset] = useState<AssetSymbol>('USDT');
  const [depositAmount, setDepositAmount] = useState('');
  const [faucetAsset, setFaucetAsset] = useState<AssetSymbol>('USDT');
  const [faucetBusy, setFaucetBusy] = useState(false);
  const [faucetRefreshBusy, setFaucetRefreshBusy] = useState(false);
  const [faucetStatus, setFaucetStatus] = useState('No faucet claim started yet.');
  const [faucetTxHash, setFaucetTxHash] = useState('');
  const [faucetStateByAsset, setFaucetStateByAsset] = useState<Record<AssetSymbol, FaucetAssetState>>({
    USDT: { balanceRaw: null, claimAmountRaw: null, claimCooldownSec: null, claimableAtSec: null, faucetEnabled: null },
    WBTC: { balanceRaw: null, claimAmountRaw: null, claimCooldownSec: null, claimableAtSec: null, faucetEnabled: null },
    WETH: { balanceRaw: null, claimAmountRaw: null, claimCooldownSec: null, claimableAtSec: null, faucetEnabled: null },
    PAXG: { balanceRaw: null, claimAmountRaw: null, claimCooldownSec: null, claimableAtSec: null, faucetEnabled: null },
  });
  const [opnetBalanceByAsset, setOpnetBalanceByAsset] = useState<Record<AssetSymbol, OpnetAssetBalanceState>>({
    USDT: { balanceRaw: null },
    WBTC: { balanceRaw: null },
    WETH: { balanceRaw: null },
    PAXG: { balanceRaw: null },
  });
  const [burnAsset, setBurnAsset] = useState<AssetSymbol>('USDT');
  const [burnAmount, setBurnAmount] = useState('');
  const [depositBusy, setDepositBusy] = useState(false);
  const [depositStatus, setDepositStatus] = useState('No deposit started yet.');
  const [depositApproveTxHash, setDepositApproveTxHash] = useState('');
  const [depositTxHash, setDepositTxHash] = useState('');
  const [readyMintCandidates, setReadyMintCandidates] = useState<MintCandidate[]>([]);
  const [readyMintCandidatesBusy, setReadyMintCandidatesBusy] = useState(false);
  const [readyMintCandidatesStatus, setReadyMintCandidatesStatus] = useState('No ready deposit candidate to claim yet.');
  const [claimMintBusy, setClaimMintBusy] = useState(false);
  const [claimMintStatus, setClaimMintStatus] = useState('No deposit claim started yet.');
  const [claimMintPreflight, setClaimMintPreflight] = useState('No mint preflight captured yet.');
  const [claimMintOpnetTxId, setClaimMintOpnetTxId] = useState('');
  const [burnBusy, setBurnBusy] = useState(false);
  const [burnStatus, setBurnStatus] = useState('No withdrawal started yet.');
  const [burnOpnetTxId, setBurnOpnetTxId] = useState('');
  const [bridgeDirection, setBridgeDirection] = useState<BridgeDirection | null>(null);
  const [bridgeConfirm, setBridgeConfirm] = useState<BridgeConfirmState | null>(null);
  const [readyReleaseCandidates, setReadyReleaseCandidates] = useState<ReleaseCandidate[]>([]);
  const [readyReleaseCandidatesBusy, setReadyReleaseCandidatesBusy] = useState(false);
  const [readyReleaseCandidatesStatus, setReadyReleaseCandidatesStatus] = useState('No ready withdrawal candidate to claim yet.');
  const [claimReleaseBusy, setClaimReleaseBusy] = useState(false);
  const [claimReleaseStatus, setClaimReleaseStatus] = useState('No withdrawal claim started yet.');
  const [claimReleaseTxHash, setClaimReleaseTxHash] = useState('');
  const [fallbackSigner, setFallbackSigner] = useState<UnisatSigner | null>(null);
  const [fallbackSignerError, setFallbackSignerError] = useState<string | null>(null);
  const [showUxGuide, setShowUxGuide] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showFaucetModal, setShowFaucetModal] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [evmWalletType, setEvmWalletType] = useState<EvmWalletType | null>(null);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    try {
      const stored = window.localStorage.getItem(THEME_MODE_KEY);
      if (stored && isThemeMode(stored)) return stored;
    } catch {
      // Ignore localStorage read errors and fall back to system theme.
    }
    return resolveSystemTheme();
  });
  const getActiveEthereumProvider = () => getEthereumProvider(evmWalletType ?? undefined);

  useEffect(() => {
    try {
      const dismissed = window.localStorage.getItem(UX_GUIDE_DISMISSED_KEY);
      setShowUxGuide(dismissed !== '1');
    } catch {
      setShowUxGuide(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    try {
      window.localStorage.setItem(THEME_MODE_KEY, themeMode);
    } catch {
      // Ignore localStorage write errors and continue.
    }
  }, [themeMode]);

  useEffect(() => {
    if (!statusApiUrl) {
      setStatusApiState('idle');
      setStatusApiMessage('Set VITE_STATUS_API_URL (or type one below) to enable polling.');
      setStatusApiUpdatedAt('');
      setStatusApiSummary(null);
      setStatusApiRelayers([]);
      return;
    }

    let cancelled = false;

    const poll = async () => {
      try {
        setStatusApiState((prev) => (prev === 'ok' ? prev : 'loading'));
        const base = statusApiUrl.replace(/\/$/, '');
        const [healthRes, statusRes] = await Promise.all([
          fetch(`${base}/health`),
          fetch(`${base}/status`),
        ]);
        if (!healthRes.ok) throw new Error(`/health HTTP ${healthRes.status}`);
        if (!statusRes.ok) throw new Error(`/status HTTP ${statusRes.status}`);
        await healthRes.json();
        const status = (await statusRes.json()) as Record<string, unknown>;
        if (cancelled) return;
        setStatusApiState('ok');
        setStatusApiMessage('Relayer API Healthy');
        setStatusApiSummary((status.summary as Record<string, unknown>) ?? null);
        setStatusApiRelayers(
          Array.isArray(status.relayers)
            ? (status.relayers as Array<{ relayerName: string; role: string; status: string; detail?: string | null; updatedAt?: string }>)
            : [],
        );
        setStatusApiUpdatedAt(new Date().toISOString());
      } catch (error) {
        if (cancelled) return;
        setStatusApiState('error');
        setStatusApiMessage(`Status API check failed: ${error instanceof Error ? error.message : String(error)}`);
        setStatusApiSummary(null);
        setStatusApiRelayers([]);
        setStatusApiUpdatedAt(new Date().toISOString());
      }
    };

    void poll();
    const timer = window.setInterval(() => {
      void poll();
    }, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [statusApiUrl]);

  useEffect(() => {
    let active = true;

    const initFallbackSigner = async (): Promise<void> => {
      if (!walletAddress || opnetSigner || walletType !== SupportedWallets.OP_WALLET) {
        if (active) {
          setFallbackSigner(null);
          setFallbackSignerError(null);
        }
        return;
      }

      try {
        const localSigner = new OPWalletSigner();
        await localSigner.init();
        if (!active) return;
        setFallbackSigner(localSigner);
        setFallbackSignerError(null);
      } catch (error) {
        if (!active) return;
        setFallbackSigner(null);
        setFallbackSignerError(error instanceof Error ? error.message : String(error));
      }
    };

    void initFallbackSigner();

    return () => {
      active = false;
    };
  }, [walletAddress, opnetSigner, walletType, network?.network]);

  function openBridgeConfirm(direction: BridgeDirection) {
    if (direction === 'ethToBtc') {
      try {
        const decimals = ETH_ASSET_CONFIG[depositAsset].decimals;
        const amountRaw = parseHumanAmount(depositAmount, decimals);
        if (amountRaw <= 0n) throw new Error('Amount must be greater than zero.');
        const receivedRaw = (amountRaw * 99n) / 100n;
        setBridgeConfirm({
          direction,
          asset: depositAsset,
          amountText: formatTokenAmount(amountRaw, decimals),
          receivedText: formatTokenAmount(receivedRaw, decimals),
          fromAddress: ethAddress || '-',
          toAddress: walletAddress || '-',
        });
      } catch (error) {
        setDepositStatus(`Bridge preflight failed: ${error instanceof Error ? error.message : String(error)}`);
      }
      return;
    }
    try {
      const decimals = ETH_ASSET_CONFIG[burnAsset].decimals;
      const amountRaw = parseHumanAmount(burnAmount, decimals);
      if (amountRaw <= 0n) throw new Error('Amount must be greater than zero.');
      const receivedRaw = (amountRaw * 99n) / 100n;
      setBridgeConfirm({
        direction,
        asset: burnAsset,
        amountText: formatTokenAmount(amountRaw, decimals),
        receivedText: formatTokenAmount(receivedRaw, decimals),
        fromAddress: walletAddress || '-',
        toAddress: ethAddress || '-',
      });
    } catch (error) {
      setBurnStatus(`Bridge preflight failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  function toggleBridgeDirection(direction: BridgeDirection) {
    setBridgeDirection((current) => (current === direction ? null : direction));
  }

  function confirmBridgeTransaction() {
    if (!bridgeConfirm) return;
    const direction = bridgeConfirm.direction;
    setBridgeConfirm(null);
    if (direction === 'ethToBtc') {
      void runLockedDepositFlow();
      return;
    }
    void runLockedBurnFlow();
  }

  async function runDepositLookup() {
    if (!statusApiUrl.trim()) {
      setDepositLookupResult('Set Status API Base URL first.');
      return;
    }
    const id = depositLookupId.trim();
    if (!id) {
      setDepositLookupResult('Deposit ID is required.');
      return;
    }
    try {
      setDepositLookupBusy(true);
      const response = await fetch(`${statusApiUrl.replace(/\/$/, '')}/deposits/${encodeURIComponent(id)}`);
      const body = (await response.json()) as Record<string, unknown>;
      if (!response.ok) {
        throw new Error(typeof body.error === 'string' ? body.error : `HTTP ${response.status}`);
      }
      setDepositLookupResult(JSON.stringify(body, null, 2));
    } catch (error) {
      setDepositLookupResult(`Deposit lookup failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setDepositLookupBusy(false);
    }
  }

  async function runWithdrawalLookup() {
    if (!statusApiUrl.trim()) {
      setWithdrawalLookupResult('Set Status API Base URL first.');
      return;
    }
    const id = withdrawalLookupId.trim();
    if (!id) {
      setWithdrawalLookupResult('Withdrawal ID is required.');
      return;
    }
    try {
      setWithdrawalLookupBusy(true);
      const response = await fetch(`${statusApiUrl.replace(/\/$/, '')}/withdrawals/${encodeURIComponent(id)}`);
      const body = (await response.json()) as Record<string, unknown>;
      if (!response.ok) {
        throw new Error(typeof body.error === 'string' ? body.error : `HTTP ${response.status}`);
      }
      setWithdrawalLookupResult(JSON.stringify(body, null, 2));
    } catch (error) {
      setWithdrawalLookupResult(`Withdrawal lookup failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setWithdrawalLookupBusy(false);
    }
  }

  useEffect(() => {
    const provider = getActiveEthereumProvider();
    if (!provider?.on) return;

    const onAccountsChanged = (accounts: unknown) => {
      const list = Array.isArray(accounts) ? (accounts as string[]) : [];
      setEthAddress(list[0] ?? '');
    };
    const onChainChanged = (chainId: unknown) => {
      setEthChainId(typeof chainId === 'string' ? chainId : '');
    };

    provider.on('accountsChanged', onAccountsChanged);
    provider.on('chainChanged', onChainChanged);
    return () => {
      provider.removeListener?.('accountsChanged', onAccountsChanged);
      provider.removeListener?.('chainChanged', onChainChanged);
    };
  }, [evmWalletType]);

  useEffect(() => {
    const isSepolia = ethChainId.toLowerCase() === SEPOLIA_CHAIN_ID_HEX;
    if (!ethAddress || !isSepolia) return;
    void refreshFaucetState();
  }, [ethAddress, ethChainId]);

  async function connectOpWallet() {
    try {
      await connectToWallet(SupportedWallets.OP_WALLET);
    } catch (error) {
      alert(`OP_WALLET connection failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function connectEvmWallet(walletType: EvmWalletType) {
    const provider = getEthereumProvider(walletType);
    const walletName = walletType === 'rabby' ? 'Rabby' : 'MetaMask';
    if (!provider) {
      setEthStatus(`${walletName} not found. Install the extension and reload.`);
      return;
    }

    try {
      setEthStatus('Connecting...');
      const [address] = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
      let chainId = (await provider.request({ method: 'eth_chainId' })) as string;
      if (chainId?.toLowerCase() !== SEPOLIA_CHAIN_ID_HEX) {
        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
          });
          chainId = (await provider.request({ method: 'eth_chainId' })) as string;
        } catch {
          // Keep current chain and surface a clear status message below.
        }
      }
      setEthAddress(address ?? '');
      setEthChainId(chainId ?? '');
      setEvmWalletType(walletType);
      setEthStatus(
        chainId?.toLowerCase() === SEPOLIA_CHAIN_ID_HEX
          ? 'Connected (Sepolia)'
          : 'Connected but wrong network. Switch to Sepolia.',
      );
    } catch (error) {
      setEthStatus(`Connection failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function connectMetaMask() {
    await connectEvmWallet('metamask');
  }

  async function connectRabby() {
    await connectEvmWallet('rabby');
  }

  async function resolveProviderForSwitch(): Promise<{ provider: EthereumProvider; walletType: EvmWalletType; walletName: string } | null> {
    if (evmWalletType) {
      const active = getEthereumProvider(evmWalletType);
      if (active) {
        return {
          provider: active,
          walletType: evmWalletType,
          walletName: evmWalletType === 'rabby' ? 'Rabby' : 'MetaMask',
        };
      }
    }

    const candidates: Array<{ walletType: EvmWalletType; walletName: string }> = [
      { walletType: 'rabby', walletName: 'Rabby' },
      { walletType: 'metamask', walletName: 'MetaMask' },
    ];

    for (const candidate of candidates) {
      const provider = getEthereumProvider(candidate.walletType);
      if (!provider) continue;
      try {
        const accounts = (await provider.request({ method: 'eth_accounts' })) as string[];
        const connected = Array.isArray(accounts) && accounts.length > 0;
        if (connected) {
          return { provider, walletType: candidate.walletType, walletName: candidate.walletName };
        }
      } catch {
        // Try next candidate.
      }
    }

    const fallback = getEthereumProvider('rabby') ?? getEthereumProvider('metamask');
    if (!fallback) return null;
    const fallbackType: EvmWalletType = getEthereumProvider('rabby') ? 'rabby' : 'metamask';
    return {
      provider: fallback,
      walletType: fallbackType,
      walletName: fallbackType === 'rabby' ? 'Rabby' : 'MetaMask',
    };
  }

  async function switchToSepolia() {
    const resolved = await resolveProviderForSwitch();
    if (!resolved) {
      setEthStatus('No EVM provider found.');
      return;
    }
    const { provider, walletType, walletName } = resolved;
    setEvmWalletType(walletType);

    try {
      setEthStatus(`Switching ${walletName} to Sepolia...`);
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
        });
      } catch (error) {
        if (!isChainMissingError(error)) throw error;
        const sepoliaRpcUrl = walletType === 'rabby'
          ? 'https://ethereum-sepolia-rpc.publicnode.com'
          : 'https://rpc.sepolia.org';
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: SEPOLIA_CHAIN_ID_HEX,
            chainName: 'Ethereum Sepolia',
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            rpcUrls: [sepoliaRpcUrl],
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          }],
        });
      }
      const chainId = (await provider.request({ method: 'eth_chainId' })) as string;
      const [account] = (await provider.request({ method: 'eth_accounts' })) as string[];
      setEthAddress(account ?? '');
      setEthChainId(chainId ?? '');
      setEthStatus(
        (chainId || '').toLowerCase() === SEPOLIA_CHAIN_ID_HEX
          ? 'Connected (Sepolia)'
          : 'Connected but wrong network. Switch to Sepolia.',
      );
    } catch (error) {
      setEthStatus(`Switch failed: ${formatEthereumError(error)}`);
    }
  }

  function disconnectEvmWallet() {
    // Browser wallets do not expose a reliable programmatic site disconnect API.
    // Clear local app state so the UI route-locking resets for test flows.
    setEthAddress('');
    setEthChainId('');
    setEvmWalletType(null);
    setEthStatus('Disconnected (local app state cleared).');
  }

  const opConnected = Boolean(walletAddress);
  const ethConnected = Boolean(ethAddress);
  const evmWalletLabel = evmWalletType === 'rabby' ? 'Rabby' : evmWalletType === 'metamask' ? 'MetaMask' : 'EVM wallet';
  const onSepolia = ethChainId.toLowerCase() === SEPOLIA_CHAIN_ID_HEX;
  const opOnTestnet = (network?.network ?? '').toLowerCase().includes('testnet');
  const opWalletReady = opConnected && opOnTestnet;
  const ethWalletReady = ethConnected && onSepolia;
  const opRecipientHash = hashedMLDSAKey || '';
  const walletPairReady = opWalletReady && ethWalletReady;
  const faucetReady = ethWalletReady;
  const faucetConfigReady = Boolean(ETH_TOKEN_ADDRESSES[faucetAsset]);
  const faucetState = faucetStateByAsset[faucetAsset as AssetSymbol];
  const nowSec = BigInt(Math.floor(Date.now() / 1000));
  const faucetCooldownRemainingSec = faucetState?.claimableAtSec != null && faucetState.claimableAtSec > nowSec
    ? faucetState.claimableAtSec - nowSec
    : 0n;
  const faucetCooldownActive = faucetCooldownRemainingSec > 0n;
  const depositAssetState = faucetStateByAsset[depositAsset as AssetSymbol];
  const depositAssetBalanceLabel = depositAssetState?.balanceRaw != null
    ? `${formatTokenAmount(depositAssetState.balanceRaw, ETH_ASSET_CONFIG[depositAsset].decimals)} ${depositAsset}`
    : '-';
  const burnAssetState = opnetBalanceByAsset[burnAsset as AssetSymbol];
  const burnAssetBalanceLabel = burnAssetState?.balanceRaw != null
    ? `${formatTokenAmount(burnAssetState.balanceRaw, ETH_ASSET_CONFIG[burnAsset].decimals)} ${formatOpnetTicker(burnAsset)}`
    : '-';
  const depositReady = walletPairReady && Boolean(opRecipientHash);
  const burnReady = walletPairReady;
  const depositConfigReady = Boolean(ETH_VAULT_ADDRESS && ETH_TOKEN_ADDRESSES[depositAsset as AssetSymbol]);
  const burnConfigReady = Boolean(OPNET_BRIDGE_ADDRESS && opnetProvider && opnetAddressObject && walletAddress && opOnTestnet);
  const claimMintReady = Boolean(opWalletReady && statusApiUrl.trim() && burnConfigReady && opRecipientHash);
  const claimMintBlockers = [
    !opConnected ? 'OP_WALLET not connected' : '',
    opConnected && !opOnTestnet ? 'OP_WALLET must be on OPNet testnet' : '',
    !statusApiUrl.trim() ? 'Status API URL is empty' : '',
    !OPNET_BRIDGE_ADDRESS ? 'OPNet bridge address is missing (VITE_OPNET_BRIDGE_ADDRESS)' : '',
    !opnetProvider ? 'OPNet provider unavailable' : '',
    !opnetAddressObject ? 'OPNet sender address unavailable' : '',
    !walletAddress ? 'OP_WALLET address unavailable' : '',
    !opRecipientHash ? 'Hashed MLDSA key unavailable' : '',
  ].filter(Boolean);
  const claimReleaseReady = Boolean(walletPairReady && statusApiUrl.trim() && ETH_VAULT_ADDRESS && opRecipientHash);

  useEffect(() => {
    if (!opWalletReady || !opnetProvider || !walletAddress) return;
    void refreshOpnetBalance([burnAsset]);
  }, [burnAsset, opWalletReady, opnetProvider, walletAddress, opnetAddressObject]);

  function closeUxGuide(remember: boolean) {
    setShowUxGuide(false);
    if (!remember) return;
    try {
      window.localStorage.setItem(UX_GUIDE_DISMISSED_KEY, '1');
    } catch {
      // Ignore localStorage write errors and continue.
    }
  }

  function toggleThemeMode() {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  const resolveConnectedSender = async (): Promise<Address | null> => {
    if (!opnetAddressObject) return null;
    const expectedHashHex = parseExpectedSenderHash(opRecipientHash);

    if (
      typeof (opnetAddressObject as { equals?: unknown }).equals === 'function' &&
      typeof (opnetAddressObject as { toHex?: unknown }).toHex === 'function'
    ) {
      const sender = opnetAddressObject as Address;
      const senderHex = normalizeHex(typeof (sender as { toHex?: () => string }).toHex === 'function' ? sender.toHex() : '');
      if (senderHex !== expectedHashHex) {
        throw new Error(`Connected OP_WALLET sender mismatch: sender=${senderHex || '-'} expected=${expectedHashHex}`);
      }
      return await resolveAddressWithTweaked(sender, opnetProvider, expectedHashHex, walletAddress || '', 'sender');
    }

    const raw = typeof (opnetAddressObject as { toHex?: () => string }).toHex === 'function'
      ? (opnetAddressObject as { toHex: () => string }).toHex()
      : String(opnetAddressObject);

    if (/^0x[0-9a-fA-F]{64}$/.test(raw)) {
      const parsed = normalizeHex(raw);
      if (parsed !== expectedHashHex) {
        throw new Error(`Connected OP_WALLET sender mismatch: sender=${parsed} expected=${expectedHashHex}`);
      }
      return await resolveAddressWithTweaked(Address.fromBigInt(BigInt(parsed)), opnetProvider, expectedHashHex, walletAddress || '', 'sender');
    }

    if (opnetProvider && typeof (opnetProvider as { getPublicKeyInfo?: unknown }).getPublicKeyInfo === 'function') {
      try {
        const resolved = await (opnetProvider as { getPublicKeyInfo: (address: string, trusted: boolean) => Promise<Address> }).getPublicKeyInfo(raw, false);
        const resolvedHex = normalizeHex(typeof (resolved as { toHex?: () => string }).toHex === 'function' ? resolved.toHex() : '');
        if (resolvedHex !== expectedHashHex) {
          throw new Error(`Connected OP_WALLET sender mismatch: sender=${resolvedHex || '-'} expected=${expectedHashHex}`);
        }
        return await resolveAddressWithTweaked(resolved, opnetProvider, expectedHashHex, walletAddress || '', 'sender');
      } catch {
        return null;
      }
    }

    return null;
  };

  const resolveTxSigner = async (): Promise<unknown | null> => {
    if (opnetSigner) return opnetSigner;
    if (fallbackSigner) return fallbackSigner;

    if (walletType === SupportedWallets.OP_WALLET && walletAddress) {
      try {
        const localSigner = new OPWalletSigner();
        await localSigner.init();
        setFallbackSigner(localSigner);
        setFallbackSignerError(null);
        return localSigner;
      } catch (error) {
        setFallbackSigner(null);
        setFallbackSignerError(error instanceof Error ? error.message : String(error));
        return null;
      }
    }

    return null;
  };

  async function waitForEthereumReceipt(
    provider: EthereumProvider,
    txHash: string,
    label: string,
    onPending?: (message: string) => void,
  ) {
    for (let attempt = 0; attempt < 90; attempt += 1) {
      const receipt = (await provider.request({
        method: 'eth_getTransactionReceipt',
        params: [txHash],
      })) as { status?: string; blockNumber?: string; transactionHash?: string } | null;
      if (receipt) return receipt;
      await new Promise((resolve) => window.setTimeout(resolve, 2000));
      if (attempt === 9) {
        onPending?.(`${label} pending... waiting for confirmation`);
      }
    }
    throw new Error(`${label} receipt timeout for tx ${txHash}`);
  }

  async function fetchFaucetStateForAsset(
    provider: EthereumProvider,
    account: string,
    asset: AssetSymbol,
  ): Promise<FaucetAssetState> {
    const tokenAddress = normalizeEthereumAddress(ETH_TOKEN_ADDRESSES[asset], `${asset} token address`);
    const [balanceRawHex, claimAmountRawHex, claimCooldownRawHex, claimableAtRawHex, faucetEnabledRawHex] = await Promise.all([
      provider.request({
        method: 'eth_call',
        params: [{ to: tokenAddress, data: buildBalanceOfCalldata(account) }, 'latest'],
      }),
      provider.request({
        method: 'eth_call',
        params: [{ to: tokenAddress, data: TEST_TOKEN_CLAIM_AMOUNT_SELECTOR }, 'latest'],
      }),
      provider.request({
        method: 'eth_call',
        params: [{ to: tokenAddress, data: TEST_TOKEN_CLAIM_COOLDOWN_SELECTOR }, 'latest'],
      }),
      provider.request({
        method: 'eth_call',
        params: [{ to: tokenAddress, data: buildClaimableAtCalldata(account) }, 'latest'],
      }),
      provider.request({
        method: 'eth_call',
        params: [{ to: tokenAddress, data: TEST_TOKEN_FAUCET_ENABLED_SELECTOR }, 'latest'],
      }),
    ]);
    const balanceRaw = parseEvmUint256Result(balanceRawHex, `${asset}.balanceOf`);
    const claimAmountRaw = parseEvmUint256Result(claimAmountRawHex, `${asset}.claimAmount`);
    const claimCooldownSec = parseEvmUint256Result(claimCooldownRawHex, `${asset}.claimCooldown`);
    const claimableAtSec = parseEvmUint256Result(claimableAtRawHex, `${asset}.claimableAt`);
    const faucetEnabled = parseEvmUint256Result(faucetEnabledRawHex, `${asset}.faucetEnabled`) !== 0n;
    return { balanceRaw, claimAmountRaw, claimCooldownSec, claimableAtSec, faucetEnabled };
  }

  async function refreshFaucetState(targetAssets?: AssetSymbol[]) {
    const provider = getActiveEthereumProvider();
    if (!provider || !ethAddress || !onSepolia) {
      return;
    }

    const assets = targetAssets && targetAssets.length > 0
      ? targetAssets
      : (Object.keys(ETH_ASSET_CONFIG) as AssetSymbol[]);

    try {
      setFaucetRefreshBusy(true);
      const next = { ...faucetStateByAsset };
      await Promise.all(
        assets.map(async (asset) => {
          try {
            next[asset] = await fetchFaucetStateForAsset(provider, ethAddress, asset);
          } catch (error) {
            next[asset] = {
              balanceRaw: null,
              claimAmountRaw: null,
              claimCooldownSec: null,
              claimableAtSec: null,
              faucetEnabled: null,
              error: error instanceof Error ? error.message : String(error),
            };
          }
        }),
      );
      setFaucetStateByAsset(next);
    } finally {
      setFaucetRefreshBusy(false);
    }
  }

  async function refreshOpnetBalance(targetAssets?: AssetSymbol[]) {
    if (!opWalletReady || !opnetProvider || !walletAddress) return;
    const assets = targetAssets && targetAssets.length > 0
      ? targetAssets
      : (Object.keys(ETH_ASSET_CONFIG) as AssetSymbol[]);

    try {
      const sender = resolveAddressForOpnetRead(opnetAddressObject, walletAddress);
      if (!sender) throw new Error('Connected OP_WALLET address is unavailable for OP20 balance reads.');
      const next = { ...opnetBalanceByAsset };

      await Promise.all(
        assets.map(async (asset) => {
          const tokenAddress = OPNET_TOKEN_ADDRESSES[asset];
          if (!tokenAddress) {
            next[asset] = {
              balanceRaw: null,
              error: `Missing OPNet token address. Set VITE_OPNET_${asset}_ADDRESS.`,
            };
            return;
          }

          try {
            const token = getContract(tokenAddress, OPNET_TOKEN_BALANCE_ABI as never, opnetProvider as never, networks.opnetTestnet);
            const result = await (token as any).balanceOf(sender);
            const properties = (result as { properties?: Record<string, unknown> })?.properties ?? {};
            const rawCandidate = properties.balance ?? Object.values(properties)[0];
            next[asset] = { balanceRaw: BigInt(rawCandidate as bigint | string | number) };
          } catch (error) {
            next[asset] = {
              balanceRaw: null,
              error: error instanceof Error ? error.message : String(error),
            };
          }
        }),
      );

      setOpnetBalanceByAsset(next);
    } finally {}
  }

  async function runClaimTestTokenFlow() {
    const provider = getActiveEthereumProvider();
    if (!provider) {
      setFaucetStatus(`${evmWalletLabel} provider not found.`);
      return;
    }

    try {
      setFaucetBusy(true);
      setFaucetTxHash('');
      setFaucetStatus(`Checking ${evmWalletLabel} session...`);
      const [account] = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
      const chainId = (await provider.request({ method: 'eth_chainId' })) as string;
      setEthAddress(account ?? '');
      setEthChainId(chainId ?? '');

      if (!account) throw new Error(`No ${evmWalletLabel} account connected.`);
      if ((chainId || '').toLowerCase() !== SEPOLIA_CHAIN_ID_HEX) {
        throw new Error(`Wrong network. Expected Sepolia (${SEPOLIA_CHAIN_ID_HEX}), got ${chainId || '-'}.`);
      }

      const asset = faucetAsset as AssetSymbol;
      const tokenAddress = normalizeEthereumAddress(ETH_TOKEN_ADDRESSES[asset], `${asset} token address`);
      setFaucetStatus(`Submitting ${asset} faucet claim transaction...`);
      const claimTx = await withEstimatedGasCap(
        provider,
        {
          from: account,
          to: tokenAddress,
          data: TEST_TOKEN_CLAIM_SELECTOR,
        },
        setFaucetStatus,
      );
      const txHash = (await provider.request({
        method: 'eth_sendTransaction',
        params: [claimTx],
      })) as string;

      const receipt = await waitForEthereumReceipt(provider, txHash, `${asset} faucet claim`, setFaucetStatus);
      if (receipt.status !== '0x1') {
        throw new Error(`${asset} faucet claim failed: ${txHash}`);
      }
      setFaucetStatus(`${asset} faucet claim confirmed.`);
      setFaucetTxHash(txHash);
      await refreshFaucetState([asset]);
    } catch (error) {
      setFaucetTxHash('');
      setFaucetStatus(`Faucet claim failed: ${formatEthereumError(error)}`);
    } finally {
      setFaucetBusy(false);
    }
  }

  async function runLockedDepositFlow() {
    const provider = getActiveEthereumProvider();
    if (!provider) {
      setDepositStatus(`${evmWalletLabel} provider not found.`);
      return;
    }

    try {
      setDepositBusy(true);
      setDepositApproveTxHash('');
      setDepositTxHash('');
      setDepositStatus(`Checking ${evmWalletLabel} session...`);

      const [account] = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
      const chainId = (await provider.request({ method: 'eth_chainId' })) as string;
      setEthAddress(account ?? '');
      setEthChainId(chainId ?? '');

      if (!account) throw new Error(`No ${evmWalletLabel} account connected.`);
      if ((chainId || '').toLowerCase() !== SEPOLIA_CHAIN_ID_HEX) {
        throw new Error(`Wrong network. Expected Sepolia (${SEPOLIA_CHAIN_ID_HEX}), got ${chainId || '-'}.`);
      }

      const recipient = normalizeBytes32Hex(opRecipientHash, 'Connected OP_WALLET hashed MLDSA key');
      const vaultAddress = normalizeEthereumAddress(ETH_VAULT_ADDRESS, 'Ethereum vault address');
      const asset = depositAsset as AssetSymbol;
      const tokenAddress = normalizeEthereumAddress(ETH_TOKEN_ADDRESSES[asset], `${asset} token address`);
      const { assetId, decimals } = ETH_ASSET_CONFIG[asset];
      const amountRaw = parseHumanAmount(depositAmount, decimals);
      if (amountRaw <= 0n) throw new Error('Amount must be greater than zero.');

      setDepositStatus(`Submitting ${asset} approve transaction...`);
      const approveData = buildApproveCalldata(vaultAddress, amountRaw);
      const approveTx = await withEstimatedGasCap(
        provider,
        {
          from: account,
          to: tokenAddress,
          data: approveData,
        },
        setDepositStatus,
      );
      const approveTxHash = (await provider.request({
        method: 'eth_sendTransaction',
        params: [approveTx],
      })) as string;
      setDepositApproveTxHash(approveTxHash);

      const approveReceipt = await waitForEthereumReceipt(provider, approveTxHash, 'Approve', setDepositStatus);
      if (approveReceipt.status !== '0x1') {
        throw new Error(`Approve transaction failed: ${approveTxHash}`);
      }

      setDepositStatus(`Approve confirmed (${approveTxHash}). Submitting vault deposit...`);
      const depositData = buildDepositErc20Calldata(assetId, amountRaw, recipient);
      const depositTx = await withEstimatedGasCap(
        provider,
        {
          from: account,
          to: vaultAddress,
          data: depositData,
        },
        setDepositStatus,
      );
      const depositTxHash = (await provider.request({
        method: 'eth_sendTransaction',
        params: [depositTx],
      })) as string;
      setDepositTxHash(depositTxHash);

      const depositReceipt = await waitForEthereumReceipt(provider, depositTxHash, 'Deposit', setDepositStatus);
      if (depositReceipt.status !== '0x1') {
        throw new Error(`Deposit transaction failed: ${depositTxHash}`);
      }

      setDepositStatus(
        `Deposit confirmed. asset=${asset} amount=${depositAmount} recipient=${short(recipient)}`,
      );
    } catch (error) {
      setDepositApproveTxHash('');
      setDepositTxHash('');
      setDepositStatus(`Deposit failed: ${formatEthereumError(error)}`);
    } finally {
      setDepositBusy(false);
    }
  }

  async function runLockedBurnFlow() {
    if (!opnetProvider || !walletAddress) {
      setBurnStatus('Connect OP_WALLET first (provider/address unavailable).');
      return;
    }

    try {
      setBurnBusy(true);
      setBurnOpnetTxId('');
      setBurnStatus('Preparing burn request...');

      const asset = burnAsset as AssetSymbol;
      const { assetId, decimals } = ETH_ASSET_CONFIG[asset];
      const amountRaw = parseHumanAmount(burnAmount, decimals);
      if (amountRaw <= 0n) throw new Error('Amount must be greater than zero.');
      const ethereumRecipient = ethereumAddressToAddressWord(ethAddress);
      const sender = await resolveConnectedSender();
      if (!sender) throw new Error('Connected OP_WALLET sender address is unavailable.');

      const bridge = getContract(OPNET_BRIDGE_ADDRESS, BRIDGE_BURN_ABI as never, opnetProvider as never, networks.opnetTestnet);
      if (typeof (bridge as any).setSender === 'function') {
        (bridge as any).setSender(sender);
      }

      setBurnStatus('Simulating burn request on OPNet...');
      const simulation = await (bridge as any).requestBurn(
        assetId,
        sender,
        ethereumRecipient,
        amountRaw,
      );

      if (simulation?.revert) {
        throw new Error(`Burn simulation revert: ${simulation.revert}`);
      }

      setBurnStatus('Simulation OK. Sending burn request transaction...');
      const txSigner = await resolveTxSigner();
      if (!txSigner) {
        throw new Error(`OP_WALLET signer unavailable.${fallbackSignerError ? ` ${fallbackSignerError}` : ''}`);
      }
      const tx = await simulation.sendTransaction({
        signer: txSigner,
        mldsaSigner: null,
        refundTo: walletAddress,
        maximumAllowedSatToSpend: OPNET_MAX_SAT_SPEND,
        feeRate: OPNET_FEE_RATE,
        network: networks.opnetTestnet,
      });
      const txId = String((tx as { transactionId?: string })?.transactionId || '').trim();
      if (txId) setBurnOpnetTxId(txId);

      setBurnStatus(
        `Burn request sent. asset=${asset} amount=${burnAmount} recipient=${ethAddress || '-'}`,
      );
    } catch (error) {
      setBurnOpnetTxId('');
      setBurnStatus(`Burn failed: ${formatEthereumError(error)}`);
    } finally {
      setBurnBusy(false);
    }
  }

  async function fetchReadyMintCandidates() {
    if (!statusApiUrl.trim()) throw new Error('Set Status API Base URL first.');
    const base = statusApiUrl.replace(/\/$/, '');
    const recipientHash = normalizeBytes32Hex(opRecipientHash, 'Connected OP_WALLET hashed MLDSA key');
    const query = new URLSearchParams({
      recipientHash: recipientHash.toLowerCase(),
      ready: 'true',
      processed: 'false',
      limit: '20',
    });
    if (ethAddress.trim()) {
      const normalizedEth = normalizeEthereumAddress(ethAddress, 'Connected EVM address').toLowerCase();
      query.set('ethereumUser', `0x${encodeAddressWord(normalizedEth)}`);
    }
    const response = await fetch(`${base}/mint-candidates?${query.toString()}`);
    const body = (await response.json()) as { items?: MintCandidate[] };
    if (!response.ok) throw new Error(`mint-candidates HTTP ${response.status}`);
    const items = Array.isArray(body.items) ? body.items : [];
    setReadyMintCandidates(items);
    return items;
  }

  async function refreshReadyMintCandidates() {
    try {
      setReadyMintCandidatesBusy(true);
      const items = await fetchReadyMintCandidates();
      setReadyMintCandidatesStatus(
        items.length === 0
          ? 'No ready deposit candidate to claim yet.'
          : `Loaded ${items.length} ready mint candidate(s).`,
      );
    } catch (error) {
      setReadyMintCandidatesStatus(`Failed to load ready mint candidates: ${formatEthereumError(error)}`);
    } finally {
      setReadyMintCandidatesBusy(false);
    }
  }

  useEffect(() => {
    if (!statusApiUrl.trim()) {
      setReadyMintCandidates([]);
      setReadyReleaseCandidates([]);
      setReadyMintCandidatesStatus('No ready deposit candidate to claim yet.');
      setReadyReleaseCandidatesStatus('No ready withdrawal candidate to claim yet.');
      return;
    }

    let cancelled = false;

    const pollReadyCandidates = async (): Promise<void> => {
      if (claimMintReady) {
        try {
          const items = await fetchReadyMintCandidates();
          if (!cancelled) {
            setReadyMintCandidates(items);
            setReadyMintCandidatesStatus(
              items.length === 0
                ? 'No ready deposit candidate to claim yet.'
                : `Loaded ${items.length} ready mint candidate(s).`,
            );
          }
        } catch {
          if (!cancelled) {
            setReadyMintCandidates([]);
            setReadyMintCandidatesStatus('Failed to load ready mint candidates.');
          }
        }
      } else if (!cancelled) {
        setReadyMintCandidates([]);
        setReadyMintCandidatesStatus('No ready deposit candidate to claim yet.');
      }

      const canPollReleaseCandidates = Boolean(opWalletReady && statusApiUrl.trim() && ETH_VAULT_ADDRESS && opRecipientHash);
      if (canPollReleaseCandidates) {
        try {
          let connectedAccount = ethAddress.trim();
          if (!connectedAccount) {
            const provider = getActiveEthereumProvider();
            if (provider) {
              const accounts = (await provider.request({ method: 'eth_accounts' })) as string[];
              connectedAccount = String(accounts?.[0] ?? '').trim();
              if (connectedAccount && !cancelled) setEthAddress(connectedAccount);
            }
          }
          const items = await fetchReadyReleaseCandidates(connectedAccount);
          if (!cancelled) {
            setReadyReleaseCandidates(items);
            setReadyReleaseCandidatesStatus(
              items.length === 0
                ? 'No ready withdrawal candidate to claim yet.'
                : `Loaded ${items.length} ready release candidate(s).`,
            );
          }
        } catch {
          if (!cancelled) {
            setReadyReleaseCandidates([]);
            setReadyReleaseCandidatesStatus('Failed to load ready release candidates.');
          }
        }
      } else if (!cancelled) {
        setReadyReleaseCandidates([]);
        setReadyReleaseCandidatesStatus('No ready withdrawal candidate to claim yet.');
      }
    };

    void pollReadyCandidates();
    const timer = window.setInterval(() => {
      void pollReadyCandidates();
    }, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [statusApiUrl, claimMintReady, opWalletReady, ETH_VAULT_ADDRESS, opRecipientHash, ethAddress, evmWalletType]);

  async function runClaimMintFlow(explicitDepositId?: string) {
    if (!statusApiUrl.trim()) {
      setClaimMintStatus('Set Status API Base URL first.');
      return;
    }
    if (!opnetProvider || !walletAddress) {
      setClaimMintStatus('Claim Mint blocked: OP_WALLET provider/address unavailable.');
      return;
    }
    if (!claimMintReady) {
      setClaimMintStatus(`Claim Mint blocked: ${claimMintBlockers.join('; ')}`);
      return;
    }
    let preflightDetails = '';
    try {
      setClaimMintBusy(true);
      setClaimMintOpnetTxId('');
      setClaimMintPreflight('No mint preflight captured yet.');
      setClaimMintStatus('Fetching ready mint candidates from Relayer API...');
      const base = statusApiUrl.replace(/\/$/, '');
      const recipientHash = normalizeBytes32Hex(opRecipientHash, 'Connected OP_WALLET hashed MLDSA key');
      const wantedDepositId = explicitDepositId?.trim() || '';
      let selected: MintCandidate | undefined;

      if (wantedDepositId) {
        const response = await fetch(`${base}/deposits/${encodeURIComponent(wantedDepositId)}`);
        const body = (await response.json()) as { ok?: boolean; mintCandidate?: MintCandidate };
        if (!response.ok) {
          throw new Error(`deposits/${wantedDepositId} HTTP ${response.status}`);
        }
        selected = body.mintCandidate;
        if (!selected) {
          setClaimMintStatus(`Deposit ${wantedDepositId} not found yet.`);
          return;
        }
        if (!selected.ready) {
          setClaimMintStatus(`Deposit ${wantedDepositId} is not ready yet. Wait for relayer aggregation and retry.`);
          return;
        }
      } else {
        const items = await fetchReadyMintCandidates();
        if (items.length === 0) {
          setReadyMintCandidatesStatus('No ready deposit candidate to claim yet.');
          return;
        }
        selected = items[0];
      }

      if (!selected) {
        setReadyMintCandidatesStatus(`No ready deposit candidate found for depositId=${wantedDepositId}.`);
        return;
      }
      if (!selected.mintSubmission) {
        throw new Error('Candidate missing mintSubmission payload.');
      }

      const mint = selected.mintSubmission;
      const mintRecipient = normalizeBytes32Hex(String(mint.recipient ?? ''), 'mintSubmission.recipient');
      if (mintRecipient.toLowerCase() !== recipientHash.toLowerCase()) {
        throw new Error(`Recipient mismatch: candidate=${mintRecipient} connectedWallet=${recipientHash}`);
      }

      const assetId = Number(mint.assetId);
      const amount = BigInt(String(mint.amount ?? '0'));
      const depositId = BigInt(String(mint.nonce ?? selected.depositId ?? '0'));
      const attestationVersion = Number(mint.attestationVersion);
      const relayIndexesPacked = hexToBytes(String(mint.relayIndexesPackedHex ?? ''), 'mintSubmission.relayIndexesPackedHex');
      const relaySignaturesPacked = hexToBytes(
        String(mint.relaySignaturesPackedHex ?? ''),
        'mintSubmission.relaySignaturesPackedHex',
      );
      if (!Number.isInteger(assetId) || assetId < 0) throw new Error(`Invalid assetId=${mint.assetId}`);
      if (amount <= 0n) throw new Error(`Invalid amount=${mint.amount}`);
      if (!Number.isInteger(attestationVersion) || attestationVersion < 0 || attestationVersion > 255) {
        throw new Error(`Invalid attestationVersion=${mint.attestationVersion}`);
      }
      if (relayIndexesPacked.length === 0) throw new Error('relayIndexesPackedHex cannot be empty.');
      if (relaySignaturesPacked.length === 0) throw new Error('relaySignaturesPackedHex cannot be empty.');

      const connectedSender = await resolveConnectedSender();
      if (!connectedSender) throw new Error('Connected OP_WALLET sender address is unavailable.');
      const recipient = await parseRecipientForMint(
        String(mint.recipient ?? ''),
        connectedSender,
        opnetProvider,
        walletAddress,
      );
      // Use resolved recipient as sender for mint call; in this flow they are the
      // same connected OP_WALLET identity and this avoids sender/recipient format drift.
      const sender = recipient;
      const ethereumUser = parseEthereumUserForMint(String(mint.ethereumUser ?? ''));
      const senderDebug = getAddressDebugInfo(sender);
      const recipientDebug = getAddressDebugInfo(recipient);
      preflightDetails = JSON.stringify(
        {
          expectedRecipientHash: recipientHash.toLowerCase(),
          candidateRecipientHash: mintRecipient.toLowerCase(),
          senderHex: senderDebug.hex,
          senderTweakedHex: senderDebug.tweakedHex,
          recipientHex: recipientDebug.hex,
          recipientTweakedHex: recipientDebug.tweakedHex,
          walletAddress: walletAddress || '',
          walletPublicKey: publicKey || '',
        },
        null,
        2,
      );
      setClaimMintPreflight(preflightDetails);
      const bridge = getContract(OPNET_BRIDGE_ADDRESS, BRIDGE_MINT_ABI as never, opnetProvider as never, networks.opnetTestnet);
      if (typeof (bridge as { setSender?: (sender: Address) => void }).setSender === 'function') {
        (bridge as { setSender: (sender: Address) => void }).setSender(sender);
      }

      setClaimMintStatus(`Preflight OK.\n${preflightDetails}\nSimulating mint for depositId=${depositId.toString()}...`);
      const simulation = await (bridge as any).mintWithRelaySignatures(
        assetId,
        ethereumUser,
        recipient,
        amount,
        depositId,
        attestationVersion,
        relayIndexesPacked,
        relaySignaturesPacked,
      );
      if (simulation?.revert) {
        throw new Error(`Mint simulation revert: ${simulation.revert}`);
      }

      setClaimMintStatus(`Simulation OK. Sending mint transaction for depositId=${depositId.toString()}...`);
      const txSigner = await resolveTxSigner();
      if (!txSigner) {
        throw new Error(`OP_WALLET signer unavailable.${fallbackSignerError ? ` ${fallbackSignerError}` : ''}`);
      }
      const tx = await simulation.sendTransaction({
        signer: txSigner,
        mldsaSigner: null,
        refundTo: walletAddress,
        maximumAllowedSatToSpend: OPNET_MAX_SAT_SPEND,
        feeRate: OPNET_FEE_RATE,
        network: networks.opnetTestnet,
      });
      const txId = String((tx as { transactionId?: string })?.transactionId || '').trim();
      if (txId) setClaimMintOpnetTxId(txId);

      setDepositLookupId(depositId.toString());
      setClaimMintStatus('Deposit claim sent.');
      await fetchReadyMintCandidates();
    } catch (error) {
      setClaimMintOpnetTxId('');
      const baseMessage = `Mint claim failed: ${formatEthereumError(error)}`;
      if (preflightDetails) {
        setClaimMintPreflight(preflightDetails);
        setClaimMintStatus(`${baseMessage}\nPreflight:\n${preflightDetails}`);
      } else {
        setClaimMintStatus(baseMessage);
      }
    } finally {
      setClaimMintBusy(false);
    }
  }

  async function fetchReadyReleaseCandidates(connectedAccount?: string) {
    if (!statusApiUrl.trim()) throw new Error('Set Status API Base URL first.');
    const base = statusApiUrl.replace(/\/$/, '');
    const recipient = normalizeEthereumAddress(connectedAccount || ethAddress, 'Connected EVM address');
    const opnetUser = normalizeBytes32Hex(opRecipientHash, 'Connected OP_WALLET hashed MLDSA key');
    const query = new URLSearchParams({
      recipient: recipient.toLowerCase(),
      opnetUser: opnetUser.toLowerCase(),
      ready: 'true',
      processed: 'false',
      limit: '20',
    });
    const response = await fetch(`${base}/release-candidates?${query.toString()}`);
    const body = (await response.json()) as { items?: ReleaseCandidate[] };
    if (!response.ok) throw new Error(`release-candidates HTTP ${response.status}`);
    const items = Array.isArray(body.items) ? body.items : [];
    setReadyReleaseCandidates(items);
    return items;
  }

  async function refreshReadyReleaseCandidates() {
    const provider = getActiveEthereumProvider();
    if (!provider) {
      setReadyReleaseCandidatesStatus(`${evmWalletLabel} provider not found.`);
      return;
    }
    try {
      setReadyReleaseCandidatesBusy(true);
      const [account] = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
      setEthAddress(account ?? '');
      const items = await fetchReadyReleaseCandidates(account ?? '');
      setReadyReleaseCandidatesStatus(
        items.length === 0
          ? 'No ready withdrawal candidate to claim yet.'
          : `Loaded ${items.length} ready release candidate(s).`,
      );
    } catch (error) {
      setReadyReleaseCandidatesStatus(`Failed to load ready release candidates: ${formatEthereumError(error)}`);
    } finally {
      setReadyReleaseCandidatesBusy(false);
    }
  }

  async function runClaimReleaseFlow(explicitWithdrawalId?: string) {
    const provider = getActiveEthereumProvider();
    if (!provider) {
      setClaimReleaseStatus(`${evmWalletLabel} provider not found.`);
      return;
    }
    if (!statusApiUrl.trim()) {
      setClaimReleaseStatus('Set Status API Base URL first.');
      return;
    }
    if (!ethAddress.trim()) {
      setClaimReleaseStatus('Connect an EVM wallet first.');
      return;
    }

    try {
      setClaimReleaseBusy(true);
      setClaimReleaseTxHash('');
      setClaimReleaseStatus(`Checking ${evmWalletLabel} session...`);
      const [account] = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
      const chainId = (await provider.request({ method: 'eth_chainId' })) as string;
      setEthAddress(account ?? '');
      setEthChainId(chainId ?? '');
      if (!account) throw new Error(`No ${evmWalletLabel} account connected.`);
      if ((chainId || '').toLowerCase() !== SEPOLIA_CHAIN_ID_HEX) {
        throw new Error(`Wrong network. Expected Sepolia (${SEPOLIA_CHAIN_ID_HEX}), got ${chainId || '-'}.`);
      }

      const recipient = normalizeEthereumAddress(account, 'Connected EVM address');
      const opnetUser = normalizeBytes32Hex(opRecipientHash, 'Connected OP_WALLET hashed MLDSA key');

      setClaimReleaseStatus('Fetching ready release candidates from Relayer API...');
      const items = await fetchReadyReleaseCandidates(account);
      if (items.length === 0) {
        setReadyReleaseCandidatesStatus('No ready withdrawal candidate to claim yet.');
        return;
      }

      const wantedWithdrawalId = explicitWithdrawalId?.trim() || '';
      const selected = wantedWithdrawalId
        ? items.find((entry) => String(entry.withdrawalId ?? entry.releaseSubmission?.withdrawalId ?? '') === wantedWithdrawalId)
        : items[0];
      if (!selected) {
        setReadyReleaseCandidatesStatus(`No ready withdrawal candidate found for withdrawalId=${wantedWithdrawalId}.`);
        return;
      }
      if (!selected.releaseSubmission) {
        throw new Error('Candidate missing releaseSubmission payload.');
      }

      const submission = selected.releaseSubmission;
      const submissionRecipient = normalizeEthereumAddress(String(submission.recipient ?? ''), 'releaseSubmission.recipient');
      const submissionOpnetUser = normalizeBytes32Hex(String(submission.opnetUser ?? ''), 'releaseSubmission.opnetUser');
      if (submissionRecipient.toLowerCase() !== recipient.toLowerCase()) {
        throw new Error(`Recipient mismatch: candidate=${submissionRecipient} connected=${recipient}`);
      }
      if (submissionOpnetUser.toLowerCase() !== opnetUser.toLowerCase()) {
        throw new Error(`OPNet user mismatch: candidate=${submissionOpnetUser} connectedWallet=${opnetUser}`);
      }

      const assetId = Number(submission.assetId);
      const amount = BigInt(String(submission.amount ?? '0'));
      const withdrawalId = BigInt(String(submission.withdrawalId ?? selected.withdrawalId ?? '0'));
      const attestationVersion = Number(submission.attestationVersion);
      const relayIndexesPackedHex = normalizeHexBytes(
        String(submission.relayIndexesPackedHex ?? ''),
        'releaseSubmission.relayIndexesPackedHex',
      );
      const relaySignaturesPackedHex = normalizeHexBytes(
        String(submission.relaySignaturesPackedHex ?? ''),
        'releaseSubmission.relaySignaturesPackedHex',
      );
      if (!Number.isInteger(assetId) || assetId < 0) throw new Error(`Invalid assetId=${submission.assetId}`);
      if (amount <= 0n) throw new Error(`Invalid amount=${submission.amount}`);
      if (!Number.isInteger(attestationVersion) || attestationVersion < 0 || attestationVersion > 255) {
        throw new Error(`Invalid attestationVersion=${submission.attestationVersion}`);
      }

      const vaultAddress = normalizeEthereumAddress(ETH_VAULT_ADDRESS, 'Ethereum vault address');
      const calldata = buildReleaseCalldata({
        assetId,
        opnetUser: submissionOpnetUser,
        recipient,
        amount,
        withdrawalId,
        attestationVersion,
        relayIndexesPackedHex,
        relaySignaturesPackedHex,
      });

      setClaimReleaseStatus(`Submitting withdrawal claim for withdrawalId=${withdrawalId.toString()}...`);
      const releaseTx = await withEstimatedGasCap(
        provider,
        {
          from: account,
          to: vaultAddress,
          data: calldata,
        },
        setClaimReleaseStatus,
      );
      const txHash = (await provider.request({
        method: 'eth_sendTransaction',
        params: [releaseTx],
      })) as string;
      setClaimReleaseTxHash(txHash);

      const receipt = await waitForEthereumReceipt(provider, txHash, 'Release', setClaimReleaseStatus);
      if (receipt.status !== '0x1') {
        throw new Error(`Release transaction failed: ${txHash}`);
      }
      setWithdrawalLookupId(withdrawalId.toString());
      setClaimReleaseStatus('withdrawal released');
      await fetchReadyReleaseCandidates(account);
    } catch (error) {
      setClaimReleaseTxHash('');
      setClaimReleaseStatus(`Withdrawal claim failed: ${formatEthereumError(error)}`);
    } finally {
      setClaimReleaseBusy(false);
    }
  }

  return (
    <>
      {showUxGuide ? (
        <div className="ux-guide-overlay" role="presentation">
          <section className="ux-guide-dialog card" role="dialog" aria-modal="true" aria-labelledby="ux-guide-title">
            <p className="eyebrow">Bridge Quick Guide</p>
            <h2 id="ux-guide-title">How this bridge works right now</h2>
            <ol className="ux-guide-list">
              <li>Connect both wallets first: OP_WALLET and an EVM wallet (MetaMask or Rabby).</li>
              <li>Keep your EVM wallet on Sepolia for all Ethereum-side steps.</li>
              <li>Recipients are locked in this phase for safety.</li>
              <li>Sepolia to OPNet: deposit from connected EVM wallet, then claim mint to connected OP_WALLET.</li>
              <li>OPNet to Sepolia: request burn from connected OP_WALLET, then claim release to connected EVM wallet.</li>
              <li>Use Status API lookups below to monitor deposit and withdrawal IDs.</li>
            </ol>
            <p className="muted">
              Tip: if you are new, use the faucet section first, then run one small deposit and one small withdrawal.
            </p>
            <div className="actions">
              <button className="primary" onClick={() => closeUxGuide(false)}>
                Start Using Bridge
              </button>
              <button onClick={() => closeUxGuide(true)}>Don&apos;t show again</button>
            </div>
          </section>
        </div>
      ) : null}

      {showWalletModal ? (
        <div className="wallet-connect-overlay" role="presentation" onClick={() => setShowWalletModal(false)}>
          <section
            className="wallet-connect-dialog card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wallet-connect-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="wallet-connect-head">
              <p className="eyebrow" id="wallet-connect-title">Wallet Connect</p>
              <button type="button" onClick={() => setShowWalletModal(false)}>Close</button>
            </div>
            <article className="wallet-linker wallet-connect-panel">
              <div className="mini-grid wallet-options-grid">
                <div>
                  <button
                    className={`wallet-provider-logo-button ${opConnected ? 'active' : ''}`}
                    onClick={opConnected ? disconnect : connectOpWallet}
                    disabled={connecting && !opConnected}
                    aria-label={opConnected ? 'Disconnect OP Wallet' : 'Connect OP Wallet'}
                    title={opConnected ? 'Disconnect OP Wallet' : 'Connect OP Wallet (OPNet testnet)'}
                  >
                    <img className="wallet-provider-logo" src="/branding/op.svg" alt="OP Wallet" />
                  </button>
                  <h3>OP Wallet</h3>
                  <p><strong>Status:</strong> {opWalletReady ? '✅ (OPNet testnet)' : opConnected ? '❌ (Wrong network)' : '❌'}</p>
                  <p><strong>Address:</strong> <code>{short(walletAddress)}</code></p>
                </div>
                <div>
                  <div className="wallet-provider-logo-row">
                    <button
                      className={`wallet-provider-logo-button ${ethConnected && evmWalletType === 'metamask' ? 'active' : ''}`}
                      onClick={ethConnected && evmWalletType === 'metamask' ? disconnectEvmWallet : connectMetaMask}
                      aria-label={ethConnected && evmWalletType === 'metamask' ? 'Disconnect MetaMask' : 'Connect MetaMask'}
                      title={ethConnected && evmWalletType === 'metamask' ? 'Disconnect MetaMask' : 'Connect MetaMask (Sepolia)'}
                    >
                      <img className="wallet-provider-logo" src="/branding/metamask.svg" alt="MetaMask" />
                    </button>
                    <button
                      className={`wallet-provider-logo-button ${ethConnected && evmWalletType === 'rabby' ? 'active' : ''}`}
                      onClick={ethConnected && evmWalletType === 'rabby' ? disconnectEvmWallet : connectRabby}
                      aria-label={ethConnected && evmWalletType === 'rabby' ? 'Disconnect Rabby' : 'Connect Rabby'}
                      title={ethConnected && evmWalletType === 'rabby' ? 'Disconnect Rabby' : 'Connect Rabby (Sepolia)'}
                    >
                      <img className="wallet-provider-logo" src="/branding/rabby.svg" alt="Rabby" />
                    </button>
                  </div>
                  <h3>EVM Wallet</h3>
                  <p><strong>Status:</strong> {ethWalletReady ? '✅ (Sepolia)' : ethConnected ? '❌ (Wrong network)' : '❌'}</p>
                  <p><strong>Address:</strong> <code>{ethConnected ? short(ethAddress) : '-'}</code></p>
                  {ethConnected && !onSepolia ? (
                    <div className="actions">
                      <button type="button" onClick={switchToSepolia}>
                        Switch to Sepolia
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          </section>
        </div>
      ) : null}

      {showFaucetModal ? (
        <div className="wallet-connect-overlay" role="presentation" onClick={() => setShowFaucetModal(false)}>
          <section
            className="wallet-connect-dialog card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="faucet-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="wallet-connect-head">
              <p className="eyebrow" id="faucet-dialog-title">Get Test Tokens</p>
              <button type="button" onClick={() => setShowFaucetModal(false)}>Close</button>
            </div>
            <section className="flow-card faucet-modal-panel">
              <div className="card-head faucet-head">
                <span className={`pill faucet-status-pill ${faucetReady ? 'api-status-pill ok' : ''}`}>
                  {faucetReady ? '✓' : '❌ (Connect Ethereum wallet)'}
                </span>
              </div>
              <div className="field">
                <span>Select Token</span>
                <div className="token-picker" role="radiogroup" aria-label="Select test asset to claim">
                  {ASSET_OPTIONS.map((option) => {
                    const selected = faucetAsset === option.symbol;
                    return (
                      <button
                        key={option.symbol}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        className={`token-choice ${selected ? 'selected' : ''}`}
                        onClick={() => setFaucetAsset(option.symbol)}
                        title={`Select ${option.symbol}`}
                      >
                        <img src={option.logo} alt={option.alt} />
                        <span>{option.symbol}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="route-box">
                <div>
                  <h3>Token Contract</h3>
                  <p>{ETH_TOKEN_ADDRESSES[faucetAsset as AssetSymbol] || '-'}</p>
                </div>
                <div>
                  <h3>Wallet Balance</h3>
                  <p>
                    {faucetState?.balanceRaw != null
                      ? formatTokenAmount(
                          faucetState.balanceRaw,
                          ETH_ASSET_CONFIG[faucetAsset as AssetSymbol].decimals,
                        )
                      : '-'}
                  </p>
                </div>
                <div>
                  <h3>Claim Amount</h3>
                  <p>
                    {faucetState?.claimAmountRaw != null
                      ? formatTokenAmount(
                          faucetState.claimAmountRaw,
                          ETH_ASSET_CONFIG[faucetAsset as AssetSymbol].decimals,
                        )
                      : '-'}
                  </p>
                </div>
                <div>
                  <h3>Cooldown</h3>
                  <p>{faucetState?.claimCooldownSec != null ? formatDurationShort(faucetState.claimCooldownSec) : '-'}</p>
                </div>
              </div>
              <div className="actions">
                <button
                  onClick={runClaimTestTokenFlow}
                  disabled={!faucetReady || !faucetConfigReady || faucetBusy || faucetCooldownActive}
                >
                  {faucetBusy ? 'Claiming…' : `Claim ${faucetAsset} Test Tokens`}
                </button>
              </div>
              <p className={`notice ${faucetReady ? 'ok' : ''}`}>
                {!faucetReady
                  ? 'Connect an Ethereum wallet on Sepolia to use faucet'
                  : faucetCooldownActive
                    ? `Cooldown active. Wait ${formatDurationShort(faucetCooldownRemainingSec)}`
                    : 'Faucet ready'}
              </p>
              {faucetState?.error ? <p className="notice">Faucet read error: {faucetState.error}</p> : null}
              <pre className="log-box">
                {faucetStatus}
                {faucetTxHash ? (
                  <>
                    {'\n'}
                    <a href={`https://sepolia.etherscan.io/tx/${faucetTxHash}`} target="_blank" rel="noreferrer">
                      View on Etherscan ↗
                    </a>
                  </>
                ) : null}
              </pre>
            </section>
          </section>
        </div>
      ) : null}

      {showApiModal ? (
        <div className="wallet-connect-overlay" role="presentation" onClick={() => setShowApiModal(false)}>
          <section
            className="wallet-connect-dialog card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="api-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="wallet-connect-head">
              <p className="eyebrow" id="api-dialog-title">API Status</p>
              <button type="button" onClick={() => setShowApiModal(false)}>Close</button>
            </div>
            <section className="status-panel api-modal-panel">
              <div className="card-head api-status-head">
                <span className={`pill api-status-pill ${statusApiState === 'ok' ? 'ok' : ''}`}>
                  {statusApiState === 'ok' ? '✓' : statusApiState}
                </span>
              </div>
              <label className="field">
                <span>Status API Base URL</span>
                <input
                  value={statusApiUrl}
                  onChange={(e) => setStatusApiUrl(e.target.value)}
                  placeholder="https://your-status-api.example.com"
                />
              </label>
              <div className="mini-grid">
                <div>
                  <h3>Health / Summary</h3>
                  <p>
                    {statusApiMessage}
                    {statusApiState === 'ok' ? <span className="api-health-check">✓</span> : null}
                  </p>
                  <p className="muted">Last checked: {statusApiUpdatedAt || '-'}</p>
                  <pre className="log-box compact">{statusApiSummary ? JSON.stringify(statusApiSummary, null, 2) : 'No summary yet.'}</pre>
                </div>
                <div>
                  <h3>Relayer Heartbeats</h3>
                  {statusApiRelayers.length === 0 ? (
                    <p className="muted">No relayer heartbeat records yet.</p>
                  ) : (
                    <ul className="heartbeat-list">
                      {statusApiRelayers.map((relayer) => (
                        <li key={`${relayer.relayerName}:${relayer.role}`}>
                          <code>{relayer.relayerName}</code>{' '}
                          <span className={`pill api-status-pill ${relayer.status === 'ok' ? 'ok' : ''}`}>
                            {relayer.status === 'ok' ? '✓' : relayer.status}
                          </span>
                          <div className="muted">{relayer.role} {relayer.detail ? `| ${relayer.detail}` : ''}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="mini-grid">
                <div>
                  <h3>Deposit Lookup</h3>
                  <label className="field">
                    <span>Deposit ID / nonce</span>
                    <input value={depositLookupId} onChange={(e) => setDepositLookupId(e.target.value)} placeholder="0" />
                  </label>
                  <div className="actions">
                    <button onClick={runDepositLookup} disabled={depositLookupBusy}>
                      {depositLookupBusy ? 'Loading…' : 'Lookup Deposit'}
                    </button>
                  </div>
                  <pre className="log-box compact">{depositLookupResult}</pre>
                </div>
                <div>
                  <h3>Withdrawal Lookup</h3>
                  <label className="field">
                    <span>Withdrawal ID</span>
                    <input value={withdrawalLookupId} onChange={(e) => setWithdrawalLookupId(e.target.value)} placeholder="0" />
                  </label>
                  <div className="actions">
                    <button onClick={runWithdrawalLookup} disabled={withdrawalLookupBusy}>
                      {withdrawalLookupBusy ? 'Loading…' : 'Lookup Withdrawal'}
                    </button>
                  </div>
                  <pre className="log-box compact">{withdrawalLookupResult}</pre>
                </div>
              </div>
            </section>
          </section>
        </div>
      ) : null}

      <main className="landing">
        <section className="hero card">
          <div className="hero-top">
            <div className="hero-brand">
              <img
                className="brand-wordmark"
                src={themeMode === 'dark' ? '/branding/heptad-wordmark-dark.svg' : '/branding/heptad-wordmark.svg'}
                alt="Heptad"
              />
              <p className="eyebrow">HEPTAD BRIDGE TESTNET LIVE</p>
              <div className="brand-meta">
                <a
                  className="powered-by"
                  href="https://opnet.org"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Powered by OPNet"
                  title="Visit opnet.org"
                >
                  <span>Powered by</span>
                  <img src="/branding/opnet-logo.svg" alt="OPNet" />
                </a>
                <a
                  className="brand-social-link"
                  href="https://x.com/heptadbtc"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Follow Heptad on X"
                  title="Follow Heptad on X"
                >
                  <img src="/branding/x.svg" alt="" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="hero-actions">
              <button
                type="button"
                className="hero-api-button"
                onClick={() => setShowApiModal(true)}
              >
                API Status
              </button>
              <button
                type="button"
                className={`hero-connect-button ${walletPairReady ? 'connected' : ''}`}
                onClick={() => setShowWalletModal(true)}
              >
                {walletPairReady ? 'Connected' : 'Connect'}
              </button>
              <button
                type="button"
                className="hero-faucet-button"
                onClick={() => setShowFaucetModal(true)}
              >
                Get Test Tokens
              </button>
              <button
                type="button"
                className="hero-theme-button"
                onClick={toggleThemeMode}
                title="Toggle light and dark mode"
              >
                {themeMode === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
            </div>
          </div>
        </section>

      <section className="card flow-card bridge-card">
        <div className="bridge-direction-picker" role="radiogroup" aria-label="Select bridge direction">
          <button
            type="button"
            role="radio"
            aria-checked={bridgeDirection === 'ethToBtc'}
            className={`bridge-direction-choice ${bridgeDirection === 'ethToBtc' ? 'selected' : ''}`}
            onClick={() => toggleBridgeDirection('ethToBtc')}
          >
            <span className="flow-icon-title" aria-hidden="true">
              <img src="/branding/eth.svg" alt="Ethereum" />
              <span>→</span>
              <img src="/branding/btc.svg" alt="Bitcoin" />
            </span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={bridgeDirection === 'btcToEth'}
            className={`bridge-direction-choice ${bridgeDirection === 'btcToEth' ? 'selected' : ''}`}
            onClick={() => toggleBridgeDirection('btcToEth')}
          >
            <span className="flow-icon-title" aria-hidden="true">
              <img src="/branding/btc.svg" alt="Bitcoin" />
              <span>→</span>
              <img src="/branding/eth.svg" alt="Ethereum" />
            </span>
          </button>
        </div>

        {bridgeDirection === 'ethToBtc' ? (
          <div className="bridge-panel">
            <div className="card-head flow-direction-head">
              <span className={`pill ${depositReady ? 'ok' : ''}`}>{depositReady ? 'Ready' : 'Blocked'}</span>
            </div>
            <div className="field">
              <span>Select Token</span>
              <div className="token-picker" role="radiogroup" aria-label="Select asset to deposit">
                {ASSET_OPTIONS.map((option) => {
                  const selected = depositAsset === option.symbol;
                  return (
                    <button
                      key={`deposit:${option.symbol}`}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className={`token-choice ${selected ? 'selected' : ''}`}
                      onClick={() => setDepositAsset(option.symbol)}
                      title={`Select ${option.symbol}`}
                    >
                      <img src={option.logo} alt={option.alt} />
                      <span>{option.symbol}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <label className="field">
              <span>Amount</span>
              <input
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.0"
                inputMode="decimal"
              />
            </label>
            <p className="muted">
              Balance: {depositAssetBalanceLabel}
            </p>
            <div className="actions">
              <button
                className="primary"
                onClick={() => openBridgeConfirm('ethToBtc')}
                disabled={!depositReady || !depositConfigReady || depositBusy || !depositAmount.trim()}
              >
                {depositBusy ? 'Submitting Deposit…' : 'Bridge to Bitcoin'}
              </button>
              <button onClick={() => void refreshReadyMintCandidates()} disabled={readyMintCandidatesBusy}>
                {readyMintCandidatesBusy ? 'Refreshing…' : 'Refresh Ready Deposits'}
              </button>
            </div>
            <p className="muted">{readyMintCandidatesStatus}</p>
            {readyMintCandidates.length > 0 ? (
              <ul className="heartbeat-list">
                {readyMintCandidates.map((candidate, index) => {
                  const id = String(candidate.depositId ?? candidate.mintSubmission?.nonce ?? '');
                  const amountLabel = formatMintClaimAmount(candidate.mintSubmission?.assetId, candidate.mintSubmission?.amount);
                  return (
                    <li key={`${id || 'mint'}:${index}`}>
                      <button
                        onClick={() => void runClaimMintFlow(id)}
                        disabled={claimMintBusy || !claimMintReady || !id}
                      >
                        {claimMintBusy ? 'Submitting…' : `Claim ${amountLabel}`}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
            <pre className="log-box">
              {depositStatus}
              {depositApproveTxHash ? (
                <>
                  {'\n'}
                  <a href={`https://sepolia.etherscan.io/tx/${depositApproveTxHash}`} target="_blank" rel="noreferrer">
                    View approve tx on Etherscan ↗
                  </a>
                </>
              ) : null}
              {depositTxHash ? (
                <>
                  {'\n'}
                  <a href={`https://sepolia.etherscan.io/tx/${depositTxHash}`} target="_blank" rel="noreferrer">
                    View deposit tx on Etherscan ↗
                  </a>
                </>
              ) : null}
            </pre>
            <pre className="log-box">
              {claimMintStatus}
              {claimMintOpnetTxId ? (
                <>
                  {'\n'}
                  <a href={buildOpscanTxUrl(claimMintOpnetTxId)} target="_blank" rel="noreferrer">
                    View mint tx on OPScan ↗
                  </a>
                </>
              ) : null}
            </pre>
          </div>
        ) : null}

        {bridgeDirection === 'btcToEth' ? (
          <div className="bridge-panel">
            <div className="card-head flow-direction-head">
              <span className={`pill ${burnReady ? 'ok' : ''}`}>{burnReady ? 'Ready' : 'Blocked'}</span>
            </div>
            <div className="field">
              <span>Select Token</span>
              <div className="token-picker" role="radiogroup" aria-label="Select asset to withdraw">
                {ASSET_OPTIONS.map((option) => {
                  const selected = burnAsset === option.symbol;
                  return (
                    <button
                      key={`withdraw:${option.symbol}`}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className={`token-choice ${selected ? 'selected' : ''}`}
                      onClick={() => setBurnAsset(option.symbol)}
                      title={`Select ${option.symbol}`}
                    >
                      <img src={option.logo} alt={option.alt} />
                      <span>{formatOpnetTicker(option.symbol)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <label className="field">
              <span>Amount</span>
              <input
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
                placeholder="0.0"
                inputMode="decimal"
              />
            </label>
            <p className="muted">Balance: {burnAssetBalanceLabel}</p>
            {burnAssetState?.error ? <p className="muted">OPNet balance error: {burnAssetState.error}</p> : null}
            <div className="actions">
              <button
                className="primary"
                onClick={() => openBridgeConfirm('btcToEth')}
                disabled={!burnReady || !burnConfigReady || burnBusy || !burnAmount.trim()}
              >
                {burnBusy ? 'Submitting Burn…' : 'Withdraw to Ethereum'}
              </button>
              <button onClick={() => void refreshReadyReleaseCandidates()} disabled={readyReleaseCandidatesBusy}>
                {readyReleaseCandidatesBusy ? 'Refreshing…' : 'Refresh Ready Withdrawals'}
              </button>
            </div>
            <p className="muted">{readyReleaseCandidatesStatus}</p>
            {readyReleaseCandidates.length > 0 ? (
              <ul className="heartbeat-list">
                {readyReleaseCandidates.map((candidate, index) => {
                  const id = String(candidate.withdrawalId ?? candidate.releaseSubmission?.withdrawalId ?? '');
                  const amountLabel = formatCandidateAmount(candidate.releaseSubmission?.assetId, candidate.releaseSubmission?.amount);
                  return (
                    <li key={`${id || 'release'}:${index}`}>
                      <button
                        onClick={() => void runClaimReleaseFlow(id)}
                        disabled={claimReleaseBusy || !claimReleaseReady || !id}
                      >
                        {claimReleaseBusy ? 'Submitting…' : `Claim ${amountLabel}`}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
            <pre className="log-box">
              {burnStatus}
              {burnOpnetTxId ? (
                <>
                  {'\n'}
                  <a href={buildOpscanTxUrl(burnOpnetTxId)} target="_blank" rel="noreferrer">
                    View burn tx on OPScan ↗
                  </a>
                </>
              ) : null}
            </pre>
            <pre className="log-box">
              {claimReleaseStatus}
              {claimReleaseTxHash ? (
                <>
                  {'\n'}
                  <a href={`https://sepolia.etherscan.io/tx/${claimReleaseTxHash}`} target="_blank" rel="noreferrer">
                    View withdrawal tx on Etherscan ↗
                  </a>
                </>
              ) : null}
            </pre>
          </div>
        ) : null}
      </section>
      {bridgeConfirm ? (
        <div className="tx-confirm-overlay" role="dialog" aria-modal="true" aria-label="Bridge confirmation">
          <div className="card tx-confirm-dialog">
            <h3>Confirm Bridge Transaction</h3>
            <p className="muted">
              You are bridging <strong>{bridgeConfirm.amountText} {bridgeConfirm.asset}</strong> from{' '}
              <code>{bridgeConfirm.fromAddress}</code> to <code>{bridgeConfirm.toAddress}</code>.
            </p>
            <p className="muted">
              After bridge fees, you will receive{' '}
              <strong>{bridgeConfirm.receivedText} {bridgeConfirm.asset}</strong>{' '}
              on <strong>{bridgeConfirm.direction === 'ethToBtc' ? 'Bitcoin' : 'Ethereum'}</strong>.
            </p>
            <p className="muted">
              {bridgeConfirm.direction === 'ethToBtc'
                ? 'Your EVM wallet will ask you to approve token spend first, then confirm the bridge deposit transaction.'
                : 'OP_WALLET will ask you to sign and confirm the burn transaction to release funds to Ethereum.'}
            </p>
            <div className="actions">
              <button type="button" onClick={() => setBridgeConfirm(null)}>Cancel</button>
              <button className="primary" type="button" onClick={confirmBridgeTransaction}>
                I Understand
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <footer className="site-credit" aria-label="Site credit">
        <span>made by</span>
        <img
          className="site-credit-wordmark"
          src={themeMode === 'dark' ? '/branding/heptad-wordmark-dark.svg' : '/branding/heptad-wordmark.svg'}
          alt="Heptad"
        />
      </footer>

      </main>
    </>
  );
}
