import { configureChains, createClient } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

// Ensure you're using the correct API key for your testnet environment
const INFURA_API_KEY = import.meta.env.VITE_INFURA_API_KEY;

const lineaTestnet = {
  id: 59141, // Linea Testnet (Sepolia) chain ID
  name: "Linea Testnet",
  network: "linea",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: `https://linea-sepolia.infura.io/v3/${INFURA_API_KEY}`, // Correct RPC URL for Linea Testnet
  },
  blockExplorers: {
    default: { name: "Lineascan", url: "https://testnet.lineascan.build" },
  },
};

// Use jsonRpcProvider to ensure the RPC setup is compatible
const { chains, provider } = configureChains(
  [lineaTestnet], // Make sure it's using the Testnet configuration
  [
    jsonRpcProvider({
      rpc: (chain) =>
        chain.id === lineaTestnet.id
          ? { http: `https://linea-sepolia.infura.io/v3/${INFURA_API_KEY}` } // Correct Testnet RPC URL
          : null,
    }),
  ]
);

// Create Wagmi client for Testnet
export const config = createClient({
  autoConnect: true,
  provider,
});

export { chains };