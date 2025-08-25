import os
import json
from web3 import Web3
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

NETWORK_NAME = os.getenv("NETWORK_NAME", "localhost").lower()
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
ACCOUNT_ADDRESS = os.getenv("ACCOUNT_ADDRESS")

CONTRACT_ADDRESS = os.getenv(
    "CONTRACT_ADDRESS"
)  # Add this to your .env after deployment


# Use RPC_URL from .env
RPC_URL = os.getenv("RPC_URL")
if not RPC_URL:
    raise Exception("RPC_URL is not set in the .env file.")

w3 = Web3(Web3.HTTPProvider(RPC_URL))
if not w3.is_connected():
    raise Exception(f"Failed to connect to RPC at {RPC_URL}")

# Load ABI
artifact_path = os.path.join(os.path.dirname(__file__), "artifacts", "contracts", "EduMetaCoinErc20.sol", "EduMeta.json")
with open(artifact_path, "r") as f:
    contract_json = json.load(f)
abi = contract_json["abi"]

# Connect to contract
contract = w3.eth.contract(address=Web3.to_checksum_address(CONTRACT_ADDRESS), abi=abi)

# Mint function
# Usage: set MINT_TO and MINT_AMOUNT in your .env or replace below
MINT_TO = os.getenv("MINT_TO", ACCOUNT_ADDRESS)
MINT_AMOUNT = int(
    os.getenv("MINT_AMOUNT", "1000000000000000000000")
)  # Default: 1000 tokens

nonce = w3.eth.get_transaction_count(ACCOUNT_ADDRESS)
tx = contract.functions.mint(MINT_TO, MINT_AMOUNT).build_transaction(
    {
        "from": ACCOUNT_ADDRESS,
        "nonce": nonce,
        "gas": int(os.getenv("GAS_LIMIT", 3000000)),
        "gasPrice": int(os.getenv("GAS_PRICE", 20000000000)),
    }
)

signed_tx = w3.eth.account.sign_transaction(tx, private_key=PRIVATE_KEY)
tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
print(f"Minting... TX hash: {tx_hash.hex()}")
receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
print(
    f"Minted {MINT_AMOUNT} tokens to {MINT_TO}. Transaction receipt: {receipt.transactionHash.hex()}"
)
