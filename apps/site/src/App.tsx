import { SupportedWallets, useWalletConnect } from '@btc-vision/walletconnect';
import { networks } from '@btc-vision/bitcoin';
import { Address, UnisatSigner } from '@btc-vision/transaction';
import { ABIDataTypes, BitcoinAbiTypes, getContract } from 'opnet';
import { useEffect, useState } from 'react';

type EthereumProvider = {
  isMetaMask?: boolean;
  providers?: EthereumProvider[];
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

type EthereumWindow = Window & {
  ethereum?: EthereumProvider;
};

const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7';
const SEPOLIA_CHAIN_ID_DEC = 11155111;
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

const ETH_ASSET_CONFIG = {
  USDT: { assetId: 0, decimals: 6 },
  WBTC: { assetId: 1, decimals: 8 },
  WETH: { assetId: 2, decimals: 18 },
  PAXG: { assetId: 3, decimals: 18 },
} as const;
const UX_GUIDE_DISMISSED_KEY = 'heptad.site.uxGuideDismissed.v1';

type AssetSymbol = keyof typeof ETH_ASSET_CONFIG;
const ASSET_OPTIONS: Array<{ symbol: AssetSymbol; logo: string; alt: string }> = [
  { symbol: 'USDT', logo: '/branding/usdt.svg', alt: 'Tether USD' },
  { symbol: 'WBTC', logo: '/branding/btc.svg', alt: 'Wrapped Bitcoin' },
  { symbol: 'WETH', logo: '/branding/eth.svg', alt: 'Wrapped Ether' },
  { symbol: 'PAXG', logo: '/branding/paxg.svg', alt: 'PAX Gold' },
];
type BridgeDirection = 'ethToBtc' | 'btcToEth';
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

function short(value?: string | null) {
  if (!value) return '-';
  if (value.length < 14) return value;
  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

function getEthereumProvider(): EthereumProvider | null {
  const ethereum = (window as EthereumWindow).ethereum;
  if (!ethereum) return null;
  if (Array.isArray(ethereum.providers) && ethereum.providers.length > 0) {
    const metaMask = ethereum.providers.find((p) => p?.isMetaMask);
    return metaMask ?? ethereum.providers[0] ?? null;
  }
  return ethereum;
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

function parseEvmUint256Result(raw: unknown, fieldName: string): bigint {
  const value = String(raw ?? '').trim();
  if (!/^0x[0-9a-fA-F]+$/.test(value)) {
    throw new Error(`${fieldName} returned invalid hex.`);
  }
  return BigInt(value);
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
  const [depositLookupId, setDepositLookupId] = useState('1');
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
  const [faucetStateByAsset, setFaucetStateByAsset] = useState<Record<AssetSymbol, FaucetAssetState>>({
    USDT: { balanceRaw: null, claimAmountRaw: null, claimCooldownSec: null, claimableAtSec: null, faucetEnabled: null },
    WBTC: { balanceRaw: null, claimAmountRaw: null, claimCooldownSec: null, claimableAtSec: null, faucetEnabled: null },
    WETH: { balanceRaw: null, claimAmountRaw: null, claimCooldownSec: null, claimableAtSec: null, faucetEnabled: null },
    PAXG: { balanceRaw: null, claimAmountRaw: null, claimCooldownSec: null, claimableAtSec: null, faucetEnabled: null },
  });
  const [burnAsset, setBurnAsset] = useState<AssetSymbol>('USDT');
  const [burnAmount, setBurnAmount] = useState('');
  const [depositBusy, setDepositBusy] = useState(false);
  const [depositStatus, setDepositStatus] = useState('No deposit started yet.');
  const [readyMintCandidates, setReadyMintCandidates] = useState<MintCandidate[]>([]);
  const [readyMintCandidatesBusy, setReadyMintCandidatesBusy] = useState(false);
  const [claimMintBusy, setClaimMintBusy] = useState(false);
  const [claimMintStatus, setClaimMintStatus] = useState('No mint claim started yet.');
  const [claimMintPreflight, setClaimMintPreflight] = useState('No mint preflight captured yet.');
  const [burnBusy, setBurnBusy] = useState(false);
  const [burnStatus, setBurnStatus] = useState('No burn started yet.');
  const [bridgeDirection, setBridgeDirection] = useState<BridgeDirection | null>(null);
  const [bridgeConfirm, setBridgeConfirm] = useState<BridgeConfirmState | null>(null);
  const [readyReleaseCandidates, setReadyReleaseCandidates] = useState<ReleaseCandidate[]>([]);
  const [readyReleaseCandidatesBusy, setReadyReleaseCandidatesBusy] = useState(false);
  const [claimReleaseBusy, setClaimReleaseBusy] = useState(false);
  const [claimReleaseStatus, setClaimReleaseStatus] = useState('No withdrawal claim started yet.');
  const [fallbackSigner, setFallbackSigner] = useState<UnisatSigner | null>(null);
  const [fallbackSignerError, setFallbackSignerError] = useState<string | null>(null);
  const [showUxGuide, setShowUxGuide] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showFaucetModal, setShowFaucetModal] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);

  useEffect(() => {
    try {
      const dismissed = window.localStorage.getItem(UX_GUIDE_DISMISSED_KEY);
      setShowUxGuide(dismissed !== '1');
    } catch {
      setShowUxGuide(true);
    }
  }, []);

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
        const health = (await healthRes.json()) as Record<string, unknown>;
        const status = (await statusRes.json()) as Record<string, unknown>;
        if (cancelled) return;
        setStatusApiState('ok');
        setStatusApiMessage(
          `Relayer API healthy. ${typeof health.service === 'string' ? health.service : 'service'} /status loaded`,
        );
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
    const provider = getEthereumProvider();
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
  }, []);

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

  async function connectMetaMask() {
    const provider = getEthereumProvider();
    if (!provider) {
      setEthStatus('MetaMask not found. Install the extension and reload.');
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
      setEthStatus(
        chainId?.toLowerCase() === SEPOLIA_CHAIN_ID_HEX
          ? 'Connected (Sepolia)'
          : 'Connected but wrong network. Switch to Sepolia.',
      );
    } catch (error) {
      setEthStatus(`Connection failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  function disconnectMetaMask() {
    // MetaMask does not expose a reliable programmatic site disconnect API.
    // Clear local app state so the UI route-locking resets for test flows.
    setEthAddress('');
    setEthChainId('');
    setEthStatus('Disconnected (local app state cleared).');
  }

  const opConnected = Boolean(walletAddress);
  const ethConnected = Boolean(ethAddress);
  const onSepolia = ethChainId.toLowerCase() === SEPOLIA_CHAIN_ID_HEX;
  const opOnTestnet = (network?.network ?? '').toLowerCase().includes('testnet');
  const opWalletReady = opConnected && opOnTestnet;
  const ethWalletReady = ethConnected && onSepolia;
  const opRecipientHash = hashedMLDSAKey || '';
  const walletPairReady = opWalletReady && ethWalletReady;
  const faucetReady = ethWalletReady;
  const faucetConfigReady = Boolean(ETH_TOKEN_ADDRESSES[faucetAsset]);
  const faucetState = faucetStateByAsset[faucetAsset as AssetSymbol];
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

  function closeUxGuide(remember: boolean) {
    setShowUxGuide(false);
    if (!remember) return;
    try {
      window.localStorage.setItem(UX_GUIDE_DISMISSED_KEY, '1');
    } catch {
      // Ignore localStorage write errors and continue.
    }
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
    const provider = getEthereumProvider();
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

  async function runClaimTestTokenFlow() {
    const provider = getEthereumProvider();
    if (!provider) {
      setFaucetStatus('MetaMask provider not found.');
      return;
    }

    try {
      setFaucetBusy(true);
      setFaucetStatus('Checking MetaMask session...');
      const [account] = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
      const chainId = (await provider.request({ method: 'eth_chainId' })) as string;
      setEthAddress(account ?? '');
      setEthChainId(chainId ?? '');

      if (!account) throw new Error('No MetaMask account connected.');
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
      setFaucetStatus(`${asset} faucet claim confirmed. tx=${short(txHash)}`);
      await refreshFaucetState([asset]);
    } catch (error) {
      setFaucetStatus(`Faucet claim failed: ${formatEthereumError(error)}`);
    } finally {
      setFaucetBusy(false);
    }
  }

  async function runLockedDepositFlow() {
    const provider = getEthereumProvider();
    if (!provider) {
      setDepositStatus('MetaMask provider not found.');
      return;
    }

    try {
      setDepositBusy(true);
      setDepositStatus('Checking MetaMask session...');

      const [account] = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
      const chainId = (await provider.request({ method: 'eth_chainId' })) as string;
      setEthAddress(account ?? '');
      setEthChainId(chainId ?? '');

      if (!account) throw new Error('No MetaMask account connected.');
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

      const depositReceipt = await waitForEthereumReceipt(provider, depositTxHash, 'Deposit', setDepositStatus);
      if (depositReceipt.status !== '0x1') {
        throw new Error(`Deposit transaction failed: ${depositTxHash}`);
      }

      setDepositStatus(
        `Deposit confirmed. asset=${asset} amount=${depositAmount} recipient=${short(recipient)} approveTx=${short(approveTxHash)} depositTx=${short(depositTxHash)}`,
      );
    } catch (error) {
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

      setBurnStatus(
        `Burn request sent. asset=${asset} amount=${burnAmount} withdrawalId=auto(on-chain) tx=${short((tx as { transactionId?: string })?.transactionId || null)}`,
      );
    } catch (error) {
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
      setClaimMintStatus(
        items.length === 0
          ? 'No ready mint candidate yet for this wallet pair.'
          : `Loaded ${items.length} ready mint candidate(s).`,
      );
    } catch (error) {
      setClaimMintStatus(`Failed to load ready mint candidates: ${formatEthereumError(error)}`);
    } finally {
      setReadyMintCandidatesBusy(false);
    }
  }

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
          setClaimMintStatus('No ready mint candidate yet for this wallet pair. Wait for relayer aggregation and retry.');
          return;
        }
        selected = items[0];
      }

      if (!selected) {
        setClaimMintStatus(`No ready candidate found for depositId=${wantedDepositId}.`);
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

      setDepositLookupId(depositId.toString());
      setClaimMintStatus(
        `Mint sent. depositId=${depositId.toString()} amount=${amount.toString()} tx=${short((tx as { transactionId?: string })?.transactionId || null)}`,
      );
      await fetchReadyMintCandidates();
    } catch (error) {
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
    const recipient = normalizeEthereumAddress(connectedAccount || ethAddress, 'Connected MetaMask address');
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
    const provider = getEthereumProvider();
    if (!provider) {
      setClaimReleaseStatus('MetaMask provider not found.');
      return;
    }
    try {
      setReadyReleaseCandidatesBusy(true);
      const [account] = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
      setEthAddress(account ?? '');
      const items = await fetchReadyReleaseCandidates(account ?? '');
      setClaimReleaseStatus(
        items.length === 0
          ? 'No ready release candidate yet for this wallet pair.'
          : `Loaded ${items.length} ready release candidate(s).`,
      );
    } catch (error) {
      setClaimReleaseStatus(`Failed to load ready release candidates: ${formatEthereumError(error)}`);
    } finally {
      setReadyReleaseCandidatesBusy(false);
    }
  }

  async function runClaimReleaseFlow(explicitWithdrawalId?: string) {
    const provider = getEthereumProvider();
    if (!provider) {
      setClaimReleaseStatus('MetaMask provider not found.');
      return;
    }
    if (!statusApiUrl.trim()) {
      setClaimReleaseStatus('Set Status API Base URL first.');
      return;
    }
    if (!ethAddress.trim()) {
      setClaimReleaseStatus('Connect MetaMask first.');
      return;
    }

    try {
      setClaimReleaseBusy(true);
      setClaimReleaseStatus('Checking MetaMask session...');
      const [account] = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
      const chainId = (await provider.request({ method: 'eth_chainId' })) as string;
      setEthAddress(account ?? '');
      setEthChainId(chainId ?? '');
      if (!account) throw new Error('No MetaMask account connected.');
      if ((chainId || '').toLowerCase() !== SEPOLIA_CHAIN_ID_HEX) {
        throw new Error(`Wrong network. Expected Sepolia (${SEPOLIA_CHAIN_ID_HEX}), got ${chainId || '-'}.`);
      }

      const recipient = normalizeEthereumAddress(account, 'Connected MetaMask address');
      const opnetUser = normalizeBytes32Hex(opRecipientHash, 'Connected OP_WALLET hashed MLDSA key');

      setClaimReleaseStatus('Fetching ready release candidates from Relayer API...');
      const items = await fetchReadyReleaseCandidates(account);
      if (items.length === 0) {
        setClaimReleaseStatus('No ready release candidate yet for this wallet pair. Wait for relayer aggregation and retry.');
        return;
      }

      const wantedWithdrawalId = explicitWithdrawalId?.trim() || '';
      const selected = wantedWithdrawalId
        ? items.find((entry) => String(entry.withdrawalId ?? entry.releaseSubmission?.withdrawalId ?? '') === wantedWithdrawalId)
        : items[0];
      if (!selected) {
        setClaimReleaseStatus(`No ready release candidate found for withdrawalId=${wantedWithdrawalId}.`);
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

      const receipt = await waitForEthereumReceipt(provider, txHash, 'Release', setClaimReleaseStatus);
      if (receipt.status !== '0x1') {
        throw new Error(`Release transaction failed: ${txHash}`);
      }
      setWithdrawalLookupId(withdrawalId.toString());
      setClaimReleaseStatus(`Withdrawal released. withdrawalId=${withdrawalId.toString()} tx=${short(txHash)}`);
      await fetchReadyReleaseCandidates(account);
    } catch (error) {
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
              <li>Connect both wallets first: OP_WALLET and MetaMask.</li>
              <li>Keep MetaMask on Sepolia for all Ethereum-side steps.</li>
              <li>Recipients are locked in this phase for safety.</li>
              <li>Sepolia to OPNet: deposit from connected MetaMask, then claim mint to connected OP_WALLET.</li>
              <li>OPNet to Sepolia: request burn from connected OP_WALLET, then claim release to connected MetaMask.</li>
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
              <div className="mini-grid">
                <div>
                  <button
                    className="wallet-provider-logo-button"
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
                  <button
                    className="wallet-provider-logo-button"
                    onClick={ethConnected ? disconnectMetaMask : connectMetaMask}
                    aria-label={ethConnected ? 'Disconnect MetaMask' : 'Connect MetaMask'}
                    title={ethConnected ? 'Disconnect MetaMask' : 'Connect MetaMask (Sepolia)'}
                  >
                    <img className="wallet-provider-logo" src="/branding/metamask.svg" alt="MetaMask" />
                  </button>
                  <h3>MetaMask</h3>
                  <p><strong>Status:</strong> {ethWalletReady ? '✅ (Sepolia)' : ethConnected ? '❌ (Wrong network)' : '❌'}</p>
                  <p><strong>Address:</strong> <code>{short(ethAddress)}</code></p>
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
              <p className="eyebrow" id="faucet-dialog-title">Mint Test Tokens</p>
              <button type="button" onClick={() => setShowFaucetModal(false)}>Close</button>
            </div>
            <section className="flow-card faucet-modal-panel">
              <div className="card-head">
                <h2>Get Test Tokens (Sepolia Faucet)</h2>
                <span className={`pill ${faucetReady ? 'ok' : ''}`}>{faucetReady ? 'Ready' : 'Blocked'}</span>
              </div>
              <p className="muted">
                Testnet users should claim bridge-enabled tokens here before attempting deposit/withdraw flows.
              </p>
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
                  <h3>Token</h3>
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
                  <p>{faucetState?.claimCooldownSec != null ? `${faucetState.claimCooldownSec.toString()}s` : '-'}</p>
                </div>
                <div>
                  <h3>Next Claim At</h3>
                  <p>
                    {faucetState?.claimableAtSec != null
                      ? new Date(Number(faucetState.claimableAtSec) * 1000).toISOString()
                      : '-'}
                  </p>
                </div>
                <div>
                  <h3>Faucet Enabled</h3>
                  <p>
                    {faucetState?.faucetEnabled == null ? '-' : faucetState.faucetEnabled ? 'true' : 'false'}
                  </p>
                </div>
              </div>
              <div className="actions">
                <button
                  onClick={runClaimTestTokenFlow}
                  disabled={!faucetReady || !faucetConfigReady || faucetBusy}
                >
                  {faucetBusy ? 'Claiming…' : `Claim ${faucetAsset} Test Tokens`}
                </button>
                <button
                  onClick={() => void refreshFaucetState([faucetAsset as AssetSymbol])}
                  disabled={!faucetReady || !faucetConfigReady || faucetRefreshBusy}
                >
                  {faucetRefreshBusy ? 'Refreshing…' : 'Refresh Faucet State'}
                </button>
              </div>
              <p className={`notice ${faucetReady ? 'ok' : ''}`}>
                {faucetReady
                  ? faucetConfigReady
                    ? 'Faucet claim flow is enabled for the selected asset.'
                    : 'Selected asset token address is missing. Set VITE_ETHEREUM_*_ADDRESS.'
                  : 'Connect MetaMask on Sepolia to use faucet claims.'}
              </p>
              {faucetState?.error ? <p className="notice">Faucet read error: {faucetState.error}</p> : null}
              <pre className="log-box">{faucetStatus}</pre>
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
              <div className="card-head">
                <h2>Relayer API Status</h2>
                <span className={`pill ${statusApiState === 'ok' ? 'ok' : ''}`}>{statusApiState}</span>
              </div>
              <p className="muted">
                Polls <code>/health</code> and <code>/status</code> every 15s. Use lookups below to inspect bridge progress by
                deposit/withdrawal ID.
              </p>
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
                  <p>{statusApiMessage}</p>
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
                          <code>{relayer.relayerName}</code> <span className={`pill ${relayer.status === 'ok' ? 'ok' : ''}`}>{relayer.status}</span>
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
                    <input value={depositLookupId} onChange={(e) => setDepositLookupId(e.target.value)} placeholder="1" />
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
              <img className="brand-wordmark" src="/branding/heptad-wordmark.svg" alt="Heptad" />
              <p className="eyebrow">HEPTAD BRIDGE TESTNET LIVE</p>
              <div className="powered-by" aria-label="Powered by OPNet">
                <span>Powered by</span>
                <img src="/branding/opnet-logo.svg" alt="OPNet" />
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
            onClick={() => {
              setBridgeDirection('ethToBtc');
            }}
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
            onClick={() => {
              setBridgeDirection('btcToEth');
            }}
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
            <div className="actions">
              <button
                className="primary"
                onClick={() => openBridgeConfirm('ethToBtc')}
                disabled={!depositReady || !depositConfigReady || depositBusy}
              >
                {depositBusy ? 'Submitting Deposit…' : 'Bridge to Bitcoin'}
              </button>
            </div>
            <div className="actions">
              <button onClick={() => void refreshReadyMintCandidates()} disabled={readyMintCandidatesBusy}>
                {readyMintCandidatesBusy ? 'Refreshing…' : 'Refresh Ready Mints'}
              </button>
            </div>
            {readyMintCandidates.length === 0 ? (
              <p className="muted">No ready mint candidates loaded yet.</p>
            ) : (
              <ul className="heartbeat-list">
                {readyMintCandidates.map((candidate, index) => {
                  const id = String(candidate.depositId ?? candidate.mintSubmission?.nonce ?? '');
                  const amountLabel = formatCandidateAmount(candidate.mintSubmission?.assetId, candidate.mintSubmission?.amount);
                  return (
                    <li key={`${id || 'mint'}:${index}`}>
                      <code>depositId={id || '-'}</code> <span className="muted">{amountLabel}</span>
                      <div className="actions">
                        <button
                          onClick={() => void runClaimMintFlow(id)}
                          disabled={claimMintBusy || !claimMintReady || !id}
                        >
                          {claimMintBusy ? 'Submitting…' : 'Claim This Mint'}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <pre className="log-box">{depositStatus}</pre>
            <pre className="log-box">{claimMintStatus}</pre>
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
                      <span>{option.symbol}</span>
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
            <div className="actions">
              <button
                className="primary"
                onClick={() => openBridgeConfirm('btcToEth')}
                disabled={!burnReady || !burnConfigReady || burnBusy}
              >
                {burnBusy ? 'Submitting Burn…' : 'Withdraw to Ethereum'}
              </button>
            </div>
            <div className="actions">
              <button onClick={() => void refreshReadyReleaseCandidates()} disabled={readyReleaseCandidatesBusy}>
                {readyReleaseCandidatesBusy ? 'Refreshing…' : 'Refresh Ready Withdrawals'}
              </button>
            </div>
            {readyReleaseCandidates.length === 0 ? (
              <p className="muted">No ready release candidates loaded yet.</p>
            ) : (
              <ul className="heartbeat-list">
                {readyReleaseCandidates.map((candidate, index) => {
                  const id = String(candidate.withdrawalId ?? candidate.releaseSubmission?.withdrawalId ?? '');
                  const amountLabel = formatCandidateAmount(candidate.releaseSubmission?.assetId, candidate.releaseSubmission?.amount);
                  return (
                    <li key={`${id || 'release'}:${index}`}>
                      <code>withdrawalId={id || '-'}</code> <span className="muted">{amountLabel}</span>
                      <div className="actions">
                        <button
                          onClick={() => void runClaimReleaseFlow(id)}
                          disabled={claimReleaseBusy || !claimReleaseReady || !id}
                        >
                          {claimReleaseBusy ? 'Submitting…' : 'Claim This Withdraw'}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <pre className="log-box">{burnStatus}</pre>
            <pre className="log-box">{claimReleaseStatus}</pre>
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
                ? 'MetaMask will ask you to approve token spend first, then confirm the bridge deposit transaction.'
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

      </main>
    </>
  );
}
