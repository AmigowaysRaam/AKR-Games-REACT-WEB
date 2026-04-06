/**
 * lotteryConfig.js
 * ─────────────────────────────────────────────────────────
 * Single source of truth for ALL state lotteries.
 * To add a new lottery → add one object to LOTTERIES array.
 * The StateLotteryScreen component renders identically for
 * every lottery — only the config values differ.
 * ─────────────────────────────────────────────────────────
 */

// ─── BALL COLOR SYSTEM ────────────────────────────────────────────────────────
// Each lottery has 4 digit columns: A, B, C, D
// Each column gets its own color — used for balls + border accents
export const COLUMN_COLORS = {
  A: { bg: '#F59E0B', text: '#fff', border: '#D97706', label: 'A' }, // amber
  B: { bg: '#3B82F6', text: '#fff', border: '#2563EB', label: 'B' }, // blue
  C: { bg: '#EF4444', text: '#fff', border: '#DC2626', label: 'C' }, // red
  D: { bg: '#22C55E', text: '#fff', border: '#16A34A', label: 'D' }, // green
};

// Number → ball color for Previous Result display (0–9)
export const DIGIT_COLORS = [
  '#9CA3AF', // 0 — gray
  '#9CA3AF', // 1 — gray
  '#9CA3AF', // 2 — gray
  '#9CA3AF', // 3 — gray
  '#F59E0B', // 4 — amber
  '#EF4444', // 5 — red
  '#9CA3AF', // 6 — gray
  '#F59E0B', // 7 — amber
  '#3B82F6', // 8 — blue
  '#F59E0B', // 9 — amber (orange)
];

// Override per-column using COLUMN_COLORS for the result balls
export function getResultBallColor(digit, columnIndex) {
  const cols = [
    '#9CA3AF', // col 0 (A1, A2) — gray
    '#9CA3AF', // col 1
    '#F59E0B', // col 2 (B) — amber/orange
    '#3B82F6', // col 3 (C) — blue
    '#EF4444', // col 4 (C2/D) — red
    '#22C55E', // col 5 (D) — green
  ];
  return cols[columnIndex] ?? '#9CA3AF';
}

// ─── BET TYPES (shared across all lotteries) ─────────────────────────────────
export const BET_TYPES = [
  { id: 'odd',   label: 'Odd',   multiplier: 1.95 },
  { id: 'even',  label: 'Even',  multiplier: 1.95 },
  { id: 'big',   label: 'Big',   multiplier: 1.95 },
  { id: 'small', label: 'Small', multiplier: 1.95 },
];

// BIG / SMALL / ODD / EVEN rules
export const BET_RULES = {
  big:   'Big:  5,6,7,8,9',
  small: 'Small: 0,1,2,3,4',
  odd:   'Odd:  1,3,5,7,9',
  even:  'Even: 0,2,4,6,8',
};

// ─── GAME TABS ─────────────────────────────────────────────────────────────
export const GAME_TABS = ['TwoSide', 'FishPrawnCrab', '1Digit', '2D', '3D', '4D'];

// ─── PRIZE TABS ───────────────────────────────────────────────────────────────
export const PRIZE_TABS = ['1st-prize', '2nd-prize'];

