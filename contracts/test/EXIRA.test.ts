import { expect } from "chai";
import { ethers } from "hardhat";
import { EXIRAOracle, EXIRARegistry, EXIRAEscrow, EXIRAToken } from "../typechain-types";

describe("EXIRA Protocol Contracts", function () {
  let oracle: EXIRAOracle;
  let registry: EXIRARegistry;
  let escrow: EXIRAEscrow;
  let token: EXIRAToken;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const EXIRAOracle = await ethers.getContractFactory("EXIRAOracle");
    oracle = await EXIRAOracle.deploy();

    const EXIRARegistry = await ethers.getContractFactory("EXIRARegistry");
    registry = await EXIRARegistry.deploy();

    const EXIRAEscrow = await ethers.getContractFactory("EXIRAEscrow");
    escrow = await EXIRAEscrow.deploy(await oracle.getAddress());

    const EXIRAToken = await ethers.getContractFactory("EXIRAToken");
    token = await EXIRAToken.deploy();
  });

  describe("EXIRAOracle", function () {
    it("Should deploy with correct constants", async function () {
      expect(await oracle.THETA_MIN()).to.equal(550);
      expect(await oracle.THETA_MAX()).to.equal(920);
    });

    it("Should emit a signal when coherence >= threshold", async function () {
      const signalId = ethers.randomBytes(32);
      const entityId = ethers.randomBytes(32);
      const genomicSig = ethers.randomBytes(32);

      const signal = {
        signalId,
        signalType: 4, // EXIRA_FINANCE
        entityId,
        signalValue: 850,
        ci95Lower: 823,
        ci95Upper: 871,
        coherence: 847,
        threshold: 599,
        margin: 248,
        limitingPlane: 0,
        timestamp: Math.floor(Date.now() / 1000),
        blockNumber: await ethers.provider.getBlockNumber(),
        genomicSignature: genomicSig,
        provenance: [],
      };

      await expect(oracle.emitSignal(signal))
        .to.emit(oracle, "SignalEmitted");
    });

    it("Should revert when coherence < threshold", async function () {
      const signalId = ethers.randomBytes(32);
      const entityId = ethers.randomBytes(32);
      const genomicSig = ethers.randomBytes(32);

      const signal = {
        signalId,
        signalType: 4,
        entityId,
        signalValue: 400,
        ci95Lower: 0,
        ci95Upper: 0,
        coherence: 400, // Below threshold
        threshold: 599,
        margin: 0,
        limitingPlane: 0,
        timestamp: Math.floor(Date.now() / 1000),
        blockNumber: await ethers.provider.getBlockNumber(),
        genomicSignature: genomicSig,
        provenance: [],
      };

      await expect(oracle.emitSignal(signal))
        .to.be.revertedWith("Coherence below threshold");
    });

    it("Should verify execution correctly", async function () {
      const signalId = ethers.randomBytes(32);
      const entityId = ethers.randomBytes(32);

      // Non-existent signal — coherence = 0 < threshold = 0 is false
      const [isSafe, coherence, threshold] = await oracle.verifyExecution(signalId);
      expect(coherence).to.equal(0);
    });
  });

  describe("EXIRARegistry", function () {
    it("Should register an agent", async function () {
      const agentId = ethers.randomBytes(32);
      const genomicKey = ethers.randomBytes(32);

      await expect(registry.connect(user1).registerAgent(agentId, genomicKey))
        .to.emit(registry, "AgentRegistered");

      const agent = await registry.agents(agentId);
      expect(agent.owner).to.equal(user1.address);
      expect(agent.credibilityScore).to.equal(500);
      expect(agent.isVerified).to.equal(false);
    });

    it("Should prevent duplicate registrations", async function () {
      const agentId = ethers.randomBytes(32);
      const genomicKey = ethers.randomBytes(32);

      await registry.connect(user1).registerAgent(agentId, genomicKey);
      await expect(registry.connect(user2).registerAgent(agentId, genomicKey))
        .to.be.revertedWith("Agent already exists");
    });

    it("Should issue a verification badge", async function () {
      const agentId = ethers.randomBytes(32);
      const genomicKey = ethers.randomBytes(32);
      const badgeId = ethers.randomBytes(32);
      const auditHash = ethers.randomBytes(32);

      await registry.connect(user1).registerAgent(agentId, genomicKey);
      await expect(registry.issueBadge(badgeId, agentId, 5, auditHash))
        .to.emit(registry, "BadgeIssued");

      const agent = await registry.agents(agentId);
      expect(agent.isVerified).to.equal(true);
    });

    it("Should update reputation correctly", async function () {
      const agentId = ethers.randomBytes(32);
      const genomicKey = ethers.randomBytes(32);

      await registry.connect(user1).registerAgent(agentId, genomicKey);
      await registry.updateReputation(agentId, 100);

      const agent = await registry.agents(agentId);
      expect(agent.reputationScore).to.equal(100);
    });
  });

  describe("EXIRAToken", function () {
    it("Should mint initial supply to deployer", async function () {
      const balance = await token.balanceOf(owner.address);
      expect(balance).to.equal(ethers.parseEther("100000000")); // 100M
    });

    it("Should have correct max supply", async function () {
      expect(await token.MAX_SUPPLY()).to.equal(ethers.parseEther("1000000000")); // 1B
    });

    it("Should allow owner to mint", async function () {
      const amount = ethers.parseEther("1000");
      await token.mint(user1.address, amount);
      expect(await token.balanceOf(user1.address)).to.equal(amount);
    });

    it("Should allow burning", async function () {
      const amount = ethers.parseEther("1000");
      const initialBalance = await token.balanceOf(owner.address);
      await token.burn(amount);
      expect(await token.balanceOf(owner.address)).to.equal(initialBalance - amount);
    });
  });
});
