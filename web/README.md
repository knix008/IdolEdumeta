# EduMeta Token dApp

A modern React-based decentralized application (dApp) for interacting with the EduMeta ERC20 token on the Sepolia testnet.

## Features

- 🔗 **Wallet Connection**: Connect with MetaMask wallet
- 💰 **Token Balance**: View your EDT token balance
- 💸 **Send Tokens**: Transfer EDT tokens to other addresses
- 🔥 **Burn Tokens**: Burn your own tokens
- 🪙 **Mint Tokens**: Owner-only functionality to mint new tokens
- ⏸️ **Pause/Unpause**: Owner-only functionality to pause/unpause the contract
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful gradient design with glassmorphism effects

## Prerequisites

- Node.js (v14 or higher)
- MetaMask browser extension
- Sepolia testnet ETH for gas fees
- Deployed EduMeta smart contract address

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and update the following:
   - `REACT_APP_CONTRACT_ADDRESS`: Your deployed contract address
   - `REACT_APP_RPC_URL`: Your Infura/Alchemy RPC URL (optional)

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## Usage

### Connecting Your Wallet

1. Make sure you have MetaMask installed and connected to Sepolia testnet
2. Click "Connect Wallet" button
3. Approve the connection in MetaMask

### Basic Token Operations

- **View Balance**: Your current EDT token balance is displayed at the top
- **Send Tokens**: Enter recipient address and amount, then click "Send Tokens"
- **Burn Tokens**: Enter amount to burn from your balance

### Owner Operations (Contract Owner Only)

- **Mint Tokens**: Create new tokens and send to any address
- **Pause/Unpause**: Temporarily disable all token transfers

## Smart Contract Integration

The dApp integrates with the EduMeta smart contract which includes:

- **ERC20 Standard**: Basic token functionality
- **ERC20Burnable**: Ability to burn tokens
- **ERC20Pausable**: Ability to pause/unpause transfers
- **ERC1363**: Advanced token standards
- **ERC20Permit**: Gasless approvals
- **ERC20FlashMint**: Flash loan functionality
- **Ownable**: Access control for owner functions

## Network Configuration

The dApp is configured for **Sepolia testnet** by default:

- **Network ID**: 11155111
- **RPC URL**: Configurable via environment variables
- **Explorer**: https://sepolia.etherscan.io

## Development

### Project Structure

```
web/
├── public/                 # Static files
├── src/
│   ├── artifacts/         # Contract ABI and artifacts
│   ├── App.js            # Main dApp component
│   ├── App.css           # Styling
│   └── index.js          # React entry point
├── package.json          # Dependencies
├── env.example           # Environment template
└── README.md            # This file
```

### Available Scripts

- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App
- `node update-artifacts.js`: Update contract artifacts from root directory
- `node check-warnings.js`: Check for warnings and issues

### Customization

You can customize the dApp by:

1. **Updating contract address** in `.env`
2. **Modifying styling** in `src/App.css`
3. **Adding new features** in `src/App.js`
4. **Changing network** by updating network configuration

## Troubleshooting

### Common Issues

1. **"Please install MetaMask"**: Install MetaMask browser extension
2. **"Wrong network"**: Switch to Sepolia testnet in MetaMask
3. **"Insufficient funds"**: Get Sepolia ETH from a faucet
4. **"Contract not found"**: Verify contract address in `.env`

### Getting Sepolia ETH

- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)

## Security Notes

- Never share your private keys
- Always verify contract addresses
- Use testnet for development
- Review transaction details before confirming

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
