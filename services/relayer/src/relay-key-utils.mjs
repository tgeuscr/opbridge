import { createHash } from "node:crypto";
import { Mnemonic, Address } from "@btc-vision/transaction";
import { networks } from "@btc-vision/bitcoin";
import { ethers } from "ethers";

export const MLDSA_PUBKEY_BYTES = 1312;

export function bytesToHex(bytes) {
  return `0x${Buffer.from(bytes).toString("hex")}`;
}

export function concatBytes(parts) {
  const total = parts.reduce((acc, part) => acc + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

export function requireMnemonicFromEnv() {
  const phrase = process.env.RELAYER_KEYS_MNEMONIC?.trim();
  if (!phrase) {
    throw new Error("Missing required env var: RELAYER_KEYS_MNEMONIC");
  }
  if (!Mnemonic.validate(phrase)) {
    throw new Error("RELAYER_KEYS_MNEMONIC is not a valid BIP39 mnemonic.");
  }
  return phrase;
}

export function resolveOPNetNetwork(name) {
  const normalized = String(name ?? "regtest").trim().toLowerCase();
  if (normalized === "regtest") return networks.regtest;
  if (normalized === "testnet") return networks.opnetTestnet;
  if (normalized === "mainnet") return networks.bitcoin;
  throw new Error(`Unsupported RELAYER_KEYS_OPNET_NETWORK=${name}. Expected regtest, testnet, or mainnet.`);
}

export function parseIntEnv(name, defaultValue, min = 0) {
  const raw = process.env[name]?.trim();
  if (!raw) return defaultValue;
  if (!/^\d+$/.test(raw)) {
    throw new Error(`${name} must be a non-negative integer.`);
  }
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min) {
    throw new Error(`${name} must be >= ${min}.`);
  }
  return value;
}

export function buildEvmWalletFromMnemonic(phrase, passphrase, account, index) {
  const path = `m/44'/60'/${account}'/0/${index}`;
  const wallet = ethers.HDNodeWallet.fromPhrase(phrase, passphrase, path);
  return { path, wallet };
}

export function deriveRelayKeys({ phrase, passphrase, count, startIndex, account, isChange, opnetNetwork }) {
  const mnemonic = new Mnemonic(phrase, passphrase, opnetNetwork);
  const rows = [];
  try {
    for (let i = 0; i < count; i++) {
      const relayIndex = startIndex + i;
      const opWallet = mnemonic.deriveOPWallet(undefined, relayIndex, account, isChange);
      const mldsaPublicKey = new Uint8Array(opWallet.quantumPublicKey);
      const mldsaPrivateKeyHex = opWallet.quantumPrivateKeyHex;
      const mldsaPublicKeyHex = bytesToHex(mldsaPublicKey);
      const mldsaPubKeyHashHex = bytesToHex(createHash("sha256").update(Buffer.from(mldsaPublicKey)).digest());
      const opnetRelayId = new Address(mldsaPublicKey).toHex();

      if (mldsaPublicKey.length !== MLDSA_PUBKEY_BYTES) {
        throw new Error(
          `Relay ${relayIndex} MLDSA public key length is ${mldsaPublicKey.length}, expected ${MLDSA_PUBKEY_BYTES}.`,
        );
      }

      const { path: evmDerivationPath, wallet: evmWallet } = buildEvmWalletFromMnemonic(
        phrase,
        passphrase,
        account,
        relayIndex,
      );

      rows.push({
        relayIndex,
        opnet: {
          relayId: opnetRelayId,
          mldsaPublicKeyHex,
          mldsaPublicKeyHashHex: mldsaPubKeyHashHex,
          mldsaPrivateKeyHex,
        },
        ethereum: {
          derivationPath: evmDerivationPath,
          address: evmWallet.address,
          publicKey: evmWallet.signingKey.publicKey,
          privateKey: evmWallet.privateKey,
        },
      });
    }
  } finally {
    mnemonic.zeroize?.();
  }
  return rows;
}

export function buildRelayPublicPayload({ relayRows, opnetNetworkName }) {
  const relayPubKeysPackedHex = bytesToHex(
    concatBytes(relayRows.map((row) => Buffer.from(row.opnet.mldsaPublicKeyHex.slice(2), "hex"))),
  );
  return {
    generatedAt: new Date().toISOString(),
    opnetNetwork: opnetNetworkName,
    relayCount: relayRows.length,
    relayThresholdSuggested: Math.min(2, relayRows.length),
    relayPubKeysPackedHex,
    relays: relayRows.map((row) => ({
      relayIndex: row.relayIndex,
      opnetRelayId: row.opnet.relayId,
      mldsaPublicKeyHex: row.opnet.mldsaPublicKeyHex,
      mldsaPublicKeyHashHex: row.opnet.mldsaPublicKeyHashHex,
      ethereumAddress: row.ethereum.address,
      ethereumPublicKey: row.ethereum.publicKey,
      ethereumDerivationPath: row.ethereum.derivationPath,
    })),
  };
}
