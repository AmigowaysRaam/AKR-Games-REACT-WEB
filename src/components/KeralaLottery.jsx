import { useEffect, useState } from "react";

export default function KeralaLottery({ items = [] }) {
    const [timers, setTimers] = useState([]);

    // ⏱️ Initialize random timers (example: countdown in seconds)
    useEffect(() => {
        const initialTimers = items.map(() =>
            Math.floor(Math.random() * (60 * 60 * 12)) // up to 12 hrs
        );
        setTimers(initialTimers);

        const interval = setInterval(() => {
            setTimers((prev) =>
                prev.map((t) => (t > 0 ? t - 1 : 0))
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [items]);
    if (!items.length) return null;
    return (
        <div className="px-3 py-2">
            <div className="grid grid-cols-2 gap-3">
                {items.map((item, index) => {
                    const time = timers[index] || 0;
                    const hours = String(Math.floor(time / 3600)).padStart(2, "0");
                    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
                    const seconds = String(time % 60).padStart(2, "0");

                    return (
                        <div
                            key={item.id}
                            className="rounded-sm overflow-hidden bg-white shadow-sm"
                        >
                            {/* 🔥 IMAGE SECTION */}
                            <div
                                className="relative h-[140px] text-white"
                                style={{
                                    backgroundImage: `url(${item.img})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                {/* Top Row */}
                                <div className="absolute top-1 left-2 text-[10px] font-semibold bg-black/40 px-2 py-[2px] rounded">
                                    weekly lottery
                                </div>

                                <div className="absolute top-1 right-2 text-[10px] font-semibold text-white">
                                    NO.<br />{item.number || "BT-47"}
                                </div>

                                {/* Bottom Overlay Content */}
                                <div className="absolute bottom-2 left-2">
                                    <p className="text-xs font-semibold">
                                        {/* {item.title || "ONLINE ONLY"} */}
                                    </p>
                                    {/* <p className="text-[11px]">WIN PRIZE</p>
                                    <p className="text-lg font-bold leading-none">
                                        {item.prize || "1.2 Crores"}
                                    </p> */}
                                </div>
                            </div>

                            {/* 💰 BOTTOM SECTION */}
                            <div className="px-2 py-2 flex justify-between items-center text-xs">
                                <p className="font-semibold text-gray-800">
                                    ₹{item.price || "50.00"}
                                </p>

                                <div className="text-right text-gray-500 leading-tight">
                                    <p>{item.drawTime || "Tue 3:00 PM"}</p>
                                    <p className="text-[10px]">
                                        ⏳ {hours}h {minutes}m {seconds}s
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