import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

function MessageStatus({ txHash }) {
  const [status, setStatus] = useState("Enter L1 Transaction Hash");
  const [messageHash, setMessageHash] = useState(null);
  const [error, setError] = useState(null);
  const [l2TxHash, setL2TxHash] = useState(null);

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

    // const fetchL1Logs = async () => {
    //     try {
    //       setStatus("Fetching logs from L1...");
      
    //       const logs = await l1Provider.getLogs({
    //         address: L1_CONTRACT_ADDRESS,
    //         fromBlock: 7447912, // Adjust block range based on your L1 transaction block
    //         toBlock: 7447916,
    //       });
      
    //       if (logs.length === 0) {
    //         setStatus("No logs found in the specified block range.");
    //         return;
    //       }
      
    //       console.log("Fetched Logs:", logs);
      
    //       // Find the log that matches the transaction hash
    //       const matchingLog = logs.find((log) => log.transactionHash === txHash);
      
    //       if (matchingLog) {
    //         console.log("Matching Log Found:", matchingLog);
      
    //         // Extract the message hash from the log
    //         const msgHash = matchingLog.topics[3]; // Adjust based on your event topics
    //         setMessageHash(msgHash);
    //         setStatus("Message sent on L1. Checking L2...");
    //         return msgHash;
    //       } else {
    //         setStatus("No matching logs found for the transaction hash.");
    //       }
    //     } catch (err) {
    //       setError("Error fetching L1 logs.");
    //       console.error("Error in fetchL1Logs:", err);
    //     }
    //   };
    

      const fetchL1Logs = async () => {
        try {
          setStatus("Fetching logs from L1...");
          
          // Fetch the L1 transaction receipt
          const txReceipt = await l1Provider.getTransactionReceipt(txHash);
          if (!txReceipt) {
            setStatus("Transaction receipt not found.");
            console.log("Transaction receipt not found for hash:", txHash);
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
            setStatus("No logs found in the specified block range.");
            console.log("Raw Logs: None");
            return;
          }
      
          console.log("Fetched Logs:", logs);
      
          // Look for the log that matches the provided txHash
          const log = logs.find((log) => log.transactionHash === txHash);
          if (log) {
            console.log("Matching Log Found:", log);
            const msgHash = log.topics[3]; // Adjust based on your event structure
            setMessageHash(msgHash);
            setStatus("Message sent on L1. Checking L2...");
            return msgHash;
          } else {
            setStatus("No matching logs found for the transaction hash.");
          }
        } catch (err) {
          setError("Error fetching L1 logs.");
          console.error("Error in fetchL1Logs:", err);
        }
      };

    //   const fetchL2Logs = async (msgHash) => {
    //     try {
    //       const messageClaimedEvent = ethers.utils.id("MessageClaimed(bytes32)");

    //       const logs = await l2Provider.getLogs({
    //         address: L2_CONTRACT_ADDRESS,
    //         topics: [
    //           messageClaimedEvent, // Event signature for MessageClaimed
    //           msgHash, // Indexed parameter (message hash)
    //         ],
    //         fromBlock: 7863700, // Adjust based on your L2 block
    //         toBlock: "latest",
    //       });

    //       if (logs.length > 0) {
    //         const l2Tx = logs[0].transactionHash;
    //         setL2TxHash(l2Tx);
    //         setStatus("Message successfully claimed on L2!");
    //       } else {
    //         setStatus("Message not yet claimed on L2.");
    //       }
    //     } catch (err) {
    //       setError("Error fetching L2 logs.");
    //       console.error(err);
    //     }
    //   };

      
    // const fetchL2Logs = async (msgHash) => {
    //     try {
    //       const messageClaimedEvent = ethers.utils.id("MessageClaimed(bytes32)");
      
    //       // Fetch the latest block number on L2
    //       const latestBlockL2 = await l2Provider.getBlockNumber();
      
    //       // Set a dynamic range: look back 5000 blocks from the latest block
    //       const fromBlock = Math.max(latestBlockL2 - 5000, 0); // Ensures we don't go below 0
    //       const toBlock = "latest";
      
    //       console.log(`Fetching logs on L2 from block ${fromBlock} to ${toBlock}...`);
      
    //       const logs = await l2Provider.getLogs({
    //         address: L2_CONTRACT_ADDRESS,
    //         topics: [
    //           messageClaimedEvent, // Event signature for MessageClaimed
    //           msgHash, // Indexed parameter (message hash)
    //         ],
    //         fromBlock,
    //         toBlock,
    //       });
      
    //       if (logs.length > 0) {
    //         const l2Tx = logs[0].transactionHash;
    //         setL2TxHash(l2Tx);
    //         setStatus("Message successfully claimed on L2!");
    //       } else {
    //         setStatus("Message not yet claimed on L2.");
    //       }
    //     } catch (err) {
    //       setError("Error fetching L2 logs.");
    //       console.error(err);
    //     }
    //   };
    
    const fetchL2Logs = async (msgHash) => {
        try {
          const messageClaimedEvent = ethers.utils.id("MessageClaimed(bytes32)");
      
          // Step 1: Get the L1 block containing the transaction
          const l1TxReceipt = await l1Provider.getTransactionReceipt(txHash);
          if (!l1TxReceipt) {
            setStatus("L1 Transaction not found.");
            return;
          }
      
          const l1Block = await l1Provider.getBlock(l1TxReceipt.blockNumber);
          if (!l1Block) {
            setStatus("L1 Block not found.");
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
            setStatus("Message not yet claimed on L2.");
          }
        } catch (err) {
          setError("Error fetching L2 logs.");
          console.error(err);
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
    return <p>{error}</p>;
  }

  return (
    <div>
      <h3>Message Status</h3>
      <p><strong>L1 Transaction Hash:</strong> {txHash}</p>
      <p><strong>Status:</strong> {status}</p>
      {messageHash && <p><strong>Message Hash:</strong> {messageHash}</p>}
      {l2TxHash && <p><strong>L2 Transaction Hash:</strong> {l2TxHash}</p>}
    </div>
  );
}

export default MessageStatus;