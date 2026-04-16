import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { getRechargeList } from "../services/authService";
import GameLoader from "./LoaderComponet";
export default function RechargeListScreen() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [listData, setListData] = useState([]);
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(0);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
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
  useEffect(() => {
    const fetchRechargeList = async () => {
      try {
        setLoading(true);
        const res = await getRechargeList({
          userId: user?.id,
        });
        if (res?.success && Array.isArray(res?.data)) {
          setListData(res?.data);
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

  const vip =
    listData.length > 0
      ? listData[activeIndex] || listData[0]
      : null;
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeftVal = container.scrollLeft;
    const cardWidth = container.offsetWidth * 0.9;
    const newIndex = Math.round(scrollLeftVal / cardWidth);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };
  const handleMouseDown = (e) => {
    isDown.current = true;
    scrollRef.current.classList.add("cursor-grabbing");
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    scrollRef.current.classList.remove("cursor-grabbing");
  };

  const handleMouseUp = () => {
    isDown.current = false;
    scrollRef.current.classList.remove("cursor-grabbing");
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div className="container">
      <div className="header">
        <ChevronLeft size={22} className=" cursor-pointer" onClick={() => navigate(-1)} />
        <span className="title">VIP</span>
        <div className="balance">
          <span>Balance</span>
          <b>{wallet}</b>
          <div className="walletIcon" />
        </div>
      </div>
      {loading && (
        <GameLoader />
      )}
      <div className="contentWrapper">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="slider cursor-grab"
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
                <div className="cardContent ">
                  <div className="topRow">
                    <img src={item?.icon} className="vipIcon" />
                    <button
                      className="rechargeBtn cursor-pointer"
                      onClick={() => {
                        user?.id ? navigate("/payRecharge") :
                          navigate("/Login")
                      }}
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

        {/* DETAILS */}
        {vip && (
          <div className="details">
            <VipRow
              title="01.VIP Level Reward"
              content={
                <>
                  Reach <span className="highlight">VIP{activeIndex}</span> to receive a one-time reward :
                  <div className="rewardRow">
                    <span className="rewardItem">🪙 ₹{vip?.money || 0}</span>
                    <span className="rewardItem">🎟 {vip?.scrathcard || 0}</span>
                    <span className="rewardItem">🎯 {vip?.spin || 0}</span>
                  </div>
                </>
              }
            />
            <VipRow
              title="02.Weekly VIP Reward"
              content={
                <>
                  Reach <span className="highlight">VIP{activeIndex}</span> to receive weekly base rewards
                  <span className="highlight"> ₹{vip?.weeklyRward || 0}</span>.
                </>
              }
            />

            <VipRow
              title="03.VIP Withdrawal"
              content={
                <>
                  At <span className="highlight">VIP{activeIndex}</span>, the maximum amount per withdrawal is
                  <span className="highlight"> ₹{vip?.withdrawAmount || 0}</span>
                </>
              }
            />

            <VipRow
              title="04.VIP Withdrawal Frequency"
              content={
                <>
                  At <span className="highlight">VIP{activeIndex}</span>, you can withdraw up to
                  <span className="highlight"> {vip?.withdrawFreq || 0}</span> times per day
                </>
              }
            />

            <VipRow
              title="05.VIP Withdrawal Fee"
              content={
                <>
                  At <span className="highlight">VIP{activeIndex}</span>, withdrawal fees are as low as
                  <span className="highlight"> {vip?.withdrawFee || 0}%</span> per transaction.
                </>
              }
            />
          </div>
        )}
      </div>
      <style>{`
        .container {
          max-width: 430px;
          margin: 0 auto;
          background: #f5f5f5;
          height: 100vh;        }

        .header {
          display: flex;
          align-items: center;          justify-content: space-between;
          padding: 12px;          background: #fff;
          position: sticky;          top: 0;        }

        .slider {
          display: flex;          overflow-x: auto;
          padding: 10px;          scroll-snap-type: x mandatory;
        }        .slide {          min-width: 90%;
          margin-right: 10px;          scroll-snap-align: center;
        }
        .card {          height: 190px;          border-radius: 18px;
          padding: 15px;          background-size: cover;
          background-position: center;          position: relative;
          overflow: hidden;          border: 1px solid #cbd5e1;          transition: 0.3s;
          transform: scale(0.95);
        }        .card.active {          transform: scale(1);
        }        .overlay {          position: absolute;
          inset: 0;          background: linear-gradient(
            135deg,            rgba(255,255,255,0.85),            rgba(240,248,255,0.6)
          );
          border-radius: 18px;        }
        .cardContent {          position: relative;          z-index: 2;
        }        .topRow {
          display: flex;          justify-content: space-between;
        }        .vipIcon {
          width: 60px;        }
        .rechargeBtn {          background: linear-gradient(135deg,#9333ea,#7e22ce);
          color: white;          border: none;
          padding: 4px 12px;          font-size: 12px;
          border-radius: 16px;          height: 28px;
          display: flex;
          align-items: center;          justify-content: center;
        }
        .progressBar {          height: 5px;
          background: #94a3b8;          border-radius: 10px;
          margin-top: 6px;
        }        .progressFill {          height: 100%;          background: #64748b;
        }
        .highlight {
          color: #f97316;          font-weight: 600;
        }        .details {
          margin: 12px;
          background: #fff;          border-radius: 16px;
          padding: 14px;        }
        .loaderOverlay {
          position: fixed;
          inset: 0;
          background: rgba(255,255,255,0.6);          display: flex;
          align-items: center;
          justify-content: center;        }
.rewardRow {
  display: flex;}.rewardItem {
  padding: 0 10px; /* horizontal padding for EACH item */
}        .loader {
          width: 35px;          height: 35px;          border: 4px solid #ddd;
          border-top: 4px solid #7e22ce;          border-radius: 50%;
          animation: spin 1s linear infinite;        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>);
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