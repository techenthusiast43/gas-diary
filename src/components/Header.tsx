import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { Wallet, LogOut, CheckCircle2, Sparkles } from 'lucide-react';

interface HeaderProps {
  isSampleMode: boolean;
  onToggleSampleMode: () => void;
  onRefreshData: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isSampleMode,
  onToggleSampleMode,
  onRefreshData,
  isLoading,
}) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <header className="navbar">
      <div className="logo-container" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <img src="/gas-logo.svg" alt="GasDiary Logo" className="logo-img" />
        <div>
          <div className="logo-title">GasDiary</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
            BOT CHAIN GAS EXPENSE TRACKER
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        {/* Network indicator */}
        <div className="network-pill" title="Connected to BOT Chain Testnet (Chain ID 968)">
          <span className="pulse-dot"></span>
          <span>BOT Testnet (968)</span>
        </div>

        {/* Demo Mode Toggle */}
        <button
          id="btn-demo-toggle"
          className="btn btn-secondary"
          onClick={onToggleSampleMode}
          title={isSampleMode ? 'Switch to live wallet data' : 'Switch to sample dataset'}
          style={{ padding: '8px 14px', fontSize: '0.82rem' }}
        >
          <Sparkles size={14} color={isSampleMode ? 'var(--accent-amber)' : 'var(--text-muted)'} />
          <span>{isSampleMode ? 'Demo Mode Active' : 'Live Mode'}</span>
        </button>

        {/* Refresh button */}
        <button
          id="btn-refresh"
          className="btn btn-secondary"
          onClick={onRefreshData}
          disabled={isLoading}
          style={{ padding: '8px 14px', fontSize: '0.82rem' }}
        >
          {isLoading ? 'Fetching...' : 'Refresh'}
        </button>

        {/* Wallet Connect / Account button */}
        {isConnected ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              id="btn-wallet-account"
              className="btn btn-primary"
              onClick={() => open()}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <CheckCircle2 size={16} />
              <span>{shortAddress}</span>
            </button>
            <button
              id="btn-wallet-disconnect"
              className="btn btn-secondary"
              onClick={() => disconnect()}
              title="Disconnect Wallet"
              style={{ padding: '8px 10px' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            id="btn-wallet-connect"
            className="btn btn-primary"
            onClick={() => open()}
          >
            <Wallet size={16} />
            <span>Connect Wallet</span>
          </button>
        )}
      </div>
    </header>
  );
};
