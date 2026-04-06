import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Bell } from "lucide-react";

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

  // ✅ Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <>
      {/* TOP BAR */}
      <div className="flex justify-between items-center px-4 py-3 bg-white shadow-sm relative z-30">

        {/* MENU BUTTON */}
        <div
          onClick={() => setOpen(true)}
          className=" cursor-pointer text-lg"
        >
          ☰
        </div>
        {/* <p className="text-xs">Menu</p> */}
        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Bell size={20} onClick={() => navigate('NotificationScreen')} />

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {user.username}
                  </p>
                  <p className="font-bold text-black">
                    ₹{wallet}
                  </p>
                </div>

                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
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

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}
      <div
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 transition-transform duration-300 ${open ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <div className="bg-white rounded-b-3xl shadow-xl overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <span className="font-bold text-purple-700 text-lg">
              AKR
            </span>
            <X
              className="cursor-pointer"
              onClick={() => setOpen(false)}
            />
          </div>
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-100">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2331/2331970.png"
              alt="refer"
              className="w-14"
            />
            <div>
              <p className="text-sm font-semibold">Refer and Earn</p>
              <p className="text-red-500 font-bold text-sm">
                WIN:₹100.00
              </p>
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
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 border-b hover:bg-gray-100 cursor-pointer"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </div>
            ))}
            <div className="h-2 bg-gray-100" />
            <div className="flex items-center gap-3 px-4 py-3 border-b hover:bg-gray-100 cursor-pointer">
              🔔 <span>Notifications</span>
            </div>

            {/* LANGUAGE */}
            <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center gap-3">
                🌐 <span>English</span>
              </div>
              <span>⌄</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}