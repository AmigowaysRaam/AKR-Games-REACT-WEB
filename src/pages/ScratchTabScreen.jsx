import { useState } from "react";

export default function RewardTabs({ rewardRecords = [], rewardGuide = [] }) {
  const [activeTab, setActiveTab] = useState("record");
  const isRecord = activeTab === "record";

  return (
    <div className="w-full h-[300px] flex flex-col mt-2">
      <div className="flex bg-[#7c2d12] rounded-t-xl overflow-hidden shadow-md">
        <button
          onClick={() => setActiveTab("record")}
          className={`flex-1 text-center py-3 text-sm font-semibold transition-all duration-300 ${isRecord
            ? "border-b-1 border-yellow-400 bg-[#9a3412] text-white"
            : "text-gray-200 hover:bg-[#8b2c10]"
            }`}
        >
          Reward Record
        </button>

        <button
          onClick={() => setActiveTab("guide")}
          className={`flex-1 text-center py-3 text-sm font-semibold transition-all duration-300 ${!isRecord
            ? "border-b-1 border-yellow-400 bg-[#9a3412] text-white"
            : "text-gray-200 hover:bg-[#8b2c10]"
            }`}
        >
          Reward Guide
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-3 space-y-3 bg-[#3b1f1f] rounded-b-xs overflow-y-auto">

        {isRecord ? (
          rewardRecords.length === 0 ? (
            <div className="text-center text-gray-300 text-sm py-6">
              No reward records found
            </div>
          ) : (
            rewardRecords.map((item, index) => (
              <div
                key={item.id || index}
                className="bg-[#7c2d12] text-black p-3  rounded-xs flex justify-between items-center shadow-sm hover:scale-[1.02] "
              >
                <div className="flex items-start gap-2">
                  {/* INDEX */}
                  <div className="text-[10px]  text-white">
                    #{index + 1}
                  </div>

                  <div>
                    <div className="font-medium  text-white text-[10px]">{item.phone}</div>
                    <div className="text-[10px] text-white text-gray-500">
                      {item?.time}
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-200 px-3 py-1 rounded-full font-semibold text-[10px]">
                  ₹{item.amount}
                </div>
              </div>
            ))
          )
        ) : rewardGuide.length === 0 ? (
          <div className="text-center text-gray-300 text-sm py-6">
            No guide available
          </div>
        ) : (
          rewardGuide?.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-white text-black p-3 rounded-xs flex justify-between items-center shadow-sm hover:scale-[1.02] transition"
            >
              <div className="flex items-start gap-2">
                <div className="text-[10px] font-bold text-gray-800">
                  #{index + 1}
                </div>
                <div>
                  <div className="font-medium">{item.phone}</div>
                  <div className="text-[10px] text-gray-500">
                    {item.title}
                  </div>
                  <div className="text-gray-500 text-[10px]">
                    {item.date}
                  </div>
                </div>
              </div>

              <div className="text-[10px] bg-yellow-200 px-3 py-1 rounded-full font-semibold">
                ₹{item.desc}
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}