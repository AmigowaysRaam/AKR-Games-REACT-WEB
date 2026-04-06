/**
 * AnalyzeTab.jsx
 * Shows digit frequency analysis from lottery history.
 * Fully data-driven — works for any lottery history array.
 */
import React, { useMemo } from 'react';
import { ResultBallRow } from './ResultBall';

const COL_COLORS = ['#9CA3AF','#9CA3AF','#F59E0B','#3B82F6','#EF4444','#22C55E'];

export default function AnalyzeTab({ history = [] }) {
  // Compute frequency per position per digit
  const stats = useMemo(() => {
    if (!history.length) return null;

    // Position stats: 6 positions, each with digit counts 0-9
    const positions = Array.from({ length: 6 }, () => Array(10).fill(0));
    const bigSmall   = { big: 0, small: 0 };
    const oddEven    = { odd: 0, even: 0 };

    history.forEach(h => {
      [...h.first, ...h.second].forEach((digit, pos) => {
        if (pos < 6) positions[pos][digit]++;
        if (digit >= 5) bigSmall.big++; else bigSmall.small++;
        if (digit % 2 !== 0) oddEven.odd++; else oddEven.even++;
      });
    });

    return { positions, bigSmall, oddEven };
  }, [history]);

  if (!stats) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#bbb' }}>
      No data to analyze yet.
    </div>
  );

  const total = history.length * 12 || 1;

  return (
    <div style={{ padding: 16 }}>

      {/* Big / Small bar */}
      <SectionTitle>📊 Big vs Small</SectionTitle>
      <FreqBar label="Big (5-9)"   val={stats.bigSmall.big}   total={total} color="#EF4444" />
      <FreqBar label="Small (0-4)" val={stats.bigSmall.small} total={total} color="#3B82F6" />

      <Divider />

      {/* Odd / Even bar */}
      <SectionTitle>📊 Odd vs Even</SectionTitle>
      <FreqBar label="Odd (1,3,5,7,9)"  val={stats.oddEven.odd}  total={total} color="#F59E0B" />
      <FreqBar label="Even (0,2,4,6,8)" val={stats.oddEven.even} total={total} color="#8B5CF6" />

      <Divider />

      {/* Hot numbers */}
      <SectionTitle>🔥 Hot Numbers (1st Prize)</SectionTitle>
      <HotNumbers history={history} />

      <Divider />

      {/* Last 10 results mini */}
      <SectionTitle>🎯 Last {Math.min(history.length, 10)} Results</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
        {history.slice(0, 10).map((h, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: '#888', minWidth: 80 }}>{h.date}</span>
            <ResultBallRow digits={h.first} size={24} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 700, color: '#555',
      marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: '#f0eef8', margin: '16px 0' }} />;
}

function FreqBar({ label, val, total, color }) {
  const pct = Math.round(val / total * 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
          <span style={{ fontSize: 12, fontWeight: 600 }}>{label}</span>
        </div>
        <span style={{ fontSize: 11, color: '#888' }}>{val} ({pct}%)</span>
      </div>
      <div style={{ height: 8, background: '#f0eef8', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: color, borderRadius: 4, transition: 'width 0.8s',
        }} />
      </div>
    </div>
  );
}

function HotNumbers({ history }) {
  // Count frequency of each digit in 1st prize positions
  const freq = Array(10).fill(0);
  history.forEach(h => h.first.forEach(d => freq[d]++));
  const sorted = freq.map((count, digit) => ({ digit, count }))
    .sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {sorted.map(({ digit, count }, i) => (
        <div key={digit} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: COL_COLORS[Math.min(i, COL_COLORS.length - 1)],
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 16, fontWeight: 900,
            boxShadow: `0 3px 8px rgba(0,0,0,0.2)`,
          }}>{digit}</div>
          <span style={{ fontSize: 10, color: '#888' }}>{count}x</span>
        </div>
      ))}
    </div>
  );
}
