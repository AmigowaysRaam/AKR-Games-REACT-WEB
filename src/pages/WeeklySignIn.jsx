import { useNavigate } from "react-router-dom";
import { ChevronLeft, Headphones } from "lucide-react";
import { useEffect, useState } from "react";
import { getCheckIndata } from "../services/authService";
import GameLoader from "./LoaderComponet"

export default function WeeklySignIn() {
  const navigate = useNavigate();
  const [checkIndata, setcheckIndata] = useState(null);
  const [lodaing, setLoading] = useState(false);


  useEffect(() => {

    loadData();
  }, []);

  const loadData = async () => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    await fetchChecinData(parsedUser?.id || null);
  };

  const fetchChecinData = async (userId) => {
    try {
      setLoading(true);
      const payload = userId ? { id: userId } : {};
      const res = await getCheckIndata(payload);
      if (res?.success) {
        setcheckIndata(res.data);
      }
    } catch (err) {
      console.log("API Error:", err);
    }
    finally {
      setLoading(false);
    }
  };
  
  const days = checkIndata?.days || [];
  const tasks = checkIndata?.tasks || [];
  const rules = checkIndata?.rules || [];

  if (lodaing) {
    return <GameLoader />
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">

      {/* Header */}
      <div className="fixed top-0 left-0 w-full max-w-[430px] mx-auto right-0 z-50 flex items-center justify-between px-4 py-4 bg-white shadow">
        <ChevronLeft onClick={() => navigate(-1)} className="cursor-pointer" />
        <span className="font-semibold">Check in</span>
        <Headphones
          onClick={() => navigate("/CustomerSupport")}
          className="cursor-pointer"
        />
      </div>

      <div className="flex-1 overflow-y-auto pt-[70px] pb-6">

        {/* Banner */}
        <div className="mx-3 mt-3 p-4 rounded-xl text-white bg-gradient-to-r from-orange-400 to-red-400">
          <h2 className="text-lg font-bold">7-Day Check-In</h2>
          <p className="text-xs mt-1">
            Check In Consecutively To Get Wonderful Gifts
          </p>
        </div>

        {/* VIP */}
        <div className="bg-white mx-3 mt-3 p-3 rounded-xl shadow-sm">
          <p className="font-semibold text-sm">
            {checkIndata?.vip_bonus_text || "VIP Bonus: 0%"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            The higher your level, the more generous the rewards
          </p>
        </div>

        {/* Streak */}
        <p className="mx-3 mt-3 font-semibold text-sm">
          {checkIndata?.streak_text || "Checked in for 0 days"}
        </p>

        {/* Days Grid */}
        <div className="grid grid-cols-3 gap-3 p-3">
          {days.map((item, i) =>
            item.day === 7 ? (
              <div
                key={i}
                className="col-span-3 bg-orange-100 rounded-xl p-4 text-center shadow"
              >
                <p className="text-xs font-semibold">{item.label}</p>
                <p className="font-bold text-lg mt-1">₹{item.reward}</p>

                {item.status === "locked" && (
                  <button className="mt-2 bg-gray-300 px-4 py-1 rounded-full text-sm">
                    🔒
                  </button>
                )}

                {item.status === "available" && (
                  <button className="mt-2 bg-orange-400 text-white px-4 py-1 rounded-full text-sm">
                    {item.is_today ? "Check In" : "Available"}
                  </button>
                )}

                {item.status === "claimed" && (
                  <span className="text-green-600 text-sm mt-2 block">
                    ✓ Claimed
                  </span>
                )}
              </div>
            ) : (
              <div
              onClick={() => item.status === "available" && navigate('/payRecharge')}
                key={i}
                className={`rounded-xl p-3 text-center shadow ${item.status === "available"
                  ? "bg-orange-100"
                  : "bg-white"
                  }`}
              >
                <p className="text-xs font-semibold">{item.label}</p>
                <p className="font-bold mt-1">₹{item.reward}</p>

                {item.status === "expired" && (
                  <span className="text-xs text-gray-400">Expired</span>
                )}

                {item.status === "available" && (
                  <button onClick={() => navigate('/payRecharge')} className="mt-1 bg-orange-500 text-white px-3 py-1 rounded-full text-xs">
                    {item.is_today ? "Check In" : "Available"}
                  </button>
                )}

                {item.status === "locked" && (
                  <button className="mt-1 bg-gray-300 px-3 py-1 rounded-full text-xs">
                    🔒
                  </button>
                )}

                {item.status === "claimed" && (
                  <span className="text-green-600 text-xs">✓</span>
                )}
              </div>
            )
          )}
        </div>
        <div className="bg-white mx-3 mt-3 p-3 rounded-xl shadow-sm">
          <p className="font-semibold mb-2">Today's Tasks</p>
          {tasks?.map((task, i) => (
            <div
              key={i}
              onClick={() => navigate(`/${task.route}`)}
              className="flex justify-between items-center py-2 border-b last:border-none cursor-pointer"
            >
              <span className="text-sm">
                {task.label}: {task.display}
              </span>

              <button
                className={`px-3 py-1 rounded-full text-xs ${task.completed
                  ? "bg-gray-300"
                  : "bg-green-500 text-white"
                  }`}
              >
                {task.completed ? "Completed" : "Complete Now"}
              </button>
            </div>
          ))}
        </div>

        {/* Rules */}
        <div className="bg-white mx-3 mt-3 p-3 rounded-xl shadow-sm text-xs text-gray-600 leading-5">
          <p className="font-semibold mb-2">Event Rules</p>
          {rules.map((rule, i) => (
            <p key={i}>• {rule}</p>
          ))}
        </div>

      </div>
    </div>
  );
}