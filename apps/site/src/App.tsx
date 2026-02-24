import { SupportedWallets, useWalletConnect } from '@btc-vision/walletconnect';
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
  } = useWalletConnect();

  const [ethAddress, setEthAddress] = useState('');
  const [ethChainId, setEthChainId] = useState('');
  const [ethStatus, setEthStatus] = useState('Not connected');
  const [statusApiUrl, setStatusApiUrl] = useState(DEFAULT_STATUS_API_URL);
  const [statusApiState, setStatusApiState] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [statusApiMessage, setStatusApiMessage] = useState('No status check yet.');
  const [statusApiUpdatedAt, setStatusApiUpdatedAt] = useState('');

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

  return (
    <main className="landing">
      <section className="hero card">
        <p className="eyebrow">Heptad Bridge Preview</p>
        <h1>Connect OP_WALLET + MetaMask</h1>
        <p className="lede">
          Test frontend for wallet onboarding before bridge UX goes live. This preview is intended for OPNet test
          environments and Ethereum Sepolia.
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

      <section className="card checklist">
        <h2>Next Steps</h2>
        <ol>
          <li>Deploy this app to Vercel as a preview project.</li>
          <li>Keep `apps/web` as the internal dev/ops bridge console.</li>
          <li>Add status API integration after relayers are running on AWS.</li>
          <li>Add deposit and burn flows after wallet-connect UX is stable.</li>
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
