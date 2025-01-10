# ETH–Linea Bridge DApp

A **decentralized application (DApp)** along with an L1 and L2 Bridge smart contracts that allow users to **bridge** (or **transfer**) **ETH** from Ethereum (L1) to the **Linea** network (L2). This contract specifically **escrows user funds** and interacts with the Linea canonical messaging service, which handles cross-chain validation and finalization.

---

## Overview

1. **L1Bridge Contract (on L1)**  
   - **Purpose**: Holds (escrows) the deposited ETH on L1 and sends cross-chain messages via the **Linea L1 Message Service**.  
   - **Key Functions**:  
     - `deposit(address recipient)`: Accepts ETH and calls the message service to relay bridging info to Linea.  
     - `withdraw(address payable recipient, uint256 amount)`: Releases ETH **only** if called by the trusted Linea message service, enabling reverse withdrawals from L2.  

2. **Bridge Contract (on Linea, L2)**  
   - **Purpose**: Receives and holds ETH on L2, logging deposits and enabling authorized withdrawals.  
   - **Key Functions**:  
      - `deposit(uint256 chainId)`: Accepts ETH on L2 and emits a `Deposit` event. (No immediate cross-chain call here; typically, an external service or off-chain logic uses this event to track bridging state.)  
      - `withdraw(address payable to, uint256 amount)`: Can only be called by the `messageService` (authorized from L1), releasing ETH on L2.  

3. **Linea Canonical Messaging Service**  
   - Operated by the **Linea** team for secure cross-chain communication.  
   - Receives a deposit event from `L1Bridge`, confirms it on L2, and may later call `withdraw` on L1 to release ETH back to a user.

By leveraging the official **Linea** messaging infrastructure, users can take advantage of **faster settlements and lower fees** on Linea, while the **L1Bridge** contract ensures secure handling of deposits and withdrawals on Ethereum.

---

## Bridging Flow (High-Level)

1. **L1 Deposit**  
   - User calls `deposit(recipient)` on `L1Bridge` (Ethereum) with some ETH.  
   - `L1Bridge` locks that ETH, emits a `Deposit` event on L1, and calls `sendMessage` on the Linea message service.  

2. **ETH Reflected on L2**  
   - The Linea service verifies the deposit and triggers logic on L2 (inside the official or custom bridging flow) to credit or mint the corresponding ETH for `recipient`.  
   - If you are using your own L2 `Bridge` contract for advanced logic, you might rely on an off-chain or on-chain mechanism to finalize the deposit.  

3. **L2 Deposit** (In Your L2 `Bridge` Contract)  
   - Alternatively, a user might deposit ETH directly on L2 by calling `deposit(uint256 chainId)` in your `Bridge` contract.  
   - This emits a `Deposit` event on L2, which an external service or bridging flow can reference for cross-chain operations.

4. **Withdraw (L2 -> L1)**  
   - A user on Linea decides to withdraw their L2 ETH.  
   - After the canonical service processes the request, it calls `withdraw(recipient, amount)` on `L1Bridge`—**only** the legitimate `messageService` can do this.  
   - `L1Bridge` then transfers the specified ETH back to the user’s address on Ethereum.  

5. **Withdraw on L2** (Using `Bridge.sol`)  
   - If there’s a scenario where funds need to be released on L2 (e.g., after bridging from another chain or from L1 back down to L2), your `Bridge` contract’s `withdraw(to, amount)` is similarly restricted to calls from the L2 `messageService` address.


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