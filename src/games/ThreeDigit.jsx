import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════════
   LOTTERY CONFIG — pass different configs to reuse for any lottery
═══════════════════════════════════════════════════════════════ */
export const LOTTERY_CONFIGS = {
  bhutan_jackpot: {
    id: "bhutan_jackpot",
    title: "BhutanJackpot",
    type: "time_slots",          // draw times listed as tabs
    drawTimes: ["04:15 PM", "04:45 PM", "05:15 PM", "05:45 PM", "06:15 PM", "06:45 PM"],
    roundDuration: 1831,         // seconds until next draw
    ticketNoticeMinutes: 3,
    single: { price: 11, win: 100, label: "₹100.00" },
    double: { price: 12, win: 1000, label: "₹1,000.00" },
    triple: { price: 50, win: 30000, label: "₹30,000.00" },
    rulesTitle: "BhutanJackpot — How to Play",
    rules: {
      description: "This 3 Digit game is based on the daily result of Bhutan Lottery first prize results with the last three digits.",
      example: "An example of a first prize ticket is AC 339834\nA=8  B=3  C=4,  AB=83  BC=34  AC=84,  ABC=834",
      single: { price: 11, win: 100 },
      double: { price: 12, win: 1000 },
      triple: {
        price: 50, win: 30000,
        prizes: [
          { match: "Match ABC", amount: 30000 },
          { match: "Match BC", amount: 1000 },
          { match: "Match C", amount: 100 },
        ]
      },
    },
  },
  quick_3d: {
    id: "quick_3d",
    title: "3 Digit Game",
    type: "period_tabs",         // 3min / 5min period tabs
    periods: [
      { key: "3min", label: "3min", seconds: 180 },
      { key: "5min", label: "5min", seconds: 300 },
    ],
    ticketNoticeMinutes: null,
    single: { price: 11, win: 100, label: "₹100.00" },
    double: { price: 11, win: 1000, label: "₹1,000.00" },
    triple: { price: 21, win: 10000, label: "₹10,000.00" },
    rulesTitle: "Quick 3D — How to Play",
    rules: {
      description: "Pick digits for positions A, B, C. Match the draw result to win.",
      example: "Result A=9 B=3 C=0 → ABC=930",
      single: { price: 11, win: 100 },
      double: { price: 11, win: 1000 },
      triple: {
        price: 21, win: 10000,
        prizes: [
          { match: "Match ABC", amount: 10000 },
          { match: "Match BC", amount: 1000 },
          { match: "Match C", amount: 100 },
        ]
      },
    },
  },
};

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
function fmtTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return { h: String(h).padStart(2, "0"), m: String(m).padStart(2, "0"), s: String(s).padStart(2, "0") };
}
function seedHistory(count = 20) {
  const rows = [];
  for (let i = count - 1; i >= 0; i--) {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    const c = Math.floor(Math.random() * 10);
    rows.push({
      issue: String(202604020319 - i),
      a, b, c,
      abc: `${a}${b}${c}`,
    });
  }
  return rows;
}
function genRoundId() {
  const n = new Date();
  return String(
    n.getFullYear() * 100000000 +
    (n.getMonth() + 1) * 1000000 +
    n.getDate() * 10000 +
    n.getHours() * 100 +
    n.getMinutes()
  );
}

