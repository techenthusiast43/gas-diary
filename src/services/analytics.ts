import type { SpendingStats, TransactionRecord } from '../types';

export function calculateSpendingStats(transactions: TransactionRecord[]): SpendingStats {
  if (!transactions || transactions.length === 0) {
    return {
      totalFeeBot: 0,
      totalTransactions: 0,
      avgFeeBot: 0,
      failedCount: 0,
      failedFeeBot: 0,
      highestFeeTx: null,
      categoryBreakdown: {},
      dailySpending: [],
    };
  }

  let totalFee = 0;
  let failedCount = 0;
  let failedFee = 0;
  let highestFeeTx: TransactionRecord | null = null;
  let highestFee = -1;

  const categoryMap: { [cat: string]: { count: number; feeBot: number } } = {};
  const dailyMap: { [date: string]: { feeBot: number; count: number } } = {};

  transactions.forEach((tx) => {
    const fee = parseFloat(tx.feeBot) || 0;
    totalFee += fee;

    if (tx.status === 'error') {
      failedCount++;
      failedFee += fee;
    }

    if (fee > highestFee) {
      highestFee = fee;
      highestFeeTx = tx;
    }

    // Category breakdown
    const cat = tx.category || 'Uncategorized';
    if (!categoryMap[cat]) {
      categoryMap[cat] = { count: 0, feeBot: 0 };
    }
    categoryMap[cat].count++;
    categoryMap[cat].feeBot += fee;

    // Daily breakdown
    const dateObj = new Date(tx.timestamp * 1000);
    const dateKey = dateObj.toISOString().slice(0, 10); // YYYY-MM-DD
    if (!dailyMap[dateKey]) {
      dailyMap[dateKey] = { feeBot: 0, count: 0 };
    }
    dailyMap[dateKey].feeBot += fee;
    dailyMap[dateKey].count++;
  });

  // Sort daily spending by date ascending
  const dailySpending = Object.entries(dailyMap)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, data]) => ({
      date,
      feeBot: Number(data.feeBot.toFixed(6)),
      count: data.count,
    }));

  return {
    totalFeeBot: Number(totalFee.toFixed(6)),
    totalTransactions: transactions.length,
    avgFeeBot: Number((totalFee / transactions.length).toFixed(6)),
    failedCount,
    failedFeeBot: Number(failedFee.toFixed(6)),
    highestFeeTx,
    categoryBreakdown: categoryMap,
    dailySpending,
  };
}
