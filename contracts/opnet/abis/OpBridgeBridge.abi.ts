import { ABIDataTypes, BitcoinAbiTypes, OP_NET_ABI } from 'opnet';

export const OpBridgeBridgeEvents = [
    {
        name: 'MintFinalized',
        values: [
            { name: 'assetId', type: ABIDataTypes.UINT8 },
            { name: 'recipient', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
            { name: 'depositId', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'BurnRequested',
        values: [
            { name: 'assetId', type: ABIDataTypes.UINT8 },
            { name: 'from', type: ABIDataTypes.ADDRESS },
            { name: 'ethereumRecipient', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
            { name: 'withdrawalId', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'WrappedTokenUpdated',
        values: [
            { name: 'assetId', type: ABIDataTypes.UINT8 },
            { name: 'token', type: ABIDataTypes.ADDRESS },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'RelayCountUpdated',
        values: [{ name: 'relayCount', type: ABIDataTypes.UINT8 }],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'RelayThresholdUpdated',
        values: [{ name: 'requiredSignatures', type: ABIDataTypes.UINT8 }],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'BridgePausedUpdated',
        values: [{ name: 'paused', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'AttestationVersionAcceptanceUpdated',
        values: [
            { name: 'version', type: ABIDataTypes.UINT8 },
            { name: 'accepted', type: ABIDataTypes.BOOL },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'ActiveAttestationVersionUpdated',
        values: [
            { name: 'previousVersion', type: ABIDataTypes.UINT8 },
            { name: 'nextVersion', type: ABIDataTypes.UINT8 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'OwnershipTransferred',
        values: [
            { name: 'previousOwner', type: ABIDataTypes.ADDRESS },
            { name: 'newOwner', type: ABIDataTypes.ADDRESS },
        ],
        type: BitcoinAbiTypes.Event,
    },
];

export const OpBridgeBridgeAbi = [
    {
        name: 'mintWithRelaySignatures',
        inputs: [
            { name: 'asset', type: ABIDataTypes.UINT8 },
            { name: 'ethereumUser', type: ABIDataTypes.BYTES32 },
            { name: 'recipient', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
            { name: 'depositId', type: ABIDataTypes.UINT256 },
            { name: 'attestationVersion', type: ABIDataTypes.UINT8 },
            { name: 'relayIndexesPacked', type: ABIDataTypes.BYTES },
            { name: 'relaySignaturesPacked', type: ABIDataTypes.BYTES },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'requestBurn',
        inputs: [
            { name: 'asset', type: ABIDataTypes.UINT8 },
            { name: 'from', type: ABIDataTypes.ADDRESS },
            { name: 'ethereumRecipient', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'setRelayPubKey',
        inputs: [
            { name: 'relayIndex', type: ABIDataTypes.UINT8 },
            { name: 'relayPubKey', type: ABIDataTypes.BYTES },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'setRelayPubKeysPacked',
        inputs: [{ name: 'relayPubKeysPacked', type: ABIDataTypes.BYTES }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'setRelaysConfigPacked',
        inputs: [
            { name: 'relayPubKeysPacked', type: ABIDataTypes.BYTES },
            { name: 'newThreshold', type: ABIDataTypes.UINT8 },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'setWrappedToken',
        inputs: [
            { name: 'asset', type: ABIDataTypes.UINT8 },
            { name: 'token', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'setSupportedAssetsPacked',
        inputs: [{ name: 'assetsPacked', type: ABIDataTypes.BYTES }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'removeSupportedAsset',
        inputs: [{ name: 'asset', type: ABIDataTypes.UINT8 }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'removeSupportedAssetsPacked',
        inputs: [{ name: 'assetIdsPacked', type: ABIDataTypes.BYTES }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'wrappedToken',
        inputs: [{ name: 'asset', type: ABIDataTypes.UINT8 }],
        outputs: [{ name: 'token', type: ABIDataTypes.ADDRESS }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'supportedAssetCount',
        inputs: [],
        outputs: [{ name: 'count', type: ABIDataTypes.UINT16 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'supportedAssetAt',
        inputs: [{ name: 'index', type: ABIDataTypes.UINT16 }],
        outputs: [
            { name: 'assetId', type: ABIDataTypes.UINT8 },
            { name: 'token', type: ABIDataTypes.ADDRESS },
            { name: 'decimals', type: ABIDataTypes.UINT8 },
            { name: 'symbol', type: ABIDataTypes.BYTES },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'isSignatureEnforced',
        inputs: [],
        outputs: [{ name: 'enabled', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'paused',
        inputs: [],
        outputs: [{ name: 'paused', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'relayThreshold',
        inputs: [],
        outputs: [{ name: 'requiredSignatures', type: ABIDataTypes.UINT8 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'relayCount',
        inputs: [],
        outputs: [{ name: 'relayCount', type: ABIDataTypes.UINT8 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'relayPubKeyHashAt',
        inputs: [{ name: 'relayIndex', type: ABIDataTypes.UINT8 }],
        outputs: [{ name: 'relayPubKeyHash', type: ABIDataTypes.ADDRESS }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'relayPubKeyHashesPacked',
        inputs: [],
        outputs: [{ name: 'relayPubKeyHashesPacked', type: ABIDataTypes.BYTES }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'setRelayCount',
        inputs: [{ name: 'newRelayCount', type: ABIDataTypes.UINT8 }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'setRelayThreshold',
        inputs: [{ name: 'newThreshold', type: ABIDataTypes.UINT8 }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'setPaused',
        inputs: [{ name: 'paused', type: ABIDataTypes.BOOL }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'setEthereumVault',
        inputs: [{ name: 'ethereumVault', type: ABIDataTypes.ADDRESS }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'ethereumVault',
        inputs: [],
        outputs: [{ name: 'ethereumVault', type: ABIDataTypes.ADDRESS }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'activeAttestationVersion',
        inputs: [],
        outputs: [{ name: 'version', type: ABIDataTypes.UINT8 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'isAttestationVersionAccepted',
        inputs: [{ name: 'version', type: ABIDataTypes.UINT8 }],
        outputs: [{ name: 'accepted', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'setAttestationVersionAccepted',
        inputs: [
            { name: 'version', type: ABIDataTypes.UINT8 },
            { name: 'accepted', type: ABIDataTypes.BOOL },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'setActiveAttestationVersion',
        inputs: [{ name: 'version', type: ABIDataTypes.UINT8 }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'owner',
        inputs: [],
        outputs: [{ name: 'owner', type: ABIDataTypes.ADDRESS }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'transferOwnership',
        inputs: [{ name: 'newOwner', type: ABIDataTypes.ADDRESS }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'computeMintAttestationHash',
        inputs: [
            { name: 'asset', type: ABIDataTypes.UINT8 },
            { name: 'ethereumUser', type: ABIDataTypes.BYTES32 },
            { name: 'recipient', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
            { name: 'depositId', type: ABIDataTypes.UINT256 },
            { name: 'attestationVersion', type: ABIDataTypes.UINT8 },
        ],
        outputs: [{ name: 'messageHash', type: ABIDataTypes.BYTES32 }],
        type: BitcoinAbiTypes.Function,
    },
    ...OpBridgeBridgeEvents,
    ...OP_NET_ABI,
];

export default OpBridgeBridgeAbi;
