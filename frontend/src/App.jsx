import React, { useState } from "react";
import "./App.css";
import { useAccount, useBalance } from "wagmi";
import ConnectButton from "./ConnectButton";
import { ethers } from "ethers";
import WalletInfo from "./WalletInfo";  // Re-import WalletInfo
import MessageStatus from "./MessageStatus";  // Ensure MessageStatus is used

function App() {
  const { address, isConnected } = useAccount(); // Get connected wallet address and state
  const { data: balanceData } = useBalance({ address }); // Fetch wallet balance

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false); // Define loading state here
  const [txHash, setTxHash] = useState(""); // State for handling the L1 txHash input

  // Handle ETH deposit
  const handleDeposit = async () => {
    try {
      if (!depositAmount || isNaN(depositAmount)) {
        setFeedback("Invalid deposit amount.");
        return;
      }
  
      setLoading(true); // Start loading
      setFeedback(""); // Clear feedback message
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x014bB8655Ec464b26230Bd53cf002477E7C2a99d", // Your deployed contract address
        [
          "function deposit(address recipient) public payable", // Updated deposit function signature
          "function withdraw(uint256 amount) public",
        ],
        signer
      );
  
      // Make sure to provide a recipient address along with the deposit
      const recipientAddress = "0xdC97b9eA6CD77eeF8A803AE09152B782A327C6a8"; // Specify the recipient address
  
      // Now, send the actual transaction with the deposit amount
      const tx = await contract.deposit(recipientAddress, {
        value: ethers.utils.parseEther(depositAmount),
        gasLimit: 400000,  // Arbitrarily high to ensure no gas limit issues
        gasPrice: ethers.utils.parseUnits("12", "gwei"),  // Adjust gas price if needed
      });
      await tx.wait();
  
      setFeedback(`Deposit of ${depositAmount} ETH successful!`);
      setDepositAmount("");
    } catch (error) {
      console.error("Error during deposit:", error);
      setFeedback(`Deposit failed: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false); // End loading
    }
  };


  // Handle ETH withdrawal
  const handleWithdraw = async () => {
    try {
      if (!withdrawAmount || isNaN(withdrawAmount)) {
        setFeedback("Invalid withdrawal amount.");
        return;
      }

      setLoading(true); // Start loading
      setFeedback(""); // Clear feedback message

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x014bB8655Ec464b26230Bd53cf002477E7C2a99d", // Your deployed Bridge contract address
        [
          "function deposit() public payable",
          "function withdraw(uint256 amount) public",
        ],
        signer
      );

      const tx = await contract.withdraw(
        ethers.utils.parseEther(withdrawAmount)
      );
      await tx.wait();

      setFeedback(`Withdrawal of ${withdrawAmount} ETH successful!`);
      setWithdrawAmount("");
    } catch (error) {
      console.error(error);
      setFeedback("Withdrawal failed. Check the console for more details.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Welcome to ETH&lt;&gt;Linea Bridge</h1>
      </header>
      <main className="app-main">
        <div className="card">
          <ConnectButton key={isConnected ? "connected" : "disconnected"} />

          {isConnected && (
            <div className="wallet-details">
              <p>
                <strong>Connected Wallet:</strong> {address}
              </p>
              <p>
                <strong>Balance:</strong>{" "}
                {balanceData
                  ? `${balanceData.formatted} ${balanceData.symbol}`
                  : "Loading..."}
              </p>

              {/* WalletInfo component usage */}
              <WalletInfo />

              {/* Deposit Section */}
              <div className="bridge-actions">
                <h2>Deposit ETH for Bridging</h2>
                <input
                  type="text"
                  placeholder="Amount in ETH"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
                <button onClick={handleDeposit} disabled={loading}>
                  {loading ? "Processing..." : "Deposit ETH"}
                </button>
              </div>

              {/* Withdraw Section */}
              <div className="bridge-actions">
                <h2>Withdraw ETH</h2>
                <input
                  type="text"
                  placeholder="Amount in ETH"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <button onClick={handleWithdraw} disabled={loading}>
                  {loading ? "Processing..." : "Withdraw ETH"}
                </button>
              </div>

              {/* Transaction Hash Input for Message Status */}
              <div className="bridge-actions">
                <h2>Check Message Status</h2>
                <input
                  type="text"
                  placeholder="Enter L1 Transaction Hash"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                />
                <MessageStatus txHash={txHash} /> {/* Display message status */}
              </div>

              {feedback && <p className="feedback">{feedback}</p>}
            </div>
          )}

          {!isConnected && (
            <p className="instructions">
              Please connect your wallet to start bridging your ETH.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;