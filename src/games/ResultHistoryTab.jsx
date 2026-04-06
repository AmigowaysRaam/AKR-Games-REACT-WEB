/**
 * ResultHistoryTab.jsx
 * Shows scrollable date-wise result history.
 * Same component reused for every lottery — just pass lottery.history
 */
import React from 'react';
import { ResultBallRow } from './ResultBall';

export default function ResultHistoryTab({ history = [] }) {
  if (!history.length) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#bbb' }}>
        <div style={{ fontSize: 38, marginBottom: 10 }}>📋</div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>No history available</div>
      </div>
    );
  }

  return (
    <div>
      {history.map((row, i) => (
        <HistoryRow key={i} row={row} index={i} />
      ))}
    </div>
  );
}

function HistoryRow({ row, index }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      borderBottom: '1px solid #f4f2fc',
      background: index % 2 === 0 ? '#fff' : '#faf9ff',
      gap: 12,
    }}>
      {/* Left: dates */}
      <div style={{ flexShrink: 0, minWidth: 90 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.3 }}>
          {row.date}
        </div>
        <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>{row.dateISO}</div>
        <div style={{ fontSize: 10, color: '#888' }}>{row.time}</div>
      </div>

      {/* Right: prize rows */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#666', fontWeight: 600, minWidth: 64 }}>1st Prize :</span>
          <ResultBallRow digits={row.first} size={28} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#666', fontWeight: 600, minWidth: 64 }}>2nd Prize :</span>
          <ResultBallRow digits={row.second} size={28} />
        </div>
      </div>
    </div>
  );
}
