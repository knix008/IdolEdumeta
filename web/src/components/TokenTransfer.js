import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const TokenTransfer = ({ contract, account, updateContractData }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState('0');
  const [allowance, setAllowance] = useState('0');
  const [spender, setSpender] = useState('');
  const [approveAmount, setApproveAmount] = useState('');
  const [approveLoading, setApproveLoading] = useState(false);

  useEffect(() => {
    if (contract && account) {
      loadBalance();
    }
  }, [contract, account]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadBalance = async () => {
    try {
      const balanceWei = await contract.balanceOf(account);
      setBalance(ethers.formatEther(balanceWei));
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  const sendTokens = async () => {
    if (!recipient || !amount) {
      alert('Please enter recipient address and amount');
      return;
    }

    if (!ethers.isAddress(recipient)) {
      alert('Please enter a valid Ethereum address');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (amountNum > parseFloat(balance)) {
      alert('Insufficient balance');
      return;
    }

    try {
      setLoading(true);
      const amountWei = ethers.parseEther(amount);
      const tx = await contract.transfer(recipient, amountWei);
      
      alert('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      
      alert('Transaction successful!');
      setRecipient('');
      setAmount('');
      await loadBalance();
      if (updateContractData) {
        await updateContractData(contract, account);
      }
    } catch (error) {
      console.error('Error sending tokens:', error);
      alert('Failed to send tokens: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const approveTokens = async () => {
    if (!spender || !approveAmount) {
      alert('Please enter spender address and amount');
      return;
    }

    if (!ethers.isAddress(spender)) {
      alert('Please enter a valid Ethereum address');
      return;
    }

    try {
      setApproveLoading(true);
      const amountWei = ethers.parseEther(approveAmount);
      const tx = await contract.approve(spender, amountWei);
      
      alert('Approval transaction sent! Waiting for confirmation...');
      await tx.wait();
      
      alert('Approval successful!');
      setSpender('');
      setApproveAmount('');
      await loadAllowance();
    } catch (error) {
      console.error('Error approving tokens:', error);
      alert('Failed to approve tokens: ' + error.message);
    } finally {
      setApproveLoading(false);
    }
  };

  const loadAllowance = async () => {
    if (!spender) return;
    
    try {
      const allowanceWei = await contract.allowance(account, spender);
      setAllowance(ethers.formatEther(allowanceWei));
    } catch (error) {
      console.error('Error loading allowance:', error);
    }
  };

  const increaseAllowance = async () => {
    if (!spender || !approveAmount) {
      alert('Please enter spender address and amount');
      return;
    }

    try {
      setApproveLoading(true);
      const amountWei = ethers.parseEther(approveAmount);
      const tx = await contract.increaseAllowance(spender, amountWei);
      
      alert('Increase allowance transaction sent! Waiting for confirmation...');
      await tx.wait();
      
      alert('Allowance increased successfully!');
      setSpender('');
      setApproveAmount('');
      await loadAllowance();
    } catch (error) {
      console.error('Error increasing allowance:', error);
      alert('Failed to increase allowance: ' + error.message);
    } finally {
      setApproveLoading(false);
    }
  };

  const decreaseAllowance = async () => {
    if (!spender || !approveAmount) {
      alert('Please enter spender address and amount');
      return;
    }

    try {
      setApproveLoading(true);
      const amountWei = ethers.parseEther(approveAmount);
      const tx = await contract.decreaseAllowance(spender, amountWei);
      
      alert('Decrease allowance transaction sent! Waiting for confirmation...');
      await tx.wait();
      
      alert('Allowance decreased successfully!');
      setSpender('');
      setApproveAmount('');
      await loadAllowance();
    } catch (error) {
      console.error('Error decreasing allowance:', error);
      alert('Failed to decrease allowance: ' + error.message);
    } finally {
      setApproveLoading(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(account);
    alert('Address copied to clipboard!');
  };

  const validateAddress = (address) => {
    return ethers.isAddress(address);
  };

  return (
    <div className="token-transfer">
      <h3>💸 Token Transfer & Approval</h3>
      
      <div className="transfer-grid">
        {/* Send Tokens */}
        <div className="transfer-card">
          <h4>📤 Send Tokens</h4>
          <div className="balance-display">
            <p><strong>Your Balance:</strong> {balance} EDT</p>
          </div>
          <input
            type="text"
            placeholder="Recipient Address (0x...)"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className={recipient && !validateAddress(recipient) ? 'invalid' : ''}
          />
          <input
            type="number"
            placeholder="Amount (EDT)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.000001"
          />
          <button 
            onClick={sendTokens}
            disabled={loading || !recipient || !amount || !validateAddress(recipient)}
            className="action-button send"
          >
            {loading ? 'Sending...' : 'Send Tokens'}
          </button>
        </div>

        {/* Approve Tokens */}
        <div className="transfer-card">
          <h4>✅ Approve Tokens</h4>
          <input
            type="text"
            placeholder="Spender Address (0x...)"
            value={spender}
            onChange={(e) => setSpender(e.target.value)}
            className={spender && !validateAddress(spender) ? 'invalid' : ''}
          />
          <input
            type="number"
            placeholder="Amount to Approve (EDT)"
            value={approveAmount}
            onChange={(e) => setApproveAmount(e.target.value)}
            min="0"
            step="0.000001"
          />
          <div className="allowance-info">
            {spender && (
              <p><strong>Current Allowance:</strong> {allowance} EDT</p>
            )}
          </div>
          <div className="approval-buttons">
            <button 
              onClick={approveTokens}
              disabled={approveLoading || !spender || !approveAmount || !validateAddress(spender)}
              className="action-button approve"
            >
              {approveLoading ? 'Approving...' : 'Approve'}
            </button>
            <button 
              onClick={increaseAllowance}
              disabled={approveLoading || !spender || !approveAmount || !validateAddress(spender)}
              className="action-button increase"
            >
              {approveLoading ? 'Processing...' : 'Increase'}
            </button>
            <button 
              onClick={decreaseAllowance}
              disabled={approveLoading || !spender || !approveAmount || !validateAddress(spender)}
              className="action-button decrease"
            >
              {approveLoading ? 'Processing...' : 'Decrease'}
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div className="transfer-card account-info">
          <h4>👤 Account Information</h4>
          <div className="account-details">
            <p><strong>Your Address:</strong></p>
            <div className="address-display">
              <span className="address-text">{account}</span>
              <button onClick={copyAddress} className="copy-button">
                📋 Copy
              </button>
            </div>
          </div>
          <div className="account-actions">
            <button 
              onClick={loadBalance}
              className="action-button refresh"
            >
              🔄 Refresh Balance
            </button>
            <button 
              onClick={loadAllowance}
              disabled={!spender}
              className="action-button refresh"
            >
              🔄 Check Allowance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenTransfer;