/* ═══════════════════════════════════════════════════════════════
   DIGIT BALL (colored position badges A / B / C)
═══════════════════════════════════════════════════════════════ */
const POS_COLORS = {
  A: { bg: "#ef4444", shadow: "rgba(239,68,68,0.4)" },
  B: { bg: "#f97316", shadow: "rgba(249,115,22,0.4)" },
  C: { bg: "#6366f1", shadow: "rgba(99,102,241,0.4)" },
};
function PosBadge({ pos, size = 36 }) {
  const { bg, shadow } = POS_COLORS[pos];
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: bg, boxShadow: `0 3px 10px ${shadow}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: 900, fontSize: size * 0.4, flexShrink: 0,
      }}
    >
      {pos}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RESULT BALL (shows last drawn digit — colored ball like screenshot)
═══════════════════════════════════════════════════════════════ */
const RES_BALL_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6", "#6366f1", "#a855f7", "#ec4899", "#f43f5e", "#0ea5e9"];
function ResultBall({ digit, pos }) {
  const bg = RES_BALL_COLORS[digit] ?? "#6366f1";
  const { bg: posBg } = POS_COLORS[pos];
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <div
        style={{
          width: 34, height: 34, borderRadius: "50%",
          background: `radial-gradient(circle at 35% 30%, ${bg}cc, ${bg})`,
          boxShadow: `0 4px 14px ${bg}66`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 900, fontSize: 18,
        }}
      >
        {digit}
      </div>
      {/* small position label bottom-right */}
      <div style={{
        position: "absolute", bottom: -2, right: -4,
        width: 16, height: 16, borderRadius: "50%",
        background: posBg, fontSize: 8, fontWeight: 900,
        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
        border: "1.5px solid #fff",
      }}>{pos}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DIGITAL COUNTDOWN — exact black-box style from screenshot
═══════════════════════════════════════════════════════════════ */
function Countdown({ seconds }) {
  const { h, m, s } = fmtTime(seconds);
  const groups = [[h[0], h[1]], [m[0], m[1]], [s[0], s[1]]];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {groups.map((pair, gi) => (
        <div key={gi} style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {pair.map((d, di) => (
            <div
              key={di}
              style={{
                width: 26, height: 32, background: "#111", borderRadius: 4,
                border: "1px solid #333", display: "flex", alignItems: "center",
                justifyContent: "center", color: "#fff", fontSize: 17,
                fontWeight: 900, fontFamily: "monospace",
              }}
            >
              {d}
            </div>
          ))}
          {gi < 2 && (
            <span style={{ color: "#fff", fontSize: 18, fontWeight: 900, margin: "0 1px" }}>:</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DIGIT INPUT BOX — the "–" grey box the user taps to enter a digit
═══════════════════════════════════════════════════════════════ */
function DigitBox({ value, onClick, size = 36 }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: 8,
        border: "1.5px solid #e2e8f0", background: value !== null ? "#f3f0ff" : "#f8f9fa",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, fontWeight: 800,
        color: value !== null ? "#6d28d9" : "#aaa",
        cursor: "pointer", transition: "all 0.15s",
        boxShadow: value !== null ? "0 0 0 2px #8b5cf640" : "none",
      }}
    >
      {value !== null ? value : "–"}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NUMBER PICKER MODAL — 0-9 dial pad
═══════════════════════════════════════════════════════════════ */
function NumberPicker({ label, onPick, onClose }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
        zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff", borderRadius: "24px 24px 0 0", width: "100%",
          maxWidth: 430, padding: "0 0 24px", animation: "slideUp 0.3s cubic-bezier(.32,.72,0,1)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "#ddd", margin: "10px auto 0" }} />
        <div style={{ padding: "12px 20px 8px", fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>
          Select digit for position <span style={{ color: "#6d28d9" }}>{label}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, padding: "4px 20px 8px" }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button
              key={n}
              onClick={() => { onPick(n); onClose(); }}
              style={{
                aspectRatio: 1, borderRadius: 12,
                background: `radial-gradient(circle at 35% 30%, ${RES_BALL_COLORS[n]}cc, ${RES_BALL_COLORS[n]})`,
                border: "none", cursor: "pointer",
                fontSize: 20, fontWeight: 900, color: "#fff",
                boxShadow: `0 3px 10px ${RES_BALL_COLORS[n]}55`,
                transition: "transform 0.1s",
              }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.9)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
            >
              {n}
            </button>
          ))}
        </div>
        <div style={{ padding: "0 20px 4px" }}>
          <button
            onClick={onClose}
            style={{
              width: "100%", padding: "13px", borderRadius: 14, border: "none",
              background: "#f3f0ff", color: "#6d28d9", fontWeight: 800, fontSize: 15, cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOW TO PLAY MODAL
═══════════════════════════════════════════════════════════════ */
function RulesModal({ config, onClose }) {
  const r = config.rules;
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 430, maxHeight: "82vh", overflowY: "auto", animation: "slideUp 0.3s cubic-bezier(.32,.72,0,1)" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ position: "sticky", top: 0, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #f0eef8", zIndex: 1 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e" }}>{config.rulesTitle}</span>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", background: "#f4f4f8", border: "none", cursor: "pointer", fontSize: 16, color: "#555", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ padding: "18px 20px 32px", display: "flex", flexDirection: "column", gap: 16 }}>

          <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>{r.description}</p>

          {r.example && (
            <div style={{ background: "#f8f6ff", borderRadius: 12, padding: "12px 14px", fontSize: 12, color: "#5b21b6", fontFamily: "monospace", whiteSpace: "pre-line", lineHeight: 1.8, border: "1px solid #ede9fe" }}>
              {r.example}
            </div>
          )}

          <hr style={{ border: "none", borderTop: "1px solid #f0eef8" }} />

          {/* Single */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <PosBadge pos="A" size={22} /> Single Digit Game — A, B, C Board
            </div>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 8 }}>
              Single digit games can be played on any board between A, B and C.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, background: "#fff7ed", borderRadius: 10, padding: "10px 14px", border: "1px solid #fed7aa", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#92400e" }}>Ticket Price</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#ea580c" }}>₹{r.single.price}</div>
              </div>
              <div style={{ flex: 1, background: "#f0fdf4", borderRadius: 10, padding: "10px 14px", border: "1px solid #bbf7d0", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#166534" }}>Winning Amount</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#16a34a" }}>₹{r.single.win}</div>
              </div>
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #f0eef8" }} />

          {/* Double */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <PosBadge pos="A" size={22} /><PosBadge pos="B" size={22} /> Two Digit Game — AB, BC, AC
            </div>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 8 }}>
              Players pick two numbers from the last three digits in combinations of AB, BC and AC.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, background: "#fff7ed", borderRadius: 10, padding: "10px 14px", border: "1px solid #fed7aa", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#92400e" }}>Ticket Price</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#ea580c" }}>₹{r.double.price}</div>
              </div>
              <div style={{ flex: 1, background: "#f0fdf4", borderRadius: 10, padding: "10px 14px", border: "1px solid #bbf7d0", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#166534" }}>Winning Amount</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#16a34a" }}>₹{r.double.win.toLocaleString("en-IN")}</div>
              </div>
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #f0eef8" }} />

          {/* Triple */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <PosBadge pos="A" size={22} /><PosBadge pos="B" size={22} /><PosBadge pos="C" size={22} /> Three Digit Game — ABC
            </div>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 8 }}>
              Place a bet on all three digits ABC for three chances to win.
            </p>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <div style={{ flex: 1, background: "#fff7ed", borderRadius: 10, padding: "10px 14px", border: "1px solid #fed7aa", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#92400e" }}>Ticket Price</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#ea580c" }}>₹{r.triple.price}</div>
              </div>
              <div style={{ flex: 1, background: "#f0fdf4", borderRadius: 10, padding: "10px 14px", border: "1px solid #bbf7d0", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#166534" }}>Max Prize</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#16a34a" }}>₹{r.triple.win.toLocaleString("en-IN")}</div>
              </div>
            </div>
            {r.triple.prizes && (
              <div style={{ background: "#f8f6ff", borderRadius: 10, border: "1px solid #ede9fe", overflow: "hidden" }}>
                <div style={{ padding: "8px 14px", background: "#ede9fe", fontSize: 11, fontWeight: 700, color: "#5b21b6", textTransform: "uppercase", letterSpacing: 0.5 }}>Winning Prizes</div>
                {r.triple.prizes.map((p, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 14px", borderBottom: i < r.triple.prizes.length - 1 ? "1px solid #ede9fe" : "none" }}>
                    <span style={{ fontSize: 13, color: "#374151" }}>
                      <span style={{ marginRight: 6 }}>{["(i)", "(ii)", "(iii)"][i]}</span>{p.match}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#6d28d9" }}>₹{p.amount.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WIN BADGE — the purple "Win ₹X" chip next to section title
═══════════════════════════════════════════════════════════════ */
function WinBadge({ amount }) {
  return (
    <span style={{
      background: "linear-gradient(135deg,#7c3aed,#a78bfa)",
      color: "#fff", fontSize: 11, fontWeight: 800,
      padding: "2px 8px", borderRadius: 6, letterSpacing: 0.2,
    }}>
      Win ₹{amount}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ADD BUTTON
═══════════════════════════════════════════════════════════════ */
function AddBtn({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "8px 18px", borderRadius: 10,
        background: disabled ? "#e9d5ff" : "linear-gradient(135deg,#8b5cf6,#7c3aed)",
        color: disabled ? "#a78bfa" : "#fff",
        border: "none", fontSize: 13, fontWeight: 800,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.15s", flexShrink: 0,
        boxShadow: disabled ? "none" : "0 2px 8px rgba(139,92,246,0.35)",
      }}
    >
      ADD
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BOX BUTTON (for Triple section)
═══════════════════════════════════════════════════════════════ */
function BoxBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 18px", borderRadius: 10,
        background: "#f3f0ff", color: "#6d28d9",
        border: "1.5px solid #c4b5fd", fontSize: 13, fontWeight: 800,
        cursor: "pointer", transition: "all 0.15s", flexShrink: 0,
      }}
    >
      BOX
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   QUICK GUESS BUTTON
═══════════════════════════════════════════════════════════════ */
function QuickGuessBtn({ onQuick }) {
  return (
    <button
      onClick={onQuick}
      style={{
        fontSize: 12, fontWeight: 700, color: "#6d28d9",
        background: "transparent", border: "none", cursor: "pointer",
        padding: "2px 0", textDecoration: "underline", textDecorationStyle: "dotted",
      }}
    >
      Quick Guess
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SINGLE DIGIT SECTION — A, B, C rows
═══════════════════════════════════════════════════════════════ */
function SingleDigitSection({ config, onAdd, isLocked }) {
  // Each row: {pos, digit}
  const [rows, setRows] = useState([
    { pos: "A", digit: null },
    { pos: "B", digit: null },
    { pos: "C", digit: null },
  ]);
  const [picker, setPicker] = useState(null); // {rowIdx}

  const setDigit = (rowIdx, val) => {
    setRows(r => r.map((row, i) => i === rowIdx ? { ...row, digit: val } : row));
  };

  const quickGuess = () => {
    setRows(r => r.map(row => ({ ...row, digit: Math.floor(Math.random() * 10) })));
  };

  const handleAdd = (rowIdx) => {
    const row = rows[rowIdx];
    if (row.digit === null) return;
    onAdd({ type: "single", pos: row.pos, digit: row.digit, price: config.single.price, win: config.single.win });
    setRows(r => r.map((ro, i) => i === rowIdx ? { ...ro, digit: null } : ro));
  };

  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "16px 16px 14px", marginBottom: 12, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e" }}>Single</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#6b7280" }}>Digit</span>
            <WinBadge amount={config.single.win.toLocaleString("en-IN")} />
          </div>
          <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>₹{config.single.price}.00</span>
        </div>
        <QuickGuessBtn onQuick={quickGuess} />
      </div>

      {/* A, B, C rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map((row, idx) => (
          <div key={row.pos} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <PosBadge pos={row.pos} />
            <DigitBox
              value={row.digit}
              onClick={() => !isLocked && setPicker(idx)}
            />
            <div style={{ flex: 1 }} />
            <AddBtn
              disabled={row.digit === null || isLocked}
              onClick={() => handleAdd(idx)}
            />
          </div>
        ))}
      </div>

      {picker !== null && (
        <NumberPicker
          label={rows[picker].pos}
          onPick={val => setDigit(picker, val)}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DOUBLE DIGIT SECTION — AB, AC, BC rows (2 digit boxes each)
═══════════════════════════════════════════════════════════════ */
function DoubleDigitSection({ config, onAdd, isLocked }) {
  const combos = [
    { combo: "AB", pos1: "A", pos2: "B" },
    { combo: "AC", pos1: "A", pos2: "C" },
    { combo: "BC", pos1: "B", pos2: "C" },
  ];
  const [rows, setRows] = useState(combos.map(c => ({ ...c, d1: null, d2: null })));
  const [picker, setPicker] = useState(null); // {rowIdx, slot: 'd1'|'d2'}

  const setDigit = (rowIdx, slot, val) => {
    setRows(r => r.map((row, i) => i === rowIdx ? { ...row, [slot]: val } : row));
  };

  const quickGuess = () => {
    setRows(r => r.map(row => ({ ...row, d1: Math.floor(Math.random() * 10), d2: Math.floor(Math.random() * 10) })));
  };

  const handleAdd = (rowIdx) => {
    const row = rows[rowIdx];
    if (row.d1 === null || row.d2 === null) return;
    onAdd({ type: "double", combo: row.combo, digits: `${row.d1}${row.d2}`, price: config.double.price, win: config.double.win });
    setRows(r => r.map((ro, i) => i === rowIdx ? { ...ro, d1: null, d2: null } : ro));
  };

  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "16px 16px 14px", marginBottom: 12, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e" }}>Double</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#6b7280" }}>Digit</span>
            <WinBadge amount={config.double.win.toLocaleString("en-IN")} />
          </div>
          <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>₹{config.double.price}.00</span>
        </div>
        <QuickGuessBtn onQuick={quickGuess} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map((row, idx) => (
          <div key={row.combo} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PosBadge pos={row.pos1} />
            <PosBadge pos={row.pos2} />
            <DigitBox value={row.d1} onClick={() => !isLocked && setPicker({ rowIdx: idx, slot: "d1" })} />
            <DigitBox value={row.d2} onClick={() => !isLocked && setPicker({ rowIdx: idx, slot: "d2" })} />
            <div style={{ flex: 1 }} />
            <AddBtn
              disabled={row.d1 === null || row.d2 === null || isLocked}
              onClick={() => handleAdd(idx)}
            />
          </div>
        ))}
      </div>

      {picker !== null && (
        <NumberPicker
          label={`${rows[picker.rowIdx].combo} — ${picker.slot === "d1" ? rows[picker.rowIdx].pos1 : rows[picker.rowIdx].pos2}`}
          onPick={val => setDigit(picker.rowIdx, picker.slot, val)}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TRIPLE DIGIT SECTION — ABC (3 boxes + BOX + ADD)
═══════════════════════════════════════════════════════════════ */
function TripleDigitSection({ config, onAdd, isLocked }) {
  const [digits, setDigits] = useState([null, null, null]);
  const [picker, setPicker] = useState(null); // slot 0/1/2
  const [isBox, setIsBox] = useState(false);

  const quickGuess = () => {
    setDigits([0, 1, 2].map(() => Math.floor(Math.random() * 10)));
  };

  const handleAdd = () => {
    if (digits.some(d => d === null)) return;
    const abc = digits.join("");
    onAdd({ type: "triple", digits: abc, isBox, price: config.triple.price, win: config.triple.win });
    setDigits([null, null, null]);
    setIsBox(false);
  };

  const handleBox = () => {
    if (digits.some(d => d === null)) return;
    setIsBox(b => !b);
  };

  const allFilled = digits.every(d => d !== null);

  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "16px 16px 14px", marginBottom: 12, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e" }}>Triple</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#6b7280" }}>Digit</span>
            <WinBadge amount={config.triple.win.toLocaleString("en-IN")} />
          </div>
          <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>₹{config.triple.price}.00</span>
        </div>
        <QuickGuessBtn onQuick={quickGuess} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* A B C badges */}
        <PosBadge pos="A" />
        <PosBadge pos="B" />
        <PosBadge pos="C" />

        <div style={{ flex: 1 }} />

        {/* 3 digit boxes */}
        <div style={{ display: "flex", gap: 6 }}>
          {digits.map((d, i) => (
            <DigitBox
              key={i}
              value={d}
              onClick={() => !isLocked && setPicker(i)}
            />
          ))}
        </div>
      </div>

      {/* BOX + ADD row */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <BoxBtn onClick={handleBox} />
        <AddBtn
          disabled={!allFilled || isLocked}
          onClick={handleAdd}
        />
      </div>

      {isBox && allFilled && (
        <div style={{ marginTop: 8, background: "#f3f0ff", borderRadius: 8, padding: "6px 12px", fontSize: 11, color: "#6d28d9", fontWeight: 600 }}>
          📦 BOX mode: all permutations of {digits.join("")} will be entered
        </div>
      )}

      {picker !== null && (
        <NumberPicker
          label={["A", "B", "C"][picker]}
          onPick={val => {
            setDigits(d => d.map((x, i) => i === picker ? val : x));
          }}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CART BOTTOM BAR — ₹0.00 / 0 numbers / Pay Now
═══════════════════════════════════════════════════════════════ */
function CartBar({ cart, onPayNow }) {
  const total = cart.reduce((s, i) => s + i.price, 0);
  return (
    <div style={{
      position: "sticky", bottom: 0, left: 0, right: 0, zIndex: 40,
      background: "#fff", borderTop: "1px solid #f0eef8",
      padding: "10px 16px", display: "flex", alignItems: "center", gap: 12,
      boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#7c3aed,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
        🛒
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e" }}>
          ₹{total.toFixed(2)}
        </div>
        <div style={{ fontSize: 11, color: "#9ca3af" }}>{cart.length} number{cart.length !== 1 ? "s" : ""}</div>
      </div>
      <button
        onClick={onPayNow}
        disabled={cart.length === 0}
        style={{
          padding: "13px 28px", borderRadius: 14, border: "none",
          background: cart.length === 0 ? "#e9d5ff" : "linear-gradient(135deg,#7c3aed,#a855f7)",
          color: cart.length === 0 ? "#c4b5fd" : "#fff",
          fontWeight: 900, fontSize: 15, cursor: cart.length === 0 ? "not-allowed" : "pointer",
          boxShadow: cart.length > 0 ? "0 4px 16px rgba(124,58,237,0.4)" : "none",
          transition: "all 0.2s",
        }}
      >
        Pay Now
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RESULT HISTORY TABLE
═══════════════════════════════════════════════════════════════ */
function ResultHistory({ history }) {
  return (
    <div>
      {/* Column headers */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px", padding: "8px 14px", background: "#f8f6ff", borderBottom: "1px solid #ede9f8" }}>
        {["ISSUE", "A", "B", "C"].map(h => (
          <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, textAlign: h !== "ISSUE" ? "center" : "left" }}>
            {h}
          </span>
        ))}
      </div>
      {history.map((row, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px", padding: "11px 14px", borderBottom: "1px solid #f4f2fc", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#555", fontFamily: "monospace" }}>{row.issue}</span>
          {[row.a, row.b, row.c].map((d, di) => (
            <div key={di} style={{ display: "flex", justifyContent: "center" }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: `radial-gradient(circle at 35% 30%, ${RES_BALL_COLORS[d]}cc, ${RES_BALL_COLORS[d]})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 12, fontWeight: 900,
              }}>
                {d}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MY ORDERS TABLE
