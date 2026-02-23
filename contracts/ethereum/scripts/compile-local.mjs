import process from "node:process";
import { compileContracts } from "./lib/compile.mjs";

const projectRoot = process.cwd();
const { output, errors, fatal } = compileContracts(projectRoot);

for (const entry of errors) {
  const prefix = entry.severity === "error" ? "ERROR" : "WARN";
  console.log(`[${prefix}] ${entry.formattedMessage.trim()}`);
}

if (fatal.length > 0) {
  console.error(`Compilation failed with ${fatal.length} error(s).`);
  process.exit(1);
}

const contracts = output.contracts ?? {};
const names = [];
for (const fileName of Object.keys(contracts)) {
  for (const contractName of Object.keys(contracts[fileName])) {
    names.push(`${fileName}:${contractName}`);
  }
}

console.log(`Local Solidity compile succeeded (${names.length} contracts).`);
