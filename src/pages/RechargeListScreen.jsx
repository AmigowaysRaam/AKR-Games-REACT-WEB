import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { getRechargeList } from "../services/authService";

export default function RechargeListScreen() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [listData, setListData] = useState([]);

  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedWallet = localStorage.getItem("wallet");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setWallet(parsedUser.wallet || storedWallet || 0);
    } else if (storedWallet) {
      setWallet(storedWallet);
    }
  }, []);
  // ✅ API CALL
  useEffect(() => {
    const fetchRechargeList = async () => {
      try {
        setLoading(true);
        const res = await getRechargeList();
        // alert(JSON.stringify(res));
        if (res?.status && Array.isArray(res?.plans)) {
          setListData(res.plans);
        } else {
          setListData([]);
        }
      } catch (err) {
        console.error(err);
        setListData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRechargeList();
  }, []);

  // ✅ ACTIVE DATA
  const vip =
    listData.length > 0
      ? listData[activeIndex] || listData[0]
      : null;
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.offsetWidth * 0.9;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };
  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <ChevronLeft size={22} onClick={() => navigate(-1)} />
        <span className="title">VIP</span>

        <div className="balance">
          <span>Balance</span>
          <b>{wallet}</b>
          <div className="walletIcon" />
        </div>
      </div>

      {/* LOADER */}
      {loading && (
        <div className="loaderOverlay">
          <div className="loader"></div>
        </div>
      )}

      <div className="contentWrapper">
        {/* SLIDER */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="slider"
        >
          {listData.map((item, i) => (
            <div key={i} className="slide">
              <div
                className={`card ${i === activeIndex ? "active" : ""}`}
                style={{
                  backgroundImage: `url(${item?.uri})`,
                }}
              >
                <div className="overlay" />

                <div className="cardContent">
                  <div className="topRow">
                    <img src={item?.icon} className="vipIcon" />
                    <button
                      className="rechargeBtn"
                      onClick={() => navigate("/payRecharge")}
                    >
                      Recharge
                    </button>
                  </div>

                  <div className="progressText">
                    ₹{item?.amount || 0} / ₹100
                  </div>

                  <div className="progressBar">
                    <div
                      className="progressFill"
                      style={{
                        width: `${((item?.amount || 0) / 100) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="reachText">
                    Recharge <span className="highlight">₹100</span> more to reach level VIP1
                  </div>
                </div>

                <div className="bottomPattern" />
              </div>
            </div>
          ))}
        </div>

        {/* DETAILS (AUTO CHANGE ON SWIPE) */}
        {vip && (
          <div className="details">
            <VipRow
              title="01.VIP Level Reward"
              content={
                <>
                  Reach <span className="highlight">VIP{activeIndex}</span> to receive a one-time reward :
                  <div className="rewardRow">
                    🪙 x ₹{vip?.money || 0}
                    🎟 x{vip?.scrathcard || 0}
                    🎯 x{vip?.spin || 0}
                  </div>
                </>
              }
            />

            <VipRow
              title="02.Weekly VIP Reward"
              content={`Reach the VIP${activeIndex} to receive weekly base rewards ₹${vip?.weeklyRward || 0}.`}
            />

            <VipRow
              title="03.VIP Withdrawal"
              content={`At VIP${activeIndex}, the maximum amount per withdrawal is ₹${vip?.withdrawAmount || 0}`}
            />

            <VipRow
              title="04.VIP Withdrawal Frequency"
              content={`At VIP${activeIndex}, you can withdraw up to ${vip?.withdrawFreq || 0} times per day`}
            />

            <VipRow
              title="05.VIP Withdrawal Fee"
              content={`At VIP${activeIndex}, withdrawal fees are as low as ${vip?.withdrawFee || 0}% per transaction.`}
            />
          </div>
        )}
      </div>

      {/* STYLES */}
      <style>{`
        .container {
          max-width: 430px;
          margin: 0 auto;
          background: #f5f5f5;
          height: 100vh;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          background: #fff;
          position: sticky;
          top: 0;
        }

        .slider {
          display: flex;
          overflow-x: auto;
          padding: 10px;
          scroll-snap-type: x mandatory; /* ✅ smooth snap */
        }

        .slide {
          min-width: 90%;
          margin-right: 10px;
          scroll-snap-align: center; /* ✅ snap center */
        }

        .card {
          height: 190px;
          border-radius: 18px;
          padding: 15px;
          background-size: cover;
          background-position: center;
          position: relative;
          overflow: hidden;
          border: 1px solid #cbd5e1;
          transition: 0.3s;
          transform: scale(0.95);
        }

        .card.active {
          transform: scale(1);
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.85),
            rgba(240,248,255,0.6)
          );
          border-radius: 18px;
        }

        .cardContent {
          position: relative;
          z-index: 2;
        }

        .topRow {
          display: flex;
          justify-content: space-between;
        }

        .vipIcon {
          width: 60px;
        }
.rechargeBtn {
  background: linear-gradient(135deg,#9333ea,#7e22ce);
  color: white;
  border: none;

  padding: 4px 12px;   /* 🔽 reduced */
  font-size: 12px;     /* 🔽 smaller text */
  border-radius: 16px; /* slightly tighter */
  height: 28px;        /* fixed small height */

  display: flex;
  align-items: center;
  justify-content: center;
}

        .progressBar {
          height: 5px;
          background: #94a3b8;
          border-radius: 10px;
          margin-top: 6px;
        }

        .progressFill {
          height: 100%;
          background: #64748b;
        }

        .highlight {
          color: #f97316;
          font-weight: 600;
        }

        .details {
          margin: 12px;
          background: #fff;
          border-radius: 16px;
          padding: 14px;
        }

        .loaderOverlay {
          position: fixed;
          inset: 0;
          background: rgba(255,255,255,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader {
          width: 35px;
          height: 35px;
          border: 4px solid #ddd;
          border-top: 4px solid #7e22ce;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function VipRow({ title, content }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          background: "linear-gradient(90deg,#f3e8ff,#f1f5f9)",
          padding: "6px 12px",
          borderRadius: 20,
          fontSize: 13,
          fontWeight: 600,
          color: "#6b21a8",
          display: "inline-block",
        }}
      >
        {title}
      </div>

      <div style={{ fontSize: 14, marginTop: 10, color: "#555" }}>
        {content}
      </div>
    </div>
  );
}