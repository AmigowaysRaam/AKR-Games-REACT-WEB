import { useState } from "react";

export default function RewardTabs({ rewardRecords = [], rewardGuide = [] }) {
  const [activeTab, setActiveTab] = useState("record");

  const isRecord = activeTab === "record";

  return (
    <div className="w-full">
      {/* TABS */}
      <div className="flex mt-4 bg-[#7c2d12] rounded-t-xl overflow-hidden shadow-md">
        <button
          onClick={() => setActiveTab("record")}
          className={`flex-1 text-center py-3 text-sm font-semibold transition-all duration-300 ${isRecord
              ? "border-b-4 border-yellow-400 bg-[#9a3412] text-white"
              : "text-gray-200 hover:bg-[#8b2c10]"
            }`}
        >
          Reward Record
        </button>
        <button
          onClick={() => setActiveTab("guide")}
          className={`flex-1 text-center py-3 text-sm font-semibold transition-all duration-300 ${!isRecord
              ? "border-b-4 border-yellow-400 bg-[#9a3412] text-white"
              : "text-gray-200 hover:bg-[#8b2c10]"
            }`}
        >
          Reward Guide
        </button>
      </div>

      {/* LIST */}
      <div className="p-3 space-y-3 bg-[#3b1f1f] rounded-b-xl min-h-[150px]">
        {/* RECORD LIST */}
        {isRecord && (
          <>
            {rewardRecords.length === 0 ? (
              <div className="text-center text-gray-300 text-sm py-6">
                No reward records found
              </div>
            ) : (
              rewardRecords.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-white text-black p-3 rounded-xl flex justify-between items-center shadow-sm hover:scale-[1.02] transition"
                >
                  <div>
                    <div className="font-medium">{item.phone}</div>
                    <div className="text-xs text-gray-500">
                      {item.time}
                    </div>
                  </div>

                  <div className="bg-yellow-200 px-3 py-1 rounded-full font-semibold">
                    ₹{item.amount}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* GUIDE LIST */}
        {!isRecord && (
          <>
            {rewardGuide.length === 0 ? (
              <div className="text-center text-gray-300 text-sm py-6">
                No guide available
              </div>
            ) : (
              rewardGuide.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-white text-black p-3 rounded-xl flex justify-between items-center shadow-sm hover:scale-[1.02] transition"
                >
                  <div>
                    <div className="font-medium">{item.phone}</div>
                    <div className="text-xs text-gray-500">
                      {item.time}
                    </div>
                  </div>

                  <div className="bg-yellow-200 px-3 py-1 rounded-full font-semibold">
                    ₹{item.amount}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}