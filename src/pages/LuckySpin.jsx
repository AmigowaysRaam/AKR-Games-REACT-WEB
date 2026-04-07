import React, { useState } from "react";

export default function LuckySpinModal({ show, onClose }) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState(null);

    const [activeTab, setActiveTab] = useState("winners");

    const rewards = [
        { label: "50", value: 50 },
        { label: "1", value: 1 },
        { label: "5000", value: 5000 },
        { label: "5", value: 5 },
        { label: "1000", value: 1000 },
        { label: "200", value: 200 },
        { label: "10", value: 10 },
        { label: "100", value: 100 },
    ];

    const [bigWinners] = useState([
        { user: "888****888", amount: 201 },
        { user: "811****011", amount: 10 },
        { user: "911****324", amount: 10 },
        { user: "888****888", amount: 100 },
    ]);

    const [mySpins, setMySpins] = useState([]);

    if (!show) return null;

    const spinWheel = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setResult(null);

        const index = Math.floor(Math.random() * rewards.length);
        const slice = 360 / rewards.length;

        // 🎯 Stop exactly at center of slice
        const stopAngle = 360 - (index * slice + slice / 2);

        // 🎡 Realistic spin
        const spins = 360 * (5 + Math.random() * 2); // random extra spins
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
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="relative w-[360px]">

                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 bg-white w-8 h-8 rounded-full z-50"
                >
                    ✕
                </button>

                <div className="bg-gradient-to-b from-purple-700 to-purple-500 rounded-3xl p-4 text-center shadow-2xl">

                    {/* TITLE */}
                    <h2 className="text-yellow-300 font-extrabold text-xl">
                        🎉 LUCKY SPIN
                    </h2>

                    {/* POINTER */}
                    <div className="w-0 h-0 mx-auto mt-2 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-yellow-400"></div>

                    {/* 🎡 WHEEL */}
                    <div className="relative w-72 h-72 mx-auto mt-2">

                        {/* WHEEL */}
                        <div
                            className="w-full h-full rounded-full border-[12px] border-yellow-400 bg-gradient-to-br from-green-600 to-green-800"
                            style={{
                                transform: `rotate(${rotation}deg)`,
                                transition: isSpinning
                                    ? "transform 4.2s cubic-bezier(0.12, 0.8, 0.32, 1)"
                                    : "none",
                            }}
                        >
                            {rewards.map((item, i) => {
                                const angle = (360 / rewards.length) * i;

                                return (
                                    <div
                                        key={i}
                                        className="absolute left-1/2 top-1/2 text-white text-xs font-bold"
                                        style={{
                                            transform: `
                                                rotate(${angle}deg)
                                                translateY(-140px)
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
                            className="absolute inset-0 m-auto w-20 h-20 bg-yellow-400 rounded-full text-red-600 font-bold text-lg shadow-xl border-4 border-orange-500"
                        >
                            {isSpinning ? "..." : "GO"}
                        </button>
                    </div>

                    {/* RESULT */}
                    {result && (
                        <div className="mt-3 bg-green-500 py-2 rounded-lg text-white font-bold">
                            🎉 You Won ₹{result.value}
                        </div>
                    )}

                    {/* BUTTONS */}
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={spinWheel}
                            disabled={isSpinning}
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
                                className={`flex-1 py-2 ${activeTab === "my" ? "bg-orange-400 text-black font-bold" : ""}`}
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
                        <div className="flex justify-between px-3 pb-2 text-[10px] text-yellow-300">
                            <span>My Free 3</span>
                            <span>
                                More Free{" "}
                                <span className="bg-yellow-400 text-black px-1 rounded">
                                    VIP
                                </span>
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}