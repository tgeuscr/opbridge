import fs from "node:fs";
import process from "node:process";
import { ethers } from "ethers";
import {
  assertExpectedChainId,
  getDeployerPrivateKey,
  getDeploymentPath,
  getEnv,
  getEthereumNetworkConfig,
  getRpcUrl,
} from "./lib/network-config.mjs";

function normalizeBytes32Hex(raw, fieldName) {
  const value = String(raw ?? "").trim();
  if (!value) throw new Error(`${fieldName} is required.`);
  const normalized = value.startsWith("0x") ? value.toLowerCase() : `0x${value.toLowerCase()}`;
  if (!/^0x[0-9a-f]{64}$/.test(normalized)) {
    throw new Error(`${fieldName} must be 32 bytes (0x + 64 hex chars).`);
  }
  return normalized;
}

function parseDeployment(projectRoot, networkConfig) {
  const deploymentPath = getDeploymentPath(projectRoot, networkConfig);
  if (!fs.existsSync(deploymentPath)) {
    throw new Error(`Deployment file not found: ${deploymentPath}`);
  }
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  if (!deployment?.vaultAddress) {
    throw new Error(`Deployment file missing vaultAddress: ${deploymentPath}`);
  }
  return { deploymentPath, deployment };
}

function parseRelaySigner(index) {
  return getEnv(`RELAY_SIGNER_${index}`, `RELAYER_SIGNER_${index}`);
}

function loadRelaySigners() {
  const signers = [];
  for (let index = 0; ; index += 1) {
    const value = parseRelaySigner(index);
    if (!value) {
      if (index === 0) {
        throw new Error("No relay signers found. Set RELAY_SIGNER_0 (and subsequent indexes).");
      }
      break;
    }
    signers.push({
      relayIndex: index,
      address: ethers.getAddress(value),
    });
  }
  return signers;
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
  const networkConfig = getEthereumNetworkConfig();
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`Configure Vault Release Relays Directly (${networkConfig.label})

Required:
  ${networkConfig.rpcEnv}
  ${networkConfig.deployerKeyEnv}
  RELAY_SIGNER_0, RELAY_SIGNER_1, ... in relay index order

OP_NET bridge binding (one required):
  OPNET_BRIDGE_HEX (32-byte hex)
  OR deployment file containing opnet.bridgeHex

Optional:
  ETHEREUM_DEPLOYMENT_FILE (default: deployments/${networkConfig.manifestLatestFile})
  RELAYER_THRESHOLD (default: 2)
`);
    return;
  }

  const projectRoot = process.cwd();
  const rpcUrl = getRpcUrl(networkConfig);
  const privateKey = getDeployerPrivateKey(networkConfig);
  const { deploymentPath, deployment } = parseDeployment(projectRoot, networkConfig);
  const bridgeHex = resolveBridgeHex(deployment);
  const relaySigners = loadRelaySigners();
  const relayCount = relaySigners.length;
  const relayThreshold = Number(process.env.RELAYER_THRESHOLD?.trim() || "2");
  if (!Number.isInteger(relayThreshold) || relayThreshold < 1 || relayThreshold > relayCount) {
    throw new Error(`RELAYER_THRESHOLD must be between 1 and relayCount (${relayCount}).`);
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  const chainId = (await provider.getNetwork()).chainId;
  assertExpectedChainId(chainId, networkConfig);

  const vaultAbi = [
    "function owner() view returns (address)",
    "function paused() view returns (bool)",
    "function opnetBridgeHex() view returns (bytes32)",
    "function relayCount() view returns (uint8)",
    "function relayThreshold() view returns (uint8)",
    "function relaySigners(uint8) view returns (address)",
    "function setOpnetBridgeHex(bytes32 nextBridgeHex) external",
    "function setRelayCount(uint8 newRelayCount) external",
    "function setRelayThreshold(uint8 newRelayThreshold) external",
    "function setRelaySigner(uint8 relayIndex, address signer) external",
  ];
  const vault = new ethers.Contract(deployment.vaultAddress, vaultAbi, signer);

  console.log(`Configuring release relays on vault ${deployment.vaultAddress} via ${signer.address}`);
  console.log(`Deployment file: ${deploymentPath}`);
  console.log(`paused=${await vault.paused()}`);
  console.log(`OPNET_BRIDGE_HEX: ${bridgeHex}`);
  console.log(`relayCount=${relayCount} relayThreshold=${relayThreshold}`);
  relaySigners.forEach(({ relayIndex, address }) => {
    console.log(`  relay[${relayIndex}] = ${address}`);
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

  for (const { relayIndex, address } of relaySigners) {
    const current = String(await vault.relaySigners(relayIndex)).toLowerCase();
    if (current === address.toLowerCase()) {
      console.log(`Skipped relay[${relayIndex}] (already ${address})`);
      continue;
    }
    const tx = await vault.setRelaySigner(relayIndex, address);
    await tx.wait();
    console.log(`Set relay[${relayIndex}] -> ${address}`);
  }

  console.log("Vault release relay configuration complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
