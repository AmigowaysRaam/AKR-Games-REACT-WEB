import { useEffect, useState } from "react";
import { ChevronLeft, Headphones, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RechargeRules from "../components/RechargeRules";
import { getrechargeDetailsCall, rechargeCall } from "../services/authService";

export default function RechargeScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("UPI");
  const [amount, setAmount] = useState(null);
  const [selectedBonus, setSelectedBonus] = useState(0);
  const [selectedChannel, setSelectedChannel] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [channels, setChannels] = useState([]);
  const [upiAmounts, setUpiAmounts] = useState([]);
  const [rules, setRules] = useState({ min: 200, max: 3000 });
  const [methodText, setMethodText] = useState("");
  const [note, setNote] = useState("");
  const [bonusCards, setBonusCards] = useState([]);
  const [selectedAmountObj, setSelectedAmountObj] = useState(null);
  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 2500);
  };
  useEffect(() => {
    getRechargDetails();
  }, [activeTab]);
  
  const getRechargDetails = async () => {
    try {
      const res = await getrechargeDetailsCall({
        user_id: JSON.parse(localStorage.getItem("user"))?.id,
        "name": "general",
        "method": activeTab == "UPI" ? "UPI" : "CRYPTO",
        amount: amount || rules.min
      });
      if (res?.success) {
        const data = res.data;
        setWallet(data.wallet_balance);
        const mappedChannels = data.methods.map((m) => ({
          name: m.name,
          sub: `₹${m.min_amount}–₹${m.max_amount}`,
          img: m.icon
        }));
        setChannels(mappedChannels);
        setUpiAmounts(data.quick_amounts);
        // ✅ AUTO SELECT FIRST AMOUNT
        if (data.quick_amounts?.length > 0) {
          setAmount(data.quick_amounts[0].amount);
          setSelectedAmountObj(data.quick_amounts[0]); // ⭐ important
        }
        setRules(data.rules);
        setMethodText(data.header?.current_method_text || "");
        setNote(data.header?.note || "");
        setBonusCards(data.promotions || []);

      } else {
        showToast(res?.message || "Error");
      }
    } catch (err) {
      console.log(err);
      showToast("Failed to load data");
    }
  };
  const handleRechargeClick = () => {
    const numericAmount = Number(amount);
    if (numericAmount < rules.min || numericAmount > rules.max) {
      showToast(`Enter amount between ₹${rules.min} - ₹${rules.max}`);
      return;
    }
    if (numericAmount % 5 !== 0) {
      showToast("Amount must be in multiples of 5");
      return;
    }
    setShowConfirm(true);
  };
  const finalAmount = selectedAmountObj?.total || amount;
  const bonus = selectedAmountObj?.bonus || 0;
  const handleConfirmRecharge = async () => {
    setShowConfirm(false);
    try {
      const res = await rechargeCall({
        amount,
        finalAmount,
        channel: channels[selectedChannel]?.name,
        method: activeTab
      });
      if (res?.status === "success") {
        showToast(res?.message || "Success", "success");
      } else {
        showToast(res?.message || "Error");
      }
    } catch {
      showToast("Recharge failed");
    }
  };
  const cryptoAmounts = [10, 20, 50, 100, 200, 300, 500, 1000];
  return (
    <div className="max-w-[430px] mx-auto bg-gray-100 min-h-screen pb-24">
      <div className="flex items-center justify-between px-4 py-5 bg-white shadow-sm">
        <ChevronLeft onClick={() => navigate(-1)} />
        <span className="font-semibold">Recharge</span>
        <Headphones onClick={() => navigate('/CustomerSupport')} />
      </div>
      {/* ✅ BALANCE CARD (UPDATED DESIGN) */}
      <div className="m-3 rounded-2xl text-white relative overflow-hidden">
        {/* https://www.singamlottery.com/static/media/recharge-header-bg.785a720239d8eb20f9d6.webp */}
        <img
          src="https://www.singamlottery.com/static/media/recharge-header-bg.785a720239d8eb20f9d6.webp"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 opacity-90"></div>

        <div className="relative z-10 p-4 pt-5 pb-16">
          <div className="flex justify-between items-start">

            <div>
              <p className="text-sm opacity-80">Balance</p>

              <div className="flex items-center gap-2 mt-1 pb-5">
                <p className="text-xl font-bold">₹ {wallet}</p>

                <div
                  onClick={getRechargDetails}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 cursor-pointer"
                >
                  <RefreshCcw size={16} />
                </div>
              </div>
            </div>
            <div
              onClick={() => navigate("/rechargRecords")}
              className="text-right cursor-pointer"
            >
              <p className="text-sm">Recharge</p>
              <p className="text-sm flex items-center justify-end gap-1">
                records <span>›</span>
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 w-full bg-purple-900/80 px-4 py-3">
          <p className="text-sm font-semibold">{methodText}</p>
          <p className="text-xs opacity-80 mt-1">{note}</p>
        </div>
      </div>
      <div className="flex mx-3 bg-gray-200 rounded-xl p-1">
        {["UPI", "USDT"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setAmount(tab === "UPI" ? rules.min : 10);
            }}
            className={`flex-1 py-2 rounded-lg ${activeTab === tab ? "bg-purple-600 text-white" : ""
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex gap-3 px-3 mt-3">
        {bonusCards?.map((card, i) => {
          const isActive = selectedBonus === i;
          return (
            <div
              key={i}
              onClick={() => setSelectedBonus(i)}
              className={`relative flex-1 h-[90px] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${isActive ? "scale-[1.04]" : ""
                }`}
            >
              <img
                src={card.image}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
              <div className="relative z-10 p-4 text-white flex flex-col justify-between h-full">
                {
                  card?.value &&
                  <div className="text-lg font-extrabold leading-none " style={{ fontSize: "25px" }}>
                    {card?.value}
                  </div>
                }
                <div className="text-xs font-medium opacity-90">
                  {card?.title}
                </div>
              </div>
              {isActive && (
                <>
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-xl"></div>
                  <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs shadow">
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
          className="w-full p-3 rounded-lg border outline-none"
          type="number"
          value={amount}
          onChange={(e) => {
            let value = e.target.value;

            if (value === "") {
              setAmount("");
              return;
            }
            // ✅ prevent too many digits (like 999999999)
            if (value.length > 5) return;

            const num = Number(value);

            // ❌ block above max
            if (num > rules.max) return;

            setAmount(value);
          }}
        />
        <p className="text-xs mt-2">Min ₹{rules.min} & Max ₹{rules.max}</p>
      </div>
      {toast.message && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-whitez-50 ${toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
        >
          {toast.message}
        </div>
      )}
      <div className="grid grid-cols-4 gap-3 px-3 mt-3">
        {(activeTab === "UPI" ? upiAmounts : upiAmounts).map((amt, i) => (
          <div
            key={i}
            onClick={() => {
              setAmount(amt?.amount);
              setSelectedAmountObj(amt);
            }}
            className={`relative py-3 text-center rounded-lg shadow-sm transition-all duration-200
        ${selectedAmountObj?.amount === amt?.amount
                ? "bg-purple-600 text-white scale-105"
                : "bg-gray-200"
              }`}
          >
            {/* 🔥 BLINKING BONUS TAG */}
            {activeTab === "UPI" && amt?.bonus && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                <span className="bonus-blink text-white text-[10px] px-2 py-[2px] rounded">
                  {amt.bonus_text}
                </span>
              </div>
            )}
            <div className="text-sm">
              {activeTab === "UPI" ? `₹${amt?.amount}` : `$${amt?.amount}`}
            </div>
          </div>
        ))}
      </div>
      <div className="mx-3 mt-4 bg-white p-4 rounded-xl">
        <p className="mb-2 font-semibold">Recharge channel</p>
        <div className="grid grid-cols-3 gap-3">
          {channels.map((c, i) => (
            <div
              key={i}
              onClick={() => setSelectedChannel(i)}
              className={`p-2  ${selectedChannel == i ? 'border-3 rounded-xl' : "border"} rounded text-center ${selectedChannel === i ? "border-purple-600" : ""
                }`}
            >
              <img src={c.img} className="h-8 mx-auto" />
              <p className="text-xs">{c.name}</p>
              <p className="text-[10px]">{c.sub}</p>
            </div>
          ))}
        </div>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-white p-5 rounded-xl w-[90%]">
            <h2 className="text-center font-bold mb-3">Confirm Recharge</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Amount</span>
                <span>₹{amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Channel</span>
                <span>{channels[selectedChannel]?.name}</span>
              </div>

              <div className="flex justify-between font-bold text-green-600">
                <span>Total</span>
                <span>₹{finalAmount}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowConfirm(false)} className="flex-1 bg-gray-200 py-2 rounded">
                Cancel
              </button>
              <button onClick={handleConfirmRecharge} className="flex-1 bg-purple-600 text-white py-2 rounded">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="fixed bottom-0 w-full max-w-[430px] bg-white p-3">
        <button
          onClick={handleRechargeClick}
          className="w-full py-3 bg-purple-600 text-white rounded-full"
        >
          <div className="absolute -top-2  left-1/2 -translate-x-1/2">
            <span className="bonus-blink text-white text-[20px] px-5 py-[1px] rounded-xl">
              {selectedAmountObj?.bonus_text}
            </span>
          </div>
          Recharge ₹{amount}
        </button>
      </div>
      <RechargeRules />
    </div>
  );
}