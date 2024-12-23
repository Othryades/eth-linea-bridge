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
      <p><strong>Connected Wallet:</strong> {address}</p>
      {isLoading ? (
        <p>Fetching balance...</p>
      ) : (
        <p><strong>Balance:</strong> {balance?.formatted} {balance?.symbol}</p>
      )}
    </div>
  );
}

export default WalletInfo;