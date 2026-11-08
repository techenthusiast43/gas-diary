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
                Specify your deployed GasDiary contract address on BOT Chain (Chain ID: 677). By default, test records can also be stored locally without gas cost.
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

        {/* 4. BOT Chain Ecosystem Showcase Section */}
        <section
          id="ecosystem-showcase"
          className="glass-card"
          style={{
            marginTop: '32px',
            marginBottom: '20px',
            padding: '24px 28px',
            background: 'linear-gradient(135deg, rgba(14, 18, 23, 0.9) 0%, rgba(20, 220, 172, 0.05) 100%)',
            border: '1px solid rgba(20, 220, 172, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img
                src="/bot-logo.png"
                alt="BOT Chain Logo"
                style={{ width: '42px', height: '42px', borderRadius: '10px', filter: 'drop-shadow(0 0 10px rgba(20, 220, 172, 0.4))' }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                    BOT Chain Ecosystem Showcase
                  </h3>
                  <span className="badge badge-tag" style={{ background: 'rgba(20, 220, 172, 0.15)', color: '#14DCAC', fontSize: '0.72rem' }}>
                    Mainnet (Chain ID: 677)
                  </span>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  GasDiary is built natively on BOT Chain — an ultra-fast EVM network with 150 Million BOT total supply.
                </p>
              </div>
            </div>

            {/* Quick Action Links with Official BOT Logo at the front */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href="https://botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <img
                  src="/bot-logo.png"
                  alt="BOT"
                  style={{ width: '18px', height: '18px', borderRadius: '4px' }}
                />
                <span>BOT Chain Website</span>
                <ExternalLink size={12} />
              </a>

              <a
                href="https://scan.botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <img
                  src="/bot-logo.png"
                  alt="BOT"
                  style={{ width: '18px', height: '18px', borderRadius: '4px' }}
                />
                <span>BOT Chain Explorer</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Ecosystem Links Details Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '14px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                src="/bot-logo.png"
                alt="BOT"
                style={{ width: '15px', height: '15px', borderRadius: '3px', flexShrink: 0 }}
              />
              <span>
                <span style={{ color: 'var(--text-muted)' }}>BOT Chain Website: </span>
                <a href="https://botchain.ai" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
                  https://botchain.ai
                </a>
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                src="/bot-logo.png"
                alt="BOT"
                style={{ width: '15px', height: '15px', borderRadius: '3px', flexShrink: 0 }}
              />
              <span>
                <span style={{ color: 'var(--text-muted)' }}>BOT Chain Explorer: </span>
                <a href="https://scan.botchain.ai" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-secondary)', fontWeight: 600, textDecoration: 'none' }}>
                  https://scan.botchain.ai
                </a>
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>GasDiary.sol Contract: </span>
              <a
                href={`https://scan.botchain.ai/address/${customContract}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono"
                style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}
              >
                {customContract.slice(0, 8)}...{customContract.slice(-6)}
              </a>
            </div>
          </div>
        </section>
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
          padding: '28px 32px',
          background: 'rgba(9, 11, 14, 0.95)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Top Footer Row: BOT Chain Brand & Both Mandatory Links with Official Logo at front */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              paddingBottom: '16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src="/bot-logo.png"
                alt="BOT Chain Logo"
                style={{ width: '28px', height: '28px', borderRadius: '6px' }}
              />
              <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
                BOT Chain
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>• Mainnet (Chain ID: 677)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', fontSize: '0.85rem' }}>
              <a
                href="https://botchain.ai"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: 'var(--text-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                <img
                  src="/bot-logo.png"
                  alt="BOT"
                  style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0 }}
                />
                <span>BOT Chain website: https://botchain.ai</span>
                <ExternalLink size={11} />
              </a>

              <a
                href="https://scan.botchain.ai"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: 'var(--text-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                <img
                  src="/bot-logo.png"
                  alt="BOT"
                  style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0 }}
                />
                <span>BOT Chain explorer: https://scan.botchain.ai</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>

          {/* Bottom Footer Row: Protocol Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
            }}
          >
            <div>GasDiary — Self-Sovereign Expense Tracking & Smart Contract Annotations for Web3</div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <a
                href="https://rpc.botchain.ai"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
              >
                RPC: rpc.botchain.ai
              </a>
              <span>•</span>
              <a
                href={`https://scan.botchain.ai/address/${customContract}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}
              >
                Contract: {customContract.slice(0, 6)}...{customContract.slice(-4)}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
