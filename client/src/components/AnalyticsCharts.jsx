import React from 'react';
import { BarChart, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { HABIT_CATEGORIES } from '../utils/constants';

const AnalyticsCharts = ({ statistics }) => {
  if (!statistics) return null;

  const { weeklyProgress = [], categoryDistribution = [] } = statistics;

  // 1. Line Chart Calculations for Weekly Progress
  const chartHeight = 160;
  const chartWidth = 500;
  const padding = 30;

  // Generate points coordinates
  const points = weeklyProgress.map((item, index) => {
    const x = padding + (index * (chartWidth - padding * 2)) / 6;
    const y = chartHeight - padding - (item.rate / 100) * (chartHeight - padding * 2);
    return { x, y, ...item };
  });

  // SVG path string for the line
  const linePath = points.reduce((path, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, '');

  // SVG path string for the gradient area under the line
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z` 
    : '';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      
      {/* Weekly Completion Line Chart */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>
          <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
          Weekly Performance
        </h3>
        
        {weeklyProgress.length === 0 ? (
          <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No log data found
          </div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              <defs>
                {/* Underline Gradient */}
                <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 25, 50, 75, 100].map((gridVal) => {
                const y = chartHeight - padding - (gridVal / 100) * (chartHeight - padding * 2);
                return (
                  <g key={gridVal}>
                    <line
                      x1={padding}
                      y1={y}
                      x2={chartWidth - padding}
                      y2={y}
                      stroke="var(--border-color)"
                      strokeWidth="1"
                      strokeDasharray="4 6"
                    />
                    <text
                      x={padding - 8}
                      y={y + 4}
                      fill="var(--text-muted)"
                      fontSize="9"
                      textAnchor="end"
                      fontWeight="500"
                    >
                      {gridVal}%
                    </text>
                  </g>
                );
              })}

              {/* Gradient Area under line */}
              <path d={areaPath} fill="url(#chart-area-grad)" />

              {/* Connecting Line */}
              <path
                d={linePath}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points & tooltips */}
              {points.map((p, index) => (
                <g key={index}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill="var(--bg-secondary)"
                    stroke="var(--primary)"
                    strokeWidth="3"
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  />
                  {/* Tooltip value */}
                  <text
                    x={p.x}
                    y={p.y - 12}
                    fill="var(--text-primary)"
                    fontSize="10"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {p.rate}%
                  </text>
                  {/* Day labels */}
                  <text
                    x={p.x}
                    y={chartHeight - 10}
                    fill="var(--text-secondary)"
                    fontSize="10"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {p.day}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        )}
      </div>

      {/* Category breakdown (Horizontal Bar Chart) */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>
          <PieIcon size={18} style={{ color: 'var(--primary)' }} />
          Category Distribution
        </h3>

        {categoryDistribution.length === 0 ? (
          <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Create habits to view category counts
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
            {categoryDistribution.map((item) => {
              const catConfig = HABIT_CATEGORIES[item.category] || { color: 'var(--primary)' };
              // Find max count to scale widths
              const maxCount = Math.max(...categoryDistribution.map(d => d.count), 1);
              const widthPct = (item.count / maxCount) * 100;

              return (
                <div key={item.category} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: catConfig.color }}>{item.count} completions</span>
                  </div>
                  {/* Progress bar */}
                  <div style={{
                    width: '100%',
                    height: '10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-hover)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${widthPct}%`,
                      height: '100%',
                      borderRadius: 'var(--radius-full)',
                      background: catConfig.color,
                      boxShadow: `0 0 10px ${catConfig.color}40`,
                      transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} />
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

export default AnalyticsCharts;
