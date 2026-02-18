import { ABIDataTypes, BitcoinAbiTypes, OP_NET_ABI } from 'opnet';

export const OP20ReadAbi = [
  {
    name: 'balanceOf',
    inputs: [{ name: 'owner', type: ABIDataTypes.ADDRESS }],
    outputs: [{ name: 'balance', type: ABIDataTypes.UINT256 }],
    type: BitcoinAbiTypes.Function,
  },
  ...OP_NET_ABI,
];

export default OP20ReadAbi;
