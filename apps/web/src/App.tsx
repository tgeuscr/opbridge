import { useEffect, useMemo, useRef, useState } from 'react';
import { networks } from '@btc-vision/bitcoin';
import { SupportedWallets, useWalletConnect } from '@btc-vision/walletconnect';
import {
  Address,
  MLDSASecurityLevel,
  QuantumBIP32Factory,
  UnisatSigner,
} from '@btc-vision/transaction';
import { JSONRpcProvider, getContract } from 'opnet';
import { ASSET_CONFIGS, SUPPORTED_ASSETS } from '@opbridge/shared';
import OpBridgeBridgeAbi from './abi/OpBridgeBridge.abi';
import BridgeWrappedTokenAbi from './abi/BridgeWrappedToken.abi';
import OP20ReadAbi from './abi/OP20Read.abi';
import defaultSepoliaDeployment from './dev-sepolia-latest.json';

class OPWalletSigner extends UnisatSigner {
  public override get unisat() {
    const module = (window as Window & { opnet?: unknown }).opnet;
    if (!module) {
      throw new Error('OP_WALLET extension not found');
    }

    return module as any;
  }
}

type NetworkMode = 'testnet' | 'regtest' | 'mainnet';
type DevToolTab = 'opnet' | 'ethereum' | 'ops';
type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  isMetaMask?: boolean;
  providers?: EthereumProvider[];
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};
type EthereumRpcError = {
  code?: number;
  message?: string;
  data?: unknown;
  cause?: unknown;
};

type BridgeState = {
  paused?: boolean;
  threshold?: number;
  relayCount?: number;
  relayPubKeyHashes?: string[];
  owner?: string;
  ethereumVault?: string;
  activeAttestationVersion?: number;
  activeAttestationVersionAccepted?: boolean;
};

type BridgeAssetConfig = {
  assetId: number;
  symbol: string;
  decimals: number;
  token: string;
};

type DeploymentJsonPayload = {
  vaultAddress?: string;
  rpcUrl?: string;
  assets?: Array<{ symbol?: string; tokenAddress?: string }>;
  ethereum?: {
    vaultAddress?: string;
    assets?: Array<{ symbol?: string; tokenAddress?: string }>;
    rpcUrl?: string;
  };
  opnet?: {
    bridgeAddress?: string;
    wrappedTokens?: Record<string, string>;
  };
};

type TxParams = {
  signer: unknown;
  mldsaSigner: null;
  refundTo: string;
  maximumAllowedSatToSpend: bigint;
  feeRate: number;
  network: unknown;
};

type CallResult<TProps = Record<string, unknown>> = {
  properties: TProps;
  revert?: string;
  estimatedGas?: bigint;
  sendTransaction: (params: TxParams) => Promise<unknown>;
};

type OpBridgeBridgeContract = {
  paused: () => Promise<CallResult<{ paused: boolean }>>;
  relayThreshold: () => Promise<CallResult<{ requiredSignatures: number }>>;
  relayCount: () => Promise<CallResult<{ relayCount: number }>>;
  relayPubKeyHashAt: (relayIndex: number) => Promise<CallResult<{ relayPubKeyHash: string }>>;
  supportedAssetCount: () => Promise<CallResult<{ count: number }>>;
  supportedAssetAt: (
    index: number,
  ) => Promise<CallResult<{ assetId: number; token: string; decimals: number; symbol: Uint8Array }>>;
  owner: () => Promise<CallResult<{ owner: string }>>;
  wrappedToken: (asset: number) => Promise<CallResult<{ token: string }>>;
  computeMintAttestationHash: (
    asset: number,
    ethereumUser: unknown,
    recipient: unknown,
    amount: bigint,
    depositId: bigint,
    attestationVersion: number,
  ) => Promise<CallResult<{ messageHash: Uint8Array }>>;
  mintWithRelaySignatures: (
    asset: number,
    ethereumUser: unknown,
    recipient: unknown,
    amount: bigint,
    depositId: bigint,
    attestationVersion: number,
    relayIndexesPacked: Uint8Array,
    relaySignaturesPacked: Uint8Array,
  ) => Promise<CallResult>;
  requestBurn: (
    asset: number,
    from: unknown,
    ethereumRecipient: unknown,
    amount: bigint,
  ) => Promise<CallResult>;
  setWrappedToken: (asset: number, token: unknown) => Promise<CallResult>;
  setRelayPubKey: (relayIndex: number, relayPubKey: Uint8Array) => Promise<CallResult>;
  setRelayPubKeysPacked: (relayPubKeysPacked: Uint8Array) => Promise<CallResult>;
  setRelaysConfigPacked: (relayPubKeysPacked: Uint8Array, newThreshold: number) => Promise<CallResult>;
  setRelayCount: (newRelayCount: number) => Promise<CallResult>;
  setRelayThreshold: (newThreshold: number) => Promise<CallResult>;
  setSupportedAssetsPacked: (assetsPacked: Uint8Array) => Promise<CallResult>;
  removeSupportedAsset: (asset: number) => Promise<CallResult>;
  removeSupportedAssetsPacked: (assetIdsPacked: Uint8Array) => Promise<CallResult>;
  setPaused: (paused: boolean) => Promise<CallResult>;
  setEthereumVault: (ethereumVault: unknown) => Promise<CallResult>;
  ethereumVault: () => Promise<CallResult<{ ethereumVault: string }>>;
  activeAttestationVersion: () => Promise<CallResult<{ version: number }>>;
  isAttestationVersionAccepted: (version: number) => Promise<CallResult<{ accepted: boolean }>>;
  setAttestationVersionAccepted: (version: number, accepted: boolean) => Promise<CallResult>;
  setActiveAttestationVersion: (version: number) => Promise<CallResult>;
  transferOwnership: (newOwner: unknown) => Promise<CallResult>;
};

type BridgeWrappedTokenContract = {
  setBridgeAuthority: (newBridge: unknown) => Promise<CallResult>;
  setPaused: (paused: boolean) => Promise<CallResult>;
  bridgeAuthority: () => Promise<CallResult<{ bridgeAuthority: string }>>;
  paused: () => Promise<CallResult<{ paused: boolean }>>;
  owner: () => Promise<CallResult<{ owner: string }>>;
  transferOwnership: (newOwner: unknown) => Promise<CallResult>;
};

type OP20ReadContract = {
  balanceOf: (owner: unknown) => Promise<CallResult<{ balance: bigint }>>;
};

type OpsRelayerStatus = {
  relayerName: string;
  role: string;
  status: string;
  detail?: string | null;
  updatedAt?: string;
  ageMs?: number | null;
  isStale?: boolean;
  derivedStatus?: string;
};

type OpsCandidate = {
  depositId?: string;
  withdrawalId?: string;
  ready?: boolean;
  processed?: boolean | number;
  updatedAt?: string;
  amount?: string;
  ethereumUser?: string;
  ethereumRecipient?: string;
  recipientHash?: string;
  opnetUser?: string;
};

const RPC_URLS: Record<NetworkMode, string> = {
  testnet: 'https://testnet.opnet.org',
  regtest: 'https://regtest.opnet.org',
  mainnet: 'https://mainnet.opnet.org',
};
const DEFAULT_STATUS_API_URL = import.meta.env.VITE_STATUS_API_URL?.trim() || '';

const DEFAULT_ASSET = '';
const EMPTY_ASSET_TOKEN_ADDRESSES: Record<string, string> = Object.fromEntries(
  SUPPORTED_ASSETS.map((asset) => [asset, '']),
) as Record<string, string>;

const EMPTY_BYTES = new Uint8Array(0);
const ZERO_CHAIN_CODE = new Uint8Array(32);
const MAX_RELAY_COUNT = 32;
const RELAY_SIGNATURE_BYTES = 2420;
const DEFAULT_RELAY_COUNT = 0;
const DEFAULT_RELAY_THRESHOLD = 0;
const DEFAULT_DEV_RELAY_KEY_SLOTS = 3;
const ASSET_SYMBOL_BYTES = 16;
const ATTESTATION_VERSION = 1;
const DIRECTION_ETH_TO_OP_MINT = 1;
const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7';
const ERC20_APPROVE_SELECTOR = '0x095ea7b3';
const VAULT_DEPOSIT_ERC20_SELECTOR = '0x1eaa9083';

function short(value: string | null | undefined): string {
  if (!value) return '-';
  if (value.length < 14) return value;
  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

function formatAgeMs(ageMs: number | null | undefined): string {
  if (ageMs == null || !Number.isFinite(ageMs)) return '-';
  if (ageMs < 1000) return `${Math.round(ageMs)}ms`;
  const seconds = Math.round(ageMs / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  return `${hours}h`;
}

function readHeartbeatHeads(detail: string | null | undefined): { lastBlock: string; claimFromBlock: string } {
  if (!detail) {
    return { lastBlock: '-', claimFromBlock: '-' };
  }

  try {
    const parsed = JSON.parse(detail) as { currentHead?: unknown; finalizedHead?: unknown };
    const currentHead =
      typeof parsed.currentHead === 'number' || typeof parsed.currentHead === 'string'
        ? String(parsed.currentHead)
        : '-';
    const finalizedHead =
      typeof parsed.finalizedHead === 'number' || typeof parsed.finalizedHead === 'string'
        ? String(parsed.finalizedHead)
        : '-';
    return { lastBlock: currentHead, claimFromBlock: finalizedHead };
  } catch {
    return { lastBlock: '-', claimFromBlock: '-' };
  }
}

function parseHexAddress(raw: string, fieldName: string): Address {
  const value = raw.trim();
  if (!value) {
    throw new Error(`${fieldName} is required.`);
  }

  try {
    return Address.fromString(value);
  } catch (error) {
    throw new Error(`${fieldName} is invalid: ${(error as Error).message}`);
  }
}

function parseHumanAmount(raw: string, decimals: number): bigint {
  const value = raw.trim();
  if (!value) {
    throw new Error('Amount is required.');
  }

  if (!/^\d+(\.\d+)?$/.test(value)) {
    throw new Error('Amount must be a positive decimal number.');
  }

  const [wholePart, fractionalPartRaw = ''] = value.split('.');
  if (fractionalPartRaw.length > decimals) {
    throw new Error(`Too many decimal places. ${decimals} max for selected asset.`);
  }

  const fractionalPart = fractionalPartRaw.padEnd(decimals, '0');
  const combined = `${wholePart}${fractionalPart}`.replace(/^0+/, '') || '0';
  return BigInt(combined);
}

function formatHumanAmount(raw: bigint, decimals: number): string {
  if (decimals === 0) return raw.toString();

  const sign = raw < 0n ? '-' : '';
  const abs = raw < 0n ? -raw : raw;
  const base = 10n ** BigInt(decimals);
  const whole = abs / base;
  const fractional = abs % base;

  if (fractional === 0n) {
    return `${sign}${whole.toString()}`;
  }

  const fractionalText = fractional.toString().padStart(decimals, '0').replace(/0+$/, '');
  return `${sign}${whole.toString()}.${fractionalText}`;
}

function padHexToBytes(hexWithoutPrefix: string, bytes: number): string {
  if (hexWithoutPrefix.length > bytes * 2) {
    throw new Error(`Hex value exceeds ${bytes} bytes.`);
  }
  return hexWithoutPrefix.padStart(bytes * 2, '0');
}

function normalizeEthereumAddress(raw: string, fieldName: string): string {
  const value = raw.trim();
  if (!value) {
    throw new Error(`${fieldName} is required.`);
  }
  if (!/^0x[0-9a-fA-F]{40}$/.test(value)) {
    throw new Error(`${fieldName} must be a valid 20-byte hex address. received="${value}"`);
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

function buildApproveCalldata(spender: string, amount: bigint): string {
  return `${ERC20_APPROVE_SELECTOR}${encodeAddressWord(spender)}${encodeUintWord(amount)}`;
}

function buildDepositErc20Calldata(assetId: number, amount: bigint, recipient: string): string {
  if (!Number.isInteger(assetId) || assetId < 0 || assetId > 255) {
    throw new Error('Asset ID must be an integer in [0,255].');
  }
  return `${VAULT_DEPOSIT_ERC20_SELECTOR}${encodeUintWord(assetId)}${encodeUintWord(amount)}${encodeBytes32Word(recipient)}`;
}

function buildBalanceOfCalldata(owner: string): string {
  return `0x70a08231${encodeAddressWord(owner)}`;
}

function formatEthereumError(error: unknown): string {
  const err = error as EthereumRpcError;
  const message = err?.message || (error instanceof Error ? error.message : String(error));
  const code = typeof err?.code === 'number' ? ` code=${err.code}` : '';
  const data = typeof err?.data === 'undefined' ? '' : ` data=${JSON.stringify(err.data)}`;
  const cause =
    typeof err?.cause === 'undefined'
      ? ''
      : ` cause=${err.cause instanceof Error ? err.cause.message : String(err.cause)}`;

  if (message === 'Failed to fetch') {
    return `${message}${code}${data}${cause}. Hint: wallet/provider network call failed (extension locked, wallet RPC unavailable, blocked extension request, or browser privacy shield).`;
  }
  return `${message}${code}${data}${cause}`;
}

function parseDepositId(raw: string): bigint {
  const value = raw.trim();
  if (!/^\d+$/.test(value)) {
    throw new Error('Deposit ID must be a non-negative integer.');
  }

  return BigInt(value);
}

function bytesToHex(bytes: Uint8Array): string {
  return `0x${Array.from(bytes)
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')}`;
}

function hexToBytes(raw: string, expectedLength?: number): Uint8Array {
  const value = raw.trim().toLowerCase();
  if (!value) {
    throw new Error('Hex string is required.');
  }

  const normalized = value.startsWith('0x') ? value.slice(2) : value;
  if (!/^[0-9a-f]+$/.test(normalized) || normalized.length % 2 !== 0) {
    throw new Error('Invalid hex string.');
  }

  const result = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < result.length; i++) {
    result[i] = Number.parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }

  if (typeof expectedLength === 'number' && result.length !== expectedLength) {
    throw new Error(`Expected ${expectedLength} bytes but got ${result.length}.`);
  }

  return result;
}

function leftPadTo32(bytes: Uint8Array, fieldName: string): Uint8Array {
  if (bytes.length > 32) {
    throw new Error(`${fieldName} exceeds 32 bytes.`);
  }
  if (bytes.length === 32) {
    return bytes;
  }
  const padded = new Uint8Array(32);
  padded.set(bytes, 32 - bytes.length);
  return padded;
}

function resolveWord32Bytes(raw: string, fieldName: string): Uint8Array {
  const value = raw.trim();
  if (!value) {
    throw new Error(`${fieldName} is required.`);
  }

  if (value.startsWith('0x')) {
    const rawHex = hexToBytes(value);
    if (rawHex.length !== 20 && rawHex.length !== 32) {
      throw new Error(`${fieldName} must be 20 or 32 bytes.`);
    }
    return leftPadTo32(rawHex, fieldName);
  }

  return leftPadTo32(hexToBytes(parseHexAddress(value, fieldName).toHex(), 32), fieldName);
}

function bytesToAddressWord(bytes: Uint8Array, fieldName: string): Address {
  return parseHexAddress(bytesToHex(leftPadTo32(bytes, fieldName)), fieldName);
}

function concatBytes(parts: Uint8Array[]): Uint8Array {
  const totalLength = parts.reduce((acc, part) => acc + part.length, 0);
  const output = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}

function symbolToBytes(symbol: string): Uint8Array {
  const trimmed = symbol.trim();
  if (!trimmed) {
    throw new Error('Asset symbol is required.');
  }
  const encoded = new TextEncoder().encode(trimmed);
  if (encoded.length > ASSET_SYMBOL_BYTES) {
    throw new Error(`Asset symbol too long (max ${ASSET_SYMBOL_BYTES} bytes).`);
  }
  const padded = new Uint8Array(ASSET_SYMBOL_BYTES);
  padded.set(encoded);
  return padded;
}

function bytesToSymbol(bytes: Uint8Array): string {
  let length = bytes.length;
  while (length > 0 && bytes[length - 1] === 0) {
    length -= 1;
  }
  return new TextDecoder().decode(bytes.slice(0, length));
}

function u256ToBytes(value: bigint): Uint8Array {
  if (value < 0n) {
    throw new Error('u256 value cannot be negative.');
  }

  const bytes = new Uint8Array(32);
  let current = value;
  for (let i = 31; i >= 0; i--) {
    bytes[i] = Number(current & 0xffn);
    current >>= 8n;
  }

  if (current !== 0n) {
    throw new Error('Value exceeds u256 range.');
  }

  return bytes;
}

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    }),
  ]);
}

