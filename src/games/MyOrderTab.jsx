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
export function BetSummaryBar({
  totalAmount,
  totalNumbers,
  onClear,
  onPay,
  label,
  disabled,
  onAmountClick   // 👈 NEW PROP
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>

      {/* LEFT SIDE — clickable to open slip modal */}
      <div
        onClick={onAmountClick}                              // 👈 NEW
        style={{ display: "flex", alignItems: "center", gap: 10,
          cursor: onAmountClick ? "pointer" : "default" }}  // 👈 NEW
      >
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: "#f3f4f6", display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 18
        }}>🧾</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#111" }}>
            ₹{totalAmount.toFixed(2)}
          </div>
          <div style={{ fontSize: 12, color: "#888" }}>
            {totalNumbers} numbers
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — unchanged */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {totalNumbers > 0 && (
          <button onClick={onClear} style={{
            border: "none", background: "transparent",
            fontSize: 18, cursor: "pointer"
          }}>🗑️</button>
        )}
        <button onClick={onPay} style={{
          padding: "12px 22px", borderRadius: 24, border: "none",
          fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer",
          background: "linear-gradient(135deg,#9333ea,#d946ef)",
          boxShadow: "0 6px 16px rgba(147,51,234,0.35)"
        }}>{label}</button>
      </div>
    </div>
  );
}

