import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function KeralaLottery({ items = [] }) {
    const [timers, setTimers] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const initialTimers = items.map(() =>
            Math.floor(Math.random() * (60 * 60 * 12)) // up to 12 hrs
        );
        setTimers(initialTimers);
        console.log("kerala lottery", items)

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
            <div className="grid grid-cols-2 gap-3  cursor-pointer" >
                {items.map((item, index) => {

                    const time = timers[index] || 0;
                    const hours = String(Math.floor(time / 3600)).padStart(2, "0");
                    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
                    const seconds = String(time % 60).padStart(2, "0");

                    return (
                        <div
                            key={item.id}
                            onClick={() => navigate(`/kerala-lottery/${item.id}`)}
                            className="rounded-sm overflow-hidden bg-white shadow-sm"
                        >
                            <div
                                className="relative h-[120px] text-white"
                                style={{
                                    backgroundImage: `url(${item.img})`,
                                    backgroundSize: "contain",
                                    backgroundRepeat: "no-repeat"
                                }}
                            >
                                <div className="absolute top-1 left-2 text-[8px] font-semibold bg-black/40 px-2 py-[2px] rounded">
                                    weekly lottery
                                </div>
                                {
                                    item?.number &&
                                    <div className="absolute top-1 right-2 text-[10px] font-semibold text-white">
                                        NO.<br />{item?.number}
                                    </div>
                                }
                            </div>
                            <div className="px-2 py-2 flex justify-between items-center text-xs">
                                <p className="font-semibold text-gray-800">
                                    ₹{item.price}
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