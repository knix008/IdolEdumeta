# EduMeta CLI - Smart Contract Interaction Tools

A comprehensive command-line interface for interacting with the EduMeta smart contract on the Sepolia testnet.

## 🚀 Quick Start

1. **Setup Environment:**
   ```bash
   npm run setup
   ```

2. **Check Token Information:**
   ```bash
   npm run info
   ```

3. **Check Your Balance:**
   ```bash
   npm run receive
   ```

## 📋 Available Commands

### Basic Token Operations
- `npm run send` - Send tokens to another address
- `npm run receive` - Check token balance
- `npm run info` - Display comprehensive token information
- `npm run history` - View transaction history

### Owner Functions
- `npm run mint` - Mint new tokens (owner only)
- `npm run pause` - Pause contract (owner only)
- `npm run unpause` - Unpause contract (owner only)

### Advanced Operations
- `npm run burn` - Burn your tokens
- `npm run approve` - Approve tokens for spending
- `npm run transfer-from` - Transfer tokens using allowance

### Help
- `npm run setup` - Setup environment configuration
- `npm run help` - Show help information

## 🔧 Setup

### 1. Initial Setup
Run the interactive setup to configure your environment:
```bash
npm run setup
```

This will guide you through:
- Contract address configuration
- Private key setup
- RPC provider selection
- Account address verification

### 2. Manual Configuration
If you prefer manual setup, copy `env.example` to `.env` and fill in your values:

```bash
cp env.example .env
```

Required environment variables:
```env
CONTRACT_ADDRESS=0x...your_deployed_contract_address
PRIVATE_KEY=your_private_key_without_0x_prefix
ACCOUNT_ADDRESS=your_account_address
SEPOLIA_RPC_URL=your_rpc_url
```

### 3. RPC Providers
Choose from:
- **Ankr (Free)**: `https://rpc.ankr.com/eth_sepolia`
- **Infura**: Requires API key
- **Custom**: Your own RPC endpoint

## 📝 Usage Examples

### Interactive Mode (Recommended)
```bash
# Send tokens with guided prompts
npm run send

# Check balance interactively
npm run receive

# Mint tokens (if you're owner)
npm run mint
```

### Direct Mode (Automation)
```bash
# Send tokens directly
node send-tokens.js 0x1234... 100

# Check balance for specific address
node check-balance.js 0x1234...

# Mint tokens directly
node mint-tokens.js 0x1234... 1000
```

## 🌐 Network Information

- **Network**: Sepolia Testnet
- **Chain ID**: 11155111
- **Explorer**: https://sepolia.etherscan.io
- **Token Symbol**: EDT
- **Token Name**: EduMeta

## 🔒 Security Notes

⚠️ **Important Security Considerations:**
- Never share your private key
- Use a dedicated account for testing
- Keep your `.env` file secure
- Verify contract addresses before transactions
- Double-check transaction details before confirming

## 💡 Tips

- Use interactive mode for guided experience
- Use direct mode for automation
- Check gas fees before transactions
- Keep some ETH for gas fees
- Use the web interface for visual interaction

## 🔗 Related Files

- `../web/` - React dApp interface
- `../Contracts/` - Smart contract source
- `../artifacts/` - Compiled contract artifacts
- `.env` - Environment configuration

## 📞 Support

For issues or questions:
- Check the README.md files
- Review error messages carefully
- Ensure proper network configuration
- Verify contract deployment status

## 🎓 Happy token trading with EduMeta! 🚀
