/**
 * hooks.js
 * Shared hooks for State Lottery screens
 */
import { useState, useEffect, useCallback } from 'react';

// ─── CARTESIAN PRODUCT ────────────────────────────────────────────────────────
export function cartesian(arrays) {
  return arrays.reduce(
    (acc, arr) => acc.flatMap(combo => arr.map(val => [...combo, val])),
    [[]]
  );
}

// ─── CONSTANTS (outside hook so they're stable references) ───────────────────
const REQUIRED_COLUMNS_MAP = {
  "2D": ["C", "D"],
  "3D": ["B", "C", "D"],
  "4D": ["A", "B", "C", "D"],
  "2X": ["C", "D"],
  "3X": ["A", "B", "C"],
  "4X": ["A", "B", "C", "D"],
};

const COMBO_GAMES = new Set(['2D','3D','4D','2X','3X','4X']);

/** Countdown timer */
export function useCountdown(targetTimeStr) {
  const getSecondsLeft = useCallback(() => {
    return 14 * 3600 + 41 * 60 + 42;
  }, [targetTimeStr]);

  const [secs, setSecs] = useState(() => getSecondsLeft());

  useEffect(() => { setSecs(getSecondsLeft()); }, [targetTimeStr]);

  useEffect(() => {
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const h   = Math.floor(secs / 3600);
  const m   = Math.floor((secs % 3600) / 60);
  const s   = secs % 60;
  const pad = n => String(n).padStart(2, '0');

  return {
    hours: h, minutes: m, seconds: s,
    display: `${pad(h)}:${pad(m)}:${pad(s)}`,
    hh: pad(h), mm: pad(m), ss: pad(s),
    isUrgent: secs < 300,
    totalSecs: secs,
  };
}

/** Lottery game state */
export function useLotteryGame(lotteryId) {
  const [selectedBets,   setSelectedBets]   = useState([]);
  const [activeGameTab,  setActiveGameTab]   = useState('TwoSide');
  const [activePrizeTab, setActivePrizeTab]  = useState('1st-prize');
  const [activeHistTab,  setActiveHistTab]   = useState('result');
  const [betAmount,      setBetAmount]       = useState(10);

  const isComboGame = COMBO_GAMES.has(activeGameTab);

  // { C: [2,3], D: [3] }
  const groupedBets = selectedBets.reduce((acc, b) => {
    if (!acc[b.column]) acc[b.column] = [];
    acc[b.column].push(b.type);
    return acc;
  }, {});

  const isSelectionComplete = isComboGame
    ? (REQUIRED_COLUMNS_MAP[activeGameTab] || []).every(
        col => groupedBets[col] && groupedBets[col].length > 0
      )
    : selectedBets.length > 0;

  // Total combination count  e.g. C:[2,3] D:[3] → 2
  const totalNumbers = isComboGame
    ? Object.values(groupedBets).length
      ? Object.values(groupedBets).reduce((acc, arr) => acc * arr.length, 1)
      : 0
    : selectedBets.length;

  const totalAmount = isComboGame
    ? totalNumbers * betAmount
    : selectedBets.reduce((s, b) => s + b.amount, 0);

  // ── toggleBet ──────────────────────────────────────────────────────────────
  const toggleBet = useCallback((column, type) => {
    setSelectedBets(prev => {
      const exists = prev.find(b => b.column === column && b.type === type);
      if (exists) return prev.filter(b => !(b.column === column && b.type === type));
      return [...prev, { id: `${column}_${type}`, column, type, amount: betAmount }];
    });
  }, [betAmount]);

  const clearBets     = useCallback(() => setSelectedBets([]), []);
  const isBetSelected = useCallback((column, type) =>
    selectedBets.some(b => b.column === column && b.type === type),
  [selectedBets]);

  // ── buildCombinationSlips ─────────────────────────────────────────────────
  // Plain function (not useCallback) — reads current state directly
  function buildCombinationSlips() {
    if (!COMBO_GAMES.has(activeGameTab)) {
      // TwoSide / 1Digit / FishPrawnCrab — each selected bet = one slip
      return selectedBets.map(b => ({
        gameType: activeGameTab,
        bets: { [b.column]: b.type },
        totalNumbers: 1,
        amount: betAmount,
      }));
    }

    const columns        = REQUIRED_COLUMNS_MAP[activeGameTab] || [];
    const valuesPerCol   = columns.map(col => groupedBets[col] ?? []);

    // e.g. C:[2,3] D:[3]  →  [[2,3],[3,3]]
    const combos = cartesian(valuesPerCol);

    return combos.map(combo => {
      const betMap = {};
      columns.forEach((col, i) => { betMap[col] = combo[i]; });
      return {
        gameType: activeGameTab,
        bets: betMap,        // { C: 2, D: 3 }  ← single values
        totalNumbers: 1,
        amount: betAmount,
      };
    });
  }

  return {
    selectedBets, totalAmount, totalNumbers,
    activeGameTab,  setActiveGameTab,
    activePrizeTab, setActivePrizeTab,
    activeHistTab,  setActiveHistTab,
    betAmount, setBetAmount,
    toggleBet, clearBets, isBetSelected,
    groupedBets, isSelectionComplete,
    buildCombinationSlips,   // ← now a plain function, always fresh
  };
}