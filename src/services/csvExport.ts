import type { TransactionRecord } from '../types';

export function exportTransactionsToCsv(
  transactions: TransactionRecord[],
  walletAddress: string
): void {
  if (!transactions.length) {
    alert('No transactions available to export.');
    return;
  }

  const headers = [
    'Date & Time (UTC)',
    'Tx Hash',
    'Block Number',
    'Status',
    'Method / Interaction',
    'Category',
    'Personal Note',
    'Value (BOT)',
    'Gas Used',
    'Gas Price (Gwei)',
    'Fee Paid (BOT)',
    'From',
    'To',
    'Explorer Link',
  ];

  const rows = transactions.map((tx) => {
    const dateStr = new Date(tx.timestamp * 1000).toISOString().replace('T', ' ').replace('Z', '');
    const explorerUrl = `https://scan.bohr.life/tx/${tx.hash}`;

    const cleanField = (val: string | number | null | undefined) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    return [
      cleanField(dateStr),
      cleanField(tx.hash),
      cleanField(tx.blockNumber),
      cleanField(tx.status === 'ok' ? 'Success' : 'Failed'),
      cleanField(tx.methodName || 'Transfer'),
      cleanField(tx.category || 'Uncategorized'),
      cleanField(tx.note || ''),
      cleanField(tx.value),
      cleanField(tx.gasUsed),
      cleanField(tx.gasPriceGwei),
      cleanField(tx.feeBot),
      cleanField(tx.from),
      cleanField(tx.to || 'Contract Creation'),
      cleanField(explorerUrl),
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const shortAddr = walletAddress ? `${walletAddress.slice(0, 6)}_${walletAddress.slice(-4)}` : 'wallet';
  const timestamp = new Date().toISOString().slice(0, 10);
  const fileName = `GasDiary_${shortAddr}_${timestamp}.csv`;

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
