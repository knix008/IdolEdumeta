const { ethers } = require('ethers');
require('dotenv').config({ path: '.env' });

// Contract configuration
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
const NETWORK_ID = 11155111; // Sepolia
const NETWORK_NAME = 'Sepolia';

// RPC Configuration
const RPC_URL = process.env.SEPOLIA_RPC_URL || 
                (process.env.INFURA_API_KEY ? `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}` : null) ||
                'https://rpc.ankr.com/eth_sepolia';

// Account configuration
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ACCOUNT_ADDRESS = process.env.ACCOUNT_ADDRESS;

// Contract ABI (import from artifacts)
const contractArtifacts = require('../artifacts/Contracts/EduMetaCoinErc20.sol/EduMeta.json');
const CONTRACT_ABI = contractArtifacts.abi;

// Initialize provider and signer
function initializeProvider() {
    if (!RPC_URL) {
        throw new Error('RPC URL not configured. Please set SEPOLIA_RPC_URL or INFURA_API_KEY in .env');
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    return provider;
}

function initializeSigner(provider) {
    if (!PRIVATE_KEY) {
        throw new Error('Private key not configured. Please set PRIVATE_KEY in .env');
    }

    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    return signer;
}

function initializeContract(provider, signer) {
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
        throw new Error('Contract address not configured. Please set CONTRACT_ADDRESS in .env');
    }

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    return contract;
}

// Validation functions
function validateAddress(address) {
    if (!ethers.isAddress(address)) {
        throw new Error(`Invalid address: ${address}`);
    }
    return address;
}

function validateAmount(amount) {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
        throw new Error(`Invalid amount: ${amount}`);
    }
    return num;
}

// Utility functions
function formatEther(wei) {
    return ethers.formatEther(wei);
}

function parseEther(ether) {
    return ethers.parseEther(ether.toString());
}

function formatAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Network information
const NETWORK_INFO = {
    name: NETWORK_NAME,
    id: NETWORK_ID,
    rpcUrl: RPC_URL,
    explorer: 'https://sepolia.etherscan.io'
};

module.exports = {
    CONTRACT_ADDRESS,
    NETWORK_ID,
    NETWORK_NAME,
    RPC_URL,
    PRIVATE_KEY,
    ACCOUNT_ADDRESS,
    CONTRACT_ABI,
    initializeProvider,
    initializeSigner,
    initializeContract,
    validateAddress,
    validateAmount,
    formatEther,
    parseEther,
    formatAddress,
    NETWORK_INFO
};
