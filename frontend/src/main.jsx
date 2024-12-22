import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiConfig } from 'wagmi';
import { config } from './wagmiConfig'; // Ensure this path matches your file structure
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <WagmiConfig client={config}>
    <App />
  </WagmiConfig>
);