const { ethers } = require("hardhat");
require('dotenv').config();

async function main() {
  console.log("Deploying EduMeta token...");

  // Get the contract factory
  const EduMeta = await ethers.getContractFactory("EduMeta");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Log environment variables for debugging
  console.log("Network:", process.env.NETWORK_NAME || "hardhat");
  console.log("RPC URL:", process.env.RPC_URL || "default");
  console.log("Chain ID:", process.env.CHAIN_ID || "default");

  // Deploy the contract
  const eduMeta = await EduMeta.deploy(deployer.address);
  await eduMeta.waitForDeployment();

  const address = await eduMeta.getAddress();
  console.log("EduMeta token deployed to:", address);
  console.log("Token name:", await eduMeta.name());
  console.log("Token symbol:", await eduMeta.symbol());
  console.log("Owner:", await eduMeta.owner());
  console.log("Total supply:", (await eduMeta.totalSupply()).toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
