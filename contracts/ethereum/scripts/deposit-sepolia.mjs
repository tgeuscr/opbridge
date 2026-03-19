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

function parseBytes32Recipient(raw) {
  const value = raw.trim();
  const normalized = value.startsWith("0x") ? value : `0x${value}`;
  if (!/^0x[0-9a-fA-F]{64}$/.test(normalized)) {
    throw new Error("ETHEREUM_DEPOSIT_RECIPIENT must be a bytes32 hex value (0x + 64 hex chars).");
  }
  return normalized.toLowerCase();
}

function parseAssetSelector(raw) {
  const value = raw.trim().toUpperCase();
  if (!value) {
    throw new Error("ETHEREUM_DEPOSIT_ASSET is required (assetId or symbol).");
  }
  return value;
}

function resolveAsset(assets, selector) {
  if (/^\d+$/.test(selector)) {
    const assetId = Number(selector);
    const byId = assets.find((entry) => Number(entry.assetId) === assetId);
    if (!byId) {
      throw new Error(`Asset with assetId=${assetId} not found in deployment.`);
    }
    return byId;
  }

  const bySymbol = assets.find((entry) => String(entry.symbol || "").toUpperCase() === selector);
  if (!bySymbol) {
    throw new Error(`Asset with symbol=${selector} not found in deployment.`);
  }
  return bySymbol;
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`Sepolia Approve + Deposit Script

Required:
  ETHEREUM_RPC_URL (or SEPOLIA_RPC_URL fallback)
  ETHEREUM_DEPOSITOR_PRIVATE_KEY (or fallback: ETHEREUM_DEPLOYER_PRIVATE_KEY)
  ETHEREUM_DEPOSIT_ASSET (symbol or assetId, e.g. USDT or 0)
  ETHEREUM_DEPOSIT_AMOUNT (human units, e.g. 10.5)
  ETHEREUM_DEPOSIT_RECIPIENT (bytes32, OPNet recipient / hashed MLDSA key)

Optional:
  ETHEREUM_DEPLOYMENT_FILE (default: contracts/ethereum/deployments/sepolia-latest.json)

Example:
  ETHEREUM_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<KEY> \\
  ETHEREUM_DEPOSITOR_PRIVATE_KEY=0x... \\
  ETHEREUM_DEPOSIT_ASSET=USDT \\
  ETHEREUM_DEPOSIT_AMOUNT=25 \\
  ETHEREUM_DEPOSIT_RECIPIENT=0x<64-hex> \\
  npm run deposit:ethereum --workspace @opbridge/ethereum-contracts
`);
    return;
  }

  const projectRoot = process.cwd();
  const deploymentPath =
    getEnv("ETHEREUM_DEPLOYMENT_FILE", "SEPOLIA_DEPLOYMENT_FILE") ||
    path.join(projectRoot, "deployments", "sepolia-latest.json");
  const rpcUrl = getEnv("ETHEREUM_RPC_URL", "SEPOLIA_RPC_URL") || requireEnv("SEPOLIA_RPC_URL");
  const privateKey =
    getEnv("ETHEREUM_DEPOSITOR_PRIVATE_KEY", "SEPOLIA_DEPOSITOR_PRIVATE_KEY") ||
    getEnv("ETHEREUM_DEPLOYER_PRIVATE_KEY", "SEPOLIA_DEPLOYER_PRIVATE_KEY");
  if (!privateKey) {
    throw new Error("Missing required env var: ETHEREUM_DEPOSITOR_PRIVATE_KEY (or ETHEREUM_DEPLOYER_PRIVATE_KEY)");
  }
  const assetSelector = parseAssetSelector(getEnv("ETHEREUM_DEPOSIT_ASSET", "SEPOLIA_DEPOSIT_ASSET") || requireEnv("SEPOLIA_DEPOSIT_ASSET"));
  const amountHuman = getEnv("ETHEREUM_DEPOSIT_AMOUNT", "SEPOLIA_DEPOSIT_AMOUNT") || requireEnv("SEPOLIA_DEPOSIT_AMOUNT");
  const recipient = parseBytes32Recipient(getEnv("ETHEREUM_DEPOSIT_RECIPIENT", "SEPOLIA_DEPOSIT_RECIPIENT") || requireEnv("SEPOLIA_DEPOSIT_RECIPIENT"));

  if (!fs.existsSync(deploymentPath)) {
    throw new Error(`Deployment file not found: ${deploymentPath}`);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  if (!Array.isArray(deployment.assets) || deployment.assets.length === 0) {
    throw new Error("Deployment JSON missing assets array.");
  }
  if (!deployment.vaultAddress) {
    throw new Error("Deployment JSON missing vaultAddress.");
  }

  const asset = resolveAsset(deployment.assets, assetSelector);
  const assetId = Number(asset.assetId);
  const tokenAddress = String(asset.tokenAddress);
  const decimals = Number(asset.decimals);
  const symbol = String(asset.symbol);
  if (!Number.isInteger(assetId) || assetId < 0 || assetId > 255) {
    throw new Error(`Invalid assetId in deployment: ${assetId}`);
  }
  if (!/^0x[0-9a-fA-F]{40}$/.test(tokenAddress)) {
    throw new Error(`Invalid tokenAddress for ${symbol}: ${tokenAddress}`);
  }
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 255) {
    throw new Error(`Invalid decimals for ${symbol}: ${decimals}`);
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  const chainId = (await provider.getNetwork()).chainId;
  if (chainId !== 11155111n) {
    throw new Error(`Expected Sepolia (11155111), got chainId=${chainId.toString()}`);
  }

  const tokenAbi = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function balanceOf(address owner) external view returns (uint256)",
  ];
  const vaultAbi = [
    "function depositERC20(uint8 assetId, uint256 amount, bytes32 opnetRecipient) external returns (uint256)",
  ];

  const token = new ethers.Contract(tokenAddress, tokenAbi, signer);
  const vault = new ethers.Contract(String(deployment.vaultAddress), vaultAbi, signer);
  const amountRaw = ethers.parseUnits(amountHuman, decimals);
  if (amountRaw <= 0n) {
    throw new Error("Deposit amount must be > 0.");
  }

  const [balanceBefore, allowanceBefore] = await Promise.all([
    token.balanceOf(signer.address),
    token.allowance(signer.address, String(deployment.vaultAddress)),
  ]);
  if (balanceBefore < amountRaw) {
    throw new Error(
      `Insufficient ${symbol} balance: have=${ethers.formatUnits(balanceBefore, decimals)} need=${amountHuman}`,
    );
  }

  console.log(`Depositor: ${signer.address}`);
  console.log(`Vault: ${deployment.vaultAddress}`);
  console.log(`Asset: ${symbol} (assetId=${assetId}, decimals=${decimals})`);
  console.log(`Amount: ${amountHuman} (${amountRaw.toString()} raw)`);
  console.log(`Recipient: ${recipient}`);

  if (allowanceBefore < amountRaw) {
    console.log(`Approving ${symbol}...`);
    const approveTx = await token.approve(String(deployment.vaultAddress), amountRaw);
    const approveReceipt = await approveTx.wait();
    console.log(`Approve tx: ${approveTx.hash} block=${approveReceipt?.blockNumber ?? "?"}`);
  } else {
    console.log("Skipping approve (existing allowance is sufficient).");
  }

  console.log("Submitting deposit...");
  const depositTx = await vault.depositERC20(assetId, amountRaw, recipient);
  const depositReceipt = await depositTx.wait();

  const [balanceAfter, allowanceAfter] = await Promise.all([
    token.balanceOf(signer.address),
    token.allowance(signer.address, String(deployment.vaultAddress)),
  ]);

  console.log(
    JSON.stringify(
      {
        action: "ethereum/deposit/terminal",
        network: "sepolia",
        deploymentFile: deploymentPath,
        wallet: signer.address,
        vaultAddress: String(deployment.vaultAddress),
        tokenAddress,
        assetId,
        symbol,
        decimals,
        amountHuman,
        amountRaw: amountRaw.toString(),
        recipient,
        depositTxHash: depositTx.hash,
        depositBlockNumber: depositReceipt?.blockNumber ?? null,
        balanceBefore: balanceBefore.toString(),
        balanceAfter: balanceAfter.toString(),
        allowanceBefore: allowanceBefore.toString(),
        allowanceAfter: allowanceAfter.toString(),
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
