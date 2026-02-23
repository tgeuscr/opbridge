import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { ethers } from "ethers";

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value.trim();
}

function normalizeBytes32Hex(raw, fieldName) {
  const value = String(raw ?? "").trim();
  if (!value) throw new Error(`${fieldName} is required.`);
  const normalized = value.startsWith("0x") ? value.toLowerCase() : `0x${value.toLowerCase()}`;
  if (!/^0x[0-9a-f]{64}$/.test(normalized)) {
    throw new Error(`${fieldName} must be 32 bytes (0x + 64 hex chars).`);
  }
  return normalized;
}

function parseDeployment(projectRoot) {
  const deploymentPath =
    process.env.SEPOLIA_DEPLOYMENT_FILE?.trim() ||
    path.join(projectRoot, "deployments", "sepolia-latest.json");
  if (!fs.existsSync(deploymentPath)) {
    throw new Error(`Deployment file not found: ${deploymentPath}`);
  }
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  if (!deployment?.vaultAddress) {
    throw new Error(`Deployment file missing vaultAddress: ${deploymentPath}`);
  }
  return { deploymentPath, deployment };
}

function loadRelayPrivateKeys() {
  if (process.env.RELAYER_EVM_KEYS_JSON?.trim()) {
    const parsed = JSON.parse(process.env.RELAYER_EVM_KEYS_JSON);
    const keys = Array.isArray(parsed.relayEvmPrivateKeys)
      ? parsed.relayEvmPrivateKeys
      : Array.isArray(parsed.relayPrivateKeys)
        ? parsed.relayPrivateKeys
        : [];
    return keys.map((k) => String(k).trim()).filter(Boolean);
  }

  const keysFile = process.env.RELAYER_EVM_KEYS_FILE?.trim();
  if (keysFile) {
    if (!fs.existsSync(keysFile)) {
      throw new Error(`RELAYER_EVM_KEYS_FILE not found: ${keysFile}`);
    }
    const parsed = JSON.parse(fs.readFileSync(keysFile, "utf8"));
    const keys = Array.isArray(parsed.relayEvmPrivateKeys)
      ? parsed.relayEvmPrivateKeys
      : Array.isArray(parsed.relayPrivateKeys)
        ? parsed.relayPrivateKeys
        : [];
    return keys.map((k) => String(k).trim()).filter(Boolean);
  }

  const csv = process.env.RELAYER_EVM_PRIVATE_KEYS?.trim();
  if (csv) {
    return csv
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
}

function resolveRelayWallets() {
  const keys = loadRelayPrivateKeys();
  if (keys.length === 0) {
    throw new Error(
      "No relay EVM keys found. Set RELAYER_EVM_KEYS_FILE, RELAYER_EVM_KEYS_JSON, or RELAYER_EVM_PRIVATE_KEYS.",
    );
  }
  return keys.map((pk, relayIndex) => ({
    relayIndex,
    wallet: new ethers.Wallet(pk),
  }));
}

function resolveBridgeHex(deployment) {
  const envBridgeHex = process.env.OPNET_BRIDGE_HEX?.trim();
  if (envBridgeHex) return normalizeBytes32Hex(envBridgeHex, "OPNET_BRIDGE_HEX");

  const fromDeploymentHex = deployment?.opnet?.bridgeHex;
  if (fromDeploymentHex && /^0x[0-9a-fA-F]{64}$/.test(String(fromDeploymentHex).trim())) {
    return String(fromDeploymentHex).toLowerCase();
  }

  throw new Error(
    "Missing OPNET bridge hex. Set OPNET_BRIDGE_HEX (32-byte hex) or include opnet.bridgeHex in deployment JSON.",
  );
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`Configure Vault Release Relays (Sepolia)

Required:
  SEPOLIA_RPC_URL
  SEPOLIA_DEPLOYER_PRIVATE_KEY

Relay key input (one required):
  RELAYER_EVM_KEYS_FILE (JSON with relayEvmPrivateKeys or relayPrivateKeys array)
  RELAYER_EVM_KEYS_JSON (inline JSON)
  RELAYER_EVM_PRIVATE_KEYS (comma-separated private keys)

OP_NET bridge binding (one required):
  OPNET_BRIDGE_HEX (32-byte hex)
  OR deployment file containing opnet.bridgeHex

Optional:
  SEPOLIA_DEPLOYMENT_FILE (default: deployments/sepolia-latest.json)
  RELAYER_THRESHOLD (default: 2)
`);
    return;
  }

  const projectRoot = process.cwd();
  const rpcUrl = requireEnv("SEPOLIA_RPC_URL");
  const privateKey = requireEnv("SEPOLIA_DEPLOYER_PRIVATE_KEY");
  const { deploymentPath, deployment } = parseDeployment(projectRoot);
  const bridgeHex = resolveBridgeHex(deployment);
  const relayWallets = resolveRelayWallets();
  const relayCount = relayWallets.length;
  const relayThreshold = Number(process.env.RELAYER_THRESHOLD?.trim() || "2");
  if (!Number.isInteger(relayThreshold) || relayThreshold < 1 || relayThreshold > relayCount) {
    throw new Error(`RELAYER_THRESHOLD must be between 1 and relayCount (${relayCount}).`);
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  const chainId = (await provider.getNetwork()).chainId;
  if (chainId !== 11155111n) {
    throw new Error(`Expected Sepolia (11155111), got chainId=${chainId.toString()}`);
  }

  const vaultAddress = deployment.vaultAddress;
  const vaultAbi = [
    "function owner() view returns (address)",
    "function opnetBridgeHex() view returns (bytes32)",
    "function relayCount() view returns (uint8)",
    "function relayThreshold() view returns (uint8)",
    "function relaySigners(uint8) view returns (address)",
    "function setOpnetBridgeHex(bytes32 nextBridgeHex) external",
    "function setRelayCount(uint8 newRelayCount) external",
    "function setRelayThreshold(uint8 newRelayThreshold) external",
    "function setRelaySigner(uint8 relayIndex, address signer) external",
  ];
  const vault = new ethers.Contract(vaultAddress, vaultAbi, signer);

  console.log(`Configuring release relays on vault ${vaultAddress} via ${signer.address}`);
  console.log(`Deployment file: ${deploymentPath}`);
  console.log(`OPNET_BRIDGE_HEX: ${bridgeHex}`);
  console.log(`relayCount=${relayCount} relayThreshold=${relayThreshold}`);
  relayWallets.forEach(({ relayIndex, wallet }) => {
    console.log(`  relay[${relayIndex}] = ${wallet.address}`);
  });

  const currentBridgeHex = String(await vault.opnetBridgeHex()).toLowerCase();
  if (currentBridgeHex !== bridgeHex) {
    const tx = await vault.setOpnetBridgeHex(bridgeHex);
    await tx.wait();
    console.log(`Set opnetBridgeHex -> ${bridgeHex}`);
  } else {
    console.log("Skipped setOpnetBridgeHex (already matches)");
  }

  const currentRelayCount = Number(await vault.relayCount());
  if (currentRelayCount !== relayCount) {
    const tx = await vault.setRelayCount(relayCount);
    await tx.wait();
    console.log(`Set relayCount -> ${relayCount}`);
  } else {
    console.log("Skipped setRelayCount (already matches)");
  }

  const currentRelayThreshold = Number(await vault.relayThreshold());
  if (currentRelayThreshold !== relayThreshold) {
    const tx = await vault.setRelayThreshold(relayThreshold);
    await tx.wait();
    console.log(`Set relayThreshold -> ${relayThreshold}`);
  } else {
    console.log("Skipped setRelayThreshold (already matches)");
  }

  for (const { relayIndex, wallet } of relayWallets) {
    const current = String(await vault.relaySigners(relayIndex)).toLowerCase();
    if (current === wallet.address.toLowerCase()) {
      console.log(`Skipped relay[${relayIndex}] (already ${wallet.address})`);
      continue;
    }
    const tx = await vault.setRelaySigner(relayIndex, wallet.address);
    await tx.wait();
    console.log(`Set relay[${relayIndex}] -> ${wallet.address}`);
  }

  console.log("Vault release relay configuration complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
