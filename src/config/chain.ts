import { defineChain } from 'viem';

export const botChainTestnet = defineChain({
  id: 968,
  name: 'BOT Chain Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BOT',
    symbol: 'BOT',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.bohr.life'],
    },
    public: {
      http: ['https://rpc.bohr.life'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BOT Chain Explorer',
      url: 'https://scan.bohr.life',
      apiUrl: 'https://scan.bohr.life/api/v2',
    },
  },
  testnet: true,
});

// Default contract address (deployed to BOT Chain Testnet)
export const DEFAULT_GAS_DIARY_CONTRACT =
  (import.meta as any).env?.VITE_GAS_DIARY_CONTRACT || '0x83aCCf7f6C1484B62e53BFD114753FcD29f5Dc74';

export const WALLETCONNECT_PROJECT_ID =
  (import.meta as any).env?.VITE_REOWN_PROJECT_ID ||
  (import.meta as any).env?.VITE_WC_PROJECT_ID ||
  '591d75cdaaf5e1cb8acb305c35c9de92';
