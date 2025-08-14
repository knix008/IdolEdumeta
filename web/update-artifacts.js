#!/usr/bin/env node

/**
 * Update Contract Artifacts Script
 * This script copies the latest contract artifacts from the root directory to the web directory
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Updating contract artifacts...\n');

// Paths
const rootArtifactsPath = path.join(__dirname, '..', 'artifacts');
const webArtifactsPath = path.join(__dirname, 'src', 'artifacts');

// Check if root artifacts exist
if (!fs.existsSync(rootArtifactsPath)) {
  console.error('❌ Root artifacts directory not found!');
  console.log('Please compile your contracts first: npx hardhat compile');
  process.exit(1);
}

// Remove existing web artifacts
if (fs.existsSync(webArtifactsPath)) {
  console.log('🗑️  Removing existing artifacts...');
  fs.rmSync(webArtifactsPath, { recursive: true, force: true });
}

// Copy artifacts
console.log('📋 Copying artifacts...');
try {
  // Create the destination directory
  fs.mkdirSync(webArtifactsPath, { recursive: true });
  
  // Copy the entire artifacts directory
  const copyRecursive = (src, dest) => {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  };
  
  copyRecursive(rootArtifactsPath, webArtifactsPath);
  
  console.log('✅ Artifacts updated successfully!');
  console.log(`📁 Source: ${rootArtifactsPath}`);
  console.log(`📁 Destination: ${webArtifactsPath}`);
  
  // Verify the main contract file
  const contractPath = path.join(webArtifactsPath, 'Contracts', 'EduMetaCoinErc20.sol', 'EduMeta.json');
  if (fs.existsSync(contractPath)) {
    console.log('✅ EduMeta contract ABI found');
  } else {
    console.log('⚠️  EduMeta contract ABI not found - check if contract was compiled');
  }
  
} catch (error) {
  console.error('❌ Error copying artifacts:', error.message);
  process.exit(1);
}

console.log('\n🚀 You can now start the React app: npm start');
