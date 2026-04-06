import React, { useEffect, useState } from "react";
import {
  Gift, Users, Trophy, Wallet, BarChart3, IndianRupee,
  Bell, Lock, Globe, Headphones, ChevronRight, Smartphone,
  LogOut,
} from "lucide-react";
import ProfileSection from "../components/profile/ProfileSection";
import ProfileItem from "../components/profile/ProfileItem";
import SupportFooter from "../components/profile/SupportFooter";
import VipWalletCard from "../components/profile/VipWalletCard";
import { useNavigate } from "react-router-dom";
import LuckySpinModal from "./LuckySpin";
export default function Profile() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/Login");
    window.location.reload();
  };
  const [showSpin, setShowSpin] = useState(false);
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
  const maskPhone = (phone) => {
    if (!phone) return "----";
    return phone.slice(0, 3) + "****" + phone.slice(-3);
  };
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div
        onClick={() => {
          user && user?.id != '' ? navigate("/PlayerProfileScreen") :
            navigate("/Login")
        }}
        className="sticky top-0 z-50 bg-white border-b border-gray-200"
      >
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
          {user && user?.id != '' ? (
            <div
              // onClick={() => navigate("/Login")}
              // navigate("/Login")
              className="p-4 flex items-center gap-3 cursor-pointer"
            >
              <img
                src={
                  user?.profile_image
                    ? user.profile_image
                    : ""
                }
                alt="profile"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-bold text-gray-800">
                  {user?.username}
                  <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                    V2
                  </span>
                </p>
                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                  <Smartphone size={12} />
                  <span>
                    {maskPhone(user?.phone)} &nbsp; User ID: {user?.id}
                  </span>
                </div>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>
          ) : (
            <div className="p-4 flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                👤
              </div>

              <div className="flex-1">
                <p className="text-gray-500 text-sm">
                  More exciting after logging in
                </p>
                <button
                  onClick={() => navigate("/Login")}
                  className="mt-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow active:scale-95"
                >
                  LOGIN
                </button>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        <VipWalletCard wallet={wallet} />
        <div className="grid grid-cols-4 gap-4 px-4 mt-6 text-center">
          {[
            {
              name: "Recharge",
              nav: "payRecharge",
              img: "https://www.singamlottery.com/static/media/recharge.d00b25b4176157c6f18e.webp",
            },
            {
              name: "Withdraw",
              nav: "WithdrawScreen",
              img: "https://www.singamlottery.com/static/media/withdraw.fe7869677c95448c365b.webp",
            },
            {
              name: "Transfer",
              nav: "TransferScreen",
              img: "https://www.singamlottery.com/static/media/transfer-gif.cc3e6a33a684f24550be.gif",
            },
            {
              name: "Lucky Spin",
              nav: "luckySpin",
              img: "https://www.singamlottery.com/static/media/luckyspin.e2d3ac10d18ef8329bc7.gif",
            },
          ].map((item) => (
            <div
              key={item.name}
              onClick={() => {
                if (user && user?.id) {
                  if (item.name === "Lucky Spin") {
                    setShowSpin(true);
                  } else {
                    navigate(`/${item.nav}`);
                  }
                }
                else {
                  navigate(`/Login`);
                }
              }}
            >
              <div className="w-12 h-12 mx-auto flex items-center justify-center overflow-hidden">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs mt-1 text-gray-600 font-medium">
                {item.name}
              </p>
            </div>
          ))}
        </div>
        {/* Here change the design */}
        {/* PROMO + BONUS */}
        <div className="grid grid-cols-2 gap-3 px-4 mt-6">

          {/* PROMOTIONS */}
          <div
            onClick={() => navigate("/promo", {
              state: { type: "promo" },
            })}
            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-red-100 to-orange-100 shadow-sm active:scale-95 transition"
          >
            <div className="flex items-center gap-2">
              <img
                src="https://www.singamlottery.com/static/media/me-promotions.d19fe20457cb16f149c3.webp"
                alt="promo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <p className="font-semibold text-gray-800 text-sm">Promotions</p>
                <div className="flex items-center gap-1 text-xs mt-0.5">
                  <span className="bg-orange-200 text-orange-700 px-1.5 py-0.5 rounded">
                    100% Win
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Exciting Rewards Await, Act Now!
                </p>
              </div>
            </div>

            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
              <ChevronRight size={14} className="text-gray-500" />
            </div>
          </div>
          <div
            onClick={() => navigate("/promo", {
              state: { type: "bonus" },
            })}
            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-sm active:scale-95 transition"
          >
            <div className="flex items-center gap-2">
              <img
                src="https://www.singamlottery.com/static/media/me-bonus.3a496a7daab0781505f5.png"
                alt="bonus"
                className="w-10 h-10 object-contain"
              />
              <div>
                <p className="font-semibold text-gray-800 text-sm">Bonus</p>
                <div className="flex items-center gap-1 text-xs mt-0.5">
                  <span className="bg-yellow-300 utext-yellow-800 px-1.5 py-0.5 rounded">
                    180% Bons
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Win <span className="text-orange-500 font-semibold">Free</span> Prizes, Claim Your Reward Now!
                </p>
              </div>
            </div>

            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
              <ChevronRight size={14} className="text-gray-500" />
            </div>
          </div>
        </div>
        <ProfileSection>
          <ProfileItem allow={user && user?.id} label="Gift Code" icon={Gift} badge="HOT" color={["#fb923c", "#f97316"]} nav="GiftCode" />
          <ProfileItem allow={true} label="Agency Center" icon={Users} badge="NEW" color={["#ec4899", "#f43f5e"]} nav="AgencyCenter" />
          <ProfileItem allow={user && user?.id} label="Result history" icon={Trophy} color={["#facc15", "#eab308"]} nav="ResultHistory" />
          <ProfileItem allow={user && user?.id} label="My Bets" icon={IndianRupee} color={["#fb923c", "#f97316"]} nav="MyBets" />
          <ProfileItem allow={user && user?.id} label="My Transactions" icon={BarChart3} color={["#60a5fa", "#3b82f6"]} nav="MyTransaction" />
          <ProfileItem allow={user && user?.id} label="My Commission" icon={Wallet} color={["#f43f5e", "#e11d48"]} nav="MyCommission" />
        </ProfileSection>
        <ProfileSection>
          <ProfileItem allow={user && user?.id} label="Notifications" icon={Bell} color={["#60a5fa", "#3b82f6"]} nav="NotificationScreen" />
          <ProfileItem allow={user && user?.id} label="Password" icon={Lock} color={["#8b5cf6", "#7c3aed"]} nav="PasswordChangeScreen" />
          <ProfileItem allow={true} label="Languages" icon={Globe} color={["#4ade80", "#22c55e"]} nav="Languages" />
          <ProfileItem allow={true} label="Customer service" icon={Headphones} color={["#a78bfa", "#7c3aed"]} nav="CustomerSupport" />
        </ProfileSection>
        {
          user &&
          <div className="px-4 mt-6">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl font-semibold shadow active:scale-95"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        }
        <SupportFooter />
      </div>
      <LuckySpinModal
        show={showSpin}
        onClose={() => setShowSpin(false)}
      />
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-[320px] rounded-2xl p-5 shadow-xl text-center">

            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to logout?
            </p>

            <div className="flex gap-3">
              {/* CANCEL */}
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-600 font-medium"
              >
                Cancel
              </button>

              {/* CONFIRM */}
              <button
                onClick={handleLogout}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white font-semibold"
              >
                Logout
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}