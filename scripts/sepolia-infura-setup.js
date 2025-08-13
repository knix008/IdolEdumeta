const fs = require('fs');
const path = require('path');

function sepoliaInfuraSetup() {
  console.log("🌐 Sepolia Infura Setup Guide\n");

  console.log("📋 Step 1: Get Infura API Key");
  console.log("1. Go to https://infura.io/");
  console.log("2. Sign up for a free account");
  console.log("3. Create a new project");
  console.log("4. Copy your Project ID (this is your API key)");
  console.log("5. Make sure Sepolia network is enabled in your project");
  console.log("");

  console.log("📋 Step 2: Get Sepolia Testnet ETH");
  console.log("You'll need Sepolia testnet ETH to deploy your contract:");
  console.log("  • Infura Sepolia Faucet: https://www.infura.io/faucet/sepolia");
  console.log("  • Alchemy Sepolia Faucet: https://sepoliafaucet.com/");
  console.log("  • Chainlink Faucet: https://faucets.chain.link/sepolia");
  console.log("");

  console.log("📋 Step 3: Update Your .env File");
  console.log("Edit your .env file with the following values:");
  console.log("");
  console.log("  # Required for Sepolia Infura deployment");
  console.log("  PRIVATE_KEY=your_wallet_private_key_here");
  console.log("  INFURA_API_KEY=your_infura_project_id_here");
  console.log("  ETHERSCAN_API_KEY=your_etherscan_api_key_here");
  console.log("");
  console.log("  # Optional: Direct Sepolia Infura URL");
  console.log("  # SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_infura_project_id");
  console.log("");

  console.log("📋 Step 4: Test Your Configuration");
  console.log("Run these commands to verify your setup:");
  console.log("  npm run check-env");
  console.log("  npm run check-sepolia");
  console.log("");

  console.log("📋 Step 5: Deploy to Sepolia");
  console.log("Once everything is configured:");
  console.log("  npm run deploy:sepolia");
  console.log("");

  console.log("🔗 Sepolia Infura Endpoints:");
  console.log("  • HTTP: https://sepolia.infura.io/v3/YOUR_PROJECT_ID");
  console.log("  • WebSocket: wss://sepolia.infura.io/ws/v3/YOUR_PROJECT_ID");
  console.log("");

  console.log("📊 Network Information:");
  console.log("  • Network Name: Sepolia Testnet");
  console.log("  • Chain ID: 11155111");
  console.log("  • Currency: Sepolia ETH");
  console.log("  • Block Explorer: https://sepolia.etherscan.io/");
  console.log("");

  // Check current configuration
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    console.log("📊 Current Configuration:");
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    let hasInfuraConfig = false;
    lines.forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        if (key && value && (key === 'INFURA_API_KEY' || key === 'SEPOLIA_RPC_URL')) {
          const displayValue = key === 'INFURA_API_KEY' && value !== 'your_infura_api_key_here'
            ? `${value.substring(0, 6)}...${value.substring(value.length - 4)}`
            : value;
          console.log(`  ${key}: ${displayValue}`);
          hasInfuraConfig = true;
        }
      }
    });
    
    if (!hasInfuraConfig) {
      console.log("  ❌ No Infura configuration found");
      console.log("  📝 Please add INFURA_API_KEY to your .env file");
    } else {
      console.log("  ✅ Infura configuration found");
    }
  } else {
    console.log("❌ .env file not found. Run 'npm run setup' first.");
  }

  console.log("\n💡 **Infura Free Tier Limits:**");
  console.log("  • 100,000 requests per day");
  console.log("  • 25 requests per second");
  console.log("  • Perfect for development and testing");
  console.log("");

  console.log("🚀 **Ready to Deploy?**");
  console.log("1. Add your Infura Project ID to .env file");
  console.log("2. Add your wallet's private key");
  console.log("3. Get some Sepolia ETH from faucets");
  console.log("4. Run: npm run deploy:sepolia");
}

if (require.main === module) {
  sepoliaInfuraSetup();
}

module.exports = { sepoliaInfuraSetup };
