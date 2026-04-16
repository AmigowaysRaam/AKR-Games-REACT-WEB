import { ChevronLeft, Headphones } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function TransferRecordScreen() {
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState("IN");
  const records = [
    { id: 1, amount: 100, status: "Success", date: "2024-03-01 10:20" },
    { id: 2, amount: 200, status: "Success", date: "2024-03-02 12:10" },
    { id: 3, amount: 500, status: "Pending", date: "2024-03-03 14:45" },
    { id: 4, amount: 1000, status: "Failed", date: "2024-03-04 16:30" },
  ];
  return (
    <div className="max-w-[430px] mx-auto bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between px-4 py-4 bg-white shadow-sm sticky top-0 z-10">
        <ChevronLeft onClick={() => navigate(-1)} className="cursor-pointer" />
        <span className="font-semibold text-lg">Transfer Records</span>
        <Headphones className="w-5 h-5 text-gray-700" onClick={() => navigate('/CustomerSupport')} />
      </div>
      <div className="p-3 space-y-3">
        {records?.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="text-sm text-gray-500">{item?.date}</p>
              <p className="font-semibold text-lg">₹ {item?.amount}</p>
            </div>
            <div
              className={`text-sm font-semibold px-3 py-1 rounded-full ${item.status === "Success"
                ? "bg-green-100 text-green-600"
                : item.status === "Pending"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-red-100 text-red-600"
                }`}
            >
              {item.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
