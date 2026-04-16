export default function FishPrawnCrabBet({ isBetSelected, toggleBet }) {
  const items = [
    { id: "fish", label: "Fish", nums: "1,2,3" },
    { id: "prawn", label: "Prawn", nums: "4,5,6" },
    { id: "crab", label: "Crab", nums: "7,8,9" },
  ];

  return (
    <div style={{ padding: 14, display: "flex", gap: 10 }}>
      {items.map(i => {
        const selected = isBetSelected("D", i.id);
        return (
          <button
            key={i.id}
            onClick={() => toggleBet("D", i.id)}
            style={{
              flex: 1,
              padding: 16,
              borderRadius: 12,
              border: "2px solid #22c55e",
              background: selected ? "#22c55e22" : "#fff"
            }}
          >
            <div style={{ fontWeight: 700 }}>{i.label}</div>
            <div style={{ fontSize: 12 }}>{i.nums}</div>
          </button>
        );
      })}
    </div>
  );
}