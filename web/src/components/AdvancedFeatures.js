import React, { useState } from 'react';
import { ethers } from 'ethers';

const AdvancedFeatures = ({ contract, account, provider }) => {
  const [approveAddress, setApproveAddress] = useState('');
  const [approveAmount, setApproveAmount] = useState('');
  const [transferFromFrom, setTransferFromFrom] = useState('');
  const [transferFromTo, setTransferFromTo] = useState('');
  const [transferFromAmount, setTransferFromAmount] = useState('');
  const [permitDeadline, setPermitDeadline] = useState('');
  const [permitV, setPermitV] = useState('');
  const [permitR, setPermitR] = useState('');
  const [permitS, setPermitS] = useState('');
  const [flashMintAmount, setFlashMintAmount] = useState('');
  const [loading, setLoading] = useState(false);

  // ERC1363 Functions
  const approveAndCall = async () => {
    if (!approveAddress || !approveAmount) {
      alert('Please enter address and amount');
      return;
    }

    try {
      setLoading(true);
      const amountWei = ethers.parseEther(approveAmount);
      
      // For approveAndCall, we need to encode the call data
      // This is a simplified version - in practice you'd call a specific function
      const callData = '0x'; // Empty call data for this example
      
      const tx = await contract.approveAndCall(approveAddress, amountWei, callData);
      await tx.wait();
      
      alert('Approve and call successful!');
      setApproveAddress('');
      setApproveAmount('');
    } catch (error) {
      console.error('Error in approveAndCall:', error);
      alert('Failed to approve and call: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const transferAndCall = async () => {
    if (!transferFromTo || !transferFromAmount) {
      alert('Please enter recipient and amount');
      return;
    }

    try {
      setLoading(true);
      const amountWei = ethers.parseEther(transferFromAmount);
      
      // For transferAndCall, we need to encode the call data
      const callData = '0x'; // Empty call data for this example
      
      const tx = await contract.transferAndCall(transferFromTo, amountWei, callData);
      await tx.wait();
      
      alert('Transfer and call successful!');
      setTransferFromTo('');
      setTransferFromAmount('');
    } catch (error) {
      console.error('Error in transferAndCall:', error);
      alert('Failed to transfer and call: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const transferFrom = async () => {
    if (!transferFromFrom || !transferFromTo || !transferFromAmount) {
      alert('Please enter all fields');
      return;
    }

    try {
      setLoading(true);
      const amountWei = ethers.parseEther(transferFromAmount);
      
      const tx = await contract.transferFrom(transferFromFrom, transferFromTo, amountWei);
      await tx.wait();
      
      alert('Transfer from successful!');
      setTransferFromFrom('');
      setTransferFromTo('');
      setTransferFromAmount('');
    } catch (error) {
      console.error('Error in transferFrom:', error);
      alert('Failed to transfer from: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ERC20Permit Functions
  const permit = async () => {
    if (!approveAddress || !approveAmount || !permitDeadline || !permitV || !permitR || !permitS) {
      alert('Please enter all permit fields');
      return;
    }

    try {
      setLoading(true);
      const amountWei = ethers.parseEther(approveAmount);
      const deadline = parseInt(permitDeadline);
      
      const tx = await contract.permit(
        account,
        approveAddress,
        amountWei,
        deadline,
        parseInt(permitV),
        permitR,
        permitS
      );
      await tx.wait();
      
      alert('Permit successful!');
      setApproveAddress('');
      setApproveAmount('');
      setPermitDeadline('');
      setPermitV('');
      setPermitR('');
      setPermitS('');
    } catch (error) {
      console.error('Error in permit:', error);
      alert('Failed to permit: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ERC20FlashMint Functions
  const flashMint = async () => {
    if (!flashMintAmount) {
      alert('Please enter flash mint amount');
      return;
    }

    try {
      setLoading(true);
      // For flash mint, we need to implement a receiver contract
      // This is a simplified version - in practice you'd need a proper receiver
      alert('Flash mint requires a receiver contract. This is a demonstration.');
      
      // const amountWei = ethers.parseEther(flashMintAmount);
      // const tx = await contract.flashMint(amountWei, receiverData);
      // await tx.wait();
      
      setFlashMintAmount('');
    } catch (error) {
      console.error('Error in flashMint:', error);
      alert('Failed to flash mint: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const maxFlashLoan = async () => {
    try {
      setLoading(true);
      const maxAmount = await contract.maxFlashLoan(contract.target);
      const maxAmountEth = ethers.formatEther(maxAmount);
      alert(`Maximum flash loan amount: ${maxAmountEth} EDT`);
    } catch (error) {
      console.error('Error getting max flash loan:', error);
      alert('Failed to get max flash loan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ERC20 Standard Functions
  const getAllowance = async () => {
    if (!approveAddress) {
      alert('Please enter address to check allowance');
      return;
    }

    try {
      setLoading(true);
      const allowance = await contract.allowance(account, approveAddress);
      const allowanceEth = ethers.formatEther(allowance);
      alert(`Allowance for ${approveAddress}: ${allowanceEth} EDT`);
    } catch (error) {
      console.error('Error getting allowance:', error);
      alert('Failed to get allowance: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDecimals = async () => {
    try {
      setLoading(true);
      const decimals = await contract.decimals();
      alert(`Token decimals: ${decimals}`);
    } catch (error) {
      console.error('Error getting decimals:', error);
      alert('Failed to get decimals: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getName = async () => {
    try {
      setLoading(true);
      const name = await contract.name();
      alert(`Token name: ${name}`);
    } catch (error) {
      console.error('Error getting name:', error);
      alert('Failed to get name: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getSymbol = async () => {
    try {
      setLoading(true);
      const symbol = await contract.symbol();
      alert(`Token symbol: ${symbol}`);
    } catch (error) {
      console.error('Error getting symbol:', error);
      alert('Failed to get symbol: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="advanced-features">
      <h3>🔧 Advanced Contract Features</h3>
      
      <div className="features-grid">
        {/* ERC1363 Features */}
        <div className="feature-card">
          <h4>🔄 ERC1363 - Approve & Call</h4>
          <input
            type="text"
            placeholder="Address to approve"
            value={approveAddress}
            onChange={(e) => setApproveAddress(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount to approve"
            value={approveAmount}
            onChange={(e) => setApproveAmount(e.target.value)}
          />
          <button 
            onClick={approveAndCall}
            disabled={loading}
            className="action-button"
          >
            {loading ? 'Processing...' : 'Approve & Call'}
          </button>
        </div>

        <div className="feature-card">
          <h4>🔄 ERC1363 - Transfer & Call</h4>
          <input
            type="text"
            placeholder="Recipient address"
            value={transferFromTo}
            onChange={(e) => setTransferFromTo(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount to transfer"
            value={transferFromAmount}
            onChange={(e) => setTransferFromAmount(e.target.value)}
          />
          <button 
            onClick={transferAndCall}
            disabled={loading}
            className="action-button"
          >
            {loading ? 'Processing...' : 'Transfer & Call'}
          </button>
        </div>

        {/* ERC20 Standard Features */}
        <div className="feature-card">
          <h4>📤 ERC20 - Transfer From</h4>
          <input
            type="text"
            placeholder="From address"
            value={transferFromFrom}
            onChange={(e) => setTransferFromFrom(e.target.value)}
          />
          <input
            type="text"
            placeholder="To address"
            value={transferFromTo}
            onChange={(e) => setTransferFromTo(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={transferFromAmount}
            onChange={(e) => setTransferFromAmount(e.target.value)}
          />
          <button 
            onClick={transferFrom}
            disabled={loading}
            className="action-button"
          >
            {loading ? 'Processing...' : 'Transfer From'}
          </button>
        </div>

        {/* ERC20Permit Features */}
        <div className="feature-card">
          <h4>✍️ ERC20Permit - Permit</h4>
          <input
            type="text"
            placeholder="Spender address"
            value={approveAddress}
            onChange={(e) => setApproveAddress(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={approveAmount}
            onChange={(e) => setApproveAmount(e.target.value)}
          />
          <input
            type="number"
            placeholder="Deadline (timestamp)"
            value={permitDeadline}
            onChange={(e) => setPermitDeadline(e.target.value)}
          />
          <input
            type="number"
            placeholder="v (signature component)"
            value={permitV}
            onChange={(e) => setPermitV(e.target.value)}
          />
          <input
            type="text"
            placeholder="r (signature component)"
            value={permitR}
            onChange={(e) => setPermitR(e.target.value)}
          />
          <input
            type="text"
            placeholder="s (signature component)"
            value={permitS}
            onChange={(e) => setPermitS(e.target.value)}
          />
          <button 
            onClick={permit}
            disabled={loading}
            className="action-button"
          >
            {loading ? 'Processing...' : 'Permit'}
          </button>
        </div>

        {/* ERC20FlashMint Features */}
        <div className="feature-card">
          <h4>⚡ ERC20FlashMint - Flash Mint</h4>
          <input
            type="number"
            placeholder="Flash mint amount"
            value={flashMintAmount}
            onChange={(e) => setFlashMintAmount(e.target.value)}
          />
          <button 
            onClick={flashMint}
            disabled={loading}
            className="action-button"
          >
            {loading ? 'Processing...' : 'Flash Mint'}
          </button>
          <button 
            onClick={maxFlashLoan}
            disabled={loading}
            className="action-button"
          >
            {loading ? 'Loading...' : 'Get Max Flash Loan'}
          </button>
        </div>

        {/* ERC20 Info Features */}
        <div className="feature-card">
          <h4>ℹ️ ERC20 - Token Info</h4>
          <button 
            onClick={getAllowance}
            disabled={loading}
            className="action-button"
          >
            {loading ? 'Loading...' : 'Get Allowance'}
          </button>
          <button 
            onClick={getDecimals}
            disabled={loading}
            className="action-button"
          >
            {loading ? 'Loading...' : 'Get Decimals'}
          </button>
          <button 
            onClick={getName}
            disabled={loading}
            className="action-button"
          >
            {loading ? 'Loading...' : 'Get Name'}
          </button>
          <button 
            onClick={getSymbol}
            disabled={loading}
            className="action-button"
          >
            {loading ? 'Loading...' : 'Get Symbol'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFeatures;
