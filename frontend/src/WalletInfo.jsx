import React from 'react';
import { useAccount, useBalance } from 'wagmi';

function WalletInfo() {
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading } = useBalance({
    address,
  });

  if (!isConnected) {
    return <p>Please connect your wallet.</p>;
  }

  return (
    <div style={{ marginTop: '20px' }}>

    </div>
  );
}

export default WalletInfo;