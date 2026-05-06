
const HIST_TABS = [
  { key: 'result',  label: 'Result history' },
  { key: 'analyze', label: 'Analyze' },
  { key: 'myorder', label: 'My order' },
];

const getBetRulesInfo = (tab) => {
  switch (tab) {
    case "TwoSide":
      return "Big: 5,6,7,8,9 | Small: 0,1,2,3,4\nOdd: 1,3,5,7,9 | Even: 0,2,4,6,8";

    case "FishPrawnCrab":
      return "Fish: 1,2,3 | Prawn: 4,5,6 | Crab: 7,8,9";

    case "1Digit":
      return "Select any single number (0–9)";

    case "2D":
      return "Select numbers for C & D positions";

      case "3D":
  return "Select numbers for A, B, C positions";

    case "4D":
      return "Select numbers for A, B, C, D";

      case "2X":
  return "Select numbers for C & D";

case "3X":
  return "Select numbers for A, B, C";

case "4X":
  return "Select numbers for A, B, C, D";

    default:
      return "";
  }
};

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import LotteryHeader from "./LotteryHeader";
import TwoSideBetGrid from "./TwoSideBetGrid";
import ThreeDBetGrid from "./ThreeDBetGrid";
import FourDBetGrid from "./FourDBetGrid";
import TwoDBetGrid from "./TwoDBetGrid";
import FishPrawnCrabBet from "./FishPrawnCrabBet";
import OneDigitBetGrid from "./OneDigitBetGrid";
import ResultHistoryTab from "./ResultHistoryTab";
import AnalyzeTab from "./AnalyzeTab";
import { MyOrderTab, RulesModal, BetSummaryBar , BetSlipModal} from "./MyOrderTab";
import { useCountdown, useLotteryGame } from "./hooks";
import { GAME_TABS, PRIZE_TABS, LOTTERIES } from "../data/lotteryConfig";
import { ChevronLeft } from "lucide-react";
import MultiDigitBetGrid from "./MultiDigitBetGrid";
import { PlaceBetStateLottery } from "../services/gameSevice";

export default function StateLotteryScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const lottery = LOTTERIES.find(l => l.id === id);
  console.log('lottery object:', lottery);

  if (!lottery) {
    return <div>Lottery not found</div>;
  }
  const countdown = useCountdown(lottery.nextDraw);
  const game      = useLotteryGame(lottery.id);
  const [showRules, setShowRules] = useState(false);
  const [orders,    setOrders]    = useState([]);
  const [toast,     setToast]     = useState(null);
  const [betSlip, setBetSlip] = useState([]);
  const [showBetSlipModal, setShowBetSlipModal] = useState(false);

  const [gameId, setGameId] = useState(null);

// ── Tab → API tab name map ──
const GAME_TAB_MAP = {
  'TwoSide':       'twoside',
  '1Digit':        '1digit',
  '2D':            '2d',
  '3D':            '3d',
  '4D':            '4d',
  '2X':            '2x',
  '3X':            '3x',
  '4X':            '4x',
  'FishPrawnCrab': 'fishprawncrab',
};

// ── Prize tab → API prize value ──
const PRIZE_MAP = {
  '1st-prize': '1',
  '2nd-prize': '2',
  'both':      'both',
};

const handleAddToSlip = () => {
  if (!game.isSelectionComplete) {
    showT("⚠️ Please select all required columns");
    return;
  }

  // buildCombinationSlips returns ready-made slips with cartesian applied
  const newSlips = game.buildCombinationSlips(game.activeGameTab);

  setBetSlip(prev => [...prev, ...newSlips]);
  game.clearBets();
  showT(`✅ ${newSlips.length} slip${newSlips.length > 1 ? 's' : ''} added!`);
};

const buildSelections = (slip) => {
  const { gameType, bets } = slip;

  if (gameType === 'TwoSide') {
    // bets = { A: 'odd' } or { B: 'big' } — each slip is 1 bet
    const types  = Object.keys(bets);
    const values = Object.values(bets);
    return { types, values };
  }

  if (gameType === 'FishPrawnCrab') {
    // bets = { D: 'fish' }
    const col = Object.keys(bets)[0];
    return { [col]: [bets[col]] };
  }

  // 1Digit, 2D, 3D, 4D, 2X, 3X, 4X
  // bets = { C: '3', D: '7' } — each value as array
  const selections = {};
  Object.entries(bets).forEach(([col, val]) => {
    selections[col] = [String(val)];
  });
  return selections;
};

