
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function sepoliaSetup() {
  console.log("🌐 Sepolia Testnet Setup Guide\n");

  console.log("📋 Step 1: Get Sepolia Testnet ETH");
  console.log("You'll need Sepolia testnet ETH to deploy your contract. Get it from:");
  console.log("  • Alchemy Sepolia Faucet: https://sepoliafaucet.com/");
  console.log("  • Infura Sepolia Faucet: https://www.infura.io/faucet/sepolia");
  console.log("  • Chainlink Faucet: https://faucets.chain.link/sepolia");
  console.log("  • QuickNode Faucet: https://faucet.quicknode.com/ethereum/sepolia");
  console.log("");

  console.log("📋 Step 2: Get API Keys");
  console.log("You'll need API keys for RPC endpoints and contract verification:");
  console.log("  • Infura: https://infura.io/ (for RPC endpoint)");
  console.log("  • Alchemy: https://alchemy.com/ (alternative RPC endpoint)");
  console.log("  • Etherscan: https://etherscan.io/ (for contract verification)");
  console.log("");

  console.log("📋 Step 3: Update your .env file");
  console.log("Edit your .env file with the following values:");
  console.log("");
  console.log("  # Required for Sepolia deployment");
  console.log("  PRIVATE_KEY=your_wallet_private_key_here");
  console.log("  INFURA_API_KEY=your_infura_api_key_here");
  console.log("  ETHERSCAN_API_KEY=your_etherscan_api_key_here");
  console.log("");
  console.log("  # Optional: Alternative RPC providers");
  console.log("  ALCHEMY_API_KEY=your_alchemy_api_key_here");
  console.log("  SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_infura_api_key");
  console.log("");

  console.log("📋 Step 4: Deploy to Sepolia");
  console.log("Once you have testnet ETH and API keys:");
  console.log("  npm run deploy:sepolia");
  console.log("");

  console.log("📋 Step 5: Verify Contract");
  console.log("After deployment, verify your contract on Etherscan:");
  console.log("  npm run verify:sepolia <CONTRACT_ADDRESS>");
  console.log("");

  console.log("🔗 Useful Links:");
  console.log("  • Sepolia Etherscan: https://sepolia.etherscan.io/");
  console.log("  • Sepolia Block Explorer: https://sepolia.etherscan.io/");
  console.log("  • Sepolia Network Info: https://chainlist.org/chain/11155111");
  console.log("");

  // Check if .env exists and show current configuration
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    console.log("📊 Current .env Configuration:");
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        if (key && value) {
          const displayValue = key === 'PRIVATE_KEY' 
            ? `${value.substring(0, 6)}...${value.substring(value.length - 4)}`
            : value;
          console.log(`  ${key}: ${displayValue}`);
        }
      }
    });
  } else {
    console.log("❌ .env file not found. Run 'npm run setup' first.");
  }
}

if (require.main === module) {
  sepoliaSetup();
}

module.exports = { sepoliaSetup };
