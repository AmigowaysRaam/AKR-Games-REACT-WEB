/**
 * StateLotteryGrid.jsx
 * ─────────────────────────────────────────────────────
 * The home screen grid showing all lotteries as cards.
 * Matches Image 3 exactly — colored cards with jackpot
 * amount + next draw time.
 *
 * Usage:
 *   <StateLotteryGrid onSelectLottery={(lottery) => navigate(lottery.id)} />
 * ─────────────────────────────────────────────────────
 */
import React from 'react';
import { LOTTERIES } from '../data/lotteryConfig';

export default function StateLotteryGrid({ onSelectLottery }) {
  return (
    <div style={{
      background: '#f4f2fb', minHeight: '100vh',
      fontFamily: "'Poppins','Segoe UI',sans-serif",
      maxWidth: 430, margin: '0 auto',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        ::-webkit-scrollbar { display: none; }
        button:active { opacity: 0.85; }
      `}</style>

      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '14px 16px 8px',
      }}>
        <div style={{ width: 14, height: 14, borderRadius: 3, background: '#22c55e' }} />
        <span style={{ fontSize: 17, fontWeight: 800, color: '#1a1a2e' }}>State Lottery</span>
      </div>

      {/* 3-column grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12, padding: '4px 12px 24px',
      }}>
        {LOTTERIES.map(lottery => (
          <LotteryCard
            key={lottery.id}
            lottery={lottery}
            onPress={() => onSelectLottery?.(lottery)}
          />
        ))}
      </div>
    </div>
  );
}

function LotteryCard({ lottery, onPress }) {
  return (
    <button
      onClick={onPress}
      style={{
        borderRadius: 16, overflow: 'hidden', border: 'none', cursor: 'pointer',
        background: `linear-gradient(145deg, ${lottery.gradient[0]}, ${lottery.gradient[1]})`,
        boxShadow: `0 6px 20px ${lottery.cardBg}40`,
        padding: '14px 10px 12px',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        transition: 'transform 0.15s, box-shadow 0.15s',
        textAlign: 'left', width: '100%',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {/* Logo */}
      <div style={{
        width: 52, height: 52, borderRadius: 12,
        background: 'rgba(255,255,255,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26, marginBottom: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(4px)',
      }}>
        {lottery.logoEmoji}
      </div>

      {/* Name */}
      <div style={{
        fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)',
        marginBottom: 6, lineHeight: 1.3,
      }}>
        {lottery.name}
      </div>

      {/* Jackpot */}
      <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 2 }}>
        {lottery.jackpot}
      </div>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>jackpot</div>

      {/* Next draw */}
      <div style={{
        background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '4px 8px',
        backdropFilter: 'blur(4px)',
      }}>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', marginBottom: 1 }}>Next Draw</div>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{lottery.nextDraw}</div>
      </div>
    </button>
  );
}
