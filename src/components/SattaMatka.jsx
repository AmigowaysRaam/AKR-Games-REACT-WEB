import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SattaMatka({ items = [] }) {
  const [timers, setTimers] = useState([]);
  const navigate =useNavigate();

  useEffect(() => {
    const initialTimers = items.map(() =>
      Math.floor(Math.random() * (60 * 60 * 6))
    );
    setTimers(initialTimers);
   console.log("satta matka", items)
    const interval = setInterval(() => {
      setTimers((prev) => prev.map((t) => (t > 0 ? t - 1 : 0)));
    }, 1000);

    return () => clearInterval(interval);
  }, [items]);

  if (!items.length) return null;

  return (
    <div className="px-3 py-4">
      <div className="grid grid-cols-2 gap-3" >
        {items.map((item, index) => {
          const time = timers[index] || 0;

          const hours = String(Math.floor(time / 3600)).padStart(2, "0");
          const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");

          return (
            <div
              key={item.id}
              className="rounded-sm overflow-hidden shadow-sm bg-white"
              // onClick={()=>navigate(`/matka/${item.id}`)}
            >
              {/* CARD IMAGE */}
              <div
                className="relative h-[150px] flex items-center justify-center text-white"
                style={{
                  backgroundImage: `url(${item.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* 🔴 CLOSED OVERLAY */}
                {item.closed && (
                  <div className="absolute inset-0 bg-black/60 z-10" />
                )}
                {item.closed && (
                  <img
                    src={
                      item.closed ||
                      "https://cdn-icons-png.flaticon.com/512/1828/1828665.png"
                    }
                    alt="closed"
                    className="absolute top-2 right-2 w-10 h-10 z-20"
                  />
                )}

                {/* TITLE */}
                <h3 className="absolute top-3 w-full text-center text-lg font-bold tracking-wide z-20">
                  {item.title}
                </h3>

                {/* RESULT */}
                <div className="z-20 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-sm font-semibold border border-white/40">
                  {item.result || "***-**-***"}
                </div>

                {/* BOTTOM STRIP */}
                <div className="absolute bottom-0 left-0 w-full px-2 py-1 bg-black/40 text-xs flex justify-between z-20">
                  <span>₹{item.bid || "10"}/BID</span>
                  <span>WIN ₹{item.win || "1,00,000"}</span>
                </div>
              </div>

              {/* TIME SECTION */}
              <div className="px-2 py-1 text-[11px] text-gray-600 flex justify-between">
                <div>
                  <p>Open</p>
                  <p className="font-semibold text-gray-800">
                    {item.open || "11:30 AM"}
                  </p>
                </div>
                <div className="text-right">
                  <p>Close</p>
                  <p className="font-semibold text-gray-800">
                    {item.close || "12:30 PM"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}