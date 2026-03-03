import { u256 } from '@btc-vision/as-bignum/assembly';
import {
    Address,
    Blockchain,
    BytesWriter,
    Calldata,
    OP_NET,
    Revert,
    StoredAddress,
    StoredAddressArray,
    StoredU32,
    StoredU8Array,
    StoredMapU256,
} from '@btc-vision/btc-runtime/runtime';
import {
    ActiveAttestationVersionUpdatedEvent,
    AttestationVersionAcceptanceUpdatedEvent,
    BridgePausedUpdatedEvent,
    BurnRequestedEvent,
    MintFinalizedEvent,
    OwnershipTransferredEvent,
    RelayCountUpdatedEvent,
    RelayThresholdUpdatedEvent,
    RelayUpdatedEvent,
    WrappedTokenUpdatedEvent,
} from './events/HeptadBridgeEvents';

const wrappedTokensPointer: u16 = Blockchain.nextPointer;
const relayPubKeyHashesPointer: u16 = Blockchain.nextPointer;

const relayPubKeysPointer: u16 = Blockchain.nextPointer;
const assetEnabledPointer: u16 = Blockchain.nextPointer;
const assetDecimalsPointer: u16 = Blockchain.nextPointer;
const supportedAssetIdsPointer: u16 = Blockchain.nextPointer;
const assetConfigPointer: u16 = Blockchain.nextPointer;
const assetSymbolsPointer: u16 = Blockchain.nextPointer;

const ownerPointer: u16 = Blockchain.nextPointer;

const processedDepositsPointer:    u16 = Blockchain.nextPointer;
const processedWithdrawalsPointer: u16 = Blockchain.nextPointer;

const relayConfigPointer: u16 = Blockchain.nextPointer;
const ethereumVaultPointer: u16 = Blockchain.nextPointer;
const attestationConfigPointer: u16 = Blockchain.nextPointer;
const attestationAcceptedVersionsPointer: u16 = Blockchain.nextPointer;

// sha256("mint(address,uint256)")[:4]
const TOKEN_MINT_SELECTOR: u32 = 0x3950e061;

// sha256("burnFrom(address,uint256)")[:4]
const TOKEN_BURN_FROM_SELECTOR: u32 = 0x1646b13c;

const DEFAULT_ATTESTATION_VERSION: u8 = 1;
const DIRECTION_ETH_TO_OP_MINT: u8  = 1;
const MAX_RELAY_COUNT:          u8  = 32;
const MIN_RELAY_COUNT:          u8  = 1;
const MIN_RELAY_THRESHOLD:      u8  = 1;
const RELAY_PUBKEY_BYTES:       i32 = 1312;
const RELAY_SIGNATURE_BYTES:    i32 = 2420;
const ASSET_SYMBOL_BYTES:       i32 = 16;
const ASSET_ENTRY_BYTES:        i32 = 1 + 32 + 1 + ASSET_SYMBOL_BYTES;
const RELAY_CONFIG_SUBPOINTER = new Uint8Array(0);
const ATTESTATION_CONFIG_SUBPOINTER = new Uint8Array(0);
const ATTESTATION_ACCEPTED_VERSIONS_SUBPOINTER = new Uint8Array(0);
const RELAY_PUBKEY_HASHES_SUBPOINTER = new Uint8Array(0);
const WRAPPED_TOKENS_SUBPOINTER = new Uint8Array(0);
const ASSET_CONFIG_SUBPOINTER = new Uint8Array(0);
const ASSET_ENABLED_SUBPOINTER = new Uint8Array(0);
const ASSET_DECIMALS_SUBPOINTER = new Uint8Array(0);
const SUPPORTED_ASSET_IDS_SUBPOINTER = new Uint8Array(0);
const MAX_ASSET_SLOTS: u32 = 256;
const RELAY_CONFIG_INDEX_COUNT: u8 = 0;
const RELAY_CONFIG_INDEX_THRESHOLD: u8 = 1;
const RELAY_CONFIG_INDEX_PAUSED: u8 = 2;
const ATTESTATION_CONFIG_INDEX_ACTIVE_VERSION: u8 = 0;
const ASSET_CONFIG_INDEX_COUNT: u8 = 0;
const MAX_ATTESTATION_VERSIONS: u32 = 256;

function relayPubKeySubPointer(index: u8): Uint8Array {
    const pointer = new Uint8Array(1);
    pointer[0] = index;
    return pointer;
}

function assetSymbolSubPointer(assetId: u8): Uint8Array {
    const pointer = new Uint8Array(1);
    pointer[0] = assetId;
    return pointer;
}

@external('env', 'verifySignature')
declare function hostVerifySignature(
    publicKey: ArrayBuffer,
    signature: ArrayBuffer,
    message: ArrayBuffer,
): u32;

@final
export class HeptadBridge extends OP_NET {
    private _wrappedTokens: StoredAddressArray | null = null;
    private _relayPubKeyHashes: StoredAddressArray | null = null;
    private _assetEnabled: StoredU8Array | null = null;
    private _assetDecimals: StoredU8Array | null = null;
    private _supportedAssetIds: StoredU8Array | null = null;

    private _owner: StoredAddress | null = null;
    private _ethereumVault: StoredAddress | null = null;
    private _relayConfig: StoredU32 | null = null;
    private _attestationConfig: StoredU32 | null = null;
    private _attestationAcceptedVersions: StoredU8Array | null = null;
    private _assetConfig: StoredU32 | null = null;

    private _processedDeposits: StoredMapU256 | null = null;
    private _processedWithdrawals: StoredMapU256 | null = null;

    public constructor() {
        super();
    }

    private _wrappedTokensStore(): StoredAddressArray {
        if (this._wrappedTokens === null) {
            this._wrappedTokens = new StoredAddressArray(
                wrappedTokensPointer,
                WRAPPED_TOKENS_SUBPOINTER,
                MAX_ASSET_SLOTS,
            );
        }
        return this._wrappedTokens!;
    }

    private _relayPubKeyHashesStore(): StoredAddressArray {
        if (this._relayPubKeyHashes === null) {
            this._relayPubKeyHashes = new StoredAddressArray(
                relayPubKeyHashesPointer,
                RELAY_PUBKEY_HASHES_SUBPOINTER,
                <u32>MAX_RELAY_COUNT,
            );
        }
        return this._relayPubKeyHashes!;
    }

    private _assetEnabledStore(): StoredU8Array {
        if (this._assetEnabled === null) {
            this._assetEnabled = new StoredU8Array(
                assetEnabledPointer,
                ASSET_ENABLED_SUBPOINTER,
                MAX_ASSET_SLOTS,
            );
        }
        return this._assetEnabled!;
    }

