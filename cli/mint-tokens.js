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

async function mintTokens() {
    console.log(chalk.blue.bold('🎓 EduMeta Token Minter (Owner Only)\n'));
    
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
            console.log(chalk.red('❌ Access denied: Only contract owner can mint tokens'));
            console.log(chalk.yellow(`👑 Contract owner: ${formatAddress(owner)}`));
            return;
        }
        
        console.log(chalk.green('👑 You are the contract owner!\n'));

        // Get current total supply
        const totalSupply = await contract.totalSupply();
        const totalSupplyEth = formatEther(totalSupply);
        console.log(chalk.cyan(`📈 Current Total Supply: ${totalSupplyEth} EDT\n`));

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
                message: 'Enter amount to mint (EDT):',
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
                message: 'Confirm minting transaction?',
                default: false
            }
        ]);

        if (!answers.confirm) {
            console.log(chalk.yellow('❌ Transaction cancelled'));
            return;
        }

        // Get recipient's current balance
        const recipientBalance = await contract.balanceOf(answers.recipient);
        const recipientBalanceEth = formatEther(recipientBalance);

        // Mint tokens
        console.log(chalk.yellow('\n🪙 Minting tokens...'));
        const amountWei = parseEther(answers.amount);
        
        const tx = await contract.mint(answers.recipient, amountWei);
        console.log(chalk.blue(`📋 Transaction hash: ${tx.hash}`));
        console.log(chalk.yellow('⏳ Waiting for confirmation...'));

        const receipt = await tx.wait();
        
        if (receipt.status === 1) {
            console.log(chalk.green('\n✅ Minting successful!'));
            console.log(chalk.green(`🪙 Minted: ${answers.amount} EDT`));
            console.log(chalk.green(`👤 To: ${formatAddress(answers.recipient)}`));
            console.log(chalk.green(`🔗 Explorer: ${NETWORK_INFO.explorer}/tx/${tx.hash}`));
            
            // Show updated balances
            const newTotalSupply = await contract.totalSupply();
            const newTotalSupplyEth = formatEther(newTotalSupply);
            const newRecipientBalance = await contract.balanceOf(answers.recipient);
            const newRecipientBalanceEth = formatEther(newRecipientBalance);
            
            console.log(chalk.cyan('\n📊 Updated Information:'));
            console.log(chalk.cyan(`📈 New Total Supply: ${newTotalSupplyEth} EDT`));
            console.log(chalk.cyan(`💰 Recipient Balance: ${newRecipientBalanceEth} EDT (was ${recipientBalanceEth} EDT)`));
        } else {
            console.log(chalk.red('\n❌ Minting failed'));
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
        // Direct usage: node mint-tokens.js <recipient> <amount>
        const [recipient, amount] = args;
        
        (async () => {
            try {
                const provider = initializeProvider();
                const signer = initializeSigner(provider);
                const contract = initializeContract(provider, signer);
                
                validateAddress(recipient);
                validateAmount(amount);
                
                const signerAddress = await signer.getAddress();
                const owner = await contract.owner();
                const isOwner = owner.toLowerCase() === signerAddress.toLowerCase();
                
                if (!isOwner) {
                    console.log(chalk.red('❌ Access denied: Only contract owner can mint tokens'));
                    return;
                }
                
                console.log(chalk.blue.bold('🎓 EduMeta Token Minter\n'));
                console.log(chalk.green(`✅ Connected as: ${formatAddress(signerAddress)}`));
                console.log(chalk.yellow(`🪙 Minting ${amount} EDT to ${formatAddress(recipient)}...`));
                
                const tx = await contract.mint(recipient, parseEther(amount));
                const receipt = await tx.wait();
                
                if (receipt.status === 1) {
                    console.log(chalk.green('\n✅ Minting successful!'));
                    console.log(chalk.green(`🔗 Explorer: ${NETWORK_INFO.explorer}/tx/${tx.hash}`));
                } else {
                    console.log(chalk.red('\n❌ Minting failed'));
                }
                
            } catch (error) {
                console.error(chalk.red('\n❌ Error:'), error.message);
            }
        })();
    } else {
        // Interactive mode
        mintTokens();
    }
}

module.exports = { mintTokens };
