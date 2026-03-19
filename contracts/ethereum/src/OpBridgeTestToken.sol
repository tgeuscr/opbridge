// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract OpBridgeTestToken {
    error NotOwner();
    error InvalidRecipient();
    error InvalidAmount();
    error FaucetDisabled();
    error ClaimTooSoon(uint256 claimableAt);

    string public name;
    string public symbol;
    uint8 public immutable decimals;
    uint256 public totalSupply;
    address public owner;
    bool public faucetEnabled;
    uint256 public claimAmount;
    uint256 public claimCooldown;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => uint256) public nextClaimAt;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event FaucetConfigUpdated(bool enabled, uint256 claimAmount, uint256 claimCooldown);
    event FaucetClaimed(address indexed user, uint256 amount, uint256 nextClaimAtTimestamp);

    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        uint8 tokenDecimals,
        address initialOwner,
        uint256 initialClaimAmount,
        uint256 initialClaimCooldown,
        bool initialFaucetEnabled
    ) {
        if (initialOwner == address(0)) revert InvalidRecipient();
        if (initialClaimAmount == 0) revert InvalidAmount();
        name = tokenName;
        symbol = tokenSymbol;
        decimals = tokenDecimals;
        owner = initialOwner;
        claimAmount = initialClaimAmount;
        claimCooldown = initialClaimCooldown;
        faucetEnabled = initialFaucetEnabled;
        emit OwnershipTransferred(address(0), initialOwner);
        emit FaucetConfigUpdated(initialFaucetEnabled, initialClaimAmount, initialClaimCooldown);
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidRecipient();
        address previousOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        if (to == address(0)) revert InvalidRecipient();
        if (amount == 0) revert InvalidAmount();

        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function setFaucetConfig(
        bool enabled,
        uint256 nextClaimAmount,
        uint256 nextClaimCooldown
    ) external onlyOwner {
        if (nextClaimAmount == 0) revert InvalidAmount();
        faucetEnabled = enabled;
        claimAmount = nextClaimAmount;
        claimCooldown = nextClaimCooldown;
        emit FaucetConfigUpdated(enabled, nextClaimAmount, nextClaimCooldown);
    }

    function claimableAt(address user) external view returns (uint256) {
        return nextClaimAt[user];
    }

    function claim() external {
        if (!faucetEnabled) revert FaucetDisabled();
        uint256 next = nextClaimAt[msg.sender];
        if (block.timestamp < next) revert ClaimTooSoon(next);

        uint256 amount = claimAmount;
        totalSupply += amount;
        balanceOf[msg.sender] += amount;

        uint256 nextAt = block.timestamp + claimCooldown;
        nextClaimAt[msg.sender] = nextAt;

        emit Transfer(address(0), msg.sender, amount);
        emit FaucetClaimed(msg.sender, amount, nextAt);
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        require(allowed >= amount, "allowance");
        if (allowed != type(uint256).max) {
            allowance[from][msg.sender] = allowed - amount;
        }
        _transfer(from, to, amount);
        return true;
    }

    function _transfer(address from, address to, uint256 amount) private {
        require(to != address(0), "zero");
        uint256 fromBalance = balanceOf[from];
        require(fromBalance >= amount, "balance");
        unchecked {
            balanceOf[from] = fromBalance - amount;
        }
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
    }
}
