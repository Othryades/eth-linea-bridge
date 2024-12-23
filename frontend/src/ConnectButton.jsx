import React from "react";
import { useConnect, useDisconnect, useAccount } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

function ConnectButton() {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();

  console.log("isConnected:", isConnected); // Debug connection status

  return (
    <div>
      {!isConnected ? (
        <button
          onClick={() => connect()}
          className="button"
        >
          Connect Wallet
        </button>
      ) : (
        <button
          onClick={() => disconnect()}
          className="button"
        >
          Disconnect Wallet
        </button>
      )}
    </div>
  );
}

export default ConnectButton;