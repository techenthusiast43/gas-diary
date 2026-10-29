import React, { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { DEFAULT_CATEGORIES } from '../types';
import type { TransactionRecord } from '../types';
import { GasDiaryABI } from '../contracts/GasDiaryABI';
import { DEFAULT_GAS_DIARY_CONTRACT } from '../config/chain';
import { X, Tag, FileText, CheckCircle2, ShieldCheck, HardDrive } from 'lucide-react';

interface TagModalProps {
  tx: TransactionRecord | null;
  onClose: () => void;
  onSaveTag: (txHash: string, category: string, note: string, onChain: boolean) => void;
  customContractAddress?: string;
}

export const TagModal: React.FC<TagModalProps> = ({
  tx,
  onClose,
  onSaveTag,
  customContractAddress,
}) => {
  if (!tx) return null;

  const [category, setCategory] = useState<string>(tx.category || 'DeFi Swap');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [note, setNote] = useState<string>(tx.note || '');
  const [isSubmittingOnChain, setIsSubmittingOnChain] = useState<boolean>(false);
  const [txSuccess, setTxSuccess] = useState<boolean>(false);

  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const activeCategory = category === 'Custom' ? customCategory : category;
  const contractAddress = (customContractAddress || DEFAULT_GAS_DIARY_CONTRACT) as `0x${string}`;

  // Save to Smart Contract on BOT Chain
  const handleSaveOnChain = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first to save on-chain.');
      return;
    }
    if (!activeCategory.trim()) {
      alert('Please select or enter a category.');
      return;
    }

    try {
      setIsSubmittingOnChain(true);

      // Call GasDiary.tagTransaction(bytes32 txHash, string category, string note)
      // tx.hash is 0x... 32 bytes
      const formattedHash = (tx.hash.startsWith('0x') ? tx.hash : `0x${tx.hash}`) as `0x${string}`;

      await writeContractAsync({
        address: contractAddress,
        abi: GasDiaryABI,
        functionName: 'tagTransaction',
        args: [formattedHash, activeCategory, note],
      });

      setTxSuccess(true);
      onSaveTag(tx.hash, activeCategory, note, true);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Failed to write to contract:', err);
      // If contract not deployed yet or rejected
      const proceedLocal = window.confirm(
        `On-chain transaction did not complete (${err?.shortMessage || err?.message || 'Contract interaction failed'}).\n\nWould you like to save this category note locally in your diary instead?`
      );
      if (proceedLocal) {
        onSaveTag(tx.hash, activeCategory, note, false);
        onClose();
      }
    } finally {
      setIsSubmittingOnChain(false);
    }
  };

  const handleSaveLocal = () => {
    if (!activeCategory.trim()) {
      alert('Please select or enter a category.');
      return;
    }
    onSaveTag(tx.hash, activeCategory, note, false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag size={20} color="var(--accent-primary)" />
            <h3 className="modal-title">Expense Annotation</h3>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Transaction Summary Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Tx Hash:</span>
            <span className="font-mono" style={{ color: 'var(--accent-primary)' }}>
              {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Gas Fee Paid:</span>
            <span style={{ fontWeight: 600 }}>{tx.feeBot} BOT</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Interaction:</span>
            <span>{tx.methodName || 'Contract Call'}</span>
          </div>
        </div>

        {/* Category Selector */}
        <div className="form-group">
          <label className="form-label">Expense Category</label>
          <select
            id="select-category"
            className="form-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {DEFAULT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="Custom">+ Custom Category...</option>
          </select>
        </div>

        {category === 'Custom' && (
          <div className="form-group">
            <label className="form-label">Custom Category Name</label>
            <input
              id="input-custom-category"
              type="text"
              className="form-input"
              placeholder="e.g. Airdrop Claim, GameFi Item"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
            />
          </div>
        )}

        {/* Personal Note */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={14} />
              <span>Personal Memo / Note</span>
            </span>
          </label>
          <textarea
            id="textarea-note"
            className="form-textarea"
            placeholder="Add a memo for your tax or spending records (e.g. Swapped on Bohrdex for gas liquidity)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {txSuccess && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(20, 220, 172, 0.12)',
              border: '1px solid rgba(20, 220, 172, 0.4)',
              color: '#14DCAC',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <CheckCircle2 size={16} />
            <span>Successfully recorded on BOT Chain!</span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button
            id="btn-save-onchain"
            className="btn btn-primary"
            style={{ flex: 1.2 }}
            onClick={handleSaveOnChain}
            disabled={isSubmittingOnChain}
          >
            <ShieldCheck size={16} />
            <span>{isSubmittingOnChain ? 'Signing Tx...' : 'Save On-Chain'}</span>
          </button>

          <button
            id="btn-save-local"
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={handleSaveLocal}
            disabled={isSubmittingOnChain}
          >
            <HardDrive size={16} />
            <span>Save Local</span>
          </button>
        </div>

        <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          On-chain tags are permanently recorded in GasDiary.sol linked to your wallet address.
        </div>
      </div>
    </div>
  );
};
