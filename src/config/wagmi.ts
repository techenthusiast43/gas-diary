import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { http } from 'wagmi';
import { botChainTestnet, WALLETCONNECT_PROJECT_ID } from './chain';

export const projectId = WALLETCONNECT_PROJECT_ID;

// Define metadata for AppKit modal
const metadata = {
  name: 'GasDiary',
  description: 'Gas fee tracking and on-chain expense annotation dApp for BOT Chain',
  url: 'https://scan.bohr.life',
  icons: ['https://scan.bohr.life/static/homepage/sidebar-logo.svg'],
};

// Networks array
export const networks = [botChainTestnet] as const;

// Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [botChainTestnet],
  transports: {
    [botChainTestnet.id]: http('https://rpc.bohr.life'),
  },
});

export const config = wagmiAdapter.wagmiConfig;

// Initialize Reown AppKit
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [botChainTestnet],
  defaultNetwork: botChainTestnet,
  metadata,
  features: {
    analytics: true,
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#14DCAC',
    '--w3m-border-radius-master': '8px',
  },
});
