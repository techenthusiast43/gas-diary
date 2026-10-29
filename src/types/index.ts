export interface TransactionRecord {
  hash: string;
  blockNumber: number;
  timestamp: number; // Unix timestamp in seconds
  from: string;
  to: string | null;
  value: string; // in BOT
  gasLimit: string;
  gasUsed: string;
  gasPriceGwei: string;
  feeBot: string; // total gas fee in BOT (e.g. 0.0021)
  status: 'ok' | 'error' | 'pending';
  methodName?: string;
  category?: string;
  note?: string;
  hasOnChainTag?: boolean;
}

export interface TagRecord {
  txHash: string;
  category: string;
  note: string;
  updatedAt: number;
  exists: boolean;
}

export interface SpendingStats {
  totalFeeBot: number;
  totalTransactions: number;
  avgFeeBot: number;
  failedCount: number;
  failedFeeBot: number;
  highestFeeTx: TransactionRecord | null;
  categoryBreakdown: { [category: string]: { count: number; feeBot: number } };
  dailySpending: { date: string; feeBot: number; count: number }[];
}

export const DEFAULT_CATEGORIES = [
  'DeFi Swap',
  'NFT Mint',
  'Token Transfer',
  'Contract Deployment',
  'Staking / Yield',
  'DAO Governance',
  'Approval / Revoke',
  'Bridge',
  'Other',
] as const;

export type ExpenseCategory = typeof DEFAULT_CATEGORIES[number] | string;
