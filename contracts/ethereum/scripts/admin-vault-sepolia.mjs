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

function getEnv(...names) {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) return value.trim();
  }
  return "";
}

function parseOptionalBool(raw, fieldName) {
  if (raw == null || String(raw).trim() === "") return undefined;
  const value = String(raw).trim().toLowerCase();
  if (value === "true" || value === "1" || value === "yes") return true;
  if (value === "false" || value === "0" || value === "no") return false;
  throw new Error(`${fieldName} must be true/false (or 1/0, yes/no).`);
}

function parseOptionalFeeBps(raw) {
  if (raw == null || String(raw).trim() === "") return undefined;
  const n = Number(String(raw).trim());
  if (!Number.isInteger(n) || n < 0 || n > 10_000) {
    throw new Error("ETH_VAULT_FEE_BPS must be an integer between 0 and 10000.");
  }
  return n;
}

function parseDeployment(projectRoot) {
  const deploymentPath =
    getEnv("ETHEREUM_DEPLOYMENT_FILE", "SEPOLIA_DEPLOYMENT_FILE") ||
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

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`Vault Admin (Sepolia)

Required:
  ETHEREUM_RPC_URL (or SEPOLIA_RPC_URL fallback)
  ETHEREUM_DEPLOYER_PRIVATE_KEY (or SEPOLIA_DEPLOYER_PRIVATE_KEY fallback)

Vault selection (one required):
  ETHEREUM_VAULT_ADDRESS
  OR deployment file with vaultAddress (ETHEREUM_DEPLOYMENT_FILE or deployments/sepolia-latest.json)

Optional actions (any combination):
  ETHEREUM_VAULT_PAUSED=true|false
  ETH_VAULT_FEE_BPS=<0..10000>           # pause-guarded in contract
  ETH_VAULT_FEE_RECIPIENT=0x...
  ETH_VAULT_FEE_WHITELIST_ACCOUNT=0x...
  ETH_VAULT_FEE_WHITELIST_ENABLED=true|false

Notes:
  - If pausing and setting fee bps in the same run, pause is applied first.
  - If unpausing and setting fee bps in the same run, fee bps is applied before unpause.
`);
    return;
  }

  const projectRoot = process.cwd();
  const rpcUrl = getEnv("ETHEREUM_RPC_URL", "SEPOLIA_RPC_URL") || requireEnv("SEPOLIA_RPC_URL");
  const privateKey = getEnv("ETHEREUM_DEPLOYER_PRIVATE_KEY", "SEPOLIA_DEPLOYER_PRIVATE_KEY") || requireEnv("SEPOLIA_DEPLOYER_PRIVATE_KEY");
  const pausedTarget = parseOptionalBool(
    getEnv("ETHEREUM_VAULT_PAUSED", "SEPOLIA_VAULT_PAUSED"),
    "ETHEREUM_VAULT_PAUSED",
  );
  const feeBpsTarget = parseOptionalFeeBps(process.env.ETH_VAULT_FEE_BPS);
  const feeRecipientTarget = process.env.ETH_VAULT_FEE_RECIPIENT?.trim() || "";
  const feeWhitelistAccountTarget = process.env.ETH_VAULT_FEE_WHITELIST_ACCOUNT?.trim() || "";
  const feeWhitelistEnabledTarget = parseOptionalBool(
    process.env.ETH_VAULT_FEE_WHITELIST_ENABLED,
    "ETH_VAULT_FEE_WHITELIST_ENABLED",
  );

  if ((feeWhitelistAccountTarget && feeWhitelistEnabledTarget === undefined) || (!feeWhitelistAccountTarget && feeWhitelistEnabledTarget !== undefined)) {
    throw new Error(
      "ETH_VAULT_FEE_WHITELIST_ACCOUNT and ETH_VAULT_FEE_WHITELIST_ENABLED must be set together.",
    );
  }

  if (pausedTarget === undefined && feeBpsTarget === undefined && !feeRecipientTarget && !feeWhitelistAccountTarget) {
    throw new Error(
      "No actions requested. Set at least one of ETHEREUM_VAULT_PAUSED, ETH_VAULT_FEE_BPS, ETH_VAULT_FEE_RECIPIENT, ETH_VAULT_FEE_WHITELIST_ACCOUNT+ETH_VAULT_FEE_WHITELIST_ENABLED.",
    );
  }

  let deploymentPath = "";
  let vaultAddress = getEnv("ETHEREUM_VAULT_ADDRESS", "SEPOLIA_VAULT_ADDRESS");
  if (!vaultAddress) {
    const parsed = parseDeployment(projectRoot);
    deploymentPath = parsed.deploymentPath;
    vaultAddress = parsed.deployment.vaultAddress;
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  const chainId = (await provider.getNetwork()).chainId;
  if (chainId !== 11155111n) {
    throw new Error(`Expected Sepolia (11155111), got chainId=${chainId.toString()}`);
  }

  const vaultAbi = [
    "function owner() view returns (address)",
    "function paused() view returns (bool)",
    "function feeBps() view returns (uint16)",
    "function feeRecipient() view returns (address)",
    "function feeWhitelist(address account) view returns (bool)",
    "function setPaused(bool nextPaused) external",
    "function setFeeBps(uint16 nextFeeBps) external",
    "function setFeeRecipient(address nextFeeRecipient) external",
    "function setFeeWhitelist(address account, bool whitelisted) external",
  ];
  const vault = new ethers.Contract(vaultAddress, vaultAbi, signer);

  console.log(`Admin vault ${vaultAddress} as ${signer.address}`);
  if (deploymentPath) console.log(`Deployment file: ${deploymentPath}`);

  let currentPaused = Boolean(await vault.paused());
  const currentFeeBps = Number(await vault.feeBps());
  const currentFeeRecipient = String(await vault.feeRecipient());
  console.log(`Current: paused=${currentPaused} feeBps=${currentFeeBps} feeRecipient=${currentFeeRecipient}`);

  // If we need pause for feeBps updates, apply pause=true first.
  if (pausedTarget === true && currentPaused !== true) {
    const tx = await vault.setPaused(true);
    await tx.wait();
    currentPaused = true;
    console.log("Set paused -> true");
  }

  if (feeBpsTarget !== undefined) {
    if (Number(await vault.feeBps()) !== feeBpsTarget) {
      const tx = await vault.setFeeBps(feeBpsTarget);
      await tx.wait();
      console.log(`Set feeBps -> ${feeBpsTarget}`);
    } else {
      console.log("Skipped setFeeBps (already matches)");
    }
  }

  if (feeRecipientTarget) {
    const next = feeRecipientTarget.toLowerCase();
    const current = String(await vault.feeRecipient()).toLowerCase();
    if (current !== next) {
      const tx = await vault.setFeeRecipient(feeRecipientTarget);
      await tx.wait();
      console.log(`Set feeRecipient -> ${feeRecipientTarget}`);
    } else {
      console.log("Skipped setFeeRecipient (already matches)");
    }
  }

  if (feeWhitelistAccountTarget) {
    const normalizedAccount = ethers.getAddress(feeWhitelistAccountTarget);
    const current = Boolean(await vault.feeWhitelist(normalizedAccount));
    if (current !== feeWhitelistEnabledTarget) {
      const tx = await vault.setFeeWhitelist(normalizedAccount, feeWhitelistEnabledTarget);
      await tx.wait();
      console.log(`Set feeWhitelist -> account=${normalizedAccount} enabled=${feeWhitelistEnabledTarget}`);
    } else {
      console.log(`Skipped setFeeWhitelist (already matches) for ${normalizedAccount}`);
    }
  }

  // Apply final pause target last (important if feeBps was also requested).
  if (pausedTarget === false && currentPaused !== false) {
    const tx = await vault.setPaused(false);
    await tx.wait();
    console.log("Set paused -> false");
  } else if (pausedTarget === true && currentPaused === true) {
    console.log("Skipped setPaused(true) (already paused)");
  }

  console.log("Vault admin update complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
