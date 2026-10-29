import React, { useState } from 'react';
import type { TransactionRecord } from '../types';
import { exportTransactionsToCsv } from '../services/csvExport';
import { Search, Download, ExternalLink, Tag, ShieldCheck, Check, AlertCircle } from 'lucide-react';

interface TransactionTableProps {
  transactions: TransactionRecord[];
  walletAddress: string;
  onOpenTagModal: (tx: TransactionRecord) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  walletAddress,
  onOpenTagModal,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filter transactions
  const filtered = transactions.filter((tx) => {
    // Status filter
    if (statusFilter === 'OK' && tx.status !== 'ok') return false;
    if (statusFilter === 'ERROR' && tx.status !== 'error') return false;

    // Category filter
    if (categoryFilter !== 'ALL' && (tx.category || 'Uncategorized') !== categoryFilter) {
      return false;
    }

    // Search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchHash = tx.hash.toLowerCase().includes(q);
      const matchMethod = (tx.methodName || '').toLowerCase().includes(q);
      const matchCategory = (tx.category || '').toLowerCase().includes(q);
      const matchNote = (tx.note || '').toLowerCase().includes(q);
      return matchHash || matchMethod || matchCategory || matchNote;
    }

    return true;
  });

  // Extract unique categories for filter dropdown
  const uniqueCategories = Array.from(
    new Set(transactions.map((tx) => tx.category || 'Uncategorized'))
  );

  return (
    <div className="glass-card table-section">
      <div className="table-header-bar">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>
            Fee History & Expenses
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Showing {filtered.length} of {transactions.length} transactions
          </p>
        </div>

        {/* Filter Controls & CSV Export */}
        <div className="filter-group">
          {/* Search box */}
          <div style={{ position: 'relative' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              id="search-transactions"
              type="text"
              placeholder="Search hash, note, method..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '34px', width: '220px' }}
            />
          </div>

          {/* Category filter */}
          <select
            id="filter-category"
            className="select-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            id="filter-status"
            className="select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="OK">Successful Only</option>
            <option value="ERROR">Failed Only</option>
          </select>

          {/* CSV Download Button */}
          <button
            id="btn-export-csv"
            className="btn btn-primary"
            onClick={() => exportTransactionsToCsv(filtered, walletAddress)}
            title="Export filtered records as CSV"
            style={{ padding: '8px 16px' }}
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table view */}
      <div className="table-wrapper">
        <table className="tx-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Date (UTC)</th>
              <th>Tx Hash</th>
              <th>Method</th>
              <th>Gas Used</th>
              <th>Gas Price</th>
              <th>Fee (BOT)</th>
              <th>Category</th>
              <th>Note</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  No transactions match the selected filters.
                </td>
              </tr>
            ) : (
              filtered.map((tx) => {
                const dateStr = new Date(tx.timestamp * 1000).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr key={tx.hash}>
                    {/* Status */}
                    <td>
                      {tx.status === 'ok' ? (
                        <span className="badge badge-success">
                          <Check size={11} /> Success
                        </span>
                      ) : (
                        <span className="badge badge-error">
                          <AlertCircle size={11} /> Failed
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {dateStr}
                    </td>

                    {/* Hash */}
                    <td>
                      <a
                        href={`https://scan.bohr.life/tx/${tx.hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hash-link"
                        title={`View on Bohr Explorer: ${tx.hash}`}
                      >
                        <span>{tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}</span>
                        <ExternalLink size={12} />
                      </a>
                    </td>

                    {/* Method */}
                    <td style={{ fontWeight: 500, fontSize: '0.85rem' }}>
                      {tx.methodName || 'Transfer'}
                    </td>

                    {/* Gas Used */}
                    <td className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {Number(tx.gasUsed).toLocaleString()}
                    </td>

                    {/* Gas Price */}
                    <td className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {tx.gasPriceGwei} Gwei
                    </td>

                    {/* Fee BOT */}
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                      {tx.feeBot} <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>BOT</span>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="badge badge-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {tx.hasOnChainTag && (
                          <span title="Stored on-chain in GasDiary.sol" style={{ display: 'inline-flex' }}>
                            <ShieldCheck size={12} color="#14DCAC" />
                          </span>
                        )}
                        <span>{tx.category || 'Uncategorized'}</span>
                      </span>
                    </td>

                    {/* Note memo */}
                    <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {tx.note || <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>

                    {/* Action button */}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => onOpenTagModal(tx)}
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        <Tag size={13} />
                        <span>Annotate</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
