import React, { useEffect, useState } from "react";
import logo from "../../assets/rechargLogo.png";
import {
  ChevronRight, RefreshCw, Wallet, IndianRupee,
  Eye, EyeOff
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getWalletSummary } from "../../services/authService";

export default function VipWalletCard({ showSpin }) {
  const [progress, setProgress] = useState(0);
  const [showBalance, setShowBalance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [vipData, setVipData] = useState(null);
  const [userdata, setuserdata] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
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
  }, [location.pathname, showSpin]); // 
  const fetchWallet = async (uid, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const res = await getWalletSummary({ id: uid });
      const apiData = res?.data;
      if (apiData) {
        setWalletData({
          total_wallet: apiData?.total || "0",
          cash_balance: apiData?.wallet?.cash_balance || "0",
          withdrawable_balance: apiData?.wallet?.withdrawable || "0",
          total: apiData?.wallet?.total || "0",
        });
        // localStorage.setItem("wallet", apiData?.totalWallet);
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
        <div onClick={() => navigate("/Recharge")}
          className="p-4 cursor-pointer"
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
            <p className="text-xs text-white/80 font-medium 
            " style={{
                fontSize: "11px",
              }}>
              {vipData?.message || ""}
            </p>
            <button
              onClick={() => navigate("/Recharge")}
              className="px-4 py-1 text-xs font-semibold cursor-pointer rounded-full text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow"
            >
              Recharge
            </button>
          </div>
        </div>
        <div
          // onClick={() => { navigate("/WalletScreen") }}
          className="p-4 text-white relative overflow-hidden cursor-pointer"
          style={{
            backgroundImage: `url(https://www.akrlottery.com/assets/images/plain2.jpg)`,
            backgroundSize: "cover",       // makes image fill container
            backgroundPosition: "center",  // keeps it centered
            backgroundRepeat: "no-repeat", // prevents tiling
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-red/10 to-red pointer-events-none" />
          <div className="flex justify-between items-center relative">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="opacity-80" />
              <p className="text-sm opacity-90">My Wallet</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const storedUser = localStorage.getItem("user");
                  if (!storedUser) {
                    navigate("/Login");
                    return;
                  }
                  setShowBalance((prev) => !prev);
                }}
                className="p-1 rounded-full bg-white/20"
              >
                {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>

              {/* Refresh */}
              <button
                onClick={handleRefresh}
                className={`p-1 rounded-full bg-white/20 ${refreshing ? "animate-spin" : ""
                  }`}
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>

          {/* TOTAL BALANCE */}
          <div
            onClick={() => userdata && navigate("/WalletScreen")}
            className={`flex items-center gap-2 cursor-pointer ${userdata ? "" : "opacity-50 cursor-not-allowed"
              }`}
          >
            <div className="flex items-center gap-1 mt-2"
            >
              <IndianRupee size={20} className="opacity-80" />

              <h3 className="text-2xl font-bold">
                {loading ? (
                  <div className="h-8 w-32 bg-white/30 rounded animate-pulse" />
                ) : showBalance && walletData ? (
                  walletData?.total
                ) : (
                  "****"
                )}
              </h3>
            </div>

            {userdata && <ChevronRight className="mt-2" />}
          </div>

          {/* DETAILS */}
          <div className="flex justify-between mt-4 text-sm">

            {/* Cash Balance */}
            <div
              className="curosr-pointer"
              onClick={() => { userdata && navigate("/WalletScreen") }}>
              <p className="text-white/70 text-xs flex items-center gap-1">
                <IndianRupee size={12} /> Cash Balance
              </p>

              {loading ? (
                <div className="h-5 w-20 bg-white/30 rounded animate-pulse mt-1" />
              ) : (
                <p className="font-bold text-lg flex items-center gap-1">
                  {showBalance && walletData ? (
                    <>
                      <IndianRupee size={16} />
                      {walletData.cash_balance}
                    </>
                  ) : (
                    "****"
                  )}
                </p>
              )}
            </div>

            {/* Withdrawable */}
            <div className="curosr-pointer"
              onClick={() => { userdata && navigate("/WalletScreen") }}>
              <p className="text-white/70 text-xs flex items-center gap-1">
                <IndianRupee size={12} /> Withdrawable
              </p>

              {loading ? (
                <div className="h-5 w-20 bg-white/30 rounded animate-pulse mt-1" />
              ) : (
                <p className="font-bold text-lg flex items-center gap-1">
                  {showBalance && walletData ? (
                    <>
                      <IndianRupee size={16} />
                      {walletData.withdrawable_balance}
                    </>
                  ) : (
                    "****"
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}