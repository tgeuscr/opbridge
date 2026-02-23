import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { ethers } from "ethers";
import {
  buildRelayPublicPayload,
  deriveRelayKeys,
  parseIntEnv,
  requireMnemonicFromEnv,
  resolveOPNetNetwork,
} from "./relay-key-utils.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../../..");
const DEFAULT_PUBLIC_FILE = path.resolve(REPO_ROOT, "services/relayer/.data/relay-public-config.json");
const DEFAULT_DEPLOYMENT_FILE = path.resolve(REPO_ROOT, "contracts/ethereum/deployments/sepolia-latest.json");

function parseExpectedPublicConfig() {
  const file = process.env.RELAYER_PUBLIC_CONFIG_FILE?.trim() || DEFAULT_PUBLIC_FILE;
  if (!fs.existsSync(file)) {
    return { file, parsed: null };
  }
  return { file, parsed: JSON.parse(fs.readFileSync(file, "utf8")) };
}

function comparePublicConfig(derived, expected) {
  const findings = [];
  if (!expected) return findings;

  if (String(expected.relayPubKeysPackedHex ?? "").toLowerCase() !== String(derived.relayPubKeysPackedHex).toLowerCase()) {
    findings.push("relayPubKeysPackedHex mismatch");
  }

  const expectedRelays = Array.isArray(expected.relays) ? expected.relays : [];
  for (const relay of derived.relays) {
    const match = expectedRelays.find((r) => Number(r.relayIndex) === Number(relay.relayIndex));
    if (!match) {
      findings.push(`missing relayIndex=${relay.relayIndex} in relay-public-config`);
      continue;
    }
    if (String(match.mldsaPublicKeyHex ?? "").toLowerCase() !== relay.mldsaPublicKeyHex.toLowerCase()) {
      findings.push(`relayIndex=${relay.relayIndex} MLDSA public key mismatch`);
    }
    if (String(match.ethereumAddress ?? "").toLowerCase() !== relay.ethereumAddress.toLowerCase()) {
      findings.push(`relayIndex=${relay.relayIndex} ECDSA address mismatch`);
    }
  }

  return findings;
}