// ── GROUP slips into API bets array ──
// Slips with same gameType + prizeTab + amount → merge selections
const buildApiBets = (slipList, amounts) => {
  // Each slip from betSlip is already 1 combination (cartesian result)
  // But API wants them grouped by tab+prize+amount with merged selections
  // So we group by: gameType + prizeTab + amount

  const groups = {};

  slipList.forEach((slip, i) => {
    const amt       = amounts[i] ?? slip.amount;
    const tabKey    = GAME_TAB_MAP[slip.gameType] ?? slip.gameType.toLowerCase();
    const prizeKey  = PRIZE_MAP[game.activePrizeTab] ?? '1';
    const groupKey  = `${tabKey}__${prizeKey}__${amt}`;

    if (!groups[groupKey]) {
      groups[groupKey] = {
        tab:        tabKey,
        prize:      prizeKey,
        amount:     amt,
        slips:      [],
      };
    }
    groups[groupKey].slips.push(slip);
  });

  // Convert each group into one API bet entry
  return Object.values(groups).map(group => {
    const { tab, prize, amount, slips } = group;

    // Merge all slip selections
    if (tab === 'twoside') {
      const types  = slips.map(s => Object.keys(s.bets)[0]);
      const values = slips.map(s => Object.values(s.bets)[0]);
      return { tab, prize, selections: { types, values }, amount };
    }

    if (tab === 'fishprawncrab') {
      const selections = {};
      slips.forEach(s => {
        Object.entries(s.bets).forEach(([col, val]) => {
          if (!selections[col]) selections[col] = [];
          selections[col].push(String(val));
        });
      });
      return { tab, prize, selections, amount };
    }

    // 2d / 3d / 4d / 2x / 3x / 4x / 1digit
    const selections = {};
    slips.forEach(s => {
      Object.entries(s.bets).forEach(([col, val]) => {
        if (!selections[col]) selections[col] = [];
        if (!selections[col].includes(String(val))) {
          selections[col].push(String(val));
        }
      });
    });
    return { tab, prize, selections, amount };
  });
};

// ── UPDATED handleFinalPay ──
const handleFinalPay = async (amounts = {}) => {
  if (!betSlip.length) return;
  if (!gameId) { showT("⚠️ Game not loaded yet"); return; }

  const bets = buildApiBets(betSlip, amounts);

  const payload = {
    user_id: 7,       // ← replace with your auth user id
    game_id: gameId,
    bets,
  };

  console.log('PlaceBet payload:', JSON.stringify(payload, null, 2));

  try {
    const res = await PlaceBetStateLottery(payload);

    if (res.success) {
      // Save to local orders with API response data
      const newOrders = betSlip.map((slip, i) => ({
        issue:       lottery.drawNumber,
        gameType:    slip.gameType,
        bets:        slip.bets,
        totalNumbers: slip.totalNumbers,
        amount:      amounts[i] ?? slip.amount,
        status:      'pending',
        betId:       res.bet_ids?.[i] ?? null,
      }));

      setOrders(prev => [...newOrders, ...prev]);
      setBetSlip([]);
      showT(`🎉 ${res.slip_count} slip(s) placed! Est. win ₹${res.estimated_win}`);
    } else {
      showT(`❌ ${res.message ?? 'Bet failed'}`);
    }
  } catch (err) {
    console.error('PlaceBet error:', err);
    showT('❌ Something went wrong');
  }
};


  /* ── Place bets ── */
  const handlePay = () => {
  if (!game.totalNumbers) return;

  const grouped = game.selectedBets.reduce((acc, b) => {
    if (!acc[b.column]) acc[b.column] = [];
    acc[b.column].push(b.type);
    return acc;
  }, {});

  const order = {
    issue: lottery.drawNumber,
    gameType: game.activeGameTab,
    bets: grouped,
    totalNumbers: game.totalNumbers,
    amount: game.totalAmount,
    status: "pending"
  };

  setOrders(prev => [order, ...prev]);

  game.clearBets();

  showT(`✅ ${order.totalNumbers} bet${order.totalNumbers > 1 ? 's' : ''} added!`);
};

  const showT = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const ROWS_2X = [
  { key: "C", color: "#EF4444" },
  { key: "D", color: "#22C55E" }
];

const ROWS_3X = [
  { key: "A", color: "#3B82F6" }, // blue
  { key: "B", color: "#F59E0B" }, // orange
  { key: "C", color: "#EF4444" }  // red
];

