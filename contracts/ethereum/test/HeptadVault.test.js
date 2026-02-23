const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const fs = require("node:fs");
const path = require("node:path");
const solc = require("solc");

describe("HeptadVault", function () {
  let compiled;

  before(function () {
    compiled = compileContracts();
  });

  async function deployFixture() {
    const [owner, user] = await ethers.getSigners();
    const vaultFactory = factoryFor("HeptadVault", compiled, owner);
    const vault = await vaultFactory.deploy(owner.address);
    await vault.waitForDeployment();
    return { vault, owner, user };
  }

  it("deploys paused by default", async function () {
    const { vault, owner } = await deployFixture();
    expect(await vault.paused()).to.equal(true);
    expect(await vault.feeBps()).to.equal(100);
    expect(await vault.feeRecipient()).to.equal(owner.address);
  });

  it("accepts ERC20 deposits for configured token assets", async function () {
    const { vault, owner, user } = await deployFixture();
    const assetId = 0;
    const recipient = ethers.zeroPadValue("0xabcd", 32);
    const amount = ethers.parseUnits("100", 18);
    const feeAmount = ethers.parseUnits("1", 18);
    const netAmount = ethers.parseUnits("99", 18);

    const tokenFactory = factoryFor("MockERC20", compiled, user);
    const token = await tokenFactory.deploy(ethers.parseUnits("1000000", 18));
    await token.waitForDeployment();

    await token.transfer(user.address, amount);
    await expect(vault.configureAsset(assetId, await token.getAddress(), true))
      .to.emit(vault, "AssetConfigured")
      .withArgs(assetId, await token.getAddress(), true);
    await vault.setPaused(false);
    await token.connect(user).approve(await vault.getAddress(), amount);

    await expect(vault.connect(user).depositERC20(assetId, amount, recipient))
      .to.emit(vault, "DepositInitiated")
      .withArgs(0n, assetId, user.address, await token.getAddress(), netAmount, recipient, anyValue);

    expect(await token.balanceOf(await vault.getAddress())).to.equal(netAmount);
    expect(await token.balanceOf(owner.address)).to.equal(feeAmount);
  });

  it("reverts deposits when paused", async function () {
    const { vault, user } = await deployFixture();
    const assetId = 0;
    const recipient = ethers.zeroPadValue("0x1234", 32);
    const amount = ethers.parseUnits("5", 18);
    const tokenFactory = factoryFor("MockERC20", compiled, user);
    const token = await tokenFactory.deploy(ethers.parseUnits("1000000", 18));
    await token.waitForDeployment();
    await token.transfer(user.address, amount);

    await vault.configureAsset(assetId, await token.getAddress(), true);
    await token.connect(user).approve(await vault.getAddress(), amount);

    await expect(
      vault.connect(user).depositERC20(assetId, amount, recipient)
    ).to.be.revertedWithCustomError(vault, "Paused");
  });

  it("rejects enabling an asset with zero token address", async function () {
    const { vault } = await deployFixture();
    await expect(
      vault.configureAsset(9, ethers.ZeroAddress, true)
    ).to.be.revertedWithCustomError(vault, "InvalidAsset");
  });

  it("manages active/accepted attestation versions", async function () {
    const { vault } = await deployFixture();

    expect(await vault.activeAttestationVersion()).to.equal(1);
    expect(await vault.isAttestationVersionAccepted(1)).to.equal(true);

    await expect(vault.setAttestationVersionAccepted(2, true))
      .to.emit(vault, "AttestationVersionAcceptanceUpdated")
      .withArgs(2, true);
    await expect(vault.setActiveAttestationVersion(2))
      .to.emit(vault, "ActiveAttestationVersionUpdated")
      .withArgs(1, 2);

    await expect(vault.setAttestationVersionAccepted(3, false))
      .to.emit(vault, "AttestationVersionAcceptanceUpdated")
      .withArgs(3, false);
    await expect(vault.setActiveAttestationVersion(3))
      .to.be.revertedWithCustomError(vault, "UnsupportedAttestationVersion");
  });

  it("allows changing fee recipient while unpaused but fee bps only while paused", async function () {
    const [owner, feeRecipient2] = await ethers.getSigners();
    const vaultFactory = factoryFor("HeptadVault", compiled, owner);
    const vault = await vaultFactory.deploy(owner.address);
    await vault.waitForDeployment();

    await vault.setPaused(false);
    await expect(vault.setFeeRecipient(feeRecipient2.address))
      .to.emit(vault, "FeeRecipientUpdated")
      .withArgs(owner.address, feeRecipient2.address);

    await expect(vault.setFeeBps(150))
      .to.be.revertedWithCustomError(vault, "Paused");

    await vault.setPaused(true);
    await expect(vault.setFeeBps(150))
      .to.emit(vault, "FeeBpsUpdated")
      .withArgs(100, 150);
  });

  it("releases tokens with threshold relay signatures and blocks replay", async function () {
    const [owner, recipient, feeCollector] = await ethers.getSigners();
    const relay0 = ethers.Wallet.createRandom();
    const relay1 = ethers.Wallet.createRandom();
    const vaultFactory = factoryFor("HeptadVault", compiled, owner);
    const vault = await vaultFactory.deploy(owner.address);
    await vault.waitForDeployment();

    const tokenFactory = factoryFor("MockERC20", compiled, owner);
    const token = await tokenFactory.deploy(ethers.parseUnits("1000000", 18));
    await token.waitForDeployment();

    const assetId = 0;
    const amount = ethers.parseUnits("25", 18);
    const feeAmount = ethers.parseUnits("0.25", 18);
    const netAmount = ethers.parseUnits("24.75", 18);
    const withdrawalId = 42n;
    const opnetUser = ethers.zeroPadValue("0x1234", 32);
    const attestationVersion = 1;
    const opnetBridgeHex = ethers.zeroPadValue("0xbeef", 32);

    await vault.configureAsset(assetId, await token.getAddress(), true);
    await token.transfer(await vault.getAddress(), amount);
    await vault.setOpnetBridgeHex(opnetBridgeHex);
    await vault.setRelayCount(2);
    await vault.setRelayThreshold(2);
    await vault.setRelaySigner(0, relay0.address);
    await vault.setRelaySigner(1, relay1.address);
    await vault.setFeeRecipient(feeCollector.address);
    await vault.setPaused(false);

    const attestationHash = await vault.computeReleaseAttestationHash(
      assetId,
      opnetUser,
      recipient.address,
      amount,
      withdrawalId,
      attestationVersion,
    );

    const sig0 = relay0.signingKey.sign(attestationHash).serialized;
    const sig1 = relay1.signingKey.sign(attestationHash).serialized;

    const relayIndexesPacked = ethers.concat([ethers.toBeHex(0, 1), ethers.toBeHex(1, 1)]);
    const relaySignaturesPacked = ethers.concat([sig0, sig1]);

    await expect(
      vault.releaseWithRelaySignatures(
        assetId,
        opnetUser,
        recipient.address,
        amount,
        withdrawalId,
        attestationVersion,
        relayIndexesPacked,
        relaySignaturesPacked,
      )
    )
      .to.emit(vault, "WithdrawalReleased")
      .withArgs(
        withdrawalId,
        assetId,
        recipient.address,
        await token.getAddress(),
        netAmount,
        opnetUser,
        attestationVersion,
      );

    expect(await token.balanceOf(recipient.address)).to.equal(netAmount);
    expect(await token.balanceOf(feeCollector.address)).to.equal(feeAmount);
    expect(await vault.processedWithdrawals(withdrawalId)).to.equal(true);

    await expect(
      vault.releaseWithRelaySignatures(
        assetId,
        opnetUser,
        recipient.address,
        amount,
        withdrawalId,
        attestationVersion,
        relayIndexesPacked,
        relaySignaturesPacked,
      )
    ).to.be.revertedWithCustomError(vault, "WithdrawalAlreadyProcessed");
  });

  it("rejects release with invalid relay signature", async function () {
    const [owner, recipient] = await ethers.getSigners();
    const relay0 = ethers.Wallet.createRandom();
    const relay1 = ethers.Wallet.createRandom();
    const attacker = ethers.Wallet.createRandom();
    const vaultFactory = factoryFor("HeptadVault", compiled, owner);
    const vault = await vaultFactory.deploy(owner.address);
    await vault.waitForDeployment();

    const tokenFactory = factoryFor("MockERC20", compiled, owner);
    const token = await tokenFactory.deploy(ethers.parseUnits("1000000", 18));
    await token.waitForDeployment();

    const assetId = 0;
    const amount = ethers.parseUnits("1", 18);
    const withdrawalId = 7n;
    const opnetUser = ethers.zeroPadValue("0xabcd", 32);
    const opnetBridgeHex = ethers.zeroPadValue("0xcafe", 32);

    await vault.configureAsset(assetId, await token.getAddress(), true);
    await token.transfer(await vault.getAddress(), amount);
    await vault.setOpnetBridgeHex(opnetBridgeHex);
    await vault.setRelayCount(2);
    await vault.setRelayThreshold(2);
    await vault.setRelaySigner(0, relay0.address);
    await vault.setRelaySigner(1, relay1.address);
    await vault.setPaused(false);

    const attestationHash = await vault.computeReleaseAttestationHash(
      assetId,
      opnetUser,
      recipient.address,
      amount,
      withdrawalId,
      1,
    );
    const sig0 = relay0.signingKey.sign(attestationHash).serialized;
    const badSig1 = attacker.signingKey.sign(attestationHash).serialized;

    await expect(
      vault.releaseWithRelaySignatures(
        assetId,
        opnetUser,
        recipient.address,
        amount,
        withdrawalId,
        1,
        ethers.concat([ethers.toBeHex(0, 1), ethers.toBeHex(1, 1)]),
        ethers.concat([sig0, badSig1]),
      )
    ).to.be.revertedWithCustomError(vault, "InvalidRelaySignature");
  });
});

function compileContracts() {
  const root = path.join(__dirname, "..");
  const input = {
    language: "Solidity",
    sources: {
      "HeptadVault.sol": {
        content: fs.readFileSync(path.join(root, "src/HeptadVault.sol"), "utf8"),
      },
      "MockERC20.sol": {
        content: fs.readFileSync(path.join(root, "src/MockERC20.sol"), "utf8"),
      },
    },
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode.object"],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const errors = output.errors ?? [];
  const fatalErrors = errors.filter((entry) => entry.severity === "error");
  if (fatalErrors.length > 0) {
    throw new Error(fatalErrors.map((entry) => entry.formattedMessage).join("\n"));
  }

  return output.contracts;
}

function factoryFor(contractName, contracts, signer) {
  for (const fileName of Object.keys(contracts)) {
    const candidate = contracts[fileName][contractName];
    if (!candidate) continue;
    return new ethers.ContractFactory(candidate.abi, candidate.evm.bytecode.object, signer);
  }

  throw new Error(`Contract ${contractName} not found in compiled output`);
}
