import path from "node:path";
import process from "node:process";

export const ETHEREUM_NETWORKS = {
  sepolia: {
    label: "Sepolia",
    chainId: 11155111n,
    envPrefix: "SEPOLIA",
    rpcEnv: "SEPOLIA_RPC_URL",
    deployerKeyEnv: "SEPOLIA_DEPLOYER_PRIVATE_KEY",
    depositorKeyEnv: "SEPOLIA_DEPOSITOR_PRIVATE_KEY",
    deploymentFileEnv: "SEPOLIA_DEPLOYMENT_FILE",
    vaultAddressEnv: "SEPOLIA_VAULT_ADDRESS",
    vaultPausedEnv: "SEPOLIA_VAULT_PAUSED",
    depositAssetEnv: "SEPOLIA_DEPOSIT_ASSET",
    depositAmountEnv: "SEPOLIA_DEPOSIT_AMOUNT",
    depositRecipientEnv: "SEPOLIA_DEPOSIT_RECIPIENT",
    manifestLatestFile: "sepolia-latest.json",
    manifestPrefix: "sepolia",
    defaultOpnetNetwork: "testnet",
    deployMockTokens: true,
  },
  ethereum: {
    label: "Ethereum mainnet",
    chainId: 1n,
    envPrefix: "ETHEREUM",
    rpcEnv: "ETHEREUM_RPC_URL",
    deployerKeyEnv: "ETHEREUM_DEPLOYER_PRIVATE_KEY",
    depositorKeyEnv: "ETHEREUM_DEPOSITOR_PRIVATE_KEY",
    deploymentFileEnv: "ETHEREUM_DEPLOYMENT_FILE",
    vaultAddressEnv: "ETHEREUM_VAULT_ADDRESS",
    vaultPausedEnv: "ETHEREUM_VAULT_PAUSED",
    depositAssetEnv: "ETHEREUM_DEPOSIT_ASSET",
    depositAmountEnv: "ETHEREUM_DEPOSIT_AMOUNT",
    depositRecipientEnv: "ETHEREUM_DEPOSIT_RECIPIENT",
    manifestLatestFile: "ethereum-latest.json",
    manifestPrefix: "ethereum",
    defaultOpnetNetwork: "mainnet",
    deployMockTokens: false,
  },
};

export function getEnv(...names) {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) return value.trim();
  }
  return "";
}

export function requireEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value.trim();
}

export function resolveEthereumNetworkName(argv = process.argv) {
  const explicit = getEnv("ETHEREUM_NETWORK", "OPBRIDGE_ETHEREUM_NETWORK").toLowerCase();
  if (explicit) {
    if (!ETHEREUM_NETWORKS[explicit]) {
      throw new Error(`Unsupported ETHEREUM_NETWORK=${explicit}. Expected one of: ${Object.keys(ETHEREUM_NETWORKS).join(", ")}`);
    }
    return explicit;
  }
  return argv.some((entry) => entry === "--ethereum-mainnet" || entry === "--mainnet") ? "ethereum" : "sepolia";
}

export function getEthereumNetworkConfig(argv = process.argv) {
  return ETHEREUM_NETWORKS[resolveEthereumNetworkName(argv)];
}

export function getDeploymentPath(projectRoot, networkConfig) {
  return (
    getEnv("ETHEREUM_DEPLOYMENT_FILE", networkConfig.deploymentFileEnv) ||
    path.join(projectRoot, "deployments", networkConfig.manifestLatestFile)
  );
}

export function getRpcUrl(networkConfig) {
  return getEnv("ETHEREUM_RPC_URL", networkConfig.rpcEnv) || requireEnv(networkConfig.rpcEnv);
}

export function getDeployerPrivateKey(networkConfig) {
  return (
    getEnv("ETHEREUM_DEPLOYER_PRIVATE_KEY", networkConfig.deployerKeyEnv) ||
    requireEnv(networkConfig.deployerKeyEnv)
  );
}

export function getDepositorPrivateKey(networkConfig) {
  return (
    getEnv("ETHEREUM_DEPOSITOR_PRIVATE_KEY", networkConfig.depositorKeyEnv) ||
    getEnv("ETHEREUM_DEPLOYER_PRIVATE_KEY", networkConfig.deployerKeyEnv)
  );
}

export function assertExpectedChainId(chainId, networkConfig) {
  if (chainId !== networkConfig.chainId) {
    throw new Error(
      `Expected ${networkConfig.label} (${networkConfig.chainId.toString()}), got chainId=${chainId.toString()}`,
    );
  }
}
