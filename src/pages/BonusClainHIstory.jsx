import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getBOnusHistory } from "../services/authService";
import GameLoader from "./LoaderComponet";

export default function BonusClainHIstory() {
  const navigate = useNavigate();

  const [historyDataS, sethistoryDataS] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const fetchbonusData = async () => {
    try {
      setLoading(true);
      const res = await getBOnusHistory();

      if (res?.success) {
        sethistoryDataS(res?.data?.history || []);
        setSummary(res?.data?.summary || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchbonusData();
  }, []);

  return (
    <div className="max-w-[430px] mx-auto bg-gray-100 min-h-screen">

      {/* LOADER */}
      {loading && <GameLoader />}

      {/* HEADER */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] flex items-center gap-3 px-4 py-4 bg-white shadow-sm z-50">
        <ChevronLeft onClick={() => navigate(-1)} className="cursor-pointer" />
        <span className="font-semibold text-lg">Bonus History</span>
      </div>
      {summary && (
        <div className="pt-[70px] px-3">
          <div className="bg-white rounded-xl p-3 shadow-sm flex justify-between text-sm">
            <div>
              <p className="text-gray-900">Total Claimed</p>
              <p className="font-semibold text-green-800">
                ₹ {summary.total_claimed}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Count</p>
              <p className="font-semibold text-gray-700">
                {summary.total_claimed_count}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="pt-3 px-3 pb-5 space-y-3">
        {historyDataS.length > 0 ? (
          historyDataS.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 
              hover:shadow-md transition-all duration-300 animate-fadeInUp"
              style={{
                animationDelay: `${index * 0.05}s`,
                animationFillMode: "both",
              }}
            >
              {/* TOP */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-bold text-gray-800">
                    ₹ {item.amount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusStyle(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              {/* DIVIDER */}
              <div className="border-t border-dashed my-3"></div>

              {/* DETAILS */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-400">Title</p>
                  <p className="font-medium text-gray-700 truncate">
                    {item.title}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Day</p>
                  <p className="font-medium text-gray-700">
                    {item.day}
                  </p>
                </div>
              </div>

              {/* CLAIM TIME */}
              {item.claimed_at && (
                <div className="mt-3 text-xs text-green-600">
                  Claimed on: {new Date(item.claimed_at).toLocaleString()}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-20 animate-fadeIn">
            <div className="text-4xl mb-2">📭</div>
            No bonus history found
          </div>
        )}
      </div>

      {/* ANIMATIONS */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
           .animate-fadeInUp {
            animation: fadeInUp 0.4s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0 }
            to { opacity: 1 }
          }

          .animate-fadeIn {
            animation: fadeIn 0.5s ease;
          }
        `}
      </style>
    </div>
  );
}