/**
 * LotteryHeader.jsx
 * Shows lottery name, draw number, countdown timer,
 * previous result balls, and Rules button.
 *
 * Completely data-driven — pass lottery config object.
 */
import React from 'react';
import { ResultBallRow } from './ResultBall';

const COLUMN_LABELS = ['A', 'B', 'C', 'D'];
const COLUMN_COLORS_LABEL = {
  A: '#F59E0B', B: '#3B82F6', C: '#EF4444', D: '#22C55E',
};

export default function LotteryHeader({ lottery, countdown, onRules }) {
  const { hh, mm, ss, isUrgent } = countdown;

  return (
    <div style={{
      background: '#f5f5f5',
      borderBottom: '1px solid #e0e0e0',
    }}>
      {/* ── Name + Countdown ── */}
      <div style={{
        background: 'linear-gradient(135deg, #f8f8f8, #ececec)',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Left: logo + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12,
            background: `linear-gradient(135deg, ${lottery.gradient[0]}, ${lottery.gradient[1]})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, boxShadow: `0 4px 14px ${lottery.cardBg}40`,
            flexShrink: 0,
          }}>
            {lottery.logoEmoji}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1a2e', fontFamily: "'Poppins',sans-serif" }}>
              {lottery.name}
            </div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>
              {lottery.drawNumber}
            </div>
          </div>
        </div>

        {/* Right: flip countdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[hh, mm, ss].map((val, i) => (
            <React.Fragment key={i}>
              <div style={{
                background: isUrgent ? '#EF4444' : '#1a1a2e',
                color: '#fff',
                fontSize: 20, fontWeight: 900,
                width: 46, height: 46, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontVariantNumeric: 'tabular-nums',
                fontFamily: 'monospace',
                boxShadow: `0 3px 10px ${isUrgent ? '#EF444480' : '#00000040'}`,
                transition: 'background 0.3s',
              }}>{val}</div>
              {i < 2 && (
                <span style={{
                  color: '#1a1a2e', fontSize: 22, fontWeight: 900, lineHeight: 1,
                }}>:</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Previous Result + Rules ── */}
      <div style={{
        background: '#fff',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        {/* Left: previous result */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 12, color: '#888', fontWeight: 500,
            marginBottom: 8, fontFamily: "'Poppins',sans-serif",
          }}>
            Previous Result :
          </div>

          {/* Column labels A B C D */}
          <div style={{
            display: 'flex', gap: 4, marginBottom: 4,
            paddingLeft: 2,
          }}>
            {/* spacer for row label */}
            <div style={{ width: 60 }} />
            {COLUMN_LABELS.map(col => (
              <div key={col} style={{
                width: 32, textAlign: 'center',
                fontSize: 12, fontWeight: 800,
                color: COLUMN_COLORS_LABEL[col],
              }}>{col}</div>
            ))}
          </div>

          {/* 1st Prize */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#666', width: 60, fontWeight: 500, flexShrink: 0 }}>
              1st Prize :
            </span>
            <ResultBallRow digits={lottery.prevResult['1st']} size={30} />
          </div>

          {/* 2nd Prize */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 11, color: '#666', width: 60, fontWeight: 500, flexShrink: 0 }}>
              2nd Prize :
            </span>
            <ResultBallRow digits={lottery.prevResult['2nd']} size={30} />
          </div>
        </div>

        {/* Right: Rules + Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          <button
            onClick={onRules}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'white', border: '1px solid #ddd', borderRadius: 20,
              padding: '6px 14px', cursor: 'pointer',
              fontSize: 12, fontWeight: 600, color: '#333',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              fontFamily: "'Poppins',sans-serif",
            }}>
            <span style={{
              width: 18, height: 18, borderRadius: '50%',
              background: '#555', color: '#fff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 900,
            }}>?</span>
            Rules
          </button>
          <button style={{
            background: 'white', border: '1px solid #ddd', borderRadius: 8,
            padding: '6px 12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 11, color: '#666',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            📊 <span style={{ fontSize: 10 }}>▼</span>
          </button>
        </div>
      </div>
    </div>
  );
}
