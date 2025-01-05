require('dotenv').config();
const { LineaSDK } = require('@consensys/linea-sdk');
const { ethers } = require('ethers'); // for utility functions

const { INFURA_API_KEY } = process.env;

// Init SDK (No private key needed in read-only mode)
const sdk = new LineaSDK({
    l1RpcUrl: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`, // L1 RPC URL
    l2RpcUrl: `https://linea-sepolia.infura.io/v3/${INFURA_API_KEY}`, // L2 RPC URL
    network: "linea-sepolia", // Network you want to interact with (either linea-mainnet or linea-sepolia)
    mode: "read-only", // Read-only mode to interact with contracts without writing
});

async function getMessageInfo(transactionHash) {
    try {
        // Get the L1 contract instance
        const l1Contract = sdk.getL1Contract();

        // Fetch messages by transaction hash from L1
        const messages = await l1Contract.getMessagesByTransactionHash(transactionHash);

        console.log("Fetched messages:", messages);

        if (!messages || messages.length === 0) {
            console.error("No messages found for this tx.");
            return;
        }

        // Parse the messages and log details
        messages.forEach((message) => {
            console.log("----------------------------");
            console.log("Sender:", message.messageSender);
            console.log("Destination:", message.destination);
            console.log("Fee:", ethers.formatEther(message.fee)); // Correctly format fee
            console.log("Value:", ethers.formatEther(message.value)); // Correctly format value
            console.log("Message Nonce:", message.messageNonce.toString());
            console.log("Calldata:", message.calldata);
            console.log("Message Hash:", message.messageHash);
            console.log("----------------------------");
        });
    } catch (error) {
        console.error("Error fetching message information:", error);
    }
}

// Replace with your L1 transaction hash
const transactionHash = "0xdc33908fd39c4b270a9811adeffeb2db5e5b375b77c3c57e745bffe1d931a49a";
getMessageInfo(transactionHash);