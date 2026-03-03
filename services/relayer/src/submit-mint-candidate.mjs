import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { networks } from "@btc-vision/bitcoin";
import { Address, Mnemonic, Wallet } from "@btc-vision/transaction";
import { ABIDataTypes, BitcoinAbiTypes, getContract } from "opnet";
import { createOpnetJsonRpcProvider, describeOpnetRpcTransport } from "./opnet-rpc-provider.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../../..");
const DEFAULT_CANDIDATES_FILE = path.resolve(REPO_ROOT, "services/relayer/.data/mint-submission-candidates.json");
const DEFAULT_OPNET_RPC_URL = "https://regtest.opnet.org";
const TESTNET_OPNET_RPC_URL = "https://testnet.opnet.org";

const BRIDGE_MINT_ABI = [
  {
    name: "computeMintAttestationHash",
    inputs: [
      { name: "asset", type: ABIDataTypes.UINT8 },
      { name: "ethereumUser", type: ABIDataTypes.ADDRESS },
      { name: "recipient", type: ABIDataTypes.ADDRESS },
      { name: "amount", type: ABIDataTypes.UINT256 },
      { name: "depositId", type: ABIDataTypes.UINT256 },
      { name: "attestationVersion", type: ABIDataTypes.UINT8 },
    ],
    outputs: [{ name: "messageHash", type: ABIDataTypes.BYTES32 }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: "mintWithRelaySignatures",
    inputs: [
      { name: "asset", type: ABIDataTypes.UINT8 },
      { name: "ethereumUser", type: ABIDataTypes.ADDRESS },
      { name: "recipient", type: ABIDataTypes.ADDRESS },
      { name: "amount", type: ABIDataTypes.UINT256 },
      { name: "depositId", type: ABIDataTypes.UINT256 },
      { name: "attestationVersion", type: ABIDataTypes.UINT8 },
      { name: "relayIndexesPacked", type: ABIDataTypes.BYTES },
      { name: "relaySignaturesPacked", type: ABIDataTypes.BYTES },
    ],
    outputs: [],
    type: BitcoinAbiTypes.Function,
  },
];

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value.trim();
}

