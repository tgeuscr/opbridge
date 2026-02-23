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

  it("accepts ERC20 deposits for configured token assets", async function () {
    const { vault, user } = await deployFixture();
    const assetId = 0;
    const recipient = ethers.zeroPadValue("0xabcd", 32);
    const amount = ethers.parseUnits("100", 18);

    const tokenFactory = factoryFor("MockERC20", compiled, user);
    const token = await tokenFactory.deploy(ethers.parseUnits("1000000", 18));
    await token.waitForDeployment();

    await token.transfer(user.address, amount);
    await expect(vault.configureAsset(assetId, await token.getAddress(), true))
      .to.emit(vault, "AssetConfigured")
      .withArgs(assetId, await token.getAddress(), true);
    await token.connect(user).approve(await vault.getAddress(), amount);

    await expect(vault.connect(user).depositERC20(assetId, amount, recipient))
      .to.emit(vault, "DepositInitiated")
      .withArgs(0n, assetId, user.address, await token.getAddress(), amount, recipient, anyValue);

    expect(await token.balanceOf(await vault.getAddress())).to.equal(amount);
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
    await vault.setPaused(true);

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
