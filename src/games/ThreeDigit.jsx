import { ChevronLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
 
// ─── GAME DATA ────────────────────────────────────────────────────────────────
 
export const THREE_DIGIT_GAMES = [
  {
    id: "8",
    name: "Quick 3D",
    subtitle: "3min",
    pickGameType: "quick",
    cycle: 3,
    ticketPrice: 11,
    singleWin: 100,
    doubleWin: 1000,
    tripleWin: 10000,
    bgImage: null,
    bgColor: "from-blue-500 to-cyan-400",
    slots: ["00:01:00", "00:04:00", "00:07:00", "00:10:00"],
    resultHistory: [
      { issue: "202604070251", time: "12:36:00 PM", a: 3, b: 8, c: 9 },
      { issue: "202604070250", time: "12:33:00 PM", a: 6, b: 0, c: 0 },
      { issue: "202604070249", time: "12:30:00 PM", a: 6, b: 9, c: 4 },
      { issue: "202604070248", time: "12:27:00 PM", a: 2, b: 5, c: 9 },
      { issue: "202604070247", time: "12:24:00 PM", a: 7, b: 8, c: 8 },
      { issue: "202604070246", time: "12:21:00 PM", a: 5, b: 4, c: 9 },
      { issue: "202604070245", time: "12:18:00 PM", a: 3, b: 4, c: 7 },
      { issue: "202604070244", time: "12:15:00 PM", a: 9, b: 7, c: 2 },
      { issue: "202604070243", time: "12:12:00 PM", a: 9, b: 0, c: 5 },
      { issue: "202604070242", time: "12:09:00 PM", a: 1, b: 0, c: 9 },
    ],
  },
  {
    id: "9",
    name: "BhutanJackpot",
    subtitle: "",
    pickGameType: "scheduled",
    cycle: 30,
    ticketPrice: 50,
    singleWin: 100,
    doubleWin: 1000,
    tripleWin: 30000,
    bgColor: "from-yellow-500 to-orange-500",
    notice: "Tickets will not be available for purchase 3 minutes before the draw",
    slots: ["12:45 PM", "01:15 PM", "01:45 PM", "02:15 PM", "02:45 PM"],
    resultHistory: [
      { issue: "20260407899", time: "12:45:00 PM", a: 5, b: 4, c: 2 },
      { issue: "20260407898", time: "12:15:00 PM", a: 1, b: 7, c: 3 },
      { issue: "20260407897", time: "11:45:00 AM", a: 8, b: 2, c: 6 },
      { issue: "20260407896", time: "11:15:00 AM", a: 4, b: 9, c: 0 },
      { issue: "20260407895", time: "10:45:00 AM", a: 7, b: 3, c: 5 },
    ],
  },
  {
    id: "10",
    name: "Sky Win",
    subtitle: "",
    pickGameType: "scheduled",
    cycle: 30,
    ticketPrice: 11,
    singleWin: 100,
    doubleWin: 1000,
    tripleWin: 25000,
    bgColor: "from-indigo-500 to-purple-600",
    slots: ["12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM"],
    resultHistory: [
      { issue: "20260407501", time: "12:30:00 PM", a: 4, b: 1, c: 7 },
      { issue: "20260407500", time: "12:00:00 PM", a: 9, b: 3, c: 2 },
      { issue: "20260407499", time: "11:30:00 AM", a: 0, b: 6, c: 8 },
      { issue: "20260407498", time: "11:00:00 AM", a: 5, b: 5, c: 1 },
      { issue: "20260407497", time: "10:30:00 AM", a: 3, b: 9, c: 4 },
    ],
  },
  {
    id: "11",
    name: "ChennaiLotto",
    subtitle: "",
    pickGameType: "scheduled",
    cycle: 30,
    ticketPrice: 11,
    singleWin: 100,
    doubleWin: 1000,
    tripleWin: 30000,
    bgColor: "from-red-500 to-pink-600",
    slots: ["12:37 PM", "01:07 PM", "01:37 PM", "02:07 PM"],
    resultHistory: [
      { issue: "20260407301", time: "12:37:00 PM", a: 7, b: 2, c: 5 },
      { issue: "20260407300", time: "12:07:00 PM", a: 3, b: 8, c: 1 },
      { issue: "20260407299", time: "11:37:00 AM", a: 6, b: 4, c: 9 },
      { issue: "20260407298", time: "11:07:00 AM", a: 0, b: 7, c: 3 },
      { issue: "20260407297", time: "10:37:00 AM", a: 2, b: 1, c: 8 },
    ],
  },
  {
    id: "12",
    name: "Quick 3D",
    subtitle: "5min",
    pickGameType: "quick",
    cycle: 5,
    ticketPrice: 11,
    singleWin: 100,
    doubleWin: 1000,
    tripleWin: 10000,
    bgColor: "from-blue-500 to-cyan-400",
    slots: ["00:02:00", "00:07:00", "00:12:00", "00:17:00"],
    resultHistory: [
      { issue: "202604070101", time: "12:35:00 PM", a: 2, b: 6, c: 4 },
      { issue: "202604070100", time: "12:30:00 PM", a: 8, b: 1, c: 7 },
      { issue: "202604070099", time: "12:25:00 PM", a: 5, b: 3, c: 0 },
      { issue: "202604070098", time: "12:20:00 PM", a: 9, b: 9, c: 2 },
      { issue: "202604070097", time: "12:15:00 PM", a: 1, b: 4, c: 6 },
    ],
  },
  {
    id: "13",
    name: "Dear Lottery",
    subtitle: "",
    pickGameType: "scheduled",
    cycle: 30,
    ticketPrice: 11,
    singleWin: 100,
    doubleWin: 1000,
    tripleWin: 15000,
    bgColor: "from-purple-600 to-indigo-700",
    slots: ["01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"],
    resultHistory: [
      { issue: "20260407201", time: "01:00:00 PM", a: 4, b: 7, c: 3 },
      { issue: "20260407200", time: "12:00:00 PM", a: 8, b: 2, c: 6 },
      { issue: "20260407199", time: "11:00:00 AM", a: 1, b: 5, c: 9 },
      { issue: "20260407198", time: "10:00:00 AM", a: 0, b: 3, c: 7 },
      { issue: "20260407197", time: "09:00:00 AM", a: 6, b: 8, c: 2 },
    ],
  },
  {
    id: "14",
    name: "Kerala Lottery",
    subtitle: "",
    pickGameType: "scheduled",
    cycle: 30,
    ticketPrice: 11,
    singleWin: 100,
    doubleWin: 1000,
    tripleWin: 15000,
    bgColor: "from-green-500 to-emerald-600",
    slots: ["01:30 PM", "02:30 PM", "03:30 PM", "04:30 PM"],
    resultHistory: [
      { issue: "20260407401", time: "01:30:00 PM", a: 6, b: 2, c: 8 },
      { issue: "20260407400", time: "12:30:00 PM", a: 3, b: 7, c: 4 },
      { issue: "20260407399", time: "11:30:00 AM", a: 9, b: 1, c: 5 },
      { issue: "20260407398", time: "10:30:00 AM", a: 0, b: 4, c: 2 },
      { issue: "20260407397", time: "09:30:00 AM", a: 7, b: 6, c: 3 },
    ],
  },
  {
    id: "15",
    name: "Lucwin",
    subtitle: "",
    pickGameType: "scheduled",
    cycle: 30,
    ticketPrice: 11,
    singleWin: 100,
    doubleWin: 1000,
    tripleWin: 15000,
    bgColor: "from-violet-500 to-fuchsia-600",
    slots: ["12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM"],
    resultHistory: [
      { issue: "20260407601", time: "12:00:00 PM", a: 5, b: 8, c: 1 },
      { issue: "20260407600", time: "11:00:00 AM", a: 2, b: 3, c: 7 },
      { issue: "20260407599", time: "10:00:00 AM", a: 9, b: 6, c: 4 },
      { issue: "20260407598", time: "09:00:00 AM", a: 0, b: 1, c: 8 },
      { issue: "20260407597", time: "08:00:00 AM", a: 4, b: 5, c: 2 },
    ],
  },
  {
    id: "16",
    name: "Kuber Lottery",
    subtitle: "",
    pickGameType: "scheduled",
    cycle: 30,
    ticketPrice: 11,
    singleWin: 100,
    doubleWin: 1000,
    tripleWin: 50000,
    bgColor: "from-yellow-400 to-amber-600",
    slots: ["01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM"],
    resultHistory: [
      { issue: "20260407701", time: "01:00:00 PM", a: 7, b: 4, c: 9 },
      { issue: "20260407700", time: "12:30:00 PM", a: 2, b: 8, c: 3 },
      { issue: "20260407699", time: "12:00:00 PM", a: 5, b: 1, c: 6 },
      { issue: "20260407698", time: "11:30:00 AM", a: 0, b: 7, c: 4 },
      { issue: "20260407697", time: "11:00:00 AM", a: 8, b: 2, c: 1 },
    ],
  },
];
 
// ─── HELPERS ──────────────────────────────────────────────────────────────────
 
function useCountdown(initialSeconds) {
  const [secs, setSecs] = useState(initialSeconds);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return [h, m, s];
}
 
function DigitBall({ label, color }) {
  const colors = {
    A: "bg-red-500",
    B: "bg-orange-400",
    C: "bg-blue-600",
  };
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm ${colors[color] || "bg-gray-400"}`}>
      {label}
    </div>
  );
}
 
function ResultBall({ value, color }) {
  const colors = {
    A: "bg-red-500",
    B: "bg-orange-400",
    C: "bg-blue-600",
  };
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${colors[color]}`}>
      {value}
    </div>
  );
}
 
