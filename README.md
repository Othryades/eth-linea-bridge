# WormGate

A **decentralized application (DApp)** along with an L1 and L2 Bridge smart contracts that allow users to **bridge** (or **transfer**) **ETH** from Ethereum (L1) to the **Linea** network (L2). This contract specifically **escrows user funds** and interacts with the Linea canonical messaging service, which handles cross-chain validation and finalization. Hosted @ https://wormgate.netlify.app/.

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

### Ethereum Sepolia → Linea Sepolia
1. **Connect & Prepare**
   - Connect your wallet to Ethereum Sepolia network
   - Ensure you have enough ETH for transfer and gas fees
   - The app will automatically detect the correct network

2. **Initiate Bridge Transfer**
   - Enter the amount of ETH you want to bridge
   - Specify recipient address (defaults to your address)
   - Confirm the transaction in your wallet
   - Transaction will be processed on Ethereum Sepolia

3. **Track Progress**
   - Bridge transaction will be visible in the History tab
   - Status updates automatically as transfer progresses
   - Typical completion time: 5-10 minutes
   - ETH will appear in your Linea Sepolia wallet

### Linea Sepolia → Ethereum Sepolia
1. **Switch Network**
   - Switch your wallet to Linea Sepolia
   - App will prompt network switch if needed
   - Ensure you have enough ETH for gas

2. **Withdraw Process**
   - Enter the amount to bridge back
   - Confirm the transaction
   - Monitor status in the History tab
   - Typical completion time: 30-60 minutes

Note: All bridge operations use Linea's official messaging service for secure cross-chain transfers. Transaction times may vary based on network conditions.

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

1.	Connect Wallet (MetaMask).
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
