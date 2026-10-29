import React from 'react';
import type { SpendingStats } from '../types';
import { Fuel, Activity, AlertTriangle, TrendingUp, ExternalLink } from 'lucide-react';

interface StatsCardsProps {
  stats: SpendingStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const botPriceUsd = 12.39; // Current price reported by Bohr scan API
  const totalFiat = (stats.totalFeeBot * botPriceUsd).toFixed(2);
  const failedFiat = (stats.failedFeeBot * botPriceUsd).toFixed(2);

  return (
    <div className="metrics-grid">
      {/* Total Fees */}
      <div className="glass-card metric-card">
        <div className="metric-label">
          <span>Total Gas Fees Paid</span>
          <Fuel size={18} color="var(--accent-primary)" />
        </div>
        <div>
          <div className="metric-value" style={{ color: 'var(--accent-primary)' }}>
            {stats.totalFeeBot.toFixed(4)} <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>BOT</span>
          </div>
          <div className="metric-sub">
            ≈ ${totalFiat} USD (at ${botPriceUsd}/BOT)
          </div>
        </div>
      </div>

      {/* Transactions Count & Avg Fee */}
      <div className="glass-card metric-card">
        <div className="metric-label">
          <span>Transactions & Avg Fee</span>
          <Activity size={18} color="var(--accent-secondary)" />
        </div>
        <div>
          <div className="metric-value">
            {stats.totalTransactions} <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>txs</span>
          </div>
          <div className="metric-sub">
            Average: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{stats.avgFeeBot.toFixed(5)} BOT</span> / tx
          </div>
        </div>
      </div>

      {/* Failed Transactions */}
      <div className="glass-card metric-card">
        <div className="metric-label">
          <span>Failed Transactions</span>
          <AlertTriangle size={18} color={stats.failedCount > 0 ? 'var(--accent-rose)' : 'var(--text-muted)'} />
        </div>
        <div>
          <div
            className="metric-value"
            style={{ color: stats.failedCount > 0 ? 'var(--accent-rose)' : 'var(--text-primary)' }}
          >
            {stats.failedCount} <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>failed</span>
          </div>
          <div className="metric-sub">
            {stats.failedCount > 0 ? (
              <span style={{ color: '#FDA4AF' }}>
                {stats.failedFeeBot.toFixed(5)} BOT (~${failedFiat}) wasted gas
              </span>
            ) : (
              '100% execution success rate'
            )}
          </div>
        </div>
      </div>

      {/* Most Expensive Tx */}
      <div className="glass-card metric-card">
        <div className="metric-label">
          <span>Peak Fee Paid</span>
          <TrendingUp size={18} color="var(--accent-amber)" />
        </div>
        <div>
          <div className="metric-value" style={{ color: 'var(--accent-amber)' }}>
            {stats.highestFeeTx ? stats.highestFeeTx.feeBot : '0.0000'}{' '}
            <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>BOT</span>
          </div>
          <div className="metric-sub">
            {stats.highestFeeTx ? (
              <a
                href={`https://scan.bohr.life/tx/${stats.highestFeeTx.hash}`}
                target="_blank"
                rel="noreferrer"
                className="hash-link"
                style={{ fontSize: '0.78rem' }}
              >
                <span>{stats.highestFeeTx.methodName || 'Contract Call'} ({stats.highestFeeTx.hash.slice(0, 10)}...)</span>
                <ExternalLink size={12} />
              </a>
            ) : (
              'No transactions recorded'
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
