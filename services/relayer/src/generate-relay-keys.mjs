import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  buildRelayPublicPayload,
  deriveRelayKeys,
  parseIntEnv,
  requireMnemonicFromEnv,
  resolveOPNetNetwork,
} from "./relay-key-utils.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../../..");
const DEFAULT_KEYS_FILE = path.resolve(REPO_ROOT, "services/relayer/.data/relay-keys.json");
const DEFAULT_PUBLIC_FILE = path.resolve(REPO_ROOT, "services/relayer/.data/relay-public-config.json");

function parseCliIntFlag(name) {
  const index = process.argv.findIndex((arg) => arg === name);
  if (index < 0) return null;
  const value = process.argv[index + 1];
  if (!value || value.startsWith("-")) {
    throw new Error(`${name} requires a numeric value.`);
  }
  if (!/^\d+$/.test(value)) {
    throw new Error(`${name} must be a non-negative integer.`);
  }
  return Number(value);
}

function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`Generate Relay Keys (MLDSA + ECDSA) From Mnemonic

Required:
  RELAYER_KEYS_MNEMONIC (12/24 word BIP39 mnemonic)

Optional:
  RELAYER_KEYS_PASSPHRASE (default: "")
  RELAYER_KEYS_COUNT (default: 3)
  RELAYER_KEYS_START_INDEX (default: 0)
  RELAYER_KEYS_RELAY_INDEX (single-relayer mode; equivalent to COUNT=1 and START_INDEX=<index>)
  RELAYER_KEYS_ACCOUNT (default: 0)
  RELAYER_KEYS_IS_CHANGE (default: false; "true"/"1" enables)
  RELAYER_KEYS_OPNET_NETWORK (default: regtest; regtest|testnet|mainnet)
  --relay-index <index> (CLI alias of RELAYER_KEYS_RELAY_INDEX)
  RELAYER_KEYS_FILE (default: ${DEFAULT_KEYS_FILE})
  RELAYER_PUBLIC_CONFIG_FILE (default: ${DEFAULT_PUBLIC_FILE})

Outputs:
  - Combined private key file for relayers (MLDSA + ECDSA arrays)
  - Public config file with MLDSA pubkeys/packed and ECDSA addresses for contract wiring
`);
    return;
  }

  const phrase = requireMnemonicFromEnv();
  const passphrase = process.env.RELAYER_KEYS_PASSPHRASE?.trim() || "";
  const relayIndexCli = parseCliIntFlag("--relay-index");
  const relayIndexEnv = process.env.RELAYER_KEYS_RELAY_INDEX?.trim();
  const relayIndex =
    relayIndexCli != null
      ? relayIndexCli
      : relayIndexEnv != null && relayIndexEnv !== ""
        ? Number.parseInt(relayIndexEnv, 10)
        : null;
  if (relayIndex != null && (!Number.isInteger(relayIndex) || relayIndex < 0)) {
    throw new Error("RELAYER_KEYS_RELAY_INDEX/--relay-index must be a non-negative integer.");
  }

  const count = relayIndex != null ? 1 : parseIntEnv("RELAYER_KEYS_COUNT", 3, 1);
  const startIndex = relayIndex != null ? relayIndex : parseIntEnv("RELAYER_KEYS_START_INDEX", 0, 0);
  const account = parseIntEnv("RELAYER_KEYS_ACCOUNT", 0, 0);
  const isChange = /^(1|true|yes|y)$/i.test(process.env.RELAYER_KEYS_IS_CHANGE?.trim() || "");
  const opnetNetworkName = process.env.RELAYER_KEYS_OPNET_NETWORK?.trim() || "regtest";
  const opnetNetwork = resolveOPNetNetwork(opnetNetworkName);
  const defaultKeysFile =
    relayIndex != null
      ? path.resolve(REPO_ROOT, `services/relayer/.data/keys/relay-keys-relayer-${relayIndex}.json`)
      : DEFAULT_KEYS_FILE;
  const defaultPublicFile =
    relayIndex != null
      ? path.resolve(REPO_ROOT, `services/relayer/.data/keys/relay-public-config-relayer-${relayIndex}.json`)
      : DEFAULT_PUBLIC_FILE;
  const keysFile = process.env.RELAYER_KEYS_FILE?.trim() || defaultKeysFile;
  const publicFile = process.env.RELAYER_PUBLIC_CONFIG_FILE?.trim() || defaultPublicFile;

  const relayRows = deriveRelayKeys({
    phrase,
    passphrase,
    count,
    startIndex,
    account,
    isChange,
    opnetNetwork,
  });

  const keysPayload = {
    generatedAt: new Date().toISOString(),
    mnemonicSource: "RELAYER_KEYS_MNEMONIC",
    opnetNetwork: opnetNetworkName,
    count,
    startIndex,
    mode: relayIndex != null ? "single-relayer" : "multi-relayer",
    account,
    isChange,
    relayPrivateKeys: relayRows.map((row) => row.opnet.mldsaPrivateKeyHex),
    relayEvmPrivateKeys: relayRows.map((row) => row.ethereum.privateKey),
  };

  const publicPayload = buildRelayPublicPayload({ relayRows, opnetNetworkName });

  fs.mkdirSync(path.dirname(keysFile), { recursive: true });
  fs.mkdirSync(path.dirname(publicFile), { recursive: true });
  fs.writeFileSync(keysFile, `${JSON.stringify(keysPayload, null, 2)}\n`);
  fs.writeFileSync(publicFile, `${JSON.stringify(publicPayload, null, 2)}\n`);

  console.log(`Wrote relay key file -> ${keysFile}`);
  console.log(`Wrote public config file -> ${publicFile}`);
  console.log("Relay summary:");
  for (const relay of publicPayload.relays) {
    console.log(
      `  [${relay.relayIndex}] opnetRelayId=${relay.opnetRelayId} evm=${relay.ethereumAddress} path=${relay.ethereumDerivationPath}`,
    );
  }
  console.log(`relayPubKeysPackedHex bytes=${(publicPayload.relayPubKeysPackedHex.length - 2) / 2}`);
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
