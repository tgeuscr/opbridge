import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const bridgeSource = readFileSync(
  join(process.cwd(), 'src/bridge/HeptadBridge.ts'),
  'utf8',
);

const wrappedTokenSources = [
  'src/wrapped/husdt/HUSDT.ts',
  'src/wrapped/hwbtc/HWBTC.ts',
  'src/wrapped/heth/HETH.ts',
  'src/wrapped/hpaxg/HPAXG.ts',
].map((relativePath) => ({
  path: relativePath,
  source: readFileSync(join(process.cwd(), relativePath), 'utf8'),
}));

function expectContains(source, needle, description) {
  assert.ok(
    source.includes(needle),
    `${description}\nMissing snippet: ${needle}`,
  );
}

expectContains(
  bridgeSource,
  "if (!from.equals(Blockchain.tx.sender)) {\n            throw new Revert('Burn account must match sender');\n        }",
  'requestBurn must bind the burn account to the tx sender',
);

expectContains(
  bridgeSource,
  "if (this._processedDepositsStore().get(depositId) > u256.Zero) {\n            throw new Revert('Deposit already processed');\n        }",
  'mint replay protection by depositId must be enforced',
);

expectContains(
  bridgeSource,
  "this._requireAttestationVersionAccepted(attestationVersion);",
  'mint path must reject unaccepted attestation versions',
);

expectContains(
  bridgeSource,
  "payload.writeU8(attestationVersion);\n        payload.writeAddress(this._ethereumVaultStore().value);\n        payload.writeAddress(this.address);\n        payload.writeAddress(ethereumUser);\n        payload.writeAddress(opnetUser);\n        payload.writeU8(asset);\n        payload.writeU256(amount);\n        payload.writeU8(DIRECTION_ETH_TO_OP_MINT);\n        payload.writeU256(depositId);",
  'mint attestation hash must use the canonical field order',
);

expectContains(
  bridgeSource,
  "if (this._processedWithdrawalsStore().get(withdrawalId) > u256.Zero) {\n            throw new Revert('Withdrawal already processed');\n        }",
  'burn replay protection by withdrawalId must be enforced',
);

expectContains(
  bridgeSource,
  "if (!existingHash.equals(Address.zero()) && existingHash.equals(relayHash)) {\n                throw new Revert('Duplicate relay pubkey');\n            }",
  'relay pubkeys must be unique across relay slots',
);

for (const wrapped of wrappedTokenSources) {
  expectContains(
    wrapped.source,
    "if (!Blockchain.tx.sender.equals(bridge)) {\n            throw new Revert('Not bridge authority');\n        }",
    `${wrapped.path}: mint/burn must only be callable by bridge authority`,
  );
}

console.log('Bridge invariant checks passed.');
