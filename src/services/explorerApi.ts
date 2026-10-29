import type { TransactionRecord } from '../types';

export const SAMPLE_TRANSACTIONS: TransactionRecord[] = [
  {
    hash: '0x9a8f4c2b3e1d7a5e8c9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d',
    blockNumber: 28552100,
    timestamp: Math.floor(Date.now() / 1000) - 3600 * 2, // 2 hours ago
    from: '0x71C...9A2F',
    to: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    value: '2.5000',
    gasLimit: '250000',
    gasUsed: '142380',
    gasPriceGwei: '25.0',
    feeBot: '0.003560',
    status: 'ok',
    methodName: 'swapExactTokensForETH',
    category: 'DeFi Swap',
    note: 'Swapped BOT on Bohrdex',
    hasOnChainTag: true,
  },
  {
    hash: '0x7b3e1d7a5e8c9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d9a8f4c',
    blockNumber: 28551402,
    timestamp: Math.floor(Date.now() / 1000) - 3600 * 8, // 8 hours ago
    from: '0x71C...9A2F',
    to: '0xD5452816194a3784dBa983426cCe7c122F4abd30',
    value: '10.0000',
    gasLimit: '60000',
    gasUsed: '21000',
    gasPriceGwei: '22.5',
    feeBot: '0.000473',
    status: 'ok',
    methodName: 'transfer',
    category: 'Token Transfer',
    note: 'Transferred BOT to secondary wallet',
    hasOnChainTag: true,
  },
  {
    hash: '0x4c5d6e7f8a9b0c1d9a8f4c2b3e1d7a5e8c9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b',
    blockNumber: 28550119,
    timestamp: Math.floor(Date.now() / 1000) - 3600 * 18, // 18 hours ago
    from: '0x71C...9A2F',
    to: '0x889a71C...3B91',
    value: '0.0000',
    gasLimit: '300000',
    gasUsed: '289410',
    gasPriceGwei: '30.0',
    feeBot: '0.008682',
    status: 'error',
    methodName: 'mintGenesisPass',
    category: 'NFT Mint',
    note: 'Out of gas error on Genesis Pass mint',
    hasOnChainTag: true,
  },
  {
    hash: '0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d9a8f4c2b3e1d7a5e8c9f0a',
    blockNumber: 28548900,
    timestamp: Math.floor(Date.now() / 1000) - 3600 * 28, // yesterday
    from: '0x71C...9A2F',
    to: '0x3344556677889900aabbccddeeff001122334455',
    value: '50.0000',
    gasLimit: '180000',
    gasUsed: '115400',
    gasPriceGwei: '21.0',
    feeBot: '0.002423',
    status: 'ok',
    methodName: 'stake',
    category: 'Staking / Yield',
    note: 'Staked into validator pool #4',
    hasOnChainTag: false,
  },
  {
    hash: '0x3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d9a8f4c2b3e1d7a5e8c9f0a1b2c',
    blockNumber: 28545120,
    timestamp: Math.floor(Date.now() / 1000) - 3600 * 48, // 2 days ago
    from: '0x71C...9A2F',
    to: null, // Contract deployment
    value: '0.0000',
    gasLimit: '1200000',
    gasUsed: '845200',
    gasPriceGwei: '24.0',
    feeBot: '0.020285',
    status: 'ok',
    methodName: 'deployContract',
    category: 'Contract Deployment',
    note: 'Deployed GasDiary test contract',
    hasOnChainTag: true,
  },
  {
    hash: '0x5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d9a8f4c2b3e1d7a5e8c9f0a1b2c3d4e',
    blockNumber: 28542000,
    timestamp: Math.floor(Date.now() / 1000) - 3600 * 65, // ~3 days ago
    from: '0x71C...9A2F',
    to: '0x0000000000000000000000000000000000001004',
    value: '0.0000',
    gasLimit: '90000',
    gasUsed: '45000',
    gasPriceGwei: '20.0',
    feeBot: '0.000900',
    status: 'ok',
    methodName: 'approve',
    category: 'Approval / Revoke',
    note: 'Approved Router for USDT trading',
    hasOnChainTag: false,
  },
  {
    hash: '0x8c9d0e1f2a3b4c5d6e7f8a9b0c1d9a8f4c2b3e1d7a5e8c9f0a1b2c3d4e5f6a7b',
    blockNumber: 28539010,
    timestamp: Math.floor(Date.now() / 1000) - 3600 * 92, // ~4 days ago
    from: '0x71C...9A2F',
    to: '0xDef1C0ded9bec7F1a1670819833240f027b25EfF',
    value: '1.2000',
    gasLimit: '220000',
    gasUsed: '198400',
    gasPriceGwei: '28.0',
    feeBot: '0.005555',
    status: 'error',
    methodName: 'swap',
    category: 'DeFi Swap',
    note: 'Slippage exceeded on dex trade',
    hasOnChainTag: true,
  },
  {
    hash: '0x0e1f2a3b4c5d6e7f8a9b0c1d9a8f4c2b3e1d7a5e8c9f0a1b2c3d4e5f6a7b8c9d',
    blockNumber: 28535040,
    timestamp: Math.floor(Date.now() / 1000) - 3600 * 120, // 5 days ago
    from: '0x71C...9A2F',
    to: '0x99887766554433221100ffeeddccbbaa99887766',
    value: '0.0000',
    gasLimit: '100000',
    gasUsed: '68200',
    gasPriceGwei: '20.0',
    feeBot: '0.001364',
    status: 'ok',
    methodName: 'castVote',
    category: 'DAO Governance',
    note: 'Voted YES on Proposal #12',
    hasOnChainTag: false,
  },
];

