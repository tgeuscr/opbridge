import { Address, AddressMap, ExtendedAddressMap, SchnorrSignature } from '@btc-vision/transaction';
import { CallResult, OPNetEvent, IOP_NETContract } from 'opnet';

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------
export type BridgeMintedEvent = {
    readonly bridge: Address;
    readonly recipient: Address;
    readonly amount: bigint;
};
export type BridgeBurnedEvent = {
    readonly bridge: Address;
    readonly from: Address;
    readonly amount: bigint;
};
export type BridgeAuthorityChangedEvent = {
    readonly previousBridge: Address;
    readonly newBridge: Address;
};
export type TokenPausedUpdatedEvent = {
    readonly paused: boolean;
};
export type TransferredEvent = {
    readonly operator: Address;
    readonly from: Address;
    readonly to: Address;
    readonly amount: bigint;
    readonly operator: Address;
    readonly from: Address;
    readonly to: Address;
    readonly tokenId: bigint;
};
export type OwnershipTransferredEvent = {
    readonly previousOwner: Address;
    readonly newOwner: Address;
};

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the mint function call.
 */
export type Mint = CallResult<{}, OPNetEvent<BridgeMintedEvent>[]>;

/**
 * @description Represents the result of the burnFrom function call.
 */
export type BurnFrom = CallResult<{}, OPNetEvent<BridgeBurnedEvent>[]>;

/**
 * @description Represents the result of the setBridgeAuthority function call.
 */
export type SetBridgeAuthority = CallResult<{}, OPNetEvent<BridgeAuthorityChangedEvent>[]>;

/**
 * @description Represents the result of the paused function call.
 */
export type Paused = CallResult<
    {
        paused: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the setPaused function call.
 */
export type SetPaused = CallResult<{}, OPNetEvent<TokenPausedUpdatedEvent>[]>;

/**
 * @description Represents the result of the transfer function call.
 */
export type Transfer = CallResult<{}, OPNetEvent<TransferredEvent>[]>;

/**
 * @description Represents the result of the transferFrom function call.
 */
export type TransferFrom = CallResult<{}, OPNetEvent<TransferredEvent>[]>;

/**
 * @description Represents the result of the safeTransfer function call.
 */
export type SafeTransfer = CallResult<{}, OPNetEvent<TransferredEvent>[]>;

/**
 * @description Represents the result of the safeTransferFrom function call.
 */
export type SafeTransferFrom = CallResult<{}, OPNetEvent<TransferredEvent>[]>;

/**
 * @description Represents the result of the bridgeAuthority function call.
 */
export type BridgeAuthority = CallResult<
    {
        bridgeAuthority: Address;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the owner function call.
 */
export type Owner = CallResult<
    {
        owner: Address;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the transferOwnership function call.
 */
export type TransferOwnership = CallResult<{}, OPNetEvent<OwnershipTransferredEvent>[]>;

// ------------------------------------------------------------------
// IopWETH
// ------------------------------------------------------------------
export interface IopWETH extends IOP_NETContract {
    mint(to: Address, amount: bigint): Promise<Mint>;
    burnFrom(from: Address, amount: bigint): Promise<BurnFrom>;
    setBridgeAuthority(newBridge: Address): Promise<SetBridgeAuthority>;
    paused(): Promise<Paused>;
    setPaused(paused: boolean): Promise<SetPaused>;
    transfer(to: Address, amount: bigint): Promise<Transfer>;
    transferFrom(from: Address, to: Address, amount: bigint): Promise<TransferFrom>;
    safeTransfer(to: Address, amount: bigint, data: Uint8Array): Promise<SafeTransfer>;
    safeTransferFrom(from: Address, to: Address, amount: bigint, data: Uint8Array): Promise<SafeTransferFrom>;
    bridgeAuthority(): Promise<BridgeAuthority>;
    owner(): Promise<Owner>;
    transferOwnership(newOwner: Address): Promise<TransferOwnership>;
}
