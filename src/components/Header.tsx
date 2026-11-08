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
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  const networkDisplay = chain?.name ? `${chain.name} (${chain.id})` : 'BOT Chain (677)';

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
        <a
          href="https://scan.botchain.ai"
          target="_blank"
          rel="noreferrer"
          className="network-pill"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          title={`Connected to ${networkDisplay} — Click to open BOT Chain Explorer`}
        >
          <img src="/bot-logo.png" alt="BOT" style={{ width: '14px', height: '14px', borderRadius: '3px' }} />
          <span>{networkDisplay}</span>
        </a>

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
