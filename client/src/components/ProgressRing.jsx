import React from 'react';

const ProgressRing = ({ radius = 60, stroke = 8, progress = 0 }) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <svg
        height={radius * 2}
        width={radius * 2}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'all 0.5s ease' }}
      >
        {/* Background track circle */}
        <circle
          stroke="var(--border-color)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Animated progress circle */}
        <circle
          stroke="var(--primary)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)', strokeLinecap: 'round' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      
      {/* Center text overlay */}
      <div style={{
        position: 'absolute',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          fontFamily: 'var(--font-display)',
          color: 'var(--text-primary)',
          lineHeight: 1
        }}>
          {progress}%
        </span>
        <span style={{
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginTop: '2px'
        }}>
          Progress
        </span>
      </div>
    </div>
  );
};

export default ProgressRing;
