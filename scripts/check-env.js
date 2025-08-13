require("dotenv").config();

function checkEnvironment() {
  console.log("🔍 Checking environment configuration...\n");

  const requiredVars = [
    'PRIVATE_KEY',
    'RPC_URL'
  ];

  const optionalVars = [
    'ETHERSCAN_API_KEY',
    'INFURA_API_KEY',
    'ALCHEMY_API_KEY',
    'CHAIN_ID',
    'NETWORK_NAME'
  ];

  let allGood = true;

  // Check required variables
  console.log("📋 Required Variables:");
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      // Mask private key for security
      const displayValue = varName === 'PRIVATE_KEY' 
        ? `${value.substring(0, 6)}...${value.substring(value.length - 4)}`
        : value;
      console.log(`  ✅ ${varName}: ${displayValue}`);
    } else {
      console.log(`  ❌ ${varName}: Not set`);
      allGood = false;
    }
  });

  console.log("\n📋 Optional Variables:");
  optionalVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`  ✅ ${varName}: ${value}`);
    } else {
      console.log(`  ⚠️  ${varName}: Not set (optional)`);
    }
  });

  console.log("\n🌐 Network Configuration:");
  console.log(`  Network: ${process.env.NETWORK_NAME || 'hardhat'}`);
  console.log(`  RPC URL: ${process.env.RPC_URL || 'http://127.0.0.1:8545'}`);
  console.log(`  Chain ID: ${process.env.CHAIN_ID || '1337'}`);

  if (allGood) {
    console.log("\n✅ Environment is properly configured!");
    console.log("🚀 You can now run: npm run deploy");
  } else {
    console.log("\n❌ Some required environment variables are missing.");
    console.log("📝 Please edit your .env file and add the missing variables.");
  }

  return allGood;
}

if (require.main === module) {
  checkEnvironment();
}

module.exports = { checkEnvironment };
