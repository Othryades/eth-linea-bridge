require("@nomicfoundation/hardhat-toolbox");
// require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

const { PRIVATE_KEY, INFURA_API_KEY, LINEASCAN_API_KEY, ETHERSCAN_API_KEY } = process.env;

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "london", // Force London EVM
    },
  },
  networks: {
    linea_mainnet: {
      url: `https://linea-mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    linea_testnet: { // Add this
      url: `https://linea-sepolia.infura.io/v3/${INFURA_API_KEY}`,
      chainId: 59141,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: {
      linea_testnet: LINEASCAN_API_KEY,
      linea_mainnet: LINEASCAN_API_KEY,
      mainnet: ETHERSCAN_API_KEY,
      sepolia: ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "linea_mainnet",
        chainId: 59144,
        urls: {
          apiURL: "https://api.lineascan.build/api",
          browserURL: "https://lineascan.build/",
        },
      },
      {
        network: "linea_testnet",
        chainId: 59141,
        urls: {
          apiURL: "https://api-sepolia.lineascan.build/api", // Corrected API URL
          browserURL: "https://testnet.lineascan.build/",
        },
      },
    ],
  },
};