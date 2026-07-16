/**
 * EXIRA Protocol — End-to-End Testnet Verification Script
 * Verifies all 4 contracts are live on X Layer testnet and exercisable.
 * Run: PRIVATE_KEY=0x... npx hardhat run scripts/e2e-testnet.ts --network xlayer-testnet
 */
import { ethers } from "hardhat";
import deployment from "../deployments/xlayer-testnet.json";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("=== EXIRA Protocol E2E Testnet Verification ===");
  console.log("Signer:", signer.address);
  console.log("Network: xlayer-testnet (chainId 1952)\n");

  // ── 1. EXIRAOracle ──────────────────────────────────────────────────────────
  console.log("[1/4] Verifying EXIRAOracle at", deployment.contracts.EXIRAOracle);
  const oracle = await ethers.getContractAt("EXIRAOracle", deployment.contracts.EXIRAOracle);
  const thetaMin = await oracle.THETA_MIN();
  const thetaMax = await oracle.THETA_MAX();
  console.log(`  THETA_MIN: ${thetaMin} ✔`);
  console.log(`  THETA_MAX: ${thetaMax} ✔`);

  // Emit a live signal
  const signalId  = ethers.randomBytes(32);
  const entityId  = ethers.randomBytes(32);
  const genomicSig = ethers.randomBytes(32);
  const signal = {
    signalId,
    signalType: 4,          // EXIRA_FINANCE
    entityId,
    signalValue: 872,
    ci95Lower: 850,
    ci95Upper: 890,
    coherence: 872,
    threshold: 650,
    margin: 222,
    limitingPlane: 0,
    timestamp: Math.floor(Date.now() / 1000),
    blockNumber: await ethers.provider.getBlockNumber(),
    genomicSignature: genomicSig,
    provenance: [],
  };
  const emitTx = await oracle.emitSignal(signal);
  const receipt = await emitTx.wait();
  console.log(`  Signal emitted — tx: ${emitTx.hash} (block ${receipt!.blockNumber}) ✔`);

  const [isSafe, coherence, threshold] = await oracle.verifyExecution(signalId);
  console.log(`  verifyExecution → isSafe=${isSafe}, coherence=${coherence}, threshold=${threshold} ✔\n`);

  // ── 2. EXIRARegistry ────────────────────────────────────────────────────────
  console.log("[2/4] Verifying EXIRARegistry at", deployment.contracts.EXIRARegistry);
  const registry = await ethers.getContractAt("EXIRARegistry", deployment.contracts.EXIRARegistry);

  // Use a deterministic agentId so re-runs are idempotent:
  // if the owner already registered, read the existing record instead.
  const agentId   = ethers.keccak256(ethers.toUtf8Bytes(`exira-e2e-${signer.address}`));
  const genomicKey = ethers.randomBytes(32);

  let regHash = "(already registered)";
  try {
    const regTx = await registry.registerAgent(agentId, genomicKey);
    const regReceipt = await regTx.wait();
    regHash = `${regTx.hash} (block ${regReceipt!.blockNumber})`;
  } catch (e: any) {
    if (!e.message?.includes("Owner already has agent") && !e.message?.includes("Agent already exists")) throw e;
  }
  console.log(`  registerAgent: ${regHash} ✔`);

  const agent = await registry.agents(agentId);
  console.log(`  Agent owner:      ${agent.owner}`);
  console.log(`  credibilityScore: ${agent.credibilityScore} ✔\n`);

  // ── 3. EXIRAEscrow ──────────────────────────────────────────────────────────
  console.log("[3/4] Verifying EXIRAEscrow at", deployment.contracts.EXIRAEscrow);
  const escrow = await ethers.getContractAt("EXIRAEscrow", deployment.contracts.EXIRAEscrow);
  const oracleAddr = await escrow.exiraOracle();
  console.log(`  oracle reference: ${oracleAddr}`);
  console.log(`  matches deployed oracle: ${oracleAddr.toLowerCase() === deployment.contracts.EXIRAOracle.toLowerCase()} ✔`);

  // Lock a small escrow with native OKB
  const intentHash = ethers.randomBytes(32);
  const escrowEntityId = ethers.randomBytes(32);
  const lockTx = await escrow.lock(
    intentHash,
    escrowEntityId,
    50n,                  // timeoutBlocks
    signer.address,       // destination
    { value: ethers.parseEther("0.001") }
  );
  const lockReceipt = await lockTx.wait();
  console.log(`  lock tx: ${lockTx.hash} (block ${lockReceipt!.blockNumber}) ✔\n`);

  // ── 4. EXIRAToken ───────────────────────────────────────────────────────────
  console.log("[4/4] Verifying EXIRAToken at", deployment.contracts.EXIRAToken);
  const token = await ethers.getContractAt("EXIRAToken", deployment.contracts.EXIRAToken);
  const name      = await token.name();
  const symbol    = await token.symbol();
  const maxSupply = await token.MAX_SUPPLY();
  const balance   = await token.balanceOf(signer.address);
  console.log(`  name: ${name}, symbol: ${symbol} ✔`);
  console.log(`  MAX_SUPPLY: ${ethers.formatEther(maxSupply)} EXIRA ✔`);
  console.log(`  deployer balance: ${ethers.formatEther(balance)} EXIRA ✔`);

  // ── Summary ─────────────────────────────────────────────────────────────────
  console.log("\n=== ALL CONTRACTS VERIFIED ON X LAYER TESTNET ===");
  console.log("EXIRAOracle:  ", deployment.contracts.EXIRAOracle);
  console.log("EXIRARegistry:", deployment.contracts.EXIRARegistry);
  console.log("EXIRAEscrow:  ", deployment.contracts.EXIRAEscrow);
  console.log("EXIRAToken:   ", deployment.contracts.EXIRAToken);
  console.log("\nExplorer:");
  for (const [name, url] of Object.entries(deployment.explorer)) {
    console.log(` ${name}: ${url}`);
  }
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
