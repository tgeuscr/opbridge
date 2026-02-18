import { u256 } from '@btc-vision/as-bignum/assembly';
import {
    Address,
    Blockchain,
    BytesWriter,
    Calldata,
    OP20,
    OP20InitParameters,
    Revert,
    StoredAddress,
    StoredU32,
} from '@btc-vision/btc-runtime/runtime';
import {
    BridgeAuthorityChangedEvent,
    BridgeBurnedEvent,
    BridgeMintedEvent,
    OwnershipTransferredEvent,
    TokenPausedUpdatedEvent,
} from '../events/BridgeWrappedTokenEvents';

const bridgeAuthorityPointer: u16 = Blockchain.nextPointer;
const ownerPointer: u16 = Blockchain.nextPointer;
const tokenConfigPointer: u16 = Blockchain.nextPointer;
const TOKEN_CONFIG_SUBPOINTER = new Uint8Array(0);
const TOKEN_CONFIG_INDEX_PAUSED: u8 = 0;

@final
export class HETH extends OP20 {
    private readonly _bridgeAuthority: StoredAddress;
    private readonly _owner: StoredAddress;
    private readonly _tokenConfig: StoredU32;

    public constructor() {
        super();
        this._bridgeAuthority = new StoredAddress(bridgeAuthorityPointer);
        this._owner = new StoredAddress(ownerPointer);
        this._tokenConfig = new StoredU32(tokenConfigPointer, TOKEN_CONFIG_SUBPOINTER);
    }

    public override onDeployment(_: Calldata): void {
        const maxSupply: u256 = u256.Max;
        const decimals: u8 = 18;
        const name = 'heptad-bridged ETH';
        const symbol = 'hETH';

        this.instantiate(new OP20InitParameters(maxSupply, decimals, name, symbol));

        const deployer = Blockchain.tx.sender;
        this._owner.value = deployer;
        this._tokenConfig.set(TOKEN_CONFIG_INDEX_PAUSED, 0);
        this._tokenConfig.save();
        this.emitEvent(new OwnershipTransferredEvent(Address.zero(), deployer));
    }

    @method(
        { name: 'to', type: ABIDataTypes.ADDRESS },
        { name: 'amount', type: ABIDataTypes.UINT256 },
    )
    @emit('BridgeMinted')
    public mint(calldata: Calldata): BytesWriter {
        this._onlyBridge();

        const to = calldata.readAddress();
        const amount = calldata.readU256();

        this._requireValidAddress(to, 'Invalid recipient');
        this._requireNonZeroAmount(amount);

        this._mint(to, amount);
        this.emitEvent(new BridgeMintedEvent(Blockchain.tx.sender, to, amount));

        return new BytesWriter(0);
    }

    @method(
        { name: 'from', type: ABIDataTypes.ADDRESS },
        { name: 'amount', type: ABIDataTypes.UINT256 },
    )
    @emit('BridgeBurned')
    public burnFrom(calldata: Calldata): BytesWriter {
        this._onlyBridge();

        const from = calldata.readAddress();
        const amount = calldata.readU256();

        this._requireValidAddress(from, 'Invalid burn account');
        this._requireNonZeroAmount(amount);

        const balance = this._balanceOf(from);
        if (balance < amount) {
            throw new Revert('Insufficient balance');
        }

        this._burn(from, amount);
        this.emitEvent(new BridgeBurnedEvent(Blockchain.tx.sender, from, amount));

        return new BytesWriter(0);
    }

    @method({ name: 'newBridge', type: ABIDataTypes.ADDRESS })
    @emit('BridgeAuthorityChanged')
    public setBridgeAuthority(calldata: Calldata): BytesWriter {
        this._onlyOwner();

        const newBridge = calldata.readAddress();
        this._requireValidAddress(newBridge, 'Invalid bridge authority');

        const previousBridge = this._getBridgeAuthority();
        this._setBridgeAuthority(newBridge);

        this.emitEvent(new BridgeAuthorityChangedEvent(previousBridge, newBridge));

        return new BytesWriter(0);
    }

