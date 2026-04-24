import React, { useEffect, useRef, useState } from "react";
import { getSpinDetails, getBuySpin, getSpinResultData } from "../services/authService";
import luckywheel from "../assets/luckywheel.png"
import WinToast from "./WinToastScreen";

export default function LuckySpinModal({ show, onClose }) {
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [buyLoading, setBuyLoading] = useState(null);
    const spinAudioRef = useRef(null);
    const resultAudioRef = useRef(null);

    useEffect(() => {
        spinAudioRef.current = new Audio("/sounds/spinwheel.mp3");
        spinAudioRef.current.loop = true; // 🔥 continuous spinning sound
        resultAudioRef.current = new Audio("/sounds/resultAudio.mp3");
    }, []);
    // resultAudio.mp3
    const [winToast, setWinToast] = useState({
        show: false,
        amount: [],
        totalamount: 0,
    });
    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [show]);
    const [confirm, setConfirm] = useState({
        show: false,
        message: "",
        onConfirm: null,
    });
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });
    const openConfirm = (message, callback) => {
        setConfirm({
            show: true,
            message,
            onConfirm: callback,
        });
    };
    const handleConfirm = () => {
        confirm.onConfirm && confirm.onConfirm();
        setConfirm({ show: false, message: "", onConfirm: null });
    };
    const handleCancel = () => {
        setConfirm({ show: false, message: "", onConfirm: null });
    };
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast((prev) => ({ ...prev, show: false }));
        }, 2500);
    };
    const [spinData, setSpinData] = useState({
        isSpinning: false,
        rotation: 0, result: null,
        activeTab: "winners", rewards: [], bigWinners: [],
        mySpins: [],
    });
    const getResuktData = async (count) => {
        try {
            const res = await getSpinResultData({
                user_id: JSON.parse(localStorage.getItem("user"))?.id,
                spin_count: count == "BULK" ? 30 : 1,
            });
            if (res?.success) {
                const winAmount = res.results;
                setApiData((prev) => ({
                    ...prev,
                    wallet_balance: res.wallet,
                    free_spins: res.free_spins,
                    spin_balance: res.spins_left,

                }));
                setSpinData((prev) => ({
                    ...prev,
                    result: { value: winAmount },
                    mySpins: [
                        { amount: winAmount },
                        ...prev.mySpins.slice(0, 4),
                    ],
                }));
                if (resultAudioRef.current) {
                    resultAudioRef.current.currentTime = 0;
                    resultAudioRef.current.play().catch(() => { });
                }
                setWinToast({
                    show: true,
                    amounts: res.results, // wrap in array
                    totalamount: res?.total_win,
                });
                setTimeout(() => {
                    setWinToast({ show: false, amount: [] });
                }, 15000);
            }
        } catch (err) {
            console.log(err);
            showToast("Spin failed", "error");
        }
    };

    useEffect(() => {
        if (show) getRechargDetails();
    }, [show]);

    const getRechargDetails = async () => {
        setLoading(true);
        try {
            const res = await getSpinDetails({
                user_id: JSON.parse(localStorage.getItem("user"))?.id,
            });

            if (res?.success) {
                const data = res.data;
                setApiData(data);
                setSpinData((prev) => ({
                    ...prev,
                    rewards: data.rewards.map((r) => ({
                        label: r.amount,
                        value: Number(r.amount),
                        color: r.color,
                    })),
                    bigWinners: data.bigWinners || [],
                    mySpins: data.mySpins || [],
                }));
                if (!data?.can_spin) {
                    showToast("No spins available", "error");
                    openConfirm("You're out of spins! 🎯 Continue playing by purchasing more spins?", () => {
                    });
                    setTimeout(() => {
                    }, 2000);
                }
            }
        } catch (err) {
            console.log(err);
            showToast("Failed to load data", "error");
        } finally {
            setLoading(false);
        }
    };
    if (!show) return null;
    const slice = 360 / (spinData.rewards.length || 1);
    const gradient = `conic-gradient(
        ${spinData.rewards
            .map(
                (r, i) =>
                    `${r.color} ${i * slice}deg ${(i + 1) * slice}deg`
            )
            .join(",")}
    )`;

    const spinWheel = (count) => {
        getRechargDetails()
        if (spinData.isSpinning || !apiData?.can_spin) {
            showToast("No spins available", "error");
            return;
        }
        // 🔊 START SPIN SOUND
        if (spinAudioRef.current) {
            spinAudioRef.current.currentTime = 0;
            spinAudioRef.current.play().catch(() => { });
        }
        const index = Math.floor(Math.random() * spinData.rewards.length);
        const stopAngle = 360 - (index * slice + slice / 2);
        const spins = 360 * (6 + Math.random() * 3);
        const finalRotation = spinData.rotation + spins + stopAngle;
        setSpinData((prev) => ({
            ...prev,
            isSpinning: true,
            result: null,
            rotation: finalRotation,
        }));

        setTimeout(async () => {
            setSpinData((prev) => ({
                ...prev,
                isSpinning: false,
            }));
            if (spinAudioRef.current) {
                spinAudioRef.current.pause();
                spinAudioRef.current.currentTime = 0;
            }

            // 🔥 CALL API AFTER SPIN
            await getResuktData(count);

            // 🎉 OPTIONAL WIN SOUND
            const winAudio = new Audio("/sounds/win.mp3");
            winAudio.play().catch(() => { });

        }, 4500);
    };

    const handleBuySpin = async (type) => {
        setBuyLoading(type);
        try {
            const res = await getBuySpin({
                user_id: JSON.parse(localStorage.getItem("user"))?.id,
                pack: type,
            });
            if (res?.success) {
                // showToast("Spins added", "success");
                await getRechargDetails();
            }
        } catch (err) {
            console.log(err);
            showToast("Error purchasing spin", "error");
        } finally {
            setBuyLoading(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
            {loading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}


            {toast.show && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 animate-[slideDown_0.4s_ease]">
                    <div
                        className={`px-6 py-3 rounded-2xl text-white font-bold shadow-2xl transform transition-all duration-300 scale-100
                        ${toast.type === "win"
                                ? "bg-gradient-to-r from-green-400 to-green-600 animate-pulse shadow-green-500/50"
                                : toast.type === "error"
                                    ? "bg-gradient-to-r from-red-400 to-red-600"
                                    : "bg-gradient-to-r from-blue-400 to-blue-600"
                            }`}
                    >
                        {toast.message}
                    </div>
                </div>
            )}
            {
                confirm.show &&
                (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-5 w-[300px] text-center shadow-xl">
                            <h3 className="text-lg font-bold mb-3">Confirm</h3>
                            <p className="text-sm mb-4">{confirm.message}</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 bg-gray-300 py-2 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="flex-1 bg-green-500 text-white py-2 rounded-lg"
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            <WinToast
                winToast={winToast}
                show={winToast?.show}
                amounts={winToast?.amount}
                totalamount={winToast.totalamount}
                onClose={() => setWinToast({ show: false, amounts: [] })}
            />
            <div className="w-[350px] relative h-[600px] bottom-8">
                <button
                    onClick={onClose}
                    className="absolute right-2 top-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 font-bold z-40"
                >
                    ✕
                </button>
                <div className="bg-gradient-to-b from-yellow-700 to-brown-500 rounded-3xl p-4 text-center shadow-2xl ">
                    <h2 className="text-yellow-300 text-lg font-bold">🎉 LUCKY SPIN</h2>
                    <div className="text-sm text-white mt-1">
                        <span>💰 ₹{apiData?.wallet_balance ?? 0}</span>
                        {
                            apiData?.free_spins &&
                            <>
                                <span> | </span>
                                <span>🎰 Free {apiData?.free_spins ?? 0}</span>
                            </>
                        }
                    </div>
                    <img
                        src={luckywheel}
                        alt="Lucky Wheel"
                        className="h-61 w-62  absolute left-13 top-17 z-1"
                    />
                    <div className="relative w-56 h-56 mx-auto mt-2 mb-4">
                        <div
                            className="w-full h-full rounded-full border-[10px] border-yellow-400"
                            style={{
                                background: gradient,
                                transform: `rotate(${spinData.rotation}deg)`,
                                transition: spinData.isSpinning
                                    ? "transform 4.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                                    : "none",
                            }}
                        >
                            {spinData?.rewards.map((item, i) => {
                                const angle = slice * i + slice / 2;
                                return (
                                    <div
                                        key={i}
                                        className="absolute left-22 top-22 flex items-center justify-center"
                                        style={{
                                            transform: `rotate(${angle}deg) translateY(-80px)`,
                                            transformOrigin: "center",
                                        }}
                                    >
                                        <div
                                            className="text-white font-bold text-[12px]"
                                            style={{
                                                transform: `rotate(-${5}deg)`,
                                                textShadow: "0px 2px 4px rgba(0,0,0,0.8)",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            ₹{item?.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            //   onClick={() => openConfirm("Start 1 spins?", () => spinWheel("SINGLE"))}
                            onClick={() =>
                                openConfirm(
                                    apiData?.free_spins
                                        ? "Do you want to Free spin ?"
                                        : "No spins left. Continue by purchasing?",
                                    () => spinWheel('FREE')
                                )
                            }
                            disabled={spinData.isSpinning}
                            className="absolute inset-0 m-auto w-16 h-16 bg-yellow-400 rounded-full text-red-600 font-bold border-4 border-orange-500 z-10 text-sm"
                        >
                            {spinData?.isSpinning ? "..." : "GO"}
                        </button>
                        {!apiData?.can_spin && (
                            <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white z-20">
                                <p className="font-bold text-lg">No Spins Available</p>
                                <p className="text-sm opacity-80 mt-1">
                                    Purchase spins to continue
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-5 mt-8  mb-8">
                        <button
                            onClick={() => openConfirm("Start 1 spins?", () => spinWheel("SINGLE"))}
                            className="flex-1 bg-green-500 py-1 rounded-full text-white font-bold"
                        >
                            {buyLoading === "SINGLE" ? "..." : "x1"}
                            <div className="text-[9px]">Spin</div>
                        </button>
                        <button
                            onClick={() => openConfirm("Start 30 spins?", () => spinWheel("BULK"))}
                            className="flex-1 bg-blue-500 py-2 rounded-full text-white font-bold"
                        >
                            {buyLoading === "BULK" ? "..." : "x30"}
                            <div className="text-[9px]">Spin x300</div>
                        </button>
                    </div>
                    <div className="mt-4 bg-red-600 rounded-xl overflow-hidden text-white text-sm">
                        <div className="flex">
                            <div onClick={() => setSpinData(p => ({ ...p, activeTab: "winners" }))} className={`flex-1 py-2 ${spinData.activeTab === "winners" ? "bg-red-800" : ""}`}>Big Winners</div>
                            <div onClick={() => setSpinData(p => ({ ...p, activeTab: "my" }))} className={`flex-1 py-2 ${spinData.activeTab === "my" ? "bg-yellow-400 text-black" : ""}`}>My Spin</div>
                        </div>

                        <div className="max-h-32 overflow-y-auto px-3 py-2 space-y-1">
                            {spinData.activeTab === "winners" &&
                                spinData.bigWinners.map((item, i) => (
                                    <div key={i} className="flex justify-between">
                                        <span>{item.user}</span>
                                        <span>₹{item.amount}</span>
                                    </div>
                                ))}
                            {spinData.activeTab === "my" &&
                                spinData?.mySpins.map((item, i) => {
                                    const isPaid = item.type === "PAID";
                                    return (
                                        <div
                                            key={i}
                                            className="flex justify-between items-center border-b py-2 text-sm"
                                        >
                                            <div>
                                                <p className="font-semibold">
                                                    {isPaid ? "💰 Paid Spin" : "🎁 Free Spin"}
                                                </p>
                                                {isPaid && (
                                                    <p className="text-xs">
                                                        {item?.buy_text}
                                                    </p>
                                                )}
                                                <p className="text-white-600">{item.win_text}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs mt-1">
                                                    {item?.date}
                                                </p>
                                                <p
                                                    className={`font-bold ${item.win > 0 ? "text-WHITE-500" : "text-red-500"
                                                        } `}
                                                >
                                                    ₹{item.win}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}