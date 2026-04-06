import React from "react";
import { diceGames, colorGames } from "../data/mockData";
import { useCountdown } from "../hooks/useCountdown";
function CountdownBadge({ secs }) {
  const { display } = useCountdown(secs);
  return (
    <span className="font-mono text-white/80 text-xs font-bold bg-black/25 px-2 py-0.5 rounded-full">
      ⏱ {display}
    </span>
  );
}
function GameCard({ game, countdownSecs, badge }) {
  return (
    <div className="flex-shrink-0 w-40 rounded-2xl overflow-hidden relative cursor-pointer hover:-translate-y-1 transition-all duration-200 active:scale-95"
      style={{ background: `linear-gradient(145deg, var(--from), var(--to))`, boxShadow: `0 10px 30px ${game.shadowColor}` }}>
      <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient}`} />

      {/* Decorative blur ball */}
      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10 blur-xl" />

      <div className="relative p-4 flex flex-col gap-3">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-white/50 text-xs font-semibold">{game.label}</span>
            <h3 className="text-white font-black text-lg leading-none">{game.duration}</h3>
            <span className="text-white/60 text-xs">{game.sublabel}</span>
          </div>
          <span className="text-2xl">{game.emoji}</span>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between">
            <span className="text-white/50 text-xs">Players</span>
            <span className="text-white text-xs font-bold">{game.players}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50 text-xs">Max Win</span>
            <span className="text-amber-300 text-xs font-black">{game.maxWin}</span>
          </div>
        </div>

        {/* Countdown */}
        <CountdownBadge secs={countdownSecs} />

        {/* CTA */}
        <button className="w-full py-2 rounded-xl text-xs font-black text-white tracking-wider bg-black/25 border border-white/20 hover:bg-black/35 transition-colors">
          Play Now →
        </button>
      </div>

      {/* Badge */}
      {badge && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
          {badge}
        </div>
      )}
    </div>
  );
}
export function DiceSection() {
  const countdowns = [59, 179, 299];
  return (
    <div className="py-2">
      <div className="flex overflow-x-auto scrollbar-none px-4 gap-3 pb-2">
        {diceGames.map((g, i) => (
          <GameCard key={g.id} game={g} countdownSecs={countdowns[i]} badge={i === 0 ? "HOT" : null} />
        ))}
      </div>
    </div>
  );
}
export function ColorSection() {
  const countdowns = [45, 160];
  return (
    <div className="py-2">
      <div className="flex overflow-x-auto scrollbar-none px-4 gap-3 pb-2">
        {colorGames.map((g, i) => (
          <GameCard key={g.id} game={g} countdownSecs={countdowns[i]} badge={i === 0 ? "HOT" : null} />
        ))}
      </div>
    </div>
  );
}
