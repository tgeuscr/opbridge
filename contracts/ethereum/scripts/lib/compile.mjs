import fs from "node:fs";
import path from "node:path";
import solc from "solc";

export function compileContracts(projectRoot) {
  const srcDir = path.join(projectRoot, "src");
  const sourceFiles = fs
    .readdirSync(srcDir)
    .filter((entry) => entry.endsWith(".sol"))
    .sort();

  const sources = Object.fromEntries(
    sourceFiles.map((fileName) => [
      fileName,
      { content: fs.readFileSync(path.join(srcDir, fileName), "utf8") },
    ]),
  );

  const input = {
    language: "Solidity",
    sources,
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode.object", "evm.deployedBytecode.object"],
        },
      },
    },
  };

  const outputRaw = solc.compile(JSON.stringify(input));
  const output = JSON.parse(outputRaw);
  const errors = output.errors ?? [];
  const fatal = errors.filter((entry) => entry.severity === "error");

  return {
    output,
    errors,
    fatal,
  };
}

export function getCompiledContract(compiledOutput, fileName, contractName) {
  const fileOutput = compiledOutput.contracts?.[fileName];
  if (!fileOutput) {
    throw new Error(`Compiled output missing file: ${fileName}`);
  }
  const contract = fileOutput[contractName];
  if (!contract) {
    throw new Error(`Compiled output missing contract ${contractName} in ${fileName}`);
  }
  return contract;
}
