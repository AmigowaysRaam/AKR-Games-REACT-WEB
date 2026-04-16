import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X, Bell, Search, LogOut } from "lucide-react";
import { fetchUser, getTopBarList } from "../services/authService";
export function TopBar({ sendDataToParent, onClosetheModal }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(0);
  const [menuItems, setMenuItems] = useState([]);
  useEffect(() => {
    if (onClosetheModal) {
      setOpen(false);
      setShowLogoutModal(false);
    }
  }, [onClosetheModal]);

  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sendDataToParent(open || showLogoutModal);
  }, [open, showLogoutModal]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedWallet = localStorage.getItem("wallet");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setWallet(storedWallet || 0);
    } else if (storedWallet) {
      setWallet(storedWallet);
    }
  }, [open, showLogoutModal]);

  useEffect(() => {
    setLoading(true);
    const fetchMenu = async () => {
      try {
        const res = await getTopBarList();
        if (res?.success) {
          setMenuItems(res.data?.menu || []);
        }
      } catch (err) {
        console.error("Menu API failed", err);
      }
      finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const parsedUser = JSON.parse(localStorage.getItem("user"));
      if (!parsedUser?.id) return;

      try {
        const res = await fetchUser({ userId: parsedUser.id });
        if (res?.success) {
          const updatedUser = res.data?.user;
          // ✅ update localStorage
          localStorage.setItem("user", JSON.stringify(updatedUser));
          localStorage.setItem("wallet", updatedUser?.wallet || 0);

          // ✅ update state (THIS WAS MISSING)
          setUser(updatedUser);
          setWallet(updatedUser?.wallet || 0);
        }
      } catch (err) {
        console.error("Profile API failed", err);
      }
    };
    fetchProfile();
  }, [location.pathname, open, showLogoutModal]);
  const handleMenuClick = (item) => {
    setOpen(false);
    if (item.route) {
      navigate(item.route);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("wallet");
    localStorage.clear(); // removes all items
    setUser(null);
    setWallet(0);
    setShowLogoutModal(false);
    setOpen(false);
    navigate("/Login");
  };
  return (
    <>
      <div className="flex justify-between  items-center px-4 py-3 bg-white shadow-sm relative z-40">
        <div onClick={() => setOpen(true)} className="cursor-pointer text-lg">
          ☰
        </div>
        {
          loading ?
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Loading...</p>
            </div>
            :
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Bell size={20} onClick={() => navigate("NotificationScreen")} />
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate("PlayerProfileScreen")}
                  >
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{user.username}</p>
                      <p className="font-bold text-black">₹{wallet}</p>
                    </div>

                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200 overflow-hidden border-1">
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
                  </div>
                  <Search size={20} onClick={() => navigate("SearchScreen")} />
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
        }

      </div>
      {/* BACKDROP */}

      {(open || showLogoutModal) && (
        <div
          onClick={() => {
            setOpen(false);
            setShowLogoutModal(false);
          }}
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        />
      )}
      {
        open &&
        <>
          {/* className="fixed top-0 left-0 w-[85%] max-w-[320px] z-50 ..." */}
          <div
            className={`fixed top-0 left-0 w-[85%] max-w-[320px] z-50 bg-white shadow-xl transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
              }`}
          >
            <div className="flex flex-col h-full">
              {/* HEADER */}
              <div className="flex justify-between items-center p-4 border-b">
                <span className="font-bold text-purple-700 text-lg">AKR</span>
                <X className="cursor-pointer" onClick={() => setOpen(false)} />
              </div>

              {/* CONTENT */}
              <div className="flex-1 overflow-y-auto">
                {/* REFER */}
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
                {menuItems.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleMenuClick(item)}
                    className="flex mb-1 items-center gap-3 px-4 py-3 bg-gray-100 cursor-pointer hover:bg-gray-200"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
              {user && (
                <div className="p-4 border-t">
                  <button
                    onClick={() => { setOpen(false), setShowLogoutModal(true) }}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      }
      {showLogoutModal && (
        <div className="fixed inset-0 z-[333] backdrop-blur-sm flex  mt-[95%] items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl p-5 w-[90%] max-w-sm shadow-2xl relative z-[10000]">
            <h2 className="text-lg font-semibold mb-2">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setOpen(true), setShowLogoutModal(false) }}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}