function DigitInput({ value, onChange }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/, "").slice(-1))}
      className="w-9 h-9 border border-gray-200 rounded-lg text-center text-sm font-semibold text-gray-700 focus:outline-none focus:border-purple-400 bg-white"
      placeholder="–"
    />
  );
}
 
// ─── DETAIL PAGE ──────────────────────────────────────────────────────────────
 
export function ThreeDigitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const game = THREE_DIGIT_GAMES.find((g) => g.id === id);
 
  // All hooks before early return
  const [activeSlotIdx, setActiveSlotIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("result");
  const [resultPage, setResultPage] = useState(1);
  const [bets, setBets] = useState([]);
 
  // Single digit inputs: A, B, C
  const [singleA, setSingleA] = useState("");
  const [singleB, setSingleB] = useState("");
  const [singleC, setSingleC] = useState("");
 
  // Double digit inputs: AB(2), AC(2), BC(2)
  const [doubleAB, setDoubleAB] = useState(["", ""]);
  const [doubleAC, setDoubleAC] = useState(["", ""]);
  const [doubleBC, setDoubleBC] = useState(["", ""]);
 
  // Triple digit inputs: ABC(3)
  const [triple, setTriple] = useState(["", "", ""]);
 
  const [h, m, s] = useCountdown(game ? game.cycle * 60 - 10 : 0);
 
  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Game not found.{" "}
        <button onClick={() => navigate(-1)} className="ml-2 text-purple-600 underline">Go back</button>
      </div>
    );
  }
 
  const lastResult = game.resultHistory[0];
  const totalBet = bets.reduce((s, b) => s + b.price, 0);
  const perPage = 10;
  const totalPages = Math.ceil(game.resultHistory.length / perPage);
  const pagedHistory = game.resultHistory.slice((resultPage - 1) * perPage, resultPage * perPage);
 
  const addBet = (type, digits, price) => {
    if (digits.some((d) => d === "")) return;
    setBets((prev) => [...prev, { type, digits, price }]);
  };
 
  const quickGuess = (setter, len) => {
    if (len === 1) setter(String(Math.floor(Math.random() * 10)));
    else setter(Array.from({ length: len }, () => String(Math.floor(Math.random() * 10))));
  };
 
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="text-2xl text-gray-500 leading-none"><ChevronLeft/></button>
        <span className="font-semibold text-gray-900">{game.name}</span>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>Balance</span>
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">💰</div>
        </div>
      </div>
 
      {/* Notice */}
      {game.notice && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center gap-2 text-xs text-yellow-800">
          <span>🔔</span>
          <span>{game.notice}</span>
        </div>
      )}
 
      {/* Time Slots */}
      <div className="bg-white border-b border-gray-100 px-3 py-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {game.slots.map((slot, i) => (
            <button
              key={i}
              onClick={() => setActiveSlotIdx(i)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
                activeSlotIdx === i
                  ? "bg-purple-100 border-purple-400 text-purple-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              <span>⏱</span> {slot}
            </button>
          ))}
        </div>
      </div>
 
      {/* Current Draw Info */}
      <div className="mx-4 mt-3 mb-2 bg-purple-50 border border-purple-200 rounded-2xl px-4 py-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-bold text-gray-800 text-sm">{game.name} {game.subtitle}</div>
            <div className="text-xs text-gray-400 mb-2">{lastResult.issue}</div>
            <div className="flex items-center gap-1">
              <button className="text-xs border border-gray-300 rounded-lg px-2 py-0.5 text-gray-500 hover:bg-gray-100">
                How to play
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              <ResultBall value={lastResult.a} color="A" />
              <ResultBall value={lastResult.b} color="B" />
              <ResultBall value={lastResult.c} color="C" />
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 mb-1">Time remaining</div>
            <div className="flex gap-1">
              {[h[0], h[1], ":", m[0], m[1], ":", s[0], s[1]].map((ch, i) =>
                ch === ":" ? (
                  <span key={i} className="text-gray-700 font-bold text-lg self-center">:</span>
                ) : (
                  <div key={i} className="w-8 h-9 bg-gray-900 text-white rounded flex items-center justify-center font-bold text-base">
                    {ch}
                  </div>
                )
              )}
            </div>
            <div className="text-xs text-gray-400 mt-1">{lastResult.issue.slice(-6)}</div>
          </div>
        </div>
      </div>
 
      {/* ── SINGLE DIGIT ── */}
      <div className="mx-4 mb-3 bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-bold text-gray-800 text-sm">Single </span>
            <span className="text-gray-400 text-sm">Digit </span>
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
              Win ₹{game.singleWin}.00
            </span>
          </div>
          <button
            onClick={() => { quickGuess(setSingleA, 1); quickGuess(setSingleB, 1); quickGuess(setSingleC, 1); }}
            className="text-xs border border-purple-300 text-purple-600 px-3 py-1 rounded-lg hover:bg-purple-50"
          >
            Quick Guess
          </button>
        </div>
        <div className="text-xs text-gray-400 mb-3">₹{game.ticketPrice}.00</div>
 
        {[
          { label: "A", val: singleA, set: setSingleA },
          { label: "B", val: singleB, set: setSingleB },
          { label: "C", val: singleC, set: setSingleC },
        ].map(({ label, val, set }) => (
          <div key={label} className="flex items-center gap-3 mb-2">
            <DigitBall label={label} color={label} />
            <DigitInput value={val} onChange={set} />
            <div className="flex-1" />
            <button
              onClick={() => addBet("Single", [val], game.ticketPrice)}
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold text-xs px-5 py-2 rounded-lg transition-colors"
            >
              ADD
            </button>
          </div>
        ))}
      </div>
 
      {/* ── DOUBLE DIGIT ── */}
      <div className="mx-4 mb-3 bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-bold text-gray-800 text-sm">Double </span>
            <span className="text-gray-400 text-sm">Digit </span>
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
              Win ₹{game.doubleWin.toLocaleString("en-IN")}.00
            </span>
          </div>
          <button
            onClick={() => {
              quickGuess(setDoubleAB, 2);
              quickGuess(setDoubleAC, 2);
              quickGuess(setDoubleBC, 2);
            }}
            className="text-xs border border-purple-300 text-purple-600 px-3 py-1 rounded-lg hover:bg-purple-50"
          >
            Quick Guess
          </button>
        </div>
        <div className="text-xs text-gray-400 mb-3">₹{game.ticketPrice}.00</div>
 
        {[
          { labels: ["A", "B"], val: doubleAB, set: setDoubleAB },
          { labels: ["A", "C"], val: doubleAC, set: setDoubleAC },
          { labels: ["B", "C"], val: doubleBC, set: setDoubleBC },
        ].map(({ labels, val, set }) => (
          <div key={labels.join("")} className="flex items-center gap-2 mb-2">
            {labels.map((l) => <DigitBall key={l} label={l} color={l} />)}
            {val.map((v, i) => (
              <DigitInput key={i} value={v} onChange={(nv) => set((prev) => { const copy = [...prev]; copy[i] = nv; return copy; })} />
            ))}
            <div className="flex-1" />
            <button
              onClick={() => addBet("Double", val, game.ticketPrice)}
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold text-xs px-5 py-2 rounded-lg transition-colors"
            >
              ADD
            </button>
          </div>
        ))}
      </div>
 
      {/* ── TRIPLE DIGIT ── */}
      <div className="mx-4 mb-3 bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-bold text-gray-800 text-sm">Triple </span>
            <span className="text-gray-400 text-sm">Digit </span>
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
              Win ₹{game.tripleWin.toLocaleString("en-IN")}.00
            </span>
          </div>
          <button
            onClick={() => quickGuess(setTriple, 3)}
            className="text-xs border border-purple-300 text-purple-600 px-3 py-1 rounded-lg hover:bg-purple-50"
          >
            Quick Guess
          </button>
        </div>
        <div className="text-xs text-gray-400 mb-3">₹{game.ticketPrice * 2 - 1}.00</div>
 
        <div className="flex items-center gap-2">
          <DigitBall label="A" color="A" />
          <DigitBall label="B" color="B" />
          <DigitBall label="C" color="C" />
          <div className="flex gap-1 ml-auto">
            {triple.map((v, i) => (
              <DigitInput key={i} value={v} onChange={(nv) => setTriple((prev) => { const copy = [...prev]; copy[i] = nv; return copy; })} />
            ))}
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-3">
          <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold text-xs px-5 py-2 rounded-lg transition-colors">
            BOX
          </button>
          <button
            onClick={() => addBet("Triple", triple, game.ticketPrice * 2 - 1)}
            className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold text-xs px-5 py-2 rounded-lg transition-colors"
          >
            ADD
          </button>
        </div>
      </div>
 
      {/* ── TABS ── */}
      <div className="mx-4 bg-white rounded-t-2xl border border-gray-100 border-b-0">
        <div className="flex">
          {["result", "myorder"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-3 text-sm relative transition-colors ${
                activeTab === t ? "font-bold text-gray-900" : "text-gray-400"
              }`}
            >
              {t === "result" ? "Result history" : "My order"}
              {activeTab === t && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-purple-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
 
      {/* ── TAB CONTENT ── */}
      <div className="mx-4 mb-28 bg-white rounded-b-2xl border border-gray-100 border-t-0 px-3 pb-4">
        {activeTab === "result" && (
          <>
            <table className="w-full text-sm mt-2">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">Issue</th>
                  <th className="text-center py-2 text-xs text-gray-400 font-semibold">Time</th>
                  <th className="py-2 pr-2">
                    <div className="flex gap-1 justify-end">
                      <ResultBall value="A" color="A" />
                      <ResultBall value="B" color="B" />
                      <ResultBall value="C" color="C" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedHistory.map((r, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="py-2 px-2 text-xs text-gray-500">{r.issue}</td>
                    <td className="py-2 text-center text-xs text-gray-500">{r.time}</td>
                    <td className="py-2 pr-2">
                      <div className="flex gap-1 justify-end">
                        <ResultBall value={r.a} color="A" />
                        <ResultBall value={r.b} color="B" />
                        <ResultBall value={r.c} color="C" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-4 text-sm">
              <span className="text-gray-400 text-xs">Total {game.resultHistory.length}</span>
              {[...Array(Math.min(totalPages, 3))].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setResultPage(i + 1)}
                  className={`w-7 h-7 rounded-full text-xs font-semibold ${
                    resultPage === i + 1 ? "bg-purple-600 text-white" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setResultPage((p) => Math.min(p + 1, totalPages))}
                className="w-7 h-7 rounded-full border border-gray-200 text-gray-400 text-xs flex items-center justify-center hover:bg-gray-100"
              >
                ›
              </button>
            </div>
          </>
        )}
        {activeTab === "myorder" && (
          <div className="py-10 text-center text-gray-400 text-sm">No orders placed yet.</div>
        )}
      </div>
 
      {/* ── BOTTOM BAR ── */}
      <div style={{ 
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
            }}>

        <div className="flex items-center gap-2 justify-between">
          <div className="flex gap-2">
          <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm">🛒</span>
          </div>
          <div>
            <div className="font-bold text-gray-900 text-base">₹{totalBet.toFixed(2)}</div>
            <div className="text-xs text-gray-400">{bets.length} numbers</div>
          </div>
          </div>
          <button
          disabled={bets.length === 0}
          className=" bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold px-8 py-3 rounded-full text-sm transition-colors"
        >
          Pay Now
        </button>
        </div>
        
      </div>
    </div>
  );
}
 
