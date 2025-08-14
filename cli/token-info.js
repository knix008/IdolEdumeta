#!/usr/bin/env node

const { ethers } = require('ethers');
const chalk = require('chalk');
const {
    initializeProvider,
    initializeSigner,
    initializeContract,
    formatEther,
    formatAddress,
    NETWORK_INFO
} = require('./config');

async function getTokenInfo() {
    console.log(chalk.blue.bold('🎓 EduMeta Token Information\n'));
    
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

        // Get basic token information
        console.log(chalk.yellow('📊 Fetching token information...'));
        
        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        const totalSupply = await contract.totalSupply();
        const totalSupplyEth = formatEther(totalSupply);

        console.log(chalk.cyan('📋 Basic Token Information:'));
        console.log(chalk.white(`🏷️  Name: ${name}`));
        console.log(chalk.white(`💎 Symbol: ${symbol}`));
        console.log(chalk.white(`🔢 Decimals: ${decimals}`));
        console.log(chalk.white(`📈 Total Supply: ${totalSupplyEth} EDT`));

        // Get contract owner
        try {
            const owner = await contract.owner();
            console.log(chalk.white(`👑 Owner: ${formatAddress(owner)}`));
            
            const isOwner = owner.toLowerCase() === signerAddress.toLowerCase();
            if (isOwner) {
                console.log(chalk.green(`   ✅ You are the contract owner!`));
            }
        } catch (error) {
            console.log(chalk.yellow(`👑 Owner: Not available`));
        }

        // Get pause status
        try {
            const isPaused = await contract.paused();
            console.log(chalk.white(`📊 Status: ${isPaused ? '⏸️  Paused' : '✅ Active'}`));
        } catch (error) {
            console.log(chalk.yellow(`📊 Status: Not available`));
        }

        // Get signer's balance
        const balance = await contract.balanceOf(signerAddress);
        const balanceEth = formatEther(balance);
        const percentage = (parseFloat(balanceEth) / parseFloat(totalSupplyEth)) * 100;

        console.log(chalk.cyan('\n💰 Your Information:'));
        console.log(chalk.white(`👤 Address: ${signerAddress}`));
        console.log(chalk.white(`💰 Balance: ${balanceEth} EDT`));
        console.log(chalk.white(`📊 Percentage of Total Supply: ${percentage.toFixed(4)}%`));

        // Get recent transactions
        console.log(chalk.cyan('\n📜 Recent Transactions:'));
        try {
            const filter = contract.filters.Transfer(signerAddress, null);
            const sentEvents = await contract.queryFilter(filter);
            
            const filter2 = contract.filters.Transfer(null, signerAddress);
            const receivedEvents = await contract.queryFilter(filter2);
            
            const allEvents = [...sentEvents, ...receivedEvents]
                .sort((a, b) => b.blockNumber - a.blockNumber)
                .slice(0, 10);
            
            if (allEvents.length === 0) {
                console.log(chalk.gray('   No recent transactions'));
            } else {
                for (const event of allEvents) {
                    const amount = formatEther(event.args[2]);
                    const isSent = event.args[0].toLowerCase() === signerAddress.toLowerCase();
                    const otherAddress = isSent ? event.args[1] : event.args[0];
                    const blockNumber = event.blockNumber;
                    
                    console.log(chalk.gray(`   ${isSent ? '📤' : '📥'} ${isSent ? '-' : '+'}${amount} EDT ${isSent ? 'to' : 'from'} ${formatAddress(otherAddress)} (Block: ${blockNumber})`));
                }
            }
        } catch (error) {
            console.log(chalk.gray('   Could not fetch recent transactions'));
        }

        // Get allowances for signer
        console.log(chalk.cyan('\n✅ Allowances (for your address):'));
        try {
            // This would require knowing specific spender addresses
            // For now, we'll show a general message
            console.log(chalk.gray('   Use approve-tokens.js to manage allowances'));
        } catch (error) {
            console.log(chalk.gray('   Could not fetch allowances'));
        }

        // Network information
        console.log(chalk.cyan('\n🌐 Network Information:'));
        console.log(chalk.white(`🌐 Network: ${NETWORK_INFO.name}`));
        console.log(chalk.white(`🔗 RPC URL: ${NETWORK_INFO.rpcUrl}`));
        console.log(chalk.white(`🔍 Explorer: ${NETWORK_INFO.explorer}`));
        console.log(chalk.white(`📄 Contract: ${contract.target}`));

        // Contract capabilities
        console.log(chalk.cyan('\n🔧 Contract Capabilities:'));
        console.log(chalk.white(`✅ ERC20: Basic token functionality`));
        console.log(chalk.white(`🔥 ERC20Burnable: Tokens can be burned`));
        console.log(chalk.white(`⏸️  ERC20Pausable: Transfers can be paused`));
        console.log(chalk.white(`👑 Ownable: Access control for owner functions`));
        console.log(chalk.white(`🔗 ERC1363: Payable tokens with callbacks`));
        console.log(chalk.white(`✍️  ERC20Permit: Gasless approvals`));
        console.log(chalk.white(`⚡ ERC20FlashMint: Flash loan functionality`));

    } catch (error) {
        console.error(chalk.red('\n❌ Error:'), error.message);
    }
}

// Handle command line arguments
if (require.main === module) {
    getTokenInfo();
}

module.exports = { getTokenInfo };
