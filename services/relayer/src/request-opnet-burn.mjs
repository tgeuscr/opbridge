import process from "node:process";
import { networks } from "@btc-vision/bitcoin";
import { Address, Mnemonic, Wallet } from "@btc-vision/transaction";
import { ABIDataTypes, BitcoinAbiTypes, getContract } from "opnet";
import { createOpnetJsonRpcProvider, describeOpnetRpcTransport } from "./opnet-rpc-provider.mjs";

const DEFAULT_OPNET_RPC_URL = "https://regtest.opnet.org";
const TESTNET_OPNET_RPC_URL = "https://testnet.opnet.org";

const BRIDGE_BURN_ABI = [
  {
    name: "requestBurn",
    inputs: [
      { name: "asset", type: ABIDataTypes.UINT8 },
      { name: "from", type: ABIDataTypes.ADDRESS },
      { name: "ethereumRecipient", type: ABIDataTypes.ADDRESS },
      { name: "amount", type: ABIDataTypes.UINT256 },
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

function parseBooleanEnv(raw, defaultValue = false) {
  if (typeof raw === "undefined") return defaultValue;
  const value = String(raw).trim().toLowerCase();
  if (["1", "true", "yes", "y"].includes(value)) return true;
  if (["0", "false", "no", "n"].includes(value)) return false;
  throw new Error(`Invalid boolean env value: ${raw}`);
}

function normalizeNetworkName(name) {
  return String(name || "regtest").trim().toLowerCase();
}

function resolveNetwork(name) {
  const normalized = normalizeNetworkName(name);
  if (normalized === "testnet") return networks.opnetTestnet;
  if (normalized === "regtest") return networks.regtest;
  if (normalized === "mainnet") return networks.bitcoin;
  throw new Error(`Unsupported OPNET_NETWORK=${name}. Expected testnet, regtest, or mainnet.`);
}

function defaultOpnetRpcUrlForNetwork(name) {
  return normalizeNetworkName(name) === "testnet" ? TESTNET_OPNET_RPC_URL : DEFAULT_OPNET_RPC_URL;
}

function parseUintEnv(name) {
  const value = requireEnv(name);
  if (!/^\d+$/.test(value)) throw new Error(`${name} must be a non-negative integer string.`);
  return BigInt(value);
}

function parseU8Env(name) {
  const value = Number(requireEnv(name));
  if (!Number.isInteger(value) || value < 0 || value > 255) throw new Error(`${name} must be an integer in [0,255].`);
  return value;
}

function buildWalletFromEnv(opnetNetwork) {
  const mnemonicPhrase = process.env.OPNET_WALLET_MNEMONIC?.trim();
  if (mnemonicPhrase) {
    const passphrase = process.env.OPNET_WALLET_MNEMONIC_PASSPHRASE?.trim() || "";
    const index = Number(process.env.OPNET_WALLET_INDEX?.trim() || "0");
    const account = Number(process.env.OPNET_WALLET_ACCOUNT?.trim() || "0");
    const isChange = parseBooleanEnv(process.env.OPNET_WALLET_IS_CHANGE, false);
    if (!Number.isInteger(index) || index < 0) throw new Error("OPNET_WALLET_INDEX must be a non-negative integer.");
    if (!Number.isInteger(account) || account < 0) throw new Error("OPNET_WALLET_ACCOUNT must be a non-negative integer.");
    const mnemonic = new Mnemonic(mnemonicPhrase, passphrase, opnetNetwork);
    const wallet = mnemonic.deriveOPWallet(undefined, index, account, isChange);
    return { wallet, walletSource: "mnemonic", walletMeta: { index, account, isChange } };
  }

  const classicalPrivateKey = requireEnv("OPNET_WALLET_PRIVATE_KEY");
  const quantumPrivateKey = requireEnv("OPNET_WALLET_QUANTUM_PRIVATE_KEY");
  return { wallet: Wallet.fromPrivateKeys(classicalPrivateKey, quantumPrivateKey, opnetNetwork), walletSource: "private-keys", walletMeta: null };
}

async function main() {
  const send = process.argv.includes("--send");
  const simulateOnly = process.argv.includes("--simulate") || !send;

  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`Request OPNet Burn (OP_NET -> ETH)

Required:
  OPNET_BRIDGE_ADDRESS
  OPNET_BURN_ASSET_ID (uint8)
  OPNET_BURN_AMOUNT (raw integer, token base units)
  OPNET_BURN_ETHEREUM_RECIPIENT (0x... recipient on Ethereum)

Wallet (choose one mode):
  OPNET_WALLET_MNEMONIC
  OR
  OPNET_WALLET_PRIVATE_KEY + OPNET_WALLET_QUANTUM_PRIVATE_KEY

Optional:
  OPNET_NETWORK (default: regtest; allowed: testnet|regtest|mainnet)
  OPNET_RPC_URL (default: derived from OPNET_NETWORK; regtest=${DEFAULT_OPNET_RPC_URL}, testnet=${TESTNET_OPNET_RPC_URL})
  OPNET_WALLET_MNEMONIC_PASSPHRASE (default: '')
  OPNET_WALLET_INDEX (default: 0)
  OPNET_WALLET_ACCOUNT (default: 0)
  OPNET_WALLET_IS_CHANGE (default: false)
  OPNET_MAX_SAT_SPEND (default: 20000)
  OPNET_FEE_RATE (default: 2)

Flags:
  --simulate   simulate only (default)
  --send       simulate, then send transaction
`);
    return;
  }

  const opnetNetworkName = process.env.OPNET_NETWORK;
  const opnetNetwork = resolveNetwork(opnetNetworkName);
  const opnetRpcUrl = process.env.OPNET_RPC_URL?.trim() || defaultOpnetRpcUrlForNetwork(opnetNetworkName);
  const bridgeAddress = requireEnv("OPNET_BRIDGE_ADDRESS");
  const assetId = parseU8Env("OPNET_BURN_ASSET_ID");
  const amount = parseUintEnv("OPNET_BURN_AMOUNT");
  const ethereumRecipient = Address.fromString(requireEnv("OPNET_BURN_ETHEREUM_RECIPIENT"));
  const maxSatSpend = BigInt(process.env.OPNET_MAX_SAT_SPEND?.trim() || "20000");
  const feeRate = Number(process.env.OPNET_FEE_RATE?.trim() || "2");
  if (!Number.isFinite(feeRate) || feeRate <= 0) throw new Error("OPNET_FEE_RATE must be a positive number.");

  const { wallet, walletSource, walletMeta } = buildWalletFromEnv(opnetNetwork);
  const provider = createOpnetJsonRpcProvider({ url: opnetRpcUrl, network: opnetNetwork });
  const bridge = getContract(bridgeAddress, BRIDGE_BURN_ABI, provider, opnetNetwork);

  console.log(
    `Requesting burn asset=${assetId} amount=${amount.toString()} send=${String(!simulateOnly)} (withdrawalId generated on-chain)`,
  );
  console.log(`OP_NET RPC transport: ${describeOpnetRpcTransport()} -> ${opnetRpcUrl}`);

  const simulation = await bridge.requestBurn(assetId, wallet.address, ethereumRecipient, amount);
  if (simulation.revert) {
    throw new Error(`Burn simulation revert: ${simulation.revert}`);
  }

  const snapshot = {
    action: "opnet/burn/request",
    bridgeAddress,
    rpcUrl: opnetRpcUrl,
    rpcTransport: describeOpnetRpcTransport(),
    network: normalizeNetworkName(opnetNetworkName),
    walletSource,
    walletMeta,
    walletP2TR: wallet.p2tr,
    walletAddressHex: wallet.address.toHex(),
    burnRequest: {
      assetId,
      amount: amount.toString(),
      withdrawalId: "generated-on-chain",
      ethereumRecipient: requireEnv("OPNET_BURN_ETHEREUM_RECIPIENT"),
      from: wallet.address.toHex(),
    },
    simulation: {
      revert: simulation.revert ?? null,
      estimatedGas: simulation.estimatedGas?.toString?.() ?? null,
      properties: simulation.properties ?? null,
    },
  };

  if (simulateOnly) {
    console.log(JSON.stringify(snapshot, null, 2));
    return;
  }

  const receipt = await simulation.sendTransaction({
    signer: wallet.keypair,
    mldsaSigner: wallet.mldsaKeypair,
    refundTo: wallet.p2tr,
    maximumAllowedSatToSpend: maxSatSpend,
    feeRate,
    network: opnetNetwork,
  });

  console.log(
    JSON.stringify(
      {
        ...snapshot,
        sent: true,
        receipt,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
