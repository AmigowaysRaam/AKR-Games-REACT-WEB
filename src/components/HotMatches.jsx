import React, { useRef } from "react";

function MatchCard({ match }) {
  const isLive = match.status === "LIVE";

  return (
    <div
      className="flex-shrink-0 w-64 rounded-xl overflow-hidden border border-black/10 hover:border-black/20 transition-all duration-200 hover:-translate-y-0.4"
      style={{
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-black/5">
        <div className="flex items-center gap-1.5">
          {isLive ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-red-400 text-xs tracking-wider">
                LIVE
              </span>
            </>
          ) : (
            <span className="text-gray-500 text-xs font-bold">
              {match.time}
            </span>
          )}
        </div>

        <span className="text-black text-xs truncate max-w-[100px]">
          {match.league}
        </span>

        <span className="text-black text-xs">
          🔥 {match.popularity}%
        </span>
      </div>

      {/* TEAMS */}
      <div className="px-3 py-3 space-y-2.5">
        {/* TEAM 1 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{match.team1?.emoji}</span>
            <span className="text-black font-bold text-sm">
              {match.team1?.name}
            </span>
          </div>

          {isLive && (
            <div className="text-right">
              <p className="text-black font-bold text-sm">
                {match.team1?.score}
              </p>
              <p className="text-gray-400 text-xs">
                {match.team1?.overs} ov
              </p>
            </div>
          )}
        </div>

        {/* VS */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-black/5" />
          <span className="text-gray-400 text-xs font-bold">VS</span>
          <div className="flex-1 h-px bg-black/5" />
        </div>

        {/* TEAM 2 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{match.team2?.emoji}</span>
            <span className="text-black font-bold text-sm">
              {match.team2?.name}
            </span>
          </div>

          {isLive && (
            <div className="text-right">
              <p className="text-black font-bold text-sm">
                {match.team2?.score}
              </p>
              <p className="text-gray-400 text-xs">
                {match.team2?.overs} ov
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="px-3 pb-3">
        <button
          className="w-full py-2 rounded-xl text-xs font-bold text-black tracking-wide transition-all hover:brightness-110 active:scale-95"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.6), rgba(219,39,119,0.6))",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {match.outcomes} Available Outcomes 🎯
        </button>
      </div>
    </div>
  );
}

export default function HotMatchesSection({ matches }) {
  const scrollRef = useRef(null);

  let isDown = false;
  let startX;
  let scrollLeft;

  // Mouse events for drag scroll
  const handleMouseDown = (e) => {
    isDown = true;
    scrollRef.current.classList.add("cursor-grabbing");
    startX = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown = false;
    scrollRef.current.classList.remove("cursor-grabbing");
  };

  const handleMouseUp = () => {
    isDown = false;
    scrollRef.current.classList.remove("cursor-grabbing");
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  if (!matches || matches.length === 0) {
    return (
      <div className="text-center text-gray-400 py-10">
        No live matches available
      </div>
    );
  }

  return (
    <div className="py-2">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar px-4 gap-3 pb-2 cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {matches.map((m) => (
          <MatchCard key={m.id} match={m} />
        ))}
      </div>
    </div>
  );
}