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

function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`Generate Relay Keys (MLDSA + ECDSA) From Mnemonic

Required:
  RELAYER_KEYS_MNEMONIC (12/24 word BIP39 mnemonic)

Optional:
  RELAYER_KEYS_PASSPHRASE (default: "")
  RELAYER_KEYS_COUNT (default: 3)
  RELAYER_KEYS_START_INDEX (default: 0)
  RELAYER_KEYS_ACCOUNT (default: 0)
  RELAYER_KEYS_IS_CHANGE (default: false; "true"/"1" enables)
  RELAYER_KEYS_OPNET_NETWORK (default: regtest; regtest|testnet|mainnet)
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
  const count = parseIntEnv("RELAYER_KEYS_COUNT", 3, 1);
  const startIndex = parseIntEnv("RELAYER_KEYS_START_INDEX", 0, 0);
  const account = parseIntEnv("RELAYER_KEYS_ACCOUNT", 0, 0);
  const isChange = /^(1|true|yes|y)$/i.test(process.env.RELAYER_KEYS_IS_CHANGE?.trim() || "");
  const opnetNetworkName = process.env.RELAYER_KEYS_OPNET_NETWORK?.trim() || "regtest";
  const opnetNetwork = resolveOPNetNetwork(opnetNetworkName);
  const keysFile = process.env.RELAYER_KEYS_FILE?.trim() || DEFAULT_KEYS_FILE;
  const publicFile = process.env.RELAYER_PUBLIC_CONFIG_FILE?.trim() || DEFAULT_PUBLIC_FILE;

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
