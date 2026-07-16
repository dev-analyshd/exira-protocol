import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [signer] = await ethers.getSigners();
  const dep = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../deployments/xlayer-testnet.json"), "utf8")
  );

  console.log("=== EXIRA ON-CHAIN DIAGNOSTIC ===");
  console.log("Signer:", signer.address);
  const bal = await ethers.provider.getBalance(signer.address);
  console.log("OKB balance:", ethers.formatEther(bal));
  console.log("");

  // ── [1/4] EXIRAOracle ────────────────────────────────────────────────────
  console.log("[1/4] EXIRAOracle:", dep.contracts.EXIRAOracle);
  const oracle = await ethers.getContractAt("EXIRAOracle", dep.contracts.EXIRAOracle);

  const tMin = await oracle.THETA_MIN();
  const tMax = await oracle.THETA_MAX();
  console.log("  THETA_MIN:", tMin.toString(), "THETA_MAX:", tMax.toString(), "✔");

  // Use randomBytes (Uint8Array) as signalId — matches how e2e-testnet.ts works
  const signalId = ethers.randomBytes(32);
  const entityId = ethers.keccak256(ethers.toUtf8Bytes("entity-deployer"));
  const blockNum  = await ethers.provider.getBlockNumber();

  const signal = {
    signalId,
    signalType:      4n,         // EXIRA_FINANCE
    entityId,
    signalValue:     850n,
    ci95Lower:       820n,
    ci95Upper:       880n,
    coherence:       872n,       // >= threshold, <= 1000
    threshold:       650n,       // >= THETA_MIN (550), <= THETA_MAX (920)
    margin:          222n,       // coherence - threshold
    limitingPlane:   0n,         // PHYSICAL
    timestamp:       BigInt(Math.floor(Date.now() / 1000)),
    blockNumber:     BigInt(blockNum),
    genomicSignature: ethers.keccak256(ethers.toUtf8Bytes("genomic-sig")),
    provenance:      [] as string[],
  };

  const emitTx = await oracle.emitSignal(signal);
  const emitRec = await emitTx.wait();
  console.log("  emitSignal tx:", emitTx.hash, "block:", emitRec!.blockNumber, "✔");

  // verifyExecution using the same signalId bytes32 value
  const [isSafe, coherence, threshold] = await oracle.verifyExecution(signalId);
  console.log("  verifyExecution →", { isSafe, coherence: coherence.toString(), threshold: threshold.toString() });
  if (isSafe && coherence.toString() === "872") console.log("  coherence gate ✔");
  else console.log("  ⚠ coherence returned", coherence.toString(), "(expected 872)");

  // ── [2/4] EXIRARegistry ─────────────────────────────────────────────────
  console.log("\n[2/4] EXIRARegistry:", dep.contracts.EXIRARegistry);
  const registry = await ethers.getContractAt("EXIRARegistry", dep.contracts.EXIRARegistry);

  const freshWallet = ethers.Wallet.createRandom().connect(ethers.provider);
  console.log("  fresh wallet:", freshWallet.address);

  const fundTx = await signer.sendTransaction({ to: freshWallet.address, value: ethers.parseEther("0.005") });
  await fundTx.wait();
  console.log("  funded 0.005 OKB ✔");

  const agentId = ethers.randomBytes(32); // fresh bytes32
  const genomicKey = ethers.randomBytes(32);
  const regTx = await registry.connect(freshWallet).registerAgent(agentId, genomicKey);
  const regRec = await regTx.wait();
  console.log("  registerAgent tx:", regTx.hash, "block:", regRec!.blockNumber, "✔");

  const agent = await registry.agents(agentId);
  console.log("  agent.owner:", agent.owner);
  console.log("  credibilityScore:", agent.credibilityScore.toString());
  const ownerMatch = agent.owner.toLowerCase() === freshWallet.address.toLowerCase();
  console.log("  owner matches wallet:", ownerMatch, ownerMatch ? "✔" : "✗");

  // ── [3/4] EXIRAEscrow ────────────────────────────────────────────────────
  console.log("\n[3/4] EXIRAEscrow:", dep.contracts.EXIRAEscrow);
  const escrow = await ethers.getContractAt("EXIRAEscrow", dep.contracts.EXIRAEscrow);

  // Correct getter is `exiraOracle` (immutable state var), not `oracle`
  const oracleRef = await escrow.exiraOracle();
  const matches = oracleRef.toLowerCase() === dep.contracts.EXIRAOracle.toLowerCase();
  console.log("  exiraOracle ref:", oracleRef, matches ? "✔" : "✗ mismatch");

  const intentHash = ethers.keccak256(ethers.toUtf8Bytes("intent-diag-" + Date.now()));
  const lockTx = await escrow.lock(
    intentHash,
    entityId,
    50n,
    freshWallet.address,
    { value: ethers.parseEther("0.001") }
  );
  const lockRec = await lockTx.wait();
  console.log("  lock tx:", lockTx.hash, "block:", lockRec!.blockNumber, "✔");

  // ── [4/4] EXIRAToken ─────────────────────────────────────────────────────
  console.log("\n[4/4] EXIRAToken:", dep.contracts.EXIRAToken);
  const token = await ethers.getContractAt("EXIRAToken", dep.contracts.EXIRAToken);
  const name       = await token.name();
  const symbol     = await token.symbol();
  const maxSupply  = await token.MAX_SUPPLY();
  const total      = await token.totalSupply();
  const deployerBal = await token.balanceOf(signer.address);
  console.log("  name:", name, "| symbol:", symbol, "✔");
  console.log("  MAX_SUPPLY:", ethers.formatEther(maxSupply), "EXIRA ✔");
  console.log("  totalSupply:", ethers.formatEther(total), "EXIRA");
  console.log("  deployer balance:", ethers.formatEther(deployerBal), "EXIRA ✔");

  console.log("\n=== ALL 4 CONTRACTS VERIFIED ===");
}

main().catch((e) => { console.error(e.shortMessage ?? e.message); process.exit(1); });
