#!/usr/bin/env node

/**
 * Deployment and Setup Script for EduMeta dApp
 * This script helps deploy the contract and configure the React app
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 EduMeta dApp Deployment Helper\n');

// Check if we're in the web directory
if (!fs.existsSync('package.json') || !fs.existsSync('src/App.js')) {
  console.error('❌ Please run this script from the web directory');
  process.exit(1);
}

// Check if .env exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ .env file created');
} else {
  console.log('✅ .env file already exists');
}

// Function to update .env file
function updateEnvFile(key, value) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  let found = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(`${key}=`)) {
      lines[i] = `${key}=${value}`;
      found = true;
      break;
    }
  }
  
  if (!found) {
    lines.push(`${key}=${value}`);
  }
  
  fs.writeFileSync(envPath, lines.join('\n'));
}

// Function to deploy contract
async function deployContract() {
  console.log('\n🔧 Deploying EduMeta contract...');
  
  try {
    // Change to parent directory where hardhat config is
    const parentDir = path.join(__dirname, '..');
    process.chdir(parentDir);
    
    // Check if .env exists in parent directory
    if (!fs.existsSync('.env')) {
      console.error('❌ .env file not found in parent directory');
      console.log('Please run the setup script first: node scripts/setup-env.js');
      return null;
    }
    
    // Deploy to Sepolia
    console.log('📡 Deploying to Sepolia testnet...');
    const deployOutput = execSync('npx hardhat run scripts/deploy.js --network sepolia', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    // Extract contract address from deployment output
    const addressMatch = deployOutput.match(/Contract deployed to: (0x[a-fA-F0-9]{40})/);
    if (addressMatch) {
      const contractAddress = addressMatch[1];
      console.log(`✅ Contract deployed to: ${contractAddress}`);
      return contractAddress;
    } else {
      console.error('❌ Could not extract contract address from deployment output');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    return null;
  }
}

// Function to verify contract
async function verifyContract(contractAddress) {
  console.log('\n🔍 Verifying contract on Etherscan...');
  
  try {
    const parentDir = path.join(__dirname, '..');
    process.chdir(parentDir);
    
    execSync(`npx hardhat verify --network sepolia ${contractAddress}`, {
      stdio: 'inherit'
    });
    
    console.log('✅ Contract verified successfully');
  } catch (error) {
    console.log('⚠️  Contract verification failed (this is normal if already verified)');
  }
}

// Main execution
async function main() {
  console.log('Choose an option:');
  console.log('1. Deploy contract and update dApp configuration');
  console.log('2. Update dApp configuration only');
  console.log('3. Just verify existing contract');
  
  // For now, we'll do option 1 by default
  console.log('\n🔄 Proceeding with option 1...');
  
  // Deploy contract
  const contractAddress = await deployContract();
  
  if (contractAddress) {
    // Update .env file with contract address
    console.log('\n📝 Updating dApp configuration...');
    updateEnvFile('REACT_APP_CONTRACT_ADDRESS', contractAddress);
    console.log('✅ Contract address updated in .env');
    
    // Verify contract
    await verifyContract(contractAddress);
    
    console.log('\n🎉 Setup complete!');
    console.log('\nNext steps:');
    console.log('1. Start the React app: npm start');
    console.log('2. Open http://localhost:3000 in your browser');
    console.log('3. Connect your MetaMask wallet (make sure you\'re on Sepolia)');
    console.log('4. Start using your dApp!');
    
    console.log('\n📋 Contract Details:');
    console.log(`Address: ${contractAddress}`);
    console.log(`Network: Sepolia Testnet`);
    console.log(`Explorer: https://sepolia.etherscan.io/address/${contractAddress}`);
    
  } else {
    console.log('\n❌ Setup failed. Please check the errors above.');
    console.log('\nManual setup:');
    console.log('1. Deploy contract manually: npx hardhat run scripts/deploy.js --network sepolia');
    console.log('2. Update REACT_APP_CONTRACT_ADDRESS in web/.env');
    console.log('3. Start the React app: cd web && npm start');
  }
}

// Run the script
main().catch(console.error);
