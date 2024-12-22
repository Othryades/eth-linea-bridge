import { configureChains, createClient } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

// Define the Linea Mainnet chain
const lineaMainnet = {
  id: 59144, // Chain ID for Linea
  name: 'Linea Mainnet',
  network: 'linea',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://linea-mainnet.infura.io/v3/YOUR_INFURA_API_KEY'],
    },
  },
  blockExplorers: {
    default: { name: 'Lineascan', url: 'https://lineascan.build' },
  },
};

// Configure the chains and provider
const { chains, provider } = configureChains([lineaMainnet], [publicProvider()]);

// Create Wagmi client
export const config = createClient({
  autoConnect: true,
  provider,
});

export { chains };