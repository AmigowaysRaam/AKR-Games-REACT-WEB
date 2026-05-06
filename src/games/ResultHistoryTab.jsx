import React, { useEffect, useState } from 'react';
import { ResultBallRow } from './ResultBall';
import { getSateResultMain } from '../services/gameSevice';

export default function ResultHistoryTab({ lotteryKey }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    // ── DEBUG: check what key is arriving ──
    console.log('ResultHistoryTab → lotteryKey:', lotteryKey);

    setLoading(true);
    setError(null);

    getSateResultMain({ key: lotteryKey })
      .then(res => {
        console.log('API response:', res);
        if (res.success) setResults(res.data);
        else setError('Failed to load results');
      })
      .catch(err => {
        console.error('API error:', err);
        setError('Something went wrong');
      })
      .finally(() => setLoading(false));

  }, [lotteryKey]); // ← removed userId

  if (loading) return <LoadingState />;
  if (error)   return <ErrorState message={error} />;
  if (!results.length) return <EmptyState />;

  return (
    <div>
      {results.map((row, i) => (
        <HistoryRow key={row.id} row={row} index={i} />
      ))}
    </div>
  );
}

function HistoryRow({ row, index }) {
  const date      = new Date(row.result_date);
  const dateLabel = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const dayLabel  = date.toLocaleDateString('en-IN', { weekday: 'short' });

  const firstDigits  = row.first_prize?.split('')  ?? [];
  const secondDigits = row.second_prize?.split('') ?? [];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 16px', borderBottom: '1px solid #f4f2fc',
      background: index % 2 === 0 ? '#fff' : '#faf9ff', gap: 12,
    }}>
      <div style={{ flexShrink: 0, minWidth: 90 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.3 }}>{row.draw_no}</div>
        <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>{dateLabel}</div>
        <div style={{ fontSize: 10, color: '#aaa' }}>{dayLabel}</div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#666', fontWeight: 600, minWidth: 64 }}>1st Prize :</span>
          <ResultBallRow digits={firstDigits} size={28} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#666', fontWeight: 600, minWidth: 64 }}>2nd Prize :</span>
          <ResultBallRow digits={secondDigits} size={28} />
        </div>
      </div>
      <div style={{
        flexShrink: 0, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10,
        background: row.status === 'declared' ? '#dcfce7' : '#fef9c3',
        color:      row.status === 'declared' ? '#16a34a' : '#ca8a04',
        textTransform: 'capitalize',
      }}>{row.status}</div>
    </div>
  );
}

function LoadingState() {
  return (
    <div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      {[0,1,2].map(i => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 16px', borderBottom: '1px solid #f4f2fc',
        }}>
          <div style={{ width: 80, height: 36, borderRadius: 8, background: '#f0eef8', animation: 'pulse 1.4s ease-in-out infinite' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ height: 28, borderRadius: 14, background: '#f0eef8', width: '70%', animation: 'pulse 1.4s ease-in-out infinite' }} />
            <div style={{ height: 28, borderRadius: 14, background: '#f0eef8', width: '55%', animation: 'pulse 1.4s ease-in-out infinite' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div style={{ padding: 40, textAlign: 'center', color: '#ef4444' }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>⚠️</div>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{message}</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ padding: 40, textAlign: 'center', color: '#bbb' }}>
      <div style={{ fontSize: 38, marginBottom: 10 }}>📋</div>
      <div style={{ fontSize: 14, fontWeight: 600 }}>No history available</div>
    </div>
  );
}