import os
from web3 import Web3
from dotenv import load_dotenv
import json
import pathlib

from solcx import compile_standard, install_solc

"""
This script compiles and deploys the EduMetaCoinErc20 Solidity contract using Python.
Requires: web3, python-dotenv, py-solc-x
Install with:
    pip install web3 python-dotenv py-solc-x
"""

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

NETWORK_NAME = os.getenv("NETWORK_NAME", "localhost").lower()
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
ACCOUNT_ADDRESS = os.getenv("ACCOUNT_ADDRESS")
INFURA_API_KEY = os.getenv("INFURA_API_KEY")
GAS_LIMIT = int(os.getenv("GAS_LIMIT", 3000000))
GAS_PRICE = int(os.getenv("GAS_PRICE", 20000000000))

CONTRACT_PATH = os.path.join(
    os.path.dirname(__file__), "../Contracts/EduMetaCoinErc20.sol"
)
ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")
os.makedirs(ARTIFACTS_DIR, exist_ok=True)
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
REMAPPINGS = ["@openzeppelin/={}/node_modules/@openzeppelin/".format(PROJECT_ROOT)]

# Set up RPC URLs
RPC_URLS = {
    "localhost": "http://127.0.0.1:8545",
    "sepolia": (
        f"https://sepolia.infura.io/v3/{INFURA_API_KEY}" if INFURA_API_KEY else ""
    ),
    "mainnet": (
        f"https://mainnet.infura.io/v3/{INFURA_API_KEY}" if INFURA_API_KEY else ""
    ),
}

if NETWORK_NAME not in RPC_URLS or not RPC_URLS[NETWORK_NAME]:
    raise Exception(f"No RPC URL configured for network: {NETWORK_NAME}")



artifact_path = os.path.join(ARTIFACTS_DIR, 'EduMeta.json')
with open(artifact_path, 'r') as f:
    contract_json = json.load(f)
abi = contract_json['abi']
bytecode = contract_json['bytecode']


# Connect to Web3
w3 = Web3(Web3.HTTPProvider(RPC_URLS[NETWORK_NAME]))
if not w3.is_connected():
    raise Exception(
        f"Failed to connect to {NETWORK_NAME} RPC at {RPC_URLS[NETWORK_NAME]}"
    )

# Prepare contract deployment
contract = w3.eth.contract(abi=abi, bytecode=bytecode)
nonce = w3.eth.get_transaction_count(ACCOUNT_ADDRESS)

# TODO: Update the following line with the correct constructor arguments if needed
transaction = contract.constructor(ACCOUNT_ADDRESS).build_transaction({
    "from": ACCOUNT_ADDRESS, "nonce": nonce, "gas": GAS_LIMIT, "gasPrice": GAS_PRICE}
)

# Sign and send transaction

signed_txn = w3.eth.account.sign_transaction(transaction, private_key=PRIVATE_KEY)
tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
print(f"Deploying contract... TX hash: {tx_hash.hex()}")

# Wait for receipt
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
print(f"Contract deployed at address: {tx_receipt.contractAddress}")
