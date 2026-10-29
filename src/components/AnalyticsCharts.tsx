import React, { useState } from 'react';
import type { SpendingStats } from '../types';
import { BarChart3, PieChart } from 'lucide-react';

interface AnalyticsChartsProps {
  stats: SpendingStats;
}

const CATEGORY_COLORS: { [key: string]: string } = {
  'DeFi Swap': '#14DCAC',
  'NFT Mint': '#8B5CF6',
  'Token Transfer': '#00B5D8',
  'Contract Deployment': '#F59E0B',
  'Staking / Yield': '#10B981',
  'DAO Governance': '#EC4899',
  'Approval / Revoke': '#6366F1',
  Other: '#9CA3AF',
  Uncategorized: '#6B7280',
};

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ stats }) => {
  const [hoveredDate, setHoveredDate] = useState<{
    date: string;
    fee: number;
    count: number;
  } | null>(null);

  const daily = stats.dailySpending;
  const maxDailyFee = daily.length > 0 ? Math.max(...daily.map((d) => d.feeBot), 0.005) : 0.01;

  // Category breakdown calculation
  const totalCategoryFee = Object.values(stats.categoryBreakdown).reduce(
    (acc, c) => acc + c.feeBot,
    0
  );

  const categoriesSorted = Object.entries(stats.categoryBreakdown).sort(
    ([, a], [, b]) => b.feeBot - a.feeBot
  );

  return (
    <div className="charts-grid">
      {/* Daily Gas Spending Timeline */}
      <div className="glass-card chart-card">
        <div className="chart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={20} color="var(--accent-primary)" />
            <h3 className="chart-title">Daily Gas Spending (BOT)</h3>
          </div>
          {hoveredDate && (
            <div style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
              {hoveredDate.date}: {hoveredDate.fee.toFixed(5)} BOT ({hoveredDate.count} txs)
            </div>
          )}
        </div>

        {daily.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            No timeline data available
          </div>
        ) : (
          <div style={{ position: 'relative', width: '100%', height: '220px' }}>
            <svg
              className="svg-bar-chart"
              viewBox={`0 0 ${Math.max(daily.length * 60, 400)} 200`}
              preserveAspectRatio="none"
            >
              {/* Grid lines */}
              <line x1="0" y1="40" x2="100%" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
              <line x1="0" y1="100" x2="100%" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
              <line x1="0" y1="160" x2="100%" y2="160" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />

              {/* Bars */}
              {daily.map((item, idx) => {
                const totalWidth = Math.max(daily.length * 60, 400);
                const barSpacing = totalWidth / daily.length;
                const barWidth = Math.min(barSpacing * 0.65, 36);
                const x = idx * barSpacing + (barSpacing - barWidth) / 2;

                const heightPercent = Math.min(item.feeBot / maxDailyFee, 1);
                const barHeight = Math.max(heightPercent * 140, 8);
                const y = 170 - barHeight;

                const isHovered = hoveredDate?.date === item.date;

                return (
                  <g
                    key={item.date}
                    onMouseEnter={() => setHoveredDate({ date: item.date, fee: item.feeBot, count: item.count })}
                    onMouseLeave={() => setHoveredDate(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="4"
                      className="bar-rect"
                      style={{
                        fill: isHovered ? '#38BDF8' : '#14DCAC',
                        opacity: hoveredDate && !isHovered ? 0.4 : 1,
                      }}
                    />
                    <text
                      x={x + barWidth / 2}
                      y="190"
                      fill="var(--text-muted)"
                      fontSize="11"
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                    >
                      {item.date.slice(5)} {/* MM-DD */}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>

      {/* Category Spending Breakdown */}
      <div className="glass-card chart-card">
        <div className="chart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={20} color="var(--accent-secondary)" />
            <h3 className="chart-title">Expense Categories</h3>
          </div>
        </div>

        {categoriesSorted.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            No category distribution yet
          </div>
        ) : (
          <div className="category-list">
            {categoriesSorted.map(([category, data]) => {
              const pct = totalCategoryFee > 0 ? (data.feeBot / totalCategoryFee) * 100 : 0;
              const color = CATEGORY_COLORS[category] || '#14DCAC';

              return (
                <div key={category} className="category-item">
                  <div style={{ flex: 1, marginRight: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                        <span className="category-dot" style={{ backgroundColor: color }}></span>
                        {category}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {pct.toFixed(1)}% ({data.count})
                      </span>
                    </div>

                    {/* Progress Track */}
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          backgroundColor: color,
                          borderRadius: '3px',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '70px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {data.feeBot.toFixed(4)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>BOT</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
