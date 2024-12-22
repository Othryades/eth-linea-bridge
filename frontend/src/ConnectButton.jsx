import { useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

function ConnectButton() {
  const { connect } = useConnect();

  // Create the injected connector (e.g., MetaMask)
  const injectedConnector = new InjectedConnector();

  return (
    <button
      onClick={() => connect({ connector: injectedConnector })}
      style={{
        padding: "10px 20px",
        backgroundColor: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Connect Wallet
    </button>
  );
}

export default ConnectButton;