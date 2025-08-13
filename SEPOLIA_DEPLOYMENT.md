# Sepolia Testnet Deployment Guide

This guide will help you deploy your EduMeta token contract to the Sepolia testnet.

## Prerequisites

### 1. Get Sepolia Testnet ETH

You'll need Sepolia testnet ETH to pay for gas fees. Get it from these faucets:

- **Alchemy Sepolia Faucet**: https://sepoliafaucet.com/
- **Infura Sepolia Faucet**: https://www.infura.io/faucet/sepolia
- **Chainlink Faucet**: https://faucets.chain.link/sepolia
- **QuickNode Faucet**: https://faucet.quicknode.com/ethereum/sepolia

### 2. Get API Keys

You'll need API keys for RPC endpoints and contract verification:

- **Infura**: https://infura.io/ (for RPC endpoint)
- **Alchemy**: https://alchemy.com/ (alternative RPC endpoint)
- **Etherscan**: https://etherscan.io/ (for contract verification)

## Setup Steps

### Step 1: Configure Environment Variables

1. Run the setup script:
   ```bash
   npm run setup
   ```

2. Edit your `.env` file with your actual values:
   ```env
   # Required for Sepolia deployment
   PRIVATE_KEY=your_wallet_private_key_here
   INFURA_API_KEY=your_infura_api_key_here
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   
   # Optional: Alternative RPC providers
   ALCHEMY_API_KEY=your_alchemy_api_key_here
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_infura_api_key
   ```

### Step 2: Verify Configuration

Check your environment configuration:
```bash
npm run check-env
```

### Step 3: Get Sepolia Setup Guide

Run the Sepolia setup guide for detailed instructions:
```bash
npm run sepolia-setup
```

### Step 4: Check Your Balance

Verify you have sufficient Sepolia ETH:
```bash
npm run check-sepolia
```

### Step 5: Compile Contract

Compile your smart contract:
```bash
npm run compile
```

### Step 6: Deploy to Sepolia

Deploy your contract to Sepolia testnet:
```bash
npm run deploy:sepolia
```

### Step 7: Verify Contract

After deployment, verify your contract on Etherscan:
```bash
npm run verify:sepolia <CONTRACT_ADDRESS>
```

## Network Information

- **Network Name**: Sepolia Testnet
- **Chain ID**: 11155111
- **Currency**: Sepolia ETH
- **Block Explorer**: https://sepolia.etherscan.io/
- **RPC Endpoint**: https://sepolia.infura.io/v3/YOUR_API_KEY

## Useful Links

- **Sepolia Etherscan**: https://sepolia.etherscan.io/
- **Sepolia Network Info**: https://chainlist.org/chain/11155111
- **Sepolia Faucets**: 
  - https://sepoliafaucet.com/
  - https://www.infura.io/faucet/sepolia
  - https://faucets.chain.link/sepolia

## Troubleshooting

### Common Issues

1. **Insufficient Balance**
   - Get more Sepolia ETH from faucets
   - Check your balance with `npm run check-sepolia`

2. **Invalid Private Key**
   - Ensure your private key is correct (without 0x prefix)
   - Make sure it's the private key for the wallet with Sepolia ETH

3. **RPC Connection Issues**
   - Verify your Infura API key is correct
   - Check your internet connection
   - Try using a different RPC provider

4. **Gas Estimation Failed**
   - Ensure you have sufficient Sepolia ETH
   - Check current gas prices
   - Try increasing gas limit in hardhat.config.js

### Error Messages

- **"insufficient funds"**: Get more Sepolia ETH
- **"nonce too low"**: Wait for pending transactions or reset nonce
- **"gas estimation failed"**: Check contract compilation and gas settings
- **"invalid signature"**: Verify private key format

## Security Notes

- Never commit your `.env` file to version control
- Keep your private key secure and never share it
- Use testnet private keys only (never use mainnet keys for testing)
- Verify contract addresses before interacting with them

## Next Steps

After successful deployment:

1. **Test Contract Functions**: Use the deployed contract address to test all functions
2. **Monitor Transactions**: Use Sepolia Etherscan to monitor your contract
3. **Share Contract Address**: Share the deployed contract address with your team
4. **Document Deployment**: Record the deployment details for future reference

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your environment configuration
3. Ensure you have sufficient Sepolia ETH
4. Check the Hardhat documentation: https://hardhat.org/docs