    private _assetDecimalsStore(): StoredU8Array {
        if (this._assetDecimals === null) {
            this._assetDecimals = new StoredU8Array(
                assetDecimalsPointer,
                ASSET_DECIMALS_SUBPOINTER,
                MAX_ASSET_SLOTS,
            );
        }
        return this._assetDecimals!;
    }

    private _supportedAssetIdsStore(): StoredU8Array {
        if (this._supportedAssetIds === null) {
            this._supportedAssetIds = new StoredU8Array(
                supportedAssetIdsPointer,
                SUPPORTED_ASSET_IDS_SUBPOINTER,
                MAX_ASSET_SLOTS,
            );
        }
        return this._supportedAssetIds!;
    }

    private _ownerStore(): StoredAddress {
        if (this._owner === null) {
            this._owner = new StoredAddress(ownerPointer);
        }
        return this._owner!;
    }

    private _ethereumVaultStore(): StoredAddress {
        if (this._ethereumVault === null) {
            this._ethereumVault = new StoredAddress(ethereumVaultPointer);
        }
        return this._ethereumVault!;
    }

    private _relayConfigStore(): StoredU32 {
        if (this._relayConfig === null) {
            this._relayConfig = new StoredU32(relayConfigPointer, RELAY_CONFIG_SUBPOINTER);
        }
        return this._relayConfig!;
    }

    private _attestationConfigStore(): StoredU32 {
        if (this._attestationConfig === null) {
            this._attestationConfig = new StoredU32(attestationConfigPointer, ATTESTATION_CONFIG_SUBPOINTER);
        }
        return this._attestationConfig!;
    }

    private _attestationAcceptedVersionsStore(): StoredU8Array {
        if (this._attestationAcceptedVersions === null) {
            this._attestationAcceptedVersions = new StoredU8Array(
                attestationAcceptedVersionsPointer,
                ATTESTATION_ACCEPTED_VERSIONS_SUBPOINTER,
                MAX_ATTESTATION_VERSIONS,
            );
        }
        return this._attestationAcceptedVersions!;
    }

    private _assetConfigStore(): StoredU32 {
        if (this._assetConfig === null) {
            this._assetConfig = new StoredU32(assetConfigPointer, ASSET_CONFIG_SUBPOINTER);
        }
        return this._assetConfig!;
    }

    private _processedDepositsStore(): StoredMapU256 {
        if (this._processedDeposits === null) {
            this._processedDeposits = new StoredMapU256(processedDepositsPointer);
        }
        return this._processedDeposits!;
    }

    private _processedWithdrawalsStore(): StoredMapU256 {
        if (this._processedWithdrawals === null) {
            this._processedWithdrawals = new StoredMapU256(processedWithdrawalsPointer);
        }
        return this._processedWithdrawals!;
    }

    public override onDeployment(_: Calldata): void {
        const deployer = Blockchain.tx.sender;
        const startsPaused = true;

        this._ownerStore().value = deployer;
        this._ethereumVaultStore().value = Address.zero();
        this._relayConfigStore().set(RELAY_CONFIG_INDEX_COUNT, 0);
        this._relayConfigStore().set(RELAY_CONFIG_INDEX_THRESHOLD, 0);
        this._relayConfigStore().set(RELAY_CONFIG_INDEX_PAUSED, startsPaused ? 1 : 0);
        this._relayConfigStore().save();
        this._attestationConfigStore().set(
            ATTESTATION_CONFIG_INDEX_ACTIVE_VERSION,
            DEFAULT_ATTESTATION_VERSION,
        );
        this._attestationConfigStore().save();
        this._attestationAcceptedVersionsStore().set_physical(<u32>DEFAULT_ATTESTATION_VERSION, 1);
        this._attestationAcceptedVersionsStore().save();
        this._assetConfigStore().set(ASSET_CONFIG_INDEX_COUNT, 0);
        this._assetConfigStore().save();
        this.emitEvent(new BridgePausedUpdatedEvent(startsPaused));
        this.emitEvent(new OwnershipTransferredEvent(Address.zero(), deployer));
        this.emitEvent(
            new ActiveAttestationVersionUpdatedEvent(0, DEFAULT_ATTESTATION_VERSION),
        );
        this.emitEvent(
            new AttestationVersionAcceptanceUpdatedEvent(DEFAULT_ATTESTATION_VERSION, true),
        );
    }

    @method(
        { name: 'asset', type: ABIDataTypes.UINT8 },
        { name: 'ethereumUser', type: ABIDataTypes.BYTES32 },
        { name: 'recipient', type: ABIDataTypes.ADDRESS },
        { name: 'amount', type: ABIDataTypes.UINT256 },
        { name: 'depositId', type: ABIDataTypes.UINT256 },
        { name: 'attestationVersion', type: ABIDataTypes.UINT8 },
        { name: 'relayIndexesPacked', type: ABIDataTypes.BYTES },
        { name: 'relaySignaturesPacked', type: ABIDataTypes.BYTES },
    )
    @emit('MintFinalized')
    public mintWithRelaySignatures(calldata: Calldata): BytesWriter {
        const asset = calldata.readU8();
        const ethereumUser = calldata.readBytes(32);
        const recipient = calldata.readAddress();
        const amount = calldata.readU256();
        const depositId = calldata.readU256();
        const attestationVersion = calldata.readU8();
        const relayIndexesPacked = calldata.readBytesWithLength();
        const relaySignaturesPacked = calldata.readBytesWithLength();

        this._requireNotPaused();

        // Fail fast on cheap state checks before expensive signature verification.
        this._requireBytes32NonZero(ethereumUser, 'Invalid ethereum user');
        this._requireValidAddress(recipient, 'Invalid recipient');
        this._requireNonZeroAmount(amount);
        this._assertUnusedDeposit(depositId);
        this._requireAttestationVersionAccepted(attestationVersion);
        const token = this._tokenForAsset(asset);

        if (
            relayIndexesPacked.length === 0 ||
            relayIndexesPacked.length > <i32>MAX_RELAY_COUNT
        ) {
            throw new Revert('Invalid relay index count');
        }
        if (
            relaySignaturesPacked.length % RELAY_SIGNATURE_BYTES !== 0 ||
            relaySignaturesPacked.length === 0
        ) {
            throw new Revert('Invalid relay signature count');
        }

        const signatureCount = <u8>(relaySignaturesPacked.length / RELAY_SIGNATURE_BYTES);
        if (signatureCount !== relayIndexesPacked.length) {
            throw new Revert('Relay index/signature count mismatch');
        }

        const relayIndexes = new Array<u8>(relayIndexesPacked.length);
        for (let i = 0; i < relayIndexesPacked.length; i++) {
            relayIndexes[i] = relayIndexesPacked[i];
        }

        const signatures = new Array<Uint8Array>(signatureCount);
        for (let i: u8 = 0; i < signatureCount; i++) {
            const start = <i32>i * RELAY_SIGNATURE_BYTES;
            signatures[i] = relaySignaturesPacked.slice(start, start + RELAY_SIGNATURE_BYTES);
        }

        const messageHash = this._mintAttestationHash(
            attestationVersion,
            asset,
            ethereumUser,
            recipient,
            amount,
            depositId,
        );
        this._verifyRelayAttestationsThresholdStoredPubKeys(
            messageHash,
            relayIndexes,
            signatures,
            this._currentRelayCount(),
            this._currentRelayThreshold(),
        );
        this._finalizeMintWithToken(asset, recipient, amount, depositId, token);

        return new BytesWriter(0);
    }

