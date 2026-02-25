import process from "node:process";
import { JSONRpcProvider } from "opnet";
import { networks } from "@btc-vision/bitcoin";

const DEFAULT_URL = "https://testnet.opnet.org";

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`OPNet SDK Testnet Smoke Test (template-style)

Uses plain opnet JSONRpcProvider + networks.opnetTestnet and calls getBlockNumber().

Optional env vars:
  OPNET_RPC_URL (default: ${DEFAULT_URL})
  OPNET_RPC_TIMEOUT_MS (default: 10000)
`);
    return;
  }

  const url = process.env.OPNET_RPC_URL?.trim() || DEFAULT_URL;
  const timeout = Number(process.env.OPNET_RPC_TIMEOUT_MS?.trim() || "10000");
  if (!Number.isFinite(timeout) || timeout <= 0) {
    throw new Error("OPNET_RPC_TIMEOUT_MS must be a positive number.");
  }

  const provider = new JSONRpcProvider({
    url,
    network: networks.opnetTestnet,
    timeout,
  });

  try {
    console.log(`provider.url=${url}`);
    console.log("provider.network=opnetTestnet");
    const startedAt = Date.now();
    const blockNumber = await provider.getBlockNumber();
    console.log(`getBlockNumber ok: ${blockNumber.toString()} (${Date.now() - startedAt} ms)`);
  } finally {
    provider.close?.();
  }
}

main().catch((error) => {
  console.error(`[opnet-sdk-testnet-smoke] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
