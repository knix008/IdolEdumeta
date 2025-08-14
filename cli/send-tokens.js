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

async function sendTokens() {
    console.log(chalk.blue.bold('🎓 EduMeta Token Sender\n'));
    
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

        if (parseFloat(balanceEth) === 0) {
            console.log(chalk.red('❌ Insufficient balance to send tokens'));
            return;
        }

        // Get user input
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'recipient',
                message: 'Enter recipient address:',
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
                message: 'Enter amount to send (EDT):',
                validate: (input) => {
                    try {
                        const amount = validateAmount(input);
                        if (amount > parseFloat(balanceEth)) {
                            return `Insufficient balance. You have ${balanceEth} EDT`;
                        }
                        return true;
                    } catch (error) {
                        return error.message;
                    }
                }
            },
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Confirm transaction?',
                default: false
            }
        ]);

        if (!answers.confirm) {
            console.log(chalk.yellow('❌ Transaction cancelled'));
            return;
        }

        // Send transaction
        console.log(chalk.yellow('\n📤 Sending transaction...'));
        const amountWei = parseEther(answers.amount);
        
        const tx = await contract.transfer(answers.recipient, amountWei);
        console.log(chalk.blue(`📋 Transaction hash: ${tx.hash}`));
        console.log(chalk.yellow('⏳ Waiting for confirmation...'));

        const receipt = await tx.wait();
        
        if (receipt.status === 1) {
            console.log(chalk.green('\n✅ Transaction successful!'));
            console.log(chalk.green(`📤 Sent: ${answers.amount} EDT`));
            console.log(chalk.green(`👤 To: ${formatAddress(answers.recipient)}`));
            console.log(chalk.green(`🔗 Explorer: ${NETWORK_INFO.explorer}/tx/${tx.hash}`));
            
            // Show updated balance
            const newBalance = await contract.balanceOf(signerAddress);
            const newBalanceEth = formatEther(newBalance);
            console.log(chalk.cyan(`💰 New Balance: ${newBalanceEth} EDT`));
        } else {
            console.log(chalk.red('\n❌ Transaction failed'));
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
        // Direct usage: node send-tokens.js <recipient> <amount>
        const [recipient, amount] = args;
        
        (async () => {
            try {
                const provider = initializeProvider();
                const signer = initializeSigner(provider);
                const contract = initializeContract(provider, signer);
                
                validateAddress(recipient);
                const amountNum = validateAmount(amount);
                
                const signerAddress = await signer.getAddress();
                const balance = await contract.balanceOf(signerAddress);
                const balanceEth = formatEther(balance);
                
                if (amountNum > parseFloat(balanceEth)) {
                    throw new Error(`Insufficient balance. You have ${balanceEth} EDT`);
                }
                
                console.log(chalk.blue.bold('🎓 EduMeta Token Sender\n'));
                console.log(chalk.green(`✅ Connected as: ${formatAddress(signerAddress)}`));
                console.log(chalk.green(`💰 Balance: ${balanceEth} EDT`));
                console.log(chalk.yellow(`📤 Sending ${amount} EDT to ${formatAddress(recipient)}...`));
                
                const tx = await contract.transfer(recipient, parseEther(amount));
                const receipt = await tx.wait();
                
                if (receipt.status === 1) {
                    console.log(chalk.green('\n✅ Transaction successful!'));
                    console.log(chalk.green(`🔗 Explorer: ${NETWORK_INFO.explorer}/tx/${tx.hash}`));
                } else {
                    console.log(chalk.red('\n❌ Transaction failed'));
                }
                
            } catch (error) {
                console.error(chalk.red('\n❌ Error:'), error.message);
            }
        })();
    } else {
        // Interactive mode
        sendTokens();
    }
}

module.exports = { sendTokens };
