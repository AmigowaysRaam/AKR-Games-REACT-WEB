/**
 * StateLotteryScreen.jsx
 * ─────────────────────────────────────────────────────────────────
 * THE single reusable screen for ALL state lotteries.
 *
 * Usage — just pass a different lottery config:
 *
 *   import { LOTTERIES } from '../data/lotteryConfig';
 *   import StateLotteryScreen from './StateLotteryScreen';
 *
 *   // Suvarna Keralam
 *   <StateLotteryScreen lottery={LOTTERIES[0]} onBack={...} />
 *
 *   // Nagaland Morning  (identical UI, different data)
 *   <StateLotteryScreen lottery={LOTTERIES[1]} onBack={...} />
 *
 *   // ANY lottery
 *   <StateLotteryScreen lottery={getLotteryById('karunya')} onBack={...} />
 *
 * ─────────────────────────────────────────────────────────────────
 * Tabs:
 *   Top game tabs  → TwoSide | FishPrawnCrab | 1Digit | 2D | 3D | 4D
 *   Prize tabs     → 1st-prize | 2nd-prize
 *   Bottom tabs    → Result history | Analyze | My order
 * ─────────────────────────────────────────────────────────────────
 */


const HIST_TABS = [
  { key: 'result',  label: 'Result history' },
  { key: 'analyze', label: 'Analyze' },
  { key: 'myorder', label: 'My order' },
];

const BET_RULES_INFO =
  'Big: 5,6,7,8,9 | Small: 0,1,2,3,4\nOdd: 1,3,5,7,9  | Even: 0,2,4,6,8';

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import LotteryHeader from "./LotteryHeader";
import TwoSideBetGrid from "./TwoSideBetGrid";
import ResultHistoryTab from "./ResultHistoryTab";
import AnalyzeTab from "./AnalyzeTab";
import { MyOrderTab, RulesModal, BetSummaryBar } from "./MyOrderTab";

import { useCountdown, useLotteryGame } from "./hooks";
import { GAME_TABS, PRIZE_TABS, LOTTERIES } from "../data/lotteryConfig";
import { ChevronLeft } from "lucide-react";

export default function StateLotteryScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const lottery = LOTTERIES.find(l => l.id === id);

  if (!lottery) {
    return <div>Lottery not found</div>;
  }
  const countdown = useCountdown(lottery.nextDraw);
  const game      = useLotteryGame(lottery.id);
  const [showRules, setShowRules] = useState(false);
  const [orders,    setOrders]    = useState([]);
  const [toast,     setToast]     = useState(null);

  /* ── Place bets ── */
  const handlePay = () => {
    if (!game.totalNumbers) return;
    const newOrders = game.selectedBets.map(b => ({
      ...b, issue: lottery.drawNumber, status: 'pending',
    }));
    setOrders(prev => [...newOrders, ...prev]);
    game.clearBets();
    showT(`✅ ${newOrders.length} bet${newOrders.length > 1 ? 's' : ''} placed!`);
  };

  const showT = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

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
            {BET_RULES_INFO}
          </div>
        </div>

        {/* ── MAIN BET GRID (TwoSide tab) ── */}
        {game.activeGameTab === 'TwoSide' ? (
          <div style={{ background: '#f4f2fb' }}>
            <TwoSideBetGrid
              isBetSelected={game.isBetSelected}
              toggleBet={game.toggleBet}
            />
          </div>
        ) : (
          <div style={{
            padding: 40, textAlign: 'center', color: '#bbb', background: '#fff',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎮</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>
              {game.activeGameTab} — Coming Soon
            </div>
            <div style={{ fontSize: 12, marginTop: 6 }}>
              Switch to TwoSide to place bets
            </div>
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
          {game.activeHistTab === 'result'  && <ResultHistoryTab history={lottery.history} />}
          {game.activeHistTab === 'analyze' && <AnalyzeTab history={lottery.history} />}
          {game.activeHistTab === 'myorder' && <MyOrderTab orders={orders} />}

          <div style={{ height: 16 }} />
        </div>
      </div>

      {/* ── STICKY BOTTOM BET BAR ── */}
      <div
            style={{
              position: "fixed",
              bottom: 0,

              // 👇 center it to match app container
              left: "50%",
              transform: "translateX(-50%)",

              // 👇 SAME as your app max width
              width: "100%",
              maxWidth: 420,   // ⚠️ match your layout (420 / 480 etc)

              zIndex: 100,
              background: "#fff",
              borderTop: "1px solid #e5e7eb"
            }}
          >
             <BetSummaryBar
        totalAmount={game.totalAmount}
        totalNumbers={game.totalNumbers}
        onClear={game.clearBets}
        onPay={handlePay}
      />
          </div>
     
    </div>
  );
}
