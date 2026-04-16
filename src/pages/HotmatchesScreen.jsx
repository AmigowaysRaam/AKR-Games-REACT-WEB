import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function HotmatchesScreen() {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("home");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // future API binding
  }, []);

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 bg-white sticky top-0 z-10 border-b">
        <ChevronLeft
          onClick={() => navigate(-1)}
          className="cursor-pointer active:scale-90 transition"
        />
        <h1 className="font-semibold text-lg">Sports</h1>
        <div className="w-5" />
      </div>

      {/* TABS */}
      <div className="px-4 mt-3">
        <div className="flex bg-gray-200 rounded-full p-1 text-sm">
          {["Home", "Live", "Pre-match"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`flex-1 py-1 rounded-full transition ${
                selectedTab === tab
                  ? "bg-white shadow text-black"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex gap-2 px-4 mt-3 overflow-x-auto">
        <div className="px-3 py-1 bg-white rounded-full shadow text-sm">
          ⭐ Favorites
        </div>
        <div className="px-3 py-1 bg-white rounded-full shadow text-sm">
          ⚔️ All events
        </div>
        <div className="px-3 py-1 bg-white rounded-full shadow text-sm">
          🧾 My Bets
        </div>
      </div>

      {/* MAIN MATCH CARD */}
      <div className="px-4 mt-4">
        <div className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-blue-700 to-red-600 text-white p-4 relative">
          
          <div className="flex justify-between items-center">
            <span className="text-xs opacity-80">TODAY, 19:30</span>
          </div>

          <div className="mt-2 font-semibold text-lg leading-tight">
            Royal Challengers Bengaluru × <br />
            Lucknow Super Giants
          </div>

          <div className="text-xs mt-1 opacity-80">Premier League</div>

          {/* ODDS */}
          <div className="flex gap-3 mt-4">
            <div className="flex-1 bg-white text-black rounded-xl py-2 text-center">
              <div className="text-purple-600 font-bold">1.57</div>
              <div className="text-xs">1</div>
            </div>
            <div className="flex-1 bg-white text-black rounded-xl py-2 text-center">
              <div className="text-purple-600 font-bold">2.41</div>
              <div className="text-xs">2</div>
            </div>
          </div>
        </div>
      </div>

      {/* HIGHLIGHTS */}
      <div className="px-4 mt-5">
        <div className="flex items-center gap-2 font-semibold">
          🔥 Highlights
          <span className="text-xs bg-red-100 text-red-500 px-2 py-[2px] rounded-full">
            Live
          </span>
        </div>

        <div className="mt-3 bg-white rounded-xl p-3 shadow">
          <div className="text-xs text-gray-500">
            Cricket. Great Britain. Women. Metro Bank
          </div>

          <div className="flex justify-between items-center mt-2">
            <div className="text-sm font-medium">Warwickshire (w)</div>
            <div className="text-sm font-medium">Hampshire (w)</div>
          </div>

          <div className="text-center text-lg font-bold mt-2">
            209:0
          </div>

          <div className="flex gap-3 mt-3">
            <div className="flex-1 bg-gray-100 rounded-lg py-2 text-center">
              <div className="text-purple-600 font-semibold">1.18</div>
              <div className="text-xs">1</div>
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg py-2 text-center">
              <div className="text-purple-600 font-semibold">4.51</div>
              <div className="text-xs">2</div>
            </div>
          </div>
        </div>
      </div>

      {/* PREMIER LEAGUE SECTION */}
      <div className="px-4 mt-5 pb-6">
        <div className="font-semibold flex items-center gap-2">
          🏆 Premier League
        </div>

        <div className="mt-3 bg-white rounded-xl p-4 shadow text-center text-gray-500">
          More matches coming soon...
        </div>
      </div>
      <style>
        {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(15px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}