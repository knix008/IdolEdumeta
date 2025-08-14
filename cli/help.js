#!/usr/bin/env node

const chalk = require('chalk');

function showHelp() {
    console.log(chalk.blue.bold('🎓 EduMeta CLI - Smart Contract Interaction Tools\n'));
    
    console.log(chalk.cyan('📋 Available Commands:\n'));
    
    console.log(chalk.yellow('💰 Basic Token Operations:'));
    console.log(chalk.white('  npm run send                    - Send tokens to another address'));
    console.log(chalk.white('  npm run receive                 - Check token balance'));
    console.log(chalk.white('  npm run info                    - Display comprehensive token information'));
    console.log(chalk.white('  npm run history                 - View transaction history'));
    
    console.log(chalk.yellow('\n👑 Owner Functions:'));
    console.log(chalk.white('  npm run mint                    - Mint new tokens (owner only)'));
    console.log(chalk.white('  npm run pause                   - Pause contract (owner only)'));
    console.log(chalk.white('  npm run unpause                 - Unpause contract (owner only)'));
    
    console.log(chalk.yellow('\n🔧 Advanced Operations:'));
    console.log(chalk.white('  npm run burn                    - Burn your tokens'));
    console.log(chalk.white('  npm run approve                 - Approve tokens for spending'));
    console.log(chalk.white('  npm run transfer-from           - Transfer tokens using allowance'));
    
    console.log(chalk.yellow('\n❓ Help:'));
    console.log(chalk.white('  npm run setup                   - Setup environment configuration'));
    console.log(chalk.white('  npm run help                    - Show this help message'));
    
    console.log(chalk.cyan('\n📝 Direct Usage Examples:\n'));
    
    console.log(chalk.white('  node send-tokens.js <recipient> <amount>'));
    console.log(chalk.gray('  Example: node send-tokens.js 0x1234... 100'));
    
    console.log(chalk.white('  node check-balance.js <address>'));
    console.log(chalk.gray('  Example: node check-balance.js 0x1234...'));
    
    console.log(chalk.white('  node mint-tokens.js <recipient> <amount>'));
    console.log(chalk.gray('  Example: node mint-tokens.js 0x1234... 1000'));
    
    console.log(chalk.white('  node burn-tokens.js <amount>'));
    console.log(chalk.gray('  Example: node burn-tokens.js 50'));
    
    console.log(chalk.white('  node approve-tokens.js <spender> <amount>'));
    console.log(chalk.gray('  Example: node approve-tokens.js 0x1234... 200'));
    
    console.log(chalk.white('  node transfer-from.js <from> <to> <amount>'));
    console.log(chalk.gray('  Example: node transfer-from.js 0x1234... 0x5678... 100'));
    
    console.log(chalk.white('  node transaction-history.js <address>'));
    console.log(chalk.gray('  Example: node transaction-history.js 0x1234...'));
    
    console.log(chalk.cyan('\n🔧 Setup Requirements:\n'));
    
    console.log(chalk.white('1. Initial Setup:'));
    console.log(chalk.gray('   npm run setup'));
    
    console.log(chalk.white('\n2. Environment Variables (in .env):'));
    console.log(chalk.gray('   CONTRACT_ADDRESS=<deployed_contract_address>'));
    console.log(chalk.gray('   PRIVATE_KEY=<your_private_key>'));
    console.log(chalk.gray('   SEPOLIA_RPC_URL=<rpc_url>'));
    console.log(chalk.gray('   INFURA_API_KEY=<infura_api_key> (optional)'));
    
    console.log(chalk.white('\n3. Install Dependencies:'));
    console.log(chalk.gray('   npm install'));
    
    console.log(chalk.white('\n4. Deploy Contract (if not already deployed):'));
    console.log(chalk.gray('   cd .. && npm run deploy:sepolia'));
    
    console.log(chalk.cyan('\n🌐 Network Information:\n'));
    
    console.log(chalk.white('Network: Sepolia Testnet'));
    console.log(chalk.white('Chain ID: 11155111'));
    console.log(chalk.white('Explorer: https://sepolia.etherscan.io'));
    console.log(chalk.white('Token Symbol: EDT'));
    console.log(chalk.white('Token Name: EduMeta'));
    
    console.log(chalk.cyan('\n🔒 Security Notes:\n'));
    
    console.log(chalk.yellow('⚠️  Important Security Considerations:'));
    console.log(chalk.white('• Never share your private key'));
    console.log(chalk.white('• Use a dedicated account for testing'));
    console.log(chalk.white('• Keep your .env file secure'));
    console.log(chalk.white('• Verify contract addresses before transactions'));
    console.log(chalk.white('• Double-check transaction details before confirming'));
    
    console.log(chalk.cyan('\n💡 Tips:\n'));
    
    console.log(chalk.white('• Use interactive mode for guided experience'));
    console.log(chalk.white('• Use direct mode for automation'));
    console.log(chalk.white('• Check gas fees before transactions'));
    console.log(chalk.white('• Keep some ETH for gas fees'));
    console.log(chalk.white('• Use the web interface for visual interaction'));
    
    console.log(chalk.cyan('\n🔗 Related Files:\n'));
    
    console.log(chalk.white('• ../web/ - React dApp interface'));
    console.log(chalk.white('• ../Contracts/ - Smart contract source'));
    console.log(chalk.white('• ../artifacts/ - Compiled contract artifacts'));
    console.log(chalk.white('• .env - Environment configuration'));
    
    console.log(chalk.cyan('\n📞 Support:\n'));
    
    console.log(chalk.white('For issues or questions:'));
    console.log(chalk.white('• Check the README.md files'));
    console.log(chalk.white('• Review error messages carefully'));
    console.log(chalk.white('• Ensure proper network configuration'));
    console.log(chalk.white('• Verify contract deployment status'));
    
    console.log(chalk.blue('\n🎓 Happy token trading with EduMeta! 🚀\n'));
}

