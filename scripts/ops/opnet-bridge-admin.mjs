import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { networks } from "@btc-vision/bitcoin";
import { Mnemonic, Wallet } from "@btc-vision/transaction";
import { ABIDataTypes, BitcoinAbiTypes, getContract } from "opnet";
import { createOpnetJsonRpcProvider, describeOpnetRpcTransport } from "../../services/relayer/src/opnet-rpc-provider.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const DEFAULT_PUBLIC_CONFIG = path.join(REPO_ROOT, "services/relayer/.data/relay-public-config.json");

const BRIDGE_ADMIN_ABI = [
  {
    name: "setRelaysConfigPacked",
    inputs: [
      { name: "relayPubKeysPacked", type: ABIDataTypes.BYTES },
      { name: "newThreshold", type: ABIDataTypes.UINT8 },
    ],
    outputs: [],
    type: BitcoinAbiTypes.Function,
  },
];

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) throw new Error(`Missing required env var: ${name}`);
  return value.trim();
}

function normalizeNetworkName(raw) {
  return String(raw || "testnet").trim().toLowerCase();
}

function resolveNetwork(raw) {
  const name = normalizeNetworkName(raw);
  if (name === "testnet") return networks.opnetTestnet;
  if (name === "regtest") return networks.regtest;
  if (name === "mainnet") return networks.bitcoin;
  throw new Error(`Unsupported OPNET_NETWORK=${raw}`);
}

function defaultRpcUrl(name) {
  return normalizeNetworkName(name) === "testnet" ? "https://testnet.opnet.org" : "https://regtest.opnet.org";
}

function parseHexBytes(raw, label) {
  const v = String(raw || "").trim();
  const hex = v.startsWith("0x") ? v.slice(2) : v;
  if (!/^[0-9a-fA-F]*$/.test(hex) || hex.length % 2 !== 0) {
    throw new Error(`${label} must be even-length hex`);
  }
  return Uint8Array.from(Buffer.from(hex, "hex"));
}

function parseBool(raw, dflt = false) {
  if (raw == null || raw === "") return dflt;
  const v = String(raw).trim().toLowerCase();
  if (["1", "true", "yes", "y"].includes(v)) return true;
  if (["0", "false", "no", "n"].includes(v)) return false;
  throw new Error(`Invalid boolean value: ${raw}`);
}

function buildWalletFromEnv(opnetNetwork) {
  const mnemonicPhrase = process.env.MNEMONIC?.trim() || process.env.OPNET_WALLET_MNEMONIC?.trim();
  if (mnemonicPhrase) {
    const passphrase = process.env.MNEMONIC_PASSPHRASE?.trim() || process.env.OPNET_WALLET_MNEMONIC_PASSPHRASE?.trim() || "";
    const index = Number(process.env.OPNET_WALLET_INDEX?.trim() || "0");
    const account = Number(process.env.OPNET_WALLET_ACCOUNT?.trim() || "0");
    const isChange = parseBool(process.env.OPNET_WALLET_IS_CHANGE, false);
    const mnemonic = new Mnemonic(mnemonicPhrase, passphrase, opnetNetwork);
    return mnemonic.deriveOPWallet(undefined, index, account, isChange);
  }
  return Wallet.fromPrivateKeys(requireEnv("OPNET_WALLET_PRIVATE_KEY"), requireEnv("OPNET_WALLET_QUANTUM_PRIVATE_KEY"), opnetNetwork);
}

function loadRelayPublicConfig() {
  const file = process.env.RELAYER_PUBLIC_CONFIG_FILE?.trim() || DEFAULT_PUBLIC_CONFIG;
  if (!fs.existsSync(file)) throw new Error(`Relay public config not found: ${file}`);
  const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  const relayPubKeysPackedHex = String(parsed.relayPubKeysPackedHex || "").trim();
  if (!relayPubKeysPackedHex) throw new Error(`relayPubKeysPackedHex missing in ${file}`);
  const suggested = Number(parsed.relayThresholdSuggested ?? 2);
  return { file, parsed, relayPubKeysPackedHex, suggestedThreshold: suggested };
}