═══════════════════════════════════════════════════════════════ */
function MyOrders({ orders }) {
  if (orders.length === 0) return (
    <div style={{ padding: "40px 20px", textAlign: "center", color: "#bbb" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#9ca3af" }}>No orders yet</div>
      <div style={{ fontSize: 12, marginTop: 4, color: "#d1d5db" }}>Add numbers and pay to place orders</div>
    </div>
  );

  return (
    <div>
      {orders.map((o, i) => {
        const statusColor = o.status === "won" ? "#16a34a" : o.status === "lost" ? "#ef4444" : "#f59e0b";
        const statusLabel = o.status === "won" ? "WON" : o.status === "lost" ? "LOST" : "PENDING";
        return (
          <div key={i} style={{ padding: "12px 14px", borderBottom: "1px solid #f4f2fc" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e" }}>
                    {o.type === "single" ? `${o.pos}: ${o.digit}` : o.type === "double" ? `${o.combo}: ${o.digits}` : `ABC: ${o.digits}`}
                  </span>
                  <span style={{ fontSize: 11, background: statusColor + "18", color: statusColor, padding: "1px 7px", borderRadius: 10, fontWeight: 700 }}>
                    {statusLabel}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>
                  {o.type === "single" ? "Single Digit" : o.type === "double" ? "Double Digit" : "Triple Digit"} · ₹{o.price} · {o.issue}
                </div>
              </div>
              <div style={{ textAlign: "right", fontSize: 14, fontWeight: 800 }}>
                {o.status === "won"
                  ? <span style={{ color: "#16a34a" }}>+₹{o.win}</span>
                  : o.status === "lost"
                    ? <span style={{ color: "#ef4444" }}>-₹{o.price}</span>
                    : <span style={{ color: "#f59e0b", fontSize: 12 }}>Pending</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAY CONFIRMATION MODAL
═══════════════════════════════════════════════════════════════ */
function PayModal({ cart, balance, onConfirm, onClose }) {
  const total = cart.reduce((s, i) => s + i.price, 0);
  const insufficient = total > balance;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "fadeIn 0.2s ease" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 430, animation: "slideUp 0.3s cubic-bezier(.32,.72,0,1)" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "#ddd", margin: "10px auto 0" }} />
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0eef8" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a2e", marginBottom: 4 }}>Confirm Payment</div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>{cart.length} ticket{cart.length !== 1 ? "s" : ""} selected</div>
        </div>
        <div style={{ padding: "14px 20px", maxHeight: "40vh", overflowY: "auto" }}>
          {cart.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < cart.length - 1 ? "1px solid #f9f6ff" : "none" }}>
              <span style={{ fontSize: 13, color: "#374151" }}>
                {item.type === "single" ? `Single ${item.pos}: ${item.digit}` : item.type === "double" ? `Double ${item.combo}: ${item.digits}` : `Triple ABC: ${item.digits}`}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#6d28d9" }}>₹{item.price}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 20px", background: "#f8f6ff", display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>Wallet Balance</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#1a1a2e" }}>₹{balance.toLocaleString("en-IN")}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>Total</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#6d28d9" }}>₹{total.toFixed(2)}</div>
          </div>
        </div>
        <div style={{ padding: "14px 20px 24px" }}>
          {insufficient && (
            <div style={{ background: "#fef2f2", borderRadius: 10, padding: "8px 12px", marginBottom: 10, fontSize: 12, color: "#ef4444", fontWeight: 600 }}>
              ⚠️ Insufficient balance. Please deposit funds.
            </div>
          )}
          <button
            disabled={insufficient}
            onClick={onConfirm}
            style={{
              width: "100%", padding: 15, borderRadius: 14, border: "none", cursor: insufficient ? "not-allowed" : "pointer",
              background: insufficient ? "#e9d5ff" : "linear-gradient(135deg,#7c3aed,#a855f7)",
              color: insufficient ? "#c4b5fd" : "#fff", fontWeight: 900, fontSize: 15,
              boxShadow: insufficient ? "none" : "0 4px 16px rgba(124,58,237,0.4)",
            }}
          >
            {insufficient ? "Insufficient Balance" : `Pay ₹${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
export default function ThreeDigitGame({ config = LOTTERY_CONFIGS.bhutan_jackpot }) {
  /* ── State ── */
  const [activePeriod, setActivePeriod] = useState(
    config.type === "period_tabs" ? config.periods[0] : null
  );
  const [activeSlot, setActiveSlot] = useState(
    config.type === "time_slots" ? config.drawTimes[0] : null
  );
  const [timeLeft, setTimeLeft] = useState(
    config.type === "period_tabs" ? config.periods[0].seconds : config.roundDuration
  );
  const [roundId, setRoundId] = useState(genRoundId());
  const [lastResult, setLastResult] = useState({ a: 9, b: 3, c: 0 });
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState(() => seedHistory(20));
  const [histTab, setHistTab] = useState("result");
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [balance, setBalance] = useState(5000);
  const [showRules, setShowRules] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const LOCK_AT = 30; // lock 30s before draw
  const isLocked = timeLeft <= LOCK_AT;
  const navigate = useNavigate();

  /* ── Timer ── */
  useEffect(() => {
    const totalSec = activePeriod ? activePeriod.seconds : config.roundDuration;
    setTimeLeft(totalSec);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { triggerDraw(); return totalSec; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [activePeriod, activeSlot]);

  /* ── Draw ── */
  const triggerDraw = useCallback(() => {
    setRolling(true);
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    const c = Math.floor(Math.random() * 10);
    const nextId = String(parseInt(roundId) + 1);

    setTimeout(() => {
      setLastResult({ a, b, c });
      setRolling(false);
      setHistory(prev => [{ issue: nextId, a, b, c, abc: `${a}${b}${c}` }, ...prev.slice(0, 49)]);
      setRoundId(nextId);

      // Settle pending orders
      setOrders(prev => prev.map(ord => {
        if (ord.settled) return ord;
        let won = false;
        if (ord.type === "single") {
          won = ({ A: a, B: b, C: c }[ord.pos] === ord.digit);
        } else if (ord.type === "double") {
          const map = { AB: `${a}${b}`, BC: `${b}${c}`, AC: `${a}${c}` };
          won = map[ord.combo] === ord.digits;
        } else {
          // Triple — check ABC, BC, C
          if (`${a}${b}${c}` === ord.digits) { ord = { ...ord, won: true, winAmt: config.triple.win, matched: "ABC" }; }
          else if (`${b}${c}` === ord.digits.slice(1)) { ord = { ...ord, won: true, winAmt: 1000, matched: "BC" }; }
          else if (`${c}` === ord.digits.slice(2)) { ord = { ...ord, won: true, winAmt: 100, matched: "C" }; }
          else ord = { ...ord, won: false };
          if (ord.won) setBalance(p => p + ord.winAmt);
          return { ...ord, settled: true, status: ord.won ? "won" : "lost", win: ord.winAmt };
        }
        if (won) setBalance(p => p + ord.win);
        return { ...ord, settled: true, status: won ? "won" : "lost" };
      }));

      showToast(`🎯 Draw result: A=${a} B=${b} C=${c}`);
    }, 600);
  }, [roundId, config]);

  /* ── Toast ── */
  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  /* ── Add to cart ── */
  const handleAdd = useCallback((item) => {
    if (isLocked) { showToast("⏳ Betting locked before draw!", "error"); return; }
    setCart(c => [...c, { ...item, id: Date.now() + Math.random(), issue: roundId }]);
    showToast(`✅ Added to cart — ${item.type === "single" ? `${item.pos}:${item.digit}` : item.type === "double" ? `${item.combo}:${item.digits}` : `ABC:${item.digits}`}`);
  }, [isLocked, roundId, showToast]);

  /* ── Pay ── */
  const handleConfirmPay = useCallback(() => {
    const total = cart.reduce((s, i) => s + i.price, 0);
    setBalance(b => b - total);
    setOrders(prev => [...cart.map(item => ({ ...item, settled: false, status: "pending" })), ...prev]);
    setCart([]);
    setShowPay(false);
    showToast("🎉 Tickets purchased successfully!", "win");
  }, [cart, showToast]);

  /* ── Period/Slot change ── */
  const handlePeriodChange = (p) => {
    setActivePeriod(p);
    setRoundId(genRoundId());
  };
  const handleSlotChange = (slot) => {
    setActiveSlot(slot);
    setRoundId(genRoundId());
  };

  /* ══════════════════════ RENDER ══════════════════════ */
  return (
    <>
      <style>{`
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { -webkit-tap-highlight-color: transparent; user-select: none; }
        ::-webkit-scrollbar { width: 0; height: 0; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
      `}</style>

      <div style={{ display: "flex", justifyContent: "center", minHeight: "100vh", background: "#e8e8f0" }}>
        <div style={{ width: "100%", maxWidth: 430, minHeight: "100vh", background: "#f0f0f8", display: "flex", flexDirection: "column", position: "relative", overflowX: "hidden" }}>

          {/* ── TOAST ── */}
          {toast && (
            <div style={{
              position: "fixed", top: 68, left: "50%", transform: "translateX(-50%)", zIndex: 999,
              background: toast.type === "error" ? "linear-gradient(135deg,#b91c1c,#ef4444)" : toast.type === "win" ? "linear-gradient(135deg,#16a34a,#22c55e)" : "#1a1a2e",
              color: "#fff", padding: "10px 22px", borderRadius: 24, fontSize: 13,
              fontWeight: 600, whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              animation: "fadeIn 0.3s ease", maxWidth: 360, textAlign: "center",
            }}>
              {toast.msg}
            </div>
          )}

          {showRules && <RulesModal config={config} onClose={() => setShowRules(false)} />}
          {showPay && <PayModal cart={cart} balance={balance} onConfirm={handleConfirmPay} onClose={() => setShowPay(false)} />}

          {/* ════════════════════════════
              SECTION 1 · HEADER
          ════════════════════════════ */}
          {/* SCROLLABLE GAME CONTENT */}

          <div style={{
            background: "#fff", display: "flex", alignItems: "center",
            justifyContent: "space-between", padding: "0 16px", height: 52,
            borderBottom: "1px solid #e8e8f0", position: "sticky", top: 0, zIndex: 40, flexShrink: 0,
          }}>
            <button style={{ width: 34, height: 34, borderRadius: "50%", background: "#f4f4f8", border: "none", cursor: "pointer", fontSize: 18, color: "#333", display: "flex", alignItems: "center", justifyContent: "center" }}
              onClick={() => navigate(-1)}>‹</button>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>{config.title}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8f0ff", border: "1px solid #e0d0ff", borderRadius: 20, padding: "4px 12px 4px 8px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <span style={{ fontSize: 9, color: "#888", lineHeight: 1 }}>Balance</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#1a1a2e", lineHeight: 1.3 }}>₹{balance.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#8b5cf6,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💳</div>
            </div>
          </div>

          {/* ════════════════════════════
              SECTION 2A · TICKET NOTICE BANNER (time_slots only)
          ════════════════════════════ */}


          {config.type === "time_slots" && config.ticketNoticeMinutes && (
            <div style={{ background: "#fefce8", borderBottom: "1px solid #fde68a", padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <span style={{ fontSize: 16 }}>🔔</span>
              <span style={{ fontSize: 12, color: "#92400e", fontWeight: 500 }}>
                Tickets will not be available for purchase {config.ticketNoticeMinutes} minutes before the draw
              </span>
            </div>
          )}

          {/* ════════════════════════════
              SECTION 2B · PERIOD TABS (period_tabs) or DRAW TIME SLOTS (time_slots)
          ════════════════════════════ */}
          {config.type === "period_tabs" && (
            <div style={{ background: "#fff", padding: "10px 12px", display: "flex", gap: 8, flexShrink: 0 }}>
              {config.periods.map(p => {
                const active = activePeriod?.key === p.key;
                return (
                  <button
                    key={p.key}
                    onClick={() => handlePeriodChange(p)}
                    style={{
                      flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      padding: "10px 12px", borderRadius: 12, cursor: "pointer",
                      background: active ? "#fff" : "#f4f4f8",
                      border: active ? "2px solid #8b5cf6" : "2px solid transparent",
                      boxShadow: active ? "0 2px 12px rgba(139,92,246,0.2)" : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, boxShadow: "0 2px 8px rgba(245,158,11,0.4)" }}>⏱</div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{p.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {config.type === "time_slots" && (
            <div style={{ background: "#fff", padding: "8px 12px", display: "flex", gap: 8, overflowX: "auto", flexShrink: 0, scrollbarWidth: "none" }}>
              {config.drawTimes.map(slot => {
                const active = activeSlot === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => handleSlotChange(slot)}
                    style={{
                      flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                      padding: "8px 14px", borderRadius: 12, cursor: "pointer",
                      background: active ? "#fff" : "#f4f4f8",
                      border: active ? "2px solid #8b5cf6" : "2px solid transparent",
                      boxShadow: active ? "0 2px 12px rgba(139,92,246,0.2)" : "none",
                      minWidth: 80, transition: "all 0.2s",
                    }}
                  >
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, boxShadow: "0 2px 6px rgba(245,158,11,0.4)" }}>⏱</div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>{slot}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ════════════════════════════
              SECTION 3 · ROUND INFO PANEL
              Game name | round ID | How to play | Result balls | Countdown
          ════════════════════════════ */}
          <div style={{ background: "linear-gradient(135deg,#e8e4f8,#d4ccf0)", padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, gap: 10 }}>
            {/* Left */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#3b1a8a" }}>
                {config.type === "time_slots" ? config.title : "Quick 3D"}
              </div>
              <div style={{ fontSize: 11, color: "#6b4fa0", fontFamily: "monospace", marginTop: 2 }}>{roundId}</div>
              <button
                onClick={() => setShowRules(true)}
                style={{ background: "#fff", border: "1px solid #ccc", borderRadius: 20, padding: "3px 12px", fontSize: 11, color: "#555", cursor: "pointer", marginTop: 6 }}
              >
                How to play
              </button>
            </div>

            {/* Center — 3 result balls (A B C) */}
            <div style={{ display: "flex", gap: 6, padding: "6px 10px", background: "rgba(255,255,255,0.35)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.5)" }}>
              {rolling ? (
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#6d28d9", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 900, animation: "spin 0.5s linear infinite" }}>?</div>
              ) : (
                <>
                  <ResultBall digit={lastResult.a} pos="A" />
                  <ResultBall digit={lastResult.b} pos="B" />
                  <ResultBall digit={lastResult.c} pos="C" />
                </>
              )}
            </div>

            {/* Divider */}
            <div style={{ width: 1, alignSelf: "stretch", background: "rgba(109,40,217,0.2)", flexShrink: 0 }} />

            {/* Right — countdown */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
              <span style={{ fontSize: 10, color: "#6b4fa0", fontWeight: 500 }}>Time remaining</span>
              <Countdown seconds={timeLeft} />
              <span style={{ fontSize: 10, color: "#8b6bbf", fontFamily: "monospace", marginTop: 2 }}>
                {config.type === "time_slots" ? activeSlot : String(parseInt(roundId) + 1)}
              </span>
            </div>
          </div>

          {/* Lock progress bar */}
          <div style={{ height: 4, background: "#d4ccf0", flexShrink: 0 }}>
            <div style={{
              height: "100%",
              width: `${((activePeriod ? activePeriod.seconds : config.roundDuration) - timeLeft) / (activePeriod ? activePeriod.seconds : config.roundDuration) * 100}%`,
              background: isLocked ? "linear-gradient(90deg,#ef4444,#dc2626)" : "linear-gradient(90deg,#8b5cf6,#ec4899)",
              transition: "width 1s linear",
            }} />
          </div>

          {/* ════════════════════════════
              SCROLLABLE GAME CONTENT
          ════════════════════════════ */}
          <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", padding: "12px 12px 8px" }}>

            {/* Lock banner */}
            {isLocked && (
              <div style={{ background: "linear-gradient(135deg,#fef2f2,#fff)", border: "1px solid #fecaca", borderRadius: 12, padding: "10px 16px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>🔒</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#dc2626" }}>Betting Locked</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>Draw in {timeLeft}s — next round opens soon</div>
                </div>
              </div>
            )}

            {/* ── Single Digit ── */}
            <SingleDigitSection config={config} onAdd={handleAdd} isLocked={isLocked} />

            {/* ── Double Digit ── */}
            <DoubleDigitSection config={config} onAdd={handleAdd} isLocked={isLocked} />

            {/* ── Triple Digit ── */}
            <TripleDigitSection config={config} onAdd={handleAdd} isLocked={isLocked} />

            {/* ════════════════════════════
                SECTION 4 · HISTORY TABS
            ════════════════════════════ */}
            <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", marginBottom: 12 }}>
              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "2px solid #f0eef8" }}>
                {[["result", "Result history"], ["myorder", "My order"]].map(([k, l]) => (
                  <button
                    key={k}
                    onClick={() => setHistTab(k)}
                    style={{
                      flex: 1, padding: "13px 4px", textAlign: "center", fontSize: 14, fontWeight: 600,
                      color: histTab === k ? "#1a1a2e" : "#888", border: "none", background: "none",
                      cursor: "pointer", position: "relative",
                    }}
                  >
                    {l}
                    {histTab === k && (
                      <span style={{ position: "absolute", bottom: -2, left: "20%", right: "20%", height: 3, background: "#6d28d9", borderRadius: 2 }} />
                    )}
                  </button>
                ))}
              </div>

              {histTab === "result" && <ResultHistory history={history} />}
              {histTab === "myorder" && <MyOrders orders={orders} />}
            </div>

            <div style={{ height: 16 }} />
          </div>

          {/* ════════════════════════════
              SECTION 5 · CART BAR
          ════════════════════════════ */}
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
            <CartBar
              cart={cart}
              onPayNow={() => cart.length > 0 && setShowPay(true)}
            />
          </div>
        </div>
      </div>


    </>
  );
}