    @method(
        { name: 'asset', type: ABIDataTypes.UINT8 },
        { name: 'from', type: ABIDataTypes.ADDRESS },
        { name: 'ethereumRecipient', type: ABIDataTypes.ADDRESS },
        { name: 'amount', type: ABIDataTypes.UINT256 },
        { name: 'withdrawalId', type: ABIDataTypes.UINT256 },
    )
    @emit('BurnRequested')
    public requestBurn(calldata: Calldata): BytesWriter {
        const asset = calldata.readU8();
        const from = calldata.readAddress();
        const ethereumRecipient = calldata.readAddress();
        const amount = calldata.readU256();
        const withdrawalId = calldata.readU256();

        this._requireNotPaused();

        this._requireValidAddress(from, 'Invalid burn account');
        if (!from.equals(Blockchain.tx.sender)) {
            throw new Revert('Burn account must match sender');
        }
        this._requireValidAddress(ethereumRecipient, 'Invalid ethereum recipient');
        this._requireNonZeroAmount(amount);
        this._assertUnusedWithdrawal(withdrawalId);

        const token = this._tokenForAsset(asset);

        const burnWriter = new BytesWriter(4 + 32 + 32);
        burnWriter.writeSelector(TOKEN_BURN_FROM_SELECTOR);
        burnWriter.writeAddress(from);
        burnWriter.writeU256(amount);

        Blockchain.call(token, burnWriter, true);

        this._processedWithdrawalsStore().set(withdrawalId, u256.One);
        this.emitEvent(new BurnRequestedEvent(asset, from, ethereumRecipient, amount, withdrawalId));

        return new BytesWriter(0);
    }

    @method(
        { name: 'relayIndex', type: ABIDataTypes.UINT8 },
        { name: 'relayPubKey', type: ABIDataTypes.BYTES },
    )
    public setRelayPubKey(calldata: Calldata): BytesWriter {
        this._onlyOwner();
        this._requirePaused();

        const relayIndex = calldata.readU8();
        const relayPubKey = calldata.readBytesWithLength();
        this._setRelayPubKey(relayIndex, relayPubKey);

        return new BytesWriter(0);
    }

    @method({ name: 'relayPubKeysPacked', type: ABIDataTypes.BYTES })
    public setRelayPubKeysPacked(calldata: Calldata): BytesWriter {
        this._onlyOwner();
        this._requirePaused();

        const relayPubKeysPacked = calldata.readBytesWithLength();
        if (
            relayPubKeysPacked.length % RELAY_PUBKEY_BYTES !== 0 ||
            relayPubKeysPacked.length < RELAY_PUBKEY_BYTES * MIN_RELAY_COUNT ||
            relayPubKeysPacked.length > RELAY_PUBKEY_BYTES * MAX_RELAY_COUNT
        ) {
            throw new Revert('Packed relay pubkeys must contain 1..32 keys (1312 bytes each)');
        }

        const relayCount = <u8>(relayPubKeysPacked.length / RELAY_PUBKEY_BYTES);
        for (let i: u8 = 0; i < relayCount; i++) {
            const start = <i32>i * RELAY_PUBKEY_BYTES;
            const relayPubKey = relayPubKeysPacked.slice(start, start + RELAY_PUBKEY_BYTES);
            this._setRelayPubKey(i, relayPubKey);
        }

        return new BytesWriter(0);
    }

    @method(
        { name: 'relayPubKeysPacked', type: ABIDataTypes.BYTES },
        { name: 'newThreshold', type: ABIDataTypes.UINT8 },
    )
    public setRelaysConfigPacked(calldata: Calldata): BytesWriter {
        this._onlyOwner();
        this._requirePaused();

        const relayPubKeysPacked = calldata.readBytesWithLength();
        const newThreshold = calldata.readU8();
        this._setRelaysConfigPacked(relayPubKeysPacked, newThreshold);
        return new BytesWriter(0);
    }

    @method(
        { name: 'asset', type: ABIDataTypes.UINT8 },
        { name: 'token', type: ABIDataTypes.ADDRESS },
    )
    @emit('WrappedTokenUpdated')
    public setWrappedToken(calldata: Calldata): BytesWriter {
        this._onlyOwner();
        this._requirePaused();

        const asset = calldata.readU8();
        const token = calldata.readAddress();
        if (this._assetEnabledStore().get_physical(<u32>asset) !== 1) {
            throw new Revert('Asset not supported');
        }
        this._requireValidAddress(token, 'Invalid wrapped token');
        this._wrappedTokensStore().set_physical(<u32>asset, token);
        this._wrappedTokensStore().save();

        this.emitEvent(new WrappedTokenUpdatedEvent(asset, token));

        return new BytesWriter(0);
    }

    @method({ name: 'assetsPacked', type: ABIDataTypes.BYTES })
    public setSupportedAssetsPacked(calldata: Calldata): BytesWriter {
        this._onlyOwner();
        this._requirePaused();

        const assetsPacked = calldata.readBytesWithLength();
        this._addSupportedAssetsPacked(assetsPacked);
        return new BytesWriter(0);
    }

    @method({ name: 'asset', type: ABIDataTypes.UINT8 })
    public removeSupportedAsset(calldata: Calldata): BytesWriter {
        this._onlyOwner();
        this._requirePaused();
        const asset = calldata.readU8();
        this._removeSupportedAsset(asset);
        return new BytesWriter(0);
    }

    @method({ name: 'assetIdsPacked', type: ABIDataTypes.BYTES })
    public removeSupportedAssetsPacked(calldata: Calldata): BytesWriter {
        this._onlyOwner();
        this._requirePaused();

        const assetIdsPacked = calldata.readBytesWithLength();
        this._removeSupportedAssetsPacked(assetIdsPacked);
        return new BytesWriter(0);
    }

