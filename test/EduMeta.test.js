const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EduMeta Token", function () {
  let EduMeta;
  let eduMeta;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    EduMeta = await ethers.getContractFactory("EduMeta");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy a new EduMeta contract before each test
    eduMeta = await EduMeta.deploy(owner.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await eduMeta.owner()).to.equal(owner.address);
    });

    it("Should assign the name and symbol correctly", async function () {
      expect(await eduMeta.name()).to.equal("EduMeta");
      expect(await eduMeta.symbol()).to.equal("EDT");
    });

    it("Should start with zero total supply", async function () {
      expect(await eduMeta.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      await eduMeta.mint(addr1.address, mintAmount);
      expect(await eduMeta.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Should fail if non-owner tries to mint", async function () {
      const mintAmount = ethers.parseEther("1000");
      await expect(
        eduMeta.connect(addr1).mint(addr1.address, mintAmount)
      ).to.be.revertedWithCustomError(eduMeta, "OwnableUnauthorizedAccount");
    });

    it("Should update total supply after minting", async function () {
      const mintAmount = ethers.parseEther("1000");
      await eduMeta.mint(addr1.address, mintAmount);
      expect(await eduMeta.totalSupply()).to.equal(mintAmount);
    });
  });

  describe("Transfers", function () {
    beforeEach(async function () {
      // Mint some tokens to addr1 for transfer tests
      await eduMeta.mint(addr1.address, ethers.parseEther("1000"));
    });

    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseEther("100");
      await eduMeta.connect(addr1).transfer(addr2.address, transferAmount);
      
      expect(await eduMeta.balanceOf(addr1.address)).to.equal(ethers.parseEther("900"));
      expect(await eduMeta.balanceOf(addr2.address)).to.equal(transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialBalance = await eduMeta.balanceOf(addr1.address);
      await expect(
        eduMeta.connect(addr1).transfer(addr2.address, initialBalance + 1n)
      ).to.be.revertedWithCustomError(eduMeta, "ERC20InsufficientBalance");
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      await eduMeta.mint(addr1.address, ethers.parseEther("1000"));
    });

    it("Should allow users to burn their own tokens", async function () {
      const burnAmount = ethers.parseEther("100");
      const initialBalance = await eduMeta.balanceOf(addr1.address);
      
      await eduMeta.connect(addr1).burn(burnAmount);
      
      expect(await eduMeta.balanceOf(addr1.address)).to.equal(initialBalance - burnAmount);
    });

    it("Should allow owner to burn tokens from any address", async function () {
      const burnAmount = ethers.parseEther("100");
      const initialBalance = await eduMeta.balanceOf(addr1.address);
      
      // First approve the owner to burn tokens
      await eduMeta.connect(addr1).approve(owner.address, burnAmount);
      
      await eduMeta.burnFrom(addr1.address, burnAmount);
      
      expect(await eduMeta.balanceOf(addr1.address)).to.equal(initialBalance - burnAmount);
    });
  });

  describe("Pausing", function () {
    it("Should allow owner to pause and unpause", async function () {
      await eduMeta.pause();
      expect(await eduMeta.paused()).to.be.true;
      
      await eduMeta.unpause();
      expect(await eduMeta.paused()).to.be.false;
    });

    it("Should fail if non-owner tries to pause", async function () {
      await expect(
        eduMeta.connect(addr1).pause()
      ).to.be.revertedWithCustomError(eduMeta, "OwnableUnauthorizedAccount");
    });

    it("Should prevent transfers when paused", async function () {
      await eduMeta.mint(addr1.address, ethers.parseEther("1000"));
      await eduMeta.pause();
      
      await expect(
        eduMeta.connect(addr1).transfer(addr2.address, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(eduMeta, "EnforcedPause");
    });
  });

  describe("ERC20Permit", function () {
    it("Should have permit functionality", async function () {
      // This is a basic test to ensure the permit function exists
      // In a real scenario, you'd test the actual permit signature verification
      expect(eduMeta.permit).to.be.a("function");
    });
  });

  describe("ERC1363", function () {
    it("Should have transferAndCall functionality", async function () {
      // This is a basic test to ensure the transferAndCall function exists
      expect(eduMeta.transferAndCall).to.be.a("function");
    });
  });
});
