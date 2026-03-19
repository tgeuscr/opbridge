import { Address, AddressMap, ExtendedAddressMap, SchnorrSignature } from '@btc-vision/transaction';
import { CallResult, OPNetEvent, IOP_NETContract } from 'opnet';

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------
export type MintFinalizedEvent = {
    readonly assetId: number;
    readonly recipient: Address;
    readonly amount: bigint;
    readonly depositId: bigint;
};
export type BurnRequestedEvent = {
    readonly assetId: number;
    readonly from: Address;
    readonly ethereumRecipient: Address;
    readonly amount: bigint;
    readonly withdrawalId: bigint;
};
export type WrappedTokenUpdatedEvent = {
    readonly assetId: number;
    readonly token: Address;
};
export type RelayCountUpdatedEvent = {
    readonly relayCount: number;
};
export type RelayThresholdUpdatedEvent = {
    readonly requiredSignatures: number;
};
export type BridgePausedUpdatedEvent = {
    readonly paused: boolean;
};
export type AttestationVersionAcceptanceUpdatedEvent = {
    readonly version: number;
    readonly accepted: boolean;
};
export type ActiveAttestationVersionUpdatedEvent = {
    readonly previousVersion: number;
    readonly nextVersion: number;
};
export type OwnershipTransferredEvent = {
    readonly previousOwner: Address;
    readonly newOwner: Address;
};

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the mintWithRelaySignatures function call.
 */
export type MintWithRelaySignatures = CallResult<{}, OPNetEvent<MintFinalizedEvent>[]>;

/**
 * @description Represents the result of the requestBurn function call.
 */
export type RequestBurn = CallResult<{}, OPNetEvent<BurnRequestedEvent>[]>;

/**
 * @description Represents the result of the setRelayPubKey function call.
 */
export type SetRelayPubKey = CallResult<{}, OPNetEvent<never>[]>;

/**
 * @description Represents the result of the setRelayPubKeysPacked function call.
 */
export type SetRelayPubKeysPacked = CallResult<{}, OPNetEvent<never>[]>;

/**
 * @description Represents the result of the setRelaysConfigPacked function call.
 */
export type SetRelaysConfigPacked = CallResult<{}, OPNetEvent<never>[]>;

/**
 * @description Represents the result of the setWrappedToken function call.
 */
export type SetWrappedToken = CallResult<{}, OPNetEvent<WrappedTokenUpdatedEvent>[]>;

/**
 * @description Represents the result of the setSupportedAssetsPacked function call.
 */
export type SetSupportedAssetsPacked = CallResult<{}, OPNetEvent<never>[]>;

/**
 * @description Represents the result of the removeSupportedAsset function call.
 */
export type RemoveSupportedAsset = CallResult<{}, OPNetEvent<never>[]>;

/**
 * @description Represents the result of the removeSupportedAssetsPacked function call.
 */
export type RemoveSupportedAssetsPacked = CallResult<{}, OPNetEvent<never>[]>;

/**
 * @description Represents the result of the wrappedToken function call.
 */
