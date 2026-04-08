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
import { getSideBarMenu } from "../services/authService";

export default function Profile() {
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSpin, setShowSpin] = useState(false);
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(0);
  const [sections, setSections] = useState([]);

  const fetchHistory = async () => {
    try {
      // ✅ 1. Check localStorage first
      const localData = localStorage.getItem("sidebarMenu");
      if (localData) {
        const parsed = JSON.parse(localData);
        setSections(parsed); // instant render (no loading)
        // alert(JSON.stringify(parsed?.quick_actions));
      }
      // ✅ 2. Always call API in background (optional but recommended)
      const res = await getSideBarMenu();
      console.log("Sidebar Menu Data:", res);
      if (res?.success && Array.isArray(res?.data)) {
        setSections(res.data);

        // ✅ 3. Update localStorage
        localStorage.setItem("sidebarMenu", JSON.stringify(res.data));
      } else if (!localData) {
        setSections([]);
      }
    } catch (err) {
      console.log("API Error:", err);
      const localData = localStorage.getItem("sidebarMenu");
      if (!localData) {
        setSections([]);
      }
    }
  };
  // 🔥 ICON MAP
  const iconMap = {
    Gift, Users,
    Trophy, Wallet, BarChart3, IndianRupee,
    Bell, Lock, Globe, Headphones,
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/Login");
    // window.location.reload();
  };

  useEffect(() => {
    fetchHistory()
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
          user && user?.id ? navigate("/PlayerProfileScreen") : navigate("/Login");
        }}
        className="sticky top-0 z-50 bg-white border-b border-gray-200"
      >
        {/* <p>{user?.profile_image}</p> */}
        {user && user?.id ? (
          <div className="p-4 flex items-center gap-3 cursor-pointer">
            <img
              src={user?.profile_image || ""}
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
                className="mt-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-1.5 rounded-full text-sm font-semibold"
              >
                LOGIN
              </button>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">

        <VipWalletCard wallet={wallet} />
        <div className="grid grid-cols-4 gap-4 px-4 mt-6 text-center">
          {/* <p>{JSON.stringify(sections
            .filter(sec => sec.type === "quick_actions"))}</p> */}
          {sections
            .filter(sec => sec.type === "quick_actions")
            .flatMap(sec => sec.items)
            .map((item, index) => (
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
        {sections
          .filter(sec => sec.type === "promo")
          .map((sec, i) => (
            <div key={i} className="grid grid-cols-2 gap-3 px-4 mt-6">
              {sec.items.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate("/promo", { state: { type: item.type } })}
                  className={`flex items-center justify-between p-3 rounded-xl   ${idx === 0
                    ? "bg-gradient-to-r from-red-100 to-red-200 border-red-400"
                    : "bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-200"}
  `}
                >
                  <div className="flex items-center gap-2">
                    <img src={item.image} className="w-10 h-10" />
                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <span className="text-xs">{item.tag}</span>
                      <p className="text-[11px] text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={14} />
                </div>
              ))}
            </div>
          ))}
        {sections
          .filter(sec => sec.type === "menu")
          .map((sec, i) => (
            <ProfileSection key={i}>
              {sec.items.map((item, idx) => {
                const IconComponent = iconMap[item.icon];
                return (
                  <ProfileItem
                    key={idx}
                    allow={item.requires_login ? user && user?.id : true}
                    label={item.label}
                    icon={IconComponent}
                    badge={item.badge}
                    color={item.color}
                    nav={item.route}
                  />
                );
              })}
            </ProfileSection>
          ))}
        {user && (
          <div className="px-4 mt-4 mb-4">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
        <SupportFooter />
      </div>
      <LuckySpinModal show={showSpin} onClose={() => setShowSpin(false)} />
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-[320px] rounded-2xl p-5 text-center">
            <h2 className="text-lg font-bold mb-2">Confirm Logout</h2>
            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 border rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 bg-red-500 text-white rounded-xl"
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