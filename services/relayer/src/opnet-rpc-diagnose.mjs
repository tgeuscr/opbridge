import process from "node:process";
import { networks } from "@btc-vision/bitcoin";
import { createOpnetJsonRpcProvider, describeOpnetRpcTransport } from "./opnet-rpc-provider.mjs";

const DEFAULT_REGTEST_RPC_URL = "https://regtest.opnet.org";
const DEFAULT_TESTNET_RPC_URL = "https://testnet.opnet.org";

function normalizeNetworkName(name) {
  return String(name ?? "regtest").trim().toLowerCase();
}

function resolveNetwork(name) {
  const normalized = normalizeNetworkName(name);
  if (normalized === "regtest") return networks.regtest;
  if (normalized === "testnet") return networks.opnetTestnet;
  if (normalized === "mainnet") return networks.bitcoin;
  throw new Error(`Unsupported OPNET_NETWORK=${name}. Expected regtest, testnet, or mainnet.`);
}

function defaultRpcUrlForNetwork(name) {
  return normalizeNetworkName(name) === "testnet" ? DEFAULT_TESTNET_RPC_URL : DEFAULT_REGTEST_RPC_URL;
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`OP_NET RPC Connectivity Diagnostic

Optional env vars:
  OPNET_NETWORK (default: regtest; regtest|testnet|mainnet)
  OPNET_RPC_URL (default derived from OPNET_NETWORK)
  OPNET_RPC_TIMEOUT_MS (default: 10000)
  OPNET_DIAG_PUBLIC_KEY (optional address/pubkey to test getPublicKeyInfo)
  OPNET_RPC_PROXY_URL (optional explicit proxy URL)
  OPNET_RPC_PROXY_AUTH_TOKEN (optional explicit proxy auth header value)
  OPNET_RPC_USE_ENV_PROXY (default: true)
  OPNET_RPC_NO_PROXY (optional NO_PROXY override for OPNet calls)

Prints:
  - selected network/url
  - transport mode (direct / proxy)
  - getBlockNumber result
  - optional getPublicKeyInfo/getPublicKeysInfoRaw result summary
`);
    return;
  }

  const networkName = process.env.OPNET_NETWORK;
  const opnetNetwork = resolveNetwork(networkName);
  const rpcUrl = process.env.OPNET_RPC_URL?.trim() || defaultRpcUrlForNetwork(networkName);
  const timeout = Number(process.env.OPNET_RPC_TIMEOUT_MS?.trim() || "10000");
  if (!Number.isFinite(timeout) || timeout <= 0) {
    throw new Error("OPNET_RPC_TIMEOUT_MS must be a positive number.");
  }

  const provider = createOpnetJsonRpcProvider({ url: rpcUrl, network: opnetNetwork, timeout });
  console.log(`OP_NET RPC transport: ${describeOpnetRpcTransport()} -> ${rpcUrl}`);
  console.log(`OP_NET network: ${normalizeNetworkName(networkName)}`);

  const start = Date.now();
  const blockNumber = await provider.getBlockNumber();
  console.log(`getBlockNumber ok: ${blockNumber.toString()} (${Date.now() - start} ms)`);

  const probe = process.env.OPNET_DIAG_PUBLIC_KEY?.trim();
  if (probe) {
    if (typeof provider.getPublicKeysInfoRaw === "function") {
      const raw = await provider.getPublicKeysInfoRaw([probe]);
      const keys = raw && typeof raw === "object" ? Object.keys(raw) : [];
      console.log(`getPublicKeysInfoRaw ok: keys=${keys.length}`);
    } else if (typeof provider.getPublicKeyInfo === "function") {
      const info = await provider.getPublicKeyInfo(probe, false);
      const type = info && typeof info === "object" ? "object" : typeof info;
      console.log(`getPublicKeyInfo ok: type=${type}`);
    } else {
      console.log("public-key RPC probe skipped: provider does not expose getPublicKeyInfo methods");
    }
  }
}

main().catch((error) => {
  console.error(`[opnet-rpc-diagnose] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
