const fs = require('fs');
const path = require('path');

function setupEnv() {
  const envExamplePath = path.join(__dirname, '..', 'env.example');
  const envPath = path.join(__dirname, '..', '.env');

  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists. Skipping setup.');
    return;
  }

  // Check if env.example exists
  if (!fs.existsSync(envExamplePath)) {
    console.log('❌ env.example file not found. Please create it first.');
    return;
  }

  try {
    // Copy env.example to .env
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created successfully from env.example');
    console.log('📝 Please edit .env file with your actual values:');
    console.log('   - Replace PRIVATE_KEY with your actual private key');
    console.log('   - Add your API keys for Etherscan, Alchemy, or Infura');
    console.log('   - Update network configurations as needed');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
  }
}

setupEnv();
