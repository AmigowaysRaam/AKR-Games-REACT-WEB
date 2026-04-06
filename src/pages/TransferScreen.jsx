import { useState } from "react";
import { ChevronLeft, Headphones, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TransferScreen() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success", // success | error
  });

  const amounts = [100, 200, 500, 1000];

  const handleSelect = (amt) => {
    setSelectedAmount(amt);
    setAmount(amt);
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2500);
  };

  const handleConfirm = () => {
    if (!amount || Number(amount) <= 0) {
      showToast("Please enter or select an amount", "error");
      return;
    }
    setShowModal(true);
  };

  const handleFinalSubmit = () => {
    setShowModal(false);

    // 👉 API CALL HERE
    console.log("Transfer Amount:", amount);

    // Reset
    setAmount("");
    setSelectedAmount(null);

    showToast("Transfer successful", "success");
  };

  return (
    <div className="max-w-[430px] mx-auto bg-gray-100 min-h-screen pb-24 relative">

      {/* 🔥 TOAST */}
      <div
        className={`fixed top-[6%] left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300 ${
          toast.show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
        }`}
      >
        <div
          className={`px-4 py-2 rounded-full text-sm text-white shadow-lg ${
            toast.type === "error"
              ? "bg-red-500"
              : "bg-green-500"
          }`}
        >
          {toast.message}
        </div>
      </div>

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 bg-white shadow-sm sticky top-0 z-10">
        <ChevronLeft onClick={() => navigate(-1)} className="cursor-pointer" />
        <span className="font-semibold text-lg">Transfer</span>
        <Headphones
          className="w-5 h-5 text-gray-700 cursor-pointer"
          onClick={() => navigate("/CustomerSupport")}
        />
      </div>

      {/* BALANCE */}
      <div className="mx-3 mt-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl p-4 relative">
        <p className="text-sm opacity-90">Transferable Balance</p>
        <p className="text-2xl font-bold">₹ 0.00</p>

        <div
          onClick={() => navigate("/TransferRecordScreen")}
          className="absolute right-4 top-4 text-sm flex items-center gap-1 cursor-pointer"
        >
          <span>Transfer records</span>
          <span>›</span>
        </div>
      </div>

      {/* FORM */}
      <div className="mx-3 mt-3 bg-white rounded-xl p-4">
        <p className="text-sm text-gray-700 mb-3">
          Transfer to Recharge Wallet
        </p>

        {/* INPUT */}
        <div className="bg-gray-100 rounded-lg p-3">
          <div className="flex justify-between text-gray-500 mb-2">
            <span>Withdrawable: ₹0.00</span>
            <span
              className="text-purple-600 font-semibold cursor-pointer"
              onClick={() => handleSelect(1000)}
            >
              MAX
            </span>
          </div>

          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setSelectedAmount(null);
            }}
            placeholder="Enter amount"
            className="w-full bg-transparent outline-none text-lg font-semibold"
          />
        </div>

        {/* AMOUNT OPTIONS */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          {amounts.map((amt) => (
            <div
              key={amt}
              onClick={() => handleSelect(amt)}
              className={`py-2 rounded-md text-center text-sm font-semibold cursor-pointer ${
                selectedAmount === amt
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              ₹ {amt}
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-3 leading-5">
          After clicking Confirm, your withdrawable balance will be converted
          into Recharge wallet and you will get the corresponding bonus.
        </p>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 w-full max-w-[430px] bg-white p-3">
        <p className="text-center text-sm mb-2">
          Will get:{" "}
          <span className="text-purple-600 font-semibold">
            ₹ {amount || 0}
          </span>
        </p>

        <button
          onClick={handleConfirm}
          className="w-full py-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold"
        >
          Confirm
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-sm rounded-xl p-5 relative">

            <X
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowModal(false)}
            />

            <h2 className="text-lg font-bold text-center mb-3">
              Confirm Transfer
            </h2>

            <p className="text-center text-gray-600 mb-4">
              Are you sure you want to transfer
            </p>

            <p className="text-center text-2xl font-bold text-purple-600 mb-5">
              ₹ {amount}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-full bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 py-2 rounded-full bg-purple-600 text-white"
              >
                Yes Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}