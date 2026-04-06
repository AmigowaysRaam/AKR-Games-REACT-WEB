/**
 * MyOrderTab.jsx + RulesModal.jsx
 */
import React, { useState } from 'react';

// ─── MY ORDER TAB ─────────────────────────────────────────────────────────────
export function MyOrderTab({ orders = [] }) {
  if (!orders.length) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#bbb' }}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>🎫</div>
      <div style={{ fontSize: 14, fontWeight: 600 }}>No orders yet</div>
      <div style={{ fontSize: 12, marginTop: 4 }}>Place a bet to see your orders here</div>
    </div>
  );

  return (
    <div>
      {orders.map((o, i) => {
        const wlColor = o.status === 'won' ? '#16a34a' : o.status === 'lost' ? '#ef4444' : '#f59e0b';
        const wlLabel = o.status === 'won' ? 'WON' : o.status === 'lost' ? 'LOST' : 'PENDING';
        return (
          <div key={i} style={{
            padding: '12px 16px', borderBottom: '1px solid #f4f2fc',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>
                  Col {o.column} — {o.type.toUpperCase()}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '1px 8px',
                  borderRadius: 10, background: wlColor + '20', color: wlColor,
                }}>{wlLabel}</span>
              </div>
              <div style={{ fontSize: 11, color: '#888' }}>
                {o.issue} · Bet ₹{o.amount} · 1.95X
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {o.status === 'won'
                ? <div style={{ fontSize: 15, fontWeight: 800, color: '#16a34a' }}>+₹{Math.round(o.amount * 1.95)}</div>
                : o.status === 'lost'
                  ? <div style={{ fontSize: 15, fontWeight: 800, color: '#ef4444' }}>−₹{o.amount}</div>
                  : <div style={{ fontSize: 13, fontWeight: 600, color: '#f59e0b' }}>Pending</div>
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── RULES MODAL ──────────────────────────────────────────────────────────────
export function RulesModal({ visible, lotteryName, onClose }) {
  if (!visible) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: '24px 24px 0 0',
        width: '100%', maxWidth: 430, maxHeight: '80vh', overflowY: 'auto',
        padding: '0 0 24px',
        animation: 'slideUp 0.3s cubic-bezier(.32,.72,0,1)',
      }}>
        <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
        <div style={{ width: 40, height: 4, background: '#ddd', borderRadius: 2, margin: '10px auto 0' }} />
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px 10px', borderBottom: '1px solid #f0eef8',
        }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: '#1a1a2e', fontFamily: "'Poppins',sans-serif" }}>
            📋 {lotteryName} Rules
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: '50%',
            background: '#f4f4f8', border: 'none', cursor: 'pointer', fontSize: 16,
          }}>✕</button>
        </div>
        <div style={{ padding: '16px 18px' }}>
          {[
            { icon: '🎯', title: 'How to Play', body: 'Select Odd/Even/Big/Small for each column (A, B, C, D). Each column represents one digit of the winning number. Match your prediction to win.' },
            { icon: '💰', title: 'Payout', body: 'Each correct prediction pays 1.95X your bet amount. E.g., bet ₹100 → win ₹195.' },
            { icon: '📐', title: 'Big & Small', body: 'Big: digits 5, 6, 7, 8, 9\nSmall: digits 0, 1, 2, 3, 4' },
            { icon: '🔢', title: 'Odd & Even', body: 'Odd: digits 1, 3, 5, 7, 9\nEven: digits 0, 2, 4, 6, 8' },
            { icon: '⏱️', title: 'Draw Schedule', body: 'Results are announced at the scheduled draw time. Bets placed after the draw time are not accepted.' },
            { icon: '💳', title: 'Service Fee', body: 'A 2% platform service fee applies to each bet. Bet ₹100 → effective stake = ₹98.' },
          ].map(({ icon, title, body }) => (
            <div key={title} style={{
              marginBottom: 14, padding: '12px 14px',
              background: '#faf9ff', borderRadius: 12, border: '1px solid #f0eef8',
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 5 }}>
                {icon} {title}
              </div>
              <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── BET SUMMARY BAR ─────────────────────────────────────────────────────────
export function BetSummaryBar({ totalAmount, totalNumbers, onClear, onPay }) {
  return (
    <div style={{
      position: 'sticky', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: '#fff', borderTop: '1px solid #e0dcf0',
      padding: '10px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
    }}>
      {/* Wallet icon + amount */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
        }}>💼</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#1a1a2e', lineHeight: 1 }}>
            ₹{totalAmount.toLocaleString('en-IN')}.00
          </div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>
            {totalNumbers} number{totalNumbers !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Clear + Pay Now */}
      <div style={{ display: 'flex', gap: 8 }}>
        {totalNumbers > 0 && (
          <button onClick={onClear} style={{
            padding: '10px 16px', borderRadius: 20,
            background: '#f0eef8', border: '1px solid #ddd',
            fontSize: 13, fontWeight: 700, color: '#888', cursor: 'pointer',
          }}>Clear</button>
        )}
        <button onClick={onPay} style={{
          padding: '10px 24px', borderRadius: 20,
          background: totalNumbers > 0 ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : '#e0e0e0',
          border: 'none', fontSize: 14, fontWeight: 800,
          color: totalNumbers > 0 ? '#fff' : '#999',
          cursor: totalNumbers > 0 ? 'pointer' : 'default',
          boxShadow: totalNumbers > 0 ? '0 4px 14px rgba(124,58,237,0.35)' : 'none',
          transition: 'all 0.2s',
        }}>Pay Now</button>
      </div>
    </div>
  );
}
