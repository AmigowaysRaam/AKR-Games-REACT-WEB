import { useEffect, useState } from "react";
import { ChevronLeft, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RechargeRules from "../components/RechargeRules";
import { rechargeCall } from "../services/authService";
export default function RechargeScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("UPI");
  const [amount, setAmount] = useState(200);
  const [selectedBonus, setSelectedBonus] = useState(0);
  const [selectedChannel, setSelectedChannel] = useState(0);
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 2500);
  };
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
  
  const handleConfirmRecharge = async () => {
    setShowConfirm(false);
    try {
      const res = await rechargeCall({
        amount,
        finalAmount,
        channel: channels[selectedChannel].name,
        method: "UPI"
      });
      if (res?.status == 'success') {
        showToast(res?.message || "Success", "success");
      } else {
        showToast(res?.message || "Error", "error");
      }
    } catch (err) {
      showToast(err || "Success", "success");
      console.log(err);
    }
  };
  const channels = [
    {
      name: "PhonePe",
      sub: "NEW PAY Min ₹200",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png",
    },
    {
      name: "UPI101",
      sub: "₹200–₹5000",
      img: "https://cdn-icons-png.flaticon.com/512/825/825454.png",
    },
    {
      name: "Paytm UPI",
      sub: "₹200–5000",
      img: "https://upload.wikimedia.org/wikipedia/commons/5/55/Paytm_logo.png",
    },
    {
      name: "UPI20",
      sub: "",
      img: "https://cdn-icons-png.flaticon.com/512/825/825454.png",
    },
    {
      name: "UPI09",
      sub: "₹200–₹20000",
      img: "https://cdn-icons-png.flaticon.com/512/825/825454.png",
    },
    {
      name: "UPI21",
      sub: "",
      img: "https://cdn-icons-png.flaticon.com/512/825/825454.png",
    },
    {
      name: "eaPay",
      sub: "",
      img: "https://cdn-icons-png.flaticon.com/512/825/825454.png",
    },
    {
      name: "donePay",
      sub: "",
      img: "https://cdn-icons-png.flaticon.com/512/5968/5968269.png",
    },
  ];
  const upiAmounts = [200, 500, 1000, 2000, 5000, 10000, 20000, 50000];
  const cryptoAmounts = [10, 20, 50, 100, 200, 300, 500, 1000];
  const rate = 96;
  const bonusCards = [
    {
      img: "https://cdn.cloudfrontstatic.com/manager/a0ffd19c7d60433ea2badb07074ae368.png",
      label: "1000",
      sub: "Second Deposit Bonus",
    },
    {
      img: "https://cdn.cloudstaticfile.com/manager/6881d7dae50f4e9eb3db6648f9c97e01.png",
      label: "3%",
      sub: "Recharge Bonus",
    },
  ];

  const bonusPercent = selectedBonus === 1 ? 0.03 : 0.05;
  // you can adjust logic later

  const finalAmount =
    activeTab === "UPI"
      ? Math.floor(Number(amount) + Number(amount) * bonusPercent)
      : (Number(amount) + Number(amount) * 0.102).toFixed(2);

  return (
    <div className="max-w-[430px] mx-auto bg-gray-100 min-h-screen pb-24">

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-5 bg-white sticky top-0 z-10 shadow-sm">
        <ChevronLeft onClick={() => navigate(-1)} className="cursor-pointer" />
        <span className="font-semibold">Recharge</span>
        <Headphones className="w-5 h-5 text-gray-700" onClick={() => navigate('/CustomerSupport')} />
      </div>
      {/* BALANCE CARD */}
      <div className="m-3 mb-5 rounded-2xl text-white relative overflow-hidden h-45">

        <img
          src="https://www.singamlottery.com/static/media/recharge-header-bg.785a720239d8eb20f9d6.webp"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 p-4 pt-6 pb-20">
          <div className="flex justify-between">
            <div>
              <p className="text-sm opacity-80">Balance</p>
              <p className="text-2xl font-bold">{`₹ ${wallet}`}</p>
            </div>
            <span onClick={() => navigate('/rechargRecords')} className="text-sm">Recharge records →</span>
          </div>
        </div>

        <div className="absolute bottom-0 w-full bg-purple-900/70 p-3">
          <p className="text-sm font-bold">
            Current Method:NEW PAY Min ₹200
          </p>
          <p className="text-xs opacity-80">
            Please switch to another method if the current method failed.
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex mx-3 bg-gray-200 rounded-xl p-1">
        {["UPI", "USDT"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setAmount(tab === "UPI" ? 200 : 10);
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${activeTab === tab
              ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white"
              : "text-gray-600"
              }`}
          >
            {tab === "USDT" ? "USDT" : tab}
          </button>
        ))}
      </div>

      {/* BONUS CARDS */}
      <div className="flex gap-3 px-3 mt-3">
        {bonusCards.map((card, i) => {
          const isActive = selectedBonus === i;

          return (
            <div
              key={i}
              onClick={() => setSelectedBonus(i)}
              className="relative flex-1 h-[100px] rounded-xl overflow-hidden cursor-pointer "
            >

              {/* SELECT BG */}
              {isActive && (
                <img
                  src="https://www.singamlottery.com/static/media/select_bg.49cf421f6b80cce2fa39.webp"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              <img src={card.img} className="w-full h-full object-cover" />

              <div className="absolute inset-0 p-2 text-white flex flex-col justify-between">
                <p className="text-xl font-bold">{card.label}</p>
                <p className="text-[11px]">{card.sub}</p>
              </div>

              {isActive && (
                <>
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-xl"></div>
                  <div className="absolute bottom-1 right-1 bg-blue-500 text-white text-[10px] px-1 rounded-full">
                    ✓
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="mx-3 mt-3">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-5 rounded-xl bg-gray-200 text-lg outline-none"
        />
        {
          toast?.message &&
          (
            <div
              style={{
                ...styles.toast,
                background: toast.type === "error" ? "#ff4d4f" : "#28a745",
              }}
            >
              {toast.message}
            </div>
          )
        }
        <p className="text-sm mt-2 text-gray-600">
          Please enter in round figure in{" "}
          <span className="text-purple-600 font-semibold">
            50s and 100s
          </span>
        </p>

        <p className="text-xs text-black/60 font-semibold">
          Min ₹200 &nbsp; Max ₹3,000
        </p>
      </div>

      {/* AMOUNT GRID */}
      <div className="grid grid-cols-4 gap-3 px-3 mt-3">
        {(activeTab === "UPI" ? upiAmounts : cryptoAmounts).map((amt) => {
          const isActive = amount == amt;

          const bonus =
            activeTab === "UPI"
              ? Math.floor(amt * 0.03)
              : (amt * 0.052).toFixed(2);

          return (
            <div
              key={amt}
              onClick={() => setAmount(amt)}
              className={`relative py-3 rounded-lg text-center text-sm font-semibold cursor-pointer ${isActive
                ? "bg-gradient-to-b from-purple-600 to-purple-500 text-white"
                : "bg-gray-200"
                }`}
            >

              {/* BLINK */}
              <div
                className="absolute -top-2 left-10 right-0 flex justify-center"
                style={{ animation: "blink 1s infinite" }}
              >
                <div className="bg-red-500 text-white text-[15px] px-2 rounded-sm shadow whitespace-nowrap">
                  {activeTab === "UPI"
                    ? `+₹${bonus}`
                    : `+$${bonus}`}
                </div>
              </div>

              {activeTab === "UPI" ? `₹${amt}` : `$${amt}`}
            </div>
          );
        })}
      </div>

      <div className="mx-3 mt-4 bg-white p-4 rounded-xl shadow-sm">

        {/* TITLE */}
        <p className="text-sm font-semibold mb-3 text-gray-700">
          Recharge channel
        </p>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-3">

          {channels.map((item, index) => {
            const isActive = selectedChannel === index;

            return (
              <div
                key={index}
                onClick={() => setSelectedChannel(index)}
                className={`relative flex flex-col items-center justify-center 
          h-[95px] rounded-lg border cursor-pointer transition-all
          ${isActive
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 bg-gray-50"
                  }`}
              >

                {/* IMAGE */}
                <img
                  src={item.img}
                  className="h-8 object-contain mb-2"
                />

                {/* NAME */}
                <p className="text-xs font-semibold text-gray-700 text-center">
                  {item.name}
                </p>

                {/* SUB TEXT */}
                {item.sub && (
                  <p className="text-[10px] text-gray-500 text-center">
                    {item.sub}
                  </p>
                )}

                {/* SELECT CHECK */}
                {isActive && (
                  <div className="absolute bottom-0 right-0 bg-purple-600 text-white text-[10px] px-1 rounded-tl-lg">
                    ✓
                  </div>
                )}
              </div>
            );
          })}

        </div>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-white p-5 rounded-xl w-[90%] max-w-sm">

            <h2 className="text-center font-bold mb-3">Confirm Recharge</h2>

            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Amount</span>
                <span>₹{amount}</span>
              </div>

              <div className="flex justify-between">
                <span>Bonus</span>
                <span>{selectedBonus === 1 ? "3%" : "5%"}</span>
              </div>

              <div className="flex justify-between">
                <span>Channel</span>
                <span>{channels[selectedChannel].name}</span>
              </div>

              <div className="flex justify-between font-bold text-green-600">
                <span>Total</span>
                <span>₹{finalAmount}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-200 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRecharge}
                className="flex-1 bg-purple-600 text-white py-2 rounded"
              >
                Confirm
              </button>
            </div>

          </div>
        </div>
      )}
      {/* CRYPTO EXTRA */}
      {activeTab === "USDT" && (
        <div className="mx-3 mt-4 text-sm text-gray-700 space-y-2">
          <div className="flex justify-between">
            <span>• Real-Time Exchange Rate</span>
            <span className="font-semibold">1 USD ≈ {rate} INR</span>
          </div>

          <div className="flex justify-between">
            <span>• Amount Credited</span>
            <span className="font-semibold">
              {(amount * 1.102).toFixed(2)} USD
            </span>
          </div>
        </div>
      )}
      <RechargeRules />
      <div className="fixed bottom-0 w-full max-w-[430px] bg-white p-3">
        <div className="relative">
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 
      bg-orange-500 text-white text-[11px] px-3 py-[2px] rounded-full font-semibold shadow"
            style={{ animation: "blink 1s infinite" }}
          >
            Extra {selectedBonus === 1 ? "3%" : "5%"} bonus
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold text-center text-base" >
            {activeTab === "UPI"
              ? `Recharge ₹${amount}`
              : `Recharge $${amount}`}
            <div className="text-xs opacity-90">
              You can get{" "}
              {activeTab === "UPI"
                ? `₹${finalAmount}`
                : `$${finalAmount}`}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
const styles = {
  toast: {
    position: "fixed", // ✅ FIXED instead of absolute
    top: "6%",       // better than %
    left: "50%",
    transform: "translateX(-50%)",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 20,
    fontSize: 13,
    zIndex: 9999,      // ✅ ensure it stays above everything
  },
};