// ─── GAME CARD ────────────────────────────────────────────────────────────────
 
function GameCard({ game }) {
  const navigate = useNavigate();
  const [h, m, s] = useCountdown(game.cycle * 60 - 15);
 
  return (
    <div
      onClick={() => navigate(`/threedigit/${game.id}`)}
      className="rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.02] transition-all border border-gray-100"
    >
      <div className={`relative h-36 bg-gradient-to-br ${game.bgColor} p-3 flex flex-col justify-between`}>
        <div>
          <div className="text-xs text-white/70 font-medium uppercase tracking-wider">{game.subtitle || "Lottery"}</div>
          <div className="text-white font-extrabold text-base leading-tight">
            WIN PRIZE<br />
            <span className="text-2xl">₹{game.tripleWin.toLocaleString("en-IN")}</span>
          </div>
        </div>
        <div className="text-xs text-white/80">
          Time for Next Booking
          <div className="font-mono font-bold text-white mt-0.5">
            {h} : {m} : {s}
          </div>
        </div>
      </div>
      <div className="bg-white px-3 py-1.5 flex items-center justify-between">
        <span className="text-xs text-gray-500">₹{game.ticketPrice}.00 / Ticket</span>
      </div>
    </div>
  );
}
 
// ─── LIST PAGE ────────────────────────────────────────────────────────────────
 
export function ThreeDigitList() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-3 h-5 bg-green-500 rounded-sm" />
        <h2 className="font-bold text-gray-800 text-xl">3 Digit Game</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {THREE_DIGIT_GAMES.map((g) => (
          <GameCard key={g.id} game={g} />
        ))}
      </div>
    </div>
  );
}
 
export default ThreeDigitList;