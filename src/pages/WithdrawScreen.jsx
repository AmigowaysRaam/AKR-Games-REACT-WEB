import { useState } from "react";
import { ChevronLeft, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WithdrawScreen() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("UPI");
  const [amount, setAmount] = useState(100);

  const amounts = [100, 200, 300, 500, 1000, 2000, 5000, 10000, 20000];

  return (
    <div className="max-w-[430px] mx-auto bg-gray-100 min-h-screen pb-24">

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 bg-white shadow-sm sticky top-0 z-10">
        <ChevronLeft onClick={() => navigate(-1)} className="cursor-pointer" />
        <span className="font-semibold text-lg">Withdraw</span>
        <Headphones className="w-5 h-5 text-gray-700"  onClick={()=>navigate('/CustomerSupport') }/>
      </div>
      <div className="flex gap-3 p-3">
        <div className="flex-1 rounded-xl p-3 flex items-center gap-3 bg-gradient-to-r from-orange-300 to-orange-500 text-white">
          <img
            src="https://www.singamlottery.com/static/media/cash.2896242cd5501bcdf0ba.webp"
            className="w-10 h-10 object-contain"
          />
          <div>
            <p className="text-sm">Cash Balance</p>
            <p className="text-lg font-bold">₹ 54.59</p>
          </div>
        </div>

        {/* WITHDRAWABLE */}
        <div className="flex-1 rounded-xl p-3 flex items-center gap-3 bg-gradient-to-r from-sky-400 to-blue-500 text-white">
          <img
            src="https://www.singamlottery.com/static/media/withdraw.9c2223d8004ded445ff3.webp"
            className="w-10 h-10 object-contain"
          />
          <div>
            <p className="text-sm">Withdrawable</p>
            <p className="text-lg font-bold">₹ 20.50</p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex mx-3 bg-gray-200 rounded-lg p-1">
        {["UPI", "Crypto"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-md text-sm font-medium ${
              activeTab === tab
                ? "bg-purple-600 text-white"
                : "text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* BANK SECTION */}
      <div className="mx-3 mt-3 bg-white rounded-xl p-4">
        <p className="text-sm text-gray-700 mb-3">Transfer to bank account</p>

        <div className="border-2 border-dashed rounded-xl py-6 flex flex-col items-center justify-center text-purple-600 cursor-pointer">
          <span className="text-2xl">+</span>
          <span className="text-sm mt-1">Add Bank Account</span>
        </div>
      </div>

      {/* AMOUNT GRID */}
      <div className="mx-3 mt-3 bg-white rounded-xl p-4">
        <p className="text-sm font-medium mb-3">Withdraw Amount</p>

        <div className="grid grid-cols-3 gap-3">
          {amounts.map((amt) => (
            <div
              key={amt}
              onClick={() => setAmount(amt)}
              className={`py-3 rounded-lg text-center text-sm font-semibold cursor-pointer ${
                amount === amt
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              ₹{amt}
            </div>
          ))}
        </div>
      </div>

      {/* INFO SECTION */}
      <div className="mx-3 mt-3 bg-white rounded-xl p-4 text-sm text-gray-700">
        <p className="font-medium mb-2">Actual amount received:</p>

        <div className="flex justify-between py-1">
          <span>Daily withdrawal limit</span>
          <span className="font-semibold">2000</span>
        </div>

        <div className="flex justify-between py-1">
          <span>Withdrawal fees</span>
          <span className="font-semibold">3%</span>
        </div>

        <div className="flex justify-between py-1">
          <span>Daily withdrawal times</span>
          <span className="font-semibold">2</span>
        </div>

        <div className="flex justify-between py-1">
          <span>Wager requirement</span>
          <span className="font-semibold">0</span>
        </div>

        <hr className="my-3" />

        <p className="text-xs text-gray-500 leading-5">
          Note: withdraw may be delayed due to some bank issues. In this case,
          the withdrawn amount will be returned to your wallet. Thank you for
          your patience.
        </p>

        <p className="text-xs text-gray-500 mt-2 leading-5">
          We have found some money laundry behaviors, so limits that recharge
          amount should be used for betting only. The commission and winning
          amount could be withdrawn immediately.
        </p>
      </div>

      {/* BUTTON */}
      <div className="fixed bottom-0 w-full max-w-[430px] bg-white p-3">
        <button className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold">
          Withdraw
        </button>
      </div>
    </div>
  );
}
