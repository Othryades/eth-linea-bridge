import { configureChains, createClient } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const INFURA_API_KEY = import.meta.env.VITE_INFURA_API_KEY;

const lineaMainnet = {
  id: 59144,
  name: "Linea Mainnet",
  network: "linea",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: `https://linea-mainnet.infura.io/v3/${INFURA_API_KEY}`,
  },
  blockExplorers: {
    default: { name: "Lineascan", url: "https://lineascan.build" },
  },
};

// Use jsonRpcProvider to ensure the RPC setup is compatible
const { chains, provider } = configureChains(
  [lineaMainnet],
  [
    jsonRpcProvider({
      rpc: (chain) =>
        chain.id === lineaMainnet.id
          ? { http: `https://linea-mainnet.infura.io/v3/${INFURA_API_KEY}` }
          : null,
    }),
  ]
);

// Create Wagmi client
export const config = createClient({
  autoConnect: true,
  provider,
});

export { chains };