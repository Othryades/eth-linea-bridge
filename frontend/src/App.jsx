import React, { useState } from "react";
import "./App.css";
import { useAccount, useBalance } from "wagmi";
import ConnectButton from "./ConnectButton";
import { ethers } from "ethers";

function App() {
  const { address, isConnected } = useAccount(); // Get connected wallet address and state
  const { data: balanceData } = useBalance({ address }); // Fetch wallet balance

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false); // Define loading state here

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
        "0x36B4e1792b4106F661965384Ca5Bca13C30eED79",
        [
          "function deposit() public payable",
          "function withdraw(uint256 amount) public",
        ],
        signer
      );

      const tx = await contract.deposit({
        value: ethers.utils.parseEther(depositAmount),
      });
      await tx.wait();

      setFeedback(`Deposit of ${depositAmount} ETH successful!`);
      setDepositAmount("");
    } catch (error) {
      console.error(error);
      setFeedback("Deposit failed. Check the console for more details.");
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
        "0x36B4e1792b4106F661965384Ca5Bca13C30eED79", // Your deployed Bridge contract address
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