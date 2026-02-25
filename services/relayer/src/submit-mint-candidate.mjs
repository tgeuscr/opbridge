import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { networks } from "@btc-vision/bitcoin";
import { Address, Mnemonic, Wallet } from "@btc-vision/transaction";
import { ABIDataTypes, BitcoinAbiTypes, getContract } from "opnet";
import { createOpnetJsonRpcProvider, describeOpnetRpcTransport } from "./opnet-rpc-provider.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../../..");
const DEFAULT_CANDIDATES_FILE = path.resolve(REPO_ROOT, "services/relayer/.data/mint-submission-candidates.json");
const DEFAULT_OPNET_RPC_URL = "https://regtest.opnet.org";
const TESTNET_OPNET_RPC_URL = "https://testnet.opnet.org";

const BRIDGE_MINT_ABI = [
  {
    name: "mintWithRelaySignatures",
    inputs: [
      { name: "asset", type: ABIDataTypes.UINT8 },
      { name: "ethereumUser", type: ABIDataTypes.ADDRESS },
      { name: "recipient", type: ABIDataTypes.ADDRESS },
      { name: "amount", type: ABIDataTypes.UINT256 },
      { name: "depositId", type: ABIDataTypes.UINT256 },
      { name: "attestationVersion", type: ABIDataTypes.UINT8 },
      { name: "relayIndexesPacked", type: ABIDataTypes.BYTES },
      { name: "relaySignaturesPacked", type: ABIDataTypes.BYTES },
    ],
    outputs: [],
    type: BitcoinAbiTypes.Function,
  },
];

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value.trim();
}

