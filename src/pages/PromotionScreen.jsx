import { ChevronLeft, Headset } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PromoList from "./Promolist";
import BonusDetailScreen from "./BonusDetailScreen";

export default function PromotionScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialType = location.state?.type || "promo";
  const [activeTab, setActiveTab] = useState(initialType);
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(0);

  useEffect(() => {
    setActiveTab(initialType);
  }, [initialType]);

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

  const handleTabChange = (tab) => {
    if (tab === "bonus" && user) {
      setActiveTab(tab);
    } else if (tab === "promo") {
      setActiveTab(tab);
    } else {
      navigate("/Login");
    }
  };

  return (
    <div
      style={{
        maxWidth: 430,
        margin: "0 auto",
        background: "#f4f2fb",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* ✅ FIXED HEADER */}
      <div
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          maxWidth: 430,
          background: "#fff",
          padding: "16px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #eee",
          zIndex: 1000,
        }}
      >
        <ChevronLeft
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />

        <div
          style={{
            display: "flex",
            gap: 60,
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {["bonus", "promo"].map((tab) => (
            <div
              key={tab}
              onClick={() => handleTabChange(tab)}
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <div
                style={{
                  fontWeight: activeTab === tab ? 700 : 500,
                }}
              >
                {tab === "bonus" ? "Bonus" : "Promotions"}
              </div>

              {activeTab === tab && (
                <div
                  style={{
                    height: 3,
                    background: "#7c3aed",
                    borderRadius: 2,
                    marginTop: 4,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <Headset
          className="cursor-pointer"
          onClick={() => navigate("/CustomerSupport")}
        />
      </div>

      {/* ✅ CONTENT OFFSET (IMPORTANT for fixed header) */}
      <div style={{ paddingTop: 70 }}>
        {activeTab === "bonus" && <BonusDetailScreen />}
        {activeTab === "promo" && <PromoList />}
      </div>
    </div>
  );
}