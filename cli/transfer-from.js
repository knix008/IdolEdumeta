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

async function transferFrom() {
    console.log(chalk.blue.bold('🎓 EduMeta Token Transfer From\n'));
    
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

        // Get user input
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'from',
                message: 'Enter from address (token owner):',
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
                name: 'to',
                message: 'Enter to address (recipient):',
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
                message: 'Enter amount to transfer (EDT):',
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
                message: 'Confirm transferFrom transaction?',
                default: false
            }
        ]);

        if (!answers.confirm) {
            console.log(chalk.yellow('❌ Transaction cancelled'));
            return;
        }

        // Check balances and allowances
        console.log(chalk.yellow('\n📊 Checking balances and allowances...'));
        
        const fromBalance = await contract.balanceOf(answers.from);
        const fromBalanceEth = formatEther(fromBalance);
        
        const allowance = await contract.allowance(answers.from, signerAddress);
        const allowanceEth = formatEther(allowance);
        
        const amountWei = parseEther(answers.amount);
        
        console.log(chalk.cyan(`💰 From Balance: ${fromBalanceEth} EDT`));
        console.log(chalk.cyan(`✅ Allowance: ${allowanceEth} EDT`));
        console.log(chalk.cyan(`📤 Transfer Amount: ${answers.amount} EDT`));

        // Validate transfer
        if (parseFloat(fromBalanceEth) < parseFloat(answers.amount)) {
            console.log(chalk.red(`❌ Insufficient balance. From address has ${fromBalanceEth} EDT`));
            return;
        }

        if (parseFloat(allowanceEth) < parseFloat(answers.amount)) {
            console.log(chalk.red(`❌ Insufficient allowance. You can transfer ${allowanceEth} EDT`));
            return;
        }

        // Transfer tokens
        console.log(chalk.yellow('\n📤 Transferring tokens...'));
        
        const tx = await contract.transferFrom(answers.from, answers.to, amountWei);
        console.log(chalk.blue(`📋 Transaction hash: ${tx.hash}`));
        console.log(chalk.yellow('⏳ Waiting for confirmation...'));

        const receipt = await tx.wait();
        
        if (receipt.status === 1) {
            console.log(chalk.green('\n✅ Transfer successful!'));
            console.log(chalk.green(`📤 Transferred: ${answers.amount} EDT`));
            console.log(chalk.green(`👤 From: ${formatAddress(answers.from)}`));
            console.log(chalk.green(`👤 To: ${formatAddress(answers.to)}`));
            console.log(chalk.green(`🔗 Explorer: ${NETWORK_INFO.explorer}/tx/${tx.hash}`));
            
            // Show updated balances
            const newFromBalance = await contract.balanceOf(answers.from);
            const newFromBalanceEth = formatEther(newFromBalance);
            const newToBalance = await contract.balanceOf(answers.to);
            const newToBalanceEth = formatEther(newToBalance);
            const newAllowance = await contract.allowance(answers.from, signerAddress);
            const newAllowanceEth = formatEther(newAllowance);
            
            console.log(chalk.cyan('\n📊 Updated Information:'));
            console.log(chalk.cyan(`💰 From New Balance: ${newFromBalanceEth} EDT (was ${fromBalanceEth} EDT)`));
            console.log(chalk.cyan(`💰 To New Balance: ${newToBalanceEth} EDT`));
            console.log(chalk.cyan(`✅ New Allowance: ${newAllowanceEth} EDT (was ${allowanceEth} EDT)`));
        } else {
            console.log(chalk.red('\n❌ Transfer failed'));
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
    
    if (args.length === 3) {
        // Direct usage: node transfer-from.js <from> <to> <amount>
        const [from, to, amount] = args;
        
        (async () => {
            try {
                const provider = initializeProvider();
                const signer = initializeSigner(provider);
                const contract = initializeContract(provider, signer);
                
                validateAddress(from);
                validateAddress(to);
                validateAmount(amount);
                
                const signerAddress = await signer.getAddress();
                
                console.log(chalk.blue.bold('🎓 EduMeta Token Transfer From\n'));
                console.log(chalk.green(`✅ Connected as: ${formatAddress(signerAddress)}`));
                console.log(chalk.yellow(`📤 Transferring ${amount} EDT from ${formatAddress(from)} to ${formatAddress(to)}...`));
                
                const tx = await contract.transferFrom(from, to, parseEther(amount));
                const receipt = await tx.wait();
                
                if (receipt.status === 1) {
                    console.log(chalk.green('\n✅ Transfer successful!'));
                    console.log(chalk.green(`🔗 Explorer: ${NETWORK_INFO.explorer}/tx/${tx.hash}`));
                } else {
                    console.log(chalk.red('\n❌ Transfer failed'));
                }
                
            } catch (error) {
                console.error(chalk.red('\n❌ Error:'), error.message);
            }
        })();
    } else {
        // Interactive mode
        transferFrom();
    }
}

module.exports = { transferFrom };