function hexToBytes(raw) {
  const value = String(raw ?? "").trim().toLowerCase();
  if (!value) throw new Error("Hex string is required.");
  const normalized = value.startsWith("0x") ? value.slice(2) : value;
  if (!/^[0-9a-f]+$/.test(normalized) || normalized.length % 2 !== 0) {
    throw new Error(`Invalid hex string: ${raw}`);
  }
  const bytes = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
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

function selectCandidate(parsed) {
  const candidates = Array.isArray(parsed.candidates) ? parsed.candidates : [];
  const readyCandidates = candidates.filter((entry) => entry.ready);
  if (readyCandidates.length === 0) {
    throw new Error("No ready candidate found in candidates file.");
  }

  const byHash = process.env.MINT_CANDIDATE_PAYLOAD_HASH?.trim().toLowerCase();
  if (byHash) {
    const found = readyCandidates.find((entry) => String(entry.payloadHashHex ?? "").toLowerCase() === byHash);
    if (!found) {
      throw new Error(`No ready candidate found for payload hash: ${byHash}`);
    }
    return found;
  }

  const byNonceRaw = process.env.MINT_CANDIDATE_NONCE?.trim();
  if (byNonceRaw) {
    if (!/^\d+$/.test(byNonceRaw)) {
      throw new Error("MINT_CANDIDATE_NONCE must be a non-negative integer.");
    }
    const found = readyCandidates.find((entry) => String(entry?.mintSubmission?.nonce ?? "") === byNonceRaw);
    if (!found) {
      throw new Error(`No ready candidate found for nonce=${byNonceRaw}`);
    }
    return found;
  }

  return readyCandidates[0];
}

function parseBooleanEnv(raw, defaultValue = false) {
  if (typeof raw === "undefined") return defaultValue;
  const value = String(raw).trim().toLowerCase();
  if (value === "1" || value === "true" || value === "yes" || value === "y") return true;
  if (value === "0" || value === "false" || value === "no" || value === "n") return false;
  throw new Error(`Invalid boolean env value: ${raw}`);
}

function buildWalletFromEnv(opnetNetwork) {
  const mnemonicPhrase = process.env.OPNET_WALLET_MNEMONIC?.trim();
  if (mnemonicPhrase) {
    const passphrase = process.env.OPNET_WALLET_MNEMONIC_PASSPHRASE?.trim() || "";
    const index = Number(process.env.OPNET_WALLET_INDEX?.trim() || "0");
    const account = Number(process.env.OPNET_WALLET_ACCOUNT?.trim() || "0");
    const isChange = parseBooleanEnv(process.env.OPNET_WALLET_IS_CHANGE, false);
    if (!Number.isInteger(index) || index < 0) {
      throw new Error("OPNET_WALLET_INDEX must be a non-negative integer.");
    }
    if (!Number.isInteger(account) || account < 0) {
      throw new Error("OPNET_WALLET_ACCOUNT must be a non-negative integer.");
    }
    const mnemonic = new Mnemonic(mnemonicPhrase, passphrase, opnetNetwork);
    const wallet = mnemonic.deriveOPWallet(undefined, index, account, isChange);
    return {
      wallet,
      walletSource: "mnemonic",
      walletMeta: { index, account, isChange },
    };
  }

  const classicalPrivateKey = requireEnv("OPNET_WALLET_PRIVATE_KEY");
  const quantumPrivateKey = requireEnv("OPNET_WALLET_QUANTUM_PRIVATE_KEY");
  return {
    wallet: Wallet.fromPrivateKeys(classicalPrivateKey, quantumPrivateKey, opnetNetwork),
    walletSource: "private-keys",
    walletMeta: null,
  };
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`Submit OPNet Mint Candidate

Required:
  EITHER:
    OPNET_WALLET_MNEMONIC
  OR:
    OPNET_WALLET_PRIVATE_KEY (classical key: hex or WIF)
    OPNET_WALLET_QUANTUM_PRIVATE_KEY (MLDSA private key: hex/base58)

Optional:
  OPNET_WALLET_MNEMONIC_PASSPHRASE (default: '')
  OPNET_WALLET_INDEX (default: 0)
  OPNET_WALLET_ACCOUNT (default: 0)
  OPNET_WALLET_IS_CHANGE (default: false)
  MINT_CANDIDATES_FILE (default: ${DEFAULT_CANDIDATES_FILE})
  MINT_CANDIDATE_PAYLOAD_HASH (select specific ready candidate)
  MINT_CANDIDATE_NONCE (select specific ready candidate by nonce)
  OPNET_BRIDGE_ADDRESS (fallback if candidate message.opnetBridge missing)
  OPNET_RPC_URL (default: derived from OPNET_NETWORK; regtest=${DEFAULT_OPNET_RPC_URL}, testnet=${TESTNET_OPNET_RPC_URL})
  OPNET_RPC_PROXY_URL (optional explicit HTTP(S) proxy URL for OPNet RPC)
  OPNET_RPC_PROXY_AUTH_TOKEN (optional raw Proxy-Authorization header value for explicit proxy mode)
  OPNET_RPC_USE_ENV_PROXY (default: true; honor HTTP_PROXY/HTTPS_PROXY for OPNet RPC)
  OPNET_RPC_NO_PROXY (optional override for NO_PROXY when using env proxy mode)
  OPNET_NETWORK (default: regtest; allowed: testnet|regtest|mainnet)
  OPNET_MAX_SAT_SPEND (default: 20000)
  OPNET_FEE_RATE (default: 2)
`);
    return;
  }

  const candidatesFile = process.env.MINT_CANDIDATES_FILE?.trim() || DEFAULT_CANDIDATES_FILE;
  const opnetNetworkName = process.env.OPNET_NETWORK;
  const opnetNetwork = resolveNetwork(opnetNetworkName);
  const opnetRpcUrl = process.env.OPNET_RPC_URL?.trim() || defaultOpnetRpcUrlForNetwork(opnetNetworkName);
  const maxSatSpend = BigInt(process.env.OPNET_MAX_SAT_SPEND?.trim() || "20000");
  const feeRate = Number(process.env.OPNET_FEE_RATE?.trim() || "2");
  if (!Number.isFinite(feeRate) || feeRate <= 0) {
    throw new Error("OPNET_FEE_RATE must be a positive number.");
  }

  if (!fs.existsSync(candidatesFile)) {
    throw new Error(`Candidates file not found: ${candidatesFile}`);
  }
  const parsed = JSON.parse(fs.readFileSync(candidatesFile, "utf8"));
  const selected = selectCandidate(parsed);
  const mintSubmission = selected.mintSubmission;
  if (!mintSubmission) {
    throw new Error("Selected candidate missing mintSubmission.");
  }
  if (!mintSubmission.ethereumUser) {
    throw new Error("Selected candidate missing mintSubmission.ethereumUser.");
  }
  if (typeof mintSubmission.attestationVersion === "undefined") {
    throw new Error("Selected candidate missing mintSubmission.attestationVersion.");
  }

  const bridgeAddress =
    process.env.OPNET_BRIDGE_ADDRESS?.trim() ||
    selected?.message?.opnetBridge ||
    "";
  if (!bridgeAddress) {
    throw new Error("Bridge address is missing. Set OPNET_BRIDGE_ADDRESS or ensure candidate has message.opnetBridge.");
  }

  const { wallet, walletSource, walletMeta } = buildWalletFromEnv(opnetNetwork);
  const provider = createOpnetJsonRpcProvider({ url: opnetRpcUrl, network: opnetNetwork });

  const bridge = getContract(bridgeAddress, BRIDGE_MINT_ABI, provider, opnetNetwork);
  const recipient = Address.fromString(String(mintSubmission.recipient));
  const ethereumUser = Address.fromString(String(mintSubmission.ethereumUser));
  const attestationVersion = Number(mintSubmission.attestationVersion);
  if (!Number.isInteger(attestationVersion) || attestationVersion < 0 || attestationVersion > 255) {
    throw new Error(`Invalid mintSubmission.attestationVersion=${mintSubmission.attestationVersion}`);
  }
  const relayIndexesPacked = hexToBytes(mintSubmission.relayIndexesPackedHex);
  const relaySignaturesPacked = hexToBytes(mintSubmission.relaySignaturesPackedHex);

  console.log(
    `Submitting mint candidate payloadHash=${selected.payloadHashHex} asset=${mintSubmission.assetId} nonce=${mintSubmission.nonce}`,
  );
  console.log(`OP_NET RPC transport: ${describeOpnetRpcTransport()} -> ${opnetRpcUrl}`);

  const simulation = await bridge.mintWithRelaySignatures(
    Number(mintSubmission.assetId),
    ethereumUser,
    recipient,
    BigInt(mintSubmission.amount),
    BigInt(mintSubmission.nonce),
    attestationVersion,
    relayIndexesPacked,
    relaySignaturesPacked,
  );

  if (simulation.revert) {
    throw new Error(`Mint simulation revert: ${simulation.revert}`);
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
        action: "opnet/mint/submit-candidate",
        candidatePayloadHash: selected.payloadHashHex,
        bridgeAddress,
        rpcUrl: opnetRpcUrl,
        rpcTransport: describeOpnetRpcTransport(),
        network: process.env.OPNET_NETWORK?.trim() || "regtest",
        walletSource,
        walletMeta,
        walletP2TR: wallet.p2tr,
        walletAddressHex: wallet.address.toHex(),
        mintSubmission,
        simulation: {
          revert: simulation.revert ?? null,
          estimatedGas: simulation.estimatedGas?.toString() ?? null,
          properties: simulation.properties ?? null,
        },
        receipt,
      },
      (_, value) => (typeof value === "bigint" ? value.toString() : value),
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
