import { HDNodeWallet } from "ethers";

const [phrase, accountRaw = "0", indexRaw = "0", passphrase = ""] = process.argv.slice(2);
if (!phrase?.trim()) {
  console.error("Usage: node derive-sepolia-key-from-mnemonic.mjs <mnemonic> [account=0] [index=0] [passphrase='']");
  process.exit(1);
}

const account = Number(accountRaw);
const index = Number(indexRaw);
if (!Number.isInteger(account) || account < 0) {
  throw new Error("account must be a non-negative integer");
}
if (!Number.isInteger(index) || index < 0) {
  throw new Error("index must be a non-negative integer");
}

const path = `m/44'/60'/${account}'/0/${index}`;
const wallet = HDNodeWallet.fromPhrase(phrase, passphrase, path);
process.stdout.write(`${wallet.privateKey}\n`);
