/**
 * TwoSideBetGrid.jsx
 * Renders the Odd / Even / Big / Small betting grid
 * for columns A, B, C, D — exactly as in the screenshots.
 *
 * Completely reusable — same component for all lotteries.
 */
import React from 'react';

const COLUMNS = [
  { key: 'A', color: '#F59E0B', dotColor: '#F59E0B', borderColor: '#D97706' },
  { key: 'B', color: '#3B82F6', dotColor: '#3B82F6', borderColor: '#2563EB' },
  { key: 'C', color: '#EF4444', dotColor: '#EF4444', borderColor: '#DC2626' },
  { key: 'D', color: '#22C55E', dotColor: '#22C55E', borderColor: '#16A34A' },
];

const BET_CELLS = [
  { id: 'odd',   label: 'Odd',   payout: '1.95X' },
  { id: 'even',  label: 'Even',  payout: '1.95X' },
  { id: 'big',   label: 'Big',   payout: '1.95X' },
  { id: 'small', label: 'Small', payout: '1.95X' },
];

export default function TwoSideBetGrid({ prizePrize, isBetSelected, toggleBet }) {
  return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {COLUMNS.map(col => (
        <ColumnRow
          key={col.key}
          col={col}
          isBetSelected={isBetSelected}
          toggleBet={toggleBet}
        />
      ))}
    </div>
  );
}

function ColumnRow({ col, isBetSelected, toggleBet }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {/* Column label + dot */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 4, width: 22, flexShrink: 0,
      }}>
        <span style={{
          fontSize: 15, fontWeight: 800, color: col.color,
          fontFamily: "'Poppins',sans-serif",
        }}>{col.key}</span>
        <div style={{
          width: 14, height: 14, borderRadius: '50%',
          backgroundColor: col.dotColor,
          boxShadow: `0 2px 6px ${col.dotColor}60`,
        }} />
      </div>

      {/* 4 bet cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, flex: 1 }}>
        {BET_CELLS.map(cell => {
          const sel = isBetSelected(col.key, cell.id);
          return (
            <BetCell
              key={cell.id}
              cell={cell}
              col={col}
              selected={sel}
              onPress={() => toggleBet(col.key, cell.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

function BetCell({ cell, col, selected, onPress }) {
  return (
    <button
      onClick={onPress}
      style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '10px 4px', borderRadius: 10,
        border: `2px solid ${selected ? col.borderColor : col.borderColor + '60'}`,
        background: selected ? col.color + '18' : '#fff',
        cursor: 'pointer',
        gap: 2,
        transition: 'all 0.15s',
        transform: selected ? 'scale(1.04)' : 'scale(1)',
        boxShadow: selected ? `0 3px 12px ${col.color}30` : '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      <span style={{
        fontSize: 13, fontWeight: 700,
        color: selected ? col.color : '#333',
        fontFamily: "'Poppins',sans-serif",
        lineHeight: 1.2,
      }}>{cell.label}</span>
      <span style={{
        fontSize: 11, fontWeight: 500,
        color: selected ? col.color : '#888',
        fontFamily: "'Poppins',sans-serif",
      }}>{cell.payout}</span>
    </button>
  );
}