export function App() {
  const {
    openConnectModal,
    connectToWallet,
    disconnect,
    walletType,
    walletAddress,
    publicKey,
    hashedMLDSAKey,
    address: opnetAddress,
    network: walletNetwork,
    signer,
    provider: walletProvider,
    connecting,
  } = useWalletConnect();

  const [networkMode, setNetworkMode] = useState<NetworkMode>('regtest');
  const [devToolTab, setDevToolTab] = useState<DevToolTab>('opnet');
  const [statusApiUrl, setStatusApiUrl] = useState(DEFAULT_STATUS_API_URL);
  const [opsStatusState, setOpsStatusState] = useState<'idle' | 'loading' | 'ok' | 'error'>(
    DEFAULT_STATUS_API_URL ? 'loading' : 'idle',
  );
  const [opsStatusMessage, setOpsStatusMessage] = useState('No relayer API check yet.');
  const [opsStatusUpdatedAt, setOpsStatusUpdatedAt] = useState('');
  const [opsStatusSummary, setOpsStatusSummary] = useState<Record<string, unknown> | null>(null);
  const [opsRelayerHealth, setOpsRelayerHealth] = useState<Record<string, unknown> | null>(null);
  const [opsRelayers, setOpsRelayers] = useState<OpsRelayerStatus[]>([]);
  const [opsMintCandidates, setOpsMintCandidates] = useState<OpsCandidate[]>([]);
  const [opsReleaseCandidates, setOpsReleaseCandidates] = useState<OpsCandidate[]>([]);
  const [bridgeAddress, setBridgeAddress] = useState('');
  const [asset, setAsset] = useState<string>(DEFAULT_ASSET);
  const [dummyAsset, setDummyAsset] = useState<string>(DEFAULT_ASSET);
  const [mintAsset, setMintAsset] = useState<string>(DEFAULT_ASSET);
  const [amount, setAmount] = useState('1');
  const [dummyAmount, setDummyAmount] = useState('1');
  const [mintAmount, setMintAmount] = useState('1');
  const [depositId, setDepositId] = useState('1');
  const [dummyDepositId, setDummyDepositId] = useState('1');
  const [mintDepositId, setMintDepositId] = useState('1');
  const [burnEthereumRecipientAddress, setBurnEthereumRecipientAddress] = useState('');
  const [dummyEthereumUserAddress, setDummyEthereumUserAddress] = useState('');
  const [mintEthereumUserAddress, setMintEthereumUserAddress] = useState('');
  const [mintAttestationVersionInput, setMintAttestationVersionInput] = useState(`${ATTESTATION_VERSION}`);
  const [dummyRecipientAddress, setDummyRecipientAddress] = useState('');
  const [mintRecipientAddress, setMintRecipientAddress] = useState('');
  const [assetTokenAddresses, setAssetTokenAddresses] = useState<Record<string, string>>(
    EMPTY_ASSET_TOKEN_ADDRESSES,
  );
  const [bridgeAssets, setBridgeAssets] = useState<BridgeAssetConfig[]>([]);
  const [assetsConfigJsonInput, setAssetsConfigJsonInput] = useState(
    JSON.stringify(
      ASSET_CONFIGS.map((entry) => ({
        assetId: entry.assetId,
        token: '',
        symbol: entry.symbol,
        decimals: entry.decimals,
      })),
      null,
      2,
    ),
  );
  const [maxSatSpend, setMaxSatSpend] = useState('20000');
  const [feeRate, setFeeRate] = useState('2');
  const [bridgeState, setBridgeState] = useState<BridgeState>({});
  const [bridgeStateTab, setBridgeStateTab] = useState<'summary' | 'assets' | 'relays'>('summary');
  const [showAllRelayPreviewKeys, setShowAllRelayPreviewKeys] = useState(false);
  const [output, setOutput] = useState<string>('No actions run yet.');
  const [newOwnerAddress, setNewOwnerAddress] = useState('');
  const [resolvedBridgeAddress, setResolvedBridgeAddress] = useState('');
  const [relayIndexInput, setRelayIndexInput] = useState('0');
  const [relayCountInput, setRelayCountInput] = useState('0');
  const [relayThresholdInput, setRelayThresholdInput] = useState('0');
  const [attestationVersionInput, setAttestationVersionInput] = useState(`${ATTESTATION_VERSION}`);
  const [attestationVersionAcceptedInput, setAttestationVersionAcceptedInput] = useState(true);
  const [removeAssetIdInput, setRemoveAssetIdInput] = useState('0');
  const [removeAssetIdsInput, setRemoveAssetIdsInput] = useState('[0]');
  const [relayPubKeyInput, setRelayPubKeyInput] = useState('');
  const [relayPubKeysPackedInput, setRelayPubKeysPackedInput] = useState('');
  const [relayDataJsonInput, setRelayDataJsonInput] = useState(
    JSON.stringify(
      {
        relayCount: 0,
        relayPubKeysPacked: '',
        relayPrivateKeys: [''],
      },
      null,
      2,
    ),
  );
  const [tokenContractAddress, setTokenContractAddress] = useState('');
  const [tokenBridgeAuthorityAddress, setTokenBridgeAuthorityAddress] = useState('');
  const [tokenBridgeAuthorityRead, setTokenBridgeAuthorityRead] = useState('');
  const [tokenOwnerAddress, setTokenOwnerAddress] = useState('');
  const [tokenOwnerRead, setTokenOwnerRead] = useState('');
  const [tokenPausedRead, setTokenPausedRead] = useState<string>('');
  const [resolvedTokenContractAddress, setResolvedTokenContractAddress] = useState('');
  const [fallbackSigner, setFallbackSigner] = useState<UnisatSigner | null>(null);
  const [fallbackSignerError, setFallbackSignerError] = useState<string | null>(null);
  const [pendingDepositIds, setPendingDepositIds] = useState<string[]>([]);
  const [dummyAttestationHashInput, setDummyAttestationHashInput] = useState('');
  const [mintAttestationHashInput, setMintAttestationHashInput] = useState('');
  const [relayPrivateKeysInput, setRelayPrivateKeysInput] = useState<string[]>(
    () => Array.from({ length: DEFAULT_DEV_RELAY_KEY_SLOTS }, () => ''),
  );
  const [mintRelaySignatures, setMintRelaySignatures] = useState<Uint8Array[]>(
    () => [],
  );
  const [mintRelayPubKeys, setMintRelayPubKeys] = useState<Uint8Array[]>(
    () => [],
  );
  const [mintRelayIndexes, setMintRelayIndexes] = useState<number[]>([]);
  const [mintSelectedRelayIndexes, setMintSelectedRelayIndexes] = useState<number[]>([]);
  const [mintSignatureCountInput, setMintSignatureCountInput] = useState<string>(
    DEFAULT_RELAY_THRESHOLD.toString(),
  );
  const [mintSignatureSource, setMintSignatureSource] = useState<string>('none');
  const [dummyBuiltMessageHash, setDummyBuiltMessageHash] = useState<string>('');
  const [dummyRelaySignatures, setDummyRelaySignatures] = useState<Uint8Array[]>(
    () => [],
  );
  const [dummyRelayPubKeys, setDummyRelayPubKeys] = useState<Uint8Array[]>(
    () => [],
  );
  const [dummyRelayIndexes, setDummyRelayIndexes] = useState<number[]>([]);
  const [burnMaxLoading, setBurnMaxLoading] = useState(false);
  const [selectedAssetBalanceRaw, setSelectedAssetBalanceRaw] = useState<string>('-');
  const [selectedAssetBalanceHuman, setSelectedAssetBalanceHuman] = useState<string>('-');
  const [selectedAssetBalanceLoading, setSelectedAssetBalanceLoading] = useState(false);
  const [ethereumWalletAddress, setEthereumWalletAddress] = useState('');
  const [ethereumChainId, setEthereumChainId] = useState('');
  const [ethereumBalanceEth, setEthereumBalanceEth] = useState('-');
  const [ethereumRpcUrl, setEthereumRpcUrl] = useState('https://eth-sepolia.g.alchemy.com/v2/<ALCHEMY_API_KEY>');
  const [deploymentJsonInput, setDeploymentJsonInput] = useState('');
  const relayJsonFileInputRef = useRef<HTMLInputElement | null>(null);
  const deploymentJsonFileInputRef = useRef<HTMLInputElement | null>(null);
  const mintCandidateJsonFileInputRef = useRef<HTMLInputElement | null>(null);
  const [mintCandidateJsonInput, setMintCandidateJsonInput] = useState('');
  const [ethereumVaultAddress, setEthereumVaultAddress] = useState('');
  const [ethereumTokenAddresses, setEthereumTokenAddresses] = useState<Record<string, string>>({
    USDT: '',
    WBTC: '',
    WETH: '',
    PAXG: '',
  });
  const [ethereumDepositAsset, setEthereumDepositAsset] = useState<'USDT' | 'WBTC' | 'WETH' | 'PAXG'>('USDT');
  const [ethereumDepositAmount, setEthereumDepositAmount] = useState('1');
  const [ethereumDepositRecipient, setEthereumDepositRecipient] = useState('');
  const [ethereumDepositRunning, setEthereumDepositRunning] = useState(false);
  const [ethereumDepositBalanceRaw, setEthereumDepositBalanceRaw] = useState('-');
  const [ethereumDepositBalanceHuman, setEthereumDepositBalanceHuman] = useState('-');
  const [opnetWrappedAddresses, setOpnetWrappedAddresses] = useState<Record<string, string>>({
    USDT: '',
    WBTC: '',
    WETH: '',
    PAXG: '',
  });
  const bridgeAssetBySymbol = useMemo(
    () => new Map(bridgeAssets.map((entry) => [entry.symbol, entry])),
    [bridgeAssets],
  );
  const availableAssets = bridgeAssets.map((entry) => entry.symbol);
  const resolveAssetId = (symbol: string): number => {
    const fromBridge = bridgeAssetBySymbol.get(symbol)?.assetId;
    if (typeof fromBridge === 'number') return fromBridge;
    throw new Error(`Asset ${symbol} is not configured.`);
  };
  const resolveAssetDecimals = (symbol: string): number => {
    const fromBridge = bridgeAssetBySymbol.get(symbol)?.decimals;
    if (typeof fromBridge === 'number') return fromBridge;
    throw new Error(`Decimals for asset ${symbol} are not configured.`);
  };
  const safeAssetDecimals = (symbol: string): string => {
    try {
      return resolveAssetDecimals(symbol).toString();
    } catch {
      return '-';
    }
  };
  const rawAmountPreview = useMemo(() => {
    try {
      return parseHumanAmount(amount, resolveAssetDecimals(asset)).toString();
    } catch {
      return 'invalid';
    }
  }, [amount, asset]);
  const dummyRawAmountPreview = useMemo(() => {
    try {
      return parseHumanAmount(dummyAmount, resolveAssetDecimals(dummyAsset)).toString();
    } catch {
      return 'invalid';
    }
  }, [dummyAmount, dummyAsset]);
  const mintRawAmountPreview = useMemo(() => {
    try {
      return parseHumanAmount(mintAmount, resolveAssetDecimals(mintAsset)).toString();
    } catch {
      return 'invalid';
    }
  }, [mintAmount, mintAsset]);
  const selectedAssetTokenAddress = (assetTokenAddresses[asset] ?? '').trim();
  const activeRelayCount = Math.max(
    0,
    Math.min(MAX_RELAY_COUNT, bridgeState.relayCount ?? DEFAULT_RELAY_COUNT),
  );
  const activeRelayThreshold = Math.max(
    0,
    Math.min(activeRelayCount, bridgeState.threshold ?? DEFAULT_RELAY_THRESHOLD),
  );
  const relayPreview = useMemo(() => {
    const raw = relayPubKeysPackedInput.trim();
    if (!raw) {
      return { entries: [] as string[], error: '' };
    }

    try {
      const packed = hexToBytes(raw);
      if (packed.length % 1312 !== 0) {
        throw new Error('Packed relay pubkeys length must be a multiple of 1312 bytes.');
      }

      const count = packed.length / 1312;
      const keys: string[] = [];
      for (let i = 0; i < count; i++) {
        keys.push(bytesToHex(packed.slice(i * 1312, (i + 1) * 1312)));
      }
      return { entries: keys, error: '' };
    } catch (error) {
      return { entries: [] as string[], error: (error as Error).message };
    }
  }, [relayPubKeysPackedInput]);
  const relayPreviewKeysVisible = showAllRelayPreviewKeys
    ? relayPreview.entries
    : relayPreview.entries.slice(0, 8);
  const relayKeyInputSlots = Math.max(DEFAULT_DEV_RELAY_KEY_SLOTS, activeRelayCount);

  useEffect(() => {
    setRelayPrivateKeysInput((prev) => {
      if (prev.length >= relayKeyInputSlots) return prev;
      return [...prev, ...Array.from({ length: relayKeyInputSlots - prev.length }, () => '')];
    });
  }, [relayKeyInputSlots]);

  const readNetwork =
    networkMode === 'mainnet'
      ? networks.bitcoin
      : networkMode === 'testnet'
        ? networks.opnetTestnet
        : networks.regtest;
  const bridgeInput = bridgeAddress.trim();
  const tokenInput = tokenContractAddress.trim();
  // Use user-provided op... addresses directly for contract calls.
  // Keep resolved hex for debug display and for address-typed calldata fields.
  const bridgeContractTarget = bridgeInput;
  const tokenContractTarget = tokenInput;
  const readProvider = useMemo(
    () => new JSONRpcProvider({ url: RPC_URLS[networkMode], network: readNetwork }),
    [networkMode, readNetwork],
  );

  const resolveAddressToHex = async (
    raw: string,
    isContract: boolean,
    allowContractFallback = true,
  ): Promise<string> => {
    const value = raw.trim();
    if (!value) {
      throw new Error('Address is required.');
    }

    if (value.startsWith('op')) {
      const resolveFor = async (contractMode: boolean): Promise<string> => {
        const resolved = await withTimeout(
          readProvider.getPublicKeyInfo(value, contractMode),
          10000,
          'Address resolution',
        );
        return resolved.toHex();
      };

      try {
        return await resolveFor(isContract);
      } catch (primaryError) {
        if (!isContract || !allowContractFallback) {
          throw primaryError;
        }

        // Some RPC nodes may not return contract-mode key info immediately.
        return await resolveFor(false);
      }
    }

    return parseHexAddress(value, 'address').toHex();
  };

  const resolveAddressForAbi = async (raw: string, isContract: boolean): Promise<unknown> => {
    const hex = await resolveAddressToHex(raw, isContract);
    return parseHexAddress(hex, 'address');
  };

  const resolveConnectedSender = async (): Promise<Address | null> => {
    if (!opnetAddress) return null;

    // Prefer the wallet-provided OP_NET address object directly.
    if (typeof (opnetAddress as any).equals === 'function' && typeof (opnetAddress as any).toHex === 'function') {
      return opnetAddress as unknown as Address;
    }

    const raw = typeof (opnetAddress as any).toHex === 'function'
      ? ((opnetAddress as any).toHex() as string)
      : String(opnetAddress);

    if (raw.startsWith('0x')) {
      return parseHexAddress(raw, 'sender');
    }

    const senderHex = await resolveAddressToHex(raw, false);
    return parseHexAddress(senderHex, 'sender');
  };

  const sha256Bytes = async (data: Uint8Array): Promise<Uint8Array> => {
    const normalized = new Uint8Array(data);
    const digest = await crypto.subtle.digest('SHA-256', normalized.buffer);
    return new Uint8Array(digest);
  };

  const buildMintAttestationHash = async (
    targetAsset: string,
    ethereumUser: Uint8Array,
    recipient: Address,
    rawAmount: bigint,
    parsedDepositId: bigint,
    attestationVersion: number,
  ): Promise<Uint8Array> => {
    if (!bridgeInput) {
      throw new Error('Bridge contract address is required. Set Bridge Contract Address first.');
    }
    if (!ethereumVaultAddress.trim()) {
      throw new Error('Ethereum vault address is required. Set Ethereum Vault Address first.');
    }

    const ethereumVaultBytes = resolveWord32Bytes(ethereumVaultAddress, 'ethereum vault');
    const opnetBridgeBytes = resolveWord32Bytes(
      resolvedBridgeAddress || bridgeInput,
      'bridge address',
    );
    if (ethereumUser.length !== 32) {
      throw new Error(`ethereum user must be 32 bytes; got ${ethereumUser.length}`);
    }
    const recipientBytes = resolveWord32Bytes(recipient.toHex(), 'recipient');

    const payload = concatBytes([
      new Uint8Array([attestationVersion]),
      ethereumVaultBytes,
      opnetBridgeBytes,
      ethereumUser,
      recipientBytes,
      new Uint8Array([resolveAssetId(targetAsset)]),
      u256ToBytes(rawAmount),
      new Uint8Array([DIRECTION_ETH_TO_OP_MINT]),
      u256ToBytes(parsedDepositId),
    ]);

    return sha256Bytes(payload);
  };

  const parseAttestationVersion = (raw: string): number => {
    const value = raw.trim();
    if (!/^\d+$/.test(value)) {
      throw new Error('Attestation version must be a non-negative integer.');
    }
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 0 || parsed > 255) {
      throw new Error('Attestation version must be an integer in [0,255].');
    }
    return parsed;
  };

  const resolveEthereumUserAddress = (raw: string): Uint8Array => {
    const value = raw.trim() || ethereumWalletAddress.trim();
    if (!value) {
      throw new Error('Ethereum user is required (set input or connect Ethereum wallet).');
    }
    return resolveWord32Bytes(value, 'ethereum user');
  };

  const parseAttestationVersionAdminInput = (raw: string): number => {
    const value = raw.trim();
    if (!/^\d+$/.test(value)) {
      throw new Error('Attestation version must be a non-negative integer.');
    }
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 0 || parsed > 255) {
      throw new Error('Attestation version must be an integer in [0,255].');
    }
    return parsed;
  };

  const resolveRecipientAddress = async (raw: string): Promise<Address | null> => {
    if (raw.trim()) {
      const resolvedRecipient = await resolveAddressForAbi(raw.trim(), false);
      return resolvedRecipient as Address;
    }

    return resolveConnectedSender();
  };

  const readBridge = useMemo(() => {
    if (!bridgeContractTarget) return null;

    try {
      return getContract(
        bridgeContractTarget,
        OpBridgeBridgeAbi as any,
        readProvider,
        readNetwork
      ) as unknown as OpBridgeBridgeContract;
    } catch {
      return null;
    }
  }, [bridgeContractTarget, readProvider, readNetwork]);

  const writeBridge = useMemo(() => {
    if (!bridgeContractTarget || !walletProvider) return null;

    try {
      return getContract(
        bridgeContractTarget,
        OpBridgeBridgeAbi as any,
        walletProvider as any,
        readNetwork
      ) as unknown as OpBridgeBridgeContract;
    } catch {
      return null;
    }
  }, [bridgeContractTarget, walletProvider, readNetwork]);

  const readWrappedToken = useMemo(() => {
    if (!tokenContractTarget) return null;

    try {
      return getContract(
        tokenContractTarget,
        BridgeWrappedTokenAbi as any,
        readProvider,
        readNetwork
      ) as unknown as BridgeWrappedTokenContract;
    } catch {
      return null;
    }
  }, [tokenContractTarget, readProvider, readNetwork]);

  const writeWrappedToken = useMemo(() => {
    if (!tokenContractTarget || !walletProvider) return null;

    try {
      return getContract(
        tokenContractTarget,
        BridgeWrappedTokenAbi as any,
        walletProvider as any,
        readNetwork
      ) as unknown as BridgeWrappedTokenContract;
    } catch {
      return null;
    }
  }, [tokenContractTarget, walletProvider, readNetwork]);

  useEffect(() => {
    if (!bridgeAddress.trim()) {
      setResolvedBridgeAddress('');
      return;
    }

    void (async () => {
      try {
        const resolved = await resolveAddressToHex(bridgeAddress, true);
        setResolvedBridgeAddress(resolved);
      } catch {
        setResolvedBridgeAddress('');
      }
    })();
  }, [bridgeAddress, networkMode]);

  useEffect(() => {
    if (!tokenContractAddress.trim()) {
      setResolvedTokenContractAddress('');
      return;
    }

    void (async () => {
      try {
        const resolved = await resolveAddressToHex(tokenContractAddress, true);
        setResolvedTokenContractAddress(resolved);
      } catch {
        setResolvedTokenContractAddress('');
      }
    })();
  }, [tokenContractAddress, networkMode]);

  useEffect(() => {
    if (availableAssets.length === 0) return;
    if (!availableAssets.includes(asset)) {
      setAsset(availableAssets[0]);
    }
    if (!availableAssets.includes(dummyAsset)) {
      setDummyAsset(availableAssets[0]);
    }
    if (!availableAssets.includes(mintAsset)) {
      setMintAsset(availableAssets[0]);
    }
  }, [availableAssets, asset, dummyAsset, mintAsset]);

  useEffect(() => {
    let active = true;

    const initFallbackSigner = async (): Promise<void> => {
      if (!walletAddress || signer || walletType !== SupportedWallets.OP_WALLET) {
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
        setFallbackSignerError((error as Error).message);
      }
    };

    void initFallbackSigner();

    return () => {
      active = false;
    };
  }, [walletAddress, signer, walletType, walletNetwork?.network]);

  const resolveTxSigner = async (): Promise<unknown | null> => {
    if (signer) return signer;
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
        setFallbackSignerError((error as Error).message);
        return null;
      }
    }

    return null;
  };

  const runAction = async (
    label: string,
    fn: (contract: OpBridgeBridgeContract) => Promise<CallResult>,
    send: boolean,
  ): Promise<{ sent: boolean; transactionId: string | null }> => {
    if (!readBridge) {
      setOutput('Bridge contract is not initialized. Check bridge address and network.');
      return { sent: false, transactionId: null };
    }

    try {
      setOutput(`Running ${label}...`);
      const target = writeBridge ?? readBridge;
      const sender = await resolveConnectedSender();
      if (sender && typeof (target as any).setSender === 'function') {
        (target as any).setSender(sender);
      }
      const simulation = await fn(target);

      const snapshot = {
        action: label,
        revert: simulation.revert ?? null,
        estimatedGas: simulation.estimatedGas?.toString() ?? null,
        properties: simulation.properties,
      };

      setOutput(JSON.stringify(snapshot, null, 2));

      if (!send) return { sent: false, transactionId: null };

      const txSigner = await resolveTxSigner();
      if (!txSigner || !walletAddress) {
        setOutput(
          `${JSON.stringify(snapshot, null, 2)}\n\nSend skipped: signer is unavailable.${
            fallbackSignerError ? ` Fallback error: ${fallbackSignerError}` : ''
          }`,
        );
        return { sent: false, transactionId: null };
      }

      const tx = await simulation.sendTransaction({
        signer: txSigner,
        mldsaSigner: null,
        refundTo: walletAddress,
        maximumAllowedSatToSpend: BigInt(maxSatSpend || '0'),
        feeRate: Number(feeRate || '0'),
        network: walletNetwork ?? readNetwork,
      });

      setOutput(`${JSON.stringify(snapshot, null, 2)}\n\nSent transaction:\n${JSON.stringify(tx, null, 2)}`);
      return {
        sent: true,
        transactionId:
          typeof (tx as { transactionId?: unknown }).transactionId === 'string'
            ? ((tx as { transactionId: string }).transactionId)
            : null,
      };
    } catch (error) {
      setOutput(`Action failed (${label}): ${(error as Error).message}`);
      return { sent: false, transactionId: null };
    }
  };

  const refreshBridgeState = async (): Promise<void> => {
    if (!readBridge) {
      setOutput('Bridge contract is not initialized.');
      return;
    }

    try {
      const sender = await resolveConnectedSender();
      if (sender && typeof (readBridge as any).setSender === 'function') {
        (readBridge as any).setSender(sender);
      }
      const pausedCall = await readBridge.paused();
      const threshold = await readBridge.relayThreshold();
      const relayCountCall = await readBridge.relayCount();
      const supportedAssetCountCall = await readBridge.supportedAssetCount();
      const ownerCall = await readBridge.owner();
      const ethereumVaultCall = await readBridge.ethereumVault();
      const activeAttestationVersionCall = await readBridge.activeAttestationVersion();
      const activeAttestationVersion = Number(activeAttestationVersionCall.properties.version);
      const activeVersionAcceptedCall = await readBridge.isAttestationVersionAccepted(activeAttestationVersion);
      const relayCount = Number(relayCountCall.properties.relayCount);
      const assetCount = Number(supportedAssetCountCall.properties.count);
      const relayPubKeyHashes: string[] = [];
      for (let i = 0; i < relayCount; i++) {
        const relayEntry = await readBridge.relayPubKeyHashAt(i);
        relayPubKeyHashes.push(String(relayEntry.properties.relayPubKeyHash));
      }
      const nextBridgeAssets: BridgeAssetConfig[] = [];
      for (let i = 0; i < assetCount; i++) {
        const assetEntry = await readBridge.supportedAssetAt(i);
        nextBridgeAssets.push({
          assetId: Number(assetEntry.properties.assetId),
          token: String(assetEntry.properties.token),
          decimals: Number(assetEntry.properties.decimals),
          symbol: bytesToSymbol(new Uint8Array(assetEntry.properties.symbol)),
        });
      }

      setBridgeState({
        paused: Boolean(pausedCall.properties.paused),
        threshold: Number(threshold.properties.requiredSignatures),
        relayCount,
        relayPubKeyHashes,
        owner: String(ownerCall.properties.owner),
        ethereumVault: String(ethereumVaultCall.properties.ethereumVault),
        activeAttestationVersion,
        activeAttestationVersionAccepted: Boolean(activeVersionAcceptedCall.properties.accepted),
      });
      setBridgeAssets(nextBridgeAssets);
      if (nextBridgeAssets.length > 0) {
        setAssetTokenAddresses((prev) => {
          const next = { ...prev };
          for (const configured of nextBridgeAssets) {
            next[configured.symbol] = configured.token;
          }
          return next;
        });
        setAssetsConfigJsonInput(
          JSON.stringify(
            nextBridgeAssets.map((entry) => ({
              assetId: entry.assetId,
              token: entry.token,
              symbol: entry.symbol,
              decimals: entry.decimals,
            })),
            null,
            2,
          ),
        );
      }
      setRelayCountInput(String(relayCountCall.properties.relayCount));
      setRelayThresholdInput(String(threshold.properties.requiredSignatures));
      setAttestationVersionInput(String(activeAttestationVersion));
      setAttestationVersionAcceptedInput(Boolean(activeVersionAcceptedCall.properties.accepted));

      setOutput(
        JSON.stringify(
          {
            action: 'refreshBridgeState',
            paused: pausedCall.properties.paused,
            threshold: threshold.properties.requiredSignatures,
            relayCount,
            relayPubKeyHashes,
            assetCount,
            assets: nextBridgeAssets,
            owner: ownerCall.properties.owner,
            ethereumVault: ethereumVaultCall.properties.ethereumVault,
            activeAttestationVersion,
            activeAttestationVersionAccepted: activeVersionAcceptedCall.properties.accepted,
          },
          null,
          2,
        ),
      );
    } catch (error) {
      setOutput(`Failed to read bridge state: ${(error as Error).message}`);
    }
  };

  const runWrappedTokenAction = async (
    label: string,
    fn: (contract: BridgeWrappedTokenContract) => Promise<CallResult>,
    send: boolean,
  ): Promise<void> => {
    if (!readWrappedToken) {
      setOutput('Wrapped token contract is not initialized. Check token address and network.');
      return;
    }

    try {
      setOutput(`Running ${label}...`);
      const target = writeWrappedToken ?? readWrappedToken;
      const sender = await resolveConnectedSender();
      if (sender && typeof (target as any).setSender === 'function') {
        (target as any).setSender(sender);
      }
      const simulation = await fn(target);

      const snapshot = {
        action: label,
        revert: simulation.revert ?? null,
        estimatedGas: simulation.estimatedGas?.toString() ?? null,
        properties: simulation.properties,
      };

      setOutput(JSON.stringify(snapshot, null, 2));

      if (!send) return;

      const txSigner = await resolveTxSigner();
      if (!txSigner || !walletAddress) {
        setOutput(
          `${JSON.stringify(snapshot, null, 2)}\n\nSend skipped: signer is unavailable.${
            fallbackSignerError ? ` Fallback error: ${fallbackSignerError}` : ''
          }`,
        );
        return;
      }

      const tx = await simulation.sendTransaction({
        signer: txSigner,
        mldsaSigner: null,
        refundTo: walletAddress,
        maximumAllowedSatToSpend: BigInt(maxSatSpend || '0'),
        feeRate: Number(feeRate || '0'),
        network: walletNetwork ?? readNetwork,
      });

      setOutput(`${JSON.stringify(snapshot, null, 2)}\n\nSent transaction:\n${JSON.stringify(tx, null, 2)}`);
    } catch (error) {
      setOutput(`Action failed (${label}): ${(error as Error).message}`);
    }
  };

  const refreshWrappedTokenBridgeAuthority = async (): Promise<void> => {
    if (!readWrappedToken) {
      setOutput('Wrapped token contract is not initialized.');
      return;
    }

    try {
      const sender = await resolveConnectedSender();
      if (sender && typeof (readWrappedToken as any).setSender === 'function') {
        (readWrappedToken as any).setSender(sender);
      }
      const current = await readWrappedToken.bridgeAuthority();
      const paused = await readWrappedToken.paused();
      const owner = await readWrappedToken.owner();
      setTokenBridgeAuthorityRead(String(current.properties.bridgeAuthority));
      setTokenPausedRead(String(paused.properties.paused));
      setTokenOwnerRead(String(owner.properties.owner));
      setOutput(
        JSON.stringify(
          {
            action: 'wrappedToken/bridgeAuthority',
            bridgeAuthority: current.properties.bridgeAuthority,
            paused: paused.properties.paused,
            owner: owner.properties.owner,
          },
          null,
          2,
        ),
      );
    } catch (error) {
      setOutput(`Failed to read wrapped token bridge authority: ${(error as Error).message}`);
    }
  };

  const resolveSelectedAssetTokenAddress = async (targetAsset: string): Promise<{
    address: string | null;
    source: 'local' | 'bridge' | 'none';
  }> => {
    const configuredTokenAddress = (assetTokenAddresses[targetAsset] ?? '').trim();
    if (configuredTokenAddress) {
      return { address: configuredTokenAddress, source: 'local' };
    }
    if (!readBridge) {
      return { address: null, source: 'none' };
    }

    try {
      const sender = await resolveConnectedSender();
      if (sender && typeof (readBridge as any).setSender === 'function') {
        (readBridge as any).setSender(sender);
      }

      const token = await readBridge.wrappedToken(resolveAssetId(targetAsset));
      const tokenAddress = String(token.properties.token);
      if (!tokenAddress || /^0x0+$/.test(tokenAddress)) {
        return { address: null, source: 'none' };
      }

      return { address: tokenAddress, source: 'bridge' };
    } catch {
      return { address: null, source: 'none' };
    }
  };

  const fillBurnMaxAmount = async (): Promise<void> => {
    if (!opnetAddress) {
      setOutput('Connect OP_WALLET first to resolve your burn balance.');
      return;
    }

    const resolved = await resolveSelectedAssetTokenAddress(asset);
    const burnTokenAddressCandidate = resolved.address;
    if (!burnTokenAddressCandidate) {
      setOutput(
        `Burn token contract is unavailable for ${asset}. Ensure bridge setWrappedToken(${resolveAssetId(asset)}, token) is configured.`,
      );
      return;
    }

    let tokenContract: OP20ReadContract;
    try {
      tokenContract = getContract(
        burnTokenAddressCandidate,
        OP20ReadAbi as any,
        readProvider,
        readNetwork,
      ) as unknown as OP20ReadContract;
    } catch {
      setOutput('Burn token contract address is invalid for current network.');
      return;
    }

    try {
      setBurnMaxLoading(true);
      const sender = await resolveConnectedSender();
      if (!sender) {
        setOutput('Failed to resolve connected sender address.');
        return;
      }
      if (typeof (tokenContract as any).setSender === 'function') {
        (tokenContract as any).setSender(sender);
      }

      const result = await tokenContract.balanceOf(sender);
      const rawCandidate = (result.properties as any).balance ?? Object.values(result.properties)[0];
      const rawBalance = BigInt(rawCandidate as bigint | string | number);
      const human = formatHumanAmount(rawBalance, resolveAssetDecimals(asset));
      setAmount(human);

      setOutput(
        JSON.stringify(
          {
            action: 'burn/maxAmount',
            asset,
            tokenAddressSource: resolved.source,
            tokenAddress: burnTokenAddressCandidate,
            rawBalance: rawBalance.toString(),
            humanAmount: human,
          },
          null,
          2,
        ),
      );
    } catch (error) {
      setOutput(`Failed to fetch burn max amount: ${(error as Error).message}`);
    } finally {
      setBurnMaxLoading(false);
    }
  };

  const refreshSelectedAssetBalance = async (targetAsset: string = asset): Promise<void> => {
    if (!opnetAddress) {
      setOutput('Connect OP_WALLET first to resolve wallet balance.');
      return;
    }

    const resolved = await resolveSelectedAssetTokenAddress(targetAsset);
    const tokenAddress = resolved.address;
    if (!tokenAddress) {
      setOutput(
        `Token address for ${targetAsset} is unavailable. Ensure bridge setWrappedToken(${resolveAssetId(targetAsset)}, token) is configured.`,
      );
      return;
    }

    let tokenContract: OP20ReadContract;
    try {
      tokenContract = getContract(
        tokenAddress,
        OP20ReadAbi as any,
        readProvider,
        readNetwork,
      ) as unknown as OP20ReadContract;
    } catch {
      setOutput('Wrapped Token Address is invalid for current network.');
      return;
    }

    try {
      setSelectedAssetBalanceLoading(true);
      const sender = await resolveConnectedSender();
      if (!sender) {
        setOutput('Failed to resolve connected sender address.');
        return;
      }
      if (typeof (tokenContract as any).setSender === 'function') {
        (tokenContract as any).setSender(sender);
      }

      const result = await tokenContract.balanceOf(sender);
      const rawCandidate = (result.properties as any).balance ?? Object.values(result.properties)[0];
      const rawBalance = BigInt(rawCandidate as bigint | string | number);
      const humanBalance = formatHumanAmount(rawBalance, resolveAssetDecimals(targetAsset));

      setSelectedAssetBalanceRaw(rawBalance.toString());
      setSelectedAssetBalanceHuman(humanBalance);
      if (resolved.source === 'bridge') {
        setAssetTokenAddresses((prev) => ({
          ...prev,
          [targetAsset]: tokenAddress,
        }));
      }
      setOutput(
        JSON.stringify(
          {
            action: 'selectedAsset/balance',
            asset: targetAsset,
            tokenAddressSource: resolved.source,
            tokenAddress,
            owner: sender.toHex(),
            rawBalance: rawBalance.toString(),
            humanBalance,
          },
          null,
          2,
        ),
      );
    } catch (error) {
      setOutput(`Failed to fetch selected asset balance: ${(error as Error).message}`);
    } finally {
      setSelectedAssetBalanceLoading(false);
    }
  };

  const parseMldsaPrivateKey = (raw: string): Uint8Array => {
    const value = raw.trim();
    if (!value) {
      throw new Error('Relay private key is required.');
    }

    const normalized = value.startsWith('0x') ? value.slice(2) : value;
    if (!/^[0-9a-fA-F]+$/.test(normalized) || normalized.length % 2 !== 0) {
      throw new Error('Relay private key must be a valid hex string.');
    }

    const keyBytes = hexToBytes(normalized);
    const mldsa44PrivateSize = 2560;
    const mldsa44PrivatePlusPublicSize = 3872;
    if (keyBytes.length === mldsa44PrivateSize) {
      return keyBytes;
    }

    if (keyBytes.length === mldsa44PrivatePlusPublicSize) {
      return keyBytes.slice(0, mldsa44PrivateSize);
    }

    throw new Error(
      `Relay private key has invalid size (${keyBytes.length} bytes). Expected ${mldsa44PrivateSize} (private) or ${mldsa44PrivatePlusPublicSize} (private+public).`,
    );
  };

  const buildRelaySignatureBundle = (
    messageHash: Uint8Array,
  ): {
    signatures: Uint8Array[];
    relayPubKeys: Uint8Array[];
    relayHashes: string[];
    thresholdRelayIndexes: number[];
    signedRelayIndexes: number[];
  } => {
    if (activeRelayCount < 1 || activeRelayThreshold < 1) {
      throw new Error('Bridge relay config is incomplete. Configure relay count and threshold first.');
    }

    const signatures: Uint8Array[] = Array.from({ length: activeRelayCount }, () => EMPTY_BYTES);
    const relayPubKeys: Uint8Array[] = Array.from({ length: activeRelayCount }, () => EMPTY_BYTES);
    const relayHashes: string[] = Array.from({ length: activeRelayCount }, () => '');
    const signedRelayIndexes: number[] = [];

    for (let index = 0; index < activeRelayCount; index++) {
      const rawKey = relayPrivateKeysInput[index]?.trim() ?? '';
      if (!rawKey) {
        continue;
      }

      const privateKey = parseMldsaPrivateKey(rawKey);
      const mldsaSigner = QuantumBIP32Factory.fromPrivateKey(
        privateKey,
        ZERO_CHAIN_CODE,
        readNetwork,
        MLDSASecurityLevel.LEVEL2,
      );

      signatures[index] = mldsaSigner.sign(messageHash);
      relayPubKeys[index] = new Uint8Array(mldsaSigner.publicKey);
      relayHashes[index] = new Address(relayPubKeys[index]).toHex();
      signedRelayIndexes.push(index);
    }

    if (signedRelayIndexes.length < activeRelayThreshold) {
      throw new Error(
        `At least ${activeRelayThreshold} relay private keys are required (currently ${signedRelayIndexes.length}).`,
      );
    }

    const thresholdRelayIndexes = signedRelayIndexes.slice(0, activeRelayThreshold);
    return { signatures, relayPubKeys, relayHashes, thresholdRelayIndexes, signedRelayIndexes };
  };

  const getMintRelaySelection = (): {
    relayIndexesPacked: Uint8Array;
    relaySignaturesPacked: Uint8Array;
    selectedRelayIndexes: number[];
    signatureCount: number;
  } => {
    if (activeRelayThreshold < 1 || activeRelayCount < 1) {
      throw new Error('Bridge relay config is incomplete. Configure relays and threshold first.');
    }

    const requestedCount = Number.parseInt(mintSignatureCountInput.trim(), 10);
    if (!Number.isFinite(requestedCount) || requestedCount < 1 || requestedCount > activeRelayCount) {
      throw new Error(
        `Signature count must be an integer between 1 and ${activeRelayCount} for mintWithRelaySignatures.`,
      );
    }
    if (requestedCount < activeRelayThreshold) {
      throw new Error(
        `mintWithRelaySignatures requires at least ${activeRelayThreshold} signatures for current bridge threshold.`,
      );
    }

    const selectedRelayIndexes = Array.from(
      new Set(
        mintSelectedRelayIndexes.filter(
          (value) => Number.isInteger(value) && value >= 0 && value < activeRelayCount,
        ),
      ),
    );
    if (selectedRelayIndexes.length < requestedCount) {
      throw new Error(
        `Need ${requestedCount} selected relay indexes, but only ${selectedRelayIndexes.length} are selected.`,
      );
    }

    const relayIndexesPacked = new Uint8Array(requestedCount);
    const relaySignaturesPacked = new Uint8Array(requestedCount * RELAY_SIGNATURE_BYTES);
    for (let i = 0; i < requestedCount; i++) {
      const relayIndex = selectedRelayIndexes[i];
      const signature = mintRelaySignatures[relayIndex] ?? EMPTY_BYTES;
      if (signature.length === 0) {
        throw new Error(`Relay signature missing for relay index ${relayIndex}.`);
      }
      if (signature.length !== RELAY_SIGNATURE_BYTES) {
        throw new Error(
          `Relay signature has invalid size for relay index ${relayIndex}. Expected ${RELAY_SIGNATURE_BYTES} bytes.`,
        );
      }

      relayIndexesPacked[i] = relayIndex;
      relaySignaturesPacked.set(signature, i * RELAY_SIGNATURE_BYTES);
    }

    return {
      relayIndexesPacked,
      relaySignaturesPacked,
      selectedRelayIndexes,
      signatureCount: requestedCount,
    };
  };

  const copyValue = async (label: string, value: string | null): Promise<void> => {
    if (!value) {
      setOutput(`${label} is not available.`);
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setOutput(`${label} copied to clipboard.`);
    } catch (error) {
      setOutput(`Failed to copy ${label}: ${(error as Error).message}`);
    }
  };

  const applyRelayDataPayload = (payload: {
    relayCount?: number;
    startIndex?: number;
    relayPubKeysPacked?: string;
    relayPrivateKeys?: string[];
    relays?: Array<{
      relayIndex?: number;
      mldsaPublicKeyHex?: string;
      mldsaPrivateKeyHex?: string;
    }>;
  }): void => {
    const startIndex = Number.isInteger(payload.startIndex) ? Number(payload.startIndex) : 0;
    const relayCount = payload.relayCount ?? payload.relayPrivateKeys?.length ?? payload.relays?.length ?? DEFAULT_DEV_RELAY_KEY_SLOTS;
    if (relayCount < activeRelayCount) {
      throw new Error(
        `Relay JSON has relayCount=${relayCount}, but current bridge relay count is ${activeRelayCount}.`,
      );
    }

    const publicKeyByIndex = new Map<number, Uint8Array>();
    const privateKeyByIndex = new Map<number, string>();
    const relays = Array.isArray(payload.relays) ? payload.relays : [];
    for (const relay of relays) {
      const relayIndex = Number(relay.relayIndex);
      if (!Number.isInteger(relayIndex) || relayIndex < 0 || relayIndex > 255) {
        throw new Error(`Relay JSON relays[].relayIndex must be an integer in [0,255].`);
      }
      if (relay.mldsaPublicKeyHex?.trim()) {
        publicKeyByIndex.set(relayIndex, hexToBytes(relay.mldsaPublicKeyHex, 1312));
      }
      if (relay.mldsaPrivateKeyHex?.trim()) {
        parseMldsaPrivateKey(relay.mldsaPrivateKeyHex);
        privateKeyByIndex.set(relayIndex, relay.mldsaPrivateKeyHex.trim());
      }
    }
    const relayPubKeysPackedHex = (payload.relayPubKeysPacked ?? '').trim();
    if (relayPubKeysPackedHex) {
      const fullPacked = hexToBytes(relayPubKeysPackedHex, relayCount * 1312);
      for (let i = 0; i < relayCount; i++) {
        const relayIndex = startIndex + i;
        publicKeyByIndex.set(relayIndex, fullPacked.slice(i * 1312, (i + 1) * 1312));
      }
    }
    const privateKeys = payload.relayPrivateKeys ?? [];
    for (let i = 0; i < privateKeys.length; i++) {
      const relayIndex = startIndex + i;
      const rawKey = String(privateKeys[i] ?? '').trim();
      if (rawKey) {
        parseMldsaPrivateKey(rawKey);
        privateKeyByIndex.set(relayIndex, rawKey);
      }
    }
    const targetRelayCount = activeRelayCount > 0 ? activeRelayCount : DEFAULT_DEV_RELAY_KEY_SLOTS;
    const packedForCurrentRelayCount = new Uint8Array(targetRelayCount * 1312);
    const keysForCurrentRelayCount: string[] = [];
    for (let relayIndex = 0; relayIndex < targetRelayCount; relayIndex++) {
      const pub = publicKeyByIndex.get(relayIndex);
      if (!pub) {
        throw new Error(`Relay JSON is missing mldsaPublicKey for relay index ${relayIndex}.`);
      }
      packedForCurrentRelayCount.set(pub, relayIndex * 1312);
      keysForCurrentRelayCount.push(privateKeyByIndex.get(relayIndex) ?? '');
    }
    setRelayPubKeysPackedInput(bytesToHex(packedForCurrentRelayCount));
    setRelayPrivateKeysInput(keysForCurrentRelayCount);
    setOutput(
      `Loaded relay JSON: ${targetRelayCount} packed relay pubkeys for current bridge config (private keys ${keysForCurrentRelayCount.some((k) => k) ? 'present' : 'not provided'}).`,
    );
  };

  const mergeRelayDataPayloads = (
    payloads: Array<{
      relayCount?: number;
      startIndex?: number;
      relayPubKeysPacked?: string;
      relayPrivateKeys?: string[];
      relays?: Array<{
        relayIndex?: number;
        mldsaPublicKeyHex?: string;
        mldsaPrivateKeyHex?: string;
      }>;
    }>,
  ) => {
    const publicKeyByIndex = new Map<number, string>();
    const privateKeyByIndex = new Map<number, string>();
    let maxRelayIndex = -1;

    for (const payload of payloads) {
      const startIndex = Number.isInteger(payload.startIndex) ? Number(payload.startIndex) : 0;
      const relayCount = payload.relayCount ?? payload.relayPrivateKeys?.length ?? payload.relays?.length ?? 0;
      const relays = Array.isArray(payload.relays) ? payload.relays : [];
      for (const relay of relays) {
        const relayIndex = Number(relay.relayIndex);
        if (!Number.isInteger(relayIndex) || relayIndex < 0 || relayIndex > 255) {
          throw new Error(`Relay JSON relays[].relayIndex must be an integer in [0,255].`);
        }
        maxRelayIndex = Math.max(maxRelayIndex, relayIndex);
        if (relay.mldsaPublicKeyHex?.trim()) {
          publicKeyByIndex.set(relayIndex, bytesToHex(hexToBytes(relay.mldsaPublicKeyHex, 1312)));
        }
        if (relay.mldsaPrivateKeyHex?.trim()) {
          const key = relay.mldsaPrivateKeyHex.trim();
          parseMldsaPrivateKey(key);
          privateKeyByIndex.set(relayIndex, key);
        }
      }
      if (payload.relayPubKeysPacked?.trim()) {
        const packed = hexToBytes(payload.relayPubKeysPacked, relayCount * 1312);
        for (let i = 0; i < relayCount; i++) {
          const relayIndex = startIndex + i;
          maxRelayIndex = Math.max(maxRelayIndex, relayIndex);
          publicKeyByIndex.set(relayIndex, bytesToHex(packed.slice(i * 1312, (i + 1) * 1312)));
        }
      }
      const keys = payload.relayPrivateKeys ?? [];
      for (let i = 0; i < keys.length; i++) {
        const relayIndex = startIndex + i;
        maxRelayIndex = Math.max(maxRelayIndex, relayIndex);
        const key = String(keys[i] ?? '').trim();
        parseMldsaPrivateKey(key);
        privateKeyByIndex.set(relayIndex, key);
      }
    }

    const relayCount = Math.max(maxRelayIndex + 1, 0);
    if (relayCount === 0) {
      throw new Error('No relay keys found in uploaded relay JSON files.');
    }

    const relayPrivateKeys: string[] = [];
    const relayPubKeysPacked = new Uint8Array(relayCount * 1312);
    const relays: Array<{ relayIndex: number; mldsaPublicKeyHex: string; mldsaPrivateKeyHex?: string }> = [];
    for (let relayIndex = 0; relayIndex < relayCount; relayIndex++) {
      const pubHex = publicKeyByIndex.get(relayIndex);
      if (!pubHex) {
        throw new Error(`Uploaded relay JSON is missing mldsaPublicKey for relay index ${relayIndex}.`);
      }
      relayPubKeysPacked.set(hexToBytes(pubHex, 1312), relayIndex * 1312);
      const privHex = privateKeyByIndex.get(relayIndex) ?? '';
      relayPrivateKeys.push(privHex);
      relays.push(
        privHex
          ? { relayIndex, mldsaPublicKeyHex: pubHex, mldsaPrivateKeyHex: privHex }
          : { relayIndex, mldsaPublicKeyHex: pubHex },
      );
    }

    return {
      relayCount,
      startIndex: 0,
      relayPubKeysPacked: bytesToHex(relayPubKeysPacked),
      relayPrivateKeys,
      relays,
    };
  };

  const loadRelayDataFromJson = (): void => {
    try {
      const payload = JSON.parse(relayDataJsonInput) as {
        relayCount?: number;
        relayPubKeysPacked?: string;
        relayPrivateKeys?: string[];
      };
      applyRelayDataPayload(payload);
    } catch (error) {
      setOutput(`Failed to load relay JSON: ${(error as Error).message}`);
    }
  };

  const buildSupportedAssetsPackedFromJson = async (): Promise<Uint8Array> => {
    type AssetInput = { assetId: number; token: string; symbol: string; decimals: number };
    let parsed: unknown;
    try {
      parsed = JSON.parse(assetsConfigJsonInput);
    } catch (error) {
      throw new Error(`Assets JSON is invalid: ${(error as Error).message}`);
    }
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('Assets JSON must be a non-empty array.');
    }

    const entries = parsed as AssetInput[];
    const packed = new Uint8Array(entries.length * (1 + 32 + 1 + ASSET_SYMBOL_BYTES));
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (!Number.isInteger(entry.assetId) || entry.assetId < 0 || entry.assetId > 255) {
        throw new Error(`assets[${i}].assetId must be an integer in [0,255].`);
      }
      if (!Number.isInteger(entry.decimals) || entry.decimals < 1 || entry.decimals > 32) {
        throw new Error(`assets[${i}].decimals must be an integer in [1,32].`);
      }

      const tokenHex = await resolveAddressToHex(String(entry.token), true);
      const tokenBytes = hexToBytes(tokenHex, 32);
      const symbolBytes = symbolToBytes(String(entry.symbol));
      const offset = i * (1 + 32 + 1 + ASSET_SYMBOL_BYTES);
      packed[offset] = entry.assetId;
      packed.set(tokenBytes, offset + 1);
      packed[offset + 33] = entry.decimals;
      packed.set(symbolBytes, offset + 34);
    }

    return packed;
  };

  const buildRemoveSupportedAssetsPackedFromJson = (): Uint8Array => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(removeAssetIdsInput);
    } catch (error) {
      throw new Error(`Asset IDs JSON is invalid: ${(error as Error).message}`);
    }
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('Asset IDs JSON must be a non-empty array.');
    }

    const ids = parsed as number[];
    const packed = new Uint8Array(ids.length);
    for (let i = 0; i < ids.length; i++) {
      const value = ids[i];
      if (!Number.isInteger(value) || value < 0 || value > 255) {
        throw new Error(`assetIds[${i}] must be an integer in [0,255].`);
      }
      packed[i] = value;
    }
    return packed;
  };

  const syncMintSignatureCountWithSelection = (_selectedCount: number): void => {
    if (activeRelayCount === 0) {
      if (mintSignatureCountInput !== '0') {
        setMintSignatureCountInput('0');
      }
      return;
    }
    const clamped = Math.max(activeRelayThreshold, Math.min(_selectedCount, activeRelayCount));
    if (mintSignatureCountInput !== clamped.toString()) {
      setMintSignatureCountInput(clamped.toString());
    }
  };
  const renderAssetSelectOptions = () => (
    <>
      <option value="" disabled>
        {availableAssets.length === 0 ? 'Refresh bridge state to load assets' : 'Select asset'}
      </option>
      {availableAssets.map((entry) => (
        <option key={entry} value={entry}>
          {entry}
        </option>
      ))}
    </>
  );

  const getEthereumProvider = (): EthereumProvider | null => {
    const scopedWindow = window as Window & {
      ethereum?: EthereumProvider;
      web3?: { currentProvider?: EthereumProvider };
    };
    const injected = scopedWindow.ethereum;
    if (!injected) {
      return scopedWindow.web3?.currentProvider ?? null;
    }

    const allProviders =
      injected.providers && injected.providers.length > 0
        ? injected.providers
        : [injected];
    const metamask = allProviders.find((provider) => provider.isMetaMask);
    return metamask ?? allProviders[0] ?? null;
  };

  const refreshEthereumWalletState = async (): Promise<void> => {
    const provider = getEthereumProvider();
    if (!provider) {
      setEthereumWalletAddress('');
      setEthereumChainId('');
      setEthereumBalanceEth('-');
      return;
    }

    const chainId = (await provider.request({ method: 'eth_chainId' })) as string;
    setEthereumChainId(chainId);
    const accounts = (await provider.request({ method: 'eth_accounts' })) as string[];
    const account = accounts[0] ?? '';
    setEthereumWalletAddress(account);
    if (!account) {
      setEthereumBalanceEth('-');
      return;
    }

    const balanceHex = (await provider.request({
      method: 'eth_getBalance',
      params: [account, 'latest'],
    })) as string;
    setEthereumBalanceEth(formatHumanAmount(BigInt(balanceHex), 18));
  };

  const connectEthereumWallet = async (): Promise<void> => {
    const provider = getEthereumProvider();
    if (!provider) {
      const scopedWindow = window as Window & {
        ethereum?: EthereumProvider;
        web3?: { currentProvider?: EthereumProvider };
      };
      const hasEthereum = !!scopedWindow.ethereum;
      const providerCount = scopedWindow.ethereum?.providers?.length ?? 0;
      const hasLegacyWeb3 = !!scopedWindow.web3?.currentProvider;
      setOutput(
        `No Ethereum wallet found in page context. diagnostics: window.ethereum=${hasEthereum}, ethereum.providers=${providerCount}, window.web3.currentProvider=${hasLegacyWeb3}. If MetaMask is installed, reload tab, unlock wallet, and ensure extension access is enabled for this site.`,
      );
      return;
    }

    await provider.request({ method: 'eth_requestAccounts' });
    await refreshEthereumWalletState();
    setOutput('Ethereum wallet connected.');
  };

  const disconnectEthereumWallet = (): void => {
    setEthereumWalletAddress('');
    setEthereumBalanceEth('-');
    setOutput('Ethereum wallet state cleared in UI.');
  };

  const ethereumAssetConfig: Record<'USDT' | 'WBTC' | 'WETH' | 'PAXG', { assetId: number; decimals: number }> = {
    USDT: { assetId: 0, decimals: 6 },
    WBTC: { assetId: 1, decimals: 8 },
    WETH: { assetId: 2, decimals: 18 },
    PAXG: { assetId: 3, decimals: 18 },
  };

  const waitForEthereumReceipt = async (
    provider: EthereumProvider,
    txHash: string,
    label: string,
  ): Promise<{ status?: string; blockNumber?: string; transactionHash?: string }> => {
    const start = Date.now();
    const timeoutMs = 180_000;
    while (Date.now() - start < timeoutMs) {
      const receipt = (await provider.request({
        method: 'eth_getTransactionReceipt',
        params: [txHash],
      })) as { status?: string; blockNumber?: string; transactionHash?: string } | null;

      if (receipt) {
        return receipt;
      }

      await new Promise((resolve) => setTimeout(resolve, 2_000));
    }
    throw new Error(`${label} receipt timed out after ${timeoutMs / 1000}s.`);
  };

  const ensureSepoliaWalletSession = async (
    provider: EthereumProvider,
  ): Promise<{ account: string; chainId: string }> => {
    const requested = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
    const account = requested[0] ?? '';
    if (!account) {
      throw new Error('No Ethereum account returned from wallet.');
    }

    let chainId = (await provider.request({ method: 'eth_chainId' })) as string;
    if (chainId.toLowerCase() !== SEPOLIA_CHAIN_ID_HEX) {
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
        });
      } catch (error) {
        throw new Error(`Failed to switch wallet to Sepolia: ${formatEthereumError(error)}`);
      }
      chainId = (await provider.request({ method: 'eth_chainId' })) as string;
      if (chainId.toLowerCase() !== SEPOLIA_CHAIN_ID_HEX) {
        throw new Error(`Wrong network. Expected Sepolia (${SEPOLIA_CHAIN_ID_HEX}), got ${chainId}.`);
      }
    }

    return { account, chainId };
  };

  const runEthereumApproveAndDeposit = async (): Promise<void> => {
    const provider = getEthereumProvider();
    if (!provider) {
      setOutput('No Ethereum wallet provider found. Connect MetaMask first.');
      return;
    }
    if (!ethereumWalletAddress) {
      setOutput('Connect Ethereum wallet first.');
      return;
    }

    try {
      setEthereumDepositRunning(true);

      const { account, chainId } = await ensureSepoliaWalletSession(provider);
      setEthereumWalletAddress(account);
      setEthereumChainId(chainId);

      const vaultAddress = normalizeEthereumAddress(ethereumVaultAddress, 'Vault address');
      const tokenAddressRaw = ethereumTokenAddresses[ethereumDepositAsset];
      const tokenAddress = normalizeEthereumAddress(tokenAddressRaw, `${ethereumDepositAsset} token`);
      const recipient = normalizeBytes32Hex(
        ethereumDepositRecipient || hashedMLDSAKey || '',
        'OPNet recipient',
      );
      const { assetId, decimals } = ethereumAssetConfig[ethereumDepositAsset];
      const amountRaw = parseHumanAmount(ethereumDepositAmount, decimals);
      if (amountRaw <= 0n) {
        throw new Error('Amount must be greater than zero.');
      }

      setOutput('Submitting ERC20 approve transaction...');
      const approveData = buildApproveCalldata(vaultAddress, amountRaw);
      let approveTxHash = '';
      try {
        approveTxHash = (await provider.request({
          method: 'eth_sendTransaction',
          params: [{ from: account, to: tokenAddress, data: approveData }],
        })) as string;
      } catch (error) {
        throw new Error(`Approve send failed: ${formatEthereumError(error)}`);
      }

      let approveReceipt: { status?: string; blockNumber?: string; transactionHash?: string };
      try {
        approveReceipt = await waitForEthereumReceipt(provider, approveTxHash, 'Approve');
      } catch (error) {
        throw new Error(`Approve receipt failed: ${formatEthereumError(error)}`);
      }
      if (approveReceipt.status !== '0x1') {
        throw new Error(`Approve transaction failed. tx=${approveTxHash}`);
      }

      setOutput('Approve confirmed. Submitting vault deposit transaction...');
      const depositData = buildDepositErc20Calldata(assetId, amountRaw, recipient);
      let depositTxHash = '';
      try {
        depositTxHash = (await provider.request({
          method: 'eth_sendTransaction',
          params: [{ from: account, to: vaultAddress, data: depositData }],
        })) as string;
      } catch (error) {
        throw new Error(`Deposit send failed: ${formatEthereumError(error)}`);
      }

      let depositReceipt: { status?: string; blockNumber?: string; transactionHash?: string };
      try {
        depositReceipt = await waitForEthereumReceipt(provider, depositTxHash, 'Deposit');
      } catch (error) {
        throw new Error(`Deposit receipt failed: ${formatEthereumError(error)}`);
      }
      if (depositReceipt.status !== '0x1') {
        throw new Error(`Deposit transaction failed. tx=${depositTxHash}`);
      }

      await refreshEthereumWalletState();
      setOutput(
        JSON.stringify(
          {
            action: 'ethereum/deposit/approve-and-deposit',
            network: 'sepolia',
            wallet: account,
            vaultAddress,
            tokenAddress,
            asset: ethereumDepositAsset,
            assetId,
            decimals,
            amountHuman: ethereumDepositAmount,
            amountRaw: amountRaw.toString(),
            recipient,
            approveTxHash,
            approveBlockNumber: approveReceipt.blockNumber ?? null,
            depositTxHash,
            depositBlockNumber: depositReceipt.blockNumber ?? null,
          },
          null,
          2,
        ),
      );
    } catch (error) {
      setOutput(`Ethereum approve+deposit failed: ${formatEthereumError(error)}`);
    } finally {
      setEthereumDepositRunning(false);
    }
  };

  const checkEthereumDepositAssetBalance = async (): Promise<void> => {
    const provider = getEthereumProvider();
    if (!provider) {
      setOutput('No Ethereum wallet provider found. Connect MetaMask first.');
      return;
    }
    if (!ethereumWalletAddress) {
      setOutput('Connect Ethereum wallet first.');
      return;
    }

    try {
      const { account, chainId } = await ensureSepoliaWalletSession(provider);
      setEthereumWalletAddress(account);
      setEthereumChainId(chainId);

      const tokenAddress = normalizeEthereumAddress(
        ethereumTokenAddresses[ethereumDepositAsset],
        `${ethereumDepositAsset} token`,
      );
      const calldata = buildBalanceOfCalldata(account);
      const result = (await provider.request({
        method: 'eth_call',
        params: [{ to: tokenAddress, data: calldata }, 'latest'],
      })) as string;

      const raw = BigInt(result);
      const decimals =
        ethereumDepositAsset === 'USDT'
          ? 6
          : ethereumDepositAsset === 'WBTC'
            ? 8
            : 18;
      const human = formatHumanAmount(raw, decimals);
      setEthereumDepositBalanceRaw(raw.toString());
      setEthereumDepositBalanceHuman(human);
      setOutput(
        JSON.stringify(
          {
            action: 'ethereum/deposit/check-balance',
            network: 'sepolia',
            wallet: account,
            asset: ethereumDepositAsset,
            tokenAddress,
            balanceRaw: raw.toString(),
            balanceHuman: human,
            decimals,
          },
          null,
          2,
        ),
      );
    } catch (error) {
      setOutput(`Ethereum balance check failed: ${(error as Error).message}`);
    }
  };

  const applySepoliaDeploymentPayload = (parsed: DeploymentJsonPayload): void => {
    const ethereumPayload = parsed.ethereum ?? parsed;
    if (ethereumPayload.rpcUrl) {
      setEthereumRpcUrl(ethereumPayload.rpcUrl);
    }
    if (ethereumPayload.vaultAddress) {
      setEthereumVaultAddress(ethereumPayload.vaultAddress);
    }
    if (Array.isArray(ethereumPayload.assets)) {
      setEthereumTokenAddresses((prev) => {
        const next = { ...prev };
        for (const asset of ethereumPayload.assets ?? []) {
          const symbol = (asset.symbol ?? '').toUpperCase();
          if (symbol === 'USDT' || symbol === 'WBTC' || symbol === 'WETH' || symbol === 'PAXG') {
            next[symbol] = asset.tokenAddress ?? '';
          }
        }
        return next;
      });
    }

    if (parsed.opnet?.bridgeAddress) {
      setBridgeAddress(parsed.opnet.bridgeAddress);
    }
    if (parsed.opnet?.wrappedTokens) {
      setOpnetWrappedAddresses((prev) => ({
        ...prev,
        USDT: parsed.opnet?.wrappedTokens?.USDT ?? prev.USDT,
        WBTC: parsed.opnet?.wrappedTokens?.WBTC ?? prev.WBTC,
        WETH: parsed.opnet?.wrappedTokens?.WETH ?? prev.WETH,
        PAXG: parsed.opnet?.wrappedTokens?.PAXG ?? prev.PAXG,
      }));
    }
  };

  const loadSepoliaDeploymentJson = (): void => {
    try {
      const parsed = JSON.parse(deploymentJsonInput) as DeploymentJsonPayload;
      applySepoliaDeploymentPayload(parsed);
      setOutput('Loaded Sepolia deployment JSON into Ethereum tooling fields.');
    } catch (error) {
      setOutput(`Failed to parse deployment JSON: ${(error as Error).message}`);
    }
  };

  const loadBundledSepoliaDeployment = (): void => {
    try {
      const payload = defaultSepoliaDeployment as DeploymentJsonPayload;
      setDeploymentJsonInput(JSON.stringify(payload, null, 2));
      applySepoliaDeploymentPayload(payload);
      setOutput('Loaded default bundled Sepolia deployment JSON into Ethereum tooling fields.');
    } catch (error) {
      setOutput(`Failed to load bundled Sepolia deployment JSON: ${(error as Error).message}`);
    }
  };

  const loadJsonFileInto = async (
    event: React.ChangeEvent<HTMLInputElement>,
    target: 'relay' | 'deployment' | 'mintCandidate',
  ): Promise<void> => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) {
      return;
    }

    try {
      if (target === 'relay' && files.length > 1) {
        const payloads = await Promise.all(
          files.map(async (file) => {
            if (!file.name.toLowerCase().endsWith('.json')) {
              throw new Error(`Selected file is not a JSON file: ${file.name}`);
            }
            return JSON.parse(await file.text()) as {
              relayCount?: number;
              startIndex?: number;
              relayPubKeysPacked?: string;
              relayPrivateKeys?: string[];
              relays?: Array<{
                relayIndex?: number;
                mldsaPublicKeyHex?: string;
                mldsaPrivateKeyHex?: string;
              }>;
            };
          }),
        );
        const merged = mergeRelayDataPayloads(payloads);
        const mergedText = JSON.stringify(merged, null, 2);
        setRelayDataJsonInput(mergedText);
        applyRelayDataPayload(merged);
        setOutput(`Merged ${files.length} relay JSON files and loaded combined relay data.`);
        return;
      }

      const file = files[0];
      if (!file.name.toLowerCase().endsWith('.json')) {
        setOutput(`Selected file is not a JSON file: ${file.name}`);
        return;
      }

      const text = await file.text();
      if (target === 'relay') {
        setRelayDataJsonInput(text);
        try {
          const payload = JSON.parse(text) as {
            relayCount?: number;
            startIndex?: number;
            relayPubKeysPacked?: string;
            relayPrivateKeys?: string[];
            relays?: Array<{
              relayIndex?: number;
              mldsaPublicKeyHex?: string;
              mldsaPrivateKeyHex?: string;
            }>;
          };
          applyRelayDataPayload(payload);
          setOutput(`Loaded ${file.name} and applied relay data.`);
          return;
        } catch {
          // Keep existing behavior for non-relay-shaped JSON: load into textarea for manual review.
        }
      } else if (target === 'deployment') {
        setDeploymentJsonInput(text);
      } else {
        setMintCandidateJsonInput(text);
      }
      const targetLabel =
        target === 'relay' ? 'relay' : target === 'deployment' ? 'deployment' : 'mint candidate';
      setOutput(`Loaded ${file.name} into ${targetLabel} JSON textarea.`);
    } catch (error) {
      const selectedNames = files.map((entry) => entry.name).join(', ');
      setOutput(`Failed to read ${selectedNames || 'selected file(s)'}: ${(error as Error).message}`);
    }
  };

  const resolveAssetSymbolById = (assetId: number): string => {
    const fromBridge = bridgeAssets.find((entry) => entry.assetId === assetId)?.symbol;
    if (fromBridge) {
      return fromBridge;
    }
    const fromDefault = ASSET_CONFIGS.find((entry) => entry.assetId === assetId)?.symbol;
    if (fromDefault) {
      return fromDefault;
    }
    throw new Error(`Asset ID ${assetId} is not configured.`);
  };

  const applyMintCandidatePayload = (payload: unknown): void => {
    const container = payload as {
      candidates?: Array<{
        ready?: boolean;
        payloadHashHex?: string;
        mintSubmission?: {
          attestationVersion?: number;
          ethereumUser?: string;
          assetId?: number;
          recipient?: string;
          amount?: string;
          nonce?: string;
          relayIndexesPackedHex?: string;
          relaySignaturesPackedHex?: string;
        };
      }>;
      payloadHashHex?: string;
      mintSubmission?: {
        attestationVersion?: number;
        ethereumUser?: string;
        assetId?: number;
        recipient?: string;
        amount?: string;
        nonce?: string;
        relayIndexesPackedHex?: string;
        relaySignaturesPackedHex?: string;
      };
    };

    const candidate =
      (Array.isArray(container.candidates)
        ? container.candidates.find((entry) => entry.ready && entry.mintSubmission)
        : null) ??
      (container.mintSubmission ? container : null);
    if (!candidate?.mintSubmission) {
      throw new Error('Mint candidate JSON must contain a ready candidate with mintSubmission.');
    }

    const mint = candidate.mintSubmission;
    const assetId = Number(mint.assetId);
    if (!Number.isInteger(assetId) || assetId < 0 || assetId > 255) {
      throw new Error(`Invalid mintSubmission.assetId: ${mint.assetId}`);
    }
    const symbol = resolveAssetSymbolById(assetId);
    const relayIndexesPacked = hexToBytes(String(mint.relayIndexesPackedHex ?? ''));
    const relaySignaturesPacked = hexToBytes(String(mint.relaySignaturesPackedHex ?? ''));
    const signatureCount = relayIndexesPacked.length;
    if (signatureCount < 1) {
      throw new Error('relayIndexesPackedHex must contain at least one index.');
    }
    if (relaySignaturesPacked.length !== signatureCount * RELAY_SIGNATURE_BYTES) {
      throw new Error(
        `relaySignaturesPackedHex has invalid length ${relaySignaturesPacked.length}; expected ${
          signatureCount * RELAY_SIGNATURE_BYTES
        }.`,
      );
    }
    if (activeRelayCount < 1) {
      throw new Error('Bridge relay config not loaded. Click Refresh Bridge State first.');
    }

    const selectedIndexes = Array.from(relayIndexesPacked).map((value) => Number(value));
    const maxSelected = Math.max(...selectedIndexes);
    if (maxSelected >= activeRelayCount) {
      throw new Error(
        `Candidate references relay index ${maxSelected}, but bridge relay count is ${activeRelayCount}. Refresh Bridge State.`,
      );
    }

    const nextSignatures: Uint8Array[] = Array.from({ length: activeRelayCount }, () => EMPTY_BYTES);
    for (let i = 0; i < selectedIndexes.length; i++) {
      const index = selectedIndexes[i];
      nextSignatures[index] = relaySignaturesPacked.slice(
        i * RELAY_SIGNATURE_BYTES,
        (i + 1) * RELAY_SIGNATURE_BYTES,
      );
    }

    const decimals = resolveAssetDecimals(symbol);
    const amountRaw = BigInt(String(mint.amount ?? '0'));
    const payloadHashHex = String(candidate.payloadHashHex ?? '').trim();
    const candidateVersion =
      typeof mint.attestationVersion === 'number' ? mint.attestationVersion : ATTESTATION_VERSION;

    setMintAsset(symbol);
    setMintAmount(formatHumanAmount(amountRaw, decimals));
    setMintDepositId(String(mint.nonce ?? ''));
    setMintEthereumUserAddress(String(mint.ethereumUser ?? ''));
    setMintRecipientAddress(String(mint.recipient ?? ''));
    setMintAttestationVersionInput(String(candidateVersion));
    setMintAttestationHashInput(payloadHashHex);
    setDummyBuiltMessageHash(payloadHashHex);
    setMintRelaySignatures(nextSignatures);
    setMintRelayIndexes(selectedIndexes);
    setMintSelectedRelayIndexes(selectedIndexes);
    setMintSignatureCountInput(signatureCount.toString());
    setMintSignatureSource(payloadHashHex ? `candidate (${payloadHashHex})` : 'candidate');
    setOutput(
      `Loaded mint candidate: asset=${symbol} nonce=${mint.nonce} signatures=${signatureCount} relayIndexes=${selectedIndexes.join(',')}`,
    );
  };

  const loadMintCandidateFromJson = (): void => {
    try {
      const parsed = JSON.parse(mintCandidateJsonInput);
      applyMintCandidatePayload(parsed);
    } catch (error) {
      setOutput(`Failed to load mint candidate JSON: ${(error as Error).message}`);
    }
  };

  const sepoliaToOpnetMapping = JSON.stringify(
    {
      ethereum: {
        network: 'sepolia',
        chainId: 11155111,
        rpcUrl: ethereumRpcUrl.trim(),
        vaultAddress: ethereumVaultAddress.trim(),
        assets: [
          { assetId: 0, symbol: 'USDT', decimals: 6, tokenAddress: ethereumTokenAddresses.USDT.trim() },
          { assetId: 1, symbol: 'WBTC', decimals: 8, tokenAddress: ethereumTokenAddresses.WBTC.trim() },
          { assetId: 2, symbol: 'WETH', decimals: 18, tokenAddress: ethereumTokenAddresses.WETH.trim() },
          { assetId: 3, symbol: 'PAXG', decimals: 18, tokenAddress: ethereumTokenAddresses.PAXG.trim() },
        ],
      },
      opnet: {
        network: 'regtest',
        bridgeAddress: bridgeAddress.trim(),
        wrappedTokens: {
          USDT: opnetWrappedAddresses.USDT.trim(),
          WBTC: opnetWrappedAddresses.WBTC.trim(),
          WETH: opnetWrappedAddresses.WETH.trim(),
          PAXG: opnetWrappedAddresses.PAXG.trim(),
        },
      },
    },
    null,
    2,
  );
  const ethereumDepositRawPreview = useMemo(() => {
    try {
      const decimals =
        ethereumDepositAsset === 'USDT'
          ? 6
          : ethereumDepositAsset === 'WBTC'
            ? 8
            : 18;
      return parseHumanAmount(ethereumDepositAmount, decimals).toString();
    } catch {
      return 'invalid';
    }
  }, [ethereumDepositAmount, ethereumDepositAsset]);

  useEffect(() => {
    if (!statusApiUrl.trim()) {
      setOpsStatusState('idle');
      setOpsStatusMessage('Set VITE_STATUS_API_URL to enable relayer status polling.');
      setOpsStatusUpdatedAt('');
      setOpsStatusSummary(null);
      setOpsRelayerHealth(null);
      setOpsRelayers([]);
      setOpsMintCandidates([]);
      setOpsReleaseCandidates([]);
      return;
    }

    let cancelled = false;

    const poll = async () => {
      try {
        setOpsStatusState((previous) => (previous === 'ok' ? previous : 'loading'));
        const base = statusApiUrl.replace(/\/+$/, '');
        const [healthResponse, statusResponse, mintResponse, releaseResponse] = await Promise.all([
          fetch(`${base}/health`),
          fetch(`${base}/status`),
          fetch(`${base}/mint-candidates?limit=5`),
          fetch(`${base}/release-candidates?limit=5`),
        ]);

        if (!healthResponse.ok) throw new Error(`/health HTTP ${healthResponse.status}`);
        if (!statusResponse.ok) throw new Error(`/status HTTP ${statusResponse.status}`);
        if (!mintResponse.ok) throw new Error(`/mint-candidates HTTP ${mintResponse.status}`);
        if (!releaseResponse.ok) throw new Error(`/release-candidates HTTP ${releaseResponse.status}`);

        await healthResponse.json();
        const statusPayload = (await statusResponse.json()) as Record<string, unknown>;
        const mintPayload = (await mintResponse.json()) as { items?: OpsCandidate[] };
        const releasePayload = (await releaseResponse.json()) as { items?: OpsCandidate[] };

        if (cancelled) return;

        setOpsStatusState('ok');
        setOpsStatusMessage('Relayer API healthy');
        setOpsStatusUpdatedAt(new Date().toISOString());
        setOpsStatusSummary((statusPayload.summary as Record<string, unknown>) ?? null);
        setOpsRelayerHealth((statusPayload.relayerHealth as Record<string, unknown>) ?? null);
        setOpsRelayers(Array.isArray(statusPayload.relayers) ? (statusPayload.relayers as OpsRelayerStatus[]) : []);
        setOpsMintCandidates(Array.isArray(mintPayload.items) ? mintPayload.items : []);
        setOpsReleaseCandidates(Array.isArray(releasePayload.items) ? releasePayload.items : []);
      } catch (error) {
        if (cancelled) return;
        setOpsStatusState('error');
        setOpsStatusMessage(
          `Relayer API polling failed: ${error instanceof Error ? error.message : String(error)}`,
        );
        setOpsStatusUpdatedAt(new Date().toISOString());
        setOpsStatusSummary(null);
        setOpsRelayerHealth(null);
        setOpsRelayers([]);
        setOpsMintCandidates([]);
        setOpsReleaseCandidates([]);
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
    const provider = getEthereumProvider();
    if (!provider?.on || !provider.removeListener) {
      return;
    }

    const handleAccountsChanged = () => {
      void refreshEthereumWalletState();
    };
    const handleChainChanged = () => {
      void refreshEthereumWalletState();
    };

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);
    return () => {
      provider.removeListener?.('accountsChanged', handleAccountsChanged);
      provider.removeListener?.('chainChanged', handleChainChanged);
    };
  }, []);

  useEffect(() => {
    if (!ethereumDepositRecipient && hashedMLDSAKey) {
      setEthereumDepositRecipient(hashedMLDSAKey);
    }
  }, [ethereumDepositRecipient, hashedMLDSAKey]);

  return (
    <main className="page">
      <header className="hero">
        <p className="kicker">opbridge / op_net bridge dev console</p>
        <h1>Simple OP_NET Bridge UI</h1>
        <p>
          ABI-based bridge interaction with simulation-first flow, OP_WALLET connection,
          and explicit debug output for fast iteration.
        </p>
      </header>
      <section className="panel">
        <div className="row tabs tool-tabs">
          <button
            className={devToolTab === 'opnet' ? 'tab-active' : ''}
            onClick={() => setDevToolTab('opnet')}
          >
            OPNet Tooling
          </button>
          <button
            className={devToolTab === 'ethereum' ? 'tab-active' : ''}
            onClick={() => setDevToolTab('ethereum')}
          >
            Ethereum Tooling
          </button>
          <button
            className={devToolTab === 'ops' ? 'tab-active' : ''}
            onClick={() => setDevToolTab('ops')}
          >
            Operations
          </button>
        </div>
      </section>

      {devToolTab === 'ops' ? (
        <>
          <section className="panel two-col">
            <div>
              <h2>Relayer API</h2>
              <label>
                Status API Base URL
                <input
                  value={statusApiUrl}
                  onChange={(e) => setStatusApiUrl(e.target.value)}
                  placeholder="https://api.testnet.opbridge.app"
                />
              </label>
              <pre className="status">
{`state: ${opsStatusState}
message: ${opsStatusMessage}
updatedAt: ${opsStatusUpdatedAt || '-'}`}
              </pre>
            </div>
            <div>
              <h2>Overview</h2>
              <pre className="status">
{JSON.stringify(
  {
    summary: opsStatusSummary,
    relayerHealth: opsRelayerHealth,
  },
  null,
  2,
)}
              </pre>
            </div>
          </section>

          <section className="panel two-col">
            <div>
              <h2>Relayer Health</h2>
              <div className="stack">
                {opsRelayers.length > 0 ? (
                  opsRelayers.map((relayer) => {
                    const heads = readHeartbeatHeads(relayer.detail);
                    return (
                    <pre key={`${relayer.relayerName}:${relayer.role}`} className="status">
{`name: ${relayer.relayerName}
status: ${relayer.status}
derivedStatus: ${relayer.derivedStatus ?? '-'}
stale: ${typeof relayer.isStale === 'boolean' ? String(relayer.isStale) : '-'}
age: ${formatAgeMs(relayer.ageMs)}
updatedAt: ${relayer.updatedAt ?? '-'}
last block: ${heads.lastBlock}
claim from block: ${heads.claimFromBlock}`}
                    </pre>
                  )})
                ) : (
                  <pre className="status">No relayer heartbeats loaded.</pre>
                )}
              </div>
            </div>

            <div>
              <h2>Recent Mint Candidates</h2>
              <div className="stack">
                {opsMintCandidates.length > 0 ? (
                  opsMintCandidates.map((candidate, index) => (
                    <pre key={`mint-${candidate.depositId ?? candidate.updatedAt ?? index}`} className="status">
{`depositId: ${candidate.depositId ?? '-'}
ready: ${typeof candidate.ready === 'boolean' ? String(candidate.ready) : '-'}
processed: ${candidate.processed != null ? String(candidate.processed) : '-'}
updatedAt: ${candidate.updatedAt ?? '-'}`}
                    </pre>
                  ))
                ) : (
                  <pre className="status">No mint candidates loaded.</pre>
                )}
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>Recent Release Candidates</h2>
            <div className="stack">
              {opsReleaseCandidates.length > 0 ? (
                opsReleaseCandidates.map((candidate, index) => (
                  <pre key={`release-${candidate.withdrawalId ?? candidate.updatedAt ?? index}`} className="status">
{`withdrawalId: ${candidate.withdrawalId ?? '-'}
ready: ${typeof candidate.ready === 'boolean' ? String(candidate.ready) : '-'}
processed: ${candidate.processed != null ? String(candidate.processed) : '-'}
updatedAt: ${candidate.updatedAt ?? '-'}`}
                  </pre>
                ))
              ) : (
                <pre className="status">No release candidates loaded.</pre>
              )}
            </div>
          </section>
        </>
      ) : devToolTab === 'opnet' ? (
        <>
      <section className="panel two-col">
        <div>
          <h2>Wallet</h2>
          <div className="row">
            <button onClick={openConnectModal} disabled={connecting}>
              {connecting ? 'Connecting...' : 'Open Wallet Modal'}
            </button>
            <button onClick={() => connectToWallet(SupportedWallets.OP_WALLET)}>
              Connect OP_WALLET
            </button>
            <button onClick={disconnect}>Disconnect</button>
          </div>
          <pre className="status">
{`walletAddress: ${walletAddress ?? '-'}
publicKey: ${short(publicKey)}
hashedMLDSAKey: ${short(hashedMLDSAKey)}
opnetAddress: ${opnetAddress ? 'available' : 'missing'}
walletNetwork: ${walletNetwork?.network ?? '-'}
signer: ${signer ? 'available (walletconnect)' : fallbackSigner ? 'available (op_wallet fallback)' : 'not available'}
signerFallbackError: ${fallbackSignerError ?? '-'}`}
          </pre>
          <div className="row">
            <button onClick={() => void copyValue('publicKey', publicKey)}>Copy Public Key</button>
            <button onClick={() => void copyValue('hashedMLDSAKey', hashedMLDSAKey)}>
              Copy Hashed MLDSA Key
            </button>
          </div>
        </div>

        <div>
          <h2>Bridge Config</h2>
          <label>
            OP_NET Network
            <select value={networkMode} onChange={(e) => setNetworkMode(e.target.value as NetworkMode)}>
              <option value="testnet">testnet</option>
              <option value="regtest">regtest</option>
              <option value="mainnet">mainnet</option>
            </select>
          </label>
          <label>
            Bridge Contract Address (op... preferred)
            <input
              value={bridgeAddress}
              onChange={(e) => setBridgeAddress(e.target.value)}
              placeholder="op..."
            />
          </label>
          <div className="row">
            <button onClick={refreshBridgeState}>Refresh Bridge State</button>
          </div>
          <div className="row tabs">
            <button
              className={bridgeStateTab === 'summary' ? 'tab-active' : ''}
              onClick={() => setBridgeStateTab('summary')}
            >
              Summary
            </button>
            <button
              className={bridgeStateTab === 'assets' ? 'tab-active' : ''}
              onClick={() => setBridgeStateTab('assets')}
            >
              Assets
            </button>
            <button
              className={bridgeStateTab === 'relays' ? 'tab-active' : ''}
              onClick={() => setBridgeStateTab('relays')}
            >
              Relays
            </button>
          </div>
          {bridgeStateTab === 'summary' ? (
            <pre className="status">
{`rpc: ${RPC_URLS[networkMode]}
paused: ${bridgeState.paused ?? '-'}
relayThreshold: ${bridgeState.threshold ?? '-'}
relayCount: ${bridgeState.relayCount ?? '-'}
supportedAssetCount: ${bridgeAssets.length}
owner: ${bridgeState.owner ?? '-'}
ethereumVault: ${bridgeState.ethereumVault ?? '-'}
activeAttestationVersion: ${bridgeState.activeAttestationVersion ?? '-'}
activeVersionAccepted: ${typeof bridgeState.activeAttestationVersionAccepted === 'boolean' ? String(bridgeState.activeAttestationVersionAccepted) : '-'}
resolvedBridgeHex: ${resolvedBridgeAddress || '-'}`}
            </pre>
          ) : null}
          {bridgeStateTab === 'assets' ? (
            <pre className="status">
{bridgeAssets.length > 0
  ? bridgeAssets
      .map(
        (entry, index) =>
          `${index}. ${entry.symbol} | assetId=${entry.assetId} | decimals=${entry.decimals} | token=${entry.token}`,
      )
      .join('\n')
  : 'No supported assets found on bridge state.'}
            </pre>
          ) : null}
          {bridgeStateTab === 'relays' ? (
            <div className="stack">
              <pre className="status">
{`relayCount (on-chain): ${bridgeState.relayCount ?? '-'}
relayThreshold (on-chain): ${bridgeState.threshold ?? '-'}
packedRelayPubKeys (input): ${relayPreview.entries.length > 0 ? relayPreview.entries.length : 0} keys
relayPubKeyHashes (on-chain): ${bridgeState.relayPubKeyHashes?.length ?? 0}`}
              </pre>
              {bridgeState.relayPubKeyHashes && bridgeState.relayPubKeyHashes.length > 0 ? (
                <pre className="status">
{bridgeState.relayPubKeyHashes.map((value, index) => `r${index}: ${value}`).join('\n')}
                </pre>
              ) : (
                <pre className="status">No relay identities found on bridge state.</pre>
              )}
              {relayPreview.error ? (
                <pre className="status">{`relayPreviewError: ${relayPreview.error}`}</pre>
              ) : null}
              {relayPreview.entries.length > 0 ? (
                <>
                  {relayPreviewKeysVisible.map((keyHex, index) => (
                    <div key={`relay-preview-${index}`} className="row">
                      <span>{`r${index}: ${short(keyHex)}`}</span>
                      <button onClick={() => void copyValue(`relayPubKey[r${index}]`, keyHex)}>
                        Copy Key
                      </button>
                    </div>
                  ))}
                  {relayPreview.entries.length > 8 ? (
                    <div className="row">
                      <button onClick={() => setShowAllRelayPreviewKeys((prev) => !prev)}>
                        {showAllRelayPreviewKeys
                          ? 'Show First 8 Relay Keys'
                          : `Show All Relay Keys (${relayPreview.entries.length})`}
                      </button>
                    </div>
                  ) : null}
                </>
              ) : (
                <pre className="status">No packed relay pubkeys loaded in input yet.</pre>
              )}
            </div>
          ) : null}
        </div>
      </section>

      <section className="panel two-col">
        <div>
          <h2>Deployment Flow</h2>
          <pre className="status">
{`Deploy all contracts with empty deployment calldata.

After deploy:
1. Set bridge authority on each wrapped token:
   TOKEN.setBridgeAuthority(bridge)
2. Configure supported assets in one transaction:
   setSupportedAssetsPacked(assetsPacked)
3. Configure relays in one transaction:
   setRelaysConfigPacked(relayPubKeysPacked, threshold)
4. Optional token address rewiring for a supported asset:
   setWrappedToken(assetId, tokenAddress)
5. Unpause when bridge state is complete:
   setPaused(false)

Address format: use op... addresses (0x... also supported).`}
          </pre>
        </div>

        <div>
          <h2>Wrapped Token Bridge Authority</h2>
          <label>
            Wrapped Token Contract Address (op... preferred)
            <input
              value={tokenContractAddress}
              onChange={(e) => setTokenContractAddress(e.target.value)}
              placeholder="op..."
            />
          </label>
          <label>
            New Bridge Authority Address (op... preferred)
            <input
              value={tokenBridgeAuthorityAddress}
              onChange={(e) => setTokenBridgeAuthorityAddress(e.target.value)}
              placeholder="op... (OpBridgeBridge contract)"
            />
          </label>
          <label>
            New Token Owner Address (op... preferred)
            <input
              value={tokenOwnerAddress}
              onChange={(e) => setTokenOwnerAddress(e.target.value)}
              placeholder="op..."
            />
          </label>
          <div className="action-group">
            <p className="group-label">Read</p>
            <div className="row">
              <button onClick={refreshWrappedTokenBridgeAuthority}>Read bridgeAuthority</button>
            </div>
          </div>
          <div className="action-group">
            <p className="group-label">Ownership</p>
            <div className="row">
              <button
                onClick={() => {
                  if (!tokenOwnerAddress.trim()) {
                    setOutput('New token owner address is required.');
                    return;
                  }
                  void runWrappedTokenAction(
                    'transferOwnership/simulate',
                    async (token) =>
                      token.transferOwnership(
                        await resolveAddressForAbi(tokenOwnerAddress.trim(), false),
                      ),
                    false,
                  );
                }}
              >
                Simulate transferOwnership
              </button>
              <button
                onClick={() => {
                  if (!tokenOwnerAddress.trim()) {
                    setOutput('New token owner address is required.');
                    return;
                  }
                  void runWrappedTokenAction(
                    'transferOwnership/send',
                    async (token) =>
                      token.transferOwnership(
                        await resolveAddressForAbi(tokenOwnerAddress.trim(), false),
                      ),
                    true,
                  );
                }}
              >
                Simulate + Send transferOwnership
              </button>
            </div>
          </div>
          <div className="action-group">
            <p className="group-label">Bridge Authority</p>
            <div className="row">
              <button
                onClick={() => {
                  if (!tokenBridgeAuthorityAddress.trim()) {
                    setOutput('New bridge authority address is required.');
                    return;
                  }
                  void runWrappedTokenAction(
                    'setBridgeAuthority/simulate',
                    async (token) =>
                      token.setBridgeAuthority(
                        await resolveAddressForAbi(tokenBridgeAuthorityAddress.trim(), true),
                      ),
                    false,
                  );
                }}
              >
                Simulate setBridgeAuthority
              </button>
              <button
                onClick={() => {
                  if (!tokenBridgeAuthorityAddress.trim()) {
                    setOutput('New bridge authority address is required.');
                    return;
                  }
                  void runWrappedTokenAction(
                    'setBridgeAuthority/send',
                    async (token) =>
                      token.setBridgeAuthority(
                        await resolveAddressForAbi(tokenBridgeAuthorityAddress.trim(), true),
                      ),
                    true,
                  );
                }}
              >
                Simulate + Send setBridgeAuthority
              </button>
            </div>
          </div>
          <div className="action-group">
            <p className="group-label">Pause Control</p>
            <div className="row">
              <button
                onClick={() => {
                  void runWrappedTokenAction(
                    'setTokenPaused(true)/simulate',
                    (token) => token.setPaused(true),
                    false,
                  );
                }}
              >
                Simulate pause token
              </button>
              <button
                onClick={() => {
                  void runWrappedTokenAction(
                    'setTokenPaused(true)/send',
                    (token) => token.setPaused(true),
                    true,
                  );
                }}
              >
                Simulate + Send pause token
              </button>
              <button
                onClick={() => {
                  void runWrappedTokenAction(
                    'setTokenPaused(false)/simulate',
                    (token) => token.setPaused(false),
                    false,
                  );
                }}
              >
                Simulate unpause token
              </button>
              <button
                onClick={() => {
                  void runWrappedTokenAction(
                    'setTokenPaused(false)/send',
                    (token) => token.setPaused(false),
                    true,
                  );
                }}
              >
                Simulate + Send unpause token
              </button>
            </div>
          </div>
          <pre className="status">
{`resolvedTokenHex: ${resolvedTokenContractAddress || '-'}
bridgeAuthority: ${tokenBridgeAuthorityRead || '-'}
paused: ${tokenPausedRead || '-'}
owner: ${tokenOwnerRead || '-'}`}
          </pre>
        </div>
      </section>

      <section className="panel two-col">
        <div>
          <h2>Dummy Relay Builder</h2>
          <label>
            Asset
            <select value={dummyAsset} onChange={(e) => setDummyAsset(e.target.value as string)}>
              {renderAssetSelectOptions()}
            </select>
          </label>
          <label>
            Deposited Amount (human-readable)
            <input value={dummyAmount} onChange={(e) => setDummyAmount(e.target.value)} />
          </label>
          <pre className="status">
{`decimals: ${safeAssetDecimals(dummyAsset)}
rawAmount: ${dummyRawAmountPreview}`}
          </pre>
          <label>
            Deposit ID (uint256)
            <input value={dummyDepositId} onChange={(e) => setDummyDepositId(e.target.value)} />
          </label>
          <label>
            Ethereum User (0x...; defaults to connected Ethereum wallet)
            <input
              value={dummyEthereumUserAddress}
              onChange={(e) => setDummyEthereumUserAddress(e.target.value)}
              placeholder="0x..."
            />
          </label>
          <label>
            Destination Address (bc1... / op... / 0x...)
            <input
              value={dummyRecipientAddress}
              onChange={(e) => setDummyRecipientAddress(e.target.value)}
              placeholder="defaults to connected wallet"
            />
          </label>
          <label>
            Attestation Hash (optional override)
            <input
              value={dummyAttestationHashInput}
              onChange={(e) => setDummyAttestationHashInput(e.target.value)}
              placeholder="0x... (leave empty to auto-build)"
            />
          </label>
          <label>
            Dev Relay Private Keys (MLDSA-44, hex; test keys only)
            <div className="stack">
              {Array.from({ length: relayPrivateKeysInput.length }, (_, index) => (
                <input
                  key={`relay-private-key-${index}`}
                  value={relayPrivateKeysInput[index]}
                  onChange={(e) =>
                    setRelayPrivateKeysInput((prev) => {
                      const next = [...prev];
                      next[index] = e.target.value;
                      return next;
                    })
                  }
                  placeholder={`Relay ${index + 1} private key (0x...)`}
                />
              ))}
            </div>
          </label>
          <label>
            Relay Data JSON (paste test-only data; never commit private keys)
            <textarea
              value={relayDataJsonInput}
              onChange={(e) => setRelayDataJsonInput(e.target.value)}
              rows={6}
              placeholder='{"relayCount":0,"relayPubKeysPacked":"0x...","relayPrivateKeys":["0x..."]}'
            />
          </label>
          <div className="row">
            <input
              ref={relayJsonFileInputRef}
              type="file"
              accept=".json,application/json"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => {
                void loadJsonFileInto(e, 'relay');
              }}
            />
            <button onClick={() => relayJsonFileInputRef.current?.click()}>Upload Relay JSON(s)</button>
            <button onClick={loadRelayDataFromJson}>Load Relay Data JSON From Textarea</button>
          </div>
          <div className="row">
            <button
              onClick={() => {
                void (async () => {
                  try {
                    const ethereumUser = resolveEthereumUserAddress(dummyEthereumUserAddress);
                    const recipient = await resolveRecipientAddress(dummyRecipientAddress);
                    if (!recipient) {
                      setOutput('Destination address missing. Set destination input or connect OP_WALLET.');
                      return;
                    }

                    const rawAmount = parseHumanAmount(dummyAmount, resolveAssetDecimals(dummyAsset));
                    const parsedDepositId = parseDepositId(dummyDepositId);
                    const attestationVersion = parseAttestationVersion(mintAttestationVersionInput);
                    const hash = await buildMintAttestationHash(
                      dummyAsset,
                      ethereumUser,
                      recipient,
                      rawAmount,
                      parsedDepositId,
                      attestationVersion,
                    );
                    const hashHex = bytesToHex(hash);
                    setDummyAttestationHashInput(hashHex);
                    setDummyBuiltMessageHash(hashHex);
                    setOutput(
                      JSON.stringify(
                        {
                          action: 'dummy/attestation/build',
                          asset: dummyAsset,
                          attestationVersion,
                          ethereumUser: bytesToHex(ethereumUser),
                          recipient: recipient.toHex(),
                          rawAmount: rawAmount.toString(),
                          depositId: parsedDepositId.toString(),
                          bridge: resolvedBridgeAddress || bridgeAddress.trim() || '-',
                          messageHash: hashHex,
                        },
                        null,
                        2,
                      ),
                    );
                  } catch (error) {
                    setOutput(`Failed to build attestation hash: ${(error as Error).message}`);
                  }
                })();
              }}
            >
              Build Dummy Attestation
            </button>
            <button
              onClick={() => {
                void (async () => {
                  try {
                    const ethereumUser = resolveEthereumUserAddress(dummyEthereumUserAddress);
                    const recipient = await resolveRecipientAddress(dummyRecipientAddress);
                    if (!recipient) {
                      setOutput('Destination address missing. Set destination input or connect OP_WALLET.');
                      return;
                    }

                    const rawAmount = parseHumanAmount(dummyAmount, resolveAssetDecimals(dummyAsset));
                    const parsedDepositId = parseDepositId(dummyDepositId);
                    const attestationVersion = parseAttestationVersion(mintAttestationVersionInput);
                    const messageHash = dummyAttestationHashInput.trim()
                      ? hexToBytes(dummyAttestationHashInput.trim(), 32)
                      : await buildMintAttestationHash(
                          dummyAsset,
                          ethereumUser,
                          recipient,
                          rawAmount,
                          parsedDepositId,
                          attestationVersion,
                        );
                    const messageHashHex = bytesToHex(messageHash);
                    const bundle = buildRelaySignatureBundle(messageHash);
                    setDummyRelaySignatures(bundle.signatures);
                    setDummyRelayPubKeys(bundle.relayPubKeys);
                    setDummyRelayIndexes(bundle.thresholdRelayIndexes);
                    setDummyBuiltMessageHash(messageHashHex);

                    setOutput(
                      JSON.stringify(
                        {
                          action: 'dummy/relay-signatures/build',
                          asset: dummyAsset,
                          messageHash: messageHashHex,
                          thresholdRelayIndexes: bundle.thresholdRelayIndexes,
                          signedRelayIndexes: bundle.signedRelayIndexes,
                          relayHashes: bundle.relayHashes,
                          relayPubKeyLengths: bundle.relayPubKeys.map((entry) => entry.length),
                          signatureLengths: bundle.signatures.map((entry) => entry.length),
                        },
                        null,
                        2,
                      ),
                    );
                  } catch (error) {
                    setOutput(`Failed to build relay signatures: ${(error as Error).message}`);
                  }
                })();
              }}
            >
              Build Relay Signatures
            </button>
            <button
              onClick={() => {
                setMintAsset(dummyAsset);
                setMintAmount(dummyAmount);
                setMintDepositId(dummyDepositId);
                setMintEthereumUserAddress(dummyEthereumUserAddress);
                setMintRecipientAddress(dummyRecipientAddress);
                setMintAttestationHashInput(dummyBuiltMessageHash || dummyAttestationHashInput);
                setMintRelaySignatures(dummyRelaySignatures);
                setMintRelayPubKeys(dummyRelayPubKeys);
                setMintRelayIndexes(dummyRelayIndexes);
                setMintSelectedRelayIndexes(dummyRelayIndexes);
                setMintSignatureCountInput(activeRelayThreshold.toString());
                setMintSignatureSource(dummyBuiltMessageHash ? `dummy (${dummyBuiltMessageHash})` : 'dummy');
                setOutput('Loaded dummy attestation/signatures into Mint panel.');
              }}
            >
              Use In Mint Panel
            </button>
          </div>
          <pre className="status">
{`dummyMessageHash: ${dummyBuiltMessageHash || '-'}
dummyThresholdRelayIndexes: ${dummyRelayIndexes.length > 0 ? dummyRelayIndexes.join(', ') : '-'}
note: build relay signatures, then click "Use In Mint Panel".`}
          </pre>
        </div>

        <div>
          <h2>Mint From Attestation</h2>
          <label>
            Mint Candidate JSON (single candidate or mint-submission-candidates.json)
            <textarea
              value={mintCandidateJsonInput}
              onChange={(e) => setMintCandidateJsonInput(e.target.value)}
              rows={7}
              placeholder='{"candidates":[{"ready":true,"mintSubmission":{...}}]}'
            />
          </label>
          <div className="row">
            <input
              ref={mintCandidateJsonFileInputRef}
              type="file"
              accept=".json,application/json"
              style={{ display: 'none' }}
              onChange={(e) => {
                void loadJsonFileInto(e, 'mintCandidate');
              }}
            />
            <button onClick={() => mintCandidateJsonFileInputRef.current?.click()}>
              Upload Mint Candidate JSON
            </button>
            <button onClick={loadMintCandidateFromJson}>Load Candidate Into Mint Panel</button>
            <button onClick={() => void copyValue('mint candidate json', mintCandidateJsonInput || null)}>
              Copy Mint Candidate JSON
            </button>
          </div>
          <label>
            Asset
            <select value={mintAsset} onChange={(e) => setMintAsset(e.target.value as string)}>
              {renderAssetSelectOptions()}
            </select>
          </label>
          <label>
            Amount To Mint (human-readable)
            <input value={mintAmount} onChange={(e) => setMintAmount(e.target.value)} />
          </label>
          <pre className="status">
{`decimals: ${safeAssetDecimals(mintAsset)}
rawAmount: ${mintRawAmountPreview}`}
          </pre>
          <div className="row">
            <button
              onClick={() => void refreshSelectedAssetBalance(mintAsset)}
              disabled={selectedAssetBalanceLoading}
            >
              {selectedAssetBalanceLoading ? 'Refreshing Balance...' : 'Refresh Selected Asset Balance'}
            </button>
          </div>
          <pre className="status">
{`selectedAssetBalance: ${selectedAssetBalanceHuman}
selectedAssetBalanceRaw: ${selectedAssetBalanceRaw}`}
          </pre>
          <label>
            Deposit ID (uint256)
            <input value={mintDepositId} onChange={(e) => setMintDepositId(e.target.value)} />
          </label>
          <label>
            Ethereum User (0x...; defaults to connected Ethereum wallet)
            <input
              value={mintEthereumUserAddress}
              onChange={(e) => setMintEthereumUserAddress(e.target.value)}
              placeholder="0x..."
            />
          </label>
          <label>
            Destination Address (bc1... / op... / 0x...)
            <input
              value={mintRecipientAddress}
              onChange={(e) => setMintRecipientAddress(e.target.value)}
              placeholder="defaults to connected wallet"
            />
          </label>
          <label>
            Attestation Version (uint8)
            <input
              value={mintAttestationVersionInput}
              onChange={(e) => setMintAttestationVersionInput(e.target.value)}
            />
          </label>
          <label>
            Attestation Hash
            <input
              value={mintAttestationHashInput}
              onChange={(e) => setMintAttestationHashInput(e.target.value)}
              placeholder="0x... (leave empty to auto-build from fields)"
            />
          </label>
          <pre className="status">
{`signatureSource: ${mintSignatureSource}`}
          </pre>
          <label>
            Signatures To Submit (min threshold, max relay count)
            <input
              value={mintSignatureCountInput}
              onChange={(e) => setMintSignatureCountInput(e.target.value)}
            />
          </label>
          <div className="row">
            {Array.from({ length: activeRelayCount }, (_, index) => {
              const isSelected = mintSelectedRelayIndexes.includes(index);
              const hasSignature = (mintRelaySignatures[index] ?? EMPTY_BYTES).length > 0;
              return (
                <label key={`mint-relay-select-${index}`} className="inline-check">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      setMintSelectedRelayIndexes((prev) => {
                        let next: number[];
                        if (e.target.checked) {
                          next = prev.includes(index) ? prev : [...prev, index];
                        } else {
                          next = prev.filter((entry) => entry !== index);
                        }
                        syncMintSignatureCountWithSelection(next.length);
                        return next;
                      });
                    }}
                  />
                  {`r${index}${hasSignature ? '' : ' (missing sig)'}`}
                </label>
              );
            })}
          </div>
          <div className="row">
            <button
              onClick={() => {
                const signedIndexes = Array.from({ length: activeRelayCount }, (_, index) => index).filter(
                  (index) => (mintRelaySignatures[index] ?? EMPTY_BYTES).length > 0,
                );
                const next = signedIndexes.slice(0, activeRelayThreshold);
                setMintSelectedRelayIndexes(next);
                syncMintSignatureCountWithSelection(next.length);
              }}
            >
              Use Required Signed Relays
            </button>
            <button
              onClick={() => {
                const signedIndexes = Array.from({ length: activeRelayCount }, (_, index) => index).filter(
                  (index) => (mintRelaySignatures[index] ?? EMPTY_BYTES).length > 0,
                );
                setMintSelectedRelayIndexes(signedIndexes);
                syncMintSignatureCountWithSelection(signedIndexes.length);
              }}
            >
              Select All Signed Relays
            </button>
          </div>
          <div className="row">
            <button
              onClick={() => {
                void (async () => {
                  try {
                    const ethereumUser = resolveEthereumUserAddress(mintEthereumUserAddress);
                    const recipient = await resolveRecipientAddress(mintRecipientAddress);
                    if (!recipient) {
                      setOutput('Recipient address missing. Set recipient input or connect OP_WALLET.');
                      return;
                    }

                    const rawAmount = parseHumanAmount(mintAmount, resolveAssetDecimals(mintAsset));
                    const parsedDepositId = parseDepositId(mintDepositId);
                    const attestationVersion = parseAttestationVersion(mintAttestationVersionInput);
                    const messageHash = mintAttestationHashInput.trim()
                      ? hexToBytes(mintAttestationHashInput.trim(), 32)
                      : await buildMintAttestationHash(
                          mintAsset,
                          ethereumUser,
                          recipient,
                          rawAmount,
                          parsedDepositId,
                          attestationVersion,
                        );
                    const messageHashHex = bytesToHex(messageHash);
                    if (!dummyBuiltMessageHash || dummyBuiltMessageHash !== messageHashHex) {
                      setOutput(
                        `No matching dummy signatures for message hash ${messageHashHex}. Build signatures in Dummy Relay Builder and load them.`,
                      );
                      return;
                    }

                    const selected = getMintRelaySelection();
                    await runAction(
                      'mintWithRelaySignatures/simulate',
                      (bridge) =>
                        bridge.mintWithRelaySignatures(
                          resolveAssetId(mintAsset),
                          ethereumUser,
                          recipient,
                          rawAmount,
                          parsedDepositId,
                          attestationVersion,
                          selected.relayIndexesPacked,
                          selected.relaySignaturesPacked,
                        ),
                      false,
                    );
                  } catch (error) {
                    setOutput(`Invalid mint request: ${(error as Error).message}`);
                  }
                })();
              }}
            >
              Simulate Mint
            </button>
            <button
              onClick={() => {
                void (async () => {
                  try {
                    const ethereumUser = resolveEthereumUserAddress(mintEthereumUserAddress);
                    const recipient = await resolveRecipientAddress(mintRecipientAddress);
                    if (!recipient) {
                      setOutput('Recipient address missing.');
                      return;
                    }

                    const rawAmount = parseHumanAmount(mintAmount, resolveAssetDecimals(mintAsset));
                    const parsedDepositId = parseDepositId(mintDepositId);
                    const attestationVersion = parseAttestationVersion(mintAttestationVersionInput);
                    const messageHash = mintAttestationHashInput.trim()
                      ? hexToBytes(mintAttestationHashInput.trim(), 32)
                      : await buildMintAttestationHash(
                          mintAsset,
                          ethereumUser,
                          recipient,
                          rawAmount,
                          parsedDepositId,
                          attestationVersion,
                        );
                    const messageHashHex = bytesToHex(messageHash);
                    if (!dummyBuiltMessageHash || dummyBuiltMessageHash !== messageHashHex) {
                      setOutput(
                        `No matching dummy signatures for message hash ${messageHashHex}. Build signatures in Dummy Relay Builder and load them.`,
                      );
                      return;
                    }

                    const selected = getMintRelaySelection();
                    const depositKey = parsedDepositId.toString();
                    if (pendingDepositIds.includes(depositKey)) {
                      setOutput(
                        `Deposit ID ${depositKey} is already pending in this UI session. Wait for confirmation or clear it manually before reusing.`,
                      );
                      return;
                    }

                    const result = await runAction(
                      'mintWithRelaySignatures/send',
                      (bridge) =>
                        bridge.mintWithRelaySignatures(
                          resolveAssetId(mintAsset),
                          ethereumUser,
                          recipient,
                          rawAmount,
                          parsedDepositId,
                          attestationVersion,
                          selected.relayIndexesPacked,
                          selected.relaySignaturesPacked,
                        ),
                      true,
                    );

                    if (result.sent) {
                      setPendingDepositIds((prev) =>
                        prev.includes(depositKey) ? prev : [...prev, depositKey],
                      );
                    }
                  } catch (error) {
                    setOutput(`Invalid mint request: ${(error as Error).message}`);
                  }
                })();
              }}
            >
              Simulate + Send Mint
            </button>
          </div>
          <pre className="status">
{`pendingDepositIds: ${pendingDepositIds.length > 0 ? pendingDepositIds.join(', ') : '-'}`}
          </pre>
          <pre className="status">
{`mintThresholdRelayIndexes: ${mintRelayIndexes.length > 0 ? mintRelayIndexes.join(', ') : '-'}`}
          </pre>
          <pre className="status">
{`selectedRelayIndexes: ${mintSelectedRelayIndexes.length > 0 ? mintSelectedRelayIndexes.join(', ') : '-'}
signatureCountInput: ${mintSignatureCountInput}
availableSignatures: ${mintRelaySignatures
  .map((entry, index) => (entry.length > 0 ? index : -1))
  .filter((index) => index >= 0)
  .join(', ') || '-'}`}
          </pre>
          <div className="row">
            <button
              onClick={() => {
                const key = mintDepositId.trim();
                if (!key) {
                  setOutput('Deposit ID input is empty.');
                  return;
                }
                setPendingDepositIds((prev) => prev.filter((id) => id !== key));
                setOutput(`Removed deposit ID ${key} from local pending list.`);
              }}
            >
              Clear Current Deposit ID
            </button>
            <button
              onClick={() => {
                setPendingDepositIds([]);
                setOutput('Cleared local pending deposit ID list.');
              }}
            >
              Clear All Pending IDs
            </button>
          </div>
        </div>
      </section>

      <section className="panel">
        <div>
          <h2>Burn Request</h2>
          <label>
            Asset
            <select value={asset} onChange={(e) => setAsset(e.target.value as string)}>
              {renderAssetSelectOptions()}
            </select>
          </label>
          <label>
            Amount (human-readable)
            <input value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
          <pre className="status">
{`decimals: ${safeAssetDecimals(asset)}
rawAmount: ${rawAmountPreview}`}
          </pre>
          <div className="row">
            <button onClick={() => void refreshSelectedAssetBalance(asset)} disabled={selectedAssetBalanceLoading}>
              {selectedAssetBalanceLoading ? 'Refreshing Balance...' : 'Refresh Selected Asset Balance'}
            </button>
          </div>
          <pre className="status">
{`selectedAssetBalance: ${selectedAssetBalanceHuman}
selectedAssetBalanceRaw: ${selectedAssetBalanceRaw}`}
          </pre>
          <div className="row">
            <button onClick={() => void fillBurnMaxAmount()} disabled={burnMaxLoading}>
              {burnMaxLoading ? 'Loading Max...' : 'Use Max Amount'}
            </button>
          </div>
          <label>
            Ethereum Recipient (0x...)
            <input
              value={burnEthereumRecipientAddress}
              onChange={(e) => setBurnEthereumRecipientAddress(e.target.value)}
              placeholder="0x..."
            />
          </label>
          <div className="row">
            <button
              onClick={() => {
                if (!opnetAddress) {
                  setOutput('Connect OP_WALLET first to provide sender address for burn request.');
                  return;
                }
                let rawAmount: bigint;
                let ethereumRecipient: Address;
                try {
                  rawAmount = parseHumanAmount(amount, resolveAssetDecimals(asset));
                  ethereumRecipient = bytesToAddressWord(
                    resolveWord32Bytes(
                      normalizeEthereumAddress(burnEthereumRecipientAddress, 'Ethereum burn recipient'),
                      'Ethereum burn recipient',
                    ),
                    'Ethereum burn recipient',
                  );
                } catch (error) {
                  setOutput(`Invalid burn amount: ${(error as Error).message}`);
                  return;
                }

                void runAction(
                  'requestBurn/simulate',
                  (bridge) =>
                    bridge.requestBurn(
                      resolveAssetId(asset),
                      opnetAddress,
                      ethereumRecipient,
                      rawAmount,
                    ),
                  false,
                );
              }}
            >
              Simulate Burn
            </button>
            <button
              onClick={() => {
                if (!opnetAddress) {
                  setOutput('Connect OP_WALLET first to provide sender address for burn request.');
                  return;
                }
                let rawAmount: bigint;
                let ethereumRecipient: Address;
                try {
                  rawAmount = parseHumanAmount(amount, resolveAssetDecimals(asset));
                  ethereumRecipient = bytesToAddressWord(
                    resolveWord32Bytes(
                      normalizeEthereumAddress(burnEthereumRecipientAddress, 'Ethereum burn recipient'),
                      'Ethereum burn recipient',
                    ),
                    'Ethereum burn recipient',
                  );
                } catch (error) {
                  setOutput(`Invalid burn amount: ${(error as Error).message}`);
                  return;
                }

                void runAction(
                  'requestBurn/send',
                  (bridge) =>
                    bridge.requestBurn(
                      resolveAssetId(asset),
                      opnetAddress,
                      ethereumRecipient,
                      rawAmount,
                    ),
                  true,
                );
              }}
            >
              Simulate + Send Burn
            </button>
          </div>
        </div>
      </section>

      <section className="panel two-col">
        <div>
          <h2>Admin Wiring</h2>
          <label>
            Asset For setWrappedToken
            <select value={asset} onChange={(e) => setAsset(e.target.value as string)}>
              {renderAssetSelectOptions()}
            </select>
          </label>
          <label>
            Wrapped Token Address
            <input
              value={assetTokenAddresses[asset] ?? ''}
              onChange={(e) =>
                setAssetTokenAddresses((prev) => ({
                  ...prev,
                  [asset]: e.target.value,
                }))
              }
              placeholder="op..."
            />
          </label>
          <pre className="status">
{availableAssets.map((symbol) => `${symbol} token: ${assetTokenAddresses[symbol] || '-'}`).join('\n')}
          </pre>
          <div className="row">
            <button
              onClick={() => {
                if (!selectedAssetTokenAddress) {
                  setOutput('Wrapped token address is required.');
                  return;
                }

                void runAction(
                  'setWrappedToken/simulate',
                  async (bridge) =>
                    bridge.setWrappedToken(
                      resolveAssetId(asset),
                      await resolveAddressForAbi(selectedAssetTokenAddress, true),
                    ),
                  false,
                );
              }}
            >
              Simulate setWrappedToken
            </button>
            <button
              onClick={() => {
                if (!selectedAssetTokenAddress) {
                  setOutput('Wrapped token address is required.');
                  return;
                }

                void runAction(
                  'setWrappedToken/send',
                  async (bridge) =>
                    bridge.setWrappedToken(
                      resolveAssetId(asset),
                      await resolveAddressForAbi(selectedAssetTokenAddress, true),
                    ),
                  true,
                );
              }}
            >
              Simulate + Send setWrappedToken
            </button>
          </div>
          <label>
            Ethereum Vault Address (Sepolia `0x...`)
            <input
              value={ethereumVaultAddress}
              onChange={(e) => setEthereumVaultAddress(e.target.value)}
              placeholder="0x..."
            />
          </label>
          <div className="row">
            <button
              onClick={() => {
                if (!ethereumVaultAddress.trim()) {
                  setOutput('Ethereum vault address is required.');
                  return;
                }
                void (async () => {
                  try {
                    const vault = bytesToAddressWord(
                      resolveWord32Bytes(ethereumVaultAddress, 'ethereum vault'),
                      'ethereum vault',
                    );
                    await runAction(
                      'setEthereumVault/simulate',
                      (bridge) => bridge.setEthereumVault(vault),
                      false,
                    );
                  } catch (error) {
                    setOutput(`Invalid ethereum vault address: ${(error as Error).message}`);
                  }
                })();
              }}
            >
              Simulate setEthereumVault
            </button>
            <button
              onClick={() => {
                if (!ethereumVaultAddress.trim()) {
                  setOutput('Ethereum vault address is required.');
                  return;
                }
                void (async () => {
                  try {
                    const vault = bytesToAddressWord(
                      resolveWord32Bytes(ethereumVaultAddress, 'ethereum vault'),
                      'ethereum vault',
                    );
                    await runAction(
                      'setEthereumVault/send',
                      (bridge) => bridge.setEthereumVault(vault),
                      true,
                    );
                  } catch (error) {
                    setOutput(`Invalid ethereum vault address: ${(error as Error).message}`);
                  }
                })();
              }}
            >
              Simulate + Send setEthereumVault
            </button>
          </div>
          <label>
            Attestation Version (uint8)
            <input
              value={attestationVersionInput}
              onChange={(e) => setAttestationVersionInput(e.target.value)}
            />
          </label>
          <label className="inline-check">
            <input
              type="checkbox"
              checked={attestationVersionAcceptedInput}
              onChange={(e) => setAttestationVersionAcceptedInput(e.target.checked)}
            />
            Accepted For Selected Version
          </label>
          <div className="row">
            <button
              onClick={() => {
                void (async () => {
                  try {
                    const version = parseAttestationVersionAdminInput(attestationVersionInput);
                    await runAction(
                      'setAttestationVersionAccepted/simulate',
                      (bridge) => bridge.setAttestationVersionAccepted(version, attestationVersionAcceptedInput),
                      false,
                    );
                  } catch (error) {
                    setOutput(`Invalid attestation version controls: ${(error as Error).message}`);
                  }
                })();
              }}
            >
              Simulate setAttestationVersionAccepted
            </button>
            <button
              onClick={() => {
                void (async () => {
                  try {
                    const version = parseAttestationVersionAdminInput(attestationVersionInput);
                    await runAction(
                      'setAttestationVersionAccepted/send',
                      (bridge) => bridge.setAttestationVersionAccepted(version, attestationVersionAcceptedInput),
                      true,
                    );
                  } catch (error) {
                    setOutput(`Invalid attestation version controls: ${(error as Error).message}`);
                  }
                })();
              }}
            >
              Simulate + Send setAttestationVersionAccepted
            </button>
          </div>
          <div className="row">
            <button
              onClick={() => {
                void (async () => {
                  try {
                    const version = parseAttestationVersionAdminInput(attestationVersionInput);
                    await runAction(
                      'setActiveAttestationVersion/simulate',
                      (bridge) => bridge.setActiveAttestationVersion(version),
                      false,
                    );
                  } catch (error) {
                    setOutput(`Invalid active attestation version: ${(error as Error).message}`);
                  }
                })();
              }}
            >
              Simulate setActiveAttestationVersion
            </button>
            <button
              onClick={() => {
                void (async () => {
                  try {
                    const version = parseAttestationVersionAdminInput(attestationVersionInput);
                    await runAction(
                      'setActiveAttestationVersion/send',
                      (bridge) => bridge.setActiveAttestationVersion(version),
                      true,
                    );
                  } catch (error) {
                    setOutput(`Invalid active attestation version: ${(error as Error).message}`);
                  }
                })();
              }}
            >
              Simulate + Send setActiveAttestationVersion
            </button>
          </div>
          <label>
            Relay Index (0-based)
            <input value={relayIndexInput} onChange={(e) => setRelayIndexInput(e.target.value)} />
          </label>
          <label>
            Relay Count (1-32)
            <input value={relayCountInput} onChange={(e) => setRelayCountInput(e.target.value)} />
          </label>
          <label>
            Relay Threshold (1-32, {'<='} relay count)
            <input value={relayThresholdInput} onChange={(e) => setRelayThresholdInput(e.target.value)} />
          </label>
          <div className="row">
            <button
              onClick={() => {
                const value = Number.parseInt(relayCountInput.trim(), 10);
                if (!Number.isFinite(value)) {
                  setOutput('Relay count must be an integer.');
                  return;
                }
                void runAction(
                  'setRelayCount/simulate',
                  (bridge) => bridge.setRelayCount(value),
                  false,
                );
              }}
            >
              Simulate setRelayCount
            </button>
            <button
              onClick={() => {
                const value = Number.parseInt(relayCountInput.trim(), 10);
                if (!Number.isFinite(value)) {
                  setOutput('Relay count must be an integer.');
                  return;
                }
                void runAction(
                  'setRelayCount/send',
                  (bridge) => bridge.setRelayCount(value),
                  true,
                );
              }}
            >
              Simulate + Send setRelayCount
            </button>
          </div>
          <div className="row">
            <label style={{ flex: 1 }}>
              Packed Relay Public Keys For setRelaysConfigPacked (hex; N * 1312 bytes)
              <textarea
                value={relayPubKeysPackedInput}
                onChange={(e) => setRelayPubKeysPackedInput(e.target.value)}
                placeholder="0x..."
                rows={4}
              />
            </label>
          </div>
          <div className="row">
            <button
              onClick={() => {
                if (!relayPubKeysPackedInput.trim()) {
                  setOutput('Packed relay pubkeys hex is required.');
                  return;
                }
                const value = Number.parseInt(relayThresholdInput.trim(), 10);
                if (!Number.isFinite(value)) {
                  setOutput('Relay threshold must be an integer.');
                  return;
                }
                void (async () => {
                  try {
                    const packed = hexToBytes(relayPubKeysPackedInput.trim());
                    await runAction(
                      'setRelaysConfigPacked/simulate',
                      (bridge) => bridge.setRelaysConfigPacked(packed, value),
                      false,
                    );
                  } catch (error) {
                    setOutput(`Invalid relay config input: ${(error as Error).message}`);
                  }
                })();
              }}
            >
              Simulate setRelaysConfigPacked
            </button>
            <button
              onClick={() => {
                if (!relayPubKeysPackedInput.trim()) {
                  setOutput('Packed relay pubkeys hex is required.');
                  return;
                }
                const value = Number.parseInt(relayThresholdInput.trim(), 10);
                if (!Number.isFinite(value)) {
                  setOutput('Relay threshold must be an integer.');
                  return;
                }
                void (async () => {
                  try {
                    const packed = hexToBytes(relayPubKeysPackedInput.trim());
                    await runAction(
                      'setRelaysConfigPacked/send',
                      (bridge) => bridge.setRelaysConfigPacked(packed, value),
                      true,
                    );
                  } catch (error) {
                    setOutput(`Invalid relay config input: ${(error as Error).message}`);
                  }
                })();
              }}
            >
              Simulate + Send setRelaysConfigPacked
            </button>
          </div>
          <div className="row">
            <button
              onClick={() => {
                const value = Number.parseInt(relayThresholdInput.trim(), 10);
                if (!Number.isFinite(value)) {
                  setOutput('Relay threshold must be an integer.');
                  return;
                }
                void runAction(
                  'setRelayThreshold/simulate',
                  (bridge) => bridge.setRelayThreshold(value),
                  false,
                );
              }}
            >
              Simulate setRelayThreshold
            </button>
            <button
              onClick={() => {
                const value = Number.parseInt(relayThresholdInput.trim(), 10);
                if (!Number.isFinite(value)) {
                  setOutput('Relay threshold must be an integer.');
                  return;
                }
                void runAction(
                  'setRelayThreshold/send',
                  (bridge) => bridge.setRelayThreshold(value),
                  true,
                );
              }}
            >
              Simulate + Send setRelayThreshold
            </button>
          </div>
          <label>
            Add Supported Assets JSON (array of {`{ assetId, token, symbol, decimals }`})
            <textarea
              value={assetsConfigJsonInput}
              onChange={(e) => setAssetsConfigJsonInput(e.target.value)}
              placeholder='[{"assetId":1,"token":"op...","symbol":"USDT","decimals":6}]'
              rows={8}
            />
          </label>
          <div className="row">
            <button
              onClick={() => {
                void (async () => {
                  try {
                    const packed = await buildSupportedAssetsPackedFromJson();
                    await runAction(
                      'setSupportedAssetsPacked/simulate',
                      (bridge) => bridge.setSupportedAssetsPacked(packed),
                      false,
                    );
                  } catch (error) {
                    setOutput(`Invalid supported assets payload: ${(error as Error).message}`);
                  }
                })();
              }}
            >
              Simulate setSupportedAssetsPacked
            </button>
            <button
              onClick={() => {
                void (async () => {
                  try {
                    const packed = await buildSupportedAssetsPackedFromJson();
                    await runAction(
                      'setSupportedAssetsPacked/send',
                      (bridge) => bridge.setSupportedAssetsPacked(packed),
                      true,
                    );
                  } catch (error) {
                    setOutput(`Invalid supported assets payload: ${(error as Error).message}`);
                  }
                })();
              }}
            >
              Simulate + Send setSupportedAssetsPacked
            </button>
          </div>
          <label>
            Remove Supported Asset IDs JSON (array of uint8 ids)
            <textarea
              value={removeAssetIdsInput}
              onChange={(e) => setRemoveAssetIdsInput(e.target.value)}
              placeholder='[1,3]'
              rows={3}
            />
          </label>
          <div className="row">
            <button
              onClick={() => {
                try {
                  const packed = buildRemoveSupportedAssetsPackedFromJson();
                  void runAction(
                    'removeSupportedAssetsPacked/simulate',
                    (bridge) => bridge.removeSupportedAssetsPacked(packed),
                    false,
                  );
                } catch (error) {
                  setOutput(`Invalid remove assets payload: ${(error as Error).message}`);
                }
              }}
            >
              Simulate removeSupportedAssetsPacked
            </button>
            <button
              onClick={() => {
                try {
                  const packed = buildRemoveSupportedAssetsPackedFromJson();
                  void runAction(
                    'removeSupportedAssetsPacked/send',
                    (bridge) => bridge.removeSupportedAssetsPacked(packed),
                    true,
                  );
                } catch (error) {
                  setOutput(`Invalid remove assets payload: ${(error as Error).message}`);
                }
              }}
            >
              Simulate + Send removeSupportedAssetsPacked
            </button>
          </div>
          <label>
            Remove Supported Asset ID (single)
            <input value={removeAssetIdInput} onChange={(e) => setRemoveAssetIdInput(e.target.value)} />
          </label>
          <div className="row">
            <button
              onClick={() => {
                const value = Number.parseInt(removeAssetIdInput.trim(), 10);
                if (!Number.isFinite(value) || value < 0 || value > 255) {
                  setOutput('Asset ID must be an integer in [0,255].');
                  return;
                }
                void runAction(
                  'removeSupportedAsset/simulate',
                  (bridge) => bridge.removeSupportedAsset(value),
                  false,
                );
              }}
            >
              Simulate removeSupportedAsset
            </button>
            <button
              onClick={() => {
                const value = Number.parseInt(removeAssetIdInput.trim(), 10);
                if (!Number.isFinite(value) || value < 0 || value > 255) {
                  setOutput('Asset ID must be an integer in [0,255].');
                  return;
                }
                void runAction(
                  'removeSupportedAsset/send',
                  (bridge) => bridge.removeSupportedAsset(value),
                  true,
                );
              }}
            >
              Simulate + Send removeSupportedAsset
            </button>
          </div>
          <div className="row">
            <button
              onClick={() => {
                void runAction(
                  'setPaused/simulate',
                  (bridge) => bridge.setPaused(true),
                  false,
                );
              }}
            >
              Simulate Pause Bridge
            </button>
            <button
              onClick={() => {
                void runAction(
                  'setPaused/send',
                  (bridge) => bridge.setPaused(true),
                  true,
                );
              }}
            >
              Simulate + Send Pause Bridge
            </button>
          </div>
          <div className="row">
            <button
              onClick={() => {
                void runAction(
                  'setPaused(false)/simulate',
                  (bridge) => bridge.setPaused(false),
                  false,
                );
              }}
            >
              Simulate Unpause Bridge
            </button>
            <button
              onClick={() => {
                void runAction(
                  'setPaused(false)/send',
                  (bridge) => bridge.setPaused(false),
                  true,
                );
              }}
            >
              Simulate + Send Unpause Bridge
            </button>
          </div>
          <label>
            Relay Public Key (hex, 1312 bytes for selected relay index)
            <textarea
              value={relayPubKeyInput}
              onChange={(e) => setRelayPubKeyInput(e.target.value)}
              placeholder="0x..."
              rows={4}
            />
          </label>
          <div className="row">
            <button
              onClick={() => {
                const relayIndex = Number(relayIndexInput || '0');
                const relayPubKey = dummyRelayPubKeys[relayIndex] ?? EMPTY_BYTES;
                if (relayPubKey.length === 0) {
                  setOutput(`No dummy relay pubkey available for relay index ${relayIndex}.`);
                  return;
                }
                setRelayPubKeyInput(bytesToHex(relayPubKey));
                setOutput(`Loaded dummy relay pubkey for relay index ${relayIndex}.`);
              }}
            >
              Load Dummy Relay PubKey
            </button>
            <button
              onClick={() => {
                for (let i = 0; i < activeRelayCount; i++) {
                  if ((dummyRelayPubKeys[i] ?? EMPTY_BYTES).length !== 1312) {
                    setOutput(
                      `Need ${activeRelayCount} dummy relay pubkeys (1312 bytes each) to build packed input.`,
                    );
                    return;
                  }
                }
                const combined = new Uint8Array(activeRelayCount * 1312);
                for (let i = 0; i < activeRelayCount; i++) {
                  combined.set(dummyRelayPubKeys[i], i * 1312);
                }
                setRelayPubKeysPackedInput(bytesToHex(combined));
                setOutput(
                  `Built packed relay pubkeys from dummy relay keys for current relay count (${activeRelayCount}).`,
                );
              }}
            >
              Build Packed Relay PubKeys
            </button>
          </div>
          <div className="row">
            <button
              onClick={() => {
                if (!relayPubKeyInput.trim()) {
                  setOutput('Relay pubkey is required.');
                  return;
                }
                void (async () => {
                  try {
                    const relayPubKey = hexToBytes(relayPubKeyInput.trim(), 1312);
                    await runAction(
                      'setRelayPubKey/simulate',
                      (bridge) => bridge.setRelayPubKey(Number(relayIndexInput || '0'), relayPubKey),
                      false,
                    );
                  } catch (error) {
                    setOutput(`Invalid relay pubkey input: ${(error as Error).message}`);
                  }
                })();
              }}
            >
              Simulate setRelayPubKey
            </button>
            <button
              onClick={() => {
                if (!relayPubKeyInput.trim()) {
                  setOutput('Relay pubkey is required.');
                  return;
                }
                void (async () => {
                  try {
                    const relayPubKey = hexToBytes(relayPubKeyInput.trim(), 1312);
                    await runAction(
                      'setRelayPubKey/send',
                      (bridge) => bridge.setRelayPubKey(Number(relayIndexInput || '0'), relayPubKey),
                      true,
                    );
                  } catch (error) {
                    setOutput(`Invalid relay pubkey input: ${(error as Error).message}`);
                  }
                })();
              }}
            >
              Simulate + Send setRelayPubKey
            </button>
          </div>
          <div className="row">
            <button onClick={loadRelayDataFromJson}>Load Relay Data JSON From Textarea</button>
          </div>
          <label>
            Packed Relay PubKeys (hex: {activeRelayCount} * 1312 bytes)
            <textarea
              value={relayPubKeysPackedInput}
              onChange={(e) => setRelayPubKeysPackedInput(e.target.value)}
              placeholder="0x..."
              rows={4}
            />
          </label>
          <div className="row">
            <button
              onClick={() => {
                if (!relayPubKeysPackedInput.trim()) {
                  setOutput('Packed relay pubkeys hex is required.');
                  return;
                }
                void (async () => {
                  try {
                    const packed = hexToBytes(relayPubKeysPackedInput.trim(), activeRelayCount * 1312);
                    await runAction(
                      'setRelayPubKeysPacked/simulate',
                      (bridge) => bridge.setRelayPubKeysPacked(packed),
                      false,
                    );
                  } catch (error) {
                    setOutput(`Invalid packed relay pubkeys input: ${(error as Error).message}`);
                  }
                })();
              }}
            >
              Simulate setRelayPubKeysPacked
            </button>
            <button
              onClick={() => {
                if (!relayPubKeysPackedInput.trim()) {
                  setOutput('Packed relay pubkeys hex is required.');
                  return;
                }
                void (async () => {
                  try {
                    const packed = hexToBytes(relayPubKeysPackedInput.trim(), activeRelayCount * 1312);
                    await runAction(
                      'setRelayPubKeysPacked/send',
                      (bridge) => bridge.setRelayPubKeysPacked(packed),
                      true,
                    );
                  } catch (error) {
                    setOutput(`Invalid packed relay pubkeys input: ${(error as Error).message}`);
                  }
                })();
              }}
            >
              Simulate + Send setRelayPubKeysPacked
            </button>
          </div>
          <label>
            New Owner Address
            <input
              value={newOwnerAddress}
              onChange={(e) => setNewOwnerAddress(e.target.value)}
              placeholder="op..."
            />
          </label>
          <div className="row">
            <button
              onClick={() => {
                if (!newOwnerAddress.trim()) {
                  setOutput('New owner address is required.');
                  return;
                }
                void runAction(
                  'transferOwnership/simulate',
                  async (bridge) =>
                    bridge.transferOwnership(await resolveAddressForAbi(newOwnerAddress.trim(), false)),
                  false,
                );
              }}
            >
              Simulate transferOwnership
            </button>
            <button
              onClick={() => {
                if (!newOwnerAddress.trim()) {
                  setOutput('New owner address is required.');
                  return;
                }
                void runAction(
                  'transferOwnership/send',
                  async (bridge) =>
                    bridge.transferOwnership(await resolveAddressForAbi(newOwnerAddress.trim(), false)),
                  true,
                );
              }}
            >
              Simulate + Send transferOwnership
            </button>
          </div>
        </div>

        <div>
          <h2>Transaction Params</h2>
          <label>
            Max Sats To Spend
            <input value={maxSatSpend} onChange={(e) => setMaxSatSpend(e.target.value)} />
          </label>
          <label>
            Fee Rate (sat/vB)
            <input value={feeRate} onChange={(e) => setFeeRate(e.target.value)} />
          </label>
          <pre className="status">
{`senderAddress: ${opnetAddress ? 'resolved' : 'not resolved'}
readProvider: ${RPC_URLS[networkMode]}
writeProvider: ${walletProvider ? 'wallet provider ready' : 'missing'}
note: all sends run simulate-first and only send if simulation succeeds.`}
          </pre>
        </div>
      </section>
        </>
      ) : (
        <>
          <section className="panel two-col">
            <div>
              <h2>Ethereum Wallet</h2>
              <div className="row">
                <button onClick={() => void connectEthereumWallet()}>Connect Ethereum Wallet</button>
                <button onClick={() => void refreshEthereumWalletState()}>Refresh Wallet State</button>
                <button onClick={disconnectEthereumWallet}>Clear Wallet State</button>
              </div>
              <pre className="status">
{`wallet: ${ethereumWalletAddress || '-'}
chainId: ${ethereumChainId || '-'} ${ethereumChainId === SEPOLIA_CHAIN_ID_HEX ? '(Sepolia)' : ethereumChainId ? '(not Sepolia)' : ''}
balanceEth: ${ethereumBalanceEth}`}
              </pre>
            </div>
            <div>
              <h2>Paste Deployment JSON</h2>
              <label>
                Deployment JSON (`sepolia-latest.json` or mapping payload)
                <textarea
                  value={deploymentJsonInput}
                  onChange={(e) => setDeploymentJsonInput(e.target.value)}
                  rows={8}
                  placeholder='{"ethereum":{"vaultAddress":"0x...","assets":[...]}, "opnet":{"bridgeAddress":"op..."}}'
                />
              </label>
              <div className="row">
                <input
                  ref={deploymentJsonFileInputRef}
                  type="file"
                  accept=".json,application/json"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    void loadJsonFileInto(e, 'deployment');
                  }}
                />
                <button onClick={() => deploymentJsonFileInputRef.current?.click()}>
                  Upload Deployment JSON
                </button>
                <button onClick={loadBundledSepoliaDeployment}>Load Default Sepolia JSON</button>
                <button onClick={loadSepoliaDeploymentJson}>Load Deployment JSON Into Fields</button>
                <button onClick={() => void copyValue('deployment json', deploymentJsonInput || null)}>
                  Copy Deployment JSON
                </button>
              </div>
            </div>
          </section>

          <section className="panel two-col">
            <div>
              <h2>Sepolia Deployment Steps</h2>
              <pre className="status">
{`1. Set env vars:
   SEPOLIA_RPC_URL
   SEPOLIA_DEPLOYER_PRIVATE_KEY
   ETH_VAULT_OWNER (optional)
2. Deploy vault + 4 test tokens:
   npm run deploy:sepolia --workspace @opbridge/ethereum-contracts
3. If owner != deployer, configure assets:
   npm run configure:sepolia --workspace @opbridge/ethereum-contracts
4. Paste deployed addresses in this tab, then export mapping JSON for relayer.`}
              </pre>
              <label>
                Sepolia RPC URL
                <input
                  value={ethereumRpcUrl}
                  onChange={(e) => setEthereumRpcUrl(e.target.value)}
                  placeholder="https://eth-sepolia.g.alchemy.com/v2/..."
                />
              </label>
              <label>
                OpBridgeVault (Sepolia)
                <input
                  value={ethereumVaultAddress}
                  onChange={(e) => setEthereumVaultAddress(e.target.value)}
                  placeholder="0x..."
                />
              </label>
            </div>
            <div>
              <h2>Sepolia Token Addresses</h2>
              <label>
                USDT (assetId 0)
                <input
                  value={ethereumTokenAddresses.USDT}
                  onChange={(e) =>
                    setEthereumTokenAddresses((prev) => ({ ...prev, USDT: e.target.value }))
                  }
                  placeholder="0x..."
                />
              </label>
              <label>
                WBTC (assetId 1)
                <input
                  value={ethereumTokenAddresses.WBTC}
                  onChange={(e) =>
                    setEthereumTokenAddresses((prev) => ({ ...prev, WBTC: e.target.value }))
                  }
                  placeholder="0x..."
                />
              </label>
              <label>
                WETH (assetId 2)
                <input
                  value={ethereumTokenAddresses.WETH}
                  onChange={(e) =>
                    setEthereumTokenAddresses((prev) => ({ ...prev, WETH: e.target.value }))
                  }
                  placeholder="0x..."
                />
              </label>
              <label>
                PAXG (assetId 3)
                <input
                  value={ethereumTokenAddresses.PAXG}
                  onChange={(e) =>
                    setEthereumTokenAddresses((prev) => ({ ...prev, PAXG: e.target.value }))
                  }
                  placeholder="0x..."
                />
              </label>
            </div>
          </section>

          <section className="panel two-col">
            <div>
              <h2>Deposit To Vault</h2>
              <label>
                Asset
                <select
                  value={ethereumDepositAsset}
                  onChange={(e) =>
                    setEthereumDepositAsset(e.target.value as 'USDT' | 'WBTC' | 'WETH' | 'PAXG')
                  }
                >
                  <option value="USDT">USDT (assetId 0, 6 decimals)</option>
                  <option value="WBTC">WBTC (assetId 1, 8 decimals)</option>
                  <option value="WETH">WETH (assetId 2, 18 decimals)</option>
                  <option value="PAXG">PAXG (assetId 3, 18 decimals)</option>
                </select>
              </label>
              <label>
                Amount
                <input
                  value={ethereumDepositAmount}
                  onChange={(e) => setEthereumDepositAmount(e.target.value)}
                  placeholder="1"
                />
              </label>
              <label>
                OPNet Recipient (bytes32 hex)
                <input
                  value={ethereumDepositRecipient}
                  onChange={(e) => setEthereumDepositRecipient(e.target.value)}
                  placeholder="0x..."
                />
              </label>
              <div className="row">
                <button onClick={() => void checkEthereumDepositAssetBalance()}>Check Balance</button>
                <button onClick={() => void runEthereumApproveAndDeposit()} disabled={ethereumDepositRunning}>
                  {ethereumDepositRunning ? 'Processing...' : 'Approve + Deposit'}
                </button>
              </div>
            </div>
            <div>
              <h2>Deposit Preview</h2>
              <pre className="status">
{`network: ${ethereumChainId === SEPOLIA_CHAIN_ID_HEX ? 'sepolia' : ethereumChainId || '-'}
wallet: ${ethereumWalletAddress || '-'}
vault: ${ethereumVaultAddress || '-'}
token (${ethereumDepositAsset}): ${ethereumTokenAddresses[ethereumDepositAsset] || '-'}
amountRaw: ${ethereumDepositRawPreview}
balanceRaw: ${ethereumDepositBalanceRaw}
balanceHuman: ${ethereumDepositBalanceHuman}
recipient: ${(ethereumDepositRecipient || hashedMLDSAKey || '-').trim()}
flow: approve(token -> vault) then depositERC20(assetId, amount, recipient)`}
              </pre>
            </div>
          </section>

          <section className="panel two-col">
            <div>
              <h2>OPNet Regtest Mapping</h2>
              <label>
                Bridge Contract (regtest)
                <input
                  value={bridgeAddress}
                  onChange={(e) => setBridgeAddress(e.target.value)}
                  placeholder="op..."
                />
              </label>
              <label>
                opUSDT (assetId 0)
                <input
                  value={opnetWrappedAddresses.USDT}
                  onChange={(e) =>
                    setOpnetWrappedAddresses((prev) => ({ ...prev, USDT: e.target.value }))
                  }
                  placeholder="op..."
                />
              </label>
              <label>
                opWBTC (assetId 1)
                <input
                  value={opnetWrappedAddresses.WBTC}
                  onChange={(e) =>
                    setOpnetWrappedAddresses((prev) => ({ ...prev, WBTC: e.target.value }))
                  }
                  placeholder="op..."
                />
              </label>
              <label>
                opWETH (assetId 2)
                <input
                  value={opnetWrappedAddresses.WETH}
                  onChange={(e) =>
                    setOpnetWrappedAddresses((prev) => ({ ...prev, WETH: e.target.value }))
                  }
                  placeholder="op..."
                />
              </label>
              <label>
                opPAXG (assetId 3)
                <input
                  value={opnetWrappedAddresses.PAXG}
                  onChange={(e) =>
                    setOpnetWrappedAddresses((prev) => ({ ...prev, PAXG: e.target.value }))
                  }
                  placeholder="op..."
                />
              </label>
            </div>
            <div>
              <h2>Export Mapping JSON</h2>
              <pre className="status">{sepoliaToOpnetMapping}</pre>
              <div className="row">
                <button onClick={() => void copyValue('sepolia-opnet mapping json', sepoliaToOpnetMapping)}>
                  Copy Mapping JSON
                </button>
                <button
                  onClick={() =>
                    setOutput(
                      JSON.stringify(
                        {
                          action: 'ethereum/mapping/export',
                          mapping: JSON.parse(sepoliaToOpnetMapping),
                        },
                        null,
                        2,
                      ),
                    )
                  }
                >
                  Send Mapping To Output
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      <section className="panel">
        <h2>Output</h2>
        <pre className="output">{output}</pre>
      </section>
    </main>
  );
}