async function main() {
  const action = process.argv[2] || "set-relays";
  const send = process.argv.includes("--send");
  if (!["set-relays"].includes(action)) {
    throw new Error(`Unsupported action: ${action}`);
  }

  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`OPNet Bridge Admin Helper

Action:
  set-relays              setRelaysConfigPacked(relayPubKeysPacked, threshold)

Required:
  OPNET_BRIDGE_ADDRESS
  Wallet auth:
    MNEMONIC (or OPNET_WALLET_MNEMONIC)
    OR OPNET_WALLET_PRIVATE_KEY + OPNET_WALLET_QUANTUM_PRIVATE_KEY

Optional:
  OPNET_NETWORK (default: testnet)
  OPNET_RPC_URL (default derived from network)
  RELAYER_PUBLIC_CONFIG_FILE (default: ${DEFAULT_PUBLIC_CONFIG})
  RELAYER_THRESHOLD (default from relay-public-config.json suggested threshold)
  OPNET_MAX_SAT_SPEND (default: 20000)
  OPNET_FEE_RATE (default: 2)

Flags:
  --send    simulate and send transaction (default: simulate only)
`);
    return;
  }

  const bridgeAddress = requireEnv("OPNET_BRIDGE_ADDRESS");
  const netName = process.env.OPNET_NETWORK;
  const network = resolveNetwork(netName);
  const rpcUrl = process.env.OPNET_RPC_URL?.trim() || defaultRpcUrl(netName);
  const provider = createOpnetJsonRpcProvider({ url: rpcUrl, network });
  const wallet = buildWalletFromEnv(network);

  if (action === "set-relays") {
    const { file, relayPubKeysPackedHex, suggestedThreshold } = loadRelayPublicConfig();
    const relayPubKeysPacked = parseHexBytes(relayPubKeysPackedHex, "relayPubKeysPackedHex");
    const threshold = Number(process.env.RELAYER_THRESHOLD?.trim() || String(suggestedThreshold));
    if (!Number.isInteger(threshold) || threshold < 1 || threshold > 32) {
      throw new Error("RELAYER_THRESHOLD must be an integer in [1,32]");
    }

    const bridge = getContract(bridgeAddress, BRIDGE_ADMIN_ABI, provider, network);
    if (typeof bridge.setSender === "function") {
      bridge.setSender(wallet.address);
    }
    const simulation = await bridge.setRelaysConfigPacked(relayPubKeysPacked, threshold);
    if (simulation?.revert) {
      throw new Error(`Simulation revert: ${simulation.revert}`);
    }

    const snapshot = {
      action: "opnet-bridge/set-relays",
      send,
      rpcUrl,
      rpcTransport: describeOpnetRpcTransport(),
      network: normalizeNetworkName(netName),
      bridgeAddress,
      walletP2TR: wallet.p2tr,
      walletAddressHex: wallet.address.toHex(),
      relayPublicConfigFile: file,
      relayPubKeysPackedBytes: relayPubKeysPacked.length,
      threshold,
    };

    if (!send) {
      console.log(JSON.stringify(snapshot, null, 2));
      return;
    }

    const maxSatSpend = BigInt(process.env.OPNET_MAX_SAT_SPEND?.trim() || "20000");
    const feeRate = Number(process.env.OPNET_FEE_RATE?.trim() || "2");
    const receipt = await simulation.sendTransaction({
      signer: wallet.keypair,
      mldsaSigner: wallet.mldsaKeypair,
      refundTo: wallet.p2tr,
      maximumAllowedSatToSpend: maxSatSpend,
      feeRate,
      network,
    });
    console.log(JSON.stringify({ ...snapshot, sent: true, receipt }, null, 2));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
