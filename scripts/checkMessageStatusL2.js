const { LineaSDK } = require("@consensys/linea-sdk");
const { ethers } = require("ethers"); // For utility functions

require('dotenv').config();

const { INFURA_API_KEY } = process.env;

async function main() {
    const proxyAddress = "0x971e727e956690b9957be6d51Ec16E73AcAC83A7"; // L2 contract address
    const rpcUrl = `https://linea-sepolia.infura.io/v3/${INFURA_API_KEY}`;
    
    // Initialize the Linea SDK
    const sdk = new LineaSDK({
        l1RpcUrl: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
        l2RpcUrl: `https://linea-sepolia.infura.io/v3/${INFURA_API_KEY}`,
        network: "linea-sepolia", // Network you want to interact with
        mode: "read-only",
    });

    const messageHash = "0x8c406ba8886c23ec157d7d4ff61a0b0fcb6d351d81899af9cb1f722c443656ab"; // The message hash you fetched
    const l2Contract = sdk.getL2Contract();

    // Poll for the MessageClaimed event
    const checkClaimed = async () => {
        try {
            // Fetch logs to find the MessageClaimed event with the specific message hash
            const logs = await l2Contract.provider.getLogs({
                address: proxyAddress,  // Contract address on L2
                topics: [
                    ethers.id("MessageClaimed(bytes32)"),  // Event topic hash
                    messageHash  // Message hash from the sent message
                ],
                fromBlock: 0,
                toBlock: "latest"
            });

            if (logs.length > 0) {
                console.log("Message has been claimed on L2!");
                clearInterval(interval);  // Stop polling once the event is found
            } else {
                console.log("Message not yet claimed on L2.");
            }
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    // Poll every 10 seconds
    const interval = setInterval(checkClaimed, 10000);
}

main().catch(console.error);