#!/usr/bin/env node

const { ethers } = require('ethers');
const chalk = require('chalk');
const inquirer = require('inquirer');
const {
    initializeProvider,
    initializeSigner,
    initializeContract,
    formatAddress,
    NETWORK_INFO
} = require('./config');

async function pauseContract() {
    console.log(chalk.blue.bold('🎓 EduMeta Contract Pauser (Owner Only)\n'));
    
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

        // Check if signer is owner
        console.log(chalk.yellow('🔍 Checking ownership...'));
        const owner = await contract.owner();
        const isOwner = owner.toLowerCase() === signerAddress.toLowerCase();
        
        if (!isOwner) {
            console.log(chalk.red('❌ Access denied: Only contract owner can pause the contract'));
            console.log(chalk.yellow(`👑 Contract owner: ${formatAddress(owner)}`));
            return;
        }
        
        console.log(chalk.green('👑 You are the contract owner!\n'));

        // Check current pause status
        console.log(chalk.yellow('📊 Checking current status...'));
        const isPaused = await contract.paused();
        
        if (isPaused) {
            console.log(chalk.red('❌ Contract is already paused'));
            return;
        }
        
        console.log(chalk.green('✅ Contract is currently active\n'));

        // Get user confirmation
        const answers = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: '⚠️  Warning: Pausing will prevent all token transfers! Confirm pause transaction?',
                default: false
            }
        ]);

        if (!answers.confirm) {
            console.log(chalk.yellow('❌ Transaction cancelled'));
            return;
        }

        // Pause contract
        console.log(chalk.yellow('\n⏸️  Pausing contract...'));
        
        const tx = await contract.pause();
        console.log(chalk.blue(`📋 Transaction hash: ${tx.hash}`));
        console.log(chalk.yellow('⏳ Waiting for confirmation...'));

        const receipt = await tx.wait();
        
        if (receipt.status === 1) {
            console.log(chalk.green('\n✅ Contract paused successfully!'));
            console.log(chalk.green(`⏸️  All token transfers are now disabled`));
            console.log(chalk.green(`🔗 Explorer: ${NETWORK_INFO.explorer}/tx/${tx.hash}`));
            
            // Verify pause status
            const newPauseStatus = await contract.paused();
            console.log(chalk.cyan(`📊 Contract Status: ${newPauseStatus ? 'Paused' : 'Active'}`));
        } else {
            console.log(chalk.red('\n❌ Pause failed'));
        }

    } catch (error) {
        console.error(chalk.red('\n❌ Error:'), error.message);
        
        if (error.message.includes('insufficient funds')) {
            console.log(chalk.yellow('💡 Tip: Make sure you have enough ETH for gas fees'));
        }
    }
}

// Handle command line arguments
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        // Interactive mode
        pauseContract();
    } else {
        // Direct usage: node pause-contract.js
        (async () => {
            try {
                const provider = initializeProvider();
                const signer = initializeSigner(provider);
                const contract = initializeContract(provider, signer);
                
                const signerAddress = await signer.getAddress();
                const owner = await contract.owner();
                const isOwner = owner.toLowerCase() === signerAddress.toLowerCase();
                
                if (!isOwner) {
                    console.log(chalk.red('❌ Access denied: Only contract owner can pause the contract'));
                    return;
                }
                
                const isPaused = await contract.paused();
                if (isPaused) {
                    console.log(chalk.red('❌ Contract is already paused'));
                    return;
                }
                
                console.log(chalk.blue.bold('🎓 EduMeta Contract Pauser\n'));
                console.log(chalk.green(`✅ Connected as: ${formatAddress(signerAddress)}`));
                console.log(chalk.yellow('⏸️  Pausing contract...'));
                
                const tx = await contract.pause();
                const receipt = await tx.wait();
                
                if (receipt.status === 1) {
                    console.log(chalk.green('\n✅ Contract paused successfully!'));
                    console.log(chalk.green(`🔗 Explorer: ${NETWORK_INFO.explorer}/tx/${tx.hash}`));
                } else {
                    console.log(chalk.red('\n❌ Pause failed'));
                }
                
            } catch (error) {
                console.error(chalk.red('\n❌ Error:'), error.message);
            }
        })();
    }
}

module.exports = { pauseContract };
