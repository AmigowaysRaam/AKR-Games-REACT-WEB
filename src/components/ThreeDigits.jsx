import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ThreeDigits({ items = [] }) {
  const [timers, setTimers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const initialTimers = items.map(
      () => Math.floor(Math.random() * 3600) // up to 60 mins
    );
    setTimers(initialTimers);
  }, [items]);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) =>
        prev.map((t) => (t > 0 ? t - 1 : 0))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!items.length) return null;

  return (
    <div className="px-3 py-3">
      {/* <h2 className="text-lg font-semibold mb-3">🎲 3 Digit Game</h2> */}
      <div className="grid grid-cols-2 gap-3" >
        {items.map((item, index) => {
          const time = timers[index] || 0;
          const minutes = String(Math.floor(time / 60)).padStart(2, "0");
          const seconds = String(time % 60).padStart(2, "0");

          return (
            <div
              onClick={() => navigate('/threedigit')}
              key={item.id}
              className="rounded-lg overflow-hidden bg-white shadow-sm"
            >
              {/* CARD IMAGE */}
              <div
                className="relative h-35 text-white flex flex-col justify-between p-2"
                style={{
                  backgroundImage: `url(${item.img})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                }}
              >
                {/* DARK OVERLAY */}
                {/* <div className="absolute inset-0 bg-black/30" /> */}

                {/* TOP CONTENT */}
                <div className="relative z-10">
                  <p className="text-[11px] font-semibold">{item.title}</p>

                  {/* <p className="text-[11px] mt-1">WIN PRIZE</p> */}
                  <p className="text-lg font-bold">₹{item.prize}</p>
                </div>

                {/* TIMER */}
                <div className="relative z-10">
                  <p className="text-[10px]">
                    Time for Next Booking
                  </p>

                  <div className="flex gap-1 mt-1">
                    <span className="bg-black px-1.5 py-[2px] text-xs rounded">
                      {minutes}
                    </span>
                    <span className="bg-black px-1.5 py-[2px] text-xs rounded">
                      {seconds}
                    </span>
                  </div>
                </div>
              </div>

              {/* PRICE */}
              <div className="px-2 py-2">
                <p className="text-sm font-semibold">
                  ₹{item.price}
                  <span className="text-xs text-gray-500 ml-1">
                    /Ticket
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}