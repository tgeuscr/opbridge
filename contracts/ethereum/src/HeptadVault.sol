// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HeptadVault {
    error NotOwner();
    error Paused();
    error InvalidRecipient();
    error InvalidAsset();
    error InvalidAmount();
    error UnsupportedAttestationVersion();
    error TokenTransferFailed();

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event VaultPausedUpdated(bool paused);
    event AssetConfigured(uint8 indexed assetId, address indexed token, bool enabled);
    event ActiveAttestationVersionUpdated(uint8 previousVersion, uint8 nextVersion);
    event AttestationVersionAcceptanceUpdated(uint8 version, bool accepted);
    event DepositInitiated(
        uint256 indexed depositId,
        uint8 indexed assetId,
        address indexed depositor,
        address token,
        uint256 amount,
        bytes32 opnetRecipient,
        uint256 timestamp
    );

    struct AssetConfig {
        address token;
        bool enabled;
    }

    address public owner;
    bool public paused;
    uint256 public nextDepositId;
    uint8 public activeAttestationVersion;
    mapping(uint8 => bool) public isAttestationVersionAccepted;
    mapping(uint8 => AssetConfig) public assets;

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier whenNotPaused() {
        if (paused) revert Paused();
        _;
    }

    constructor(address initialOwner) {
        if (initialOwner == address(0)) revert InvalidRecipient();
        owner = initialOwner;
        activeAttestationVersion = 1;
        isAttestationVersionAccepted[1] = true;
        emit OwnershipTransferred(address(0), initialOwner);
        emit ActiveAttestationVersionUpdated(0, 1);
        emit AttestationVersionAcceptanceUpdated(1, true);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidRecipient();
        address previousOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }

    function setPaused(bool nextPaused) external onlyOwner {
        paused = nextPaused;
        emit VaultPausedUpdated(nextPaused);
    }

    function setAttestationVersionAccepted(uint8 version, bool accepted) external onlyOwner {
        isAttestationVersionAccepted[version] = accepted;
        emit AttestationVersionAcceptanceUpdated(version, accepted);
    }

    function setActiveAttestationVersion(uint8 version) external onlyOwner {
        if (!isAttestationVersionAccepted[version]) revert UnsupportedAttestationVersion();
        uint8 previous = activeAttestationVersion;
        activeAttestationVersion = version;
        emit ActiveAttestationVersionUpdated(previous, version);
    }

    function configureAsset(
        uint8 assetId,
        address token,
        bool enabled
    ) external onlyOwner {
        if (enabled && token == address(0)) revert InvalidAsset();

        assets[assetId] = AssetConfig({
            token: token,
            enabled: enabled
        });
        emit AssetConfigured(assetId, token, enabled);
    }

    function depositERC20(
        uint8 assetId,
        uint256 amount,
        bytes32 opnetRecipient
    ) external whenNotPaused returns (uint256 depositId) {
        if (opnetRecipient == bytes32(0)) revert InvalidRecipient();
        if (amount == 0) revert InvalidAmount();

        AssetConfig memory config = assets[assetId];
        if (!config.enabled) revert InvalidAsset();

        bool ok = IERC20(config.token).transferFrom(msg.sender, address(this), amount);
        if (!ok) revert TokenTransferFailed();

        depositId = _nextDepositId();
        emit DepositInitiated(
            depositId,
            assetId,
            msg.sender,
            config.token,
            amount,
            opnetRecipient,
            block.timestamp
        );
    }

    function _nextDepositId() private returns (uint256 currentDepositId) {
        currentDepositId = nextDepositId;
        nextDepositId = currentDepositId + 1;
    }
}

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}
