export default function OneDigitBetGrid({ isBetSelected, toggleBet }) {
  return (
    <div style={{ padding: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
        {[0,1,2,3,4,5,6,7,8,9].map(n => {
          const selected = isBetSelected("1D", n);
          return (
            <button
              key={n}
              onClick={() => toggleBet("1D", n)}
              style={{
                height: 50,
                borderRadius: "50%",
                border: "2px solid #ddd",
                background: selected ? "#7c3aed" : "#fff",
                color: selected ? "#fff" : "#333",
                fontWeight: 700
              }}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}