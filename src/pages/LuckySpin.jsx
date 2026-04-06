import React, { useState } from "react";

export default function LuckySpinModal({ show, onClose }) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState(null);

    // ✅ NEW STATES
    const [activeTab, setActiveTab] = useState("winners");
    const [bigWinners, setBigWinners] = useState([
        { user: "888****888", amount: 201 },
        { user: "811****011", amount: 10 },
        { user: "911****324", amount: 10 },
        { user: "888****888", amount: 100 },
    ]);

    const [mySpins, setMySpins] = useState([]);

    if (!show) return null;

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

    const spinWheel = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setResult(null);

        const index = Math.floor(Math.random() * rewards.length);
        const degreePerItem = 360 / rewards.length;

        const stopAngle =
            360 - (index * degreePerItem + degreePerItem / 2);

        const extraSpins = 360 * 5;
        const final = rotation + extraSpins + stopAngle;

        setRotation(final);

        setTimeout(() => {
            setIsSpinning(false);
            const win = rewards[index];

            setResult(win);

            // ✅ UPDATE MY SPINS LIST
            setMySpins((prev) => [
                { amount: win.value },
                ...prev.slice(0, 4),
            ]);

        }, 4000);
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="relative w-[340px]">

                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center text-lg z-50"
                >
                    ✕
                </button>

                <div className="bg-gradient-to-b from-purple-700 to-purple-500 rounded-3xl pt-6 pb-4 px-3 text-center shadow-2xl">

                    {/* TITLE */}
                    <div className="text-yellow-300 font-extrabold text-xl mb-2">
                        🎉 LUCKY SPIN 🎉
                    </div>

                    {/* POINTER */}
                    <div className="w-0 h-0 mx-auto mb-[-10px] border-l-[10px] border-r-[10px] border-b-[18px] border-l-transparent border-r-transparent border-b-yellow-400"></div>

                    {/* 🎡 WHEEL */}
                    <div className="relative mx-auto w-64 h-64 flex items-center justify-center">
                        <div
                            className="w-full h-full rounded-full border-[10px] border-yellow-400 bg-green-700 flex items-center justify-center"
                            style={{
                                transform: `rotate(${rotation}deg)`,
                                transition: isSpinning
                                    ? "transform 4s cubic-bezier(0.17, 0.67, 0.83, 0.67)"
                                    : "none",
                            }}
                        >
                            {rewards.map((item, i) => (
                                <div
                                    key={i}
                                    className="absolute text-white text-xs font-bold"
                                    style={{
                                        transform: `rotate(${i * 45}deg) translateY(-110px) rotate(-${i * 45}deg)`
                                    }}
                                >
                                    {item.label}
                                </div>
                            ))}
                        </div>

                        {/* CENTER */}
                        <button
                            onClick={spinWheel}
                            disabled={isSpinning}
                            className="absolute w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-red-600 font-bold text-lg shadow-lg border-4 border-orange-500"
                        >
                            {isSpinning ? "..." : "GO"}
                        </button>
                    </div>

                    {/* RESULT */}
                    {result && (
                        <div className="mt-3 bg-green-500 text-white py-2 rounded-lg font-bold">
                            🎉 You Won ₹{result.value}
                        </div>
                    )}

                    {/* BUTTONS */}
                    <div className="flex gap-2 mt-4 px-2">
                        <button
                            onClick={spinWheel}
                            disabled={isSpinning}
                            className="flex-1 bg-green-500 text-white py-2 rounded-full text-sm font-bold shadow"
                        >
                            x10
                            <div className="text-[10px] font-normal">Free(3)</div>
                        </button>

                        <button className="flex-1 bg-blue-500 text-white py-2 rounded-full text-sm font-bold shadow">
                            x300
                            <div className="text-[10px] font-normal">SPINx30</div>
                        </button>
                    </div>
                    <div className="mt-4 bg-red-700 rounded-2xl text-white text-xs overflow-hidden">
                        <div className="flex">
                            <div
                                onClick={() => setActiveTab("winners")}
                                className={`flex-1 py-2 ${activeTab === "winners"
                                    ? "bg-red-800"
                                    : "bg-red-700"
                                    }`}
                            >
                                Big Winners
                            </div>
                            <div
                                onClick={() => setActiveTab("my")}
                                className={`flex-1 py-2 ${activeTab === "my"
                                    ? "bg-orange-400 text-black font-bold"
                                    : "bg-red-700"
                                    }`}
                            >
                                My Spin
                            </div>
                        </div>
                        <div className="px-4 py-3 space-y-1 max-h-28 overflow-y-auto">

                            {activeTab === "winners" &&
                                bigWinners.map((item, i) => (
                                    <div key={i} className="flex justify-between">
                                        <span>{item.user}</span>
                                        <span>Won ₹{item.amount}</span>
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