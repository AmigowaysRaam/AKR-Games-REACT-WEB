import { useState } from "react";

const rowColors = {
  A: "#f59e0b",
  B: "#3b82f6",
  C: "#ef4444",
  D: "#22c55e",
};

export default function BetGrid() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="mt-3">
      {["A","B","C","D"].map((row) => {
        const color = rowColors[row];

        return (
          <div key={row} className="flex gap-3 mb-4 items-center">
            
            {/* DOT */}
            <div className="w-4 h-4 rounded-full" style={{ background: color }} />

            {/* BUTTONS */}
            <div className="grid grid-cols-4 gap-2 flex-1">
              {["Odd","Even","Big","Small"].map((type)=> {
                const key = row + type;
                const isActive = selected === key;

                return (
                  <button
                    key={key}
                    onClick={()=>setSelected(key)}
                    className={`rounded-xl py-2 text-sm font-semibold transition ${
                      isActive ? "bg-purple-100" : ""
                    }`}
                    style={{ border:`2px solid ${color}` }}
                  >
                    {type}
                    <div className="text-xs text-gray-400">1.95X</div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}