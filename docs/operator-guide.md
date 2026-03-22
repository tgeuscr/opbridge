# OP_BRIDGE Operator Guide

## Scope

This guide covers the operational controls that matter most once the bridge is deployed:

- health checks
- pause / unpause
- relayer restarts
- fee configuration
- fee whitelist management
- what to verify before reopening the bridge

## Operational Sources of Truth

Use these in order:

1. on-chain contract state
2. relayer API `/status`
3. public site behavior

The public site is downstream of the relayer API. If the site and API disagree, check the contracts and relayer heartbeats first.

## Health Checks

### Public checks

- bridge site loads and wallet flows render correctly
- status API `/status` is reachable
- recent deposits / withdrawals advance through ready -> claimable -> processed

### API checks

Confirm relayer heartbeats are current and include pause state:

- Ethereum pollers should publish `vaultPaused`
- OP_NET pollers should publish `bridgePaused`

The site uses those fields to gate the maintenance landing page.

### Relayer checks

On EC2/systemd deployments, check each unit with `systemctl status`.

Current naming example:

- `opbridge-relayer-ethereum@a.service`
- `opbridge-relayer-opnet@a.service`

Restart example:

```bash
sudo systemctl restart opbridge-relayer-ethereum@a.service
sudo systemctl restart opbridge-relayer-opnet@a.service
```

## Pause / Unpause Policy

Pause the bridge if any of these are true:

- signer set inconsistency
- incorrect asset configuration
- API/relayer state is producing misleading claimability
- OP_NET or Ethereum contract state is uncertain
- there is any unresolved security concern

### Ethereum vault pause

Use the terminal admin flow:

```bash
SEPOLIA_RPC_URL=... \
SEPOLIA_DEPLOYER_PRIVATE_KEY=0x<owner-key> \
SEPOLIA_VAULT_PAUSED=true \
npm run admin:sepolia --workspace @opbridge/ethereum-contracts
```

Mainnet variant:

```bash
ETHEREUM_RPC_URL=... \
ETHEREUM_DEPLOYER_PRIVATE_KEY=0x<owner-key> \
ETHEREUM_VAULT_PAUSED=true \
npm run admin:ethereum --workspace @opbridge/ethereum-contracts
```

When the vault is paused:

- deposits revert
- release claims revert
- the public site should show the maintenance landing page once relayer heartbeats refresh

### Ethereum vault unpause

Only unpause after:

- asset configuration is correct
- relay signer configuration is correct
- fee recipient and fee bps are confirmed
- relayers are healthy
- status API is healthy
- site behavior is confirmed

Sepolia:

```bash
SEPOLIA_RPC_URL=... \
SEPOLIA_DEPLOYER_PRIVATE_KEY=0x<owner-key> \
SEPOLIA_VAULT_PAUSED=false \
npm run admin:sepolia --workspace @opbridge/ethereum-contracts
```

Mainnet:

```bash
ETHEREUM_RPC_URL=... \
ETHEREUM_DEPLOYER_PRIVATE_KEY=0x<owner-key> \
ETHEREUM_VAULT_PAUSED=false \
npm run admin:ethereum --workspace @opbridge/ethereum-contracts
```

## Fee Controls

### Fee basis points

Set while paused:

```bash
ETH_VAULT_FEE_BPS=50
```

This means `0.5%`.

### Fee recipient

Set with:

```bash
ETH_VAULT_FEE_RECIPIENT=0x<recipient>
```

### Fee whitelist

Whitelisted accounts bypass fees on bridge operations.

Sepolia example:

```bash
SEPOLIA_RPC_URL=... \
SEPOLIA_DEPLOYER_PRIVATE_KEY=0x<owner-key> \
ETH_VAULT_FEE_WHITELIST_ACCOUNT=0x<wallet-address> \
ETH_VAULT_FEE_WHITELIST_ENABLED=true \
npm run admin:sepolia --workspace @opbridge/ethereum-contracts
```

Mainnet example:

```bash
ETHEREUM_RPC_URL=... \
ETHEREUM_DEPLOYER_PRIVATE_KEY=0x<owner-key> \
ETH_VAULT_FEE_WHITELIST_ACCOUNT=0x<wallet-address> \
ETH_VAULT_FEE_WHITELIST_ENABLED=true \
npm run admin:ethereum --workspace @opbridge/ethereum-contracts
```

Operational note:

- verify whitelist behavior with a real low-value bridge test after the change

## Pause Landing Page Verification

The maintenance page should appear when either of these becomes true:

- `vaultPaused`
- `bridgePaused`

Expected site message:

- `The bridge is paused for maintenance. We will be back shortly.`

Test flow:

1. pause one side
2. confirm relayer `/status` reflects the pause flag
3. confirm the public site switches to the maintenance page
4. unpause
5. confirm `/status` returns to false
6. confirm the public site returns to normal mode

## Relayer Restart Policy

Restart relayers when:

- a relayer script changes
- KMS or env configuration changes
- mapping/deployment manifests change
- pause heartbeat logic changes
- a relayer stalls or falls behind

After restart, verify:

- systemd service healthy
- fresh heartbeat present in `/status`
- no stale or contradictory pause state

## Suggested Incident Checklist

If something looks wrong in production:

1. pause the bridge
2. capture contract state, API state, and recent transaction hashes
3. verify signer sets and deployment manifests
4. verify the issue is not a stale API/indexing artifact
5. only reopen after the full bridge path is coherent again
