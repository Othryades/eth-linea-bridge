const { ethers } = require('ethers');
require('dotenv').config();

// Load environment variables
const { INFURA_API_KEY } = process.env;

const L2_CONTRACT_ADDRESS = "0x971e727e956690b9957be6d51Ec16E73AcAC83A7";
const MESSAGE_HASH = "0x8c406ba8886c23ec157d7d4ff61a0b0fcb6d351d81899af9cb1f722c443656ab";

// Validate environment variables
if (!INFURA_API_KEY || !L2_CONTRACT_ADDRESS || !MESSAGE_HASH) {
    console.error('Missing INFURA_API_KEY, L2_CONTRACT_ADDRESS, or MESSAGE_HASH.');
    process.exit(1);
}

// Initialize L2 provider
const l2Provider = new ethers.JsonRpcProvider(`https://linea-sepolia.infura.io/v3/${INFURA_API_KEY}`);

async function fetchL2Logs() {
    try {
        console.log('Fetching logs for L2 contract...');

        const logs = await l2Provider.getLogs({
            address: L2_CONTRACT_ADDRESS,
            topics: [
                ethers.id("MessageClaimed(bytes32)"), // Event signature for MessageClaimed
                MESSAGE_HASH,                         // Indexed parameter (message hash)
            ],
            fromBlock: 0,
            toBlock: "latest",
        });

        if (logs.length === 0) {
            console.log("No matching logs found on L2.");
        } else {
            console.log(`Fetched ${logs.length} logs on L2:`);
            logs.forEach((log, index) => {
                console.log(`Log ${index + 1}:`, log);
            });
        }
    } catch (error) {
        console.error('Error fetching logs on L2:', error);
    }
}

fetchL2Logs();