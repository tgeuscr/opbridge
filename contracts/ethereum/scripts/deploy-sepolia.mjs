import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { ethers } from "ethers";
import { compileContracts, getCompiledContract } from "./lib/compile.mjs";

const DEFAULT_TOKENS = [
  { assetId: 0, symbol: "USDT", name: "Heptad Test USDT", decimals: 6 },
  { assetId: 1, symbol: "WBTC", name: "Heptad Test WBTC", decimals: 8 },
  { assetId: 2, symbol: "WETH", name: "Heptad Test Wrapped ETH", decimals: 18 },
  { assetId: 3, symbol: "PAXG", name: "Heptad Test PAXG", decimals: 18 },
];

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value.trim();
}

function parseMintAmount(raw, decimals) {
  return ethers.parseUnits(raw, decimals);
}

async function main() {
  const projectRoot = process.cwd();
  const rpcUrl = requireEnv("SEPOLIA_RPC_URL");
  const privateKey = requireEnv("SEPOLIA_DEPLOYER_PRIVATE_KEY");
  const initialOwner = process.env.ETH_VAULT_OWNER?.trim() || "";
  const ownerAddress = initialOwner || new ethers.Wallet(privateKey).address;
  const feeRecipientRaw = process.env.ETH_VAULT_FEE_RECIPIENT?.trim() || "";
  const feeRecipientAddress = feeRecipientRaw || ownerAddress;
  const mintPerTokenRaw = process.env.SEPOLIA_TEST_MINT_PER_TOKEN || "1000000";
  const outputDir = path.join(projectRoot, "deployments");

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  const network = await provider.getNetwork();
  if (network.chainId !== 11155111n) {
    throw new Error(`Expected Sepolia (11155111), got chainId=${network.chainId.toString()}`);
  }

  const { output, errors, fatal } = compileContracts(projectRoot);
  for (const entry of errors) {
    const prefix = entry.severity === "error" ? "ERROR" : "WARN";
    console.log(`[${prefix}] ${entry.formattedMessage.trim()}`);
  }
  if (fatal.length > 0) {
    throw new Error(`Compilation failed with ${fatal.length} error(s).`);
  }

  const tokenCompiled = getCompiledContract(output, "HeptadTestToken.sol", "HeptadTestToken");
  const vaultCompiled = getCompiledContract(output, "HeptadVault.sol", "HeptadVault");

  const tokenFactory = new ethers.ContractFactory(
    tokenCompiled.abi,
    tokenCompiled.evm.bytecode.object,
    signer,
  );
  const vaultFactory = new ethers.ContractFactory(
    vaultCompiled.abi,
    vaultCompiled.evm.bytecode.object,
    signer,
  );

  console.log(`Deploying with deployer=${signer.address} owner=${ownerAddress} feeRecipient=${feeRecipientAddress}`);

  const deployedTokens = [];
  for (const token of DEFAULT_TOKENS) {
    const instance = await tokenFactory.deploy(token.name, token.symbol, token.decimals, ownerAddress);
    await instance.waitForDeployment();
    const tokenAddress = await instance.getAddress();
    console.log(`Token deployed ${token.symbol} -> ${tokenAddress}`);

    if (ownerAddress.toLowerCase() === signer.address.toLowerCase()) {
      const mintAmount = parseMintAmount(mintPerTokenRaw, token.decimals);
      const mintTx = await instance.mint(ownerAddress, mintAmount);
      await mintTx.wait();
      console.log(`Minted ${mintPerTokenRaw} ${token.symbol} to ${ownerAddress}`);
    } else {
      console.log(`Skipped mint for ${token.symbol} (owner != deployer)`);
    }

    deployedTokens.push({
      ...token,
      tokenAddress,
      mintPerTokenRaw,
    });
  }

  const vault = await vaultFactory.deploy(ownerAddress);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log(`Vault deployed -> ${vaultAddress}`);

  if (ownerAddress.toLowerCase() === signer.address.toLowerCase()) {
    if (feeRecipientAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
      const feeTx = await vault.setFeeRecipient(feeRecipientAddress);
      await feeTx.wait();
      console.log(`Configured vault feeRecipient=${feeRecipientAddress}`);
    }
    for (const token of deployedTokens) {
      const tx = await vault.configureAsset(token.assetId, token.tokenAddress, true);
      await tx.wait();
      console.log(`Configured vault assetId=${token.assetId} token=${token.tokenAddress}`);
    }
  } else {
    console.log("Skipped vault config calls (owner != deployer): setFeeRecipient/configureAsset");
  }

  fs.mkdirSync(outputDir, { recursive: true });
  const timestamp = new Date().toISOString().replaceAll(":", "-");
  const deployment = {
    network: "sepolia",
    chainId: Number(network.chainId),
    deployedAt: new Date().toISOString(),
    deployer: signer.address,
    owner: ownerAddress,
    feeRecipient: feeRecipientAddress,
    vaultAddress,
    assets: deployedTokens.map((token) => ({
      assetId: token.assetId,
      symbol: token.symbol,
      decimals: token.decimals,
      tokenAddress: token.tokenAddress,
    })),
    opnet: {
      network: "regtest",
      bridgeAddress: process.env.OPNET_BRIDGE_ADDRESS || "",
      wrappedTokens: {
        USDT: process.env.OPNET_HUSDT_ADDRESS || "",
        WBTC: process.env.OPNET_HWBTC_ADDRESS || "",
        WETH: process.env.OPNET_HETH_ADDRESS || "",
        PAXG: process.env.OPNET_HPAXG_ADDRESS || "",
      },
    },
  };

  const datedPath = path.join(outputDir, `sepolia-${timestamp}.json`);
  const latestPath = path.join(outputDir, "sepolia-latest.json");
  fs.writeFileSync(datedPath, JSON.stringify(deployment, null, 2));
  fs.writeFileSync(latestPath, JSON.stringify(deployment, null, 2));
  console.log(`Deployment artifacts written:\n- ${datedPath}\n- ${latestPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
