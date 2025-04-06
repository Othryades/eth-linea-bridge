import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './wagmiConfig';
import App from './App.jsx';
import 'process/browser'; // Polyfill for process

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <WagmiConfig config={config}>
      <App />
    </WagmiConfig>
  </QueryClientProvider>
);