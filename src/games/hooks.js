/**
 * hooks.js
 * Shared hooks for State Lottery screens
 */
import { useState, useEffect, useRef, useCallback } from 'react';

/** Countdown timer — returns { hours, minutes, seconds, display, isUrgent } */
export function useCountdown(targetTimeStr) {
  // targetTimeStr like "Apr 03th 14:57"
  const getSecondsLeft = useCallback(() => {
    // For demo: start from 14*3600 + 41*60 + 42 = 53,502 seconds
    // In production: parse targetTimeStr to a real Date
    return 14 * 3600 + 41 * 60 + 42;
  }, [targetTimeStr]);

  const [secs, setSecs] = useState(() => getSecondsLeft());

  useEffect(() => {
    setSecs(getSecondsLeft());
  }, [targetTimeStr]);

  useEffect(() => {
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const h  = Math.floor(secs / 3600);
  const m  = Math.floor((secs % 3600) / 60);
  const s  = secs % 60;
  const pad = n => String(n).padStart(2, '0');

  return {
    hours:   h,
    minutes: m,
    seconds: s,
    display: `${pad(h)}:${pad(m)}:${pad(s)}`,
    hh: pad(h), mm: pad(m), ss: pad(s),
    isUrgent: secs < 300,   // last 5 minutes
    totalSecs: secs,
  };
}

/** Lottery game state — selected bets, totals, submit */
export function useLotteryGame(lotteryId) {
  const [selectedBets, setSelectedBets] = useState([]); // [{column,type,amount}]
  const [activeGameTab, setActiveGameTab]   = useState('TwoSide');
  const [activePrizeTab,setActivePrizeTab]  = useState('1st-prize');
  const [activeHistTab, setActiveHistTab]   = useState('result');
  const [betAmount, setBetAmount]           = useState(10);

  const totalAmount = selectedBets.reduce((s, b) => s + b.amount, 0);
  const totalNumbers = selectedBets.length;

  const toggleBet = useCallback((column, type) => {
    setSelectedBets(prev => {
      const exists = prev.find(b => b.column === column && b.type === type);
      if (exists) return prev.filter(b => !(b.column === column && b.type === type));
      return [...prev, { id: `${column}_${type}`, column, type, amount: betAmount }];
    });
  }, [betAmount]);

  const clearBets = useCallback(() => setSelectedBets([]), []);

  const isBetSelected = useCallback((column, type) =>
    selectedBets.some(b => b.column === column && b.type === type), [selectedBets]);

  return {
    selectedBets, totalAmount, totalNumbers,
    activeGameTab,  setActiveGameTab,
    activePrizeTab, setActivePrizeTab,
    activeHistTab,  setActiveHistTab,
    betAmount, setBetAmount,
    toggleBet, clearBets, isBetSelected,
  };
}