/**
 * Fetch transaction history for an address from BOT Chain Blockscout API v2
 */
export async function fetchAddressTransactions(
  address: string
): Promise<{ transactions: TransactionRecord[]; isSample: boolean }> {
  try {
    const url = `https://scan.bohr.life/api/v2/addresses/${address}/transactions`;
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`Blockscout API returned ${response.status}, using sample dataset`);
      return { transactions: SAMPLE_TRANSACTIONS, isSample: true };
    }

    const data = await response.json();
    const items = data.items || [];

    if (items.length === 0) {
      return { transactions: SAMPLE_TRANSACTIONS, isSample: true };
    }

    const parsed: TransactionRecord[] = items.map((item: any) => {
      // Fee parsing: Blockscout provides fee.value in wei
      const feeWei = item.fee?.value ? BigInt(item.fee.value) : 0n;
      const gasUsedBig = item.gas_used ? BigInt(item.gas_used) : 0n;
      const gasPriceWei = item.gas_price ? BigInt(item.gas_price) : 0n;

      let feeBot = '0.000000';
      if (feeWei > 0n) {
        feeBot = (Number(feeWei) / 1e18).toFixed(6);
      } else if (gasUsedBig > 0n && gasPriceWei > 0n) {
        const computed = (Number(gasUsedBig * gasPriceWei) / 1e18).toFixed(6);
        feeBot = computed;
      }

      const gasPriceGwei = gasPriceWei > 0n ? (Number(gasPriceWei) / 1e9).toFixed(2) : '0';

      const method = item.method || item.decoded_input?.method_call || (item.to ? 'transfer' : 'deploy');
      let defaultCategory = 'Other';
      const lowerMethod = method.toLowerCase();
      if (lowerMethod.includes('swap')) defaultCategory = 'DeFi Swap';
      else if (lowerMethod.includes('mint')) defaultCategory = 'NFT Mint';
      else if (lowerMethod.includes('transfer')) defaultCategory = 'Token Transfer';
      else if (lowerMethod.includes('stake') || lowerMethod.includes('deposit')) defaultCategory = 'Staking / Yield';
      else if (lowerMethod.includes('vote') || lowerMethod.includes('propose')) defaultCategory = 'DAO Governance';
      else if (lowerMethod.includes('approve')) defaultCategory = 'Approval / Revoke';
      else if (!item.to) defaultCategory = 'Contract Deployment';

      const timestamp = item.timestamp ? Math.floor(new Date(item.timestamp).getTime() / 1000) : Math.floor(Date.now() / 1000);

      return {
        hash: item.hash,
        blockNumber: item.block_number || item.block || 0,
        timestamp,
        from: item.from?.hash || address,
        to: item.to?.hash || null,
        value: item.value ? (Number(BigInt(item.value)) / 1e18).toFixed(4) : '0.0000',
        gasLimit: item.gas_limit ? String(item.gas_limit) : '0',
        gasUsed: item.gas_used ? String(item.gas_used) : '0',
        gasPriceGwei,
        feeBot,
        status: item.status === 'ok' ? 'ok' : 'error',
        methodName: method,
        category: defaultCategory,
        note: '',
        hasOnChainTag: false,
      };
    });

    return { transactions: parsed, isSample: false };
  } catch (error) {
    console.error('Failed to fetch from Blockscout:', error);
    return { transactions: SAMPLE_TRANSACTIONS, isSample: true };
  }
}
