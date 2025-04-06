import React, { useState, useEffect } from "react";
import "./App.css";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import ConnectButton from "./ConnectButton";
import { ethers } from "ethers";
import WalletInfo from "./WalletInfo";
import MessageStatus from "./MessageStatus";

function App() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const [formattedBalance, setFormattedBalance] = useState("Not available");
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  // Function to get balance directly using ethers
  const getBalance = async () => {
    if (!address || !window.ethereum) return;
    
    try {
      setIsBalanceLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(address);
      const ethBalance = ethers.utils.formatEther(balance);
      setFormattedBalance(`${parseFloat(ethBalance).toFixed(4)} ETH`);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setFormattedBalance("Error");
    } finally {
      setIsBalanceLoading(false);
    }
  };

  // Update balance when address or chainId changes
  useEffect(() => {
    if (isConnected && address) {
      getBalance();
    } else {
      setFormattedBalance("Not available");
    }
  }, [address, chainId, isConnected]);

  // Switch to appropriate tab based on network
  useEffect(() => {
    if (chainId === 59141) { // Linea Sepolia
      setActiveTab('withdraw');
    } else if (chainId === 11155111) { // Sepolia
      setActiveTab('deposit');
    }
  }, [chainId]);

  // Handle network switch with error handling
  const handleNetworkSwitch = async (targetChainId) => {
    try {
      if (isSwitchingChain) return; // Prevent multiple simultaneous attempts
      
      const currentChainId = chainId;
      if (currentChainId === targetChainId) return; // Already on the target chain
      
      // Switch chain
      await switchChain({ chainId: targetChainId });
      
      // After successful chain switch
      getBalance();
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  // Log for debugging
  console.log("ChainId:", chainId);
  console.log("Address:", address);

  const [depositAmount, setDepositAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("success"); // "success" or "error"
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [activeTab, setActiveTab] = useState("deposit"); // "deposit", "withdraw", "status", or "history"

  // State for transaction history
  const [transactionHistory, setTransactionHistory] = useState([]);
  
  // Load transaction history from localStorage when component mounts
  useEffect(() => {
    if (isConnected && address) {
      const storedHistory = localStorage.getItem(`txHistory_${address}`);
      if (storedHistory) {
        try {
          setTransactionHistory(JSON.parse(storedHistory));
        } catch (error) {
          console.error("Error parsing transaction history:", error);
        }
      }
    }
  }, [address, isConnected]);
  
  // Save transaction to history
  const saveTransaction = (transaction) => {
    if (!isConnected || !address) return;
    
    const newHistory = [transaction, ...transactionHistory];
    setTransactionHistory(newHistory);
    localStorage.setItem(`txHistory_${address}`, JSON.stringify(newHistory));
  };

  // Handle ETH deposit
  const handleDeposit = async () => {
    if (!isConnected) {
      setFeedback("Please connect your wallet first");
      setFeedbackType("error");
      return;
    }
    
    try {
      if (!depositAmount || isNaN(depositAmount)) {
        setFeedback("Invalid deposit amount.");
        setFeedbackType("error");
        return;
      }
      if (!ethers.utils.isAddress(recipient)) {
        setFeedback("Invalid recipient address.");
        setFeedbackType("error");
        return;
      }
      setLoading(true);
      setFeedback("");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x014bB8655Ec464b26230Bd53cf002477E7C2a99d", 
        [
          "function deposit(address recipient) public payable",
          "function withdraw(uint256 amount) public",
        ],
        signer
      );
      const tx = await contract.deposit(recipient, {
        value: ethers.utils.parseEther(depositAmount),
      });
      await tx.wait();
      
      // Save transaction to history
      const timestamp = new Date().toISOString();
      saveTransaction({
        type: 'deposit',
        from: 'Sepolia',
        to: 'Linea Sepolia',
        amount: depositAmount,
        recipient: recipient,
        txHash: tx.hash,
        timestamp: timestamp,
        status: 'completed'
      });
      
      setFeedback(`Deposit of ${depositAmount} ETH to ${recipient} successful!`);
      setFeedbackType("success");
      setDepositAmount("");
      setRecipient("");
      setTxHash(tx.hash); // Set tx hash for status checking
      setActiveTab("status"); // Switch to status tab
    } catch (error) {
      console.error("Error during deposit:", error);
      setFeedback(`Deposit failed: ${error.message || "Unknown error"}`);
      setFeedbackType("error");
    } finally {
      setLoading(false);
    }
  };

  // Handle ETH withdrawal
  const handleWithdraw = async () => {
    if (!isConnected) {
      setFeedback("Please connect your wallet first");
      setFeedbackType("error");
      return;
    }
    
    try {
      if (!withdrawAmount || isNaN(withdrawAmount)) {
        setFeedback("Invalid withdrawal amount.");
        setFeedbackType("error");
        return;
      }
      setLoading(true);
      setFeedback("");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x014bB8655Ec464b26230Bd53cf002477E7C2a99d", 
        [
          "function deposit(address recipient) public payable",
          "function withdraw(uint256 amount) public",
        ],
        signer
      );
      const tx = await contract.withdraw(
        ethers.utils.parseEther(withdrawAmount)
      );
      await tx.wait();
      
      // Save transaction to history
      const timestamp = new Date().toISOString();
      saveTransaction({
        type: 'withdraw',
        from: 'Linea Sepolia',
        to: 'Sepolia',
        amount: withdrawAmount,
        recipient: address,
        txHash: tx.hash,
        timestamp: timestamp,
        status: 'completed'
      });
      
      setFeedback(`Withdrawal of ${withdrawAmount} ETH successful!`);
      setFeedbackType("success");
      setWithdrawAmount("");
    } catch (error) {
      console.error(error);
      setFeedback("Withdrawal failed. Check the console for more details.");
      setFeedbackType("error");
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Truncate address or hash
  const truncate = (str, start = 6, end = 4) => {
    if (!str) return '';
    return `${str.slice(0, start)}...${str.slice(-end)}`;
  };

  return (
    <div className="app">
      <div className="app-content">
        <header className="app-header">
          <div className="header-container">
            <div className="eth-logo">
              <img src="/eth.svg" alt="ETH" />
              <img src="/linea2.png" alt="Linea" />
            </div>
            <div className="title-container">
              <h1 className="app-title">WormGate</h1>
              <h2 className="app-subtitle">Ethereum
                <svg width="24" height="24" viewBox="0 0 24 24" style={{
                  verticalAlign: 'middle', 
                  margin: '0 8px',
                  filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.3))'
                }}>
                  <path d="M4 12h16M4 12l4 4M4 12l4-4M20 12l-4 4M20 12l-4-4" 
                    stroke="url(#arrow-gradient)" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="arrow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg> 
                Linea Bridge
              </h2>
            </div>
          </div>
          <p className="app-description">Transfer your assets securely between Ethereum and Linea networks. 100% free, 100% Decentralized.</p>
        </header>
        <main className="app-main">
          <div className="card">
            <ConnectButton />

            <div className="wallet-details">
              {isConnected && address ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ 
                      width: '10px', 
                      height: '10px', 
                      backgroundColor: 'var(--success)', 
                      borderRadius: '50%' 
                    }}></div>
                    <p>
                      <strong>Connected:</strong> {address.slice(0, 6)}...{address.slice(-4)}
                    </p>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem'
                  }}>
                    <p>
                      <strong>Balance:</strong>{" "}
                      {formattedBalance}
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                  <p>Please connect your wallet to use the bridge</p>
                </div>
              )}
              
              {isConnected && (
                <div style={{ 
                  marginBottom: '1.5rem', 
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.5rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(30, 33, 45, 0.5)'
                }}>
                  {/* Sepolia */}
                  <div 
                    onClick={() => chainId !== 11155111 && handleNetworkSwitch(11155111)} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: chainId === 11155111 ? 'var(--primary)' : 'rgba(40, 43, 55, 0.6)',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ 
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#6e78ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 256 417" 
                        xmlns="http://www.w3.org/2000/svg" 
                        preserveAspectRatio="xMidYMid"
                        style={{
                          display: 'block',
                          transform: 'none',
                          margin: 0,
                          padding: 0
                        }}
                      >
                        <path fill="#fff" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"/>
                        <path fill="#fff" d="M127.962 0L0 212.32l127.962 75.639V154.158z"/>
                        <path fill="#fff" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"/>
                        <path fill="#fff" d="M127.962 416.905v-104.72L0 236.585z"/>
                      </svg>
                    </div>
                    <span style={{ 
                      fontWeight: '600', 
                      fontSize: '0.9rem',
                      color: chainId === 11155111 ? 'white' : 'var(--text)'
                    }}>Sepolia</span>
                  </div>

                  {/* Arrow */}
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    style={{ transform: chainId === 59141 ? 'rotate(180deg)' : 'none' }}
                  >
                    <path d="M13 6L19 12L13 18" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 12H5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>

                  {/* Linea Sepolia */}
                  <div 
                    onClick={() => chainId !== 59141 && handleNetworkSwitch(59141)} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: chainId === 59141 ? 'var(--primary)' : 'rgba(55, 40, 48, 0.6)',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ 
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#59c2ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src="/linea-sepolia.svg" 
                        alt="Linea Sepolia" 
                        width="24" 
                        height="24" 
                        style={{
                          display: 'block',
                          transform: 'none',
                          margin: 0,
                          padding: 0
                        }}
                      />
                    </div>
                    <span style={{ 
                      fontWeight: '600', 
                      fontSize: '0.9rem',
                      color: chainId === 59141 ? 'white' : 'var(--text)'
                    }}>Linea Sepolia</span>
                  </div>
                </div>
              )}
              
              <WalletInfo />

              {/* Tab Navigation - Always shown */}
              <div style={{ display: 'flex', margin: '1.5rem 0 1rem', borderBottom: '1px solid var(--border)' }}>
                <button 
                  style={{ 
                    flex: 1, 
                    background: 'transparent', 
                    border: 'none', 
                    padding: '0.75rem', 
                    borderBottom: activeTab === 'deposit' ? '2px solid #6119ef' : 'none',
                    color: activeTab === 'deposit' ? 'var(--text)' : 'var(--text-secondary)',
                    fontWeight: activeTab === 'deposit' ? '600' : '400'
                  }}
                  onClick={() => setActiveTab('deposit')}
                >
                  Deposit
                </button>
                <button 
                  style={{ 
                    flex: 1, 
                    background: 'transparent', 
                    border: 'none', 
                    padding: '0.75rem', 
                    borderBottom: activeTab === 'withdraw' ? '2px solid #6119ef' : 'none',
                    color: activeTab === 'withdraw' ? 'var(--text)' : 'var(--text-secondary)',
                    fontWeight: activeTab === 'withdraw' ? '600' : '400'
                  }}
                  onClick={() => setActiveTab('withdraw')}
                >
                  Withdraw
                </button>
                <button 
                  style={{ 
                    flex: 1, 
                    background: 'transparent', 
                    border: 'none', 
                    padding: '0.75rem', 
                    borderBottom: activeTab === 'status' ? '2px solid #6119ef' : 'none',
                    color: activeTab === 'status' ? 'var(--text)' : 'var(--text-secondary)',
                    fontWeight: activeTab === 'status' ? '600' : '400'
                  }}
                  onClick={() => setActiveTab('status')}
                >
                  Status
                </button>
                <button 
                  style={{ 
                    flex: 1, 
                    background: 'transparent', 
                    border: 'none', 
                    padding: '0.75rem', 
                    borderBottom: activeTab === 'history' ? '2px solid #6119ef' : 'none',
                    color: activeTab === 'history' ? 'var(--text)' : 'var(--text-secondary)',
                    fontWeight: activeTab === 'history' ? '600' : '400'
                  }}
                  onClick={() => setActiveTab('history')}
                >
                  History
                </button>
              </div>

              {/* Deposit Section - Shown when deposit tab is active */}
              {activeTab === 'deposit' && (
                <div className="bridge-actions">
                  <h3 className="section-title">Bridge ETH to Linea</h3>
                  <div className="input-container">
                    <input
                      type="text"
                      placeholder="Amount in ETH"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="eth-input"
                    />
                    <div className="token-display">
                      <div className="token-icon">
                        <img src="/eth2.svg" alt="ETH" />
                      </div>
                      <span className="token-name">ETH</span>
                    </div>
                  </div>
                  <div className="input-container">
                    <input
                      type="text"
                      placeholder="Recipient Address (Default: Your Address)"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="address-input"
                    />
                  </div>
                  <button 
                    onClick={handleDeposit} 
                    disabled={!isConnected || loading || chainId === 59141} 
                    className="action-button gradient-button"
                  >
                    {loading ? "Processing..." : !isConnected ? "Connect Wallet" : chainId === 59141 ? "Switch to Sepolia to Deposit" : "Deposit ETH"}
                  </button>
                </div>
              )}

              {/* Withdraw Section - Always shown */}
              {activeTab === 'withdraw' && (
                <div className="bridge-actions">
                  <h3 className="section-title">Withdraw ETH to Ethereum</h3>
                  <div className="input-container">
                    <input
                      type="text"
                      placeholder="Amount in ETH"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="eth-input"
                    />
                    <div className="token-display">
                      <div className="token-icon">
                        <img src="/eth2.svg" alt="ETH" />
                        <div className="linea-icon">
                          <img src="/linea-sepolia.svg" alt="Linea" />
                        </div>
                      </div>
                      <span className="token-name">ETH</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleWithdraw} 
                    disabled={!isConnected || loading || chainId === 11155111} 
                    className="action-button gradient-button reverse"
                  >
                    {loading ? "Processing..." : !isConnected ? "Connect Wallet" : chainId === 11155111 ? "Switch to Linea to Withdraw" : "Withdraw ETH"}
                  </button>
                </div>
              )}

              {/* Transaction Hash Input for Message Status - Always shown */}
              {activeTab === 'status' && (
                <div className="bridge-actions">
                  <h3 className="section-title">Check Message Status</h3>
                  <div className="input-container">
                    <input
                      type="text"
                      placeholder="Enter L1 Transaction Hash"
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      className="address-input"
                    />
                  </div>
                  <div className="status-section">
                    <MessageStatus txHash={txHash} />
                  </div>
                </div>
              )}

              {/* Transaction History - New Section */}
              {activeTab === 'history' && (
                <div className="bridge-actions">
                  <h3 className="section-title">Transaction History</h3>
                  
                  {transactionHistory.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
                      <p>No transaction history found</p>
                      <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        Your bridge transactions will appear here
                      </p>
                    </div>
                  ) : (
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {transactionHistory.map((tx, index) => (
                        <div 
                          key={index} 
                          style={{ 
                            padding: '0.75rem',
                            borderBottom: index < transactionHistory.length - 1 ? '1px solid var(--border)' : 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <span style={{ 
                                padding: '0.25rem 0.5rem', 
                                backgroundColor: tx.type === 'deposit' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                color: tx.type === 'deposit' ? '#3b82f6' : '#10b981',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                textTransform: 'uppercase'
                              }}>
                                {tx.type}
                              </span>
                              <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', fontWeight: '500' }}>
                                {tx.amount} ETH
                              </span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              {formatDate(tx.timestamp)}
                            </div>
                          </div>
                          
                          <div style={{ fontSize: '0.85rem', display: 'flex', gap: '0.25rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>From:</span>
                            <span>{tx.from}</span>
                            <span style={{ margin: '0 0.25rem' }}>→</span>
                            <span style={{ color: 'var(--text-secondary)' }}>To:</span>
                            <span>{tx.to}</span>
                          </div>
                          
                          <div style={{ fontSize: '0.85rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Tx: </span>
                            <a 
                              href={`https://${tx.from === 'Sepolia' ? 'sepolia.' : ''}etherscan.io/tx/${tx.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--primary)', textDecoration: 'none' }}
                            >
                              {truncate(tx.txHash)}
                            </a>
                            <button 
                              onClick={() => {
                                setTxHash(tx.txHash);
                                setActiveTab('status');
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--primary)',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                padding: '0 0.5rem',
                                textDecoration: 'underline'
                              }}
                            >
                              Check Status
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {feedback && <p className={`feedback ${feedbackType === "error" ? "error" : ""}`}>{feedback}</p>}
            </div>
          </div>
        </main>
      </div>
      <footer className="app-footer">
        <p>
          Powered by <a href="https://www.linea.build" target="_blank" rel="noopener noreferrer">Linea Network</a> & Ethereum
          <a href="https://github.com/Othryades/eth-linea-bridge" target="_blank" rel="noopener noreferrer" className="github-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="github-icon">
              <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          </a>
          <a href="https://ipfs.tech" target="_blank" rel="noopener noreferrer" className="ipfs-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="currentColor" className="ipfs-icon">
              <path d="M255.928 109.521L129.307 185.825L255.928 262.133L382.549 185.825L255.928 109.521ZM93.618 165.088L93.618 317.349L220.238 393.658L220.238 241.396L93.618 165.088ZM291.616 241.393L291.616 393.658L418.237 317.349L418.237 165.088L291.616 241.393ZM22.464 127.42L22.464 384.718L84.446 422.63L84.446 165.333L22.464 127.42ZM427.41 165.333L427.41 422.63L489.391 384.718L489.391 127.42L427.41 165.333ZM255.928 21.208L93.281 116.256L129.307 137.337L255.928 61.03L382.549 137.337L418.576 116.256L255.928 21.208ZM220.238 442.998L93.281 366.578L57.251 387.659L255.928 498.388L454.604 387.657L418.576 366.576L291.616 442.998L291.616 298.088L255.928 318.909L220.238 298.088L220.238 442.998Z" />
            </svg>
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;