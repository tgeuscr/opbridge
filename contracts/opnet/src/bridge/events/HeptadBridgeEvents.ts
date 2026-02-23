import {
    ADDRESS_BYTE_LENGTH,
    Address,
    BytesWriter,
    NetEvent,
    U256_BYTE_LENGTH,
    U8_BYTE_LENGTH,
} from '@btc-vision/btc-runtime/runtime';
import { u256 } from '@btc-vision/as-bignum/assembly';

@final
export class MintFinalizedEvent extends NetEvent {
    constructor(assetId: u8, recipient: Address, amount: u256, depositId: u256) {
        const data: BytesWriter = new BytesWriter(U8_BYTE_LENGTH + ADDRESS_BYTE_LENGTH + U256_BYTE_LENGTH * 2);
        data.writeU8(assetId);
        data.writeAddress(recipient);
        data.writeU256(amount);
        data.writeU256(depositId);

        super('MintFinalized', data);
    }
}

@final
export class BurnRequestedEvent extends NetEvent {
    constructor(assetId: u8, from: Address, amount: u256, withdrawalId: u256) {
        const data: BytesWriter = new BytesWriter(U8_BYTE_LENGTH + ADDRESS_BYTE_LENGTH + U256_BYTE_LENGTH * 2);
        data.writeU8(assetId);
        data.writeAddress(from);
        data.writeU256(amount);
        data.writeU256(withdrawalId);

        super('BurnRequested', data);
    }
}

@final
export class SignatureEnforcementChangedEvent extends NetEvent {
    constructor(enabled: boolean) {
        const data: BytesWriter = new BytesWriter(1);
        data.writeBoolean(enabled);

        super('SignatureEnforcementChanged', data);
    }
}

@final
export class BridgePausedUpdatedEvent extends NetEvent {
    constructor(paused: boolean) {
        const data: BytesWriter = new BytesWriter(1);
        data.writeBoolean(paused);

        super('BridgePausedUpdated', data);
    }
}

@final
export class RelayUpdatedEvent extends NetEvent {
    constructor(index: u8, relayHash: Address) {
        const data: BytesWriter = new BytesWriter(U8_BYTE_LENGTH + ADDRESS_BYTE_LENGTH);
        data.writeU8(index);
        data.writeAddress(relayHash);

        super('RelayUpdated', data);
    }
}

@final
export class RelayThresholdUpdatedEvent extends NetEvent {
    constructor(requiredSignatures: u8) {
        const data: BytesWriter = new BytesWriter(U8_BYTE_LENGTH);
        data.writeU8(requiredSignatures);

        super('RelayThresholdUpdated', data);
    }
}

@final
export class RelayCountUpdatedEvent extends NetEvent {
    constructor(relayCount: u8) {
        const data: BytesWriter = new BytesWriter(U8_BYTE_LENGTH);
        data.writeU8(relayCount);

        super('RelayCountUpdated', data);
    }
}

@final
export class WrappedTokenUpdatedEvent extends NetEvent {
    constructor(assetId: u8, token: Address) {
        const data: BytesWriter = new BytesWriter(U8_BYTE_LENGTH + ADDRESS_BYTE_LENGTH);
        data.writeU8(assetId);
        data.writeAddress(token);

        super('WrappedTokenUpdated', data);
    }
}

@final
export class OwnershipTransferredEvent extends NetEvent {
    constructor(previousOwner: Address, newOwner: Address) {
        const data: BytesWriter = new BytesWriter(ADDRESS_BYTE_LENGTH * 2);
        data.writeAddress(previousOwner);
        data.writeAddress(newOwner);

        super('OwnershipTransferred', data);
    }
}

@final
export class ActiveAttestationVersionUpdatedEvent extends NetEvent {
    constructor(previousVersion: u8, nextVersion: u8) {
        const data: BytesWriter = new BytesWriter(U8_BYTE_LENGTH * 2);
        data.writeU8(previousVersion);
        data.writeU8(nextVersion);

        super('ActiveAttestationVersionUpdated', data);
    }
}

@final
export class AttestationVersionAcceptanceUpdatedEvent extends NetEvent {
    constructor(version: u8, accepted: boolean) {
        const data: BytesWriter = new BytesWriter(U8_BYTE_LENGTH + 1);
        data.writeU8(version);
        data.writeBoolean(accepted);

        super('AttestationVersionAcceptanceUpdated', data);
    }
}
