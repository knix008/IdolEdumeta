
import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';


const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount) returns (bool)"
];

const DEFAULT_TOKEN_ADDRESS = import.meta.env.VITE_ERC20_TOKEN_ADDRESS || '';
const DEFAULT_CHAIN_ID = import.meta.env.VITE_CHAIN_ID || '';
const DEFAULT_RPC_URL = import.meta.env.VITE_RPC_URL || '';
const APP_NAME = import.meta.env.VITE_APP_NAME || 'ERC-20 Wallet';


function App() {
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [address, setAddress] = useState('');
  const [tokenAddress, setTokenAddress] = useState(DEFAULT_TOKEN_ADDRESS);
  const [token, setToken] = useState();
  const [balance, setBalance] = useState();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [symbol, setSymbol] = useState('');
  const [decimals, setDecimals] = useState(18);
  const [status, setStatus] = useState('');


  const connectWallet = async () => {
    if (window.ethereum) {
      const prov = new ethers.BrowserProvider(window.ethereum);
      await prov.send("eth_requestAccounts", []);
      const signer = await prov.getSigner();
      setProvider(prov);
      setSigner(signer);
      setAddress(await signer.getAddress());
      setStatus('Wallet connected');
      // Optionally, check chain ID
      if (DEFAULT_CHAIN_ID) {
        const network = await prov.getNetwork();
        if (network.chainId.toString() !== DEFAULT_CHAIN_ID) {
          setStatus(`Warning: Please switch to chain ID ${DEFAULT_CHAIN_ID}`);
        }
      }
    } else if (DEFAULT_RPC_URL) {
      // Fallback to RPC URL if MetaMask is not available
      const prov = new ethers.JsonRpcProvider(DEFAULT_RPC_URL);
      setProvider(prov);
      setStatus('Connected to RPC (read-only)');
    } else {
      setStatus('MetaMask not detected and no RPC URL configured');
    }
  };

  const loadToken = async () => {
    if (!ethers.isAddress(tokenAddress)) {
      setStatus('Invalid token address');
      return;
    }
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    setToken(contract);
    setSymbol(await contract.symbol());
    setDecimals(await contract.decimals());
    setStatus('Token loaded');
    fetchBalance(contract);
  };

  const fetchBalance = async (contract = token) => {
    if (!contract || !address) return;
    const bal = await contract.balanceOf(address);
    setBalance(ethers.formatUnits(bal, decimals));
  };

  const sendTokens = async () => {
    if (!token || !recipient || !amount) return;
    try {
      const tx = await token.transfer(recipient, ethers.parseUnits(amount, decimals));
      setStatus('Transaction sent: ' + tx.hash);
      await tx.wait();
      setStatus('Transaction confirmed!');
      fetchBalance();
    } catch (e) {
      setStatus('Error: ' + (e.message || e));
    }
  };

  return (
    <div className="App">
      <h1>{APP_NAME}</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
      <div>Address: {address}</div>
      <div style={{marginTop: 20}}>
        <input
          type="text"
          placeholder="ERC-20 Token Address"
          value={tokenAddress}
          onChange={e => setTokenAddress(e.target.value)}
        />
        <button onClick={loadToken} disabled={!signer && !provider}>Load Token</button>
      </div>
      {token && (
        <div style={{marginTop: 20}}>
          <div>Balance: {balance} {symbol}</div>
          <button onClick={() => fetchBalance()}>Refresh Balance</button>
          <div style={{marginTop: 20}}>
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <button onClick={sendTokens} disabled={!signer}>Send Tokens</button>
          </div>
        </div>
      )}
      <div style={{marginTop: 20, color: 'green'}}>{status}</div>
    </div>
  );
}

export default App;
