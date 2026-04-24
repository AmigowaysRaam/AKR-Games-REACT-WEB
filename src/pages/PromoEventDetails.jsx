import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Headphones } from "lucide-react";

export default function PromoEventDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const event = location.state?.eventDetails;
  return (
    <div className="h-screen bg-[#0b0f2a] flex flex-col">
      <div className="fixed top-0 left-0 w-full max-w-[430px] mx-auto right-0 z-50 flex items-center justify-between px-4 py-4 bg-white shadow">
        <ChevronLeft onClick={() => navigate(-1)} className="cursor-pointer" />
        <span className="font-semibold">Event Details</span>
        <Headphones
          onClick={() => navigate("/CustomerSupport")}
          className="cursor-pointer"
        />
      </div>
      <div className="flex-1 overflow-y-auto pt-[70px] pb-[90px]">
        <div className="mx-3 mt-3 rounded-xl overflow-hidden relative">
          <img
            src={event?.image}
            alt="banner"
            className="w-full h-[180px] object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-3 text-white">
            <p className="text-lg font-bold">{event?.title}</p>
            <p className="text-xs mt-1">
              Activity Time: 28/02/2026 - 30/04/2026
            </p>
            <p className="text-xs mt-1">
              Withdraw: ₹100 - ₹50,000
            </p>
          </div>
        </div>
        <div className="mx-3 mt-3 text-white text-sm">
          Remaining Time: <span className="font-bold">13 Day 05:12:29</span>
        </div>
        <div className="bg-white mx-3 mt-3 p-4 rounded-2xl shadow-lg">
          <p className="font-semibold mb-3">Event Rules</p>
          <div className="text-xs text-gray-600 space-y-2 leading-5">
            <p>1. The First Withdrawal Promotion is only for new users.</p>
            <p>2. Each account can participate only once.</p>
            <p>3. No wagering required. Bonus goes directly to wallet.</p>
            <p>4. Tasks must be completed within 7 days.</p>
            <p>5. Rewards are available only to app users.</p>
          </div>
        </div>
      </div>
      {/* Bottom Fixed Button */}
      <div onClick={()=>navigate('/payRecharge')} className="fixed bottom-0 left-0 w-full max-w-[430px] mx-auto right-0 p-3 bg-transparent">
        <button className="w-full py-3 rounded-full text-white font-semibold text-lg bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg active:scale-95 transition">
          {event?.button_name || "Join Now"}
        </button>
      </div>
    </div>
  );
}