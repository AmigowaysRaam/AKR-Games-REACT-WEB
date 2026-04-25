import React, { useEffect, useState, useRef } from "react";
import { getPromoList } from "../services/authService";
import GameLoader from "./LoaderComponet";
import { useNavigate } from "react-router-dom";

export default function PromoList() {
    const [promoList, setPromoList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userDta, setuserDta] = useState(null);

    const startY = useRef(0);
    const pullDistance = useRef(0);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const storedUser = localStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        setuserDta(parsedUser);
        await fetchHistory(parsedUser?.id || null);
    };

    const handleNavigate = (item) => {
        if (!userDta) {
            navigate("/login");
            return;
        }

        if (item.key === "3-digit-bet" || item.key === "agent-promotion" || item.key === "purchase-cumulate-amount") {
            navigate("/eventdetails", { state: { item } });
        } else if (item.key === "refer-promotion") {
            navigate("/earn");
        } else if (item.key === "withdraw") {
            navigate("/WithdrawScreen");
        } else if (item.key.includes("recharge")) {
            navigate("/payRecharge");
        } else if (item.key === "weekly-sign") {
            navigate("/weeklysignup");
        } else if (item.key.includes("rank")) {
            navigate("/jackPotScreen");
        } else if (item.key.includes("promotion")) {
            navigate("/recharge");
        }
    };

    const fetchHistory = async (userId) => {
        try {
            const payload = userId ? { id: userId, user_id: userId } : {};
            const res = await getPromoList(payload);
            if (res?.data) setPromoList(res.data);
        } catch (err) {
            console.log("API Error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleTouchStart = (e) => {
        startY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
        const currentY = e.touches[0].clientY;
        pullDistance.current = currentY - startY.current;
    };

    const handleTouchEnd = () => {
        if (pullDistance.current > 80) {
            setRefreshing(true);
            loadData();
        }
        pullDistance.current = 0;
    };

    return (
        <>
            <style>
                {`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                `}
            </style>

            <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="w-full max-w-[900px] mx-auto px-3 sm:px-4 md:px-6 pb-28"
            >
                {refreshing && (
                    <div className="text-center mb-2 text-sm text-gray-500">
                        Refreshing...
                    </div>
                )}

                {loading ? (
                    <GameLoader />
                ) : promoList.length === 0 ? (
                    <div className="text-center text-gray-500">
                        No Promotions Available
                    </div>
                ) : (
                    promoList.map((item, i) => (
                        <div
                            key={item.id}
                            onClick={() => handleNavigate(item)}
                            className="relative w-full rounded-2xl overflow-hidden mb-4 cursor-pointer shadow-md hover:shadow-lg transition"
                            style={{
                                aspectRatio: "16 / 9", // 🔥 responsive height
                                animation: "fadeInUp 0.4s ease forwards",
                                animationDelay: `${i * 100}ms`,
                                opacity: 0,
                            }}
                        >
                            <div
                                className="absolute inset-0"
                                style={{
                                    backgroundImage: `url(${item.image})`,
                                    backgroundPosition: "center",
                                    backgroundSize: "cover", // ✅ FIXED
                                    backgroundRepeat: "no-repeat",
                                }}
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/20" />

                            {/* Content */}
                            <div className="relative h-full flex flex-col justify-between p-2 sm:p-4">
                                <div className="bg-white/90 text-black text-[8px] sm:text-sm font-semibold px-1 py-[2px] rounded-[2px] w-fit uppercase">
                                    {item.key}
                                </div>
                                <div className="flex justify-end">
                                    <div className="bg-white text-purple-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold animate-pulse">
                                        {item?.button_name || "Join to win"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}