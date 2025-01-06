const { ethers } = require('ethers');
require('dotenv').config();

// Load environment variables
const { INFURA_API_KEY } = process.env;

const L1_CONTRACT_ADDRESS = "0xB218f8A4Bc926cF1cA7b3423c154a0D627Bdb7E5";

// Validate environment variables
if (!INFURA_API_KEY || !L1_CONTRACT_ADDRESS) {
    console.error('Missing INFURA_API_KEY or L1_CONTRACT_ADDRESS in .env file');
    process.exit(1);
}

// Initialize provider
const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);

// Define the block range around the L1 transaction
const START_BLOCK = 7425500; // Block just before the L1 transaction
const END_BLOCK = 7425600;   // Block shortly after the L1 transaction

async function fetchLogs() {
    try {
        console.log(`Fetching logs from block ${START_BLOCK} to ${END_BLOCK} for L1 contract...`);

        const logs = await provider.getLogs({
            address: L1_CONTRACT_ADDRESS,
            fromBlock: ethers.toBeHex(START_BLOCK),
            toBlock: ethers.toBeHex(END_BLOCK),
        });

        if (logs.length === 0) {
            console.log("No logs found in the specified range.");
        } else {
            console.log(`Fetched ${logs.length} logs:`);
            logs.forEach((log, index) => {
                console.log(`Log ${index + 1}:`, log);
            });
        }
    } catch (error) {
        console.error('Error fetching logs:', error);
    }
}

fetchLogs();