const ROWS_4X = [
  { key: "A", color: "#3B82F6" },
  { key: "B", color: "#F59E0B" },
  { key: "C", color: "#EF4444" },
  { key: "D", color: "#22C55E" }
];

  /* ─────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────── */
  return (
    <div style={{
      maxWidth: 430, margin: '0 auto',
      background: '#f4f2fb', minHeight: '100vh',
      fontFamily: "'Poppins','Segoe UI',sans-serif",
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        ::-webkit-scrollbar { display: none; }
        button:active { opacity: 0.85; }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', top: 70, left: '50%', transform: 'translateX(-50%)',
          background: '#1a1a2e', color: '#fff', padding: '10px 22px',
          borderRadius: 24, fontSize: 13, fontWeight: 700, zIndex: 999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)', whiteSpace: 'nowrap',
          animation: 'fadeDown 0.3s ease',
        }}>{toast}</div>
      )}

      {/* RULES MODAL */}
      <RulesModal
        visible={showRules}
        lotteryName={lottery.name}
        onClose={() => setShowRules(false)}
      />

      {/* ── STICKY HEADER ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        {/* Nav bar */}
        <div style={{
          background: '#fff', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 16px', height: 52,
          borderBottom: '1px solid #e8e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <button onClick={() => navigate(-1)} style={{
            width: 34, height: 34, borderRadius: '50%', background: '#f4f4f8',
            border: 'none', cursor: 'pointer', fontSize: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><ChevronLeft/></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>
              {lottery.shortName || lottery.name}
            </span>
            <span style={{ fontSize: 13, color: '#888' }}>▾</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#888' }}>Balance</span>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>💳</div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>

        {/* ── LOTTERY HEADER (countdown + prev result) ── */}
        <LotteryHeader
          lottery={lottery}
          countdown={countdown}
          onRules={() => setShowRules(true)}
          onGameIdReady={(id) => setGameId(id)}
        />

        {/* ── GAME TABS ── */}
        <div style={{
          background: '#fff', borderBottom: '2px solid #f0eef8',
          display: 'flex', overflowX: 'auto',
        }}>
          {GAME_TABS.map(tab => (
            <button key={tab} onClick={() => game.setActiveGameTab(tab)} style={{
              flexShrink: 0, padding: '12px 16px',
              fontSize: 14, fontWeight: game.activeGameTab === tab ? 800 : 500,
              color: game.activeGameTab === tab ? '#1a1a2e' : '#888',
              background: 'none', border: 'none', cursor: 'pointer',
              position: 'relative',
            }}>
              {tab}
              {game.activeGameTab === tab && (
                <div style={{
                  position: 'absolute', bottom: -2, left: '10%', right: '10%',
                  height: 3, background: '#7c3aed', borderRadius: 2,
                }} />
              )}
            </button>
          ))}
        </div>

        {/* ── PRIZE TABS ── */}
        <div style={{
          background: '#fff', padding: '10px 16px',
          display: 'flex', gap: 8, borderBottom: '1px solid #f0eef8',
        }}>
          {PRIZE_TABS.map(pt => (
            <button key={pt} onClick={() => game.setActivePrizeTab(pt)} style={{
              padding: '7px 18px', borderRadius: 20,
              background: game.activePrizeTab === pt ? '#1a1a2e' : 'transparent',
              color: game.activePrizeTab === pt ? '#fff' : '#888',
              border: `1px solid ${game.activePrizeTab === pt ? '#1a1a2e' : '#ddd'}`,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s',
            }}>{pt}</button>
          ))}
        </div>

        {/* ── BET RULES INFO ── */}
        <div style={{
          background: '#f9f8ff', padding: '10px 16px',
          borderBottom: '1px solid #f0eef8',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%', background: '#ccc',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, color: '#fff', fontWeight: 900, flexShrink: 0,
          }}>!</div>
          <div style={{ fontSize: 11, color: '#555', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
            {getBetRulesInfo(game.activeGameTab)}
          </div>
        </div>

        {/* ── MAIN BET GRID (TwoSide tab) ── */}
        {game.activeGameTab === 'TwoSide' ? (
  <TwoSideBetGrid
    isBetSelected={game.isBetSelected}
    toggleBet={game.toggleBet}
  />

) : game.activeGameTab === '1Digit' ? (
  <OneDigitBetGrid
    isBetSelected={game.isBetSelected}
    toggleBet={game.toggleBet}
  />

) : game.activeGameTab === '2D' ? (
<TwoDBetGrid
  isBetSelected={game.isBetSelected}
  toggleBet={game.toggleBet}
/>


  ) : game.activeGameTab === '3D' ? (  
  <ThreeDBetGrid
    isBetSelected={game.isBetSelected}
    toggleBet={game.toggleBet}
  />

) : game.activeGameTab === '4D' ? (
  <FourDBetGrid
    isBetSelected={game.isBetSelected}
    toggleBet={game.toggleBet}
  />

) : game.activeGameTab === 'FishPrawnCrab' ? (
  <FishPrawnCrabBet
    isBetSelected={game.isBetSelected}
    toggleBet={game.toggleBet}
  />
): game.activeGameTab === '2X' ? (
  <MultiDigitBetGrid
    rows={ROWS_2X}
    isBetSelected={game.isBetSelected}
    toggleBet={game.toggleBet}
  />
):

game.activeGameTab === '3X' ?(
  <MultiDigitBetGrid
    rows={ROWS_3X}
    isBetSelected={game.isBetSelected}
    toggleBet={game.toggleBet}
  />
):

game.activeGameTab === '4X'?(
  <MultiDigitBetGrid
    rows={ROWS_4X}
    isBetSelected={game.isBetSelected}
    toggleBet={game.toggleBet}
  />
): (
  <div style={{
    padding: 40,
    textAlign: 'center',
    color: '#bbb',
    background: '#fff'
  }}>
    <div style={{ fontSize: 40 }}>🎮</div>
    <div style={{ fontWeight: 600 }}>
      {game.activeGameTab} — Coming Soon
    </div>
  </div>
)}
{game.isSelectionComplete  && (
  <div style={{
    background: "#fff",
    padding: "14px 16px",
    borderTop: "1px solid #eee"
  }}>
    <BetSummaryBar
      totalAmount={game.totalAmount}
      totalNumbers={game.totalNumbers}
      onClear={game.clearBets}
      onPay={handleAddToSlip}
      label="Add to bet slip"
       disabled={!game.isSelectionComplete}
    />
  </div>
)}


        {/* ── RESULT HISTORY SECTION ── */}
        <div style={{ background: '#fff', marginTop: 8 }}>
          {/* Tab strip */}
          <div style={{ display: 'flex', borderBottom: '2px solid #f0eef8' }}>
            {HIST_TABS.map(({ key, label }) => (
              <button key={key} onClick={() => game.setActiveHistTab(key)} style={{
                flex: 1, padding: '13px 4px', textAlign: 'center',
                fontSize: 13, fontWeight: 600,
                color: game.activeHistTab === key ? '#1a1a2e' : '#888',
                background: 'none', border: 'none', cursor: 'pointer',
                position: 'relative',
              }}>
                {label}
                {game.activeHistTab === key && (
                  <div style={{
                    position: 'absolute', bottom: -2, left: '15%', right: '15%',
                    height: 3, background: '#7c3aed', borderRadius: 2,
                  }} />
                )}
              </button>
            ))}
          </div>


          {/* Tab content */}
{game.activeHistTab === 'result' && (
  <ResultHistoryTab
    lotteryKey={lottery.key ?? lottery.id}  // ← use whichever field has the key
  />
)}
          {game.activeHistTab === 'analyze' && <AnalyzeTab history={lottery.history} />}
          {game.activeHistTab === 'myorder' && <MyOrderTab orders={orders} />}

          <div style={{ height: 16 }} />
        </div>
      </div>

{/* ── FIXED PAY BAR (BOTTOM) ── */}
<div style={{
  position: "fixed",
  bottom: 0,
  left: "50%",
  transform: "translateX(-50%)",
  width: "100%",
  maxWidth: 420,
  background: "#fff",
  borderTop: "1px solid #eee",
  padding: "12px 16px",
  boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
  zIndex: 100
}}>
  <BetSummaryBar
    totalAmount={betSlip.reduce((s,b)=>s+b.amount,0)}
    totalNumbers={betSlip.reduce((s,b)=>s+b.totalNumbers,0)}
    onClear={() => setBetSlip([])}
    onPay={handleFinalPay}
    onAmountClick={() => betSlip.length && setShowBetSlipModal(true)}  // 👈 NEW
    label="Pay Now"
  />
</div>

{/* ── BET SLIP MODAL ── */}
<BetSlipModal
  visible={showBetSlipModal}
  betSlip={betSlip}
  onClose={() => setShowBetSlipModal(false)}
  onRemove={(i) => setBetSlip(prev => prev.filter((_, idx) => idx !== i))}
  onPay={(amounts) => {
  handleFinalPay(amounts);
  setShowBetSlipModal(false);
}}
/>

     
    </div>
  );
}
