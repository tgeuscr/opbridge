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

async function main() {
  const projectRoot = process.cwd();
  const deploymentPath =
    process.env.SEPOLIA_DEPLOYMENT_FILE?.trim() ||
    path.join(projectRoot, "deployments", "sepolia-latest.json");
  const rpcUrl = requireEnv("SEPOLIA_RPC_URL");
  const privateKey = requireEnv("SEPOLIA_DEPLOYER_PRIVATE_KEY");
  const feeRecipientRaw = process.env.ETH_VAULT_FEE_RECIPIENT?.trim() || "";

  if (!fs.existsSync(deploymentPath)) {
    throw new Error(`Deployment file not found: ${deploymentPath}`);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  const chainId = (await provider.getNetwork()).chainId;
  if (chainId !== 11155111n) {
    throw new Error(`Expected Sepolia (11155111), got chainId=${chainId.toString()}`);
  }

  const vaultAddress = deployment.vaultAddress;
  const vaultAbi = [
    "function configureAsset(uint8 assetId, address token, bool enabled) external",
    "function setFeeRecipient(address nextFeeRecipient) external",
    "function owner() view returns (address)",
  ];
  const vault = new ethers.Contract(vaultAddress, vaultAbi, signer);

  console.log(`Configuring vault ${vaultAddress} as ${signer.address}`);
  if (feeRecipientRaw) {
    const tx = await vault.setFeeRecipient(feeRecipientRaw);
    await tx.wait();
    console.log(`Configured feeRecipient -> ${feeRecipientRaw}`);
  }
  for (const asset of deployment.assets) {
    const tx = await vault.configureAsset(asset.assetId, asset.tokenAddress, true);
    await tx.wait();
    console.log(`Configured asset ${asset.symbol} (${asset.assetId}) -> ${asset.tokenAddress}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
