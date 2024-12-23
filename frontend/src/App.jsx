import React from "react";
import "./App.css";
import { useAccount, useBalance } from "wagmi";
import ConnectButton from "./ConnectButton";

function App() {
  const { address, isConnected } = useAccount(); // Get connected wallet address and state
  const { data: balanceData } = useBalance({ address }); // Fetch wallet balance

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Welcome to ETH-Linea Bridge</h1>
      </header>
      <main className="app-main">
        <div className="card">
          {/* Show connect/disconnect button */}
          <ConnectButton key={isConnected ? "connected" : "disconnected"} />

          {/* Show wallet details when connected */}
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
              <p className="instructions">
                Ready to bridge? Stay connected and follow the next steps below.
              </p>
            </div>
          )}

          {/* Message when wallet is not connected */}
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