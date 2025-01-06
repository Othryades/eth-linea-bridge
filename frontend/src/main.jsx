import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiConfig } from 'wagmi';
import { config } from './wagmiConfig'; // Ensure this path matches your file structure
import App from './App.jsx';
import 'process/browser'; // Polyfill for process

ReactDOM.createRoot(document.getElementById('root')).render(
  <WagmiConfig client={config}>
    <App />
  </WagmiConfig>
);