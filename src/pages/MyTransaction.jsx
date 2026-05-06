import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTransactionHist } from "../services/authService";
import GameLoader from "./LoaderComponet";

export default function MyTransactions() {
  const tabsRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(3);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [error, setError] = useState("");
  const [histdata, setData] = useState({
    wallet: 0, tabs: [], transactions: [],
  });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // TAB SCROLL DRAG
  const handleMouseDown = (e) => {
    isDown.current = true;
    startX.current = e.pageX - tabsRef.current.offsetLeft;
    scrollLeft.current = tabsRef.current.scrollLeft;
  };
  const handleMouseLeave = () => { isDown.current = false; };
  const handleMouseUp = () => { isDown.current = false; };
  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    tabsRef.current.scrollLeft = scrollLeft.current - walk;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id);
      fetchHistory(parsedUser.id);
    } else {
      setLoading(false);
      setError("User not found");
    }
  }, []);
  const fetchHistory = async (uid) => {
    try {
      setLoading(true);
      setError("");
      const res = await getTransactionHist({
        user_id: uid,
        month: selectedMonth,
        year: selectedYear,
      });
      setData({
        wallet: res?.total || 0,
        tabs: res?.tabs || [],
        transactions: res?.data || [],
      });
    } catch (err) {
      setError("Failed to load transactions");
      setData({ wallet: 0, tabs: [], transactions: [] });
    } finally {
      setLoading(false);
    }
  };
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const years = Array.from({ length: 10 }, (_, i) => 2020 + i);
  const formattedDate = `${months[selectedMonth - 1]} ${selectedYear}`;
  const filteredTransactions =
    activeTab === "all"
      ? histdata.transactions
      : histdata.transactions.filter(
        (item) => item.type?.toLowerCase() === activeTab
      );

  return (
    <div style={styles.container}>

      {/* HEADER (FIXED) */}
      <div style={styles.header}>
        <ChevronLeft size={22} onClick={() => navigate(-1)} />
        <span>My Transactions</span>
      </div>

      {loading && <GameLoader />}

      {!loading && error && (
        <div style={styles.centerBox}>
          <p style={{ color: "red" }}>{error}</p>
          <button style={styles.retryBtn} onClick={() => fetchHistory(userId)}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* TOP FIXED SECTION */}
          <div style={styles.topSection}>

            {/* Tabs */}
            <div
              ref={tabsRef}
              style={styles.tabs}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              {histdata.tabs.map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    ...styles.tab,
                    background: activeTab === tab ? "#7c3aed" : "#eee",
                    color: activeTab === tab ? "#fff" : "#555",
                  }}
                >
                  {tab}
                </div>
              ))}
            </div>

            {/* Wallet */}
            <div style={styles.walletBox}>
              <div>Total Wallet</div>
              <h2>₹ {histdata.wallet}</h2>
            </div>

            {/* Date */}
            <div style={styles.dateBox} onClick={() => setShowDatePicker(true)}>
              <Calendar size={18} />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* SCROLLABLE LIST ONLY */}
          <div style={styles.list}>
            {filteredTransactions.length === 0 ? (
              <div style={{ textAlign: "center", padding: 20 }}>
                No Data Found
              </div>
            ) : (
              filteredTransactions.map((item, i) => (
                <div key={i} style={styles.card}>
                  {/* <p>{JSON.stringify(item)}</p> */}
                  <div style={styles.rowBetween}>
                    <b>{item.type}</b>
                    <span style={{
                      color: item.amount?.includes("+") ? "green" : "red"
                    }}>
                      {item.amount}
                    </span>
                  </div>
                  <div style={styles.rowBetween}>
                    <span>Balance</span>
                    <span>{item.balance}</span>
                  </div>
                  <div style={styles.rowBetween}>
                    <span>Time</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    maxWidth: 430,
    margin: "0 auto",
    background: "#f6f7fb",
  },

  header: {
    display: "flex", alignItems: "center",
    gap: 10, padding: 16, background: "#fff",
    fontWeight: "bold",
    flexShrink: 0, position: "sticky", top: 0,
    zIndex: 10,
  },

  topSection: {
    flexShrink: 0,
  },

  tabs: {
    display: "flex",
    gap: 8,
    padding: 10,
    overflowX: "auto",
  },

  tab: {
    padding: "6px 14px",
    borderRadius: 20,
    whiteSpace: "nowrap",
    cursor: "pointer",
    textTransform: "capitalize"

  },

  walletBox: {
    textAlign: "center",
    padding: 16,
    background: "#fff",
    margin: 10,
    borderRadius: 12,
  },
  dateBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 12,
    margin: 10,
    background: "#fff",
    borderRadius: 12,
    cursor: "pointer",
  },
  list: {
    flex: 1,
    overflowY: "auto",
    padding: 10,
    textTransform: "capitalize"
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },

  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 6,
  },
};