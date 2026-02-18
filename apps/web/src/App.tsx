import { useEffect, useMemo, useState } from 'react';
import { networks } from '@btc-vision/bitcoin';
import { SupportedWallets, useWalletConnect } from '@btc-vision/walletconnect';
import {
  Address,
  MLDSASecurityLevel,
  QuantumBIP32Factory,
  UnisatSigner,
} from '@btc-vision/transaction';
import { JSONRpcProvider, getContract } from 'opnet';
import { ASSET_CONFIGS, SUPPORTED_ASSETS } from '@heptad/shared';
import HeptadBridgeAbi from './abi/HeptadBridge.abi';
import BridgeWrappedTokenAbi from './abi/BridgeWrappedToken.abi';
import OP20ReadAbi from './abi/OP20Read.abi';
import devRelayKeys from './dev-relay-keys.json';

class OPWalletSigner extends UnisatSigner {
  public override get unisat() {
    const module = (window as Window & { opnet?: unknown }).opnet;
    if (!module) {
      throw new Error('OP_WALLET extension not found');
    }

    return module as any;
  }
}

type NetworkMode = 'regtest' | 'mainnet';

type BridgeState = {
  paused?: boolean;
  threshold?: number;
  relayCount?: number;
  owner?: string;
};

type BridgeAssetConfig = {
  assetId: number;
  symbol: string;
  decimals: number;
  token: string;
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

type HeptadBridgeContract = {
  paused: () => Promise<CallResult<{ paused: boolean }>>;
  relayThreshold: () => Promise<CallResult<{ requiredSignatures: number }>>;
  relayCount: () => Promise<CallResult<{ relayCount: number }>>;
  supportedAssetCount: () => Promise<CallResult<{ count: number }>>;
  supportedAssetAt: (
    index: number,
  ) => Promise<CallResult<{ assetId: number; token: string; decimals: number; symbol: Uint8Array }>>;
  owner: () => Promise<CallResult<{ owner: string }>>;
  wrappedToken: (asset: number) => Promise<CallResult<{ token: string }>>;
  computeMintAttestationHash: (
    asset: number,
    recipient: unknown,
    amount: bigint,
    depositId: bigint,
  ) => Promise<CallResult<{ messageHash: Uint8Array }>>;
  mintWithRelaySignatures: (
    asset: number,
    recipient: unknown,
    amount: bigint,
    depositId: bigint,
    relayIndexesPacked: Uint8Array,
    relaySignaturesPacked: Uint8Array,
  ) => Promise<CallResult>;
  requestBurn: (
    asset: number,
    from: unknown,
    amount: bigint,
    withdrawalId: bigint,
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

const RPC_URLS: Record<NetworkMode, string> = {
  regtest: 'https://regtest.opnet.org',
  mainnet: 'https://mainnet.opnet.org',
};

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

function short(value: string | null | undefined): string {
  if (!value) return '-';
  if (value.length < 14) return value;
  return `${value.slice(0, 8)}...${value.slice(-6)}`;
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
  const [withdrawalId, setWithdrawalId] = useState('1');
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
  const [removeAssetIdInput, setRemoveAssetIdInput] = useState('0');
  const [removeAssetIdsInput, setRemoveAssetIdsInput] = useState('[0]');
  const [relayPubKeyInput, setRelayPubKeyInput] = useState('');
  const [relayPubKeysPackedInput, setRelayPubKeysPackedInput] = useState('');
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

  const readNetwork = networkMode === 'mainnet' ? networks.bitcoin : networks.regtest;
  const bridgeInput = bridgeAddress.trim();
  const tokenInput = tokenContractAddress.trim();
  // Use user-provided op... addresses directly for contract calls.
  // Keep resolved hex for debug display and for address-typed calldata fields.
  const bridgeContractTarget = bridgeInput;
  const tokenContractTarget = tokenInput;
  const readProvider = useMemo(
    () => new JSONRpcProvider(RPC_URLS[networkMode], readNetwork),
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
    recipient: Address,
    rawAmount: bigint,
    parsedDepositId: bigint,
  ): Promise<Uint8Array> => {
    if (!bridgeInput) {
      throw new Error('Bridge contract address is required. Set Bridge Contract Address first.');
    }

    const bridgeHex = resolvedBridgeAddress ||
      (bridgeInput.startsWith('op') ? '' : parseHexAddress(bridgeInput, 'bridge address').toHex());
    if (!bridgeHex) {
      throw new Error('Bridge contract hex is unresolved. Wait for address resolution and try again.');
    }

    const bridgeBytes = hexToBytes(bridgeHex, 32);
    const recipientBytes = hexToBytes(recipient.toHex(), 32);

    const payload = concatBytes([
      new Uint8Array([ATTESTATION_VERSION]),
      new Uint8Array([DIRECTION_ETH_TO_OP_MINT]),
      bridgeBytes,
      new Uint8Array([resolveAssetId(targetAsset)]),
      recipientBytes,
      u256ToBytes(rawAmount),
      u256ToBytes(parsedDepositId),
    ]);

    return sha256Bytes(payload);
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
        HeptadBridgeAbi as any,
        readProvider,
        readNetwork
      ) as unknown as HeptadBridgeContract;
    } catch {
      return null;
    }
  }, [bridgeContractTarget, readProvider, readNetwork]);

  const writeBridge = useMemo(() => {
    if (!bridgeContractTarget || !walletProvider) return null;

    try {
      return getContract(
        bridgeContractTarget,
        HeptadBridgeAbi as any,
        walletProvider as any,
        readNetwork
      ) as unknown as HeptadBridgeContract;
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
        const resolved = await resolveAddressToHex(bridgeAddress, true, false);
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
        const resolved = await resolveAddressToHex(tokenContractAddress, true, false);
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
    fn: (contract: HeptadBridgeContract) => Promise<CallResult>,
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
      const assetCount = Number(supportedAssetCountCall.properties.count);
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
        relayCount: Number(relayCountCall.properties.relayCount),
        owner: String(ownerCall.properties.owner),
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

      setOutput(
        JSON.stringify(
          {
            action: 'refreshBridgeState',
            paused: pausedCall.properties.paused,
            threshold: threshold.properties.requiredSignatures,
            relayCount: relayCountCall.properties.relayCount,
            assetCount,
            assets: nextBridgeAssets,
            owner: ownerCall.properties.owner,
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
      setOutput(`${label} is not available. Connect OP_WALLET first.`);
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setOutput(`${label} copied to clipboard.`);
    } catch (error) {
      setOutput(`Failed to copy ${label}: ${(error as Error).message}`);
    }
  };

  const loadRelayDataFromJson = (): void => {
    try {
      const payload = devRelayKeys as {
        relayCount?: number;
        relayPubKeysPacked?: string;
        relayPrivateKeys?: string[];
      };

      const relayCount = payload.relayCount ?? payload.relayPrivateKeys?.length ?? DEFAULT_DEV_RELAY_KEY_SLOTS;
      if (relayCount < activeRelayCount) {
        throw new Error(
          `Relay JSON has relayCount=${relayCount}, but current bridge relay count is ${activeRelayCount}.`,
        );
      }

      const relayPubKeysPackedHex = (payload.relayPubKeysPacked ?? '').trim();
      const privateKeys = payload.relayPrivateKeys ?? [];

      if (privateKeys.length < activeRelayCount) {
        throw new Error(
          `Relay JSON has ${privateKeys.length} private keys, but current bridge relay count is ${activeRelayCount}.`,
        );
      }

      // Validate payload shape before mutating form state.
      const fullPacked = hexToBytes(relayPubKeysPackedHex, relayCount * 1312);
      for (const rawKey of privateKeys) {
        parseMldsaPrivateKey(rawKey);
      }

      const targetRelayCount = activeRelayCount > 0 ? activeRelayCount : DEFAULT_DEV_RELAY_KEY_SLOTS;
      const packedForCurrentRelayCount = fullPacked.slice(0, targetRelayCount * 1312);
      const keysForCurrentRelayCount = privateKeys.slice(0, targetRelayCount);
      setRelayPubKeysPackedInput(bytesToHex(packedForCurrentRelayCount));
      setRelayPrivateKeysInput(keysForCurrentRelayCount);
      setOutput(
        `Loaded relay JSON: ${keysForCurrentRelayCount.length} private keys and ${targetRelayCount} packed relay pubkeys for current bridge config.`,
      );
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

  return (
    <main className="page">
      <header className="hero">
        <p className="kicker">heptad / op_net bridge dev console</p>
        <h1>Simple OP_NET Bridge UI</h1>
        <p>
          ABI-based bridge interaction with simulation-first flow, OP_WALLET connection,
          and explicit debug output for fast iteration.
        </p>
      </header>

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
          <div className="row">
            <button onClick={() => setBridgeStateTab('summary')}>Summary</button>
            <button onClick={() => setBridgeStateTab('assets')}>Assets</button>
            <button onClick={() => setBridgeStateTab('relays')}>Relays</button>
          </div>
          {bridgeStateTab === 'summary' ? (
            <pre className="status">
{`rpc: ${RPC_URLS[networkMode]}
paused: ${bridgeState.paused ?? '-'}
relayThreshold: ${bridgeState.threshold ?? '-'}
relayCount: ${bridgeState.relayCount ?? '-'}
supportedAssetCount: ${bridgeAssets.length}
owner: ${bridgeState.owner ?? '-'}
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
packedRelayPubKeys (input): ${relayPreview.entries.length > 0 ? relayPreview.entries.length : 0} keys`}
              </pre>
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
              placeholder="op... (HeptadBridge contract)"
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
          <div className="row">
            <button onClick={refreshWrappedTokenBridgeAuthority}>Read bridgeAuthority</button>
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
              <option value="" disabled>
                {availableAssets.length === 0 ? 'Refresh bridge state to load assets' : 'Select asset'}
              </option>
              {availableAssets.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
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
          <div className="row">
            <button onClick={loadRelayDataFromJson}>Load Relay Data JSON</button>
          </div>
          <div className="row">
            <button
              onClick={() => {
                void (async () => {
                  try {
                    const recipient = await resolveRecipientAddress(dummyRecipientAddress);
                    if (!recipient) {
                      setOutput('Destination address missing. Set destination input or connect OP_WALLET.');
                      return;
                    }

                    const rawAmount = parseHumanAmount(dummyAmount, resolveAssetDecimals(dummyAsset));
                    const parsedDepositId = parseDepositId(dummyDepositId);
                    const hash = await buildMintAttestationHash(dummyAsset, recipient, rawAmount, parsedDepositId);
                    const hashHex = bytesToHex(hash);
                    setDummyAttestationHashInput(hashHex);
                    setDummyBuiltMessageHash(hashHex);
                    setOutput(
                      JSON.stringify(
                        {
                          action: 'dummy/attestation/build',
                          asset: dummyAsset,
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
                    const recipient = await resolveRecipientAddress(dummyRecipientAddress);
                    if (!recipient) {
                      setOutput('Destination address missing. Set destination input or connect OP_WALLET.');
                      return;
                    }

                    const rawAmount = parseHumanAmount(dummyAmount, resolveAssetDecimals(dummyAsset));
                    const parsedDepositId = parseDepositId(dummyDepositId);
                    const messageHash = dummyAttestationHashInput.trim()
                      ? hexToBytes(dummyAttestationHashInput.trim(), 32)
                      : await buildMintAttestationHash(dummyAsset, recipient, rawAmount, parsedDepositId);
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
            Asset
            <select value={mintAsset} onChange={(e) => setMintAsset(e.target.value as string)}>
              <option value="" disabled>
                {availableAssets.length === 0 ? 'Refresh bridge state to load assets' : 'Select asset'}
              </option>
              {availableAssets.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
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
            Destination Address (bc1... / op... / 0x...)
            <input
              value={mintRecipientAddress}
              onChange={(e) => setMintRecipientAddress(e.target.value)}
              placeholder="defaults to connected wallet"
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
                    const recipient = await resolveRecipientAddress(mintRecipientAddress);
                    if (!recipient) {
                      setOutput('Recipient address missing. Set recipient input or connect OP_WALLET.');
                      return;
                    }

                    const rawAmount = parseHumanAmount(mintAmount, resolveAssetDecimals(mintAsset));
                    const parsedDepositId = parseDepositId(mintDepositId);
                    const messageHash = mintAttestationHashInput.trim()
                      ? hexToBytes(mintAttestationHashInput.trim(), 32)
                      : await buildMintAttestationHash(mintAsset, recipient, rawAmount, parsedDepositId);
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
                          recipient,
                          rawAmount,
                          parsedDepositId,
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
                    const recipient = await resolveRecipientAddress(mintRecipientAddress);
                    if (!recipient) {
                      setOutput('Recipient address missing.');
                      return;
                    }

                    const rawAmount = parseHumanAmount(mintAmount, resolveAssetDecimals(mintAsset));
                    const parsedDepositId = parseDepositId(mintDepositId);
                    const messageHash = mintAttestationHashInput.trim()
                      ? hexToBytes(mintAttestationHashInput.trim(), 32)
                      : await buildMintAttestationHash(mintAsset, recipient, rawAmount, parsedDepositId);
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
                          recipient,
                          rawAmount,
                          parsedDepositId,
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
              <option value="" disabled>
                {availableAssets.length === 0 ? 'Refresh bridge state to load assets' : 'Select asset'}
              </option>
              {availableAssets.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
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
            Withdrawal ID (uint256)
            <input value={withdrawalId} onChange={(e) => setWithdrawalId(e.target.value)} />
          </label>
          <div className="row">
            <button
              onClick={() => {
                if (!opnetAddress) {
                  setOutput('Connect OP_WALLET first to provide sender address for burn request.');
                  return;
                }
                let rawAmount: bigint;
                try {
                  rawAmount = parseHumanAmount(amount, resolveAssetDecimals(asset));
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
                      rawAmount,
                      BigInt(withdrawalId || '0'),
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
                try {
                  rawAmount = parseHumanAmount(amount, resolveAssetDecimals(asset));
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
                      rawAmount,
                      BigInt(withdrawalId || '0'),
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
              <option value="" disabled>
                {availableAssets.length === 0 ? 'Refresh bridge state to load assets' : 'Select asset'}
              </option>
              {availableAssets.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
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
            <button onClick={loadRelayDataFromJson}>Load Relay Data JSON</button>
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

      <section className="panel">
        <h2>Output</h2>
        <pre className="output">{output}</pre>
      </section>
    </main>
  );
}
