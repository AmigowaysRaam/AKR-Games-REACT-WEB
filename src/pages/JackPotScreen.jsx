import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopThree from "./TopThree";
import { getJackPotData } from "../services/authService";
import GameLoader from "./LoaderComponet";

export default function JackPotScreen() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [displayAmount, setDisplayAmount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [activeTab, setActiveTab] = useState("today");
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        const res = await getJackPotData({
          id: user?.id,
        });

        if (res?.success && res?.data) {
          const todayData = res.data.today;
          const yesterdayData = res.data.yesterday;

          setApiData({
            today: formatData(todayData),
            yesterday: formatData(yesterdayData),
          });
        }
      } catch (err) {
        console.log("API Error:", err);
      }
      finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ FORMAT DATA
  const formatData = (d) => ({
    jackpot: Number(d.jackpot),
    countdownSeconds: d.countdownSeconds,
    marqueeText: d.marqueeText,
    leaders: d.leaders,
    list: d.list.map((item) => ({
      ...item,
      total: Number(item.total),
      win: Number(item.win),
    })),
  });

  // ✅ SWITCH TAB DATA
  useEffect(() => {
    if (!apiData) return;

    const selected = apiData[activeTab];
    setData(selected);
    setTimeLeft(selected.countdownSeconds);
  }, [activeTab, apiData]);

  // ✅ JACKPOT ANIMATION
  useEffect(() => {
    if (!data) return;

    let start = 0;
    const end = data.jackpot;
    const increment = end / 50;

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      setDisplayAmount(Math.floor(start));
    }, 20);

    return () => clearInterval(counter);
  }, [data]);

  // ✅ TIMER

  useEffect(() => {
    if (activeTab === "yesterday") return;

    const timer = setInterval(() => {
      setTimeLeft((p) => (p > 0 ? p - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTab]);

  // ✅ SHARE FUNCTION
  const handleFreePoints = async () => {
    const shareUrl = `${window.location.origin}/jackpot?ref=USER123`;

    const shareData = {
      title: "Daily Betting Championship 🎰",
      text: "Join now and earn FREE points!",
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied! Share it manually 🎉");
    } catch (err) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied instead 🎉");
      } catch (e) { }
    }
  };

  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  if (!data) return null;

  return (
    <div style={styles.container}>
      <div className="particles" />
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* HEADER */}
        <div style={styles.header}>
          <ChevronLeft size={22} onClick={() => navigate(-1)} />
          <span style={styles.title}>Daily Betting Championship</span>
          <span style={styles.rules}>Rules</span>
        </div>
        {
          loading ?
            <GameLoader />
            : <>
              {/* TABS */}
              <div style={styles.tabs}>
                {["today", "yesterday"].map((t) => (
                  <div
                    key={t}
                    style={activeTab === t ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab(t)}
                  >
                    {t.toUpperCase()}
                  </div>
                ))}
              </div>
              <div style={styles.marqueeWrapper}>
                <div style={styles.marqueeTrack}>
                  <div style={styles.marquee}>
                    🎉 {data?.marqueeText} 🎉
                  </div>
                </div>
              </div>
              <div style={styles.jackpotCard}>
                <div className="wingGlow" style={styles.jackpotWrapper}>
                  <img
                    src="https://www.akrlottery.com/assets/images/Untitled-1.png"
                    alt=""
                    style={styles.jackpotImg}
                  />

                  <div style={styles.amountInside}>
                    ₹{displayAmount.toLocaleString()}
                  </div>
                </div>

                {activeTab === "today" && (
                  <div style={styles.countdown}>
                    ⏱ {formatTime(timeLeft)}
                  </div>
                )}
              </div>

              <TopThree leaders={data?.leaders} />

              {/* LIST */}
              <div style={styles.list}>
                {data?.list?.map((item) => (
                  <div key={item.rank} style={styles.row}>
                    <div>{item.rank}</div>
                    <div style={styles.player}>
                      <div>{item.name}</div>
                      <div style={styles.total}>₹{item.total}</div>
                    </div>
                    <div style={styles.winBox}>₹{item.win}</div>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div style={styles.footer}>
                <div>
                  <div>Player***851</div>
                  <div style={{ fontSize: 12 }}>₹0</div>
                </div>
                <button style={styles.freeBtn} onClick={handleFreePoints}>
                  FREE POINTS
                </button>
              </div>

            </>}

      </div>
    </div>
  );
}

// ✅ STYLES (unchanged)
const styles = {
  container: {
    maxWidth: 430,
    margin: "0 auto",
    overflowY: "auto",
    background: "linear-gradient(180deg,#2b0a00,#000)",
    color: "#fff",
    height: "100vh",
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    display: "flex",
    justifyContent: "space-between",
    padding: 12,
    background: "linear-gradient(180deg,#2b0a00,#000)",
  },
  title: { fontWeight: "600" },
  rules: { color: "#ffd700" },
  tabs: { display: "flex", justifyContent: "center", gap: 10 },
  tab: {
    padding: "6px 16px",
    borderRadius: 20,
    background: "#333",
    color: "#aaa",
  },
  activeTab: {
    padding: "6px 16px",
    borderRadius: 20,
    background: "linear-gradient(90deg,#ffd700,#ffae00)",
    color: "#000",
  },
  marqueeWrapper: { background: "#5a2d00", marginTop: 10 },
  marqueeTrack: {
    display: "flex",
    width: "max-content",
    animation: "scrollText 4s linear infinite",
  },
  marquee: { whiteSpace: "nowrap", padding: "6px 0" },
  jackpotCard: { textAlign: "center", padding: 0 },
  jackpotWrapper: { display: "inline-block" },
  jackpotImg: { width: 270, height: 230 },
  amountInside: {
    position: "absolute",
    bottom: "65%",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textShadow: "0 0 10px gold, 0 0 20px orange",
    animation: "pulse 1.2s infinite",
  },
  countdown: { color: "#ccc", position: "relative", bottom: 44 },
  list: {
    padding: 5,
    height: 240,
    overflowY: "auto",
    marginTop: "5%",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    borderRadius: 12,
    marginBottom: 12,
    background: "#1a1a1a",
  },
  player: { flex: 1, marginLeft: 10 },
  total: { fontSize: 12, color: "#aaa" },
  winBox: {
    background: "#00ff99",
    padding: "2px 8px",
    borderRadius: 6,
    color: "#000",
  },
  footer: {
    background: "#111",
    padding: 12,
    display: "flex",
    justifyContent: "space-between",
  },
  freeBtn: {
    background: "#ffd700",
    padding: "8px 14px",
    borderRadius: 6,
    color: "#000",
  },
};