# EduMeta Token

A comprehensive ERC20 token implementation with advanced features including minting, burning, pausing, and more.

## Features

- **ERC20 Standard**: Full ERC20 token functionality
- **Mintable**: Owner can mint new tokens
- **Burnable**: Users can burn their own tokens, owner can burn from any address
- **Pausable**: Owner can pause/unpause token transfers
- **ERC1363**: Supports `transferAndCall` for token-based payments
- **ERC20Permit**: Gasless approvals using signatures
- **ERC20FlashMint**: Flash loan functionality
- **Ownable**: Access control for administrative functions

## Contract Details

- **Name**: EduMeta
- **Symbol**: EDT
- **Decimals**: 18
- **Initial Supply**: 0 (mintable by owner)

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   npm run setup
   ```
   This will create a `.env` file from the `env.example` template. Edit the `.env` file with your actual values:
   - `PRIVATE_KEY`: Your wallet's private key (without 0x prefix)
   - `RPC_URL`: Your preferred RPC endpoint
   - `ETHERSCAN_API_KEY`: For contract verification
   - `INFURA_API_KEY` or `ALCHEMY_API_KEY`: For alternative RPC providers

4. Verify your environment configuration:
   ```bash
   npm run check-env
   ```

### Compilation

Compile the smart contracts:
```bash
npm run compile
```

### Testing

Run the test suite:
```bash
npm test
```

The tests cover:
- Contract deployment
- Token minting functionality
- Transfer operations
- Burning functionality
- Pausing/unpausing
- Access control
- ERC1363 and ERC20Permit features

### Local Development

1. Start a local Hardhat node:
   ```bash
   npm run node
   ```

2. Deploy the contract to local network:
   ```bash
   npm run deploy
   ```

### Network Deployment

Deploy to different networks using environment variables:

```bash
# Deploy to Sepolia testnet
npm run deploy:sepolia

# Deploy to Ethereum mainnet
npm run deploy:mainnet
```

### Sepolia Testnet Setup

For Sepolia testnet deployment, you'll need:

1. **Sepolia Testnet ETH** - Get it from faucets:
   - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
   - [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
   - [Chainlink Faucet](https://faucets.chain.link/sepolia)

2. **API Keys** (choose one RPC provider):
   - [Infura API Key](https://infura.io/) (most popular)
   - [Alchemy API Key](https://alchemy.com/) (developer friendly)
   - [QuickNode](https://quicknode.com/) (high performance)
   - [Etherscan API Key](https://etherscan.io/) (for contract verification)

3. **RPC Provider Setup**:
   ```bash
   npm run rpc-setup
   ```

4. **Sepolia Setup Guide**:
   ```bash
   npm run sepolia-setup
   ```

5. **Sepolia Infura Setup** (Recommended):
   ```bash
   npm run sepolia-infura
   ```

6. **Check Sepolia Balance**:
   ```bash
   npm run check-sepolia
   ```

7. **Deploy to Sepolia**:
   ```bash
   npm run deploy:sepolia
   ```

### Contract Verification

Verify your contract on Etherscan:

```bash
# Verify on Sepolia
npm run verify:sepolia <CONTRACT_ADDRESS>

# Verify on Mainnet
npm run verify:mainnet <CONTRACT_ADDRESS>
```

## Contract Functions

### Owner Functions
- `mint(address to, uint256 amount)`: Mint new tokens to specified address
- `pause()`: Pause all token transfers
- `unpause()`: Resume token transfers
- `burnFrom(address account, uint256 amount)`: Burn tokens from specified address (requires approval)

### Public Functions
- `transfer(address to, uint256 amount)`: Transfer tokens to another address
- `approve(address spender, uint256 amount)`: Approve spender to transfer tokens
- `burn(uint256 amount)`: Burn own tokens
- `permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)`: Gasless approval
- `transferAndCall(address to, uint256 amount, bytes data)`: Transfer tokens and call recipient contract

## Environment Variables

The project uses environment variables for configuration. Create a `.env` file with the following variables:

### Required Variables
- `PRIVATE_KEY`: Your wallet's private key (for deployment and transactions)
- `RPC_URL`: RPC endpoint URL (defaults to localhost:8545)

### Optional Variables
- `ETHERSCAN_API_KEY`: For contract verification on Etherscan
- `INFURA_API_KEY`: For Infura RPC endpoints
- `ALCHEMY_API_KEY`: For Alchemy RPC endpoints
- `CHAIN_ID`: Network chain ID (defaults to 1337 for localhost)
- `GAS_LIMIT`: Gas limit for transactions (defaults to 3000000)
- `GAS_PRICE`: Gas price in wei (defaults to 20000000000)

## Network Configuration

The project is configured for:
- **Hardhat Network**: Local development and testing
- **Localhost**: Local deployment (port 8545)
- **Sepolia**: Ethereum testnet
- **Mainnet**: Ethereum mainnet

## Security Features

- **Access Control**: Only owner can mint, pause, and unpause
- **Pausable**: Emergency stop functionality
- **Safe Math**: Built-in overflow protection (Solidity 0.8+)
- **OpenZeppelin**: Battle-tested smart contract library

## License

MIT License
