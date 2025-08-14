import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const TransactionHistory = ({ contract, account }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contract && account) {
      loadTransactionHistory();
    }
  }, [contract, account]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTransactionHistory = async () => {
    setLoading(true);
    try {
      // Get transfer events for the connected account
      const filter = contract.filters.Transfer(account, null);
      const sentEvents = await contract.queryFilter(filter);
      
      const filter2 = contract.filters.Transfer(null, account);
      const receivedEvents = await contract.queryFilter(filter2);
      
      // Combine and sort events
      const allEvents = [...sentEvents, ...receivedEvents].sort((a, b) => 
        b.blockNumber - a.blockNumber
      );
      
      // Get transaction details
      const txDetails = await Promise.all(
        allEvents.slice(0, 10).map(async (event) => {
          const block = await event.getBlock();
          const amount = ethers.formatEther(event.args[2]);
          const isSent = event.args[0].toLowerCase() === account.toLowerCase();
          
          return {
            hash: event.transactionHash,
            from: event.args[0],
            to: event.args[1],
            amount,
            timestamp: block.timestamp,
            isSent,
            blockNumber: event.blockNumber
          };
        })
      );
      
      setTransactions(txDetails);
    } catch (error) {
      console.error('Error loading transaction history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (!contract || !account) {
    return null;
  }

  return (
    <div className="transaction-history">
      <h3>📜 Recent Transactions</h3>
      <button 
        onClick={loadTransactionHistory}
        disabled={loading}
        className="refresh-button"
      >
        {loading ? 'Loading...' : '🔄 Refresh'}
      </button>
      
      {transactions.length === 0 ? (
        <p className="no-transactions">No transactions found</p>
      ) : (
        <div className="transactions-list">
          {transactions.map((tx, index) => (
            <div key={index} className={`transaction-item ${tx.isSent ? 'sent' : 'received'}`}>
              <div className="transaction-icon">
                {tx.isSent ? '📤' : '📥'}
              </div>
              <div className="transaction-details">
                <div className="transaction-amount">
                  {tx.isSent ? '-' : '+'}{tx.amount} EDT
                </div>
                <div className="transaction-addresses">
                  {tx.isSent ? (
                    <>
                      <span>To: {formatAddress(tx.to)}</span>
                    </>
                  ) : (
                    <>
                      <span>From: {formatAddress(tx.from)}</span>
                    </>
                  )}
                </div>
                <div className="transaction-time">
                  {formatTimestamp(tx.timestamp)}
                </div>
              </div>
              <div className="transaction-hash">
                <a 
                  href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="etherscan-link"
                >
                  🔗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
