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
    wallet: 0,
    tabs: [],
    transactions: [],
  });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleMouseDown = (e) => {
    isDown.current = true;
    tabsRef.current.classList.add("active");
    startX.current = e.pageX - tabsRef.current.offsetLeft;
    scrollLeft.current = tabsRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
  };

  const handleMouseUp = () => {
    isDown.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // scroll speed
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
      const apiData = res;
      if (!apiData) {
        throw new Error("Invalid API response");
      }
      setData({
        wallet: apiData.wallet || 0,
        tabs: apiData.tabs || [],
        transactions: apiData.transactions || [],
      });

    } catch (err) {
      console.log("API Error:", err);
      setError("Failed to load transactions");
      setData({
        wallet: 0,
        tabs: [],
        transactions: [],
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ APPLY FILTER
  const applyFilter = () => {
    setShowDatePicker(false);
    if (userId) {
      fetchHistory(userId);
    }
  };

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const years = Array.from({ length: 10 }, (_, i) => 2020 + i);
  const formattedDate = `${months[selectedMonth - 1]} ${selectedYear}`;

  // ✅ FILTER BY TAB (FRONTEND)
  const filteredTransactions =
    activeTab === "all"
      ? histdata.transactions
      : histdata.transactions.filter(
        (item) => item.type?.toLowerCase() === activeTab
      );

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <ChevronLeft size={22} onClick={() => navigate(-1)} />
        <span>My Transactions</span>
      </div>
      {/* LOADER */}
      {loading && (
        <GameLoader />
      )}
      {/* ERROR */}
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
          {/* Tabs */}
          <div
            ref={tabsRef}
            style={styles.tabs}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {histdata.tabs.length === 0 ? (
              <span>No Tabs</span>
            ) : (
              histdata.tabs.map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    ...styles.tab,
                    background: activeTab === tab ? "#7c3aed" : "#eee",
                    color: activeTab === tab ? "#fff" : "#555",
                    fontSize: activeTab === tab ? 18 : 14,
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </div>
              ))
            )}
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
          {/* Transactions */}
          <div style={styles.list}>
            {filteredTransactions.length === 0 ? (
              <div style={{ textAlign: "center", padding: 20 }}>
                No Data Found
              </div>
            ) : (
              filteredTransactions?.map((item, i) => (
                <div key={i} style={styles.card}>
                  <div style={styles.rowBetween}>
                    <div className="text-uppercase" style={{
                      textTransform: "capitalize",
                      fontWeight: "bold"
                    }}
                    >{item.type}</div>
                    <div
                      style={{
                        ...styles.amount,
                        color: item.amount?.includes("+")
                          ? "green"
                          : "red",
                      }}
                    >
                      {item?.amount}
                    </div>
                  </div>
                  <div style={styles.rowBetween}>
                    <span style={styles.label}>Wallet</span>
                    <span>Primary</span>
                  </div>
                  {/* <p>
                    {JSON.stringify(item)
                    }
                  </p> */}

                  <div style={styles.rowBetween}>
                    <span style={styles.label}>Balance</span>
                    <span>{item?.balance}</span>
                  </div>

                  <div style={styles.rowBetween}>
                    <span style={styles.label}>Time</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
      {showDatePicker && (
        <div
          style={styles.modalOverlay}
          onClick={() => setShowDatePicker(false)}
        >
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.dragBar} />

            <div style={styles.modalHeader}>
              <span>Select Month</span>
              <span onClick={() => setShowDatePicker(false)}>✕</span>
            </div>

            <div style={styles.pickerRow}>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                style={styles.select}
              >
                {months.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                style={styles.select}
              >
                {years.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>

            <button style={styles.confirmBtn} onClick={applyFilter}>
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
const styles = {
  container: {
    maxWidth: 430, margin: "0 auto", background: "#f6f7fb",
    minHeight: "100vh", fontFamily: "sans-serif",
  }, header: {
    display: "flex", alignItems: "center", gap: 10,
    padding: 16, background: "#fff", fontWeight: "bold",
  }, tabs: {
    display: "flex", gap: 8,
    padding: 10, overflowX: "auto", cursor: "grab",
  }, tab: {
    padding: "3px 15px", borderRadius: 20, fontSize: 13,
    whiteSpace: "nowrap",
  }, walletBox: {
    textAlign: "center",
    padding: 20, background: "#fff", margin: 10, borderRadius: 12,
  }, dateBox: {
    display: "flex", alignItems: "center", gap: 10,
    padding: 12,
    margin: 10, background: "#fff", borderRadius: 12, cursor: "pointer",
  },
  list: { padding: 10 },
  card: {
    background: "#fff", borderRadius: 12, padding: 14,
    marginBottom: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  }, rowBetween: {
    display: "flex", justifyContent: "space-between",
    marginTop: 6,
  }, label: { color: "#888", fontSize: 12 }, amount: { fontWeight: "bold" },
  centerBox: {
    textAlign: "center", padding: 40,
  }, loader: {
    width: 40, height: 40, border: "4px solid #ddd",
    borderTop: "4px solid #7c3aed", borderRadius: "50%", margin: "0 auto 10px", animation: "spin 1s linear infinite",
  },
  retryBtn: {
    marginTop: 10, padding: "10x 20px", borderRadius: 20, border: "none", background: "#7c3aed",
    color: "#fff", cursor: "pointer",
    padding: "8px 40px",
  }, modalOverlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
    display: "flex", justifyContent: "center", alignItems: "flex-end",
    zIndex: 1000,
  }, modalContent: {
    width: "100%", maxWidth: 430, background: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20, padding: 20, animation: "slideUp 0.3s ease",
  }, dragBar: {
    width: 40, height: 5,
    background: "#ccc", borderRadius: 10, margin: "0 auto 12px",
  }, modalHeader: {
    display: "flex", justifyContent: "space-between",
    marginBottom: 20, fontWeight: "bold",
  }, pickerRow: {
    display: "flex",
    gap: 10, marginBottom: 20,
  }, select: {
    flex: 1, padding: 14,
    borderRadius: 12, border: "1px solid #ddd",
  }, confirmBtn: {
    width: "100%", padding: 14, borderRadius: 30, border: "none",
    background: "linear-gradient(90deg, #9333ea, #d946ef)",
    color: "#fff", fontWeight: "bold",
  },
};/* ✅ ANIMATIONS */
const styleSheet = document.createElement("style"); styleSheet.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }  100% { transform: rotate(360deg); }
}
@keyframes slideUp {  from { transform: translateY(100%); }  to { transform: translateY(0); }
}
`;
document.head.appendChild(styleSheet);