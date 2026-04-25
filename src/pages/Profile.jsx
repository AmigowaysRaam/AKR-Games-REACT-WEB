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
import GameLoader from "./LoaderComponet";
import QuickActions from "./QuickActions";

export default function Profile() {
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSpin, setShowSpin] = useState(false);
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(0);
  const [sections, setSections] = useState([]);
  const [loading, setSloading] = useState(false);

  const fetchHistory = async () => {
    try {
      setSloading(true);
      const localData = localStorage.getItem("sidebarMenu");
      if (localData) {
        const parsed = JSON.parse(localData);
        setSections(parsed);
      }
      const res = await getSideBarMenu();
      console.log("Sidebar Menu Data:", res);
      if (res?.success && Array.isArray(res?.data)) {
        setSections(res.data);
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
    finally {
      setSloading(false);
    }
  };
  const iconMap = {
    Gift, Users,
    Trophy, Wallet, BarChart3, IndianRupee,
    Bell, Lock, Globe, Headphones,
  };
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/Login");
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
    <div className="h-screen flex flex-col bg-gray-100 pb-10 ">
      <div
        onClick={() => {
          user && user?.id ? navigate("/PlayerProfileScreen") : navigate("/Login");
        }}
        className="sticky top-0  bg-white border-b border-gray-200"
      >
        {user && user?.id ? (
          <div className="p-4 flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 rounded-full flex border-1 items-center justify-center bg-gray-200 overflow-hidden">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                user.username?.charAt(0).toUpperCase()
              )}
            </div>
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
      {
        loading && (
          <GameLoader />
        )
      }
      <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        <VipWalletCard wallet={wallet} showSpin={showSpin} />
        <QuickActions
          sections={sections}
          user={user}
          navigate={navigate}
          setShowSpin={setShowSpin}
        />
        {sections
          .filter(sec => sec.type === "promo")
          .map((sec, i) => (
            <div key={i} className="grid grid-cols-2 gap-3 px-4 mt-6 ">
              {sec.items.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    item.type == 'bonus' && !user ? navigate("/Login") :
                      navigate("/promo", { state: { type: item.type } })}
                  className={`flex items-center justify-between p-3 rounded-xl  cursor-pointer  ${idx === 0
                    ? "bg-gradient-to-r from-red-100 to-red-200 border-red-400"
                    : "bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-200"}
  `}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12">
                      <img
                        src={item.image}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
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
                    allow={item?.requires_login ? user && user?.id : true}
                    label={item.label}
                    icon={IconComponent}
                    badge={item.badge}
                    color={item.color}
                    nav={item.route}
                    loadData={() => fetchHistory()}
                  />
                );
              })}
            </ProfileSection>
          ))}
        {user && (
          <div className="px-4 mt-4 mb-4">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full cursor-pointer flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl"
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
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center ">
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
                className="flex-1 py-2 cursor-pointer bg-red-500 text-white rounded-xl "
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