function hexToBytes(raw) {
  const value = String(raw ?? "").trim().toLowerCase();
  if (!value) throw new Error("Hex string is required.");
  const normalized = value.startsWith("0x") ? value.slice(2) : value;
  if (!/^[0-9a-f]+$/.test(normalized) || normalized.length % 2 !== 0) {
    throw new Error(`Invalid hex string: ${raw}`);
  }
  const bytes = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes) {
  return `0x${Array.from(bytes)
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

function hex32ToBigInt(raw, fieldName) {
  const bytes = hexToBytes(String(raw ?? "").trim());
  if (bytes.length !== 32) {
    throw new Error(`${fieldName} must be 32 bytes, got ${bytes.length}.`);
  }
  return BigInt(bytesToHex(bytes));
}

function leftPadTo32(bytes, fieldName) {
  if (bytes.length > 32) {
    throw new Error(`${fieldName} exceeds 32 bytes.`);
  }
  if (bytes.length === 32) return bytes;
  const out = new Uint8Array(32);
  out.set(bytes, 32 - bytes.length);
  return out;
}

function normalizeNetworkName(name) {
  return String(name || "regtest").trim().toLowerCase();
}

function resolveNetwork(name) {
  const normalized = normalizeNetworkName(name);
  if (normalized === "testnet") return networks.opnetTestnet;
  if (normalized === "regtest") return networks.regtest;
  if (normalized === "mainnet") return networks.bitcoin;
  throw new Error(`Unsupported OPNET_NETWORK=${name}. Expected testnet, regtest, or mainnet.`);
}

function defaultOpnetRpcUrlForNetwork(name) {
  return normalizeNetworkName(name) === "testnet" ? TESTNET_OPNET_RPC_URL : DEFAULT_OPNET_RPC_URL;
}

function parseEthereumUserForBridgeAbi(raw) {
  const bytes = hexToBytes(String(raw ?? "").trim());
  if (bytes.length !== 20 && bytes.length !== 32) {
    throw new Error(`mintSubmission.ethereumUser must be 20 or 32 bytes, got ${bytes.length}.`);
  }
  const hashHex = bytesToHex(leftPadTo32(bytes, "ethereumUser"));
  return Address.fromBigInt(BigInt(hashHex));
}

function isLikelyHex(value) {
  const raw = String(value ?? "").trim();
  const normalized = raw.startsWith("0x") ? raw.slice(2) : raw;
  return normalized.length > 0 && /^[0-9a-fA-F]+$/.test(normalized) && normalized.length % 2 === 0;
}

function normalizeHex(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  return raw.startsWith("0x") ? raw.toLowerCase() : `0x${raw.toLowerCase()}`;
}

async function parseRecipientForBridgeAbi(rawRecipient, provider, recipientAddressHint) {
  const recipientHex = normalizeHex(rawRecipient);
  const recipientValue = hex32ToBigInt(recipientHex, "mintSubmission.recipient");

  const tryBuildAddressFromRawInfo = (info, sourceLabel) => {
    if (!info || typeof info !== "object" || Object.hasOwn(info, "error")) return null;
    const tweakedPubkey = normalizeHex(info.tweakedPubkey);
    const mldsaHashedPublicKey = normalizeHex(info.mldsaHashedPublicKey);
    if (!isLikelyHex(tweakedPubkey) || !isLikelyHex(mldsaHashedPublicKey)) return null;

    const tweakedValue = hex32ToBigInt(tweakedPubkey, `${sourceLabel}.tweakedPubkey`);
    const mldsaHashValue = hex32ToBigInt(mldsaHashedPublicKey, `${sourceLabel}.mldsaHashedPublicKey`);

    if (mldsaHashedPublicKey !== recipientHex) {
      throw new Error(
        [
          "Resolved OPNet recipient does not match attested recipient hash.",
          `source=${sourceLabel}`,
          `resolved=${mldsaHashedPublicKey}`,
          `attested=${recipientHex}`,
        ].join(" "),
      );
    }

    return Address.fromBigInt(mldsaHashValue, tweakedValue);
  };

  const addressHint = String(recipientAddressHint ?? "").trim();
  if (addressHint) {
    let primaryError = null;
    if (typeof provider?.getPublicKeyInfo === "function") {
      try {
        const resolved = await provider.getPublicKeyInfo(addressHint, false);
        const resolvedHex = normalizeHex(typeof resolved?.toHex === "function" ? resolved.toHex() : "");
        if (!resolvedHex) {
          throw new Error("RPC returned recipient object without toHex().");
        }
        if (resolvedHex !== recipientHex) {
          throw new Error(
            [
              "Resolved OPNet recipient does not match attested recipient hash.",
              `hint=${addressHint}`,
              `resolved=${resolvedHex}`,
              `attested=${recipientHex}`,
            ].join(" "),
          );
        }
        return resolved;
      } catch (error) {
        primaryError = error;
      }
    }

    // Some testnet RPC nodes cannot resolve op.../p2tr via getPublicKeyInfo but do return
    // raw key material via getPublicKeysInfoRaw. Build the Address object manually from that.
    if (typeof provider?.getPublicKeysInfoRaw === "function") {
      try {
        const rpcInfoMap = await provider.getPublicKeysInfoRaw([addressHint]);
        const infos = [];
        if (rpcInfoMap && typeof rpcInfoMap === "object") {
          if (Object.hasOwn(rpcInfoMap, addressHint)) infos.push(rpcInfoMap[addressHint]);
          infos.push(...Object.values(rpcInfoMap));
        }
        for (const info of infos) {
          try {
            const built = tryBuildAddressFromRawInfo(info, `getPublicKeysInfoRaw(${addressHint})`);
            if (built) return built;
          } catch (error) {
            throw error;
          }
        }
      } catch (error) {
        const primaryMessage = primaryError instanceof Error ? primaryError.message : String(primaryError ?? "");
        throw new Error(
          `Failed to resolve MINT_RECIPIENT_OPNET_ADDRESS=${addressHint}: ${error instanceof Error ? error.message : String(error)}${primaryMessage ? ` (getPublicKeyInfo fallback error: ${primaryMessage})` : ""}`,
        );
      }
    }

    throw new Error(
      `Failed to resolve MINT_RECIPIENT_OPNET_ADDRESS=${addressHint}: ${primaryError instanceof Error ? primaryError.message : String(primaryError ?? "No supported RPC resolver available.")}`,
    );
  }

  // Contract runtime expects a valid Schnorr/tweaked key on the recipient Address.
  // Try to resolve the full address metadata from OPNet RPC and pass both the
  // hashed-id word and tweaked x-only pubkey word when available.
  if (typeof provider?.getPublicKeysInfoRaw === "function") {
    try {
      const rpcInfoMap = await provider.getPublicKeysInfoRaw([recipientHex]);
      const infos = [];
      if (rpcInfoMap && typeof rpcInfoMap === "object") {
        if (Object.hasOwn(rpcInfoMap, recipientHex)) infos.push(rpcInfoMap[recipientHex]);
        if (Object.hasOwn(rpcInfoMap, rawRecipient)) infos.push(rpcInfoMap[rawRecipient]);
        infos.push(...Object.values(rpcInfoMap));
      }

      for (const info of infos) {
        try {
          const built = tryBuildAddressFromRawInfo(info, "recipientRawLookup");
          if (built) return built;
        } catch {
          // Try next candidate/info.
        }
      }
    } catch {
      // Fallback below handles direct x-only inputs.
    }
  }

  // If the deposit recipient is already the tweaked x-only pubkey word, populate
  // both slots to satisfy Schnorr validation in contract runtime.
  return Address.fromBigInt(recipientValue, recipientValue);
}

function selectCandidate(parsed) {
  const candidates = Array.isArray(parsed.candidates) ? parsed.candidates : [];
  const readyCandidates = candidates.filter((entry) => entry.ready);
  if (readyCandidates.length === 0) {
    throw new Error("No ready candidate found in candidates file.");
  }

  const byHash = process.env.MINT_CANDIDATE_PAYLOAD_HASH?.trim().toLowerCase();
  if (byHash) {
    const found = readyCandidates.find((entry) => String(entry.payloadHashHex ?? "").toLowerCase() === byHash);
    if (!found) {
      throw new Error(`No ready candidate found for payload hash: ${byHash}`);
    }
    return found;
  }

  const byNonceRaw = process.env.MINT_CANDIDATE_NONCE?.trim();
  if (byNonceRaw) {
    if (!/^\d+$/.test(byNonceRaw)) {
      throw new Error("MINT_CANDIDATE_NONCE must be a non-negative integer.");
    }
    const found = readyCandidates.find((entry) => String(entry?.mintSubmission?.nonce ?? "") === byNonceRaw);
    if (!found) {
      throw new Error(`No ready candidate found for nonce=${byNonceRaw}`);
    }
    return found;
  }

  return readyCandidates[0];
}

function parseBooleanEnv(raw, defaultValue = false) {
  if (typeof raw === "undefined") return defaultValue;
  const value = String(raw).trim().toLowerCase();
  if (value === "1" || value === "true" || value === "yes" || value === "y") return true;
  if (value === "0" || value === "false" || value === "no" || value === "n") return false;
  throw new Error(`Invalid boolean env value: ${raw}`);
}

function normalizeBytes32Hex(raw, fieldName) {
  const bytes = hexToBytes(String(raw ?? "").trim());
  if (bytes.length !== 32) {
    throw new Error(`${fieldName} must be 32 bytes, got ${bytes.length}.`);
  }
  return bytesToHex(bytes).toLowerCase();
}

function buildWalletFromEnv(opnetNetwork) {
  const mnemonicPhrase = process.env.OPNET_WALLET_MNEMONIC?.trim();
  if (mnemonicPhrase) {
    const passphrase = process.env.OPNET_WALLET_MNEMONIC_PASSPHRASE?.trim() || "";
    const index = Number(process.env.OPNET_WALLET_INDEX?.trim() || "0");
    const account = Number(process.env.OPNET_WALLET_ACCOUNT?.trim() || "0");
    const isChange = parseBooleanEnv(process.env.OPNET_WALLET_IS_CHANGE, false);
    if (!Number.isInteger(index) || index < 0) {
      throw new Error("OPNET_WALLET_INDEX must be a non-negative integer.");
    }
    if (!Number.isInteger(account) || account < 0) {
      throw new Error("OPNET_WALLET_ACCOUNT must be a non-negative integer.");
    }
    const mnemonic = new Mnemonic(mnemonicPhrase, passphrase, opnetNetwork);
    const wallet = mnemonic.deriveOPWallet(undefined, index, account, isChange);
    return {
      wallet,
      walletSource: "mnemonic",
      walletMeta: { index, account, isChange },
    };
  }

  const classicalPrivateKey = requireEnv("OPNET_WALLET_PRIVATE_KEY");
  const quantumPrivateKey = requireEnv("OPNET_WALLET_QUANTUM_PRIVATE_KEY");
  return {
    wallet: Wallet.fromPrivateKeys(classicalPrivateKey, quantumPrivateKey, opnetNetwork),
    walletSource: "private-keys",
    walletMeta: null,
  };
}

function wantsPreflightOnly() {
  return process.argv.includes("--preflight") || process.env.MINT_SUBMIT_PREFLIGHT_ONLY === "1";
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`Submit OPNet Mint Candidate

Required:
  EITHER:
    OPNET_WALLET_MNEMONIC
  OR:
    OPNET_WALLET_PRIVATE_KEY (classical key: hex or WIF)
    OPNET_WALLET_QUANTUM_PRIVATE_KEY (MLDSA private key: hex/base58)

Optional:
  OPNET_WALLET_MNEMONIC_PASSPHRASE (default: '')
  OPNET_WALLET_INDEX (default: 0)
  OPNET_WALLET_ACCOUNT (default: 0)
  OPNET_WALLET_IS_CHANGE (default: false)
  MINT_CANDIDATES_FILE (default: ${DEFAULT_CANDIDATES_FILE})
  MINT_CANDIDATE_PAYLOAD_HASH (select specific ready candidate)
  MINT_CANDIDATE_NONCE (select specific ready candidate by nonce)
  OPNET_BRIDGE_ADDRESS (fallback if candidate message.opnetBridge missing)
  OPNET_RPC_URL (default: derived from OPNET_NETWORK; regtest=${DEFAULT_OPNET_RPC_URL}, testnet=${TESTNET_OPNET_RPC_URL})
  OPNET_NETWORK (default: regtest; allowed: testnet|regtest|mainnet)
  OPNET_MAX_SAT_SPEND (default: 20000)
  OPNET_FEE_RATE (default: 2)
  MINT_RECIPIENT_OPNET_ADDRESS (optional op.../bc1... recipient string; resolved via RPC and must match attested recipient hash)
  MINT_SUBMIT_PREFLIGHT_ONLY=1 (or pass --preflight) to validate recipient resolution and stop before simulation/tx send
`);
    return;
  }

  const candidatesFile = process.env.MINT_CANDIDATES_FILE?.trim() || DEFAULT_CANDIDATES_FILE;
  const opnetNetworkName = process.env.OPNET_NETWORK;
  const opnetNetwork = resolveNetwork(opnetNetworkName);
  const opnetRpcUrl = process.env.OPNET_RPC_URL?.trim() || defaultOpnetRpcUrlForNetwork(opnetNetworkName);
  const maxSatSpend = BigInt(process.env.OPNET_MAX_SAT_SPEND?.trim() || "20000");
  const feeRate = Number(process.env.OPNET_FEE_RATE?.trim() || "2");
  if (!Number.isFinite(feeRate) || feeRate <= 0) {
    throw new Error("OPNET_FEE_RATE must be a positive number.");
  }

  if (!fs.existsSync(candidatesFile)) {
    throw new Error(`Candidates file not found: ${candidatesFile}`);
  }
  const parsed = JSON.parse(fs.readFileSync(candidatesFile, "utf8"));
  const selected = selectCandidate(parsed);
  const mintSubmission = selected.mintSubmission;
  if (!mintSubmission) {
    throw new Error("Selected candidate missing mintSubmission.");
  }
  if (!mintSubmission.ethereumUser) {
    throw new Error("Selected candidate missing mintSubmission.ethereumUser.");
  }
  if (typeof mintSubmission.attestationVersion === "undefined") {
    throw new Error("Selected candidate missing mintSubmission.attestationVersion.");
  }

  const bridgeAddress =
    process.env.OPNET_BRIDGE_ADDRESS?.trim() ||
    selected?.message?.opnetBridge ||
    "";
  if (!bridgeAddress) {
    throw new Error("Bridge address is missing. Set OPNET_BRIDGE_ADDRESS or ensure candidate has message.opnetBridge.");
  }

  const provider = createOpnetJsonRpcProvider({ url: opnetRpcUrl, network: opnetNetwork });
  const recipientAddressHint = process.env.MINT_RECIPIENT_OPNET_ADDRESS?.trim() || "";

  const { wallet, walletSource, walletMeta } = buildWalletFromEnv(opnetNetwork);

  const bridge = getContract(bridgeAddress, BRIDGE_MINT_ABI, provider, opnetNetwork);
  if (typeof bridge?.setSender === "function") {
    bridge.setSender(wallet.address);
  }
  const recipient = await parseRecipientForBridgeAbi(mintSubmission.recipient, provider, recipientAddressHint);
  const ethereumUser = parseEthereumUserForBridgeAbi(mintSubmission.ethereumUser);
  const attestationVersion = Number(mintSubmission.attestationVersion);
  if (!Number.isInteger(attestationVersion) || attestationVersion < 0 || attestationVersion > 255) {
    throw new Error(`Invalid mintSubmission.attestationVersion=${mintSubmission.attestationVersion}`);
  }
  const relayIndexesPacked = hexToBytes(mintSubmission.relayIndexesPackedHex);
  const relaySignaturesPacked = hexToBytes(mintSubmission.relaySignaturesPackedHex);

  console.log(
    `Submitting mint candidate payloadHash=${selected.payloadHashHex} asset=${mintSubmission.assetId} nonce=${mintSubmission.nonce}`,
  );
  console.log(`OP_NET RPC transport: ${describeOpnetRpcTransport()} -> ${opnetRpcUrl}`);
  console.log(`Attested recipient (hashed MLDSA key): ${normalizeHex(mintSubmission.recipient)}`);
  if (recipientAddressHint) {
    console.log(`Recipient address hint (resolved via RPC): ${recipientAddressHint}`);
  }
  let recipientTweakedHex = null;
  let recipientP2tr = null;
  try {
    recipientTweakedHex = recipient.tweakedToHex();
  } catch (error) {
    throw new Error(
      `Recipient preflight failed while reading tweaked pubkey: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  try {
    if (typeof recipient.p2tr === "function") {
      recipientP2tr = recipient.p2tr(opnetNetwork);
    }
  } catch (error) {
    throw new Error(
      `Recipient preflight failed while deriving p2tr: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  console.log(
    JSON.stringify(
      {
        action: "opnet/mint/preflight",
        preflightOnly: wantsPreflightOnly(),
        candidatePayloadHash: selected.payloadHashHex,
        attestedRecipientHex: normalizeHex(mintSubmission.recipient),
        resolvedRecipientHex: recipient.toHex(),
        recipientTweakedHex,
        recipientP2tr,
      },
      null,
      2,
    ),
  );

  let computedHashHex = null;
  try {
    const hashResult = await bridge.computeMintAttestationHash(
      Number(mintSubmission.assetId),
      ethereumUser,
      recipient,
      BigInt(mintSubmission.amount),
      BigInt(mintSubmission.nonce),
      attestationVersion,
    );
    const hashBytes =
      hashResult && typeof hashResult === "object" && "obj" in hashResult
        ? hashResult.obj?.messageHash ?? hashResult.values?.[0]
        : hashResult;
    if (hashBytes instanceof Uint8Array) {
      computedHashHex = bytesToHex(hashBytes).toLowerCase();
    } else if (typeof hashBytes === "string") {
      computedHashHex = normalizeBytes32Hex(hashBytes, "computeMintAttestationHash.messageHash");
    } else {
      throw new Error(`Unexpected hash result type: ${typeof hashBytes}`);
    }
    const expectedPayloadHashHex = normalizeHex(selected.payloadHashHex);
    console.log(
      JSON.stringify(
        {
          action: "opnet/mint/hash-check",
          computedHashHex,
          expectedPayloadHashHex,
          match: computedHashHex === expectedPayloadHashHex,
        },
        null,
        2,
      ),
    );
  } catch (error) {
    throw new Error(
      `computeMintAttestationHash probe failed before mint call: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (wantsPreflightOnly()) {
    console.log("Preflight only mode enabled; skipping contract simulation and tx submission.");
    return;
  }

  const simulation = await bridge.mintWithRelaySignatures(
    Number(mintSubmission.assetId),
    ethereumUser,
    recipient,
    BigInt(mintSubmission.amount),
    BigInt(mintSubmission.nonce),
    attestationVersion,
    relayIndexesPacked,
    relaySignaturesPacked,
  );

  if (simulation.revert) {
    throw new Error(`Mint simulation revert: ${simulation.revert}`);
  }

  const receipt = await simulation.sendTransaction({
    signer: wallet.keypair,
    mldsaSigner: wallet.mldsaKeypair,
    refundTo: wallet.p2tr,
    maximumAllowedSatToSpend: maxSatSpend,
    feeRate,
    network: opnetNetwork,
  });

  console.log(
    JSON.stringify(
      {
        action: "opnet/mint/submit-candidate",
        candidatePayloadHash: selected.payloadHashHex,
        bridgeAddress,
        rpcUrl: opnetRpcUrl,
        rpcTransport: describeOpnetRpcTransport(),
        network: process.env.OPNET_NETWORK?.trim() || "regtest",
        walletSource,
        walletMeta,
        walletP2TR: wallet.p2tr,
        walletAddressHex: wallet.address.toHex(),
        mintSubmission,
        simulation: {
          revert: simulation.revert ?? null,
          estimatedGas: simulation.estimatedGas?.toString() ?? null,
          properties: simulation.properties ?? null,
        },
        receipt,
      },
      (_, value) => (typeof value === "bigint" ? value.toString() : value),
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
