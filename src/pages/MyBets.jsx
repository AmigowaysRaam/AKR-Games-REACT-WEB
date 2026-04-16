import { useState } from "react";
import { ChevronLeft, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyBets() {
  const navigate = useNavigate();

  const tabs = ["ALL", "To be drawn", "Drawn", "Won"];
  const categories = ["Kerala",
    "3 Digit", "Quick 3D", "Color", "Quick Race", "Dice",
    "Satta Matka",
    "Scratch off", "Casino", "Live", "Sports", "State Lottery",
    "Quick State Lottery",
  ];

  const [activeTab, setActiveTab] = useState("ALL");
  const [activeCategory, setActiveCategory] = useState("Kerala");

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <ChevronLeft size={22} onClick={() => navigate(-1)} />
        <span style={{ fontWeight: "600" }}>My Bets</span>
        <Headphones size={20} onClick={() => navigate('/CustomerSupport')} />
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              borderBottom:
                activeTab === tab ? "2px solid #7c3aed" : "none",
              color: activeTab === tab ? "#7c3aed" : "#555",
            }}
          >
            {tab}
          </div>
        ))}

        {/* DATE */}
        <div style={styles.dateBox}>📅 03/26</div>
      </div>

      {/* CATEGORY CHIPS */}
      <div style={styles.chipsContainer}>
        {categories.map((cat) => (
          <div
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              ...styles.chip,
              background:
                activeCategory === cat ? "#ede9fe" : "#f1f1f1",
              color: activeCategory === cat ? "#7c3aed" : "#555",
              border:
                activeCategory === cat
                  ? "1px solid #7c3aed"
                  : "1px solid transparent",
            }}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      <div style={styles.empty}>
        <div style={styles.boxIcon}>📦</div>
        <div style={styles.noData}>No Data</div>
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  container: {
    maxWidth: 430,
    margin: "0 auto",
    background: "#f5f6fa",
    minHeight: "100vh",
    fontFamily: "sans-serif",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    background: "#fff",
    borderBottom: "1px solid #eee",
  },

  tabs: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "10px 12px",
    background: "#fff",
    overflowX: "auto",
  },

  tab: {
    fontSize: 14,
    paddingBottom: 6,
    cursor: "pointer", transition: "all 0.2s ease",
  },

  dateBox: {
    marginLeft: "auto", fontSize: 12, background: "#f1f1f1",
    padding: "6px 10px",
    borderRadius: 6,
  }, chipsContainer: {
    display: "flex", flexWrap: "wrap", gap: 10,
    padding: 12,
    background: "#fff",
  },

  chip: {
    padding: "6px 12px",
    borderRadius: 20,
    fontSize: 12,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  empty: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "60vh",
    color: "#aaa",
  },

  boxIcon: {
    fontSize: 40,
    marginBottom: 10,
    opacity: 0.6,
    animation: "float 2s infinite ease-in-out",
  },

  noData: {
    fontSize: 14,
  },
};

/* ANIMATION */
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
}
`, styleSheet.cssRules.length);