export type WrappedToken = CallResult<
    {
        token: Address;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the supportedAssetCount function call.
 */
export type SupportedAssetCount = CallResult<
    {
        count: number;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the supportedAssetAt function call.
 */
export type SupportedAssetAt = CallResult<
    {
        assetId: number;
        token: Address;
        decimals: number;
        symbol: Uint8Array;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the isSignatureEnforced function call.
 */
export type IsSignatureEnforced = CallResult<
    {
        enabled: boolean;
    },
    OPNetEvent<never>[]
>;

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
 * @description Represents the result of the relayThreshold function call.
 */
export type RelayThreshold = CallResult<
    {
        requiredSignatures: number;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the relayCount function call.
 */
export type RelayCount = CallResult<
    {
        relayCount: number;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the relayPubKeyHashAt function call.
 */
export type RelayPubKeyHashAt = CallResult<
    {
        relayPubKeyHash: Address;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the relayPubKeyHashesPacked function call.
 */
export type RelayPubKeyHashesPacked = CallResult<
    {
        relayPubKeyHashesPacked: Uint8Array;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the setRelayCount function call.
 */
export type SetRelayCount = CallResult<{}, OPNetEvent<RelayCountUpdatedEvent>[]>;

/**
 * @description Represents the result of the setRelayThreshold function call.
 */
export type SetRelayThreshold = CallResult<{}, OPNetEvent<RelayThresholdUpdatedEvent>[]>;

/**
 * @description Represents the result of the setPaused function call.
 */
export type SetPaused = CallResult<{}, OPNetEvent<BridgePausedUpdatedEvent>[]>;

/**
 * @description Represents the result of the setEthereumVault function call.
 */
export type SetEthereumVault = CallResult<{}, OPNetEvent<never>[]>;

/**
 * @description Represents the result of the ethereumVault function call.
 */
export type EthereumVault = CallResult<
    {
        ethereumVault: Address;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the activeAttestationVersion function call.
 */
export type ActiveAttestationVersion = CallResult<
    {
        version: number;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the isAttestationVersionAccepted function call.
 */
export type IsAttestationVersionAccepted = CallResult<
    {
        accepted: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the setAttestationVersionAccepted function call.
 */
export type SetAttestationVersionAccepted = CallResult<{}, OPNetEvent<AttestationVersionAcceptanceUpdatedEvent>[]>;

/**
 * @description Represents the result of the setActiveAttestationVersion function call.
 */
export type SetActiveAttestationVersion = CallResult<{}, OPNetEvent<ActiveAttestationVersionUpdatedEvent>[]>;

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

/**
 * @description Represents the result of the computeMintAttestationHash function call.
 */
export type ComputeMintAttestationHash = CallResult<
    {
        messageHash: Uint8Array;
    },
    OPNetEvent<never>[]
>;

// ------------------------------------------------------------------
// IOpBridgeBridge
// ------------------------------------------------------------------
export interface IOpBridgeBridge extends IOP_NETContract {
    mintWithRelaySignatures(
        asset: number,
        ethereumUser: Uint8Array,
        recipient: Address,
        amount: bigint,
        depositId: bigint,
        attestationVersion: number,
        relayIndexesPacked: Uint8Array,
        relaySignaturesPacked: Uint8Array,
    ): Promise<MintWithRelaySignatures>;
    requestBurn(asset: number, from: Address, ethereumRecipient: Address, amount: bigint): Promise<RequestBurn>;
    setRelayPubKey(relayIndex: number, relayPubKey: Uint8Array): Promise<SetRelayPubKey>;
    setRelayPubKeysPacked(relayPubKeysPacked: Uint8Array): Promise<SetRelayPubKeysPacked>;
    setRelaysConfigPacked(relayPubKeysPacked: Uint8Array, newThreshold: number): Promise<SetRelaysConfigPacked>;
    setWrappedToken(asset: number, token: Address): Promise<SetWrappedToken>;
    setSupportedAssetsPacked(assetsPacked: Uint8Array): Promise<SetSupportedAssetsPacked>;
    removeSupportedAsset(asset: number): Promise<RemoveSupportedAsset>;
    removeSupportedAssetsPacked(assetIdsPacked: Uint8Array): Promise<RemoveSupportedAssetsPacked>;
    wrappedToken(asset: number): Promise<WrappedToken>;
    supportedAssetCount(): Promise<SupportedAssetCount>;
    supportedAssetAt(index: number): Promise<SupportedAssetAt>;
    isSignatureEnforced(): Promise<IsSignatureEnforced>;
    paused(): Promise<Paused>;
    relayThreshold(): Promise<RelayThreshold>;
    relayCount(): Promise<RelayCount>;
    relayPubKeyHashAt(relayIndex: number): Promise<RelayPubKeyHashAt>;
    relayPubKeyHashesPacked(): Promise<RelayPubKeyHashesPacked>;
    setRelayCount(newRelayCount: number): Promise<SetRelayCount>;
    setRelayThreshold(newThreshold: number): Promise<SetRelayThreshold>;
    setPaused(paused: boolean): Promise<SetPaused>;
    setEthereumVault(ethereumVault: Address): Promise<SetEthereumVault>;
    ethereumVault(): Promise<EthereumVault>;
    activeAttestationVersion(): Promise<ActiveAttestationVersion>;
    isAttestationVersionAccepted(version: number): Promise<IsAttestationVersionAccepted>;
    setAttestationVersionAccepted(version: number, accepted: boolean): Promise<SetAttestationVersionAccepted>;
    setActiveAttestationVersion(version: number): Promise<SetActiveAttestationVersion>;
    owner(): Promise<Owner>;
    transferOwnership(newOwner: Address): Promise<TransferOwnership>;
    computeMintAttestationHash(
        asset: number,
        ethereumUser: Uint8Array,
        recipient: Address,
        amount: bigint,
        depositId: bigint,
        attestationVersion: number,
    ): Promise<ComputeMintAttestationHash>;
}
