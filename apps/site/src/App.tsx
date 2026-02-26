import { SupportedWallets, useWalletConnect } from '@btc-vision/walletconnect';
import { networks } from '@btc-vision/bitcoin';
import { Address } from '@btc-vision/transaction';
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
const VAULT_DEPOSIT_ERC20_SELECTOR = '0x47e7ef24';

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

function buildApproveCalldata(spender: string, amount: bigint): string {
  return `${ERC20_APPROVE_SELECTOR}${encodeAddressWord(spender)}${encodeUintWord(amount)}`;
}

function buildDepositErc20Calldata(assetId: number, amount: bigint, recipient: string): string {
  return `${VAULT_DEPOSIT_ERC20_SELECTOR}${encodeUintWord(assetId)}${encodeUintWord(amount)}${encodeBytes32Word(recipient)}`;
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
  const [depositAsset, setDepositAsset] = useState('USDT');
  const [depositAmount, setDepositAmount] = useState('');
  const [burnAsset, setBurnAsset] = useState('USDT');
  const [burnAmount, setBurnAmount] = useState('');
  const [depositBusy, setDepositBusy] = useState(false);
  const [depositStatus, setDepositStatus] = useState('No deposit started yet.');
  const [burnWithdrawalId, setBurnWithdrawalId] = useState('0');
  const [burnBusy, setBurnBusy] = useState(false);
  const [burnStatus, setBurnStatus] = useState('No burn started yet.');

  useEffect(() => {
    if (!statusApiUrl) {
      setStatusApiState('idle');
      setStatusApiMessage('Set VITE_STATUS_API_URL (or type one below) to enable polling.');
      setStatusApiUpdatedAt('');
      return;
    }

    let cancelled = false;

    const poll = async () => {
      try {
        setStatusApiState((prev) => (prev === 'ok' ? prev : 'loading'));
        const response = await fetch(`${statusApiUrl.replace(/\/$/, '')}/health`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const body = (await response.json()) as Record<string, unknown>;
        if (cancelled) return;
        setStatusApiState('ok');
        setStatusApiMessage(
          typeof body.status === 'string'
            ? `Status API healthy (${body.status})`
            : 'Status API reachable (/health responded)',
        );
        setStatusApiUpdatedAt(new Date().toISOString());
      } catch (error) {
        if (cancelled) return;
        setStatusApiState('error');
        setStatusApiMessage(`Status API check failed: ${error instanceof Error ? error.message : String(error)}`);
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
  const burnConfigReady = Boolean(OPNET_BRIDGE_ADDRESS && opnetProvider && opnetSigner && opnetAddressObject && walletAddress);

  async function waitForEthereumReceipt(provider: EthereumProvider, txHash: string, label: string) {
    for (let attempt = 0; attempt < 90; attempt += 1) {
      const receipt = (await provider.request({
        method: 'eth_getTransactionReceipt',
        params: [txHash],
      })) as { status?: string; blockNumber?: string; transactionHash?: string } | null;
      if (receipt) return receipt;
      await new Promise((resolve) => window.setTimeout(resolve, 2000));
      if (attempt === 9) {
        setDepositStatus(`${label} pending... waiting for confirmation`);
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

      const approveReceipt = await waitForEthereumReceipt(provider, approveTxHash, 'Approve');
      if (approveReceipt.status !== '0x1') {
        throw new Error(`Approve transaction failed: ${approveTxHash}`);
      }

      setDepositStatus(`Approve confirmed (${approveTxHash}). Submitting vault deposit...`);
      const depositData = buildDepositErc20Calldata(assetId, amountRaw, recipient);
      const depositTxHash = (await provider.request({
        method: 'eth_sendTransaction',
        params: [{ from: account, to: vaultAddress, data: depositData }],
      })) as string;

      const depositReceipt = await waitForEthereumReceipt(provider, depositTxHash, 'Deposit');
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
    if (!opnetProvider || !opnetSigner || !opnetAddressObject || !walletAddress) {
      setBurnStatus('Connect OP_WALLET first (provider/signer unavailable).');
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

      const bridge = getContract(OPNET_BRIDGE_ADDRESS, BRIDGE_BURN_ABI as never, opnetProvider as never, networks.opnetTestnet);
      if (typeof (bridge as any).setSender === 'function') {
        (bridge as any).setSender(opnetAddressObject);
      }

      setBurnStatus('Simulating burn request on OPNet...');
      const simulation = await (bridge as any).requestBurn(
        assetId,
        opnetAddressObject,
        ethereumRecipient,
        amountRaw,
        withdrawalId,
      );

      if (simulation?.revert) {
        throw new Error(`Burn simulation revert: ${simulation.revert}`);
      }

      setBurnStatus('Simulation OK. Sending burn request transaction...');
      const tx = await simulation.sendTransaction({
        signer: opnetSigner,
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
          <p className={`notice ${depositReady ? 'ok' : ''}`}>
            {depositReady
              ? depositConfigReady
                ? 'Deposit flow is enabled and uses the connected OP_WALLET hashed MLDSA key as the vault recipient.'
                : 'Wallets are ready, but vault/token addresses are missing. Set Vercel env vars to enable deposits.'
              : 'Connect OP_WALLET + MetaMask on Sepolia to enable the deposit flow.'}
          </p>
          <p className="muted">
            Config: vault <code>{short(ETH_VAULT_ADDRESS)}</code> | token <code>{short(ETH_TOKEN_ADDRESSES[depositAsset as AssetSymbol])}</code>
          </p>
          <pre className="log-box">{depositStatus}</pre>
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
          <p className={`notice ${burnReady ? 'ok' : ''}`}>
            {burnReady
              ? burnConfigReady
                ? 'Burn flow is enabled and locks the Ethereum recipient to the connected MetaMask address.'
                : 'Wallets are ready, but OPNet bridge/signer config is missing. Set Vercel env vars and connect OP_WALLET.'
              : 'Connect both wallets and switch MetaMask to Sepolia to enable the withdrawal flow.'}
          </p>
          <p className="muted">
            Config: bridge <code>{short(OPNET_BRIDGE_ADDRESS)}</code> | OPNet wallet network <code>{network?.network ?? '-'}</code>
          </p>
          <pre className="log-box">{burnStatus}</pre>
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
          <h2>Status API (Stub)</h2>
          <span className={`pill ${statusApiState === 'ok' ? 'ok' : ''}`}>{statusApiState}</span>
        </div>
        <p className="muted">
          This is a placeholder for the future relayer status backend. It polls <code>/health</code> every 15s.
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
            <h3>Health Check</h3>
            <p>{statusApiMessage}</p>
            <p className="muted">Last checked: {statusApiUpdatedAt || '-'}</p>
          </div>
          <div>
            <h3>Planned Endpoints</h3>
            <ul>
              <li><code>GET /health</code></li>
              <li><code>GET /bridge/status</code></li>
              <li><code>GET /releases/pending</code></li>
              <li><code>GET /releases/by-withdrawal/:id</code></li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
