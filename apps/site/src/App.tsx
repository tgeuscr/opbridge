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
const OPNET_FEE_RATE = Number(import.meta.env.VITE_OPNET_FEE_RATE?.trim() || '2');
const OPNET_MAX_SAT_SPEND = BigInt(import.meta.env.VITE_OPNET_MAX_SAT_SPEND?.trim() || '20000');
const ERC20_APPROVE_SELECTOR = '0x095ea7b3';
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

type AssetSymbol = keyof typeof ETH_ASSET_CONFIG;

const BRIDGE_BURN_ABI = [
  {
    name: 'requestBurn',
    inputs: [
      { name: 'asset', type: ABIDataTypes.UINT8 },
      { name: 'from', type: ABIDataTypes.ADDRESS },
      { name: 'ethereumRecipient', type: ABIDataTypes.ADDRESS },
      { name: 'amount', type: ABIDataTypes.UINT256 },
      { name: 'withdrawalId', type: ABIDataTypes.UINT256 },
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
      { name: 'ethereumUser', type: ABIDataTypes.ADDRESS },
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

function parseEthereumUserForMint(raw: string): Address {
  const bytes = hexToBytes(raw, 'mintSubmission.ethereumUser');
  if (bytes.length !== 20 && bytes.length !== 32) {
    throw new Error(`mintSubmission.ethereumUser must be 20 or 32 bytes; got ${bytes.length}.`);
  }
  const hex = bytes.length === 20 ? `0x${padHexToBytes(raw.replace(/^0x/, ''), 32)}` : normalizeBytes32Hex(raw, 'mintSubmission.ethereumUser');
  return Address.fromBigInt(BigInt(hex));
}

function normalizeHex(raw: string): string {
  const value = raw.trim();
  if (!value) return '';
  return value.startsWith('0x') ? value.toLowerCase() : `0x${value.toLowerCase()}`;
}

function parseRecipientForMint(
  rawRecipient: string,
  connectedAddress: Address | null,
): Address {
  const recipientHex = normalizeHex(rawRecipient);
  if (!connectedAddress) throw new Error('Connected OP_WALLET address is unavailable.');
  const connectedHex = normalizeHex(typeof (connectedAddress as { toHex?: () => string }).toHex === 'function' ? connectedAddress.toHex() : '');
  if (!connectedHex) throw new Error('Connected OP_WALLET address could not be serialized.');
  if (connectedHex !== recipientHex) {
    throw new Error(`Recipient mismatch: candidate=${recipientHex} connectedWallet=${connectedHex}`);
  }
  return connectedAddress;
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
  const [depositAsset, setDepositAsset] = useState('USDT');
  const [depositAmount, setDepositAmount] = useState('');
  const [burnAsset, setBurnAsset] = useState('USDT');
  const [burnAmount, setBurnAmount] = useState('');
  const [depositBusy, setDepositBusy] = useState(false);
  const [depositStatus, setDepositStatus] = useState('No deposit started yet.');
  const [claimDepositId, setClaimDepositId] = useState('');
  const [claimMintBusy, setClaimMintBusy] = useState(false);
  const [claimMintStatus, setClaimMintStatus] = useState('No mint claim started yet.');
  const [burnWithdrawalId, setBurnWithdrawalId] = useState('0');
  const [burnBusy, setBurnBusy] = useState(false);
  const [burnStatus, setBurnStatus] = useState('No burn started yet.');
  const [claimWithdrawalId, setClaimWithdrawalId] = useState('');
  const [claimReleaseBusy, setClaimReleaseBusy] = useState(false);
  const [claimReleaseStatus, setClaimReleaseStatus] = useState('No withdrawal claim started yet.');
  const [fallbackSigner, setFallbackSigner] = useState<UnisatSigner | null>(null);
  const [fallbackSignerError, setFallbackSignerError] = useState<string | null>(null);

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
      const chainId = (await provider.request({ method: 'eth_chainId' })) as string;
      setEthAddress(address ?? '');
      setEthChainId(chainId ?? '');
      setEthStatus('Connected');
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

  async function switchToSepolia() {
    const provider = getEthereumProvider();
    if (!provider) return;
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
      });
      const chainId = (await provider.request({ method: 'eth_chainId' })) as string;
      setEthChainId(chainId);
    } catch (error) {
      setEthStatus(`Switch failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const opConnected = Boolean(walletAddress);
  const ethConnected = Boolean(ethAddress);
  const onSepolia = ethChainId.toLowerCase() === SEPOLIA_CHAIN_ID_HEX;
  const opRecipientHash = hashedMLDSAKey || '';
  const walletPairReady = opConnected && ethConnected;
  const depositReady = walletPairReady && onSepolia && Boolean(opRecipientHash);
  const burnReady = walletPairReady && onSepolia;
  const depositConfigReady = Boolean(ETH_VAULT_ADDRESS && ETH_TOKEN_ADDRESSES[depositAsset as AssetSymbol]);
  const burnConfigReady = Boolean(OPNET_BRIDGE_ADDRESS && opnetProvider && opnetAddressObject && walletAddress);
  const claimMintReady = Boolean(opConnected && statusApiUrl.trim() && burnConfigReady && opRecipientHash);
  const claimMintBlockers = [
    !opConnected ? 'OP_WALLET not connected' : '',
    !statusApiUrl.trim() ? 'Status API URL is empty' : '',
    !OPNET_BRIDGE_ADDRESS ? 'OPNet bridge address is missing (VITE_OPNET_BRIDGE_ADDRESS)' : '',
    !opnetProvider ? 'OPNet provider unavailable' : '',
    !opnetAddressObject ? 'OPNet sender address unavailable' : '',
    !walletAddress ? 'OP_WALLET address unavailable' : '',
    !opRecipientHash ? 'Hashed MLDSA key unavailable' : '',
  ].filter(Boolean);
  const claimReleaseReady = Boolean(walletPairReady && onSepolia && statusApiUrl.trim() && ETH_VAULT_ADDRESS && opRecipientHash);

  const resolveConnectedSender = async (): Promise<Address | null> => {
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

    if (opnetProvider && typeof (opnetProvider as { getPublicKeyInfo?: unknown }).getPublicKeyInfo === 'function') {
      try {
        return await (opnetProvider as { getPublicKeyInfo: (address: string, trusted: boolean) => Promise<Address> }).getPublicKeyInfo(raw, false);
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
      const approveTxHash = (await provider.request({
        method: 'eth_sendTransaction',
        params: [{ from: account, to: tokenAddress, data: approveData }],
      })) as string;

      const approveReceipt = await waitForEthereumReceipt(provider, approveTxHash, 'Approve', setDepositStatus);
      if (approveReceipt.status !== '0x1') {
        throw new Error(`Approve transaction failed: ${approveTxHash}`);
      }

      setDepositStatus(`Approve confirmed (${approveTxHash}). Submitting vault deposit...`);
      const depositData = buildDepositErc20Calldata(assetId, amountRaw, recipient);
      const depositTxHash = (await provider.request({
        method: 'eth_sendTransaction',
        params: [{ from: account, to: vaultAddress, data: depositData }],
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
      if (!/^\d+$/.test(burnWithdrawalId.trim())) {
        throw new Error('Withdrawal ID must be a non-negative integer.');
      }
      const withdrawalId = BigInt(burnWithdrawalId.trim());
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
        withdrawalId,
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
        `Burn request sent. asset=${asset} amount=${burnAmount} withdrawalId=${withdrawalId.toString()} tx=${short((tx as { transactionId?: string })?.transactionId || null)}`,
      );
    } catch (error) {
      setBurnStatus(`Burn failed: ${formatEthereumError(error)}`);
    } finally {
      setBurnBusy(false);
    }
  }

  async function runClaimMintFlow() {
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
    try {
      setClaimMintBusy(true);
      setClaimMintStatus('Fetching ready mint candidates from Relayer API...');
      const base = statusApiUrl.replace(/\/$/, '');
      const recipientHash = normalizeBytes32Hex(opRecipientHash, 'Connected OP_WALLET hashed MLDSA key');
      const wantedDepositId = claimDepositId.trim();
      let selected:
        | {
            depositId?: string;
            ready?: boolean;
            mintSubmission?: {
              assetId?: number | string;
              ethereumUser?: string;
              recipient?: string;
              amount?: string;
              nonce?: string;
              attestationVersion?: number | string;
              relayIndexesPackedHex?: string;
              relaySignaturesPackedHex?: string;
            };
          }
        | undefined;

      if (wantedDepositId) {
        const response = await fetch(`${base}/deposits/${encodeURIComponent(wantedDepositId)}`);
        const body = (await response.json()) as {
          ok?: boolean;
          mintCandidate?: {
            depositId?: string;
            ready?: boolean;
            mintSubmission?: {
              assetId?: number | string;
              ethereumUser?: string;
              recipient?: string;
              amount?: string;
              nonce?: string;
              attestationVersion?: number | string;
              relayIndexesPackedHex?: string;
              relaySignaturesPackedHex?: string;
            };
          };
        };
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
        const query = new URLSearchParams({
          recipientHash: recipientHash.toLowerCase(),
          ready: 'true',
          limit: '20',
        });
        if (ethAddress.trim()) {
          query.set('ethereumUser', ethAddress.toLowerCase());
        }
        const response = await fetch(`${base}/mint-candidates?${query.toString()}`);
        const body = (await response.json()) as {
          ok?: boolean;
          items?: Array<{
            depositId?: string;
            mintSubmission?: {
              assetId?: number | string;
              ethereumUser?: string;
              recipient?: string;
              amount?: string;
              nonce?: string;
              attestationVersion?: number | string;
              relayIndexesPackedHex?: string;
              relaySignaturesPackedHex?: string;
            };
          }>;
        };
        if (!response.ok) {
          throw new Error(`mint-candidates HTTP ${response.status}`);
        }
        const items = Array.isArray(body.items) ? body.items : [];
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

      const ethereumUser = parseEthereumUserForMint(String(mint.ethereumUser ?? ''));
      const sender = await resolveConnectedSender();
      if (!sender) throw new Error('Connected OP_WALLET sender address is unavailable.');
      const recipient = parseRecipientForMint(String(mint.recipient ?? ''), sender);
      const bridge = getContract(OPNET_BRIDGE_ADDRESS, BRIDGE_MINT_ABI as never, opnetProvider as never, networks.opnetTestnet);
      if (typeof (bridge as { setSender?: (sender: Address) => void }).setSender === 'function') {
        (bridge as { setSender: (sender: Address) => void }).setSender(sender);
      }

      setClaimMintStatus(`Simulating mint for depositId=${depositId.toString()}...`);
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
    } catch (error) {
      setClaimMintStatus(`Mint claim failed: ${formatEthereumError(error)}`);
    } finally {
      setClaimMintBusy(false);
    }
  }

  async function runClaimReleaseFlow() {
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

      const base = statusApiUrl.replace(/\/$/, '');
      const recipient = normalizeEthereumAddress(account, 'Connected MetaMask address');
      const opnetUser = normalizeBytes32Hex(opRecipientHash, 'Connected OP_WALLET hashed MLDSA key');
      const query = new URLSearchParams({
        recipient: recipient.toLowerCase(),
        opnetUser: opnetUser.toLowerCase(),
        ready: 'true',
        limit: '20',
      });

      setClaimReleaseStatus('Fetching ready release candidates from Relayer API...');
      const response = await fetch(`${base}/release-candidates?${query.toString()}`);
      const body = (await response.json()) as {
        items?: Array<{
          withdrawalId?: string;
          releaseSubmission?: {
            assetId?: number | string;
            opnetUser?: string;
            recipient?: string;
            amount?: string;
            withdrawalId?: string;
            attestationVersion?: number | string;
            relayIndexesPackedHex?: string;
            relaySignaturesPackedHex?: string;
          };
        }>;
      };
      if (!response.ok) {
        throw new Error(`release-candidates HTTP ${response.status}`);
      }
      const items = Array.isArray(body.items) ? body.items : [];
      if (items.length === 0) {
        setClaimReleaseStatus('No ready release candidate yet for this wallet pair. Wait for relayer aggregation and retry.');
        return;
      }

      const wantedWithdrawalId = claimWithdrawalId.trim();
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
      const txHash = (await provider.request({
        method: 'eth_sendTransaction',
        params: [{ from: account, to: vaultAddress, data: calldata }],
      })) as string;

      const receipt = await waitForEthereumReceipt(provider, txHash, 'Release', setClaimReleaseStatus);
      if (receipt.status !== '0x1') {
        throw new Error(`Release transaction failed: ${txHash}`);
      }
      setWithdrawalLookupId(withdrawalId.toString());
      setClaimReleaseStatus(`Withdrawal released. withdrawalId=${withdrawalId.toString()} tx=${short(txHash)}`);
    } catch (error) {
      setClaimReleaseStatus(`Withdrawal claim failed: ${formatEthereumError(error)}`);
    } finally {
      setClaimReleaseBusy(false);
    }
  }

  return (
    <main className="landing">
      <section className="hero card">
        <p className="eyebrow">Heptad Bridge Preview</p>
        <h1>Connect OP_WALLET + MetaMask</h1>
        <p className="lede">
          Beta bridge flow with strict recipient locking: deposits always go from your connected MetaMask address to
          your connected OP_WALLET, and burns return only to your connected MetaMask address.
        </p>
        <div className="banner" role="status">
          Testnet Only: Use Sepolia and non-production wallets/funds.
        </div>
      </section>

      <section className="grid">
        <article className="card wallet">
          <div className="card-head">
            <h2>OP_WALLET</h2>
            <span className={opConnected ? 'pill ok' : 'pill'}>{opConnected ? 'Connected' : 'Not Connected'}</span>
          </div>

          <p className="muted">
            Connect your OP wallet extension to prepare for OPNet deposit/burn actions in the bridge UI.
          </p>

          <div className="actions">
            <button className="primary" onClick={connectOpWallet} disabled={connecting}>
              {connecting ? 'Connecting…' : 'Connect OP_WALLET'}
            </button>
            <button onClick={disconnect}>Disconnect OP</button>
          </div>

          <dl className="kv">
            <div>
              <dt>Wallet Address</dt>
              <dd>{walletAddress ?? '-'}</dd>
            </div>
            <div>
              <dt>Wallet Type</dt>
              <dd>{walletType ?? '-'}</dd>
            </div>
            <div>
              <dt>Network</dt>
              <dd>{network?.network ?? '-'}</dd>
            </div>
            <div>
              <dt>Public Key</dt>
              <dd>{short(publicKey)}</dd>
            </div>
            <div>
              <dt>Hashed MLDSA Key</dt>
              <dd>{short(hashedMLDSAKey)}</dd>
            </div>
          </dl>
        </article>

        <article className="card wallet">
          <div className="card-head">
            <h2>MetaMask (Ethereum)</h2>
            <span className={ethConnected ? 'pill ok' : 'pill'}>{ethConnected ? 'Connected' : 'Not Connected'}</span>
          </div>

          <p className="muted">
            Connect MetaMask on Sepolia. This will be used for Ethereum-side deposits and release receipts.
          </p>

          <div className="actions">
            <button className="primary" onClick={connectMetaMask}>
              Connect MetaMask
            </button>
            <button onClick={disconnectMetaMask} disabled={!ethConnected}>
              Disconnect MetaMask
            </button>
            <button onClick={() => switchToSepolia()} disabled={!ethConnected || onSepolia}>
              {onSepolia ? 'On Sepolia' : 'Switch To Sepolia'}
            </button>
          </div>

          <dl className="kv">
            <div>
              <dt>Address</dt>
              <dd>{ethAddress || '-'}</dd>
            </div>
            <div>
              <dt>Chain</dt>
              <dd>
                {ethChainId || '-'}{' '}
                {ethChainId
                  ? onSepolia
                    ? `(Sepolia ${SEPOLIA_CHAIN_ID_DEC})`
                    : '(Wrong network)'
                  : ''}
              </dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{ethStatus}</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="card flow-policy">
        <div className="card-head">
          <h2>Bridge Policy (MVP)</h2>
          <span className={`pill ${walletPairReady ? 'ok' : ''}`}>{walletPairReady ? 'Wallet Pair Ready' : 'Connect Both Wallets'}</span>
        </div>
        <p className="muted">
          Custom recipients are disabled for now. This reduces recipient mismatches and uses the connected OP_WALLET
          identity directly for OPNet-side actions.
        </p>
        <div className="mini-grid">
          <div>
            <h3>Ethereum → OPNet</h3>
            <p><strong>From:</strong> connected MetaMask address</p>
            <p><strong>To:</strong> connected OP_WALLET hashed MLDSA key (locked)</p>
          </div>
          <div>
            <h3>OPNet → Ethereum</h3>
            <p><strong>From:</strong> connected OP_WALLET address</p>
            <p><strong>To:</strong> connected MetaMask address (locked)</p>
          </div>
        </div>
      </section>

      <section className="flow-grid">
        <article className="card flow-card">
          <div className="card-head">
            <h2>Deposit (Sepolia → OPNet)</h2>
            <span className={`pill ${depositReady ? 'ok' : ''}`}>{depositReady ? 'Ready' : 'Blocked'}</span>
          </div>
          <p className="muted">
            Recipient is locked to the connected OP_WALLET. The Ethereum vault deposit will carry the hashed MLDSA key.
          </p>
          <label className="field">
            <span>Asset</span>
            <select value={depositAsset} onChange={(e) => setDepositAsset(e.target.value)}>
              <option>USDT</option>
              <option>WBTC</option>
              <option>WETH</option>
              <option>PAXG</option>
            </select>
          </label>
          <label className="field">
            <span>Amount</span>
            <input
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="0.0"
              inputMode="decimal"
            />
          </label>
          <div className="route-box">
            <div>
              <h3>From MetaMask (locked)</h3>
              <p>{ethAddress || '-'}</p>
            </div>
            <div>
              <h3>To OP_WALLET Address (locked)</h3>
              <p>{walletAddress || '-'}</p>
            </div>
            <div>
              <h3>To Hashed MLDSA Key (vault recipient bytes32)</h3>
              <p>{opRecipientHash || '-'}</p>
            </div>
          </div>
          <div className="actions">
            <button
              className="primary"
              onClick={runLockedDepositFlow}
              disabled={!depositReady || !depositConfigReady || depositBusy}
            >
              {depositBusy ? 'Submitting Deposit…' : 'Approve + Deposit (Locked Recipient)'}
            </button>
          </div>
          <label className="field">
            <span>Claim Deposit ID (optional)</span>
            <input
              value={claimDepositId}
              onChange={(e) => setClaimDepositId(e.target.value)}
              placeholder="Leave blank for latest ready candidate"
              inputMode="numeric"
            />
          </label>
          <div className="actions">
            <button
              onClick={runClaimMintFlow}
              disabled={claimMintBusy}
            >
              {claimMintBusy ? 'Submitting Mint…' : 'Claim Mint On OPNet'}
            </button>
          </div>
          <p className={`notice ${depositReady ? 'ok' : ''}`}>
            {depositReady
              ? depositConfigReady
                ? 'Deposit flow is enabled and uses the connected OP_WALLET hashed MLDSA key as the vault recipient.'
                : 'Wallets are ready, but vault/token addresses are missing. Set Vercel env vars to enable deposits.'
              : 'Connect OP_WALLET + MetaMask on Sepolia to enable the deposit flow.'}
          </p>
          <p className={`notice ${claimMintReady ? 'ok' : ''}`}>
            {claimMintReady
              ? 'Mint claim is enabled. It fetches your ready candidate from Relayer API and submits OPNet mint via OP_WALLET.'
              : `Mint claim blocked: ${claimMintBlockers.join('; ') || 'unknown blocker'}.`}
          </p>
          <p className="muted">
            Config: vault <code>{short(ETH_VAULT_ADDRESS)}</code> | token <code>{short(ETH_TOKEN_ADDRESSES[depositAsset as AssetSymbol])}</code>
          </p>
          <pre className="log-box">{depositStatus}</pre>
          <pre className="log-box">{claimMintStatus}</pre>
        </article>

        <article className="card flow-card">
          <div className="card-head">
            <h2>Withdraw (OPNet → Sepolia)</h2>
            <span className={`pill ${burnReady ? 'ok' : ''}`}>{burnReady ? 'Ready' : 'Blocked'}</span>
          </div>
          <p className="muted">
            Burn requests will return funds only to the connected MetaMask address during beta.
          </p>
          <label className="field">
            <span>Asset</span>
            <select value={burnAsset} onChange={(e) => setBurnAsset(e.target.value)}>
              <option>USDT</option>
              <option>WBTC</option>
              <option>WETH</option>
              <option>PAXG</option>
            </select>
          </label>
          <label className="field">
            <span>Amount</span>
            <input
              value={burnAmount}
              onChange={(e) => setBurnAmount(e.target.value)}
              placeholder="0.0"
              inputMode="decimal"
            />
          </label>
          <label className="field">
            <span>Withdrawal ID (uint256)</span>
            <input
              value={burnWithdrawalId}
              onChange={(e) => setBurnWithdrawalId(e.target.value)}
              placeholder="0"
              inputMode="numeric"
            />
          </label>
          <div className="route-box">
            <div>
              <h3>From OP_WALLET (locked)</h3>
              <p>{walletAddress || '-'}</p>
            </div>
            <div>
              <h3>To MetaMask (locked)</h3>
              <p>{ethAddress || '-'}</p>
            </div>
          </div>
          <div className="actions">
            <button
              className="primary"
              onClick={runLockedBurnFlow}
              disabled={!burnReady || !burnConfigReady || burnBusy}
            >
              {burnBusy ? 'Submitting Burn…' : 'Request Burn (Locked Recipient)'}
            </button>
          </div>
          <label className="field">
            <span>Claim Withdrawal ID (optional)</span>
            <input
              value={claimWithdrawalId}
              onChange={(e) => setClaimWithdrawalId(e.target.value)}
              placeholder="Leave blank for latest ready candidate"
              inputMode="numeric"
            />
          </label>
          <div className="actions">
            <button
              onClick={runClaimReleaseFlow}
              disabled={!claimReleaseReady || claimReleaseBusy}
            >
              {claimReleaseBusy ? 'Submitting Release…' : 'Claim Withdraw On Sepolia'}
            </button>
          </div>
          <p className={`notice ${burnReady ? 'ok' : ''}`}>
            {burnReady
              ? burnConfigReady
                ? 'Burn flow is enabled and locks the Ethereum recipient to the connected MetaMask address.'
                : 'Wallets are ready, but OPNet bridge/signer config is missing. Set Vercel env vars and connect OP_WALLET.'
              : 'Connect both wallets and switch MetaMask to Sepolia to enable the withdrawal flow.'}
          </p>
          <p className={`notice ${claimReleaseReady ? 'ok' : ''}`}>
            {claimReleaseReady
              ? 'Withdrawal claim is enabled. It fetches your ready release candidate and submits Sepolia release via MetaMask.'
              : 'Connect both wallets, use Sepolia, and set Status API URL to enable in-site withdrawal claim.'}
          </p>
          <p className="muted">
            Config: bridge <code>{short(OPNET_BRIDGE_ADDRESS)}</code> | OPNet wallet network <code>{network?.network ?? '-'}</code>
          </p>
          <pre className="log-box">{burnStatus}</pre>
          <pre className="log-box">{claimReleaseStatus}</pre>
        </article>
      </section>

      <section className="card checklist">
        <h2>Next Steps</h2>
        <ol>
          <li>Keep `apps/web` as the internal dev/ops bridge console.</li>
          <li>Wire deposit button to the existing Ethereum vault deposit flow using the connected OP_WALLET hashed MLDSA key.</li>
          <li>Wire burn button to OPNet burn request flow using the connected MetaMask address as the locked return address.</li>
          <li>Keep custom recipients disabled until the recipient-resolution path is fully hardened.</li>
        </ol>
      </section>

      <section className="card status-panel">
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
    </main>
  );
}
