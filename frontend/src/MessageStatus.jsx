import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

function MessageStatus({ txHash }) {
  const [status, setStatus] = useState("Enter L1 Transaction Hash");
  const [messageHash, setMessageHash] = useState(null);
  const [error, setError] = useState(null);
  const [l2TxHash, setL2TxHash] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (txHash) {
      const L1_CONTRACT_ADDRESS = "0xB218f8A4Bc926cF1cA7b3423c154a0D627Bdb7E5";
      const L2_CONTRACT_ADDRESS = "0x971e727e956690b9957be6d51Ec16E73AcAC83A7";
      const INFURA_API_KEY = import.meta.env.VITE_INFURA_API_KEY;

      if (!INFURA_API_KEY || !L1_CONTRACT_ADDRESS || !L2_CONTRACT_ADDRESS) {
        setError("Missing configuration for Infura API key or contract addresses.");
        return;
      }

      // Initialize providers for ethers v5.x
      const l1Provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
      const l2Provider = new ethers.providers.JsonRpcProvider(`https://linea-sepolia.infura.io/v3/${INFURA_API_KEY}`);

      const fetchL1Logs = async () => {
        try {
          setIsLoading(true);
          setStatus("Fetching logs from L1...");
          
          // Fetch the L1 transaction receipt
          const txReceipt = await l1Provider.getTransactionReceipt(txHash);
          if (!txReceipt) {
            setStatus("Transaction receipt not found. Please verify the transaction hash.");
            setIsLoading(false);
            return;
          }
      
          const blockNumber = txReceipt.blockNumber; // Get the block number from the receipt
          console.log(`Transaction included in block ${blockNumber}`);
      
          // Fetch logs around the block
          const logs = await l1Provider.getLogs({
            address: L1_CONTRACT_ADDRESS,
            fromBlock: blockNumber - 5, // Set a small range around the block
            toBlock: blockNumber + 5,
          });
      
          if (logs.length === 0) {
            setStatus("No logs found for this bridge transaction. Ensure this is a valid bridge transaction.");
            setIsLoading(false);
            return;
          }
      
          console.log("Fetched Logs:", logs);
      
          // Look for the log that matches the provided txHash
          const log = logs.find((log) => log.transactionHash === txHash);
          if (log) {
            console.log("Matching Log Found:", log);
            const msgHash = log.topics[3]; // Adjust based on your event structure
            setMessageHash(msgHash);
            setStatus("Message sent on L1. Checking L2 status...");
            return msgHash;
          } else {
            setStatus("No matching bridge transaction found for this hash.");
            setIsLoading(false);
          }
        } catch (err) {
          setError("Error fetching L1 logs: " + (err.message || "Unknown error"));
          console.error("Error in fetchL1Logs:", err);
          setIsLoading(false);
        }
      };
    
      const fetchL2Logs = async (msgHash) => {
        try {
          const messageClaimedEvent = ethers.utils.id("MessageClaimed(bytes32)");
      
          // Step 1: Get the L1 block containing the transaction
          const l1TxReceipt = await l1Provider.getTransactionReceipt(txHash);
          if (!l1TxReceipt) {
            setStatus("L1 Transaction not found.");
            setIsLoading(false);
            return;
          }
      
          const l1Block = await l1Provider.getBlock(l1TxReceipt.blockNumber);
          if (!l1Block) {
            setStatus("L1 Block not found.");
            setIsLoading(false);
            return;
          }
      
          const l1Timestamp = l1Block.timestamp; // Timestamp of the L1 block
      
          // Step 2: Get the latest L2 block
          const latestBlockL2 = await l2Provider.getBlockNumber();
          const latestBlockL2Data = await l2Provider.getBlock(latestBlockL2);
          const latestL2Timestamp = latestBlockL2Data.timestamp;
      
          // Step 3: Estimate the starting block on L2 based on the L1 timestamp
          const typicalL2BlockTime = 2; // Typical block time for Linea L2 in seconds
          const estimatedL2StartBlock = Math.max(
            latestBlockL2 - Math.floor((latestL2Timestamp - l1Timestamp) / typicalL2BlockTime),
            0
          );
      
          console.log(`Fetching logs on L2 from block ${estimatedL2StartBlock} to latest...`);
      
          // Step 4: Fetch logs from the calculated range
          const logs = await l2Provider.getLogs({
            address: L2_CONTRACT_ADDRESS,
            topics: [
              messageClaimedEvent, // Event signature for MessageClaimed
              msgHash, // Indexed parameter (message hash)
            ],
            fromBlock: estimatedL2StartBlock,
            toBlock: "latest",
          });
      
          if (logs.length > 0) {
            const l2Tx = logs[0].transactionHash;
            setL2TxHash(l2Tx);
            setStatus("Message successfully claimed on L2!");
          } else {
            setStatus("Message not yet claimed on L2. The transfer is still in progress.");
          }
          setIsLoading(false);
        } catch (err) {
          setError("Error fetching L2 logs: " + (err.message || "Unknown error"));
          console.error(err);
          setIsLoading(false);
        }
      };

      const checkMessageStatus = async () => {
        const msgHash = await fetchL1Logs();
        if (msgHash) {
          await fetchL2Logs(msgHash);
        }
      };

      checkMessageStatus();
    }
  }, [txHash]);

  if (error) {
    return (
      <div className="status-error">
        <div style={{ color: 'var(--error)', marginBottom: '0.5rem' }}>Error</div>
        <p>{error}</p>
      </div>
    );
  }

  const getStatusIcon = () => {
    if (isLoading) {
      return <div className="status-loading"></div>;
    }
    if (l2TxHash) {
      return <div className="status-complete">✓</div>;
    }
    if (messageHash) {
      return <div className="status-pending">⏱</div>;
    }
    return null;
  };

  const shortenHash = (hash) => {
    if (!hash) return '';
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {getStatusIcon()}
        <div style={{ fontWeight: '500' }}>{status}</div>
      </div>
      
      {txHash && (
        <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>L1 Tx: </span>
          <a 
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--primary)', textDecoration: 'none' }}
          >
            {shortenHash(txHash)}
          </a>
        </div>
      )}
      
      {messageHash && (
        <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Message Hash: </span>
          <span style={{ wordBreak: 'break-all' }}>{shortenHash(messageHash)}</span>
        </div>
      )}
      
      {l2TxHash && (
        <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>L2 Tx: </span>
          <a 
            href={`https://sepolia.lineascan.build/tx/${l2TxHash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--success)', textDecoration: 'none' }}
          >
            {shortenHash(l2TxHash)}
          </a>
        </div>
      )}
      
      {isLoading && (
        <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Checking message status. This may take a few moments...
        </div>
      )}
    </div>
  );
}

export default MessageStatus;