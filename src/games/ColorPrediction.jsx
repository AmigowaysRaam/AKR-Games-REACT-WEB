import { ChevronLeft } from "lucide-react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import colorRed from "../assets/colorred.png";
import colorGreen from "../assets/colorgreen.png";
import colorRedViolet from "../assets/colorredviolet.png";
import colorGreenViolet from "../assets/colorgreenviolet.png"
import { getColorGame, getColorHistory, placeColorBet, getColorUserBets } from "../services/gameSevice";
import { getWalletSummary } from "../services/authService";
import { useParams } from "react-router-dom";
 
/* ═══════════════════════════════════════════════════════
   AUDIO ENGINE
═══════════════════════════════════════════════════════ */
function useAudioEngine() {
  const rollRef = useRef(null);
  const tickRef = useRef(null);
  const winRef = useRef(null);
  const loseRef = useRef(null);
 
  useEffect(() => {
    rollRef.current = new Audio("/sounds/dice-roll.mp3");
    tickRef.current = new Audio("/sounds/tick.mp3");
    winRef.current = new Audio("/sounds/win.mp3");
    loseRef.current = new Audio("/sounds/lose.mp3");
 
    rollRef.current.volume = 1;
    tickRef.current.volume = 0.6;
  }, []);
 
  const playRoll = () => {
    if (!rollRef.current) return;
    rollRef.current.currentTime = 0;
    rollRef.current.play().catch(() => {});
  };
 
  const playTick = () => {
    if (!tickRef.current) return;
    tickRef.current.currentTime = 0;
    tickRef.current.play().catch(() => {});
  };
 
  const playWin = () => {
    if (!winRef.current) return;
    winRef.current.currentTime = 0;
    winRef.current.play().catch(() => {});
  };
 
  const playLose = () => {
    if (!loseRef.current) return;
    loseRef.current.currentTime = 0;
    loseRef.current.play().catch(() => {});
  };
 
  return { playRoll, playTick, playWin, playLose };
}
 
/* ═══════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════ */
const PERIODS = [
  { key: "1m",  label: "1min",  seconds: 60,  lockAt: 10 },
  { key: "3m",  label: "3min",  seconds: 180, lockAt: 30 },
  { key: "5m",  label: "5min",  seconds: 300, lockAt: 30 },
  { key: "10m", label: "10min", seconds: 600, lockAt: 30 },
  { key: "15m", label: "15min", seconds: 900, lockAt: 30 },
];
 
const NUM_COLORS = {
  0: ["violet", "red"],
  1: ["green"],
  2: ["red"],
  3: ["green"],
  4: ["red"],
  5: ["violet", "green"],
  6: ["red"],
  7: ["green"],
  8: ["red"],
  9: ["green"],
};
 
const COLOR_HEX = {
  red: "#ef4444",
  green: "#22c55e",
  violet: "#a855f7",
};
 
const SERVICE_FEE = 0.02;
 
const BALL_IMAGES = {
  0: colorRedViolet,
  1: colorGreen,
  2: colorRed,
  3: colorGreen,
  4: colorRed,
  5: colorGreenViolet,
  6: colorRed,
  7: colorGreen,
  8: colorRed,
  9: colorGreen,
};
 
const RESULT_BG = {
  0: "#9333ea", 1: "#16a34a", 2: "#dc2626", 3: "#16a34a",
  4: "#dc2626", 5: "#9333ea", 6: "#dc2626", 7: "#16a34a",
  8: "#dc2626", 9: "#16a34a",
};
 
/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */
function getRoundId() {
  const n = new Date();
  const ts =
    n.getFullYear() * 10000000000 +
    (n.getMonth() + 1) * 100000000 +
    n.getDate() * 1000000 +
    n.getHours() * 10000 +
    n.getMinutes() * 100 +
    n.getSeconds();
  return String(ts).slice(0, 14);
}
 
/* ═══════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════ */
 
/* ── Digital Countdown ── */
function Countdown({ seconds }) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <div className="flex items-center gap-0.5">
      {[mm[0], mm[1], ":", ss[0], ss[1]].map((d, i) =>
        d === ":" ? (
          <span key={i} className="text-white text-xl font-black mx-0.5 leading-none">:</span>
        ) : (
          <div
            key={i}
            className="w-7 h-8 bg-black border border-gray-700 rounded-md flex items-center justify-center text-white text-lg font-black tabular-nums"
          >
            {d}
          </div>
        )
      )}
    </div>
  );
}
 
