const { ethers } = require("hardhat");
require("dotenv").config();

async function checkSepoliaBalance() {
  try {
    console.log("🔍 Checking Sepolia testnet balance...\n");

    // Check if we have the required environment variables
    if (!process.env.PRIVATE_KEY) {
      console.log("❌ PRIVATE_KEY not found in .env file");
      console.log("📝 Please add your private key to the .env file");
      return;
    }

    // Determine RPC URL with fallback options
    let rpcUrl = process.env.SEPOLIA_RPC_URL;
    
    if (!rpcUrl) {
      if (process.env.ALCHEMY_API_KEY) {
        rpcUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
        console.log("🔗 Using Alchemy RPC provider");
      } else if (process.env.INFURA_API_KEY) {
        rpcUrl = `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`;
        console.log("🔗 Using Infura RPC provider");
      } else {
        rpcUrl = "https://rpc.ankr.com/eth_sepolia";
        console.log("🔗 Using public Ankr RPC provider (limited rate)");
      }
    } else {
      console.log("🔗 Using custom RPC URL");
    }
    
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    
    // Create wallet from private key
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const address = wallet.address;

    console.log(`👤 Wallet Address: ${address}`);
    console.log(`🌐 Network: Sepolia Testnet`);
    console.log(`🔗 RPC URL: ${rpcUrl.replace(/\/v3\/[^\/]+/, '/v3/***')}`);

    // Get balance
    const balance = await provider.getBalance(address);
    const balanceInEth = ethers.formatEther(balance);

    console.log(`💰 Balance: ${balanceInEth} ETH`);

    // Check if balance is sufficient for deployment
    const estimatedDeploymentCost = ethers.parseEther("0.01"); // Rough estimate
    const isSufficient = balance > estimatedDeploymentCost;

    if (isSufficient) {
      console.log(`✅ Sufficient balance for deployment (estimated cost: ~0.01 ETH)`);
      console.log(`🚀 You can now run: npm run deploy:sepolia`);
    } else {
      console.log(`❌ Insufficient balance for deployment`);
      console.log(`📝 Get Sepolia testnet ETH from:`);
      console.log(`   • https://sepoliafaucet.com/`);
      console.log(`   • https://www.infura.io/faucet/sepolia`);
      console.log(`   • https://faucets.chain.link/sepolia`);
    }

    // Get current gas price
    try {
      const gasPrice = await provider.getFeeData();
      console.log(`⛽ Current Gas Price: ${ethers.formatUnits(gasPrice.gasPrice, 'gwei')} gwei`);
    } catch (error) {
      console.log(`⚠️  Could not fetch gas price: ${error.message}`);
    }

  } catch (error) {
    console.error("❌ Error checking balance:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Make sure your .env file has the correct PRIVATE_KEY");
    console.log("2. Ensure you have a valid INFURA_API_KEY or SEPOLIA_RPC_URL");
    console.log("3. Check your internet connection");
    console.log("4. Verify that the Sepolia network is accessible");
  }
}

if (require.main === module) {
  checkSepoliaBalance();
}

module.exports = { checkSepoliaBalance };
