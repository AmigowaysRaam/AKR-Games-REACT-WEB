import React, { useState } from "react";

export default function LuckySpinModal({ show, onClose }) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState("winners");

    const rewards = [
        { label: "50", value: 50, color: "#ff4d4d" },
        { label: "1", value: 1, color: "#ffd93d" },
        { label: "5000", value: 5000, color: "#4cd137" },
        { label: "5", value: 5, color: "#3498db" },
        { label: "1000", value: 1000, color: "#9b59b6" },
        { label: "200", value: 200, color: "#1abc9c" },
        { label: "10", value: 10, color: "#e67e22" },
        { label: "100", value: 100, color: "#00cec9" },
    ];

    const [bigWinners] = useState([
        { user: "888****888", amount: 201 },
        { user: "811****011", amount: 10 },
        { user: "911****324", amount: 10 },
        { user: "888****888", amount: 100 },
    ]);

    const [mySpins, setMySpins] = useState([]);

    if (!show) return null;

    const slice = 360 / rewards.length;

    // 🎨 Perfect circular gradient
    const gradient = `conic-gradient(
    ${rewards
            .map(
                (r, i) =>
                    `${r.color} ${i * slice}deg ${(i + 1) * slice}deg`
            )
            .join(",")}
  )`;

    const spinWheel = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setResult(null);
        const index = Math.floor(Math.random() * rewards.length);
        const stopAngle = 360 - (index * slice + slice / 2);
        const spins = 360 * (5 + Math.random() * 2);
        const finalRotation = rotation + spins + stopAngle;
        setRotation(finalRotation);
        setTimeout(() => {
            const win = rewards[index];
            setResult(win);
            setIsSpinning(false);

            setMySpins((prev) => [
                { amount: win.value },
                ...prev.slice(0, 4),
            ]);
        }, 4200);
    };

    return (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50">
            <div className="w-[390px] relative h-[700px]">

                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="absolute right-2 top-2 w-8 h-8 bg-white rounded-full z-50"
                >
                    ✕
                </button>

                <div className="bg-gradient-to-b from-yellow-700 to-brown-500 rounded-3xl p-4 text-center shadow-2xl">

                    {/* TITLE */}
                    <h2 className="text-yellow-300 text-xl font-bold">
                        🎉 LUCKY SPIN
                    </h2>

                    {/* POINTER */}
                    <div className="w-0 h-0 mx-auto mt-2 border-l-[12px] border-r-[12px] border-b-[20px] border-transparent border-b-yellow-400"></div>

                    {/* 🎡 WHEEL */}
                    <div className="relative w-72 h-72 mx-auto mt-3">

                        <div
                            className="w-full h-full rounded-full border-[10px] border-yellow-400 shadow-[0_0_30px_rgba(255,215,0,0.7)]"
                            style={{
                                background: gradient,
                                transform: `rotate(${rotation}deg)`,
                                transition: isSpinning
                                    ? "transform 4.2s cubic-bezier(0.12, 0.8, 0.32, 1)"
                                    : "none",
                            }}
                        >
                            {/* Labels */}
                            {rewards.map((item, i) => {
                                const angle = slice * i + slice / 2;

                                return (
                                    <div
                                        key={i}
                                        className="absolute left-1/2 top-1/2 text-white text-xs font-bold"
                                        style={{
                                            transform: `
                        rotate(${angle}deg)
                        translateY(-120px)
                        rotate(-${angle}deg)
                      `,
                                        }}
                                    >
                                        ₹{item.label}
                                    </div>
                                );
                            })}
                        </div>

                        {/* CENTER BUTTON */}
                        <button
                            onClick={spinWheel}
                            disabled={isSpinning}
                            className="absolute inset-0 m-auto w-20 h-20 bg-yellow-400 rounded-full text-red-600 font-bold shadow-xl border-4 border-orange-500"
                        >
                            {isSpinning ? "..." : "GO"}
                        </button>
                    </div>

                    {/* RESULT */}
                    {result && (
                        <div className="mt-3 bg-green-500 py-2 rounded-lg text-white font-bold animate-bounce">
                            🎉 You Won ₹{result.value}
                        </div>
                    )}

                    {/* BUTTONS */}
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={spinWheel}
                            className="flex-1 bg-green-500 py-2 rounded-full text-white font-bold"
                        >
                            x10
                            <div className="text-[10px]">Free(3)</div>
                        </button>

                        <button className="flex-1 bg-blue-500 py-2 rounded-full text-white font-bold">
                            x300
                            <div className="text-[10px]">SPINx30</div>
                        </button>
                    </div>

                    {/* TABS */}
                    <div className="mt-4 bg-red-700 rounded-xl text-white text-xs overflow-hidden">
                        <div className="flex">
                            <div
                                onClick={() => setActiveTab("winners")}
                                className={`flex-1 py-2 ${activeTab === "winners" ? "bg-red-800" : ""}`}
                            >
                                Big Winners
                            </div>
                            <div
                                onClick={() => setActiveTab("my")}
                                className={`flex-1 py-2 ${activeTab === "my" ? "bg-yellow-400 text-black font-bold" : ""}`}
                            >
                                My Spin
                            </div>
                        </div>

                        <div className="px-3 py-2 max-h-28 overflow-y-auto">
                            {activeTab === "winners" &&
                                bigWinners.map((item, i) => (
                                    <div key={i} className="flex justify-between">
                                        <span>{item.user}</span>
                                        <span>₹{item.amount}</span>
                                    </div>
                                ))}
                            {activeTab === "my" &&
                                (mySpins.length ? (
                                    mySpins.map((item, i) => (
                                        <div key={i} className="flex justify-between">
                                            <span>Spin {i + 1}</span>
                                            <span>₹{item.amount}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-300">
                                        No spins yet
                                    </div>
                                ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}