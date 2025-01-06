import React, { useState, useEffect } from 'react';
import { LineaSDK } from '@consensys/linea-sdk';
import { ethers } from 'ethers';  // Import ethers correctly

console.log("VITE_INFURA_API_KEY:", import.meta.env.VITE_INFURA_API_KEY);

function MessageStatus({ txHash }) {
  const [status, setStatus] = useState("Enter L1 Transaction Hash");
  const [messageHash, setMessageHash] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (txHash) {
      const sdk = new LineaSDK({
        l1RpcUrl: `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`,
        l2RpcUrl: `https://linea-sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`,
        network: "linea-sepolia",
        mode: "read-only",
      });

      // Use the correct constructor for ethers provider
      const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`);  // Use ethers.providers.JsonRpcProvider

      const checkStatus = async () => {
        try {
          setStatus("Checking...");

          // Get messages from L1
          const l1Contract = sdk.getL1Contract();
          const messages = await l1Contract.getMessagesByTransactionHash(txHash);

          // Fetch transaction receipt from L1 using ethers provider
          const receipt = await provider.getTransactionReceipt(txHash);
          console.log("Transaction Receipt:", receipt);

          if (messages && messages.length > 0) {
            const message = messages[0];
            setMessageHash(message.messageHash);

            // Polling the L2 to check message status
            const l2Contract = sdk.getL2Contract();
            const logs = await provider.getLogs({
              address: "0x971e727e956690b9957be6d51Ec16E73AcAC83A7", // Make sure to replace with actual contract address
              topics: [
                message.messageHash,
              ],
              fromBlock: 0,  // Start from the first block
              toBlock: "latest"  // Query until the latest block
            });

            if (logs.length > 0) {
              setStatus("Message has been claimed on L2!");
            } else {
              setStatus("Message not yet claimed on L2.");
            }
          } else {
            setStatus("Message not found on L1.");
          }
        } catch (err) {
          setError("Failed to check status. Please try again later.");
          setStatus("Error fetching status.");
          console.error("Error fetching message information:", err);
        }
      };

      checkStatus();
    }
  }, [txHash]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h3>Message Status</h3>
      <p><strong>Transaction Hash:</strong> {txHash}</p>
      <p><strong>Status:</strong> {status}</p>
      {messageHash && <p><strong>Message Hash:</strong> {messageHash}</p>}
    </div>
  );
}

export default MessageStatus;