export default function ThreeDBetGrid({ isBetSelected, toggleBet }) {
  const ROWS = [
    { key: "A", color: "#F59E0B" }, // orange
    { key: "B", color: "#3B82F6" }, // blue
    { key: "C", color: "#EF4444" }  // red
  ];

  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      {ROWS.map(row => (
        <div key={row.key} style={{ display: "flex", alignItems: "center", gap: 10 }}>

          {/* 🔹 LEFT SIDE: Letter + Dot */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 22
          }}>
            <span style={{
              fontWeight: 800,
              fontSize: 15,
              color: row.color
            }}>
              {row.key}
            </span>

            <div style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: row.color,
              marginTop: 4
            }} />
          </div>

          {/* 🔹 NUMBER GRID */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5,1fr)",
            gap: 10,
            flex: 1
          }}>
            {[0,1,2,3,4,5,6,7,8,9].map(n => {
              const selected = isBetSelected(row.key, n);

              return (
                <button
                  key={n}
                  onClick={() => toggleBet(row.key, n)}
                  style={{
                    height: 48,
                    borderRadius: "50%",
                    border: `2px solid ${selected ? row.color : row.color + "55"}`,
                    background: selected ? row.color + "22" : "#fff",
                    color: selected ? row.color : "#333",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    transform: selected ? "scale(1.05)" : "scale(1)"
                  }}
                >
                  {n}
                </button>
              );
            })}
          </div>

        </div>
      ))}
    </div>
  );
}