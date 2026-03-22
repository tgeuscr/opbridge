import fs from "node:fs";
import process from "node:process";
import { ethers } from "ethers";
import {
  assertExpectedChainId,
  getDeployerPrivateKey,
  getDeploymentPath,
  getEthereumNetworkConfig,
  getRpcUrl,
} from "./lib/network-config.mjs";

async function main() {
  const networkConfig = getEthereumNetworkConfig();
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`Configure Vault (${networkConfig.label})

Required:
  ${networkConfig.rpcEnv}
  ${networkConfig.deployerKeyEnv}

Optional:
  ETHEREUM_DEPLOYMENT_FILE (default: deployments/${networkConfig.manifestLatestFile})
  ETH_VAULT_FEE_RECIPIENT=0x...
`);
    return;
  }

  const projectRoot = process.cwd();
  const deploymentPath = getDeploymentPath(projectRoot, networkConfig);
  const rpcUrl = getRpcUrl(networkConfig);
  const privateKey = getDeployerPrivateKey(networkConfig);
  const feeRecipientRaw = process.env.ETH_VAULT_FEE_RECIPIENT?.trim() || "";

  if (!fs.existsSync(deploymentPath)) {
    throw new Error(`Deployment file not found: ${deploymentPath}`);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  const chainId = (await provider.getNetwork()).chainId;
  assertExpectedChainId(chainId, networkConfig);

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
