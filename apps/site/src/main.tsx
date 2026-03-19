import React from 'react';
import ReactDOM from 'react-dom/client';
import { WalletConnectProvider } from '@btc-vision/walletconnect';
import { App } from './App';
import './styles.css';

const THEME_MODE_KEY = 'opbridge.site.themeMode.v1';
const root = document.documentElement;

try {
  const stored = window.localStorage.getItem(THEME_MODE_KEY);
  const mode = stored === 'light' || stored === 'dark'
    ? stored
    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  root.dataset.theme = mode;
} catch {
  root.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletConnectProvider theme="moto">
      <App />
    </WalletConnectProvider>
  </React.StrictMode>,
);
