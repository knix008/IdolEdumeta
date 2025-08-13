const fs = require('fs');
const path = require('path');

function rpcSetup() {
  console.log("🌐 RPC Provider Setup Guide for Sepolia Testnet\n");

  console.log("📋 Available RPC Providers:\n");

  console.log("1️⃣  **Infura** (Most Popular)");
  console.log("   • URL: https://infura.io/");
  console.log("   • Free tier: 100,000 requests/day");
  console.log("   • Easy setup, reliable");
  console.log("   • Environment variable: INFURA_API_KEY");
  console.log("");

  console.log("2️⃣  **Alchemy** (Developer Friendly)");
  console.log("   • URL: https://alchemy.com/");
  console.log("   • Free tier: 300M compute units/month");
  console.log("   • Great developer tools");
  console.log("   • Environment variable: ALCHEMY_API_KEY");
  console.log("");

  console.log("3️⃣  **QuickNode** (High Performance)");
  console.log("   • URL: https://quicknode.com/");
  console.log("   • Free tier: 10M requests/month");
  console.log("   • Fast and reliable");
  console.log("   • Environment variable: SEPOLIA_RPC_URL");
  console.log("");

  console.log("4️⃣  **Ankr** (Public RPC - No API Key)");
  console.log("   • URL: https://rpc.ankr.com/eth_sepolia");
  console.log("   • Free, no signup required");
  console.log("   • Limited rate, good for testing");
  console.log("   • Environment variable: SEPOLIA_RPC_URL");
  console.log("");

  console.log("5️⃣  **Chainstack** (Enterprise)");
  console.log("   • URL: https://chainstack.com/");
  console.log("   • Free tier: 3M requests/month");
  console.log("   • Enterprise features");
  console.log("   • Environment variable: SEPOLIA_RPC_URL");
  console.log("");

  console.log("📝 **How to Configure Your .env File:**\n");

  console.log("**Option 1: Infura**");
  console.log("```env");
  console.log("INFURA_API_KEY=your_infura_api_key_here");
  console.log("```");
  console.log("");

  console.log("**Option 2: Alchemy**");
  console.log("```env");
  console.log("ALCHEMY_API_KEY=your_alchemy_api_key_here");
  console.log("```");
  console.log("");

  console.log("**Option 3: Custom RPC URL**");
  console.log("```env");
  console.log("SEPOLIA_RPC_URL=https://your-custom-endpoint.com");
  console.log("```");
  console.log("");

  console.log("**Option 4: Public RPC (No API Key)**");
  console.log("```env");
  console.log("SEPOLIA_RPC_URL=https://rpc.ankr.com/eth_sepolia");
  console.log("```");
  console.log("");

  console.log("🔧 **Priority Order:**");
  console.log("1. SEPOLIA_RPC_URL (if set, uses this)");
  console.log("2. ALCHEMY_API_KEY (if set, uses Alchemy)");
  console.log("3. INFURA_API_KEY (if set, uses Infura)");
  console.log("4. Public Ankr RPC (fallback)");
  console.log("");

  console.log("💡 **Recommendations:**");
  console.log("• For development: Use Alchemy or Infura");
  console.log("• For testing: Use public Ankr RPC");
  console.log("• For production: Use paid tier of any provider");
  console.log("");

  // Check current configuration
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    console.log("📊 Current RPC Configuration:");
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    let hasRpcConfig = false;
    lines.forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        if (key && value && (key.includes('RPC') || key.includes('API_KEY'))) {
          const displayValue = key.includes('KEY') && value !== 'your_infura_api_key_here' 
            ? `${value.substring(0, 6)}...${value.substring(value.length - 4)}`
            : value;
          console.log(`  ${key}: ${displayValue}`);
          hasRpcConfig = true;
        }
      }
    });
    
    if (!hasRpcConfig) {
      console.log("  ❌ No RPC configuration found");
      console.log("  📝 Please add one of the options above to your .env file");
    }
  } else {
    console.log("❌ .env file not found. Run 'npm run setup' first.");
  }

  console.log("\n🚀 **Next Steps:**");
  console.log("1. Choose your preferred RPC provider");
  console.log("2. Get an API key (if required)");
  console.log("3. Update your .env file");
  console.log("4. Test with: npm run check-sepolia");
  console.log("5. Deploy with: npm run deploy:sepolia");
}

if (require.main === module) {
  rpcSetup();
}

module.exports = { rpcSetup };