export function BetSlipModal({ visible, betSlip = [], onClose, onRemove, onPay }) {
  const [amounts, setAmounts] = React.useState({});

  // Sync amounts when slips change
  React.useEffect(() => {
    setAmounts(prev => {
      const next = {};
      betSlip.forEach((_, i) => { next[i] = prev[i] ?? 20; });
      return next;
    });
  }, [betSlip.length]);

  if (!visible) return null;

  const MIN_BET = 20;
  const MAX_BET = 1000;
  const MULTIPLIER = 920; // @920 as shown in screenshot

  const getAmount = (i) => amounts[i] ?? MIN_BET;

  const setAmount = (i, val) => {
    const n = Math.max(MIN_BET, Math.min(MAX_BET, Number(val) || MIN_BET));
    setAmounts(prev => ({ ...prev, [i]: n }));
  };

  const addAmount = (i, add) => {
    const cur = getAmount(i);
    setAmount(i, Math.min(cur + add, MAX_BET));
  };

  const totalAmount  = betSlip.reduce((s, _, i) => s + getAmount(i), 0);
  const totalNumbers = betSlip.reduce((s, b) => s + b.totalNumbers, 0);

  // Colors for digit circles
  const CIRCLE_COLORS = ['#3B82F6','#EF4444','#22C55E','#F59E0B','#8B5CF6','#EC4899'];

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 200,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#f5f5f5',
        borderRadius: '24px 24px 0 0',
        width: '100%', maxWidth: 430,
        maxHeight: '88vh',
        display: 'flex', flexDirection: 'column',
        animation: 'slideUp 0.3s cubic-bezier(.32,.72,0,1)',
        fontFamily: "'Poppins','Segoe UI',sans-serif",
      }}>
        <style>{`
          @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
          .quick-btn:active { opacity: 0.75; transform: scale(0.96); }
          input[type=number]::-webkit-inner-spin-button,
          input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        `}</style>

        {/* Handle */}
        <div style={{ width: 40, height: 4, background: '#ddd', borderRadius: 2, margin: '10px auto 0', flexShrink: 0 }} />

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 18px 12px', flexShrink: 0,
          background: '#f5f5f5',
        }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: '#1a1a2e' }}>
            Bet Slip ({betSlip.length})
          </div>
          <button onClick={() => { /* clear all */ betSlip.forEach((_, i) => onRemove(0)); }} style={{
            background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#888',
          }}>🗑</button>
        </div>

        {/* Slip cards */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '0 12px 12px' }}>
          {betSlip.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#bbb' }}>
              <div style={{ fontSize: 40 }}>🎫</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 8 }}>Slip is empty</div>
            </div>
          ) : betSlip.map((slip, i) => {
            const amt = getAmount(i);
            const estWin = amt * slip.totalNumbers * MULTIPLIER / 10; // adjust formula as needed
            
            // Collect all selected numbers/types for display
            const allBets = Object.entries(slip.bets || {}).flatMap(([col, types]) =>
              (Array.isArray(types) ? types : [types]).map(t => ({ col, val: t }))
            );

            return (
              <div key={i} style={{
                background: '#fff',
                borderRadius: 16,
                padding: '14px 14px',
                marginBottom: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}>
                {/* Top row: label + circles + multiplier + delete */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', flex: 1 }}>
                    {/* Prize + gameType label */}
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>
                      1st Prize | {slip.gameType}:
                    </span>

                    {/* Number circles */}
                    {allBets.slice(0, 6).map((b, j) => (
                      <div key={j} style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: CIRCLE_COLORS[j % CIRCLE_COLORS.length],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 800, color: '#fff',
                        flexShrink: 0,
                      }}>
                        {String(b.val).length > 2 ? b.val.toString().slice(0,2) : b.val}
                      </div>
                    ))}
                    {allBets.length > 6 && (
                      <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>+{allBets.length - 6}</span>
                    )}

                    {/* Multiplier */}
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#f97316' }}>
                      @{MULTIPLIER}
                    </span>
                  </div>

                  {/* Delete this slip */}
                  <button onClick={() => onRemove(i)} style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: '#fee2e2', border: 'none',
                    fontSize: 15, cursor: 'pointer', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>🗑️</button>
                </div>

                {/* Amount input row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <input
                    type="number"
                    value={amt}
                    onChange={e => setAmount(i, e.target.value)}
                    style={{
                      width: 110, padding: '10px 14px',
                      borderRadius: 10, border: '1.5px solid #e5e7eb',
                      fontSize: 18, fontWeight: 800, color: '#1a1a2e',
                      outline: 'none', background: '#fafafa',
                    }}
                  />
                  <div style={{ fontSize: 12, color: '#888', lineHeight: 1.7 }}>
                    <div>Min Bet: {MIN_BET}</div>
                    <div>Max Bet: {MAX_BET}</div>
                  </div>
                </div>

                {/* Est. winning */}
                <div style={{ fontSize: 13, color: '#555', marginBottom: 10, fontWeight: 500 }}>
                  Est. winning:{' '}
                  <span style={{ fontWeight: 800, color: '#16a34a' }}>
                    {estWin.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Quick amount buttons */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[20, 50, 100, 500].map(q => (
                    <button key={q} className="quick-btn" onClick={() => addAmount(i, q)} style={{
                      flex: 1, minWidth: 52,
                      padding: '10px 0',
                      borderRadius: 10, border: 'none',
                      fontSize: 13, fontWeight: 700, color: '#fff',
                      cursor: 'pointer',
                      background: q === 20  ? '#22c55e'
                               : q === 50  ? '#14b8a6'
                               : q === 100 ? '#3b82f6'
                               : '#8b5cf6',
                      transition: 'transform 0.1s',
                    }}>+{q}</button>
                  ))}
                  <button className="quick-btn" onClick={() => setAmount(i, MAX_BET)} style={{
                    flex: 1, minWidth: 52,
                    padding: '10px 0',
                    borderRadius: 10, border: 'none',
                    fontSize: 13, fontWeight: 700, color: '#fff',
                    cursor: 'pointer',
                    background: '#374151',
                    transition: 'transform 0.1s',
                  }}>MAX</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 16px 20px',
          background: '#fff',
          borderTop: '1px solid #eee',
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
        }}>
          {/* Shopping bag icon + total */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg,#9333ea,#d946ef)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>🛍️</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#111' }}>
                ₹{totalAmount.toFixed(2)}
              </div>
              <div style={{ fontSize: 12, color: '#888' }}>
                {totalNumbers} numbers
              </div>
            </div>
          </div>

          {/* Pay Now */}
          <button onClick={() => onPay(amounts)} disabled={!betSlip.length} style={{
            padding: '13px 32px',
            borderRadius: 28, border: 'none',
            fontSize: 15, fontWeight: 700, color: '#fff',
            cursor: betSlip.length ? 'pointer' : 'not-allowed',
            background: betSlip.length
              ? 'linear-gradient(135deg,#9333ea,#d946ef)'
              : '#ddd',
            boxShadow: betSlip.length ? '0 6px 16px rgba(147,51,234,0.35)' : 'none',
          }}>Pay Now</button>
        </div>
      </div>
    </div>
  );
}