import { createConfig } from "wagmi";
import { defineChain, http } from "viem";
import { sepolia } from "viem/chains";

// Get Infura API key from environment or use a fallback
const INFURA_API_KEY = import.meta.env.VITE_INFURA_API_KEY || "9aa3d95b3bc440fa88ea12eaa4456161"; // fallback to public key

// Define Linea Sepolia chain
const lineaSepolia = defineChain({
  id: 59141,
  name: 'Linea Sepolia',
  network: 'linea-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [`https://linea-sepolia.infura.io/v3/${INFURA_API_KEY}`],
    },
    public: {
      http: [`https://linea-sepolia.infura.io/v3/${INFURA_API_KEY}`],
    },
  },
  blockExplorers: {
    default: {
      name: 'Lineascan',
      url: 'https://sepolia.lineascan.build',
    },
  },
  testnet: true,
});

// Override Sepolia RPC URL
const customSepolia = {
  ...sepolia,
  rpcUrls: {
    ...sepolia.rpcUrls,
    default: {
      http: [`https://sepolia.infura.io/v3/${INFURA_API_KEY}`],
    },
    public: {
      http: [`https://sepolia.infura.io/v3/${INFURA_API_KEY}`],
    },
  },
};

// Create Wagmi config for Testnet using v2 syntax
export const config = createConfig({
  chains: [customSepolia, lineaSepolia],
  transports: {
    [customSepolia.id]: http(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`),
    [lineaSepolia.id]: http(`https://linea-sepolia.infura.io/v3/${INFURA_API_KEY}`),
  },
  ssr: true,
});