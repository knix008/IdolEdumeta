# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 1. Module not found: Can't resolve './artifacts/contracts/EduMetaCoinErc20.sol/EduMeta.json'

**Problem**: The React app can't find the contract ABI file.

**Solution**:
```bash
# From the web directory
node update-artifacts.js
```

This script will copy the latest contract artifacts from the root directory to the web directory.

**Alternative Solution**:
```bash
# From the root directory, compile contracts first
npx hardhat compile

# Then copy artifacts to web directory
cp -r artifacts web/src/
```

### 2. Contract not found or invalid address

**Problem**: The dApp shows "Contract not found" or similar errors.

**Solution**:
1. Make sure your contract is deployed to Sepolia
2. Update the contract address in `web/.env`:
   ```bash
   REACT_APP_CONTRACT_ADDRESS=0xYourDeployedContractAddress
   ```

### 3. MetaMask connection issues

**Problem**: Can't connect MetaMask or wrong network.

**Solution**:
1. Make sure MetaMask is installed and unlocked
2. Switch to Sepolia testnet in MetaMask
3. Network ID should be: 11155111
4. Make sure you have some Sepolia ETH for gas fees

### 4. Transaction failures

**Problem**: Transactions are failing or getting rejected.

**Solutions**:
- **Insufficient balance**: Check your token balance
- **Insufficient ETH**: Get Sepolia ETH from a faucet
- **Contract paused**: Wait for owner to unpause
- **Wrong network**: Switch to Sepolia testnet
- **Gas issues**: Try increasing gas limit

### 5. React app won't start

**Problem**: `npm start` fails or shows errors.

**Solutions**:
1. **Missing dependencies**:
   ```bash
   npm install
   ```

2. **Port already in use**:
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   # Or use different port
   PORT=3001 npm start
   ```

3. **Node version issues**:
   ```bash
   # Check Node version (should be 14+)
   node --version
   ```

### 6. Contract compilation issues

**Problem**: Can't compile smart contracts.

**Solutions**:
1. **Missing dependencies**:
   ```bash
   # From root directory
   npm install
   ```

2. **Solidity version issues**:
   - Check hardhat.config.js for correct Solidity version
   - Make sure OpenZeppelin contracts are compatible

3. **Compilation errors**:
   ```bash
   npx hardhat compile --force
   ```

### 7. Environment variables not working

**Problem**: Environment variables not being read.

**Solutions**:
1. **Restart React app** after changing .env:
   ```bash
   # Stop the app (Ctrl+C) and restart
   npm start
   ```

2. **Check .env format**:
   ```bash
   # Should be in web/.env
   REACT_APP_CONTRACT_ADDRESS=0x...
   REACT_APP_NETWORK_ID=11155111
   ```

3. **Clear cache**:
   ```bash
   npm run build
   npm start
   ```

### 8. Performance issues

**Problem**: App is slow or unresponsive.

**Solutions**:
1. **Clear browser cache**
2. **Check network connection**
3. **Reduce transaction history load**:
   - The app loads last 10 transactions
   - You can modify this in TransactionHistory.js

### 9. Mobile/Responsive issues

**Problem**: App doesn't work well on mobile.

**Solutions**:
1. **Check viewport meta tag** in public/index.html
2. **Test on different screen sizes**
3. **Use browser dev tools** to simulate mobile

### 10. Deployment issues

**Problem**: Can't deploy to production.

**Solutions**:
1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Check build output** in `build/` directory
3. **Update contract address** for production network
4. **Configure environment variables** for production

## 🔍 Debugging Tips

### Check Browser Console
- Open browser dev tools (F12)
- Look for errors in Console tab
- Check Network tab for failed requests

### Check React Dev Tools
- Install React Developer Tools browser extension
- Inspect component state and props

### Check MetaMask
- Open MetaMask extension
- Check account, network, and transaction history
- Look for pending or failed transactions

### Check Hardhat
- Run `npx hardhat console` to test contract interactions
- Use `npx hardhat test` to verify contract functionality

## 📞 Getting Help

If you're still having issues:

1. **Check the logs**: Look at browser console and terminal output
2. **Verify setup**: Make sure all dependencies are installed
3. **Test step by step**: Start with basic functionality first
4. **Check documentation**: Review README.md and FEATURES_GUIDE.md

## 🚀 Quick Fix Commands

```bash
# From root directory
npx hardhat compile
cd web
node update-artifacts.js
npm install
npm start
```

---

**Most issues can be resolved by updating artifacts and restarting the React app!**
