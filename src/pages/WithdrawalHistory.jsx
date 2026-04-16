import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getWithdraWList } from "../services/authService";
import GameLoader from "./LoaderComponet";

export default function WithdrawHistory() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ALL");
  const [historyDataS, sethistoryDataS] = useState([]);
  const [loading, setLoading] = useState(false);

  const filteredData =
    activeTab === "ALL"
      ? historyDataS
      : historyDataS.filter((item) => item.type === activeTab);

  const getStatusStyle = (status) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };
  const fetchWithdrawData = async () => {
    try {
      setLoading(true);
      const res = await getWithdraWList({});
      // alert(JSON.stringify(res));
      if (res?.success) {
        sethistoryDataS(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawData();
  }, []);

  return (
    <div className="max-w-[430px] mx-auto bg-gray-100 min-h-screen">

      {/* LOADER */}
      {loading && (
                 <GameLoader />

      )}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] flex items-center gap-3 px-4 py-4 bg-white shadow-sm z-50">
        <ChevronLeft onClick={() => navigate(-1)} />
        <span className="font-semibold text-lg">Withdraw History</span>
      </div>
      <div className="fixed top-[64px] left-1/2 -translate-x-1/2 w-full max-w-[430px] px-3 z-40 bg-gray-100">
        <div className="rounded-xl p-2 flex shadow-sm bg-gray-100">
          {["ALL", "UPI", "USDT"].map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-2 rounded-lg text-sm font-medium cursor-pointer transition ${activeTab === tab
                ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white"
                : "text-gray-600 hover:bg-gray-200"
                }`}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      {/* LIST (IMPORTANT FIX → PADDING TOP) */}
      <div className="pt-[140px] p-3 space-y-3">

        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              {/* TOP */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold text-gray-800">
                    ₹ {item.amount}
                  </p>
                  <p className="text-xs text-gray-400">{item.date}</p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusStyle(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div>
                  <p className="text-gray-400">Type</p>
                  <p className="font-medium text-gray-700">{item.type}</p>
                </div>

                <div>
                  <p className="text-gray-400">Ref ID</p>
                  <p className="font-medium text-gray-700">{item.ref}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-10">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
}