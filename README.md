# ETH–Linea Bridge DApp

This repository contains a **decentralized application (DApp)** and an accompanying **L1Bridge** smart contract that allow users to **bridge ETH** from Ethereum (L1) to the **Linea** network (L2). Unlike a typical “proxy” pattern, this contract specifically **escrows user funds** and interacts with the **Linea canonical messaging service**, which handles cross-chain validation and finalization.

---

## Overview

1. **L1Bridge Contract**  
   - **Purpose**: Holds (escrows) the deposited ETH on L1 and sends cross-chain messages via the **Linea L1 Message Service**.  
   - **Key Functions**:  
     - `deposit(address recipient)`: Accepts ETH and calls the message service to relay bridging info to Linea.  
     - `withdraw(address payable recipient, uint256 amount)`: Releases ETH **only** if called by the trusted Linea message service, enabling reverse withdrawals from L2.  

2. **Linea Canonical Messaging Service**  
   - Operated by the **Linea** team for secure cross-chain communication.  
   - Receives a deposit event from `L1Bridge`, confirms it on L2, and may later call `withdraw` on L1 to release ETH back to a user.

By leveraging the official **Linea** messaging infrastructure, users can take advantage of **faster settlements and lower fees** on Linea, while the **L1Bridge** contract ensures secure handling of deposits and withdrawals on Ethereum.

---

## Bridging Flow (High-Level)

1. **Deposit**  
   - User calls `deposit(recipient)` on the **L1Bridge** contract and sends some ETH.  
   - The `L1Bridge` contract holds that ETH in its own balance.  
   - In the same transaction, `L1Bridge` calls `sendMessage` on the **Linea L1 Message Service**, instructing it to process a deposit for `recipient` on L2.

2. **Linea (L2) Receives Deposit**  
   - The **Linea** service detects the deposit info and mints or credits an equivalent amount of ETH (or wrapped ETH) to `recipient` on L2 (behind the scenes).  

3. **Withdraw (L2 -> L1)**  
   - When a user withdraws from L2, the **Linea** message service eventually calls `withdraw(recipient, amount)` on the **L1Bridge**—**only** the message service can do this.  
   - The `L1Bridge` verifies the caller is indeed the message service, then transfers the specified ETH back to the user’s address on L1.

---

## Setup & Installation

1. **Clone the Repo**  
   ```bash
   git clone git@github.com:Othryades/eth-linea-bridge.git
   cd eth-linea-bridge

2.	Install Dependencies
   ```bash
   npm install
   ```

3.	Configure Environment
	- Create or edit a .env file with relevant keys:
	- INFURA_API_KEY (or another RPC provider)
	- Contract addresses for the Bridge Proxy and Linea messaging service
	- Your deployer/admin wallet PRIVATE_KEY (if applicable)

4.	Run the DApp
   ```bash
   npm run dev
   ```

   Access at http://localhost:3000.

## Usage

1.	Connect Wallet (e.g., MetaMask).
2.	Deposit ETH: Specify an amount, submit the transaction to the Bridge Proxy.
3.	Wait for Confirmation: The canonical messaging service relays deposit info to Linea; ETH is minted or released on Linea.
4.	Withdraw/Claim: (If supported) Reverses the flow, burning or unlocking tokens on Linea, then returning ETH on Ethereum.

## Development & Testing
	
   - Hardhat Commands
	- npx hardhat help
	- npx hardhat test (run contract tests)
	- npx hardhat node (spin up a local node)
	- npx hardhat run scripts/deploy.js --network <network> (example deploy script)
	- Upgrades
	- If using an upgradeable proxy approach, run your custom upgrade scripts (e.g., upgradeProxy.js) to point the proxy at a new implementation contract without changing the proxy address.

## License

This project is released under the MIT License. Feel free to modify and distribute under these terms.

For questions or issues, please open a GitHub Issue in this repository. We welcome contributions!