async function verifySepoliaVault(derivedRelays) {
  const rpcUrl = process.env.SEPOLIA_RPC_URL?.trim();
  if (!rpcUrl) return { skipped: "SEPOLIA_RPC_URL not set" };

  const deploymentPath = process.env.SEPOLIA_DEPLOYMENT_FILE?.trim() || DEFAULT_DEPLOYMENT_FILE;
  if (!fs.existsSync(deploymentPath)) return { skipped: `Deployment file not found: ${deploymentPath}` };

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const vaultAddress = process.env.SEPOLIA_VAULT_ADDRESS?.trim() || deployment?.vaultAddress;
  if (!vaultAddress) return { skipped: "Vault address missing (SEPOLIA_VAULT_ADDRESS or deployment file)" };

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const chainId = (await provider.getNetwork()).chainId;
  if (chainId !== 11155111n) {
    return { skipped: `Connected chainId=${chainId.toString()} (expected Sepolia 11155111)` };
  }

  const abi = [
    "function relayCount() view returns (uint8)",
    "function relayThreshold() view returns (uint8)",
    "function relaySigners(uint8) view returns (address)",
  ];
  const vault = new ethers.Contract(vaultAddress, abi, provider);
  const relayCount = Number(await vault.relayCount());
  const relayThreshold = Number(await vault.relayThreshold());

  const signerFindings = [];
  for (const relay of derivedRelays) {
    if (relay.relayIndex >= relayCount) {
      signerFindings.push(`relayIndex=${relay.relayIndex} exceeds on-chain relayCount=${relayCount}`);
      continue;
    }
    const onchain = String(await vault.relaySigners(relay.relayIndex)).toLowerCase();
    if (onchain !== relay.ethereumAddress.toLowerCase()) {
      signerFindings.push(
        `relayIndex=${relay.relayIndex} vault signer mismatch (onchain=${onchain}, derived=${relay.ethereumAddress})`,
      );
    }
  }

  return {
    vaultAddress,
    relayCount,
    relayThreshold,
    findings: signerFindings,
  };
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`Verify Relay Keys (deterministic derivation -> file / optional Sepolia vault)

Required:
  RELAYER_KEYS_MNEMONIC

Optional (must match keys:generate inputs if you used custom values):
  RELAYER_KEYS_PASSPHRASE
  RELAYER_KEYS_COUNT (default: 3)
  RELAYER_KEYS_START_INDEX (default: 0)
  RELAYER_KEYS_ACCOUNT (default: 0)
  RELAYER_KEYS_IS_CHANGE (default: false)
  RELAYER_KEYS_OPNET_NETWORK (default: regtest)
  RELAYER_PUBLIC_CONFIG_FILE (default: ${DEFAULT_PUBLIC_FILE})

Optional on-chain verification (Ethereum vault relay signer slots):
  SEPOLIA_RPC_URL
  SEPOLIA_DEPLOYMENT_FILE (default: ${DEFAULT_DEPLOYMENT_FILE})
  SEPOLIA_VAULT_ADDRESS (overrides deployment file)
`);
    return;
  }

  const phrase = requireMnemonicFromEnv();
  const passphrase = process.env.RELAYER_KEYS_PASSPHRASE?.trim() || "";
  const count = parseIntEnv("RELAYER_KEYS_COUNT", 3, 1);
  const startIndex = parseIntEnv("RELAYER_KEYS_START_INDEX", 0, 0);
  const account = parseIntEnv("RELAYER_KEYS_ACCOUNT", 0, 0);
  const isChange = /^(1|true|yes|y)$/i.test(process.env.RELAYER_KEYS_IS_CHANGE?.trim() || "");
  const opnetNetworkName = process.env.RELAYER_KEYS_OPNET_NETWORK?.trim() || "regtest";
  const opnetNetwork = resolveOPNetNetwork(opnetNetworkName);

  const relayRows = deriveRelayKeys({
    phrase,
    passphrase,
    count,
    startIndex,
    account,
    isChange,
    opnetNetwork,
  });
  const derivedPublic = buildRelayPublicPayload({ relayRows, opnetNetworkName });
  const { file: publicFile, parsed: expectedPublic } = parseExpectedPublicConfig();
  const publicFindings = comparePublicConfig(derivedPublic, expectedPublic);
  const vaultResult = await verifySepoliaVault(derivedPublic.relays);

  console.log("Derived relay summary:");
  for (const relay of derivedPublic.relays) {
    console.log(
      `  [${relay.relayIndex}] opnetRelayId=${relay.opnetRelayId} evm=${relay.ethereumAddress} path=${relay.ethereumDerivationPath}`,
    );
  }

  console.log(`\nPublic config file: ${publicFile}`);
  if (!expectedPublic) {
    console.log("  not found (skipped file comparison)");
  } else if (publicFindings.length === 0) {
    console.log("  OK (derived keys match relay-public-config.json)");
  } else {
    console.log("  MISMATCHES:");
    for (const finding of publicFindings) console.log(`    - ${finding}`);
  }

  console.log("\nEthereum vault relay signer check:");
  if (vaultResult.skipped) {
    console.log(`  skipped: ${vaultResult.skipped}`);
  } else if (vaultResult.findings.length === 0) {
    console.log(
      `  OK vault=${vaultResult.vaultAddress} relayCount=${vaultResult.relayCount} relayThreshold=${vaultResult.relayThreshold}`,
    );
  } else {
    console.log(
      `  vault=${vaultResult.vaultAddress} relayCount=${vaultResult.relayCount} relayThreshold=${vaultResult.relayThreshold}`,
    );
    for (const finding of vaultResult.findings) console.log(`    - ${finding}`);
  }

  if (publicFindings.length > 0 || (!vaultResult.skipped && vaultResult.findings.length > 0)) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
