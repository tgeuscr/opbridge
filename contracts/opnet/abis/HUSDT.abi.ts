import { ABIDataTypes, BitcoinAbiTypes, OP_NET_ABI } from 'opnet';

export const HUSDTEvents = [
    {
        name: 'BridgeMinted',
        values: [
            { name: 'bridge', type: ABIDataTypes.ADDRESS },
            { name: 'recipient', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'BridgeBurned',
        values: [
            { name: 'bridge', type: ABIDataTypes.ADDRESS },
            { name: 'from', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'BridgeAuthorityChanged',
        values: [
            { name: 'previousBridge', type: ABIDataTypes.ADDRESS },
            { name: 'newBridge', type: ABIDataTypes.ADDRESS },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'TokenPausedUpdated',
        values: [{ name: 'paused', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Transferred',
        values: [
            { name: 'operator', type: ABIDataTypes.ADDRESS },
            { name: 'from', type: ABIDataTypes.ADDRESS },
            { name: 'to', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
            { name: 'operator', type: ABIDataTypes.ADDRESS },
            { name: 'from', type: ABIDataTypes.ADDRESS },
            { name: 'to', type: ABIDataTypes.ADDRESS },
            { name: 'tokenId', type: ABIDataTypes.UINT256 },
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

export const HUSDTAbi = [
    {
        name: 'mint',
        inputs: [
            { name: 'to', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'burnFrom',
        inputs: [
            { name: 'from', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'setBridgeAuthority',
        inputs: [{ name: 'newBridge', type: ABIDataTypes.ADDRESS }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'paused',
        inputs: [],
        outputs: [{ name: 'paused', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'setPaused',
        inputs: [{ name: 'paused', type: ABIDataTypes.BOOL }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'transfer',
        inputs: [
            { name: 'to', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'transferFrom',
        inputs: [
            { name: 'from', type: ABIDataTypes.ADDRESS },
            { name: 'to', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'safeTransfer',
        inputs: [
            { name: 'to', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
            { name: 'data', type: ABIDataTypes.BYTES },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'safeTransferFrom',
        inputs: [
            { name: 'from', type: ABIDataTypes.ADDRESS },
            { name: 'to', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
            { name: 'data', type: ABIDataTypes.BYTES },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'bridgeAuthority',
        inputs: [],
        outputs: [{ name: 'bridgeAuthority', type: ABIDataTypes.ADDRESS }],
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
    ...HUSDTEvents,
    ...OP_NET_ABI,
];

export default HUSDTAbi;
