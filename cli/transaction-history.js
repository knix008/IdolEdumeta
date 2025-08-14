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

async function getTransactionHistory(address = null) {
    console.log(chalk.blue.bold('🎓 EduMeta Transaction History\n'));
    
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
                },
                {
                    type: 'input',
                    name: 'limit',
                    message: 'Number of transactions to show (default: 20):',
                    default: '20',
                    validate: (input) => {
                        const num = parseInt(input);
                        if (isNaN(num) || num <= 0 || num > 100) {
                            return 'Please enter a number between 1 and 100';
                        }
                        return true;
                    }
                }
            ]);
            targetAddress = answers.address || signerAddress;
            const limit = parseInt(answers.limit);
        }

        // Get current balance
        const balance = await contract.balanceOf(targetAddress);
        const balanceEth = formatEther(balance);
        console.log(chalk.cyan(`💰 Current Balance: ${balanceEth} EDT\n`));

        // Get sent transactions
        console.log(chalk.yellow('📤 Fetching sent transactions...'));
        const sentFilter = contract.filters.Transfer(targetAddress, null);
        const sentEvents = await contract.queryFilter(sentFilter);

        // Get received transactions
        console.log(chalk.yellow('📥 Fetching received transactions...'));
        const receivedFilter = contract.filters.Transfer(null, targetAddress);
        const receivedEvents = await contract.queryFilter(receivedFilter);

        // Combine and sort all events
        const allEvents = [...sentEvents, ...receivedEvents]
            .sort((a, b) => b.blockNumber - a.blockNumber);

        if (allEvents.length === 0) {
            console.log(chalk.gray('📜 No transactions found for this address'));
            return;
        }

        // Display transaction summary
        const sentCount = sentEvents.length;
        const receivedCount = receivedEvents.length;
        
        console.log(chalk.cyan('\n📊 Transaction Summary:'));
        console.log(chalk.white(`📤 Total Sent: ${sentCount} transactions`));
        console.log(chalk.white(`📥 Total Received: ${receivedCount} transactions`));
        console.log(chalk.white(`📜 Total Transactions: ${allEvents.length}`));

        // Calculate total amounts
        let totalSent = ethers.parseEther('0');
        let totalReceived = ethers.parseEther('0');

        for (const event of sentEvents) {
            totalSent += event.args[2];
        }

        for (const event of receivedEvents) {
            totalReceived += event.args[2];
        }

        console.log(chalk.white(`📤 Total Amount Sent: ${formatEther(totalSent)} EDT`));
        console.log(chalk.white(`📥 Total Amount Received: ${formatEther(totalReceived)} EDT`));

        // Show recent transactions
        console.log(chalk.cyan('\n📜 Recent Transactions:'));
        
        const recentEvents = allEvents.slice(0, 20);
        
        for (let i = 0; i < recentEvents.length; i++) {
            const event = recentEvents[i];
            const amount = formatEther(event.args[2]);
            const isSent = event.args[0].toLowerCase() === targetAddress.toLowerCase();
            const otherAddress = isSent ? event.args[1] : event.args[0];
            const blockNumber = event.blockNumber;
            const transactionHash = event.transactionHash;
            
            const direction = isSent ? '📤' : '📥';
            const sign = isSent ? '-' : '+';
            const action = isSent ? 'to' : 'from';
            
            console.log(chalk.white(`${i + 1}. ${direction} ${sign}${amount} EDT ${action} ${formatAddress(otherAddress)}`));
            console.log(chalk.gray(`   Block: ${blockNumber} | Hash: ${transactionHash.slice(0, 10)}...${transactionHash.slice(-8)}`));
            console.log(chalk.gray(`   Explorer: ${NETWORK_INFO.explorer}/tx/${transactionHash}`));
            console.log('');
        }

        if (allEvents.length > 20) {
            console.log(chalk.gray(`... and ${allEvents.length - 20} more transactions`));
        }

        // Show transaction types breakdown
        console.log(chalk.cyan('\n📈 Transaction Types:'));
        
        const transferCount = allEvents.length;
        const approvalCount = 0; // Would need to query Approval events separately
        
        console.log(chalk.white(`💸 Transfers: ${transferCount}`));
        console.log(chalk.white(`✅ Approvals: ${approvalCount} (not shown)`));

    } catch (error) {
        console.error(chalk.red('\n❌ Error:'), error.message);
    }
}

// Handle command line arguments
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 1) {
        // Direct usage: node transaction-history.js <address>
        const address = args[0];
        getTransactionHistory(address);
    } else {
        // Interactive mode
        getTransactionHistory();
    }
}

module.exports = { getTransactionHistory };
