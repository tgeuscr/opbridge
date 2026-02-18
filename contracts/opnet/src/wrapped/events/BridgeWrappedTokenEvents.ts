import {
    ADDRESS_BYTE_LENGTH,
    Address,
    BytesWriter,
    NetEvent,
    U256_BYTE_LENGTH,
} from '@btc-vision/btc-runtime/runtime';
import { u256 } from '@btc-vision/as-bignum/assembly';

@final
export class BridgeAuthorityChangedEvent extends NetEvent {
    constructor(previousBridge: Address, newBridge: Address) {
        const data: BytesWriter = new BytesWriter(ADDRESS_BYTE_LENGTH * 2);
        data.writeAddress(previousBridge);
        data.writeAddress(newBridge);

        super('BridgeAuthorityChanged', data);
    }
}

@final
export class BridgeMintedEvent extends NetEvent {
    constructor(bridge: Address, recipient: Address, amount: u256) {
        const data: BytesWriter = new BytesWriter(ADDRESS_BYTE_LENGTH * 2 + U256_BYTE_LENGTH);
        data.writeAddress(bridge);
        data.writeAddress(recipient);
        data.writeU256(amount);

        super('BridgeMinted', data);
    }
}

@final
export class BridgeBurnedEvent extends NetEvent {
    constructor(bridge: Address, from: Address, amount: u256) {
        const data: BytesWriter = new BytesWriter(ADDRESS_BYTE_LENGTH * 2 + U256_BYTE_LENGTH);
        data.writeAddress(bridge);
        data.writeAddress(from);
        data.writeU256(amount);

        super('BridgeBurned', data);
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
export class TokenPausedUpdatedEvent extends NetEvent {
    constructor(paused: boolean) {
        const data: BytesWriter = new BytesWriter(1);
        data.writeBoolean(paused);

        super('TokenPausedUpdated', data);
    }
}
