import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { http } from 'wagmi';
import { botChainMainnet, WALLETCONNECT_PROJECT_ID } from './chain';

export const projectId = WALLETCONNECT_PROJECT_ID;

// Define metadata for AppKit modal
const metadata = {
  name: 'GasDiary',
  description: 'Gas fee tracking and on-chain expense annotation dApp for BOT Chain',
  url: 'https://scan.botchain.ai',
  icons: ['/twitter-profile-avatar.png'],
};

// Networks array (BOT Chain Mainnet)
export const networks = [botChainMainnet] as const;

// Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [botChainMainnet],
  transports: {
    [botChainMainnet.id]: http('https://rpc.botchain.ai'),
  },
});

export const config = wagmiAdapter.wagmiConfig;

// Initialize Reown AppKit
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [botChainMainnet],
  defaultNetwork: botChainMainnet,
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
