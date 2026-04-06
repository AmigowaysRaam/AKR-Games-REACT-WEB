import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function StateLottery({ items = [] }) {

  const navigate =useNavigate();
  useEffect(() => {
    // console.log("State Lottery Items:", items);
    console.log("ids->",items)
  }, [items]);

  if (!items.length) return null;

  const times = [
    "Mar 30th 12:57",
    "Mar 30th 14:57",
    "Mar 30th 17:57",
    "Mar 30th 19:57",
    "Mar 31st 14:57",
    "Apr 01st 14:57",
  ];
  return (
    <div className="px-3 py-3">
  <div className="grid grid-cols-3 gap-3">
  {items.map((item, index) => (
    <div
      key={item.id}
      onClick={() => navigate(`/state-lottery/${item.nav}`)} // ✅ FIX HERE
      className="rounded-xl text-white p-2 py-8 shadow-md relative overflow-hidden cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${item.colorCode?.join(",")})`,
      }}
    >
            <div className="flex justify-center mb-1">
              <img
                src={item.img}
                alt="lottery"
                className="h-13 object-contain"
              />
            </div>
            <div
              className="text-center"
              style={{
                textShadow: "0px 2px 6px rgba(0,0,0,0.6)",
              }}
            >
              <h3 className="text-sm font-bold leading-tight">
                ₹9,60,000
              </h3>
              <p className="text-[10px] opacity-90">Jackpot</p>
            </div>
            <div
              className="text-center mt-1"
              style={{
                textShadow: "0px 2px 6px rgba(0,0,0,0.6)",
              }}
            >
              <p className="text-[10px] opacity-80">Next Draw</p>
              <p className="text-[11px] font-medium leading-tight">
                {times[index % times.length]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}