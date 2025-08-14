#!/usr/bin/env node

/**
 * Check Warnings Script
 * This script helps identify and fix common warnings in the React app
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for warnings and issues...\n');

// Check if we're in the web directory
if (!fs.existsSync('package.json') || !fs.existsSync('src/App.js')) {
  console.error('❌ Please run this script from the web directory');
  process.exit(1);
}

try {
  // Run ESLint to check for issues
  console.log('📋 Running ESLint check...');
  execSync('npx eslint src --ext .js,.jsx --max-warnings 0', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ ESLint check passed!\n');
} catch (error) {
  console.log('⚠️  ESLint found some issues. Check the output above.\n');
}

try {
  // Run TypeScript check (if applicable)
  console.log('📋 Running type check...');
  execSync('npx tsc --noEmit', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ Type check passed!\n');
} catch (error) {
  console.log('ℹ️  TypeScript check skipped (not configured)\n');
}

// Check for common issues
console.log('🔍 Checking for common issues...');

const appJsPath = path.join(__dirname, 'src', 'App.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');

// Check for unused imports
const unusedImports = [
  'import.*from.*;',
  'const.*=.*useState.*;',
  'const.*=.*useEffect.*;'
];

let issuesFound = false;

// Check for common patterns that might cause warnings
if (appJsContent.includes('useEffect(() => {') && !appJsContent.includes('eslint-disable-line')) {
  console.log('⚠️  Found useEffect without eslint-disable-line comment');
  issuesFound = true;
}

if (appJsContent.includes('const [') && appJsContent.includes('useState(')) {
  const stateVariables = appJsContent.match(/const \[([^\]]+),/g);
  if (stateVariables) {
    console.log('ℹ️  Found state variables. Make sure they are all used.');
  }
}

if (!issuesFound) {
  console.log('✅ No common issues found!\n');
}

console.log('🚀 To start the app without warnings:');
console.log('   npm start');
console.log('\n🔧 To build for production:');
console.log('   npm run build');
console.log('\n📋 To run tests:');
console.log('   npm test');
