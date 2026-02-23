import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { ethers } from "ethers";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../../..");
const DEFAULT_CANDIDATES_FILE = path.resolve(REPO_ROOT, "services/relayer/.data/release-submission-candidates.json");
const DEFAULT_DEPLOYMENT_FILE = path.resolve(REPO_ROOT, "contracts/ethereum/deployments/sepolia-latest.json");

const VAULT_RELEASE_ABI = [
  "function releaseWithRelaySignatures(uint8 assetId, bytes32 opnetUser, address recipient, uint256 amount, uint256 withdrawalId, uint8 attestationVersion, bytes relayIndexesPacked, bytes relaySignaturesPacked) external",
  "function computeReleaseAttestationHash(uint8 assetId, bytes32 opnetUser, address ethereumRecipient, uint256 amount, uint256 withdrawalId, uint8 attestationVersion) view returns (bytes32)",
];

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value.trim();
}

function selectCandidate(parsed) {
  const candidates = Array.isArray(parsed.candidates) ? parsed.candidates : [];
  const ready = candidates.filter((entry) => entry.ready && entry.releaseSubmission);
  if (ready.length === 0) {
    throw new Error("No ready release candidate found.");
  }

  const byHash = process.env.RELEASE_CANDIDATE_PAYLOAD_HASH?.trim().toLowerCase();
  if (byHash) {
    const found = ready.find((entry) => String(entry.payloadHashHex ?? "").toLowerCase() === byHash);
    if (!found) throw new Error(`No ready release candidate for payload hash: ${byHash}`);
    return found;
  }

  const byWithdrawalId = process.env.RELEASE_CANDIDATE_WITHDRAWAL_ID?.trim();
  if (byWithdrawalId) {
    const found = ready.find(
      (entry) => String(entry?.releaseSubmission?.withdrawalId ?? "") === String(byWithdrawalId),
    );
    if (!found) throw new Error(`No ready release candidate for withdrawalId=${byWithdrawalId}`);
    return found;
  }

  return ready[0];
}

function loadVaultAddress(candidateMessage) {
  const fromEnv = process.env.SEPOLIA_VAULT_ADDRESS?.trim();
  if (fromEnv) return fromEnv;
  const fromCandidate = String(candidateMessage?.ethereumVault ?? "").trim();
  if (/^0x[0-9a-fA-F]{40}$/.test(fromCandidate)) return fromCandidate;
  if (/^0x[0-9a-fA-F]{64}$/.test(fromCandidate)) {
    return `0x${fromCandidate.slice(-40)}`;
  }
  const deploymentFile = process.env.SEPOLIA_DEPLOYMENT_FILE?.trim() || DEFAULT_DEPLOYMENT_FILE;
  if (fs.existsSync(deploymentFile)) {
    const parsed = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
    if (parsed?.vaultAddress) return String(parsed.vaultAddress);
  }
  throw new Error("Vault address not found. Set SEPOLIA_VAULT_ADDRESS or provide a deployment file.");
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`Submit Ethereum Release Candidate

Required:
  SEPOLIA_RPC_URL
  SEPOLIA_SUBMITTER_PRIVATE_KEY (or SEPOLIA_DEPLOYER_PRIVATE_KEY fallback)

Optional:
  RELEASE_CANDIDATES_FILE (default: ${DEFAULT_CANDIDATES_FILE})
  RELEASE_CANDIDATE_PAYLOAD_HASH
  RELEASE_CANDIDATE_WITHDRAWAL_ID
  SEPOLIA_VAULT_ADDRESS (fallback if candidate/deployment file unavailable)
  SEPOLIA_DEPLOYMENT_FILE (default: ${DEFAULT_DEPLOYMENT_FILE})
`);
    return;
  }

  const rpcUrl = requireEnv("SEPOLIA_RPC_URL");
  const privateKey =
    process.env.SEPOLIA_SUBMITTER_PRIVATE_KEY?.trim() ||
    process.env.SEPOLIA_DEPOSITOR_PRIVATE_KEY?.trim() ||
    process.env.SEPOLIA_DEPLOYER_PRIVATE_KEY?.trim();
  if (!privateKey) {
    throw new Error(
      "Missing required env var: SEPOLIA_SUBMITTER_PRIVATE_KEY (or SEPOLIA_DEPOSITOR_PRIVATE_KEY / SEPOLIA_DEPLOYER_PRIVATE_KEY)",
    );
  }

  const candidatesFile = process.env.RELEASE_CANDIDATES_FILE?.trim() || DEFAULT_CANDIDATES_FILE;
  if (!fs.existsSync(candidatesFile)) {
    throw new Error(`Candidates file not found: ${candidatesFile}`);
  }
  const parsed = JSON.parse(fs.readFileSync(candidatesFile, "utf8"));
  const selected = selectCandidate(parsed);
  const submission = selected.releaseSubmission;
  const vaultAddress = loadVaultAddress(selected.message);

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  const network = await provider.getNetwork();
  if (network.chainId !== 11155111n) {
    throw new Error(`Expected Sepolia (11155111), got chainId=${network.chainId.toString()}`);
  }

  const vault = new ethers.Contract(vaultAddress, VAULT_RELEASE_ABI, signer);
  const relayIndexesPacked = submission.relayIndexesPackedHex;
  const relaySignaturesPacked = submission.relaySignaturesPackedHex;

  const computedHash = await vault.computeReleaseAttestationHash(
    Number(submission.assetId),
    submission.opnetUser,
    submission.recipient,
    BigInt(submission.amount),
    BigInt(submission.withdrawalId),
    Number(submission.attestationVersion),
  );
  if (String(computedHash).toLowerCase() !== String(selected.payloadHashHex).toLowerCase()) {
    throw new Error(
      `Candidate payload hash mismatch: candidate=${selected.payloadHashHex} contractComputed=${computedHash}`,
    );
  }

  console.log(
    `Submitting release candidate payloadHash=${selected.payloadHashHex} withdrawalId=${submission.withdrawalId} asset=${submission.assetId}`,
  );

  await vault.releaseWithRelaySignatures.staticCall(
    Number(submission.assetId),
    submission.opnetUser,
    submission.recipient,
    BigInt(submission.amount),
    BigInt(submission.withdrawalId),
    Number(submission.attestationVersion),
    relayIndexesPacked,
    relaySignaturesPacked,
  );

  const tx = await vault.releaseWithRelaySignatures(
    Number(submission.assetId),
    submission.opnetUser,
    submission.recipient,
    BigInt(submission.amount),
    BigInt(submission.withdrawalId),
    Number(submission.attestationVersion),
    relayIndexesPacked,
    relaySignaturesPacked,
  );
  const receipt = await tx.wait();

  console.log(
    JSON.stringify(
      {
        action: "ethereum/release/submit-candidate",
        candidatePayloadHash: selected.payloadHashHex,
        vaultAddress,
        network: "sepolia",
        txHash: tx.hash,
        blockNumber: receipt?.blockNumber ?? null,
        releaseSubmission: submission,
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
