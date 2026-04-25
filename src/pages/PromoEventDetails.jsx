import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Headphones } from "lucide-react";
import { useMemo } from "react";

export default function PromoEventDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const event = location.state?.item || location.state;
  const formattedRules = useMemo(() => {
    if (!event?.description) return [];
    return event.description
      .replace(/\r\n/g, "\n")
      .split("\n")
      .filter((line) => line.trim() !== "");
  }, [event]);
  // Remaining Time: 13 Day 05:12:29 
  // this need to be a stopwatch model and compile full code
  return (
    <div className="h-screen bg-[#0b0f2a] flex flex-col">

      {/* Header */}
      <div className="fixed top-0 left-0 w-full max-w-[430px] mx-auto right-0 z-50 flex items-center justify-between px-4 py-4 bg-white shadow">
        <ChevronLeft onClick={() => navigate(-1)} className="cursor-pointer" />
        <span className="font-semibold">{event?.title}</span>
        <Headphones
          onClick={() => navigate("/CustomerSupport")}
          className="cursor-pointer"
        />
      </div>
      <div className="flex-1 overflow-y-auto pt-[70px] pb-[90px]">
        <div className="mx-3 mt-0 rounded-xl overflow-hidden relative">
          <img
            src={event?.image}
            alt="banner"
            className="w-full h-[200px] object-cover"
          />
          {/* <p className="text-white"> {JSON.stringify(event)}</p> */}
          {/* <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-3 text-white">
            <p className="text-lg font-bold">{event?.title}</p>
            <p className="text-xs mt-1">
              Activity Time: 28/02/2026 - 30/04/2026
            </p>
            <p className="text-xs mt-1">
              Withdraw: ₹100 - ₹50,000
            </p>
          </div> */}
        </div>
        {/* Remaining Time */}
        <div className="mx-3 mt-3 text-white text-sm">
          Remaining Time: <span className="font-bold">13 Day 05:12:29</span>
        </div>
        {
          formattedRules?.length &&
          <div className="bg-white mx-3 mt-3 p-4 rounded-2xl shadow-lg">
            <p className="font-semibold mb-3">Event Rules</p>
            <div className="text-xs text-gray-600 space-y-2 leading-5">
              {formattedRules.map((rule, index) => (
                <p key={index}>{rule}</p>
              ))}
            </div>
          </div>
        }
        <div className="bg-white mx-3 my-1 py-1 rounded-2xl   ">
          {
            event?.key == 'agent-promotion' &&
            <div className="  mx-4 mt-3  shadow-lg">
              <div className="space-y-2 " style={
                {
                  background: "linear-gradient(to left, #4c1d95, #9d174d, #7f1d1d)"
                }
              }>
                <div
                  className={`flex justify-between 
                'bg-white-100' 
                } p-2 rounded-sm `}
                >
                  <span className="text-white">{"Invites"}</span>
                  <span className="font-semibold text-white">
                    {"Salary Bonus"}
                  </span>
                </div>
              </div>
            </div>
          }
          {event?.levels?.length > 0 && (
            <div className="bg-white mx-4  p-4  shadow-lg">
              <p className="font-semibold mb-3">Event Rewards</p>
              <div className="space-y-2 text-xs">
                {event?.levels.map((lvl, index) => (
                  <div
                    key={index}
                    className={`flex justify-between ${index % 2 == 0 ?
                      'bg-gray-100' : "bg-gray-300"
                      } p-2 rounded-sm`}
                  >
                    <span>{lvl?.title}</span>
                    {
                      lvl.min_amount && lvl?.max_amount &&
                      <span>
                        ₹{lvl?.min_amount} - ₹{lvl?.max_amount}
                      </span>
                    }
                    <span className="font-semibold text-green-800">
                      +₹{lvl.bonus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
      {
        event?.key !== 'agent-promotion' &&
        <div
          onClick={() => event?.key.includes('3-digit-bet') ? navigate("/") : navigate("/payRecharge")}
          className="fixed bottom-0 left-0 w-full max-w-[430px] mx-auto right-0 p-3 bg-transparent"
        >
          <button className="w-full py-3 rounded-full text-white font-semibold text-lg bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg active:scale-95 transition">
            {event?.button_name || "Join Now"}
          </button>
        </div>
      }
    </div>
  );
}