    @method({ name: 'asset', type: ABIDataTypes.UINT8 })
    @returns({ name: 'token', type: ABIDataTypes.ADDRESS })
    public wrappedToken(calldata: Calldata): BytesWriter {
        const asset = calldata.readU8();
        const response = new BytesWriter(32);
        response.writeAddress(this._wrappedTokensStore().get_physical(<u32>asset));
        return response;
    }

    @method()
    @returns({ name: 'count', type: ABIDataTypes.UINT16 })
    public supportedAssetCount(_: Calldata): BytesWriter {
        const response = new BytesWriter(2);
        response.writeU16(<u16>this._currentAssetCount());
        return response;
    }

    @method({ name: 'index', type: ABIDataTypes.UINT16 })
    @returns(
        { name: 'assetId', type: ABIDataTypes.UINT8 },
        { name: 'token', type: ABIDataTypes.ADDRESS },
        { name: 'decimals', type: ABIDataTypes.UINT8 },
        { name: 'symbol', type: ABIDataTypes.BYTES },
    )
    public supportedAssetAt(calldata: Calldata): BytesWriter {
        const index = <u32>calldata.readU16();
        const count = this._currentAssetCount();
        if (index >= count) {
            throw new Revert('Asset index out of range');
        }

        const assetId = this._supportedAssetIdsStore().get_physical(index);
        const token = this._wrappedTokensStore().get_physical(<u32>assetId);
        const decimals = this._assetDecimalsStore().get_physical(<u32>assetId);
        const symbol = this._loadAssetSymbol(assetId);

        const response = new BytesWriter(1 + 32 + 1 + 4 + ASSET_SYMBOL_BYTES);
        response.writeU8(assetId);
        response.writeAddress(token);
        response.writeU8(decimals);
        response.writeBytesWithLength(symbol);
        return response;
    }

    @method()
    @returns({ name: 'enabled', type: ABIDataTypes.BOOL })
    public isSignatureEnforced(_: Calldata): BytesWriter {
        const response = new BytesWriter(1);
        response.writeBoolean(!this._isPaused());
        return response;
    }

    @method()
    @returns({ name: 'paused', type: ABIDataTypes.BOOL })
    public paused(_: Calldata): BytesWriter {
        const response = new BytesWriter(1);
        response.writeBoolean(this._isPaused());
        return response;
    }

    @method()
    @returns({ name: 'requiredSignatures', type: ABIDataTypes.UINT8 })
    public relayThreshold(_: Calldata): BytesWriter {
        const response = new BytesWriter(1);
        response.writeU8(this._currentRelayThreshold());
        return response;
    }

    @method()
    @returns({ name: 'relayCount', type: ABIDataTypes.UINT8 })
    public relayCount(_: Calldata): BytesWriter {
        const response = new BytesWriter(1);
        response.writeU8(this._currentRelayCount());
        return response;
    }

    @method({ name: 'relayIndex', type: ABIDataTypes.UINT8 })
    @returns({ name: 'relayPubKeyHash', type: ABIDataTypes.ADDRESS })
    public relayPubKeyHashAt(calldata: Calldata): BytesWriter {
        const relayIndex = calldata.readU8();
        if (relayIndex >= this._currentRelayCount()) {
            throw new Revert('Relay index out of range');
        }

        const response = new BytesWriter(32);
        response.writeAddress(this._relayPubKeyHash(relayIndex));
        return response;
    }

    @method()
    @returns({ name: 'relayPubKeyHashesPacked', type: ABIDataTypes.BYTES })
    public relayPubKeyHashesPacked(_: Calldata): BytesWriter {
        const relayCount = this._currentRelayCount();
        const packed = new Uint8Array(<i32>relayCount * 32);
        for (let i: u8 = 0; i < relayCount; i++) {
            const hash = this._relayPubKeyHash(i);
            for (let j: i32 = 0; j < 32; j++) {
                packed[(<i32>i * 32) + j] = hash[j];
            }
        }

        const response = new BytesWriter(4 + packed.length);
        response.writeBytesWithLength(packed);
        return response;
    }

    @method({ name: 'newRelayCount', type: ABIDataTypes.UINT8 })
    @emit('RelayCountUpdated')
    public setRelayCount(calldata: Calldata): BytesWriter {
        this._onlyOwner();
        this._requirePaused();

        const next = calldata.readU8();
        if (next < MIN_RELAY_COUNT || next > MAX_RELAY_COUNT) {
            throw new Revert('Relay count out of range');
        }
        if (next < this._currentRelayThreshold()) {
            throw new Revert('Relay count below threshold');
        }

        this._relayConfigStore().set(RELAY_CONFIG_INDEX_COUNT, next);
        this._relayConfigStore().save();
        this.emitEvent(new RelayCountUpdatedEvent(next));
        return new BytesWriter(0);
    }

    @method({ name: 'newThreshold', type: ABIDataTypes.UINT8 })
    @emit('RelayThresholdUpdated')
    public setRelayThreshold(calldata: Calldata): BytesWriter {
        this._onlyOwner();
        this._requirePaused();

        const next = calldata.readU8();
        if (next < MIN_RELAY_THRESHOLD || next > MAX_RELAY_COUNT) {
            throw new Revert('Relay threshold out of range');
        }
        if (next > this._currentRelayCount()) {
            throw new Revert('Relay threshold exceeds relay count');
        }

        this._relayConfigStore().set(RELAY_CONFIG_INDEX_THRESHOLD, next);
        this._relayConfigStore().save();
        this.emitEvent(new RelayThresholdUpdatedEvent(next));
        return new BytesWriter(0);
    }

    @method({ name: 'paused', type: ABIDataTypes.BOOL })
    @emit('BridgePausedUpdated')
    public setPaused(calldata: Calldata): BytesWriter {
        this._onlyOwner();

        const next = calldata.readBoolean();
        if (!next) {
            this._assertReadyToUnpause();
        }
        this._relayConfigStore().set(RELAY_CONFIG_INDEX_PAUSED, next ? 1 : 0);
        this._relayConfigStore().save();
        this.emitEvent(new BridgePausedUpdatedEvent(next));
        return new BytesWriter(0);
    }

    @method({ name: 'ethereumVault', type: ABIDataTypes.ADDRESS })
    public setEthereumVault(calldata: Calldata): BytesWriter {
        this._onlyOwner();
        this._requirePaused();

        const ethereumVault = calldata.readAddress();
        this._requireValidAddress(ethereumVault, 'Invalid ethereum vault');
        this._ethereumVaultStore().value = ethereumVault;
        return new BytesWriter(0);
    }

