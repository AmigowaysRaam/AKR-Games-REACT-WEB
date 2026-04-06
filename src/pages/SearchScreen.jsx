import { useState } from "react";
import { ChevronLeft, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("dice");

  // 👉 Card Data
  const results = [
    { id: 1, title: "ROBO DICE", color: "linear-gradient(135deg,#22c55e,#16a34a)" },
    { id: 2, title: "DICE 1 Minutes", color: "linear-gradient(135deg,#f43f5e,#fb923c)" },
    { id: 3, title: "DICE 3 Minutes", color: "linear-gradient(135deg,#16a34a,#65a30d)" },
    { id: 4, title: "DICE 5 Minutes", color: "linear-gradient(135deg,#3b82f6,#6366f1)" },
    { id: 5, title: "DICE 15 Minutes", color: "linear-gradient(135deg,#7c3aed,#9333ea)" },
    { id: 6, title: "FOOTBALL STUDIO DICE", color: "linear-gradient(135deg,#1f2937,#374151)" },
    { id: 7, title: "DICE SPRIBE", color: "linear-gradient(135deg,#9333ea,#ec4899)" },
    { id: 8, title: "BONUS DICE", color: "linear-gradient(135deg,#f59e0b,#b45309)" },
  ];

  return (
    <div style={styles.container}>
      
      {/* HEADER WITH SEARCH */}
      <div style={styles.header}>
        <ChevronLeft size={22} onClick={() => navigate(-1)} />

        <div style={styles.searchBox}>
          <Search size={16} color="#666" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.input}
          />
          <X size={16} color="#999" />
        </div>
      </div>

      {/* TITLE */}
      <div style={styles.resultHeader}>
        <span style={{ fontWeight: "bold" }}>search Result</span>
        <span style={{ color: "#6b21a8" }}>About {results.length} results</span>
      </div>

      {/* GRID */}
      <div style={styles.grid}>
        {results.map((item) => (
          <div
            key={item.id}
            style={{
              ...styles.card,
              background: item.color,
            }}
          >
            <div style={styles.cardTitle}>{item.title}</div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div style={styles.footer}>No More</div>
    </div>
  );
}
const styles = {
  container: {    maxWidth: 430,    margin: "0 auto",    background: "#f6f7fb",    minHeight: "100vh",
    fontFamily: "sans-serif",  },
  header: {    display: "flex",    alignItems: "center",
    gap: 10,    padding: 12,    background: "#fff",  },
  searchBox: {    flex: 1,    display: "flex",    alignItems: "center",    background: "#eef0f4",
    borderRadius: 30,    padding: "6px 10px",    gap: 8,  },
  input: {    flex: 1,    border: "none",    background: "transparent",
    outline: "none",    fontSize: 14,  },
  resultHeader: {    display: "flex",
    justifyContent: "space-between",
    padding: "12px 16px",    fontSize: 14,  },  grid: {    display: "grid",    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,    padding: 16,  },  card: {    height: 140,    borderRadius: 16,
    padding: 12,    color: "#fff",    display: "flex",    alignItems:"flex-end",
    fontWeight: "bold",    fontSize: 14,  },  cardTitle: {    lineHeight: 1.2,  },
  footer: {
    textAlign: "center",
    color: "#999",
    fontSize: 13,
    paddingBottom: 20,
  },
};