import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { getResultHistory } from "../services/authService";

/* 🔥 Drag Scroll Hook */
function useDragScroll() {
  const ref = useRef(null);

  let isDown = false;
  let startX;
  let scrollLeft;

  const onMouseDown = (e) => {
    isDown = true;
    startX = e.pageX - ref.current.offsetLeft;
    scrollLeft = ref.current.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown = false;
  };

  const onMouseUp = () => {
    isDown = false;
  };

  const onMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    ref.current.scrollLeft = scrollLeft - walk;
  };

  return {
    ref,
    handlers: {
      onMouseDown,
      onMouseLeave,
      onMouseUp,
      onMouseMove,
    },
  };
}

export default function ResultScreen() {
  const navigate = useNavigate();

  const [mainTab, setMainTab] = useState("");
  const [subTab, setSubTab] = useState("");
  const [user, setUser] = useState(null);
  const [histdata, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const mainTabScroll = useDragScroll();
  const subTabScroll = useDragScroll();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchHistory(parsedUser.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchHistory = async (userId) => {
    try {
      setLoading(true);
      const res = await getResultHistory({ id: userId });

      const apiData = res.data || {};
      setData(apiData);

      const firstMain = Object.keys(apiData)[0];
      if (firstMain) {
        setMainTab(firstMain);

        const firstSub = Object.keys(apiData[firstMain].subTabs || {})[0];
        if (firstSub) setSubTab(firstSub);
      }
    } catch (err) {
      console.log("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const mainTabs = Object.keys(histdata || {});
  const currentSubTabs = histdata[mainTab]?.subTabs || {};
  const subTabs = Object.keys(currentSubTabs);

  const currentData =
    currentSubTabs[subTab]?.leaderboard || [];

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
      <div
        ref={mainTabScroll.ref}
        {...mainTabScroll.handlers}
        style={styles.mainTabs}
      >
        {mainTabs.map((tabKey) => (
          <div
            key={tabKey}
            onClick={() => {
              setMainTab(tabKey);
              const firstSub = Object.keys(
                histdata[tabKey]?.subTabs || {}
              )[0];
              setSubTab(firstSub || "");
            }}
            style={{
              ...styles.mainTab,
              ...(mainTab === tabKey && styles.activeMainTab),
            }}
          >
            {histdata[tabKey]?.label}
          </div>
        ))}
      </div>

      {/* Sub Tabs */}
      <div
        ref={subTabScroll.ref}
        {...subTabScroll.handlers}
        style={styles.subTabs}
      >
        {subTabs.map((key) => (
          <div
            key={key}
            onClick={() => setSubTab(key)}
            style={styles.subTabItem}
          >
            <span
              style={{
                ...styles.subTabText,
                color: subTab === key ? "#000" : "#555",
              }}
            >
              {currentSubTabs[key]?.label}
            </span>
            {subTab === key && <div style={styles.activeUnderline} />}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            {currentSubTabs[subTab]?.label} Leaderboard
          </div>

          <div style={styles.tableHeader}>
            <span>Game</span>
            <span>User</span>
            <span>Bonus</span>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: 20 }}>
              Loading...
            </div>
          ) : currentData.length > 0 ? (
            currentData.map((item) => (
              <div key={item.rank} style={styles.row}>
                <div style={styles.game}>
                  <span style={styles.rank}>{item.rank}</span>
                  {item.name}
                </div>
                <div>{item.user}</div>
                <div style={styles.amount}>{item.amount}</div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: 20, color: "#999" }}>
              No Data Available
            </div>
          )}
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
    overflowX: "auto",
    cursor: "grab",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    WebkitOverflowScrolling: "touch",
  },

  mainTab: {
    padding: "8px 18px",
    borderRadius: 10,
    background: "#e5e7eb",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
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
    scrollSnapType: "x mandatory",
    cursor: "grab",
  },

  subTabItem: {
    display: "flex",
    flexDirection: "column",    alignItems: "center",
    cursor: "pointer",
    whiteSpace: "nowrap",
    scrollSnapAlign: "start",  },  subTabText: {
    fontWeight: 500,
  },  activeUnderline: {    marginTop: 6,    width: "60%",    height: 3,
    background: "#7c3aed",
    borderRadius: 2,
  },

  content: {
    padding: 10,
  },
  card: {    background: "#fff",    borderRadius: 10,
    padding: 10,
  },  cardTitle: {    fontWeight: 600,
    marginBottom: 10,  },
  tableHeader: {    display: "flex",    justifyContent: "space-between",
    fontSize: 12,    color: "#888",
    padding: "8px 0",  },  row: {
    display: "flex",    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #eee",
    alignItems: "center",
  },
  game: {    display: "flex",    alignItems: "center",    gap: 8,
  },  rank: {    background: "#ddd",    borderRadius: 6,
    padding: "2px 6px",    fontSize: 12,  },

  amount: {
    fontWeight: 600,
  },
};