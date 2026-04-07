import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Bell, Search } from "lucide-react";

export function TopBar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
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

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <>
      {/* TOP BAR */}
      <div className="flex justify-between items-center px-4 py-3 bg-white shadow-sm relative z-30">
        {/* MENU BUTTON */}
        <div onClick={() => setOpen(true)} className="cursor-pointer text-lg">
          ☰
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Bell size={20} onClick={() => navigate("NotificationScreen")} />

              <div className="flex items-center gap-2"
                onClick={() => navigate('PlayerProfileScreen')}
              >
                <div className="text-right">
                  <p className="text-xs text-gray-500">{user.username}</p>
                  <p className="font-bold text-black">₹{wallet}</p>
                </div>

                <div className="w-9 h-9 rounded-full flex items-center justify-center">
                  {user.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt="profile"
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    user.username?.charAt(0).toUpperCase()
                  )}
                </div>
              </div>
              <Search  size={20} onClick={() => navigate("SearchScreen")} />
            </>
          ) : (
            <button
              onClick={() => navigate("/Login")}
              className="bg-purple-600 text-white px-4 py-1 rounded-full"
            >
              LOGIN
            </button>
          )}
        </div>
      </div>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${open ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      />
      {
        open &&
        <div
          className={`fixed top-0 left-0 h-full w-[85%] max-w-[320px] z-50 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="bg-white rounded-b-3xl shadow-xl overflow-hidden ">
            <div className="flex justify-between items-center p-4 border-b ">
              <span className="font-bold text-purple-700 text-lg">AKR</span>
              <X className="cursor-pointer" onClick={() => setOpen(false)} />
            </div>

            <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 mb-1">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2331/2331970.png"
                alt="refer"
                className="w-14"
              />
              <div>
                <p className="text-sm font-semibold">Refer and Earn</p>
                <p className="text-red-500 font-bold text-sm">WIN:₹100.00</p>
              </div>
            </div>
            <div className="text-gray-700 text-sm">
              {[
                { name: "Lottery", icon: "🎱" },
                { name: "Live Casino", icon: "🎮" },
                { name: "Casino", icon: "🎲" },
                { name: "Scratch Off", icon: "🎯" },
                { name: "Sports", icon: "⚽" },
                { name: "Promotions", icon: "🎁" },
                { name: "Notification", icon: "🔔" },
                { name: "English", icon: "🌐" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex mb-1 items-center gap-3 px-4 py-3 bg-gray-100 cursor-pointer"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
              ))}
              <div className="h-2 bg-gray-100" />
            </div>
          </div>
        </div>
      }

    </>
  );
}