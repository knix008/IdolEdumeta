#!/usr/bin/env node

const { ethers } = require('ethers');
const chalk = require('chalk');
const inquirer = require('inquirer');
const {
    initializeProvider,
    initializeSigner,
    initializeContract,
    validateAddress,
    validateAmount,
    formatEther,
    parseEther,
    formatAddress,
    NETWORK_INFO
} = require('./config');

async function approveTokens() {
    console.log(chalk.blue.bold('🎓 EduMeta Token Approver\n'));
    
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

        // Get current balance
        const balance = await contract.balanceOf(signerAddress);
        const balanceEth = formatEther(balance);
        console.log(chalk.cyan(`💰 Your Balance: ${balanceEth} EDT\n`));

        // Get user input
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'spender',
                message: 'Enter spender address:',
                validate: (input) => {
                    try {
                        validateAddress(input);
                        return true;
                    } catch (error) {
                        return error.message;
                    }
                }
            },
            {
                type: 'input',
                name: 'amount',
                message: 'Enter amount to approve (EDT):',
                validate: (input) => {
                    try {
                        validateAmount(input);
                        return true;
                    } catch (error) {
                        return error.message;
                    }
                }
            },
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Confirm approval transaction?',
                default: false
            }
        ]);

        if (!answers.confirm) {
            console.log(chalk.yellow('❌ Transaction cancelled'));
            return;
        }

        // Get current allowance
        const currentAllowance = await contract.allowance(signerAddress, answers.spender);
        const currentAllowanceEth = formatEther(currentAllowance);

        // Approve tokens
        console.log(chalk.yellow('\n✅ Approving tokens...'));
        const amountWei = parseEther(answers.amount);
        
        const tx = await contract.approve(answers.spender, amountWei);
        console.log(chalk.blue(`📋 Transaction hash: ${tx.hash}`));
        console.log(chalk.yellow('⏳ Waiting for confirmation...'));

        const receipt = await tx.wait();
        
        if (receipt.status === 1) {
            console.log(chalk.green('\n✅ Approval successful!'));
            console.log(chalk.green(`✅ Approved: ${answers.amount} EDT`));
            console.log(chalk.green(`👤 Spender: ${formatAddress(answers.spender)}`));
            console.log(chalk.green(`🔗 Explorer: ${NETWORK_INFO.explorer}/tx/${tx.hash}`));
            
            // Show updated allowance
            const newAllowance = await contract.allowance(signerAddress, answers.spender);
            const newAllowanceEth = formatEther(newAllowance);
            console.log(chalk.cyan(`💰 New Allowance: ${newAllowanceEth} EDT (was ${currentAllowanceEth} EDT)`));
        } else {
            console.log(chalk.red('\n❌ Approval failed'));
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
    
    if (args.length === 2) {
        // Direct usage: node approve-tokens.js <spender> <amount>
        const [spender, amount] = args;
        
        (async () => {
            try {
                const provider = initializeProvider();
                const signer = initializeSigner(provider);
                const contract = initializeContract(provider, signer);
                
                validateAddress(spender);
                validateAmount(amount);
                
                const signerAddress = await signer.getAddress();
                
                console.log(chalk.blue.bold('🎓 EduMeta Token Approver\n'));
                console.log(chalk.green(`✅ Connected as: ${formatAddress(signerAddress)}`));
                console.log(chalk.yellow(`✅ Approving ${amount} EDT for ${formatAddress(spender)}...`));
                
                const tx = await contract.approve(spender, parseEther(amount));
                const receipt = await tx.wait();
                
                if (receipt.status === 1) {
                    console.log(chalk.green('\n✅ Approval successful!'));
                    console.log(chalk.green(`🔗 Explorer: ${NETWORK_INFO.explorer}/tx/${tx.hash}`));
                } else {
                    console.log(chalk.red('\n❌ Approval failed'));
                }
                
            } catch (error) {
                console.error(chalk.red('\n❌ Error:'), error.message);
            }
        })();
    } else {
        // Interactive mode
        approveTokens();
    }
}

module.exports = { approveTokens };