// ─── LOTTERY CONFIGURATIONS ────────────────────────────────────────────────
// Add / remove / modify lotteries here. The UI adapts automatically.
export const LOTTERIES = [
    {
    id: 'nagaland_morning',
    nav:'nagaland_morning',
    name: 'Nagaland Morning',
    shortName: 'Nagaland Mor...',
    drawNumber: 'Draw No.Dear 1 PM',
    jackpot: '₹9,60,000',
    nextDraw: 'Apr 03th 12:57',
    gradient: ['#2563EB', '#3B82F6'],     // blue
    cardBg: '#2563EB',
    logoEmoji: '🌅',
    logoUrl: null,
    drawDay: 'Daily',
    drawTime: '12:57',
    drawFrequency: 'Daily',
    prevResult: {
      '1st': [2, 5, 7, 3, 8, 1],
      '2nd': [6, 0, 4, 9, 2, 5],
    },
    history: [
      { date: '03/04/2026', dateISO: '03-04-2026', time: '12:57 PM', first:[2,5,7,3,8,1], second:[6,0,4,9,2,5] },
      { date: '02/04/2026', dateISO: '02-04-2026', time: '12:57 PM', first:[4,1,6,0,9,3], second:[7,2,5,8,1,4] },
      { date: '01/04/2026', dateISO: '01-04-2026', time: '12:57 PM', first:[8,3,2,7,5,6], second:[0,9,1,4,3,8] },
      { date: '31/03/2026', dateISO: '31-03-2026', time: '12:57 PM', first:[5,7,9,1,4,2], second:[3,6,0,7,8,9] },
      { date: '30/03/2026', dateISO: '30-03-2026', time: '12:57 PM', first:[1,4,3,8,6,7], second:[9,5,2,3,0,1] },
    ],
  },
    {
    id: 'karunya',
    nav: 'karunya',
    name: 'Karunya',
    shortName: 'Karunya',
    drawNumber: 'Draw No.KR-700',
    jackpot: '₹9,60,000',
    nextDraw: 'Apr 04th 14:57',
    gradient: ['#D97706', '#F59E0B'],     // amber
    cardBg: '#D97706',
    logoEmoji: '🌸',
    logoUrl: null,
    drawDay: 'Saturday',
    drawTime: '14:57',
    drawFrequency: 'Weekly',
    prevResult: {
      '1st': [5, 1, 7, 4, 8, 2],
      '2nd': [9, 3, 6, 0, 5, 7],
    },
    history: [
      { date: '29/03/2026', dateISO: '29-03-2026', time: '02:57 PM', first:[5,1,7,4,8,2], second:[9,3,6,0,5,7] },
      { date: '22/03/2026', dateISO: '22-03-2026', time: '02:57 PM', first:[3,7,1,9,5,4], second:[6,0,8,2,3,1] },
      { date: '15/03/2026', dateISO: '15-03-2026', time: '02:57 PM', first:[8,4,6,2,0,9], second:[2,5,3,7,4,6] },
    ],
  },
    {
    id: 'nagaland_day',
    nav: 'nagaland_day',
    name: 'Nagaland Day',
    shortName: 'Nagaland Day...',
    drawNumber: 'Draw No.Dear 6 PM',
    jackpot: '₹9,60,000',
    nextDraw: 'Apr 03th 17:57',
    gradient: ['#EA580C', '#F97316'],     // orange
    cardBg: '#EA580C',
    logoEmoji: '🌤️',
    logoUrl: null,
    drawDay: 'Daily',
    drawTime: '17:57',
    drawFrequency: 'Daily',
    prevResult: {
      '1st': [7, 2, 4, 9, 1, 6],
      '2nd': [3, 8, 5, 0, 7, 2],
    },
    history: [
      { date: '03/04/2026', dateISO: '03-04-2026', time: '05:57 PM', first:[7,2,4,9,1,6], second:[3,8,5,0,7,2] },
      { date: '02/04/2026', dateISO: '02-04-2026', time: '05:57 PM', first:[5,0,8,3,6,9], second:[1,4,7,2,5,8] },
      { date: '01/04/2026', dateISO: '01-04-2026', time: '05:57 PM', first:[9,6,1,4,3,7], second:[2,5,0,8,9,3] },
    ],
  },
  {
    id: 'nagaland_evening',
    nav: 'nagaland_evening',
    name: 'Nagaland Evening',
    shortName: 'Nagaland Eve...',
    drawNumber: 'Draw No.Dear 8 PM',
    jackpot: '₹9,60,000',
    nextDraw: 'Apr 03th 19:57',
    gradient: ['#7C3AED', '#6D28D9'],     // deep purple
    cardBg: '#6D28D9',
    logoEmoji: '🌙',
    logoUrl: null,
    drawDay: 'Daily',
    drawTime: '19:57',
    drawFrequency: 'Daily',
    prevResult: {
      '1st': [4, 8, 2, 6, 3, 9],
      '2nd': [7, 1, 5, 0, 8, 4],
    },
    history: [
      { date: '03/04/2026', dateISO: '03-04-2026', time: '07:57 PM', first:[4,8,2,6,3,9], second:[7,1,5,0,8,4] },
      { date: '02/04/2026', dateISO: '02-04-2026', time: '07:57 PM', first:[1,6,9,3,7,5], second:[8,2,4,1,6,0] },
    ],
  },
 
  {
    id: 'bhagyathara',
    nav: 'bhagyathara',
    name: 'Bhagyathara',
    shortName: 'Bhagyathara',
    drawNumber: 'Draw No.BT-150',
    jackpot: '₹9,60,000',
    nextDraw: 'Apr 06th 14:57',
    gradient: ['#92400E', '#B45309'],     // brown
    cardBg: '#92400E',
    logoEmoji: '⭐',
    logoUrl: null,
    drawDay: 'Monday',
    drawTime: '14:57',
    drawFrequency: 'Weekly',
    prevResult: {
      '1st': [1, 7, 3, 9, 5, 0],
      '2nd': [4, 8, 2, 6, 1, 7],
    },
    history: [
      { date: '31/03/2026', dateISO: '31-03-2026', time: '02:57 PM', first:[1,7,3,9,5,0], second:[4,8,2,6,1,7] },
      { date: '24/03/2026', dateISO: '24-03-2026', time: '02:57 PM', first:[6,2,8,4,0,3], second:[9,5,1,7,2,8] },
    ],
  },
  {
    id: 'sthree_sakthi',
    nav: 'sthree_sakthi',
    name: 'Sthree Sakthi',
    shortName: 'Sthree Sakthi',
    drawNumber: 'Draw No.SS-400',
    jackpot: '₹9,60,000',
    nextDraw: 'Apr 07th 14:57',
    gradient: ['#166534', '#16A34A'],     // green
    cardBg: '#166534',
    logoEmoji: '🌺',
    logoUrl: null,
    drawDay: 'Tuesday',
    drawTime: '14:57',
    drawFrequency: 'Weekly',
    prevResult: {
      '1st': [8, 4, 0, 7, 2, 6],
      '2nd': [3, 9, 5, 1, 8, 4],
    },
    history: [
      { date: '01/04/2026', dateISO: '01-04-2026', time: '02:57 PM', first:[8,4,0,7,2,6], second:[3,9,5,1,8,4] },
      { date: '25/03/2026', dateISO: '25-03-2026', time: '02:57 PM', first:[2,6,4,0,9,5], second:[7,3,1,8,4,0] },
    ],
  },
  {
    id: 'dhanalekshmi',
    nav: 'dhanalekshmi',
    name: 'Dhanalekshmi',
    shortName: 'Dhanalekshmi',
    drawNumber: 'Draw No.DL-100',
    jackpot: '₹9,60,000',
    nextDraw: 'Apr 08th 14:57',
    gradient: ['#9D174D', '#EC4899'],     // pink
    cardBg: '#9D174D',
    logoEmoji: '🏵️',
    logoUrl: null,
    drawDay: 'Wednesday',
    drawTime: '14:57',
    drawFrequency: 'Weekly',
    prevResult: {
      '1st': [5, 9, 3, 1, 7, 4],
      '2nd': [0, 6, 8, 2, 5, 9],
    },
    history: [
      { date: '02/04/2026', dateISO: '02-04-2026', time: '02:57 PM', first:[5,9,3,1,7,4], second:[0,6,8,2,5,9] },
      { date: '26/03/2026', dateISO: '26-03-2026', time: '02:57 PM', first:[7,1,5,3,9,2], second:[4,8,0,6,1,7] },
    ],
  },
  {
    id: 'karunya_plus',
    nav: 'karunya_plus',
    name: 'Karunya Plus',
    shortName: 'Karunya Plus',
    drawNumber: 'Draw No.KN-600',
    jackpot: '₹9,60,000',
    nextDraw: 'Apr 09th 14:57',
    gradient: ['#1D4ED8', '#3B82F6'],     // blue
    cardBg: '#1D4ED8',
    logoEmoji: '💰',
    logoUrl: null,
    drawDay: 'Thursday',
    drawTime: '14:57',
    drawFrequency: 'Weekly',
    prevResult: {
      '1st': [3, 8, 6, 2, 9, 5],
      '2nd': [1, 4, 7, 0, 3, 8],
    },
    history: [
      { date: '03/04/2026', dateISO: '03-04-2026', time: '02:57 PM', first:[3,8,6,2,9,5], second:[1,4,7,0,3,8] },
      { date: '27/03/2026', dateISO: '27-03-2026', time: '02:57 PM', first:[0,5,9,4,1,7], second:[6,2,3,8,5,0] },
    ],
  },
     {
    id: 'suvarna_keralam',
    nav: 'suvarna_keralam',
    name: 'Suvarna Keralam',
    shortName: 'Suvarna Ker...',
    drawNumber: 'Draw No.03/04/2026',
    jackpot: '₹9,60,000',
    nextDraw: 'Apr 03th 14:57',
    gradient: ['#7C3AED', '#A855F7'],     // purple
    cardBg: '#7C3AED',
    logoEmoji: '🎰',
    logoUrl: 'https://www.singamlottery.com/assets/images/lottery/suvarna.webp',
    drawDay: 'Thursday',
    drawTime: '14:57',
    drawFrequency: 'Weekly',
    // Previous result balls (6 digits shown as A,B,C,D columns)
    prevResult: {
      '1st': [3, 6, 9, 0, 5, 7],
      '2nd': [4, 1, 9, 4, 4, 3],
    },
    // Historical results for Result History tab
    history: [
      { date: '27/03/2026', dateISO: '27-03-2026', time: '02:57 PM', first:[3,6,9,0,5,7], second:[4,1,9,4,4,3] },
      { date: '20/03/2026', dateISO: '20-03-2026', time: '02:57 PM', first:[2,5,8,4,5,3], second:[5,7,4,3,1,5] },
      { date: '13/03/2026', dateISO: '13-03-2026', time: '02:57 PM', first:[5,2,0,8,7,5], second:[5,5,8,6,5,8] },
      { date: '06/03/2026', dateISO: '06-03-2026', time: '02:57 PM', first:[6,0,7,8,4,4], second:[8,6,5,6,8,8] },
      { date: '27/02/2026', dateISO: '27-02-2026', time: '02:57 PM', first:[1,6,1,8,6,2], second:[2,4,7,2,5,2] },
      { date: '20/02/2026', dateISO: '20-02-2026', time: '02:57 PM', first:[2,4,5,6,8,9], second:[8,3,2,0,1,2] },
      { date: '13/02/2026', dateISO: '13-02-2026', time: '02:57 PM', first:[7,9,7,6,6,5], second:[7,2,3,6,3,4] },
      { date: '06/02/2026', dateISO: '06-02-2026', time: '02:57 PM', first:[2,2,7,8,7,3], second:[6,0,4,7,2,0] },
      { date: '30/01/2026', dateISO: '30-01-2026', time: '02:57 PM', first:[2,0,7,4,7,3], second:[8,1,5,4,7,4] },
      { date: '23/01/2026', dateISO: '23-01-2026', time: '02:57 PM', first:[3,4,6,2,9,1], second:[1,8,3,5,6,7] },
    ],
  },
];

// Helper — get lottery by id
export const getLotteryById = (id) => LOTTERIES.find(l => l.id === id);
