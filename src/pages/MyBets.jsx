import { useEffect, useState } from "react";
import { ChevronLeft, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getBetTabHistory } from "../services/authService";

import KeralLotteryMyOrders from "./KeralalotteryOrders";
import MyDiceOrderTab from "../components/DiceOrdersScreen";
import MyOrderColorPrediction from "../components/MyOrdersColorPrediction";
import ThreeDigitOrders from "../components/ThreeDigitOrders";

export default function MyBets() {
  const navigate = useNavigate();

  const [tabs, setTabs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      fetchData(parsedUser.id);
    } else {
      setLoading(false);
    }
  }, [selectedDate]);

  const fetchData = async (userId) => {
    try {
      setLoading(true);

      const res = await getBetTabHistory({
        id: userId,
        date: selectedDate,
      });

      const apiData = res?.data || {};

      const tabList = apiData?.tabData || [];
      setTabs(tabList);
      setActiveTab(tabList[0] || "");

      const gameList = apiData?.games || [];
      setCategories(gameList);
      setActiveCategory(gameList[0]?.key || "");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SWITCH RENDER FUNCTION

  const renderContent = () => {
    switch (activeCategory) {
      case "dice":
        return <MyDiceOrderTab />;

      case "color":
        return <MyOrderColorPrediction />;

      case "3digit":
        return <ThreeDigitOrders />;

      case "kerala":
        return (
          <KeralLotteryMyOrders
            activeTab={activeTab}
            selectedDate={selectedDate}
          />
        );

      default:
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              width: "100%",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "35px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #ccc, #ddd,#c5c5c5)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                width: "80%",
                maxWidth: "260px",
                animation: "float 0.7s ease-in-out infinite",
              }}
            >
              <div
                style={{
                  fontSize: "50px",
                  marginBottom: "10px",
                  animation: "float 0.8s ease-in-out infinite",
                }}
              >
                📦
              </div>
              <h3
                style={{
                  fontSize: "19px",
                  fontWeight: "600",
                  color: "#333",
                  margin: 0,
                }}
              >
                No Data Available
              </h3>

              <p
                style={{
                  fontSize: "12px",
                  color: "#666",
                  marginTop: "6px",
                }}
              >
                Please select a valid category
              </p>
            </div>
          </div>
        );
    }
  };
  return (
    <div style={styles.container}>

      {/* HEADER + TOP */}
      <div style={styles.fixedTop}>

        <div style={styles.header}>
          <ChevronLeft size={22} onClick={() => navigate(-1)} />
          <span style={{ fontWeight: "600" }}>My Bets</span>
          <Headphones size={20} onClick={() => navigate("/CustomerSupport")} />
        </div>

        {/* DATE */}
        <div style={styles.tabs}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={styles.dateInput}
          />
        </div>

        {/* CATEGORY */}
        <div style={styles.chipsContainer}>
          {categories.map((cat) => (
            <div
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              style={{
                ...styles.chip,
                background:
                  activeCategory === cat.key ? "#ede9fe" : "#f1f1f1",
                color:
                  activeCategory === cat.key ? "#7c3aed" : "#555",
              }}
            >
              {cat?.label}
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={styles.content}>

        {/* 🔥 LOADER */}
        {loading && (
          <div style={styles.loaderWrapper}>
            <div style={styles.loader}></div>
            <p style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
              Loading...
            </p>
          </div>
        )}
        {!loading && !activeCategory && (
          <div style={styles.emptyWrapper}>
            <div style={styles.emptyCard}>
              <div style={styles.icon}>📦</div>
              <p style={styles.title}>No Data Found</p>
              <p style={styles.subtitle}>
                Please select a category
              </p>
            </div>
          </div>
        )}
        {!loading && activeCategory && renderContent()}
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  container: {
    maxWidth: 430,
    margin: "0 auto",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f5f6fa",
    fontFamily: "sans-serif",
  },

  fixedTop: {
    background: "#fff",
    zIndex: 10,
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid #eee",
  },

  tabs: {
    display: "flex",
    alignItems: "center",
    padding: "10px 12px",
  },

  chipsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    padding: 12,
    borderTop: "1px solid #f1f1f1",
  },

  chip: {
    padding: "6px 12px",
    borderRadius: 20,
    fontSize: 12,
    cursor: "pointer",
  },

  dateInput: {
    marginLeft: "auto",
    fontSize: 12,
    background: "#f1f1f1",
    padding: "6px 10px",
    borderRadius: 6,
    border: "none",
    outline: "none",
  },

  content: {
    flex: 1,
    overflowY: "auto",
  },

  /* LOADER */
  loaderWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "50vh",
  },

  loader: {
    width: 40,
    height: 40,
    border: "4px solid #ddd",
    borderTop: "4px solid #7c3aed",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  /* EMPTY */
  emptyWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
  },

  emptyCard: {
    textAlign: "center",
    padding: "20px",
    borderRadius: "16px",
    background: "linear-gradient(135deg,#f3f4f6,#e5e7eb)",
    width: "80%",
  },

  icon: {
    fontSize: 40,
    marginBottom: 10,
  },

  title: {
    fontWeight: "600",
    fontSize: 14,
  },

  subtitle: {
    fontSize: 12,
    color: "#666",
  },
};

/* GLOBAL SPIN ANIMATION (needed once) */
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg) }
      100% { transform: rotate(360deg) }
    }
  `;
  document.head.appendChild(style);
}