// Handle command line arguments
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length > 0) {
        // Show specific help for a command
        const command = args[0];
        console.log(chalk.blue.bold(`🎓 Help for: ${command}\n`));
        
        switch (command) {
            case 'send':
                console.log(chalk.cyan('Send tokens to another address'));
                console.log(chalk.white('Usage: npm run send'));
                console.log(chalk.white('Usage: node send-tokens.js <recipient> <amount>'));
                console.log(chalk.gray('Example: node send-tokens.js 0x1234... 100'));
                break;
            case 'receive':
                console.log(chalk.cyan('Check token balance for an address'));
                console.log(chalk.white('Usage: npm run receive'));
                console.log(chalk.white('Usage: node check-balance.js <address>'));
                console.log(chalk.gray('Example: node check-balance.js 0x1234...'));
                break;
            case 'mint':
                console.log(chalk.cyan('Mint new tokens (owner only)'));
                console.log(chalk.white('Usage: npm run mint'));
                console.log(chalk.white('Usage: node mint-tokens.js <recipient> <amount>'));
                console.log(chalk.gray('Example: node mint-tokens.js 0x1234... 1000'));
                break;
            case 'burn':
                console.log(chalk.cyan('Burn your tokens'));
                console.log(chalk.white('Usage: npm run burn'));
                console.log(chalk.white('Usage: node burn-tokens.js <amount>'));
                console.log(chalk.gray('Example: node burn-tokens.js 50'));
                break;
            case 'approve':
                console.log(chalk.cyan('Approve tokens for spending'));
                console.log(chalk.white('Usage: npm run approve'));
                console.log(chalk.white('Usage: node approve-tokens.js <spender> <amount>'));
                console.log(chalk.gray('Example: node approve-tokens.js 0x1234... 200'));
                break;
            case 'transfer-from':
                console.log(chalk.cyan('Transfer tokens using allowance'));
                console.log(chalk.white('Usage: npm run transfer-from'));
                console.log(chalk.white('Usage: node transfer-from.js <from> <to> <amount>'));
                console.log(chalk.gray('Example: node transfer-from.js 0x1234... 0x5678... 100'));
                break;
            case 'pause':
                console.log(chalk.cyan('Pause contract (owner only)'));
                console.log(chalk.white('Usage: npm run pause'));
                console.log(chalk.white('Usage: node pause-contract.js'));
                break;
            case 'unpause':
                console.log(chalk.cyan('Unpause contract (owner only)'));
                console.log(chalk.white('Usage: npm run unpause'));
                console.log(chalk.white('Usage: node unpause-contract.js'));
                break;
            case 'info':
                console.log(chalk.cyan('Display comprehensive token information'));
                console.log(chalk.white('Usage: npm run info'));
                console.log(chalk.white('Usage: node token-info.js'));
                break;
            case 'history':
                console.log(chalk.cyan('View transaction history'));
                console.log(chalk.white('Usage: npm run history'));
                console.log(chalk.white('Usage: node transaction-history.js <address>'));
                console.log(chalk.gray('Example: node transaction-history.js 0x1234...'));
                break;
            default:
                console.log(chalk.red(`Unknown command: ${command}`));
                console.log(chalk.white('Run "npm run help" for a list of available commands'));
        }
    } else {
        // Show general help
        showHelp();
    }
}

module.exports = { showHelp };
