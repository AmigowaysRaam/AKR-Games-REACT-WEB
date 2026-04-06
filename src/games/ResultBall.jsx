/**
 * ResultBall.jsx
 * Renders a single colored numbered ball used in:
 *   - Previous Result display
 *   - Result History table
 *
 * Props:
 *   digit   {number}  0-9
 *   color   {string}  hex bg color
 *   size    {number}  diameter in px (default 36)
 *   style   {object}  extra styles
 */

import React from 'react';

const PRESET_COLORS = {
  gray:   '#9CA3AF',
  amber:  '#F59E0B',
  blue:   '#3B82F6',
  red:    '#EF4444',
  green:  '#22C55E',
};

export default function ResultBall({ digit, color, size = 36, style = {} }) {
  const bg = color || PRESET_COLORS.gray;
  const fontSize = size * 0.42;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 2px 6px ${bg}60, inset 0 -2px 4px rgba(0,0,0,0.2)`,
        ...style,
      }}
    >
      {/* Shine */}
      <div style={{
        position: 'absolute',
        top: size * 0.1,
        left: size * 0.18,
        width: size * 0.28,
        height: size * 0.18,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.45)',
      }} />
      <span style={{
        color: '#fff',
        fontSize,
        fontWeight: 900,
        lineHeight: 1,
        position: 'relative',
        zIndex: 1,
        textShadow: '0 1px 3px rgba(0,0,0,0.3)',
        fontFamily: "'Poppins', sans-serif",
      }}>
        {digit}
      </span>
    </div>
  );
}

/** Row of 6 result balls — used in Previous Result + History */
export function ResultBallRow({ digits, size = 32 }) {
  // Column color mapping for the 6 positions
  const COL_COLORS = ['#9CA3AF','#9CA3AF','#F59E0B','#3B82F6','#EF4444','#22C55E'];
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {digits.map((d, i) => (
        <ResultBall key={i} digit={d} color={COL_COLORS[i]} size={size} />
      ))}
    </div>
  );
}
