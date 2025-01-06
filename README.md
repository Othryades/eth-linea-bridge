ETH–Linea Bridge DApp

This repository contains a decentralized application (DApp) that enables transferring ETH from Ethereum (or another source chain) to the Linea network using a custom proxy contract and the Linea canonical messaging service. By leveraging Linea’s faster settlement and lower fees, users can enjoy a more efficient bridging process.

Key Components
	1.	Custom Proxy Contract
	•	Purpose: Allows upgradeable, maintainable bridging logic without changing user-facing addresses.
	•	Why We Use It: Simplifies contract upgrades and future expansions (e.g., adding more tokens or new governance rules).
	2.	Linea Canonical Messaging Service
	•	Role: Provides a secure, standardized communication channel for cross-chain messages.
	•	Benefit: Ensures reliable message validation between Ethereum and the Linea network, enhancing security and consistency.

How It Works (High-Level)
	1.	User deposits ETH on Ethereum (or another source chain).
	2.	The Bridge Proxy locks or escrows ETH, then emits an event via the canonical messaging service.
   3.	Once validated on Linea, ETH (or its wrapped equivalent) is released or minted on the Linea side.
	4.	Withdrawals operate in reverse, triggering a burn/unlock on Linea and releasing ETH on Ethereum.

Setup & Installation
	1.	Clone the Repo

   2.	Install Dependencies
   npm install
   3.	Configure Environment
	•	Create or edit a .env file with relevant keys:
	•	INFURA_API_KEY (or another RPC provider)
	•	Contract addresses for the Bridge Proxy and Linea messaging service
	•	Your deployer/admin wallet PRIVATE_KEY (if applicable)
	4.	Run the DApp
   npm run dev

   Access the UI at http://localhost:3000.

Usage
	1.	Connect Wallet (e.g., MetaMask).
	2.	Deposit ETH: Specify an amount, submit the transaction to the Bridge Proxy.
	3.	Wait for Confirmation: The canonical messaging service relays deposit info to Linea; ETH is minted or released on Linea.
	4.	Withdraw/Claim: (If supported) Reverses the flow, burning or unlocking tokens on Linea, then returning ETH on Ethereum.

Development & Testing
	•	Hardhat Commands
	•	npx hardhat help
	•	npx hardhat test (run contract tests)
	•	npx hardhat node (spin up a local node)
	•	npx hardhat run scripts/deploy.js --network <network> (example deploy script)
	•	Upgrades
	•	If using an upgradeable proxy approach, run your custom upgrade scripts (e.g., upgradeProxy.js) to point the proxy at a new implementation contract without changing the proxy address.

License

This project is released under the MIT License. Feel free to modify and distribute under these terms.

For questions or issues, please open a GitHub Issue in this repository. We welcome contributions!