    @method()
    @returns({ name: 'ethereumVault', type: ABIDataTypes.ADDRESS })
    public ethereumVault(_: Calldata): BytesWriter {
        const response = new BytesWriter(32);
        response.writeAddress(this._ethereumVaultStore().value);
        return response;
    }

    @method()
    @returns({ name: 'version', type: ABIDataTypes.UINT8 })
    public activeAttestationVersion(_: Calldata): BytesWriter {
        const response = new BytesWriter(1);
        response.writeU8(this._activeAttestationVersion());
        return response;
    }

    @method({ name: 'version', type: ABIDataTypes.UINT8 })
    @returns({ name: 'accepted', type: ABIDataTypes.BOOL })
    public isAttestationVersionAccepted(calldata: Calldata): BytesWriter {
        const version = calldata.readU8();
        const response = new BytesWriter(1);
        response.writeBoolean(this._isAttestationVersionAccepted(version));
        return response;
    }

    @method(
        { name: 'version', type: ABIDataTypes.UINT8 },
        { name: 'accepted', type: ABIDataTypes.BOOL },
    )
    @emit('AttestationVersionAcceptanceUpdated')
    public setAttestationVersionAccepted(calldata: Calldata): BytesWriter {
        this._onlyOwner();
        this._requirePaused();

        const version = calldata.readU8();
        const accepted = calldata.readBoolean();
        this._setAttestationVersionAccepted(version, accepted);
        this.emitEvent(new AttestationVersionAcceptanceUpdatedEvent(version, accepted));
        return new BytesWriter(0);
    }

    @method({ name: 'version', type: ABIDataTypes.UINT8 })
    @emit('ActiveAttestationVersionUpdated')
    public setActiveAttestationVersion(calldata: Calldata): BytesWriter {
        this._onlyOwner();
        this._requirePaused();

        const nextVersion = calldata.readU8();
        if (!this._isAttestationVersionAccepted(nextVersion)) {
            throw new Revert('Attestation version not accepted');
        }
        const previousVersion = this._activeAttestationVersion();
        this._attestationConfigStore().set(ATTESTATION_CONFIG_INDEX_ACTIVE_VERSION, nextVersion);
        this._attestationConfigStore().save();
        this.emitEvent(new ActiveAttestationVersionUpdatedEvent(previousVersion, nextVersion));
        return new BytesWriter(0);
    }

    @method()
    @returns({ name: 'owner', type: ABIDataTypes.ADDRESS })
    public owner(_: Calldata): BytesWriter {
        const response = new BytesWriter(32);
        response.writeAddress(this._ownerStore().value);
        return response;
    }

    @method({ name: 'newOwner', type: ABIDataTypes.ADDRESS })
    @emit('OwnershipTransferred')
    public transferOwnership(calldata: Calldata): BytesWriter {
        this._onlyOwner();

        const newOwner = calldata.readAddress();
        this._requireValidAddress(newOwner, 'Invalid owner');

        const previousOwner = this._ownerStore().value;
        this._ownerStore().value = newOwner;
        this.emitEvent(new OwnershipTransferredEvent(previousOwner, newOwner));

        return new BytesWriter(0);
    }

    @method(
        { name: 'asset', type: ABIDataTypes.UINT8 },
        { name: 'ethereumUser', type: ABIDataTypes.BYTES32 },
        { name: 'recipient', type: ABIDataTypes.ADDRESS },
        { name: 'amount', type: ABIDataTypes.UINT256 },
        { name: 'depositId', type: ABIDataTypes.UINT256 },
        { name: 'attestationVersion', type: ABIDataTypes.UINT8 },
    )
    @returns({ name: 'messageHash', type: ABIDataTypes.BYTES32 })
    public computeMintAttestationHash(calldata: Calldata): BytesWriter {
        const asset = calldata.readU8();
        const ethereumUser = calldata.readBytes(32);
        const recipient = calldata.readAddress();
        const amount = calldata.readU256();
        const depositId = calldata.readU256();
        const attestationVersion = calldata.readU8();

        this._requireBytes32NonZero(ethereumUser, 'Invalid ethereum user');
        const hash = this._mintAttestationHash(
            attestationVersion,
            asset,
            ethereumUser,
            recipient,
            amount,
            depositId,
        );
        const response = new BytesWriter(32);
        response.writeBytes(hash);
        return response;
    }

    private _finalizeMint(asset: u8, recipient: Address, amount: u256, depositId: u256): void {
        this._requireValidAddress(recipient, 'Invalid recipient');
        this._requireNonZeroAmount(amount);
        this._assertUnusedDeposit(depositId);

        const token = this._tokenForAsset(asset);
        this._finalizeMintWithToken(asset, recipient, amount, depositId, token);
    }

    private _finalizeMintWithToken(
        asset: u8,
        recipient: Address,
        amount: u256,
        depositId: u256,
        token: Address,
    ): void {
        const mintWriter = new BytesWriter(4 + 32 + 32);
        mintWriter.writeSelector(TOKEN_MINT_SELECTOR);
        mintWriter.writeAddress(recipient);
        mintWriter.writeU256(amount);

        Blockchain.call(token, mintWriter, true);

        this._processedDepositsStore().set(depositId, u256.One);
        this.emitEvent(new MintFinalizedEvent(asset, recipient, amount, depositId));
    }

