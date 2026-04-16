import React, { useEffect, useState } from "react";
import vipLogo from "../../assets/rechargLogo.png";
import walletBg from "../../assets/rechargeCardBg.png";
import imageBg from "../../assets/recjhraLabelBg.png"
import { RefreshCw } from "lucide-react";

export default function VipWalletCard() {
  const [progress, setProgress] = useState(0);
  const [showBalance, setShowBalance] = useState(false);
  useEffect(() => {
    setTimeout(() => setProgress(55), 300);
  }, []);
return (
  <div className="px-4 mt-54">
    <div
    onClick={()=>navigate('/recharge')}
      className="rounded-2xl overflow-hidden shadow-lg px-4 pt-4 pb-5"
      style={{
        backgroundImage: `url(${imageBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center justify-between">
        <img src={vipLogo} className="w-11 h-11" />
        <span className="text-gray-700 font-bold text-lg">V1</span>
      </div>


      <div className="mt-3">
        <div className="w-full h-1.5 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-500 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* TEXT */}
      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-gray-600">
          Recharge{" "}
          <span className="text-orange-500 font-bold">₹100</span> more
        </p>

        <button className="px-4 py-1 text-xs rounded-full text-white bg-gradient-to-r from-purple-500 to-indigo-500 shadow">
          Recharge
        </button>
      </div>
    </div>

    {/* ─── WALLET (NO RADIUS, slight overlap) ───────────────── */}
    <div
      className="mt-[-11px] px-4 pt-4 pb-5 text-white relative rounded-2xl"
      style={{
        backgroundImage: `url(${walletBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative">
        {/* TITLE */}
        <div className="flex justify-between items-center">
          <p className="text-sm">My Wallet</p>

          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-1 rounded-full bg-white/20"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* BALANCE */}
        <h2 className="text-3xl font-bold mt-2">
          {showBalance ? "₹ 43.55" : "********"}
        </h2>

        {/* DETAILS */}
        <div className="flex justify-between mt-4 text-sm">
          <div>
            <p className="text-white/70 text-xs">Cash Balance</p>
            <p className="font-bold text-lg">
              {showBalance ? "₹ 23.05" : "****"}
            </p>
          </div>

          <div>
            <p className="text-white/70 text-xs">Withdrawable</p>
            <p className="font-bold text-lg">
              {showBalance ? "₹ 20.50" : "****"}
            </p>
          </div>
        </div>
      </div>
    </div>

  </div>
);
}