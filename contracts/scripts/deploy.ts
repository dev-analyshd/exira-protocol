import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying EXIRA contracts with:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // 1. Deploy EXIRAOracle
  console.log("\n[1/4] Deploying EXIRAOracle...");
  const EXIRAOracle = await ethers.getContractFactory("EXIRAOracle");
  const oracle = await EXIRAOracle.deploy();
  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();
  console.log("EXIRAOracle deployed to:", oracleAddress);

  // 2. Deploy EXIRARegistry
  console.log("\n[2/4] Deploying EXIRARegistry...");
  const EXIRARegistry = await ethers.getContractFactory("EXIRARegistry");
  const registry = await EXIRARegistry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("EXIRARegistry deployed to:", registryAddress);

  // 3. Deploy EXIRAEscrow (requires oracle address)
  console.log("\n[3/4] Deploying EXIRAEscrow...");
  const EXIRAEscrow = await ethers.getContractFactory("EXIRAEscrow");
  const escrow = await EXIRAEscrow.deploy(oracleAddress);
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log("EXIRAEscrow deployed to:", escrowAddress);

  // 4. Deploy EXIRAToken
  console.log("\n[4/4] Deploying EXIRAToken...");
  const EXIRAToken = await ethers.getContractFactory("EXIRAToken");
  const token = await EXIRAToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("EXIRAToken deployed to:", tokenAddress);

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log("EXIRAOracle:  ", oracleAddress);
  console.log("EXIRARegistry:", registryAddress);
  console.log("EXIRAEscrow:  ", escrowAddress);
  console.log("EXIRAToken:   ", tokenAddress);

  console.log("\n=== Add to .env ===");
  console.log(`EXIRA_ORACLE_ADDRESS=${oracleAddress}`);
  console.log(`EXIRA_REGISTRY_ADDRESS=${registryAddress}`);
  console.log(`EXIRA_ESCROW_ADDRESS=${escrowAddress}`);
  console.log(`EXIRA_TOKEN_ADDRESS=${tokenAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
