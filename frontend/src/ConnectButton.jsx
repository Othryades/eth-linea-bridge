import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
// The injected connector import might not even be needed if we use the connectors array

// Create a separate connecting button to completely replace the normal button
export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  // Get connectors array from the hook
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  // Function to handle connection, using the first available connector
  const handleConnect = () => {
    if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    } else {
      console.error("No connectors available");
    }
  };

  // Simple text-only connecting state
  if (!isConnected && isPending) {
    return (
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button 
          disabled={true}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontWeight: '500',
            cursor: 'default',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            transition: 'all 0.2s ease'
          }}
        >
          Connecting...
        </button>
      </div>
    );
  }

  // Normal non-connecting state
  return (
    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
      {!isConnected ? (
        <button 
          onClick={handleConnect}
          disabled={connectors.length === 0}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            transition: 'all 0.2s ease'
          }}
        >
          Connect Wallet
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M17 12C17 10.3431 15.6569 9 14 9C12.3431 9 11 10.3431 11 12C11 13.6569 12.3431 15 14 15C15.6569 15 17 13.6569 17 12Z" fill="currentColor"/>
          </svg>
        </button>
      ) : (
        <button
          onClick={() => disconnect()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            transition: 'all 0.2s ease'
          }}
        >
          Disconnect
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}