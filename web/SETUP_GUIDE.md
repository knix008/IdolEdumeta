# 🚀 EduMeta dApp Setup Guide

## Quick Start

Your React dApp is now ready! Here's how to get it running:

### 1. Prerequisites
- ✅ Node.js installed
- ✅ MetaMask browser extension
- ✅ Sepolia testnet ETH (get from [Sepolia Faucet](https://sepoliafaucet.com/))

### 2. Deploy Your Contract

**Option A: Automated Deployment**
```bash
cd web
node deploy-and-setup.js
```

**Option B: Manual Deployment**
```bash
# From project root
npx hardhat run scripts/deploy.js --network sepolia
# Copy the contract address and update web/.env
```

### 3. Configure Environment
```bash
cd web
cp env.example .env
# Edit .env and add your contract address:
# REACT_APP_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

### 4. Start the dApp
```bash
cd web
npm start
```

Open http://localhost:3000 in your browser!

## 🎯 Features Included

### Core Functionality
- 🔗 **Wallet Connection**: MetaMask integration
- 💰 **Balance Display**: Real-time token balance
- 💸 **Token Transfer**: Send EDT tokens to any address
- 🔥 **Token Burning**: Burn your own tokens
- 📜 **Transaction History**: View recent transfers

### Owner Features (Contract Owner Only)
- 🪙 **Token Minting**: Create new tokens
- ⏸️ **Contract Pause**: Emergency pause functionality

### UI/UX Features
- 🎨 **Modern Design**: Beautiful gradient interface
- 📱 **Responsive**: Works on all devices
- ⚡ **Real-time Updates**: Live balance and status updates
- 🔄 **Transaction Tracking**: Monitor all transfers

## 🔧 Configuration

### Environment Variables (.env)
```bash
REACT_APP_CONTRACT_ADDRESS=0x...  # Your deployed contract
REACT_APP_NETWORK_ID=11155111     # Sepolia testnet
REACT_APP_NETWORK_NAME=Sepolia
REACT_APP_RPC_URL=https://...     # Optional: Custom RPC
```

### Network Settings
- **Network**: Sepolia Testnet
- **Chain ID**: 11155111
- **Explorer**: https://sepolia.etherscan.io

## 📁 Project Structure

```
web/
├── src/
│   ├── App.js                 # Main dApp component
│   ├── App.css               # Styling
│   ├── components/
│   │   └── TransactionHistory.js
│   └── artifacts/            # Contract ABI
├── deploy-and-setup.js       # Deployment helper
├── env.example              # Environment template
└── README.md               # Detailed documentation
```

## 🛠️ Development

### Available Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

### Customization
- **Styling**: Edit `src/App.css`
- **Functionality**: Modify `src/App.js`
- **Components**: Add new components in `src/components/`

## 🔍 Troubleshooting

### Common Issues

**"Please install MetaMask"**
- Install MetaMask browser extension
- Make sure it's enabled

**"Wrong network"**
- Switch to Sepolia testnet in MetaMask
- Network ID: 11155111

**"Insufficient funds"**
- Get Sepolia ETH from a faucet
- Check your balance in MetaMask

**"Contract not found"**
- Verify contract address in `.env`
- Make sure contract is deployed to Sepolia

**"Transaction failed"**
- Check gas fees
- Ensure contract is not paused
- Verify you have sufficient tokens

### Getting Help
1. Check the browser console for errors
2. Verify your MetaMask connection
3. Ensure you're on Sepolia testnet
4. Check contract deployment status

## 🎉 Next Steps

1. **Test the dApp**: Try all features with test tokens
2. **Customize**: Modify colors, add features, change branding
3. **Deploy**: Build and deploy to hosting service
4. **Mainnet**: Deploy contract to mainnet when ready

## 📚 Resources

- [Ethers.js Documentation](https://docs.ethers.org/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Etherscan Sepolia](https://sepolia.etherscan.io/)

---

**Happy Building! 🚀**

Your EduMeta dApp is now ready to use. Connect your wallet and start exploring the world of decentralized education tokens!
