import React from "react";
import { stateLotteries } from "../data/mockData";
import { useCountdown } from "../hooks/useCountdown";

// ─── KERALA / STATE LOTTERY ───────────────────────────────────────────────────
export function StateLotterySection() {
  return (
    <div className="py-2">
      <div className="flex overflow-x-auto scrollbar-none px-4 gap-3 pb-2">
        {stateLotteries.map((l) => (
          <div key={l.id}
            className="flex-shrink-0 w-44 rounded-2xl overflow-hidden relative cursor-pointer hover:-translate-y-1 transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {/* Gradient top strip */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${l.color}`} />
            <div className="p-4 flex flex-col gap-2">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${l.color} flex items-center justify-center text-xl shadow-lg`}>
                🎟️
              </div>
              <div>
                <p className="text-white font-black text-sm leading-tight">{l.name}</p>
                <p className="text-white/40 text-xs">{l.day}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-400 font-black text-sm">{l.prize}</p>
                  <p className="text-white/30 text-xs">1st Prize</p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs font-bold">{l.drawTime}</p>
                  <p className="text-white/30 text-xs">Draw</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-white/5">
                <span className="text-white/40 text-xs">Tickets</span>
                <span className="text-green-400 text-xs font-bold">{l.tickets} sold</span>
              </div>
              <button className={`w-full py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r ${l.color} shadow-lg`}>
                Buy Ticket ₹40
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 3-DIGIT SECTION ──────────────────────────────────────────────────────────
const threeDigitDraws = [
  { time: "1:00 PM",  name: "Afternoon",  countdown: 1800, jackpot: "₹9,00,000" },
  { time: "6:00 PM",  name: "Evening",    countdown: 5400, jackpot: "₹9,00,000" },
  { time: "8:30 PM",  name: "Night",      countdown: 9000, jackpot: "₹9,00,000" },
];

function DigitDrawCard({ draw }) {
  const { display } = useCountdown(draw.countdown);
  return (
    <div className="flex-shrink-0 w-44 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all"
      style={{ background: "linear-gradient(145deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))", border: "1px solid rgba(139,92,246,0.2)" }}>
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-lg shadow-lg shadow-indigo-500/30">
            🔢
          </div>
          <div>
            <p className="text-white font-black text-sm">{draw.name}</p>
            <p className="text-white/40 text-xs">{draw.time} Draw</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/40 text-xs">Jackpot</span>
          <span className="text-amber-400 font-black text-sm">{draw.jackpot}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/40 text-xs">Starts in</span>
          <span className="font-mono text-indigo-400 font-black text-sm">{display}</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {[0,1,2,3,4,5,6,7,8,9].slice(0,9).map(n => (
            <button key={n}
              className="aspect-square rounded-lg text-white/60 text-sm font-bold hover:bg-indigo-500/30 hover:text-white transition-all"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              {n}
            </button>
          ))}
        </div>
        <button className="w-full py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
          Place Bet →
        </button>
      </div>
    </div>
  );
}

export function ThreeDigitSection() {
  return (
    <div className="py-2">
      <div className="flex overflow-x-auto scrollbar-none px-4 gap-3 pb-2">
        {threeDigitDraws.map((d, i) => <DigitDrawCard key={i} draw={d} />)}
      </div>
    </div>
  );
}

// ─── MATKA SECTION ────────────────────────────────────────────────────────────
const matkaMarkets = [
  { name: "Kalyan",         status: "OPEN",   time: "3:45 PM – 5:45 PM", color: "from-amber-500 to-orange-600",   glow: "#f59e0b" },
  { name: "Milan Day",      status: "OPEN",   time: "9:00 AM – 11:30 AM",color: "from-blue-500 to-indigo-600",    glow: "#3b82f6" },
  { name: "Rajdhani Night", status: "CLOSED", time: "9:30 PM – 11:30 PM",color: "from-rose-500 to-red-600",      glow: "#f43f5e" },
  { name: "Main Bazar",     status: "SOON",   time: "9:00 PM – 11:59 PM",color: "from-emerald-500 to-teal-600",  glow: "#10b981" },
];

export function MatkaSection() {
  return (
    <div className="py-2">
      <div className="flex overflow-x-auto scrollbar-none px-4 gap-3 pb-2">
        {matkaMarkets.map((m) => (
          <div key={m.name}
            className="flex-shrink-0 w-44 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className={`h-1.5 w-full bg-gradient-to-r ${m.color}`} />
            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-xl`}
                  style={{ boxShadow: `0 4px 14px ${m.glow}40` }}>
                  🎯
                </div>
                <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                  m.status === "OPEN"   ? "bg-green-500/20 text-green-400" :
                  m.status === "SOON"   ? "bg-amber-500/20 text-amber-400" :
                                          "bg-white/10 text-white/30"}`}>
                  {m.status}
                </span>
              </div>
              <p className="text-white font-black text-sm">{m.name}</p>
              <p className="text-white/40 text-xs">{m.time}</p>
              <div className="grid grid-cols-2 gap-1.5 text-center">
                {["Single 9X","Jodi 90X","Panna 150X","Sangam 1500X"].map(b => (
                  <div key={b} className="text-xs text-white/40 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
                    {b}
                  </div>
                ))}
              </div>
              <button className={`w-full py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r ${m.color} ${m.status !== "OPEN" ? "opacity-50 cursor-not-allowed" : ""}`}>
                {m.status === "OPEN" ? "Play Now →" : m.status === "SOON" ? "Opens Soon" : "Closed"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