    private _verifyRelayAttestationsThresholdStoredPubKeys(
        messageHash: Uint8Array,
        relayIndexes: Array<u8>,
        signatures: Array<Uint8Array>,
        relayCount: u8,
        relayThreshold: u8,
    ): void {
        if (relayIndexes.length === 0 || relayIndexes.length > <i32>MAX_RELAY_COUNT) {
            throw new Revert('Invalid relay index count');
        }
        if (signatures.length === 0 || signatures.length > <i32>MAX_RELAY_COUNT) {
            throw new Revert('Invalid relay signature count');
        }
        if (relayIndexes.length !== signatures.length) {
            throw new Revert('Relay index/signature count mismatch');
        }
        if (relayCount < MIN_RELAY_COUNT || relayCount > MAX_RELAY_COUNT) {
            throw new Revert('Invalid relay count');
        }
        if (
            relayThreshold < MIN_RELAY_THRESHOLD ||
            relayThreshold > MAX_RELAY_COUNT ||
            relayThreshold > relayCount
        ) {
            throw new Revert('Invalid relay threshold');
        }
        if (signatures.length < <i32>relayThreshold) {
            throw new Revert('Not enough relay signatures');
        }

        let seenIndexes: u32 = 0;
        const keyWithType = new Uint8Array(2 + RELAY_PUBKEY_BYTES);
        const keyWithTypePtr = keyWithType.dataStart;
        // Signature method discriminator: 0x02 => MLDSA (runtime SignaturesMethods.MLDSA)
        store<u8>(keyWithTypePtr, 0x02);
        store<u8>(keyWithTypePtr + 1, 0x00); // Level2 (ML-DSA-44)

        for (let i = 0; i < signatures.length; i++) {
            const relayIndex = relayIndexes[i];
            if (relayIndex >= relayCount) {
                throw new Revert('Relay index out of range');
            }

            const relayMask = (<u32>1) << relayIndex;
            if ((seenIndexes & relayMask) !== 0) {
                throw new Revert('Duplicate relay index');
            }
            seenIndexes = seenIndexes | relayMask;

            const signature = signatures[i];
            if (signature.length !== RELAY_SIGNATURE_BYTES) {
                throw new Revert('Invalid ML-DSA signature length.');
            }

            this._loadRelayPubKeyForMint(relayIndex, keyWithType);
            if (!this._verifyMLDSASignatureLevel2CompatPrepared(keyWithType, signature, messageHash)) {
                throw new Revert('Invalid relay signature');
            }
        }
    }

    private _verifyMLDSASignatureLevel2Compat(
        publicKey: Uint8Array,
        signature: Uint8Array,
        hash: Uint8Array,
    ): bool {
        if (publicKey.length !== RELAY_PUBKEY_BYTES) {
            throw new Revert('Invalid ML-DSA public key length.');
        }
        if (signature.length !== RELAY_SIGNATURE_BYTES) {
            throw new Revert('Invalid ML-DSA signature length.');
        }
        if (hash.length !== 32) {
            throw new Revert('Invalid hash length.');
        }

        const writer = new Uint8Array(2 + publicKey.length);
        const ptr = writer.dataStart;

        // Signature method discriminator: 0x02 => MLDSA (runtime SignaturesMethods.MLDSA)
        store<u8>(ptr, 0x02);
        store<u8>(ptr + 1, 0x00); // Level2 (ML-DSA-44)
        memory.copy(ptr + 2, publicKey.dataStart, publicKey.length);

        return hostVerifySignature(writer.buffer, signature.buffer, hash.buffer) === 1;
    }

    private _verifyMLDSASignatureLevel2CompatPrepared(
        keyWithType: Uint8Array,
        signature: Uint8Array,
        hash: Uint8Array,
    ): bool {
        if (keyWithType.length !== 2 + RELAY_PUBKEY_BYTES) {
            throw new Revert('Invalid ML-DSA public key length.');
        }
        if (signature.length !== RELAY_SIGNATURE_BYTES) {
            throw new Revert('Invalid ML-DSA signature length.');
        }
        if (hash.length !== 32) {
            throw new Revert('Invalid hash length.');
        }

        return hostVerifySignature(keyWithType.buffer, signature.buffer, hash.buffer) === 1;
    }

    private _setRelayPubKey(relayIndex: u8, relayPubKey: Uint8Array): void {
        if (relayIndex >= MAX_RELAY_COUNT) {
            throw new Revert('Relay index out of range');
        }
        if (relayPubKey.length !== RELAY_PUBKEY_BYTES) {
            throw new Revert('Invalid ML-DSA public key length.');
        }

        const relayPubKeyStore = this._relayPubKeyStore(relayIndex);
        for (let i: u32 = 0; i < <u32>RELAY_PUBKEY_BYTES; i++) {
            relayPubKeyStore.set_physical(i, relayPubKey[<i32>i]);
        }
        relayPubKeyStore.save();
        const relayHash = Address.fromUint8Array(Blockchain.sha256(relayPubKey));
        this._requireValidAddress(relayHash, 'Invalid relay hash');
        for (let i: u8 = 0; i < MAX_RELAY_COUNT; i++) {
            if (i === relayIndex) {
                continue;
            }
            const existingHash = this._relayPubKeyHash(i);
            if (!existingHash.equals(Address.zero()) && existingHash.equals(relayHash)) {
                throw new Revert('Duplicate relay pubkey');
            }
        }
        this._setRelayPubKeyHash(relayIndex, relayHash);
        this.emitEvent(new RelayUpdatedEvent(relayIndex, relayHash));
    }

    private _loadRelayPubKeyForMint(relayIndex: u8, keyWithType: Uint8Array): void {
        if (keyWithType.length !== 2 + RELAY_PUBKEY_BYTES) {
            throw new Revert('Invalid ML-DSA public key length.');
        }

        const storedPubKeyHash = this._relayPubKeyHash(relayIndex);
        this._requireValidAddress(storedPubKeyHash, 'Relay public key not configured');

        const relayPubKeyStore = this._relayPubKeyStore(relayIndex);
        const writeOffset: i32 = 2;
        for (let i: u32 = 0; i < <u32>RELAY_PUBKEY_BYTES; i++) {
            keyWithType[writeOffset + <i32>i] = relayPubKeyStore.get_physical(i);
        }
        const actualHash = Blockchain.sha256(keyWithType.slice(2, 2 + RELAY_PUBKEY_BYTES));
        if (!this._bytesEqualAddress(actualHash, storedPubKeyHash)) {
            throw new Revert('Relay public key store corrupted');
        }
    }

    private _mintAttestationHash(
        attestationVersion: u8,
        asset: u8,
        ethereumUser: Uint8Array,
        opnetUser: Address,
        amount: u256,
        depositId: u256,
    ): Uint8Array {
        const payload = new BytesWriter(1 + 32 + 32 + 32 + 32 + 1 + 32 + 1 + 32);
        payload.writeU8(attestationVersion);
        payload.writeAddress(this._ethereumVaultStore().value);
        payload.writeAddress(this.address);
        payload.writeBytes(ethereumUser);
        payload.writeAddress(opnetUser);
        payload.writeU8(asset);
        payload.writeU256(amount);
        payload.writeU8(DIRECTION_ETH_TO_OP_MINT);
        payload.writeU256(depositId);
        return Blockchain.sha256(payload.getBuffer());
    }

    private _bytesEqual(a: Uint8Array, b: Uint8Array): bool {
        if (a.length !== b.length) {
            return false;
        }

        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }

