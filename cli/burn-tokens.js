#!/usr/bin/env node

const { ethers } = require('ethers');
const chalk = require('chalk');
const inquirer = require('inquirer');
const {
    initializeProvider,
    initializeSigner,
    initializeContract,
    validateAmount,
    formatEther,
    parseEther,
    formatAddress,
    NETWORK_INFO
} = require('./config');

async function burnTokens() {
    console.log(chalk.blue.bold('🎓 EduMeta Token Burner\n'));
    
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
            console.log(chalk.red('❌ Insufficient balance to burn tokens'));
            return;
        }

        // Check if contract is paused
        try {
            const isPaused = await contract.paused();
            if (isPaused) {
                console.log(chalk.red('❌ Contract is paused. Cannot burn tokens.'));
                return;
            }
        } catch (error) {
            // Pause function might not be available
        }

        // Get user input
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'amount',
                message: 'Enter amount to burn (EDT):',
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
                message: '⚠️  Warning: Burning tokens is irreversible! Confirm burn transaction?',
                default: false
            }
        ]);

        if (!answers.confirm) {
            console.log(chalk.yellow('❌ Transaction cancelled'));
            return;
        }

        // Get current total supply
        const totalSupply = await contract.totalSupply();
        const totalSupplyEth = formatEther(totalSupply);

        // Burn tokens
        console.log(chalk.yellow('\n🔥 Burning tokens...'));
        const amountWei = parseEther(answers.amount);
        
        const tx = await contract.burn(amountWei);
        console.log(chalk.blue(`📋 Transaction hash: ${tx.hash}`));
        console.log(chalk.yellow('⏳ Waiting for confirmation...'));

        const receipt = await tx.wait();
        
        if (receipt.status === 1) {
            console.log(chalk.green('\n✅ Burning successful!'));
            console.log(chalk.green(`🔥 Burned: ${answers.amount} EDT`));
            console.log(chalk.green(`🔗 Explorer: ${NETWORK_INFO.explorer}/tx/${tx.hash}`));
            
            // Show updated balances
            const newBalance = await contract.balanceOf(signerAddress);
            const newBalanceEth = formatEther(newBalance);
            const newTotalSupply = await contract.totalSupply();
            const newTotalSupplyEth = formatEther(newTotalSupply);
            
            console.log(chalk.cyan('\n📊 Updated Information:'));
            console.log(chalk.cyan(`💰 Your New Balance: ${newBalanceEth} EDT (was ${balanceEth} EDT)`));
            console.log(chalk.cyan(`📈 New Total Supply: ${newTotalSupplyEth} EDT (was ${totalSupplyEth} EDT)`));
        } else {
            console.log(chalk.red('\n❌ Burning failed'));
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
    
    if (args.length === 1) {
        // Direct usage: node burn-tokens.js <amount>
        const amount = args[0];
        
        (async () => {
            try {
                const provider = initializeProvider();
                const signer = initializeSigner(provider);
                const contract = initializeContract(provider, signer);
                
                const amountNum = validateAmount(amount);
                const signerAddress = await signer.getAddress();
                const balance = await contract.balanceOf(signerAddress);
                const balanceEth = formatEther(balance);
                
                if (amountNum > parseFloat(balanceEth)) {
                    throw new Error(`Insufficient balance. You have ${balanceEth} EDT`);
                }
                
                console.log(chalk.blue.bold('🎓 EduMeta Token Burner\n'));
                console.log(chalk.green(`✅ Connected as: ${formatAddress(signerAddress)}`));
                console.log(chalk.green(`💰 Balance: ${balanceEth} EDT`));
                console.log(chalk.yellow(`🔥 Burning ${amount} EDT...`));
                
                const tx = await contract.burn(parseEther(amount));
                const receipt = await tx.wait();
                
                if (receipt.status === 1) {
                    console.log(chalk.green('\n✅ Burning successful!'));
                    console.log(chalk.green(`🔗 Explorer: ${NETWORK_INFO.explorer}/tx/${tx.hash}`));
                } else {
                    console.log(chalk.red('\n❌ Burning failed'));
                }
                
            } catch (error) {
                console.error(chalk.red('\n❌ Error:'), error.message);
            }
        })();
    } else {
        // Interactive mode
        burnTokens();
    }
}

module.exports = { burnTokens };
