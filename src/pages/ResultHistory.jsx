import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function ResultScreen() {
  const navigate = useNavigate();

  const [mainTab, setMainTab] = useState("lottery");
  const [subTab, setSubTab] = useState("scratch");

  // Tabs (API ready)
  const mainTabs = [
    { id: "lottery", label: "Lottery" },
    { id: "casino", label: "Casino" },
  ];

  const subTabs = [
    { id: "scratch", label: "Scratch Off" },
    { id: "kerala", label: "Kerala" },
    { id: "3digit", label: "3 Digits" },
    { id: "quick3", label: "Quick 3 Digits" },
    { id: "color", label: "Color" },
    { id: "dice", label: "Dice" },
    { id: "matka", label: "Matka" },
  ];

  // Dummy leaderboard data (API-ready)
  const dummyData = [
    { rank: 1, name: "Wild-1", user: "957****978", amount: "₹23,000" },
    { rank: 2, name: "SAPPHIRE", user: "810****307", amount: "₹13,320" },
    { rank: 3, name: "SAPPHIRE", user: "994****625", amount: "₹11,860" },
    { rank: 4, name: "Wild-1", user: "879****702", amount: "₹10,700" },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <ChevronLeft />
        </button>
        Result
      </div>

      {/* Main Tabs */}
      <div style={styles.mainTabs}>
        {mainTabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setMainTab(tab.id)}
            style={{
              ...styles.mainTab,
              ...(mainTab === tab.id && styles.activeMainTab),
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Sub Tabs */}
      <div style={styles.subTabs}>
        {subTabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            style={styles.subTabItem}
          >
            <span
              style={{
                ...styles.subTabText,
                color: subTab === tab.id ? "#000" : "#555",
              }}
            >
              {tab.label}
            </span>
            {subTab === tab.id && <div style={styles.activeUnderline} />}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            {subTabs.find((t) => t.id === subTab)?.label} Leaderboard
          </div>

          {/* Table Header */}
          <div style={styles.tableHeader}>
            <span>Game</span>
            <span>User</span>
            <span>Bonus</span>
          </div>

          {/* List */}
          {dummyData.map((item) => (
            <div key={item.rank} style={styles.row}>
              <div style={styles.game}>
                <span style={styles.rank}>{item.rank}</span>
                {item.name}
              </div>
              <div>{item.user}</div>
              <div style={styles.amount}>{item.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
const styles = {
  container: {
    maxWidth: 430,
    margin: "0 auto",
    background: "#f4f6fb",
    minHeight: "100vh",
    fontFamily: "sans-serif",
  },

  header: {
    background: "#fff",
    padding: "14px",
    textAlign: "center",
    fontWeight: 700,
    position: "relative",
    borderBottom: "1px solid #eee",
  },

  backBtn: {
    position: "absolute",
    left: 10,
    top: 10,
    border: "none",
    background: "none",
    cursor: "pointer",
  },

  mainTabs: {
    display: "flex",
    gap: 10,
    padding: 15,
    background: "#fff",
  },

  mainTab: {
    padding: "8px 18px",
    borderRadius: 10,
    background: "#e5e7eb",
    fontWeight: 600,
    cursor: "pointer",
  },

  activeMainTab: {
    background: "#fff",
    borderTop: "3px solid #7c3aed",
  },
  subTabs: {
    display: "flex",
    gap: 20,
    padding: "12px 15px",
    overflowX: "auto",
    background: "#fff",
    borderTop: "1px solid #eee",
  
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    WebkitOverflowScrolling: "touch",
  
    scrollSnapType: "x mandatory", // 👈 key
  },
  subTabItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    whiteSpace: "nowrap",
  
    scrollSnapAlign: "start", // 👈 snap each tab
  },

  subTabText: {
    fontWeight: 500,
  },

  activeUnderline: {
    marginTop: 6,
    width: "60%",
    height: 3,
    background: "#7c3aed",
    borderRadius: 2,
  },

  content: {
    padding: 10,
  },

  card: {
    background: "#fff",
    borderRadius: 10,
    padding: 10,
  },

  cardTitle: {
    fontWeight: 600,
    marginBottom: 10,
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    color: "#888",
    padding: "8px 0",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #eee",
    alignItems: "center",
  },

  game: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  rank: {
    background: "#ddd",
    borderRadius: 6,
    padding: "2px 6px",
    fontSize: 12,
  },

  amount: {
    fontWeight: 600,
  },
};