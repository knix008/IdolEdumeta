import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import './App.css';

// Import contract ABI
import EduMetaABI from './artifacts/Contracts/EduMetaCoinErc20.sol/EduMeta.json';

// Import components
import TransactionHistory from './components/TransactionHistory';
import TokenTransfer from './components/TokenTransfer';
import AdvancedFeatures from './components/AdvancedFeatures';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'; // Update with deployed address
// Network ID for Sepolia testnet (used for network validation)
const NETWORK_ID = 11155111;

function App() {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState('0');
  const [totalSupply, setTotalSupply] = useState('0');

  const [isOwner, setIsOwner] = useState(false); // Used to show/hide owner functions tab
  const [mintAmount, setMintAmount] = useState('');
  const [mintRecipient, setMintRecipient] = useState('');
  const [amount, setAmount] = useState(''); // Used in burnTokens function
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('transfer');

  useEffect(() => {
    initializeProvider();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initializeProvider = async () => {
    try {
      const ethereumProvider = await detectEthereumProvider();
      if (ethereumProvider) {
        const provider = new ethers.BrowserProvider(ethereumProvider);
        setProvider(provider);
        
        // Listen for account changes
        ethereumProvider.on('accountsChanged', (accounts) => {
          setAccount(accounts[0] || '');
          if (accounts[0]) {
            initializeContract(provider, accounts[0]);
          }
        });

        // Listen for chain changes
        ethereumProvider.on('chainChanged', () => {
          window.location.reload();
        });
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error initializing provider:', error);
    }
  };

  const initializeContract = async (provider, accountAddress) => {
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, EduMetaABI.abi, signer);
      setContract(contract);
      
      // Get initial data
      await updateContractData(contract, accountAddress);
    } catch (error) {
      console.error('Error initializing contract:', error);
    }
  };

  const updateContractData = async (contractInstance, accountAddress) => {
    try {
      const [balance, totalSupply, owner, paused] = await Promise.all([
        contractInstance.balanceOf(accountAddress),
        contractInstance.totalSupply(),
        contractInstance.owner(),
        contractInstance.paused()
      ]);

      setBalance(ethers.formatEther(balance));
      setTotalSupply(ethers.formatEther(totalSupply));
      setIsOwner(owner.toLowerCase() === accountAddress.toLowerCase());
      setIsPaused(paused);
    } catch (error) {
      console.error('Error updating contract data:', error);
    }
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      const accounts = await provider.send('eth_requestAccounts', []);
      const accountAddress = accounts[0];
      setAccount(accountAddress);
      await initializeContract(provider, accountAddress);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };



  const mintTokens = async () => {
    if (!mintRecipient || !mintAmount) {
      alert('Please enter recipient address and amount');
      return;
    }

    try {
      setLoading(true);
      const amountWei = ethers.parseEther(mintAmount);
      const tx = await contract.mint(mintRecipient, amountWei);
      await tx.wait();
      
      alert('Minting successful!');
      setMintRecipient('');
      setMintAmount('');
      await updateContractData(contract, account);
    } catch (error) {
      console.error('Error minting tokens:', error);
      alert('Failed to mint tokens: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePause = async () => {
    try {
      setLoading(true);
      const tx = isPaused ? await contract.unpause() : await contract.pause();
      await tx.wait();
      
      alert(`Contract ${isPaused ? 'unpaused' : 'paused'} successfully!`);
      setIsPaused(!isPaused);
    } catch (error) {
      console.error('Error toggling pause:', error);
      alert('Failed to toggle pause: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const burnTokens = async () => {
    if (!amount) {
      alert('Please enter amount to burn');
      return;
    }

    try {
      setLoading(true);
      const amountWei = ethers.parseEther(amount);
      const tx = await contract.burn(amountWei);
      await tx.wait();
      
      alert('Burning successful!');
      setAmount('');
      await updateContractData(contract, account);
    } catch (error) {
      console.error('Error burning tokens:', error);
      alert('Failed to burn tokens: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎓 EduMeta Token dApp</h1>
        <p>Educational Meta Token (EDT) - Built on Sepolia Testnet</p>
      </header>

      <main className="App-main">
        {!account ? (
          <div className="connect-section">
            <h2>Connect Your Wallet</h2>
            <p>Connect your MetaMask wallet to interact with the EduMeta token</p>
            <button 
              className="connect-button" 
              onClick={connectWallet}
              disabled={loading}
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          </div>
        ) : (
          <div className="dapp-container">
            <div className="account-info">
              <h3>Connected Account</h3>
              <p className="account-address">{account}</p>
              <div className="balance-info">
                <p><strong>Your Balance:</strong> {balance} EDT</p>
                <p><strong>Total Supply:</strong> {totalSupply} EDT</p>
                <p><strong>Contract Status:</strong> 
                  <span className={isPaused ? 'status-paused' : 'status-active'}>
                    {isPaused ? ' Paused' : ' Active'}
                  </span>
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
              <button 
                className={`tab-button ${activeTab === 'transfer' ? 'active' : ''}`}
                onClick={() => setActiveTab('transfer')}
              >
                💸 Transfer & Approve
              </button>
              <button 
                className={`tab-button ${activeTab === 'advanced' ? 'active' : ''}`}
                onClick={() => setActiveTab('advanced')}
              >
                🔧 Advanced Features
              </button>
              <button 
                className={`tab-button ${activeTab === 'owner' ? 'active' : ''}`}
                onClick={() => setActiveTab('owner')}
              >
                👑 Owner Functions
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'transfer' && (
              <TokenTransfer 
                contract={contract} 
                account={account} 
                updateContractData={updateContractData}
              />
            )}

            {activeTab === 'advanced' && (
              <AdvancedFeatures 
                contract={contract} 
                account={account} 
                provider={provider}
              />
            )}

            {activeTab === 'owner' && (
              <div className="owner-functions">
                <div className="actions-grid">
                  <div className="action-card owner-only">
                    <h3>🪙 Mint Tokens (Owner Only)</h3>
                    <input
                      type="text"
                      placeholder="Recipient Address"
                      value={mintRecipient}
                      onChange={(e) => setMintRecipient(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Amount to Mint (EDT)"
                      value={mintAmount}
                      onChange={(e) => setMintAmount(e.target.value)}
                    />
                    <button 
                      onClick={mintTokens}
                      disabled={loading}
                      className="action-button mint"
                    >
                      {loading ? 'Minting...' : 'Mint Tokens'}
                    </button>
                  </div>

                  <div className="action-card owner-only">
                    <h3>⏸️ Pause/Unpause (Owner Only)</h3>
                    <button 
                      onClick={togglePause}
                      disabled={loading}
                      className={`action-button ${isPaused ? 'unpause' : 'pause'}`}
                    >
                      {loading ? 'Processing...' : (isPaused ? 'Unpause Contract' : 'Pause Contract')}
                    </button>
                  </div>

                  <div className="action-card owner-only">
                    <h3>🔥 Burn Tokens</h3>
                    <input
                      type="number"
                      placeholder="Amount to Burn (EDT)"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={isPaused}
                    />
                    <button 
                      onClick={burnTokens}
                      disabled={loading || isPaused}
                      className="action-button burn"
                    >
                      {loading ? 'Burning...' : 'Burn Tokens'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="network-info">
              <p><strong>Network:</strong> Sepolia Testnet</p>
              <p><strong>Contract Address:</strong> {CONTRACT_ADDRESS}</p>
              <p><strong>Token Symbol:</strong> EDT</p>
            </div>

            <TransactionHistory contract={contract} account={account} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