/* ── 3-D Number Ball ── */
function Ball({ n, size = 58, onClick, selected, disabled }) {
  return (
    <button
      onClick={() => !disabled && onClick && onClick(n)}
      disabled={disabled}
      className="relative rounded-full flex items-center justify-center transition-transform active:scale-90 focus:outline-none"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.31,
        fontWeight: 900,
        color: "#000",
        boxShadow: selected
          ? "0 0 0 3px #fff, 0 6px 20px rgba(0,0,0,0.4)"
          : "0 4px 12px rgba(0,0,0,0.3)",
        transform: selected ? "scale(1.1)" : "scale(1)",
        opacity: disabled ? 0.45 : 1,
        backgroundImage: `url(${BALL_IMAGES[n]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <span className="absolute rounded-full pointer-events-none" />
      <span className="relative z-10">{n}</span>
    </button>
  );
}
 
/* ── Result Ball ── */
function ResultBall({ number, rolling }) {
  const bg = number !== null ? RESULT_BG[number] : "#6d28d9";
  return (
    <div
      className="rounded-full flex items-center justify-center border-4 border-white/40 transition-all duration-300 flex-shrink-0"
      style={{
        width: 70,
        height: 70,
        fontSize: 26,
        fontWeight: 900,
        color: "#fff",
        background: rolling ? "#6d28d9" : bg,
        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
        animation: !rolling && number !== null ? "resultPop 0.5s cubic-bezier(.22,.61,.36,1)" : "none",
      }}
    >
      {rolling ? "?" : number}
    </div>
  );
}
 
/* ── Spinning Wheel Overlay ── */
function SpinningWheelOverlay({ timeLeft, rolling }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-20"
      style={{ background: "rgba(20,5,50,0.55)", pointerEvents: "none" }}
    >
      {/* Outer spinning ring */}
      <div style={{ position: "relative", width: 210, height: 210 }}>
        {/* Rotating outer circle */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "5px solid rgba(255,255,255,0.18)",
            animation: "wheelSpin 0.55s linear infinite",
          }}
        >
          {/* Spokes */}
          {[0, 45, 90, 135].map((deg) => (
            <div
              key={deg}
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                height: 3,
                background: "rgba(255,255,255,0.22)",
                transform: `translateY(-50%) rotate(${deg}deg)`,
                borderRadius: 2,
                transformOrigin: "center center",
              }}
            />
          ))}
        </div>
 
        {/* Middle ring — counter-spin */}
        <div
          style={{
            position: "absolute",
            inset: 28,
            borderRadius: "50%",
            border: "4px solid rgba(200,150,255,0.3)",
            animation: "wheelSpinReverse 0.9s linear infinite",
          }}
        />
 
        {/* Inner glow ring */}
        <div
          style={{
            position: "absolute",
            inset: 55,
            borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.15)",
            background: "radial-gradient(circle, rgba(109,40,217,0.6) 0%, rgba(30,10,60,0.85) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Center countdown number */}
          <div
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: "#fff",
              textShadow: "0 0 20px rgba(200,150,255,0.8), 0 2px 8px rgba(0,0,0,0.6)",
              fontFamily: "monospace",
              animation: "countPulse 1s ease-in-out infinite",
            }}
          >
            {rolling ? "?" : timeLeft}
          </div>
        </div>
 
        {/* Orbiting dots */}
        {[0, 72, 144, 216, 288].map((deg, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: i % 2 === 0 ? "#a855f7" : "#ec4899",
              boxShadow: `0 0 6px ${i % 2 === 0 ? "#a855f7" : "#ec4899"}`,
              transform: `rotate(${deg}deg) translateX(96px) translateY(-50%)`,
              animation: "wheelSpin 0.55s linear infinite",
            }}
          />
        ))}
      </div>
    </div>
  );
}
 
/* ── Rules Modal ── */
function RulesModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/55 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl w-full max-w-[430px] max-h-[82vh] overflow-y-auto"
        style={{ animation: "slideUp 0.3s cubic-bezier(.32,.72,0,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-3.5 border-b border-purple-50">
          <span className="text-base font-bold text-gray-900">How to Play</span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-lg"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <div className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">⏱️ Bet Closing Times</div>
            {[
              ["1 minute", "10 seconds before draw"],
              ["3 minutes", "30 seconds before draw"],
              ["5 minutes", "30 seconds before draw"],
              ["10 minutes", "30 seconds before draw"],
              ["15 minutes", "30 seconds before draw"],
            ].map(([type, rule]) => (
              <div key={type} className="flex gap-2 py-1.5 text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />
                <span><strong>Game type: {type}</strong> — Bet close: {rule}</span>
              </div>
            ))}
          </div>
          <hr className="border-purple-50" />
          <div>
            <div className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">🔮 Winning Odds</div>
            {[
              { color: "#ef4444", label: "🔴 Red", odds: "2×", detail: "Bet × 2" },
              { color: "#22c55e", label: "🟢 Green", odds: "2×", detail: "Bet × 2" },
              { color: "#a855f7", label: "🟣 Violet", odds: "4.5×", detail: "Bet × 4.5" },
            ].map(({ color, label, odds, detail }) => (
              <div
                key={label}
                className="flex items-center justify-between px-3 py-2 rounded-xl mb-1.5 text-sm"
                style={{ background: color + "12", border: `1px solid ${color}22` }}
              >
                <span className="font-semibold">{label}</span>
                <span className="font-black text-base" style={{ color }}>{odds}</span>
                <span className="text-gray-500 text-xs">{detail}</span>
              </div>
            ))}
            <div className="bg-orange-50 border border-orange-200 rounded-xl px-3 py-2.5 mt-2 text-xs text-orange-800 leading-relaxed">
              <strong>⚠️ Special Rule:</strong> If result is Violet (0 or 5), Red/Green bettors receive <strong>1.5×</strong> instead of 2×.
            </div>
          </div>
          <hr className="border-purple-50" />
          <div>
            <div className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">🎯 Guess Number</div>
            <div className="flex items-center justify-between px-4 py-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-sm font-semibold">Any Number (0–9)</span>
              <span className="text-lg font-black text-blue-600">9×</span>
            </div>
          </div>
          <hr className="border-purple-50" />
          <div>
            <div className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">💳 Service Charges</div>
            <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-3 text-xs text-green-800 leading-relaxed">
              Platform charges a <strong>2% service fee</strong> per bet.<br />
              Bet ₹100 → Effective bet = ₹98<br />
              Example: ₹100 bet at 2× → Win = 98 × 2 = <strong>₹196</strong>
            </div>
          </div>
          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}
 
/* ── Bet Slip Modal ── */
function BetSlip({ selection, balance, onClose, onConfirm }) {
  const [amount, setAmount] = useState(10);
  const [multiplier, setMultiplier] = useState(1);
  const [agreed, setAgreed] = useState(false);
 
  const CHIPS = [10, 100, 500, 1000];
  const MULTIPLIERS = [1, 3, 9, 27, 81, 243, 729];
 
  const effectiveBet = Math.floor(amount * multiplier * (1 - SERVICE_FEE));
  const totalPrice = amount * multiplier;
 
  const selectionMultiplier =
    selection.type === "color"
      ? selection.value === "violet" ? 4.5 : 2
      : 9;
 
  const potentialWin = Math.floor(effectiveBet * selectionMultiplier);
  const insufficient = totalPrice > balance;
 
  const COLOR_GRADIENTS = {
    green:  { bg: "radial-gradient(circle at 38% 32%, #4ade80, #15803d)", shadow: "0 8px 28px rgba(22,163,74,0.5)" },
    violet: { bg: "radial-gradient(circle at 38% 32%, #c084fc, #5b21b6)", shadow: "0 8px 28px rgba(109,40,217,0.5)" },
    red:    { bg: "radial-gradient(circle at 38% 32%, #f87171, #b91c1c)", shadow: "0 8px 28px rgba(185,28,28,0.5)" },
  };
 
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
      onClick={onClose}
      style={{ animation: "fadeIn 0.2s ease" }}
    >
      <div
        className="bg-white rounded-t-3xl w-full max-w-[430px] pb-8"
        style={{ animation: "slideUp 0.3s cubic-bezier(.32,.72,0,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mt-3 mb-1" />
        <div className="flex items-center justify-between px-5 py-3">
          <span className="text-lg font-bold text-gray-900">Bets</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xl leading-none"
          >
            ×
          </button>
        </div>
 
        <div
          className="mx-5 rounded-2xl flex items-center justify-center py-6 mb-4"
          style={{ background: "#fff9f0" }}
        >
          {selection.type === "color" ? (
            <div
              className="relative rounded-full flex items-center justify-center text-white font-black"
              style={{
                width: 88,
                height: 88,
                fontSize: 14,
                letterSpacing: "0.06em",
                background: COLOR_GRADIENTS[selection.value].bg,
                boxShadow: COLOR_GRADIENTS[selection.value].shadow,
              }}
            >
              <span className="relative z-10 uppercase tracking-widest">{selection.value}</span>
            </div>
          ) : (
            <div
              className="relative rounded-full flex items-center justify-center text-black font-black"
              style={{
                width: 88,
                height: 88,
                fontSize: 28,
                backgroundImage: `url(${BALL_IMAGES[selection.value]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 8px 28px rgba(0,0,0,0.25)",
              }}
            >
              <span className="relative z-10">{selection.value}</span>
            </div>
          )}
        </div>
 
        <div className="px-5 space-y-4">
          <div className="flex gap-2">
            {CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => setAmount(chip)}
                className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: amount === chip ? "#7c3aed" : "#f3f4f6",
                  color: amount === chip ? "#fff" : "#374151",
                  border: amount === chip ? "2px solid #7c3aed" : "2px solid transparent",
                }}
              >
                ₹{chip.toLocaleString("en-IN")}
              </button>
            ))}
          </div>
 
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-700 w-24 flex-shrink-0">Multiplier:</span>
            <button
              onClick={() => setMultiplier((m) => Math.max(1, m - 1))}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 font-bold text-lg flex-shrink-0"
              style={{ background: "#f3f4f6", border: "1.5px solid #e5e7eb" }}
            >−</button>
            <div
              className="flex-1 h-9 rounded-lg flex items-center justify-center text-gray-800 font-bold text-sm"
              style={{ background: "#f9fafb", border: "1.5px solid #e5e7eb" }}
            >
              {multiplier}
            </div>
            <button
              onClick={() => setMultiplier((m) => m + 1)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 font-bold text-lg flex-shrink-0"
              style={{ background: "#f3f4f6", border: "1.5px solid #e5e7eb" }}
            >+</button>
          </div>
 
          <div className="flex gap-1.5 flex-wrap">
            {MULTIPLIERS.map((m) => (
              <button
                key={m}
                onClick={() => setMultiplier(m)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: multiplier === m ? "#f3f0ff" : "#f3f4f6",
                  color: multiplier === m ? "#7c3aed" : "#6b7280",
                  border: multiplier === m ? "1.5px solid #7c3aed" : "1.5px solid transparent",
                }}
              >
                x{m}
              </button>
            ))}
          </div>
 
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAgreed((a) => !a)}
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                background: agreed ? "#7c3aed" : "transparent",
                border: agreed ? "2px solid #7c3aed" : "2px solid #d1d5db",
              }}
            >
              {agreed && (
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <span className="text-sm text-gray-600">
              I Agree <span className="text-violet-600 font-semibold">(Pre-sale rules)</span>
            </span>
          </div>
 
          <button
            disabled={insufficient || !agreed}
            onClick={() => agreed && onConfirm(selection, amount, multiplier, potentialWin)}
            className="w-full py-4 rounded-2xl text-base font-black text-white transition-all active:scale-95 disabled:opacity-50"
            style={{
              background: insufficient || !agreed
                ? "#9ca3af"
                : "linear-gradient(135deg,#7c3aed,#8b5cf6)",
            }}
          >
            {insufficient ? "Insufficient Balance" : `Total Price ₹${totalPrice.toLocaleString("en-IN")}`}
          </button>
        </div>
      </div>
    </div>
  );
}
 
