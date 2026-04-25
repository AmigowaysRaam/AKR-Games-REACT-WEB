import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { getResultHistory } from "../services/authService";
import KeralaLotteryTab from "./KeralaOverallHistory";
import DiceResultWithTabs from "./useDiceResult";
import ColorHistoryComp from "./ColorPredictionResultComp";

function useDragScroll() {

  const ref = useRef(null);
  let isDown = false;
  let startX;
  const onMouseDown = (e) => {
    isDown = true;
    startX = e.pageX;
  };

  const onMouseUp = (e) => {
    if (!isDown) return;
    isDown = false;
    const diff = e.pageX - startX;
    const container = ref.current;
    const itemWidth = container.firstChild?.offsetWidth + 10 || 100;
    if (diff < -50) {
      container.scrollBy({ left: itemWidth, behavior: "smooth" });
    } else if (diff > 50) {
      container.scrollBy({ left: -itemWidth, behavior: "smooth" });
    }
  };
  return {
    ref,
    handlers: { onMouseDown, onMouseUp },
  };
}

function useSwipeTabs(tabs, activeTab, setActiveTab) {
  const ref = useRef(null);
  let startX = 0;
  const onTouchStart = (e) => {
    startX = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    const index = tabs.indexOf(activeTab);
    if (diff < -50 && index < tabs.length - 1) {
      setActiveTab(tabs[index + 1]);
    }
    if (diff > 50 && index > 0) {
      setActiveTab(tabs[index - 1]);
    }
  };
  return { ref, handlers: { onTouchStart, onTouchEnd } };
}
export default function ResultScreen() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState("");
  const [subTab, setSubTab] = useState("");
  const [histdata, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const mainTabScroll = useDragScroll();
  const subTabScroll = useDragScroll();
  const subTabRefs = useRef({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
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
        setSubTab(firstSub || "");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const mainTabs = Object.keys(histdata || {});
  const currentSubTabs = histdata[mainTab]?.subTabs || {};
  const subTabs = Object.keys(currentSubTabs);
  const contentSwipe = useSwipeTabs(subTabs, subTab, setSubTab);
  useEffect(() => {
    if (subTabRefs.current[subTab]) {
      subTabRefs.current[subTab].scrollIntoView({
        behavior: "smooth", inline: "center",
        block: "nearest",
      });
    }
  }, [subTab]);
  const renderContent = () => {
    switch (subTab) {
      case "dice":
        return <DiceResultWithTabs />;

      case "color":
        return <ColorHistoryComp />;

      case "kerala":
        return <KeralaLotteryTab lottery="kerala" />;

      default:
        return <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "24px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              width: "80%",
              maxWidth: "260px",
              opacity: 10,
              transform: `translateY( 10}px)`,
              transition: "all 0.4s ease",
            }}
          >
            <div
              style={{
                fontSize: "40px",
                marginBottom: "10px",
                transform: `translateY(${10}px)`,
                transition: "transform 0.1s linear",
              }}
            >
              📦
            </div>

            {/* TEXT */}
            <p
              style={{
                fontWeight: "600",
                fontSize: "16px",
                color: "#333",
              }}
            >
              No Data Available
            </p>

            <p
              style={{
                fontSize: "12px",
                color: "#777",
                marginTop: "4px",
              }}
            >
              There’s nothing to show here right now
            </p>
          </div>
        </div>;
    }
  };
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
      <div ref={mainTabScroll.ref} {...mainTabScroll.handlers} style={styles.mainTabs}>
        {mainTabs.map((tabKey) => (
          <div
            key={tabKey}
            onClick={() => {
              setMainTab(tabKey);
              const firstSub = Object.keys(histdata[tabKey]?.subTabs || {})[0];
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
      <div ref={subTabScroll.ref} {...subTabScroll.handlers} style={styles.subTabs}>
        {subTabs.map((key) => (
          <div
            key={key}
            ref={(el) => (subTabRefs.current[key] = el)} // ✅ attach ref
            onClick={() => setSubTab(key)}
            style={{
              ...styles.subTabItem,
              transform: subTab === key ? "scale(1.05)" : "scale(1)",
              transition: "0.2s",
            }}
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
      <div ref={contentSwipe.ref} {...contentSwipe.handlers} style={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
}
const styles = {
  container: {
    maxWidth: 430,
    margin: "0 auto",
    background: "#f4f6fb", height: "100vh", display: "flex", flexDirection: "column",
    overflow: "hidden",
  }, header: {
    background: "#fff", padding: 14,
    textAlign: "center", fontWeight: 700, position: "relative",
    borderBottom: "1px solid #eee",
  }, backBtn: {
    position: "absolute", left: 10, top: 10, border: "none",
    background: "none",
  }, mainTabs: {
    display: "flex", gap: 10, padding: 15,
    overflowX: "auto",
    background: "#fff",
  }, mainTab: {
    padding: "8px 18px", borderRadius: 10,
    background: "#e5e7eb", whiteSpace: "nowrap",
  },
  activeMainTab: {
    background: "#fff",
    borderTop: "3px solid #7c3aed",
  },
  subTabs: {
    display: "flex", gap: 20, padding: "12px 15px",
    overflowX: "auto", background: "#fff",
  }, subTabItem: {
    display: "flex", flexDirection: "column", alignItems: "center",
    whiteSpace: "nowrap",
  }, subTabText: { fontWeight: 500 }, activeUnderline: {
    marginTop: 6, width: "60%", height: 3, background: "#7c3aed",
  }, content: {
    flex: 1, overflowY: "auto", padding: 10,
    touchAction: "pan-y",
  }, card: {
    background: "#fff", borderRadius: 10,
    padding: 10,
  },
};