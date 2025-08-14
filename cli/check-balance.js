#!/usr/bin/env node

const { ethers } = require('ethers');
const chalk = require('chalk');
const inquirer = require('inquirer');
const {
    initializeProvider,
    initializeSigner,
    initializeContract,
    validateAddress,
    formatEther,
    formatAddress,
    NETWORK_INFO
} = require('./config');

async function checkBalance(address = null) {
    console.log(chalk.blue.bold('🎓 EduMeta Token Balance Checker\n'));
    
    try {
        // Initialize connection
        console.log(chalk.yellow('🔗 Connecting to network...'));
        const provider = initializeProvider();
        const signer = initializeSigner(provider);
        const contract = initializeContract(provider, signer);
        
        const signerAddress = await signer.getAddress();
        console.log(chalk.green(`✅ Connected as: ${formatAddress(signerAddress)}`));
        console.log(chalk.green(`🌐 Network: ${NETWORK_INFO.name}`));
        console.log(chalk.green(`📄 Contract: ${formatAddress(contract.target)}\n`));

        // Get address to check
        let targetAddress = address;
        if (!targetAddress) {
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'address',
                    message: 'Enter address to check (or press Enter for your address):',
                    default: signerAddress,
                    validate: (input) => {
                        if (!input) return true;
                        try {
                            validateAddress(input);
                            return true;
                        } catch (error) {
                            return error.message;
                        }
                    }
                }
            ]);
            targetAddress = answers.address || signerAddress;
        }

        // Get balance
        console.log(chalk.yellow('📊 Fetching balance...'));
        const balance = await contract.balanceOf(targetAddress);
        const balanceEth = formatEther(balance);
        
        // Get total supply for comparison
        const totalSupply = await contract.totalSupply();
        const totalSupplyEth = formatEther(totalSupply);
        
        // Calculate percentage
        const percentage = (parseFloat(balanceEth) / parseFloat(totalSupplyEth)) * 100;

        // Display results
        console.log(chalk.cyan('\n📊 Balance Information:'));
        console.log(chalk.white(`👤 Address: ${targetAddress}`));
        console.log(chalk.white(`💰 Balance: ${balanceEth} EDT`));
        console.log(chalk.white(`📈 Total Supply: ${totalSupplyEth} EDT`));
        console.log(chalk.white(`📊 Percentage: ${percentage.toFixed(4)}%`));

        // Get additional token info
        try {
            const name = await contract.name();
            const symbol = await contract.symbol();
            const decimals = await contract.decimals();
            
            console.log(chalk.cyan('\n📋 Token Information:'));
            console.log(chalk.white(`🏷️  Name: ${name}`));
            console.log(chalk.white(`💎 Symbol: ${symbol}`));
            console.log(chalk.white(`🔢 Decimals: ${decimals}`));
        } catch (error) {
            console.log(chalk.yellow('\n⚠️  Could not fetch token information'));
        }

        // Check if address is owner
        try {
            const owner = await contract.owner();
            const isOwner = owner.toLowerCase() === targetAddress.toLowerCase();
            
            if (isOwner) {
                console.log(chalk.green('\n👑 This address is the contract owner!'));
            }
        } catch (error) {
            // Owner function might not be available
        }

        // Check contract status
        try {
            const isPaused = await contract.paused();
            if (isPaused) {
                console.log(chalk.red('\n⏸️  Contract is currently paused'));
            } else {
                console.log(chalk.green('\n✅ Contract is active'));
            }
        } catch (error) {
            // Pause function might not be available
        }

        // Show recent transactions (if it's the signer's address)
        if (targetAddress.toLowerCase() === signerAddress.toLowerCase()) {
            console.log(chalk.cyan('\n📜 Recent Transactions:'));
            try {
                const filter = contract.filters.Transfer(signerAddress, null);
                const sentEvents = await contract.queryFilter(filter);
                
                const filter2 = contract.filters.Transfer(null, signerAddress);
                const receivedEvents = await contract.queryFilter(filter2);
                
                const allEvents = [...sentEvents, ...receivedEvents]
                    .sort((a, b) => b.blockNumber - a.blockNumber)
                    .slice(0, 5);
                
                if (allEvents.length === 0) {
                    console.log(chalk.gray('   No recent transactions'));
                } else {
                    for (const event of allEvents) {
                        const amount = formatEther(event.args[2]);
                        const isSent = event.args[0].toLowerCase() === signerAddress.toLowerCase();
                        const otherAddress = isSent ? event.args[1] : event.args[0];
                        
                        console.log(chalk.gray(`   ${isSent ? '📤' : '📥'} ${isSent ? '-' : '+'}${amount} EDT ${isSent ? 'to' : 'from'} ${formatAddress(otherAddress)}`));
                    }
                }
            } catch (error) {
                console.log(chalk.gray('   Could not fetch recent transactions'));
            }
        }

    } catch (error) {
        console.error(chalk.red('\n❌ Error:'), error.message);
    }
}

// Handle command line arguments
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 1) {
        // Direct usage: node check-balance.js <address>
        const address = args[0];
        checkBalance(address);
    } else {
        // Interactive mode
        checkBalance();
    }
}

module.exports = { checkBalance };
