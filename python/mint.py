import os
import json
from web3 import Web3
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

NETWORK_NAME = os.getenv('NETWORK_NAME', 'localhost').lower()
PRIVATE_KEY = os.getenv('PRIVATE_KEY')
ACCOUNT_ADDRESS = os.getenv('ACCOUNT_ADDRESS')
INFURA_API_KEY = os.getenv('INFURA_API_KEY')
GAS_LIMIT = int(os.getenv('GAS_LIMIT', 3000000))
GAS_PRICE = int(os.getenv('GAS_PRICE', 20000000000))
CONTRACT_ADDRESS = os.getenv('CONTRACT_ADDRESS')  # Add this to your .env after deployment

# Set up RPC URLs
RPC_URLS = {
    'localhost': 'http://127.0.0.1:8545',
    'sepolia': f'https://sepolia.infura.io/v3/{INFURA_API_KEY}' if INFURA_API_KEY else '',
    'mainnet': f'https://mainnet.infura.io/v3/{INFURA_API_KEY}' if INFURA_API_KEY else ''
}

if NETWORK_NAME not in RPC_URLS or not RPC_URLS[NETWORK_NAME]:
    raise Exception(f"No RPC URL configured for network: {NETWORK_NAME}")

w3 = Web3(Web3.HTTPProvider(RPC_URLS[NETWORK_NAME]))
if not w3.is_connected():
    raise Exception(f"Failed to connect to {NETWORK_NAME} RPC at {RPC_URLS[NETWORK_NAME]}")

# Load ABI
artifact_path = os.path.join(os.path.dirname(__file__), 'artifacts', 'EduMeta.json')
with open(artifact_path, 'r') as f:
    contract_json = json.load(f)
abi = contract_json['abi']

# Connect to contract
contract = w3.eth.contract(address=Web3.to_checksum_address(CONTRACT_ADDRESS), abi=abi)

# Mint function
# Usage: set MINT_TO and MINT_AMOUNT in your .env or replace below
MINT_TO = os.getenv('MINT_TO', ACCOUNT_ADDRESS)
MINT_AMOUNT = int(os.getenv('MINT_AMOUNT', '1000000000000000000000'))  # Default: 1000 tokens

nonce = w3.eth.get_transaction_count(ACCOUNT_ADDRESS)
tx = contract.functions.mint(MINT_TO, MINT_AMOUNT).build_transaction({
    'from': ACCOUNT_ADDRESS,
    'nonce': nonce,
    'gas': GAS_LIMIT,
    'gasPrice': GAS_PRICE
})

signed_tx = w3.eth.account.sign_transaction(tx, private_key=PRIVATE_KEY)
tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
print(f"Minting... TX hash: {tx_hash.hex()}")
receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
print(f"Minted {MINT_AMOUNT} tokens to {MINT_TO}. Transaction receipt: {receipt.transactionHash.hex()}")
