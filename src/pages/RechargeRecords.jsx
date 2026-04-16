import {
  ChevronLeft, Headphones,
  ChevronDown, Copy, Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRechargeHist } from "../services/authService";
import GameLoader from "./LoaderComponet";
export default function RechargeRecords() {
  const navigate = useNavigate();
  const [openId, setOpenId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [loading, setLoading] = useState(true);
  // ✅ FORMAT DATE
  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const [user, setUser] = useState(null);
  const [histdata, setData] = useState([]);
  // ✅ LOAD USER + API
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchHistory(parsedUser.id); // 🔥 FIXED
    } else {
      setLoading(false);
    }
  }, []);
  const fetchHistory = async (userId) => {
    try {
      setLoading(true);

      const res = await getRechargeHist({
        id: userId,
      });

      // 🔥 SAFE SET
      setData(res?.history || []);

    } catch (err) {
      console.log("API Error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text || "");
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="max-w-[430px] mx-auto bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 bg-white shadow-sm sticky top-0 z-10">
        <ChevronLeft
          onClick={() => navigate(-1)}
          className="cursor-pointer"
        />
        <span className="font-semibold text-lg tracking-tight">
          Recharge Records
        </span>
        <Headphones
          className="w-5 h-5 text-gray-700 cursor-pointer"
          onClick={() => navigate("/CustomerSupport")}
        />
      </div>

      <div className="p-3 space-y-4">

        {/* 🔄 LOADER */}
        {loading ? (
          <GameLoader />

        ) : histdata.length === 0 ? (
          /* ❌ EMPTY STATE */
          <div className="text-center py-10 text-gray-400">
            No Records Found
          </div>
        ) : (
          /* ✅ DATA LIST */
          histdata.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all"
            >

              {/* STATUS */}
              <div className="flex justify-between items-center px-4 py-2 bg-blue-50">
                <span className="text-blue-600 text-xs font-semibold">
                  {(item.status || "pending").toUpperCase()}
                </span>
                <span className="text-xs text-gray-400">
                  within 24 hours
                </span>
              </div>

              {/* MAIN */}
              <div
                className="flex justify-between items-center px-4 py-4 cursor-pointer"
                onClick={() => toggleOpen(item.id)}
              >
                <div className="flex items-center gap-3">

                  <div className="bg-orange-100 text-orange-500 p-2.5 rounded-full">
                    <Wallet className="w-4 h-4" />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      Recharge
                    </p>
                    {item.bonus && (
                      <p className="text-xs text-green-600">
                        Bonus ₹{item.bonus}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-base">
                    ₹ {Number(item.amount || 0).toLocaleString()}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${openId === item.id ? "rotate-180" : ""
                      }`}
                  />
                </div>
              </div>

              {/* DETAILS */}
              <div
                className={`px-4 transition-all duration-300 ${openId === item.id
                  ? "max-h-40 pb-4 opacity-100"
                  : "max-h-0 overflow-hidden opacity-0"
                  }`}
              >
                <div className="border-t pt-3 space-y-2 text-sm text-gray-600">

                  <div className="flex justify-between">
                    <span>Total Amount</span>
                    <span className="font-medium text-gray-900">
                      ₹ {Number(item.total || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Recharge Time</span>
                    <span className="text-gray-900 font-medium">
                      {formatDate(item.created_at)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Order ID</span>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">
                        #{item.id}
                      </span>

                      <Copy
                        className="w-4 h-4 cursor-pointer text-gray-500 hover:text-black"
                        onClick={() =>
                          copyToClipboard(item.id, item.id)
                        }
                      />

                      {copiedId === item.id && (
                        <span className="text-green-500 text-xs">
                          Copied
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}