/* ── Winners Tab ── */
function WinnersTab({ history }) {
  const winners = useMemo(() =>
    history.slice(0, 10).map((h, i) => ({
      ...h,
      user: `User***${String(1000 + i * 37).slice(-4)}`,
      betAmount: Math.floor(Math.random() * 500 + 50),
      winAmount: Math.floor(Math.random() * 2000 + 100),
    }))
  , [history]);
 
  return (
    <div>
      {winners.map((w, i) => (
        <div key={i} className="flex items-center justify-between px-4 py-2.5 border-b border-purple-50">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: `hsl(${i * 37 + 100},60%,55%)` }}
            >
              {w.user[0]}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">{w.user}</div>
              <div className="text-xs text-gray-400">Bet ₹{w.betAmount} · Issue {w.issue}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-black text-green-600">+₹{w.winAmount}</div>
            <div
              className="w-3.5 h-3.5 rounded-full ml-auto mt-1"
              style={{ background: COLOR_HEX[w.primary] || "#888" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
 
/* ── Analyze Tab ── */
function AnalyzeTab({ history }) {
  const stats = useMemo(() => {
    const counts = { red: 0, green: 0, violet: 0, num: Array(10).fill(0) };
    history.forEach((h) => {
      h.colors.forEach((c) => (counts[c] = (counts[c] || 0) + 1));
      counts.num[h.number]++;
    });
    return counts;
  }, [history]);
 
  const total = history.length || 1;
 
  return (
    <div className="p-4 space-y-3">
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
        Color Frequency (last {history.length} rounds)
      </div>
      {[
        { key: "green", label: "Green", color: "#22c55e" },
        { key: "red", label: "Red", color: "#ef4444" },
        { key: "violet", label: "Violet", color: "#a855f7" },
      ].map(({ key, label, color }) => {
        const pct = Math.round(((stats[key] || 0) / total) * 100);
        return (
          <div key={key}>
            <div className="flex justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <span className="text-sm font-semibold">{label}</span>
              </div>
              <span className="text-xs text-gray-400">{stats[key] || 0}× ({pct}%)</span>
            </div>
            <div className="h-2 bg-purple-50 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
          </div>
        );
      })}
 
      <hr className="border-purple-50 my-3" />
 
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
        Number Distribution
      </div>
      <div className="flex gap-1 items-end h-20">
        {stats.num.map((count, n) => {
          const maxCount = Math.max(...stats.num) || 1;
          const h = count ? Math.max(8, Math.round((count / maxCount) * 72)) : 4;
          const primary = NUM_COLORS[n][0];
          return (
            <div key={n} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] text-gray-400">{count}</span>
              <div
                className="w-full rounded-t-sm transition-all duration-500 opacity-80"
                style={{ height: h, background: COLOR_HEX[primary] || "#888" }}
              />
              <span className="text-[10px] font-bold text-gray-500">{n}</span>
            </div>
          );
        })}
      </div>
 
      <hr className="border-purple-50 my-3" />
 
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
        Last 20 Results
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {history.slice(0, 20).map((h, i) => (
          <div
            key={i}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black"
            style={{ background: COLOR_HEX[h.primary] || "#888" }}
          >
            {h.number}
          </div>
        ))}
      </div>
    </div>
  );
}
 
/* ── My Orders Tab ── */
function MyOrderTab({ orders, loading }) {
  if (loading) {
    return <div style={{ padding: 20, textAlign: "center" }}>Loading...</div>;
  }
  if (!orders.length) {
    return <div style={{ padding: 20, textAlign: "center" }}>No orders</div>;
  }
 
  const getColor = (type, value) => {
    if (type === "COLOR") {
      if (value === "red") return "#ef4444";
      if (value === "green") return "#22c55e";
      if (value === "violet") return "#8b5cf6";
    }
    return "#3b82f6";
  };
 
  const getStatusStyle = (result) => {
    if (result === "win") return { bg: "#dcfce7", color: "#16a34a" };
    if (result === "loss") return { bg: "#fee2e2", color: "#dc2626" };
    return { bg: "#fef3c7", color: "#d97706" };
  };
 
  return (
    <div style={{ padding: 12 }}>
      {orders.map((o) => {
        const status = getStatusStyle(o.result);
        return (
          <div
            key={o.id}
            style={{
              background: "#ffffff",
              borderRadius: 14,
              padding: 14,
              marginBottom: 12,
              boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
              borderLeft: `5px solid ${getColor(o.type, o.value)}`
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                {o.type === "COLOR" ? "🎨 Color Bet" : "🔢 Number Bet"}
              </div>
              <div
                style={{
                  background: status.bg,
                  color: status.color,
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 20,
                  fontWeight: 700
                }}
              >
                {o.result.toUpperCase()}
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <span
                style={{
                  background: getColor(o.type, o.value),
                  color: "#fff",
                  padding: "4px 10px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "capitalize"
                }}
              >
                {o.value}
              </span>
            </div>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 6,
                fontSize: 12,
                color: "#555"
              }}
            >
              <div>🎯 Issue: {o.issue}</div>
              <div>💰 Bet: ₹{o.amount}</div>
              <div>🏆 Win: ₹{o.win}</div>
              <div>📊 Multiplier: {o.win && o.amount ? (o.win / o.amount).toFixed(1) + "x" : "-"}</div>
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 13,
                fontWeight: 700,
                color: o.credit > 0 ? "#16a34a" : o.debit > 0 ? "#dc2626" : "#888"
              }}
            >
              {o.credit > 0 && `+₹${o.credit} Profit`}
              {o.debit > 0 && `-₹${o.debit} Loss`}
              {o.result === "pending" && "⏳ Waiting result"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
 
/* ═══════════════════════════════════════════════════════
   MAIN COLOR PREDICTION SCREEN
═══════════════════════════════════════════════════════ */
export default function ColorPrediction() {
  const [period, setPeriod] = useState(PERIODS[0]);
  const [timeLeft, setTimeLeft] = useState(PERIODS[0].seconds);
  const [roundId, setRoundId] = useState("");
  const [preRoundId, setPreRoundId] = useState("");
  const [currentResult, setCurrentResult] = useState(3);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState([]);
  const [histTab, setHistTab] = useState("result");
  const [bets, setBets] = useState([]);
  const [balance, setBalance] = useState({ totalWallet: 0 });
  const [betSlip, setBetSlip] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const [toast, setToast] = useState(null);
  const [isClosed, setIsClosed] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
 
  // ── NEW: track whether we're in "last 3 seconds" phase ──
  const [showSpinWheel, setShowSpinWheel] = useState(false);
 
  const timerRef = useRef(null);
  const audio = useAudioEngine();
  const navigate = useNavigate();
  const { key } = useParams();
  const [periodKey, setPeriodKey] = useState(key || "1m");
 
  useEffect(() => {
    if (key) setPeriodKey(key);
  }, [key]);
 
  const isLocked = isClosed;
  const progress = ((period.seconds - timeLeft) / period.seconds) * 100;
 
  /* ── Unlock audio on first user interaction ── */
  useEffect(() => {
    const unlock = () => {
      if (!audioUnlocked) {
        audio.playTick();
        setAudioUnlocked(true);
      }
    };
    window.addEventListener("click", unlock);
    window.addEventListener("touchstart", unlock);
    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, [audioUnlocked]);
 
  /* ── triggerDraw: called when timer hits 0 ── */
  const triggerDraw = useCallback(() => {
    // Hide spin wheel, show rolling state
    setShowSpinWheel(false);
    setRolling(true);
    audio.playRoll(); // 🎲 dice roll sound at draw moment
 
    setTimeout(() => {
      setRolling(false);
    }, 1200);
  }, [audio]);
 
  /* ── Main countdown timer ── */
  useEffect(() => {
    clearInterval(timerRef.current);
    setTimeLeft(period.seconds);
    setShowSpinWheel(false);
 
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        // Last 3 seconds: show spin wheel + play tick
        if (prev === 3) {
          setShowSpinWheel(true);
          audio.playTick(); // tick at 3
        } else if (prev === 2) {
          audio.playTick(); // tick at 2
        } else if (prev === 1) {
          audio.playTick(); // tick at 1
        }
 
        if (prev <= 1) {
          // Draw moment — dice roll plays inside triggerDraw
          triggerDraw();
          return period.seconds;
        }
 
        return prev - 1;
      });
    }, 1000);
 
    return () => clearInterval(timerRef.current);
  }, [period]);
 
  /* ── Fetch wallet ── */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      fetchWallet(parsedUser.id);
    }
  }, []);
 
  const fetchWallet = async (uid) => {
    try {
      const res = await getWalletSummary({ id: uid });
      const api = res?.data;
      setBalance({ totalWallet: Number(api?.wallet.total || 0) });
    } catch (err) {
      console.log("API Error:", err);
    }
  };
 
  /* ── Fetch game state every second ── */
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await getColorGame({ key: period.key });
        if (!res?.success) return;
        const game = res.data[0];
        setTimeLeft(game.remaining);
        setIsClosed(game.isClosed);
        setRoundId(game.currentSlotNum);
        setPreRoundId(game.lastResult?.slotNum);
        if (game.lastResult?.result?.number !== undefined) {
          setCurrentResult(game.lastResult.result.number);
        }
        setRolling(game.isRolling);
 
        // Sync spin wheel with server time
        if (game.remaining <= 4 && game.isClosed) {
          setShowSpinWheel(true);
        } else if (game.remaining > 3) {
          setShowSpinWheel(false);
        }
      } catch (err) {
        console.error("fetchGame error", err);
      }
    };
 
    fetchGame();
    const interval = setInterval(fetchGame, 1000);
    return () => clearInterval(interval);
  }, [period]);
 
  /* ── Fetch history ── */
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await getColorHistory({ key: period.key, limit: 10, page });
        if (!res?.success) return;
        const formatted = res.data.map((item) => {
          const num = Number(item.result?.number ?? 0);
          return {
            issue: item.slotNum,
            number: num,
            colors: NUM_COLORS[num],
            primary: NUM_COLORS[num][0],
          };
        });
        setHistory(formatted);
        setHasNext(res.data.length >= 10);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [page, period]);
 
  /* ── Fetch orders ── */
  const user = JSON.parse(localStorage.getItem("user"));
 
  useEffect(() => {
    if (histTab === "myorder") fetchOrders();
  }, [histTab, periodKey]);
 
  const fetchOrders = async () => {
    if (!user?.id) return;
    setLoadingOrders(true);
    try {
      const res = await getColorUserBets({ user_id: user.id, key: periodKey });
      if (!res?.success) { setOrders([]); return; }
      const formatted = res.data.map((item) => ({
        id: item.id,
        issue: item.slotNum,
        type: item.type,
        value: item.value,
        amount: item.betAmount,
        win: item.potentialWin,
        result: item.result,
        credit: item.creditAmount,
        debit: item.debitAmount,
        time: item.createdAt,
      }));
      setOrders(formatted);
    } catch (err) {
      console.log(err);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };
 
  /* ── Toast ── */
  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }, []);
 
  /* ── Select ── */
  const handleSelect = useCallback((type, value) => {
    if (isLocked) {
      showToast(`⏳ Betting closed! ${period.lockAt}s before draw`, "error");
      return;
    }
    setBetSlip({ type, value });
  }, [isLocked, period, showToast]);
 
  /* ── Confirm bet ── */
  const handleConfirm = useCallback(async (selection, amount, qty, potentialWin) => {
    const total = amount * qty;
    if (total > balance.totalWallet) {
      showToast("❌ Insufficient balance", "error");
      return;
    }
    try {
      const payload = { user_id: user?.id, key: period.key, amount: total };
      if (selection.type === "color") {
        payload.color = selection.value;
      } else {
        payload.number = selection.value;
      }
      const res = await placeColorBet(payload);
      if (!res?.success) { showToast("❌ Bet failed", "error"); return; }
 
      const effectiveBet = Math.floor(amount * (1 - SERVICE_FEE)) * qty;
      setBets((prev) => [
        { id: Date.now(), selection, amount: total, qty, effectiveBet, issue: roundId, settled: false },
        ...prev,
      ]);
      setBetSlip(null);
      showToast(
        `✅ Bet placed ₹${total} on ${
          selection.type === "color" ? selection.value.toUpperCase() : `Number ${selection.value}`
        }`,
        "win"
      );
    } catch (err) {
      console.error(err);
      showToast("❌ Server error", "error");
    }
  }, [balance, period, roundId, showToast]);
 
  /* ── Period change ── */
  const handlePeriodChange = (p) => {
    setPeriod(p);
    setShowSpinWheel(false);
    const id = getRoundId();
    setRoundId(id);
  };
 
  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  return (
    <>
      <style>{`
        @keyframes slideUp        { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes fadeIn         { from { opacity: 0 } to { opacity: 1 } }
        @keyframes resultPop      { 0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
        @keyframes wheelSpin      { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes wheelSpinReverse { from { transform: rotate(0deg) } to { transform: rotate(-360deg) } }
        @keyframes countPulse     { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.15); opacity: 0.85; } }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        * { -webkit-tap-highlight-color: transparent; user-select: none; }
        ::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>
 
      <div className="flex justify-center min-h-screen bg-gray-900">
        <div
          className="w-full max-w-[430px] min-h-screen flex flex-col relative overflow-x-hidden"
          style={{ background: "#f0f0f8" }}
        >
 
          {/* ── TOAST ── */}
          {toast && (
            <div
              className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-sm font-semibold text-white whitespace-nowrap shadow-xl"
              style={{
                background:
                  toast.type === "error"
                    ? "linear-gradient(135deg,#b91c1c,#ef4444)"
                    : toast.type === "win"
                      ? "linear-gradient(135deg,#16a34a,#22c55e)"
                      : "#1a1a2e",
                animation: "fadeIn 0.3s ease",
              }}
            >
              {toast.msg}
            </div>
          )}
 
          {/* ── RULES MODAL ── */}
          {showRules && <RulesModal onClose={() => setShowRules(false)} />}
 
          {/* ── BET SLIP ── */}
          {betSlip && (
            <BetSlip
              selection={betSlip}
              balance={balance.totalWallet}
              onClose={() => setBetSlip(null)}
              onConfirm={handleConfirm}
            />
          )}
 
          {/* ── HEADER ── */}
          <div
            className="flex items-center justify-between px-4 flex-shrink-0 sticky top-0 z-40 border-b"
            style={{ height: 52, background: "#fff", borderColor: "#e8e8f0" }}
          >
            <ChevronLeft onClick={() => navigate(-1)} className="w-5 h-5 text-gray-700" />
            <span className="text-[17px] font-bold text-gray-900">Color Prediction</span>
            <div
              className="flex items-center gap-2 rounded-full px-3 py-1"
              style={{ background: "#f8f0ff", border: "1px solid #e0d0ff" }}
            >
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-gray-400 leading-none">Balance</span>
                <span className="text-[13px] font-black text-gray-900 leading-snug">
                  ₹{balance.totalWallet}
                </span>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-base"
                style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}
              >
                💳
              </div>
            </div>
          </div>
 
          {/* ── PERIOD TABS ── */}
          <div
            className="flex gap-2 px-3 py-2.5 flex-shrink-0 overflow-x-auto"
            style={{ background: "#fff", scrollbarWidth: "none" }}
          >
            {PERIODS.map((p) => {
              const active = period.key === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => handlePeriodChange(p)}
                  className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl transition-all min-w-[72px]"
                  style={{
                    background: active ? "#fff" : "#f4f4f8",
                    border: active ? "2px solid #8b5cf6" : "2px solid transparent",
                    boxShadow: active ? "0 2px 12px rgba(139,92,246,0.2)" : "none",
                  }}
                >
                  <div
                    className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-sm"
                    style={{
                      background: "linear-gradient(135deg,#f59e0b,#f97316)",
                      boxShadow: "0 2px 8px rgba(245,158,11,0.4)",
                    }}
                  >
                    ⏱
                  </div>
                  <span className="text-[13px] font-bold text-gray-900">{p.label}</span>
                </button>
              );
            })}
          </div>
 
          {/* ── ROUND INFO PANEL ── */}
          <div
            className="flex items-center justify-between px-3.5 py-3 flex-shrink-0 gap-2.5"
            style={{ background: "linear-gradient(135deg,#e8e4f8,#d4ccf0)" }}
          >
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-[#3b1a8a]">{period.label}</div>
              <div className="text-[11px] text-[#6b4fa0] font-mono mt-0.5">{preRoundId}</div>
              <button
                onClick={() => setShowRules(true)}
                className="mt-1.5 bg-white border border-gray-300 rounded-full px-3 py-[3px] text-[11px] text-gray-500 active:scale-95 transition-transform"
              >
                How to play
              </button>
            </div>
 
            <ResultBall number={rolling ? null : currentResult} rolling={rolling} />
 
            <div className="w-px self-stretch" style={{ background: "rgba(109,40,217,0.2)" }} />
 
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-[#6b4fa0] font-medium">Time remaining</span>
              <Countdown seconds={timeLeft} />
              <span className="text-[10px] text-[#8b6bbf] font-mono mt-0.5">{roundId}</span>
            </div>
          </div>
 
          {/* ── Progress bar ── */}
          <div className="h-[5px] flex-shrink-0" style={{ background: "#d4ccf0" }}>
            <div
              className="h-full transition-all duration-1000"
              style={{
                width: `${progress}%`,
                background: isLocked
                  ? "linear-gradient(90deg,#ef4444,#dc2626)"
                  : "linear-gradient(90deg,#8b5cf6,#ec4899)",
              }}
            />
          </div>
 
          {/* ── SCROLLABLE CONTENT ── */}
          <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
 
            {/* ── COLOR BUTTONS ── */}
            <div className="relative flex-shrink-0">
              <div className="grid grid-cols-3">
                <button
                  onClick={() => handleSelect("color", "green")}
                  disabled={isLocked}
                  className="h-[50px] text-white text-[15px] font-black tracking-widest transition-all active:brightness-75 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)" }}
                >
                  GREEN
                </button>
                <button
                  onClick={() => handleSelect("color", "violet")}
                  disabled={isLocked}
                  className="h-[50px] text-white text-[15px] font-black tracking-widest transition-all active:brightness-75 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#6d28d9,#8b5cf6)" }}
                >
                  VIOLET
                </button>
                <button
                  onClick={() => handleSelect("color", "red")}
                  disabled={isLocked}
                  className="h-[50px] text-white text-[15px] font-black tracking-widest transition-all active:brightness-75 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#b91c1c,#ef4444)" }}
                >
                  RED
                </button>
              </div>
              {isLocked && (
                <div
                  className="absolute inset-0 flex items-center justify-center text-white text-base font-bold z-10 backdrop-blur-sm"
                  style={{ background: "rgba(0,0,0,0.35)", pointerEvents: "none" }}
                >
                  🔒 Betting Locked · Wait for next round
                </div>
              )}
            </div>
 
            {/* ── NUMBER BALLS GRID ── */}
            <div className="relative px-3 py-4" style={{ background: "#e4e0f5" }}>
              <div className="grid grid-cols-5 gap-2.5 max-w-[360px] mx-auto">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <div key={n} className="flex justify-center">
                    <Ball
                      n={n}
                      size={58}
                      disabled={isLocked}
                      onClick={(v) => handleSelect("number", v)}
                    />
                  </div>
                ))}
              </div>
 
              {/* ── Normal lock overlay (only when locked but NOT in last 3s) ── */}
              {isLocked && !showSpinWheel && !rolling && (
                <div
                  className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold z-10 backdrop-blur-sm"
                  style={{ background: "rgba(0,0,0,0.30)", pointerEvents: "none" }}
                >
                  🔒 {timeLeft}s · Locked
                </div>
              )}
 
              {/* ── Spinning wheel overlay — last 3 seconds countdown ── */}
              {(showSpinWheel || rolling) && (
                <SpinningWheelOverlay timeLeft={timeLeft} rolling={rolling} />
              )}
            </div>
 
            {/* ── MY BETS ── */}
            <div className="px-3.5 pt-2.5 pb-1.5 flex-shrink-0" style={{ background: "#e8e4f5" }}>
              <div className="flex items-center gap-2">
                <div
                  className="flex-1 h-px"
                  style={{ background: "repeating-linear-gradient(90deg,#9980c8 0,#9980c8 4px,transparent 4px,transparent 8px)" }}
                />
                <span className="text-[13px] font-bold text-[#5b3fa0] px-2">MY BETS</span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "repeating-linear-gradient(90deg,#9980c8 0,#9980c8 4px,transparent 4px,transparent 8px)" }}
                />
              </div>
 
              {bets.filter((b) => !b.settled).length > 0 ? (
                <div className="mt-2 mb-1 space-y-1.5">
                  {bets.filter((b) => !b.settled).map((b, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-white/70 rounded-xl px-3 py-2"
                    >
                      <div>
                        <span className="text-[13px] font-bold text-gray-900 uppercase">
                          {b.selection.type === "color"
                            ? b.selection.value
                            : `No. ${b.selection.value}`}
                        </span>
                        <div className="text-[11px] text-gray-400">
                          ₹{b.amount} · Issue {b.issue}
                        </div>
                      </div>
                      <span className="text-[11px] bg-orange-50 text-amber-500 px-2 py-0.5 rounded-full font-bold">
                        PENDING
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="min-h-[70px] rounded-xl mt-2 mb-1" style={{ background: "#dbd5ee" }} />
              )}
            </div>
 
            {/* ── RESULT HISTORY ── */}
            <div className="bg-white flex-shrink-0">
              {/* Tabs */}
              <div className="flex border-b-2 border-purple-50 px-1">
                {[
                  ["result", "Result history"],
                  ["winners", "Winners"],
                  ["analyze", "Analyze"],
                  ["myorder", "My order"],
                ].map(([k, l]) => (
                  <button
                    key={k}
                    onClick={() => setHistTab(k)}
                    className="flex-1 py-3 text-sm font-semibold relative transition-colors"
                    style={{ color: histTab === k ? "#1a1a2e" : "#888" }}
                  >
                    {l}
                    {histTab === k && (
                      <span
                        className="absolute bottom-[-2px] left-[20%] right-[20%] h-[3px] rounded-full"
                        style={{ background: "#6d28d9" }}
                      />
                    )}
                  </button>
                ))}
              </div>
 
              {/* Tab: Result History */}
              {histTab === "result" && (
                <div>
                  <div
                    className="grid px-3.5 py-2"
                    style={{ gridTemplateColumns: "1fr 1fr 80px", background: "#f8f6ff", borderBottom: "1px solid #ede9f8" }}
                  >
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">ISSUE</span>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide text-center">NUMBER</span>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide text-right">COLOR</span>
                  </div>
                  {history.map((row, i) => {
                    const dotBg = COLOR_HEX[row.primary] || "#888";
                    return (
                      <div
                        key={i}
                        className="grid items-center px-3.5 py-3 border-b border-purple-50 hover:bg-purple-50/30 transition-colors"
                        style={{ gridTemplateColumns: "1fr 1fr 80px" }}
                      >
                        <span className="text-[12px] text-gray-500 font-mono">{row.issue}</span>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 900,
                              fontSize: 14,
                              color: "#000",
                              backgroundImage: `url(${BALL_IMAGES[row.number]})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                            }}
                          >
                            {row.number}
                          </div>
                        </div>
                        <div
                          className="w-[18px] h-[18px] rounded-full ml-auto"
                          style={{ background: dotBg }}
                        />
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between px-4 py-3">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="px-4 py-2 rounded-lg text-sm font-bold"
                      style={{ background: page === 1 ? "#ddd" : "#7c3aed", color: "#fff" }}
                    >
                      ← Prev
                    </button>
                    <div className="text-sm font-semibold text-gray-600">Page {page}</div>
                    <button
                      disabled={!hasNext}
                      onClick={() => setPage((p) => p + 1)}
                      className="px-4 py-2 rounded-lg text-sm font-bold"
                      style={{ background: !hasNext ? "#ddd" : "#7c3aed", color: "#fff" }}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
 
              {histTab === "winners" && <WinnersTab history={history} />}
              {histTab === "analyze" && <AnalyzeTab history={history} />}
              {histTab === "myorder" && <MyOrderTab orders={orders} loading={loadingOrders} />}
            </div>
 
            <div className="h-6" />
          </div>
        </div>
      </div>
    </>
  );
}