    @method()
    @returns({ name: 'paused', type: ABIDataTypes.BOOL })
    public paused(_: Calldata): BytesWriter {
        const w = new BytesWriter(1);
        w.writeBoolean(this._isPaused());
        return w;
    }

    @method({ name: 'paused', type: ABIDataTypes.BOOL })
    @emit('TokenPausedUpdated')
    public setPaused(calldata: Calldata): BytesWriter {
        this._onlyOwner();
        const next = calldata.readBoolean();
        this._tokenConfig.set(TOKEN_CONFIG_INDEX_PAUSED, next ? 1 : 0);
        this._tokenConfig.save();
        this.emitEvent(new TokenPausedUpdatedEvent(next));
        return new BytesWriter(0);
    }

    @method(
        { name: 'to', type: ABIDataTypes.ADDRESS },
        { name: 'amount', type: ABIDataTypes.UINT256 },
    )
    @emit('Transferred')
    public override transfer(calldata: Calldata): BytesWriter {
        this._requireNotPaused();
        return super.transfer(calldata);
    }

    @method(
        { name: 'from', type: ABIDataTypes.ADDRESS },
        { name: 'to', type: ABIDataTypes.ADDRESS },
        { name: 'amount', type: ABIDataTypes.UINT256 },
    )
    @emit('Transferred')
    public override transferFrom(calldata: Calldata): BytesWriter {
        this._requireNotPaused();
        return super.transferFrom(calldata);
    }

    @method(
        { name: 'to', type: ABIDataTypes.ADDRESS },
        { name: 'amount', type: ABIDataTypes.UINT256 },
        { name: 'data', type: ABIDataTypes.BYTES },
    )
    @emit('Transferred')
    public override safeTransfer(calldata: Calldata): BytesWriter {
        this._requireNotPaused();
        return super.safeTransfer(calldata);
    }

    @method(
        { name: 'from', type: ABIDataTypes.ADDRESS },
        { name: 'to', type: ABIDataTypes.ADDRESS },
        { name: 'amount', type: ABIDataTypes.UINT256 },
        { name: 'data', type: ABIDataTypes.BYTES },
    )
    @emit('Transferred')
    public override safeTransferFrom(calldata: Calldata): BytesWriter {
        this._requireNotPaused();
        return super.safeTransferFrom(calldata);
    }

    @method()
    @returns({ name: 'bridgeAuthority', type: ABIDataTypes.ADDRESS })
    public bridgeAuthority(_: Calldata): BytesWriter {
        const w = new BytesWriter(32);
        w.writeAddress(this._getBridgeAuthority());
        return w;
    }

    @method()
    @returns({ name: 'owner', type: ABIDataTypes.ADDRESS })
    public owner(_: Calldata): BytesWriter {
        const w = new BytesWriter(32);
        w.writeAddress(this._owner.value);
        return w;
    }

    @method({ name: 'newOwner', type: ABIDataTypes.ADDRESS })
    @emit('OwnershipTransferred')
    public transferOwnership(calldata: Calldata): BytesWriter {
        this._onlyOwner();

        const newOwner = calldata.readAddress();
        this._requireValidAddress(newOwner, 'Invalid owner');

        const previousOwner = this._owner.value;
        this._owner.value = newOwner;
        this.emitEvent(new OwnershipTransferredEvent(previousOwner, newOwner));

        return new BytesWriter(0);
    }

    private _onlyBridge(): void {
        const bridge = this._getBridgeAuthority();
        if (!Blockchain.tx.sender.equals(bridge)) {
            throw new Revert('Not bridge authority');
        }
    }

    private _onlyOwner(): void {
        if (!Blockchain.tx.sender.equals(this._owner.value)) {
            throw new Revert('Not owner');
        }
    }

    private _getBridgeAuthority(): Address {
        return this._bridgeAuthority.value;
    }

    private _setBridgeAuthority(addr: Address): void {
        this._bridgeAuthority.value = addr;
    }

    private _isPaused(): bool {
        return this._tokenConfig.get(TOKEN_CONFIG_INDEX_PAUSED) === 1;
    }

    private _requireNotPaused(): void {
        if (this._isPaused()) {
            throw new Revert('Token is paused');
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
}
