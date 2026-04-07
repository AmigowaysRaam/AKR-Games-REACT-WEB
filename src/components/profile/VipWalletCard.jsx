import React, { useEffect, useState } from "react";
import logo from "../../assets/rechargLogo.png";
import { ChevronRight, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getWalletSummary } from "../../services/authService";

export default function VipWalletCard() {
  const [progress, setProgress] = useState(0);
  const [showBalance, setShowBalance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [vipData, setVipData] = useState(null);
  const [userdata, setuserdata] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setuserdata(parsedUser);
      fetchWallet(parsedUser.id);
      setShowBalance(true);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchWallet = async (uid, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const res = await getWalletSummary({ id: uid });
      const apiData = res?.data;
      console.log("Wallet Summary API Response:", apiData);
      if (apiData) {
        setWalletData({
          cash_balance: apiData?.wallet?.cash_balance || "0",
          withdrawable_balance: apiData?.wallet?.withdrawable || "0",
        });
        setVipData({
          level: apiData?.vip_level,
          progress: Number(apiData?.progress_percent) || 0,
          message: apiData?.recharge_message,
          nextVip: apiData?.next_vip,
          icon: apiData?.vip_icon,
          bg: apiData?.vip_bg_image,
        });
        setProgress(Number(apiData?.progress_percent) || 0);
      }
    } catch (err) {
      console.log("API Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = (e) => {
    e.stopPropagation();
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/Login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    fetchWallet(parsedUser.id, true);
  };

  return (
    <div className="px-4 mt-4">
      <div className="rounded-2xl overflow-hidden shadow-xl">

        {/* TOP VIP SECTION */}
        <div
          className="p-4"
          style={{
            backgroundImage: `url(${vipData?.bg})`,
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-center justify-between">
            <img src={vipData?.icon || logo} className="w-10 h-10" />
            <span className="font-bold text-gray"
            style={{
              textShadow: "#fff 0px 1px 5px",
            }}>
              {vipData?.level || "VIP"}
            </span>
          </div>

          {/* PROGRESS */}
          <div className="mt-3">
            <div className="w-full h-1.5 bg-white/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-black/80 font-medium 
            " style={{
                textShadow: "#fff 0px 1px 5px",
              }}>
              {vipData?.message || "Loading..."}
            </p>

            <button
              onClick={() => navigate("/Recharge")}
              className="px-4 py-1 text-xs font-semibold rounded-full text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow"
            >
              Recharge
            </button>
          </div>
        </div>

        {/* WALLET SECTION */}
        <div
          className="p-4 text-white relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #6d28d9, #9333ea)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />

          {/* HEADER */}
          <div className="flex justify-between items-center relative">
            <p className="text-sm opacity-90">My Wallet</p>

            <button
              onClick={handleRefresh}
              className={`p-1 rounded-full bg-white/20 ${refreshing ? "animate-spin" : ""
                }`}
            >
              <RefreshCw size={18} />
            </button>
          </div>
          <div
            onClick={() => userdata && navigate("/WalletScreen")}
            className={`flex items-center gap-2 cursor-pointer ${userdata ? "" : "opacity-50 cursor-not-allowed"
              }`}
          >
            <h3 className="text-2xl font-bold mt-2">
              {loading ? (
                <div className="h-8 w-32 bg-white/30 rounded animate-pulse" />
              ) : showBalance && walletData ? (
                `₹ ${walletData.cash_balance}`
              ) : (
                "****"
              )}
            </h3>

            {userdata && <ChevronRight className="mt-2" />}
          </div>

          {/* DETAILS */}
          <div className="flex justify-between mt-4 text-sm">
            <div>
              <p className="text-white/70 text-xs">Cash Balance</p>
              {loading ? (
                <div className="h-5 w-20 bg-white/30 rounded animate-pulse mt-1" />
              ) : (
                <p className="font-bold text-lg">
                  {showBalance && walletData
                    ? `₹ ${walletData.cash_balance}`
                    : "****"}
                </p>
              )}
            </div>

            <div>
              <p className="text-white/70 text-xs">Withdrawable</p>
              {loading ? (
                <div className="h-5 w-20 bg-white/30 rounded animate-pulse mt-1" />
              ) : (
                <p className="font-bold text-lg">
                  {showBalance && walletData
                    ? `₹ ${walletData.withdrawable_balance}`
                    : "****"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}