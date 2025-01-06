require('dotenv').config();
const { ethers } = require("ethers");

const { PRIVATE_KEY, INFURA_API_KEY } = process.env;

if (!PRIVATE_KEY) {
  console.error("Private key is not set. Check your .env file.");
  process.exit(1);
}

console.log('Private Key:', PRIVATE_KEY);  // Debugging line

// Replace this with your RPC URL (Infura, Alchemy, etc.)
const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);

// Replace this with your private key (make sure to use an environment variable to keep it secure in production)
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

async function replaceTransaction() {
  try {
    const nonce = await provider.getTransactionCount(wallet.address, 'latest');
    
    const tx = {
      to: wallet.address,  // Sending to your own address to replace the previous transaction
      value: ethers.parseUnits("0.0001", "ether"), // Corrected for v6.x
      gasLimit: 21000, // Standard gas limit for a simple ETH transfer
      gasPrice: ethers.parseUnits("50", "gwei"), // Corrected for v6.x
      nonce: nonce, // Ensure the same nonce as the stuck transaction
      chainId: 11155111, // Sepolia Testnet chain ID
    };

    console.log("Sending replacement transaction...");

    // Send the transaction
    const transaction = await wallet.sendTransaction(tx);
    console.log(`Transaction Hash: ${transaction.hash}`);

    // Wait for the transaction to be mined
    await transaction.wait();
    console.log("Transaction replaced successfully!");
  } catch (error) {
    console.error("Error replacing transaction:", error);
  }
}

replaceTransaction();