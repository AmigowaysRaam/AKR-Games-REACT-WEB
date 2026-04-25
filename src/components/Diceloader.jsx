import { useEffect, useState } from "react";

function DiceLoader() {
  const [dice, setDice] = useState([1, 2, 3]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDice([
        Math.ceil(Math.random() * 6),
        Math.ceil(Math.random() * 6),
        Math.ceil(Math.random() * 6),
      ]);
    }, 120); // 🔥 speed of rolling

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: 50 }}>
      
      {/* 🎲 DICE */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        {dice.map((d, i) => (
          <div
            key={i}
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "linear-gradient(145deg,#ffffff,#f1f1f1)",
              border: "2px solid #ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 18,
              animation: "diceBounce 0.6s infinite",
              animationDelay: `${i * 0.15}s`,
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              transition: "all 0.1s",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* TEXT */}
      <div style={{ marginTop: 14, fontSize: 13, color: "#888" }}>
        🎲 Rolling orders...
      </div>

      {/* ANIMATION */}
      <style>
        {`
          @keyframes diceBounce {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-12px) scale(1.15); }
          }
        `}
      </style>
    </div>
  );
}

export default DiceLoader;