        return true;
    }

    private _bytesEqualAddress(a: Uint8Array, b: Address): bool {
        if (a.length !== 32) {
            return false;
        }

        for (let i = 0; i < 32; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }

        return true;
    }

    private _relayPubKeyHash(index: u8): Address {
        if (index >= MAX_RELAY_COUNT) {
            throw new Revert('Relay index out of range');
        }

        return this._relayPubKeyHashesStore().get_physical(<u32>index);
    }

    private _setRelayPubKeyHash(index: u8, relayHash: Address): void {
        if (index >= MAX_RELAY_COUNT) {
            throw new Revert('Relay index out of range');
        }

        this._relayPubKeyHashesStore().set_physical(<u32>index, relayHash);
        this._relayPubKeyHashesStore().save();
    }

    private _relayPubKeyStore(index: u8): StoredU8Array {
        if (index >= MAX_RELAY_COUNT) {
            throw new Revert('Relay index out of range');
        }

        // StoredU8Array constructor reads storage, so instantiate lazily
        // to avoid deployment/start-time storage reads.
        return new StoredU8Array(
            relayPubKeysPointer,
            relayPubKeySubPointer(index),
            <u32>RELAY_PUBKEY_BYTES,
        );
    }

    private _tokenForAsset(asset: u8): Address {
        if (this._assetEnabledStore().get_physical(<u32>asset) !== 1) {
            throw new Revert('Asset not supported');
        }
        const token = this._wrappedTokensStore().get_physical(<u32>asset);
        if (token.equals(Address.zero())) {
            throw new Revert('Wrapped token not configured');
        }

        return token;
    }

    private _currentRelayCount(): u8 {
        const configured = <u8>this._relayConfigStore().get(RELAY_CONFIG_INDEX_COUNT);
        if (configured > MAX_RELAY_COUNT) {
            return 0;
        }

        return configured;
    }

    private _currentRelayThreshold(): u8 {
        const configured = <u8>this._relayConfigStore().get(RELAY_CONFIG_INDEX_THRESHOLD);
        if (configured > MAX_RELAY_COUNT) {
            return 0;
        }

        return configured;
    }

    private _activeAttestationVersion(): u8 {
        return <u8>this._attestationConfigStore().get(ATTESTATION_CONFIG_INDEX_ACTIVE_VERSION);
    }

    private _isAttestationVersionAccepted(version: u8): bool {
        return this._attestationAcceptedVersionsStore().get_physical(<u32>version) === 1;
    }

    private _setAttestationVersionAccepted(version: u8, accepted: bool): void {
        this._attestationAcceptedVersionsStore().set_physical(<u32>version, accepted ? 1 : 0);
        this._attestationAcceptedVersionsStore().save();
    }

    private _currentAssetCount(): u32 {
        const configured = this._assetConfigStore().get(ASSET_CONFIG_INDEX_COUNT);
        if (configured > MAX_ASSET_SLOTS) {
            return 0;
        }
        return configured;
    }

    private _assertUnusedDeposit(depositId: u256): void {
        if (this._processedDepositsStore().get(depositId) > u256.Zero) {
            throw new Revert('Deposit already processed');
        }
    }

    private _assertUnusedWithdrawal(withdrawalId: u256): void {
        if (this._processedWithdrawalsStore().get(withdrawalId) > u256.Zero) {
            throw new Revert('Withdrawal already processed');
        }
    }

    private _setRelaysConfigPacked(relayPubKeysPacked: Uint8Array, newThreshold: u8): void {
        if (
            relayPubKeysPacked.length % RELAY_PUBKEY_BYTES !== 0 ||
            relayPubKeysPacked.length < RELAY_PUBKEY_BYTES * MIN_RELAY_COUNT ||
            relayPubKeysPacked.length > RELAY_PUBKEY_BYTES * MAX_RELAY_COUNT
        ) {
            throw new Revert('Packed relay pubkeys must contain 1..32 keys (1312 bytes each)');
        }

        const relayCount = <u8>(relayPubKeysPacked.length / RELAY_PUBKEY_BYTES);
        if (newThreshold < MIN_RELAY_THRESHOLD || newThreshold > relayCount) {
            throw new Revert('Relay threshold out of range');
        }

        for (let i: u8 = 0; i < relayCount; i++) {
            const start = <i32>i * RELAY_PUBKEY_BYTES;
            const relayPubKey = relayPubKeysPacked.slice(start, start + RELAY_PUBKEY_BYTES);
            this._setRelayPubKey(i, relayPubKey);
        }

        for (let i = <u8>relayCount; i < MAX_RELAY_COUNT; i++) {
            this._setRelayPubKeyHash(i, Address.zero());
        }

        this._relayConfigStore().set(RELAY_CONFIG_INDEX_COUNT, relayCount);
        this._relayConfigStore().set(RELAY_CONFIG_INDEX_THRESHOLD, newThreshold);
        this._relayConfigStore().save();
        this.emitEvent(new RelayCountUpdatedEvent(relayCount));
        this.emitEvent(new RelayThresholdUpdatedEvent(newThreshold));
    }

    private _assetSymbolStore(assetId: u8): StoredU8Array {
        return new StoredU8Array(
            assetSymbolsPointer,
            assetSymbolSubPointer(assetId),
            <u32>ASSET_SYMBOL_BYTES,
        );
    }

    private _setAssetSymbol(assetId: u8, symbolBytes: Uint8Array): void {
        if (symbolBytes.length === 0 || symbolBytes.length > ASSET_SYMBOL_BYTES) {
            throw new Revert('Invalid asset symbol length');
        }

        const symbolStore = this._assetSymbolStore(assetId);
        for (let i: i32 = 0; i < ASSET_SYMBOL_BYTES; i++) {
            symbolStore.set_physical(<u32>i, i < symbolBytes.length ? symbolBytes[i] : 0);
        }
        symbolStore.save();
    }

    private _clearAssetSymbol(assetId: u8): void {
        const symbolStore = this._assetSymbolStore(assetId);
        for (let i: i32 = 0; i < ASSET_SYMBOL_BYTES; i++) {
            symbolStore.set_physical(<u32>i, 0);
        }
        symbolStore.save();
    }

    private _loadAssetSymbol(assetId: u8): Uint8Array {
        const symbolStore = this._assetSymbolStore(assetId);
        let length: i32 = 0;
        for (let i: i32 = 0; i < ASSET_SYMBOL_BYTES; i++) {
            if (symbolStore.get_physical(<u32>i) === 0) {
                break;
            }
            length++;
        }

        const symbol = new Uint8Array(length);
        for (let i: i32 = 0; i < length; i++) {
            symbol[i] = symbolStore.get_physical(<u32>i);
        }
        return symbol;
    }

    private _addSupportedAssetsPacked(assetsPacked: Uint8Array): void {
        if (assetsPacked.length % ASSET_ENTRY_BYTES !== 0) {
            throw new Revert('Invalid packed assets payload');
        }
        const currentCount = this._currentAssetCount();
        const appendCount = <u32>(assetsPacked.length / ASSET_ENTRY_BYTES);
        if (appendCount === 0) {
            throw new Revert('At least one asset is required');
        }
        if (currentCount + appendCount > MAX_ASSET_SLOTS) {
            throw new Revert('Too many assets');
        }

        for (let i: u32 = 0; i < appendCount; i++) {
            const offset = <i32>i * ASSET_ENTRY_BYTES;
            const assetId = assetsPacked[offset];
            const tokenBytes = assetsPacked.slice(offset + 1, offset + 33);
            const token = Address.fromUint8Array(tokenBytes);
            const decimals = assetsPacked[offset + 33];
            const symbolBytes = assetsPacked.slice(offset + 34, offset + 34 + ASSET_SYMBOL_BYTES);

            if (this._assetEnabledStore().get_physical(<u32>assetId) === 1) {
                throw new Revert('Asset id already configured');
            }
            this._requireValidAddress(token, 'Invalid wrapped token');
            if (decimals === 0) {
                throw new Revert('Invalid decimals');
            }

            for (let j: u32 = 0; j < i; j++) {
                const previousOffset = <i32>j * ASSET_ENTRY_BYTES;
                if (assetsPacked[previousOffset] === assetId) {
                    throw new Revert('Duplicate asset id');
                }
            }

            this._supportedAssetIdsStore().set_physical(currentCount + i, assetId);
            this._assetEnabledStore().set_physical(<u32>assetId, 1);
            this._assetDecimalsStore().set_physical(<u32>assetId, decimals);
            this._wrappedTokensStore().set_physical(<u32>assetId, token);
            this._setAssetSymbol(assetId, this._trimZeroPaddedSymbol(symbolBytes));
        }

        this._supportedAssetIdsStore().save();
        this._assetEnabledStore().save();
        this._assetDecimalsStore().save();
        this._wrappedTokensStore().save();
        this._assetConfigStore().set(ASSET_CONFIG_INDEX_COUNT, currentCount + appendCount);
        this._assetConfigStore().save();
    }

    private _removeSupportedAsset(asset: u8): void {
        if (this._assetEnabledStore().get_physical(<u32>asset) !== 1) {
            throw new Revert('Asset not supported');
        }

        const count = this._currentAssetCount();
        let foundIndex: i32 = -1;
        for (let i: u32 = 0; i < count; i++) {
            if (this._supportedAssetIdsStore().get_physical(i) === asset) {
                foundIndex = <i32>i;
                break;
            }
        }
        if (foundIndex < 0) {
            throw new Revert('Asset index missing');
        }

        for (let i = <u32>foundIndex; i + 1 < count; i++) {
            this._supportedAssetIdsStore().set_physical(i, this._supportedAssetIdsStore().get_physical(i + 1));
        }
        this._supportedAssetIdsStore().set_physical(count - 1, 0);
        this._supportedAssetIdsStore().save();

        this._assetEnabledStore().set_physical(<u32>asset, 0);
        this._assetEnabledStore().save();
        this._assetDecimalsStore().set_physical(<u32>asset, 0);
        this._assetDecimalsStore().save();
        this._wrappedTokensStore().set_physical(<u32>asset, Address.zero());
        this._wrappedTokensStore().save();
        this._clearAssetSymbol(asset);

        this._assetConfigStore().set(ASSET_CONFIG_INDEX_COUNT, count - 1);
        this._assetConfigStore().save();
    }

    private _removeSupportedAssetsPacked(assetIdsPacked: Uint8Array): void {
        if (assetIdsPacked.length === 0) {
            throw new Revert('At least one asset id is required');
        }

        for (let i: i32 = 0; i < assetIdsPacked.length; i++) {
            for (let j: i32 = 0; j < i; j++) {
                if (assetIdsPacked[j] === assetIdsPacked[i]) {
                    throw new Revert('Duplicate asset id');
                }
            }
        }

        for (let i: i32 = 0; i < assetIdsPacked.length; i++) {
            this._removeSupportedAsset(assetIdsPacked[i]);
        }
    }

    private _trimZeroPaddedSymbol(value: Uint8Array): Uint8Array {
        let length = value.length;
        while (length > 0 && value[length - 1] === 0) {
            length--;
        }
        if (length === 0) {
            throw new Revert('Asset symbol required');
        }
        return value.slice(0, length);
    }

    private _assertReadyToUnpause(): void {
        const relayCount = this._currentRelayCount();
        const relayThreshold = this._currentRelayThreshold();
        if (relayCount < MIN_RELAY_COUNT || relayCount > MAX_RELAY_COUNT) {
            throw new Revert('Bridge relay config incomplete');
        }
        if (
            relayThreshold < MIN_RELAY_THRESHOLD ||
            relayThreshold > relayCount
        ) {
            throw new Revert('Bridge threshold config incomplete');
        }
        for (let i: u8 = 0; i < relayCount; i++) {
            this._requireValidAddress(this._relayPubKeyHash(i), 'Relay public key not configured');
        }
        if (this._currentAssetCount() === 0) {
            throw new Revert('Bridge assets not configured');
        }
        this._requireValidAddress(this._ethereumVaultStore().value, 'Ethereum vault not configured');
        this._requireAttestationVersionAccepted(this._activeAttestationVersion());
    }

    private _onlyOwner(): void {
        if (!Blockchain.tx.sender.equals(this._ownerStore().value)) {
            throw new Revert('Not owner');
        }
    }

    private _isPaused(): bool {
        return this._relayConfigStore().get(RELAY_CONFIG_INDEX_PAUSED) === 1;
    }

    private _requireNotPaused(): void {
        if (this._isPaused()) {
            throw new Revert('Bridge is paused');
        }
    }

    private _requirePaused(): void {
        if (!this._isPaused()) {
            throw new Revert('Bridge must be paused');
        }
    }

    private _requireValidAddress(value: Address, message: string): void {
        if (value.equals(Address.zero())) {
            throw new Revert(message);
        }
    }

    private _requireNonZeroAmount(value: u256): void {
        if (value.isZero()) {
            throw new Revert('Amount is zero');
        }
    }

    private _requireBytes32NonZero(value: Uint8Array, message: string): void {
        if (value.length !== 32) {
            throw new Revert(message);
        }

        for (let i = 0; i < 32; i++) {
            if (value[i] !== 0) {
                return;
            }
        }

        throw new Revert(message);
    }

    private _requireAttestationVersionAccepted(version: u8): void {
        if (!this._isAttestationVersionAccepted(version)) {
            throw new Revert('Attestation version not accepted');
        }
    }
}
