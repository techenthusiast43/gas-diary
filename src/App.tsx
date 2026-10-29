import React, { useState, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { TransactionTable } from './components/TransactionTable';
import { TagModal } from './components/TagModal';
import type { TransactionRecord } from './types';
import { fetchAddressTransactions, SAMPLE_TRANSACTIONS } from './services/explorerApi';
import { calculateSpendingStats } from './services/analytics';
import { DEFAULT_GAS_DIARY_CONTRACT } from './config/chain';
import { Flame, Shield, ExternalLink, Settings2 } from 'lucide-react';

export const App: React.FC = () => {
  const { address, isConnected } = useAccount();

  const [transactions, setTransactions] = useState<TransactionRecord[]>(SAMPLE_TRANSACTIONS);
  const [isSampleMode, setIsSampleMode] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTx, setSelectedTx] = useState<TransactionRecord | null>(null);
  const [customContract, setCustomContract] = useState<string>(() => {
    return localStorage.getItem('gasdiary_contract_address') || DEFAULT_GAS_DIARY_CONTRACT;
  });
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Load transactions whenever address changes or refresh is requested
  const loadData = async (forceSample = false) => {
    setIsLoading(true);

    if (forceSample || !isConnected || !address) {
      // Merge with any local notes
      const storedTags = JSON.parse(localStorage.getItem('gasdiary_local_tags') || '{}');
      const enriched = SAMPLE_TRANSACTIONS.map((tx) => {
        if (storedTags[tx.hash]) {
          return {
            ...tx,
            category: storedTags[tx.hash].category,
            note: storedTags[tx.hash].note,
            hasOnChainTag: storedTags[tx.hash].onChain,
          };
        }
        return tx;
      });
      setTransactions(enriched);
      setIsSampleMode(true);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetchAddressTransactions(address);
      const storedTags = JSON.parse(localStorage.getItem('gasdiary_local_tags') || '{}');

      const enriched = res.transactions.map((tx) => {
        if (storedTags[tx.hash]) {
          return {
            ...tx,
            category: storedTags[tx.hash].category,
            note: storedTags[tx.hash].note,
            hasOnChainTag: storedTags[tx.hash].onChain,
          };
        }
        return tx;
      });

      setTransactions(enriched);
      setIsSampleMode(res.isSample);
    } catch (err) {
      console.error('Error fetching live transactions:', err);
      setTransactions(SAMPLE_TRANSACTIONS);
      setIsSampleMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [address, isConnected]);

  // Compute analytics
  const stats = useMemo(() => calculateSpendingStats(transactions), [transactions]);

  // Handle saving a tag locally and in state
  const handleSaveTag = (txHash: string, category: string, note: string, onChain: boolean) => {
    const storedTags = JSON.parse(localStorage.getItem('gasdiary_local_tags') || '{}');
    storedTags[txHash] = { category, note, onChain, timestamp: Date.now() };
    localStorage.setItem('gasdiary_local_tags', JSON.stringify(storedTags));

    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.hash === txHash) {
          return {
            ...tx,
            category,
            note,
            hasOnChainTag: onChain,
          };
        }
        return tx;
      })
    );
  };

  const handleContractAddressChange = (addr: string) => {
    setCustomContract(addr);
    localStorage.setItem('gasdiary_contract_address', addr);
  };

  return (
    <div>
      <Header
        isSampleMode={isSampleMode}
        onToggleSampleMode={() => loadData(!isSampleMode)}
        onRefreshData={() => loadData(false)}
        isLoading={isLoading}
      />

      <main className="container">
        {/* Hero Banner */}
        <div style={{ marginBottom: '28px', marginTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
                Blockchain Gas Expense Dashboard
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '720px' }}>
                Track every BOT spent on transaction fees, categorize your smart contract interactions, record on-chain expense notes with <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>GasDiary.sol</span>, and export verified records for bookkeeping.
              </p>
            </div>

            <button
              id="btn-contract-settings"
              className="btn btn-secondary"
              onClick={() => setShowSettings(!showSettings)}
              style={{ fontSize: '0.85rem' }}
            >
              <Settings2 size={16} />
              <span>Contract Config</span>
            </button>
          </div>

          {/* Settings Collapsible Panel */}
          {showSettings && (
            <div
              className="glass-card"
              style={{
                marginTop: '16px',
                padding: '16px 20px',
                border: '1px solid rgba(20, 220, 172, 0.3)',
                background: 'rgba(20, 220, 172, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Shield size={16} color="var(--accent-primary)" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>GasDiary.sol Smart Contract Configuration</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Specify your deployed GasDiary contract address on BOT Chain (Chain ID: 968). By default, test records can also be stored locally without gas cost.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  id="input-contract-address"
                  type="text"
                  className="form-input font-mono"
                  style={{ fontSize: '0.85rem' }}
                  value={customContract}
                  onChange={(e) => handleContractAddressChange(e.target.value)}
                  placeholder="0x..."
                />
                <button
                  className="btn btn-primary"
                  onClick={() => alert('Contract address saved!')}
                  style={{ padding: '8px 16px' }}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Demo Mode Notice */}
          {isSampleMode && (
            <div className="alert-banner" style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Flame size={18} color="var(--accent-amber)" />
                <span>
                  <strong>Sample BOT Chain Data:</strong> Showing an illustrative set of transactions with DeFi swaps, NFT mints, staking, and failed transactions. Connect a BOT Chain wallet or click "Refresh" to view live transactions.
                </span>
              </div>
              <button
                className="btn btn-outline-accent"
                onClick={() => loadData(false)}
                style={{ padding: '4px 12px', fontSize: '0.78rem' }}
              >
                Fetch Live
              </button>
            </div>
          )}
        </div>

        {/* 1. Key Metric Cards */}
        <StatsCards stats={stats} />

        {/* 2. Visual Analytics Charts */}
        <AnalyticsCharts stats={stats} />

        {/* 3. Transaction Log & Annotation Table */}
        <TransactionTable
          transactions={transactions}
          walletAddress={address || ''}
          onOpenTagModal={(tx) => setSelectedTx(tx)}
        />
      </main>

      {/* Modal for Tagging & Note taking */}
      <TagModal
        tx={selectedTx}
        onClose={() => setSelectedTx(null)}
        onSaveTag={handleSaveTag}
        customContractAddress={customContract}
      />

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '24px 32px',
          textAlign: 'center',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          background: 'rgba(9, 11, 14, 0.9)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <span>BOT Chain Testnet (Chain ID 968)</span>
          <span>•</span>
          <a href="https://rpc.bohr.life" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }}>
            RPC: rpc.bohr.life
          </a>
          <span>•</span>
          <a href="https://scan.bohr.life" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <span>Block Explorer</span>
            <ExternalLink size={11} />
          </a>
        </div>
        <div>GasDiary — Self-Sovereign Expense Tracking & Smart Contract Annotations for Web3</div>
      </footer>
    </div>
  );
};
