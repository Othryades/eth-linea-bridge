import React from 'react';
import { useAccount, useBalance } from 'wagmi';

function WalletInfo() {
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading } = useBalance({
    address,
  });

  if (!isConnected) {
    return null; // Don't display any message, it's already shown in the parent component
  }

  return (
    <div style={{ marginTop: '20px' }}>

    </div>
  );
}

export default WalletInfo;