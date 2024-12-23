# ETH-Linea Bridge DApp

A decentralized application (DApp) for bridging ETH to the Linea network. The DApp allows users to connect their wallets, check balances, and interact with the deployed Bridge smart contract.

## Features

- **Wallet Connection**: Connect/disconnect using MetaMask.
- **Balance Display**: Displays wallet address and ETH balance.
- **Bridge Interaction**: Allows users to deposit ETH into the Bridge contract.

## Tech Stack

- **Frontend**: React with Vite
- **Blockchain Interaction**: Wagmi and Ethers.js
- **Smart Contracts**: Solidity (Bridge Contract deployed on Linea Mainnet)
- **Styling**: Basic CSS

## Prerequisites

- **Node.js**: v16 or higher
- **MetaMask**: Installed browser extension
- **Infura Project**: API key for accessing the Linea network

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:Othryades/eth-linea-bridge.git
   cd eth-linea-bridge


# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
