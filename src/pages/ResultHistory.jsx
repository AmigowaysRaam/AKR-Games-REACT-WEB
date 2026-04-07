import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { getRechargeHist, getResultHistory } from "../services/authService";

export default function ResultScreen() {
  const navigate = useNavigate();

  const [mainTab, setMainTab] = useState("lottery");
  const [subTab, setSubTab] = useState("scratch");
  const [user, setUser] = useState(null);
  const [histdata, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchHistory(parsedUser.id); // 🔥 FIXED
    } else {
      setLoading(false);
    }
  }, []);
  
  const fetchHistory = async (userId) => {
    try {
      setLoading(true);
      const res = await getResultHistory({
        id: userId,
      });
      alert(JSON.stringify(res));
      // 🔥 SAFE SET
      // setData(res?.history || []);
    } catch (err) {
      console.log("API Error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const dataConfig = {

    lottery: {
      label: "Lottery",
      subTabs: {
        scratch: {
          label: "Scratch Off",
          leaderboard: [
            { rank: 1, name: "Wild-1", user: "957****978", amount: "₹23,000" },
            { rank: 2, name: "SAPPHIRE", user: "810****307", amount: "₹13,320" },
          ],
        },
        kerala: {
          label: "Kerala",
          leaderboard: [
            { rank: 1, name: "Kerala-1", user: "900****111", amount: "₹10,000" },
          ],
        },
        "3digit": {
          label: "3 Digits",
          leaderboard: [],
        },
        quick3: {
          label: "Quick 3 Digits",
          leaderboard: [],
        },
        color: {
          label: "Color",
          leaderboard: [],
        },
        dice: {
          label: "Dice",
          leaderboard: [],
        },
        matka: {
          label: "Matka",
          leaderboard: [],
        },
      },
    },
    casino: {
      label: "Casino",
      subTabs: {
        scratch: {
          label: "Scratch Off",
          leaderboard: [
            { rank: 1, name: "Casino-X", user: "888****999", amount: "₹50,000" },
          ],
        },
      },
    },
  };
  const mainTabs = Object.keys(dataConfig);
  const currentSubTabs = dataConfig[mainTab].subTabs;
  const subTabs = Object.keys(currentSubTabs);
  const currentData =
    dataConfig[mainTab]?.subTabs?.[subTab]?.leaderboard || [];

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
        {mainTabs.map((tabKey) => (
          <div
            key={tabKey}
            onClick={() => {
              setMainTab(tabKey);
              setSubTab(Object.keys(dataConfig[tabKey].subTabs)[0]); // reset subtab
            }}
            style={{
              ...styles.mainTab,
              ...(mainTab === tabKey && styles.activeMainTab),
            }}
          >
            {dataConfig[tabKey].label}
          </div>
        ))}
      </div>

      {/* Sub Tabs */}
      <div style={styles.subTabs}>
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
              {currentSubTabs[key].label}
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

          {/* Table Header */}
          <div style={styles.tableHeader}>
            <span>Game</span>
            <span>User</span>
            <span>Bonus</span>
          </div>

          {/* List */}
          {currentData.length > 0 ? (
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
    scrollSnapType: "x mandatory",
  },

  subTabItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    whiteSpace: "nowrap",
    scrollSnapAlign: "start",
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