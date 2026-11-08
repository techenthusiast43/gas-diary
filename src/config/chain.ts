import { defineChain } from 'viem';

// BOT Chain Mainnet (Chain ID: 677)
export const botChainMainnet = defineChain({
  id: 677,
  name: 'BOT Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'BOT',
    symbol: 'BOT',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.botchain.ai'],
    },
    public: {
      http: ['https://rpc.botchain.ai'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BOT Chain Explorer',
      url: 'https://scan.botchain.ai',
      apiUrl: 'https://scan.botchain.ai/api/v2',
    },
  },
  testnet: false,
});

export const botChain = botChainMainnet;

// Deployed contract address on BOT Chain Mainnet
export const DEFAULT_GAS_DIARY_CONTRACT =
  (import.meta as any).env?.VITE_GAS_DIARY_CONTRACT || '0x5a04E7558461121941eC2A52a019D6F577437A6C';

export const WALLETCONNECT_PROJECT_ID =
  (import.meta as any).env?.VITE_REOWN_PROJECT_ID ||
  (import.meta as any).env?.VITE_WC_PROJECT_ID ||
  '39aa70f889eb69efc6ea7cd8c6488fff';
