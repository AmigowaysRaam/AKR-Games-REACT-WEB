import { useEffect, useState } from "react";
import { ChevronLeft, Headphones, Info, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getWalletSummary } from "../services/authService";

export default function WalletScreen() {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [walletData, setWalletData] = useState({
    totalWallet: 0,
    cash_balance: 0,
    withdrawable_balance: 0,
    actions: [],
    games: [],
    info: "",
  });
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      fetchWallet(parsedUser.id);
    } else {
      navigate("/Login");
      setLoading(false);
    }
  }, []);

  // ✅ API CALL
  const fetchWallet = async (uid, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const res = await getWalletSummary({ id: uid });
      const api = res?.data;
      if (!api) return;
      setWalletData({
        totalWallet: Number(api?.wallet?.total),
        cash_balance: Number(api?.wallet?.cash_balance || 0),
        withdrawable_balance: Number(api?.wallet?.withdrawable || 0),
        actions: api?.actions || [],
        games: api?.games || [],
        info:
          api?.info ||
          "Transfer funds between main wallet and game wallets.",
      });
    } catch (err) {
      console.log("API Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const handleRefresh = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    fetchWallet(parsedUser.id, true);
  };

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-gray-100 relative">
      {/* HEADER */}
      <div className="bg-gradient-to-b from-purple-700 to-pink-500 text-white p-4 pb-20 rounded-b-3xl">
        <div className="flex justify-between items-center mb-4">
          <ChevronLeft onClick={() => navigate(-1)} />

          <span className="font-semibold text-lg">My Wallet</span>

          <div className="flex items-center gap-3">
            {/* 🔄 REFRESH BUTTON */}
            <RefreshCw
              onClick={handleRefresh}
              className={`cursor-pointer ${refreshing ? "animate-spin opacity-70" : ""
                }`}
            />

            <Headphones onClick={() => navigate("/CustomerSupport")} />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80">Total Wallet</p>
            <p className="text-2xl font-bold">
              ₹ {walletData.totalWallet}
            </p>
          </div>

          <button
            onClick={() => navigate("/Recharge")}
            className="bg-purple-500 px-5 py-2 rounded-full font-semibold"
          >
            Recharge
          </button>
        </div>
      </div>

      {/* ACTION CARD */}
      <div className="relative z-20 mx-4 -mt-14">
        <div className="bg-white rounded-2xl shadow-lg p-4 flex justify-between text-center">
          {walletData.actions.map((item, i) => (
            <div
              key={i}
              onClick={() => navigate(item.route)}
              className="flex flex-col items-center cursor-pointer flex-1"
            >
              <img
                src={item.img}
                className="w-10 h-10 object-contain"
                alt={item.name}
              />
              <span className="text-sm mt-1">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* GAMING WALLET */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-purple-700">
            Gaming Wallet
          </p>

          <Info
            size={18}
            className="cursor-pointer text-gray-500"
            onClick={() => setShowInfo(true)}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {walletData.games.map((g, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-3 flex flex-col items-center shadow-sm"
            >
              <div className="text-3xl">{g.icon}</div>
              <p className="text-sm font-medium mt-1">{g.name}</p>
              <p className="text-xs text-gray-500">
                ₹ {Number(g.balance || 0)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* INFO POPUP */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-[90%] max-w-sm rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-400 opacity-90"></div>

            <div className="relative z-10 p-5 text-white text-center">
              <h2 className="font-bold text-lg mb-2">
                Gaming Wallet Info
              </h2>

              <p className="text-sm mb-4">
                {walletData.info}
              </p>

              <button
                onClick={() => setShowInfo(false)}
                className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}