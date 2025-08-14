#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

async function setupEnvironment() {
    console.log(chalk.blue.bold('🎓 EduMeta CLI Environment Setup\n'));
    
    try {
        const envPath = path.join(__dirname, '.env');
        const examplePath = path.join(__dirname, 'env.example');
        
        // Check if .env already exists
        if (fs.existsSync(envPath)) {
            const answers = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'overwrite',
                    message: '.env file already exists. Do you want to overwrite it?',
                    default: false
                }
            ]);
            
            if (!answers.overwrite) {
                console.log(chalk.yellow('❌ Setup cancelled'));
                return;
            }
        }
        
        // Check if env.example exists
        if (!fs.existsSync(examplePath)) {
            console.log(chalk.red('❌ env.example file not found'));
            return;
        }
        
        // Copy env.example to .env
        fs.copyFileSync(examplePath, envPath);
        console.log(chalk.green('✅ Created .env file from template'));
        
        // Get user input for configuration
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'contractAddress',
                message: 'Enter your deployed contract address:',
                validate: (input) => {
                    if (!input || input === '0x0000000000000000000000000000000000000000') {
                        return 'Please enter a valid contract address';
                    }
                    if (!input.startsWith('0x') || input.length !== 42) {
                        return 'Contract address must be 42 characters starting with 0x';
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'privateKey',
                message: 'Enter your private key (without 0x prefix):',
                validate: (input) => {
                    if (!input) {
                        return 'Private key is required';
                    }
                    if (input.startsWith('0x')) {
                        return 'Private key should not start with 0x';
                    }
                    if (input.length !== 64) {
                        return 'Private key must be 64 characters';
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'accountAddress',
                message: 'Enter your account address:',
                validate: (input) => {
                    if (!input) {
                        return 'Account address is required';
                    }
                    if (!input.startsWith('0x') || input.length !== 42) {
                        return 'Account address must be 42 characters starting with 0x';
                    }
                    return true;
                }
            },
            {
                type: 'list',
                name: 'rpcChoice',
                message: 'Choose your RPC provider:',
                choices: [
                    { name: 'Ankr (Free)', value: 'ankr' },
                    { name: 'Infura (Requires API Key)', value: 'infura' },
                    { name: 'Custom RPC URL', value: 'custom' }
                ]
            }
        ]);
        
        // Handle RPC configuration
        let rpcUrl = '';
        if (answers.rpcChoice === 'infura') {
            const infuraAnswer = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'infuraKey',
                    message: 'Enter your Infura API key:',
                    validate: (input) => {
                        if (!input) {
                            return 'Infura API key is required';
                        }
                        return true;
                    }
                }
            ]);
            rpcUrl = `https://sepolia.infura.io/v3/${infuraAnswer.infuraKey}`;
        } else if (answers.rpcChoice === 'custom') {
            const customAnswer = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'customRpc',
                    message: 'Enter your custom RPC URL:',
                    validate: (input) => {
                        if (!input) {
                            return 'RPC URL is required';
                        }
                        if (!input.startsWith('http')) {
                            return 'RPC URL must start with http:// or https://';
                        }
                        return true;
                    }
                }
            ]);
            rpcUrl = customAnswer.customRpc;
        } else {
            rpcUrl = 'https://rpc.ankr.com/eth_sepolia';
        }
        
        // Read the .env file
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        // Replace placeholders with user input
        envContent = envContent.replace(
            /CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000/,
            `CONTRACT_ADDRESS=${answers.contractAddress}`
        );
        
        envContent = envContent.replace(
            /PRIVATE_KEY=your_private_key_here_without_0x_prefix/,
            `PRIVATE_KEY=${answers.privateKey}`
        );
        
        envContent = envContent.replace(
            /ACCOUNT_ADDRESS=your_account_address_here/,
            `ACCOUNT_ADDRESS=${answers.accountAddress}`
        );
        
        envContent = envContent.replace(
            /SEPOLIA_RPC_URL=https:\/\/rpc\.ankr\.com\/eth_sepolia/,
            `SEPOLIA_RPC_URL=${rpcUrl}`
        );
        
        // Write updated .env file
        fs.writeFileSync(envPath, envContent);
        
        console.log(chalk.green('\n✅ Environment configuration completed!'));
        console.log(chalk.cyan('\n📋 Configuration Summary:'));
        console.log(chalk.white(`📄 Contract: ${answers.contractAddress}`));
        console.log(chalk.white(`👤 Account: ${answers.accountAddress}`));
        console.log(chalk.white(`🔗 RPC: ${rpcUrl}`));
        
        console.log(chalk.yellow('\n🔒 Security Reminder:'));
        console.log(chalk.white('• Keep your .env file secure and never commit it to version control'));
        console.log(chalk.white('• Your private key is stored locally and should be kept confidential'));
        console.log(chalk.white('• Use a dedicated account for testing purposes'));
        
        console.log(chalk.green('\n🚀 You can now use the CLI tools:'));
        console.log(chalk.white('• npm run help - Show available commands'));
        console.log(chalk.white('• npm run info - Check token information'));
        console.log(chalk.white('• npm run receive - Check your balance'));
        
    } catch (error) {
        console.error(chalk.red('\n❌ Setup failed:'), error.message);
    }
}

// Handle command line arguments
if (require.main === module) {
    setupEnvironment();
}

module.exports = { setupEnvironment };
