import React, { useEffect, useState, useRef } from "react";
import { getPromoList } from "../services/authService";
import GameLoader from "./LoaderComponet";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";

export default function PromoList() {
    const [promoList, setPromoList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userDta, setuserDta] = useState(null);


    const startY = useRef(0);
    const pullDistance = useRef(0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const storedUser = localStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        setuserDta(parsedUser);
        await fetchHistory(parsedUser?.id || null);
    };
    const navigate = useNavigate()

    const handleNavigate = (item) => {
        if (!userDta) {
            navigate('/login')
            return;
        }
        if (item.key == 'promotion') {
            navigate('/recharge')
        }
        if (item.key == 'withdraw') {
            navigate('/WithdrawScreen')
        }
        if (item.key == 'recharge') {
            navigate('/payRecharge')
        }
        if (item.key == 'weekly-sign') {
            navigate('/weeklysignup')
        }
        if (item.key === "purchase-cumulate-amount") {
            navigate("/eventdetails", {
                state: { item },   // ✅ correct
            });
        }
    }
    const fetchHistory = async (userId) => {
        try {
            const payload = userId ? { id: userId } : {};
            const res = await getPromoList(payload);
            if (res?.data) setPromoList(res.data);
        } catch (err) {
            console.log("API Error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Pull-to-refresh
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
                style={{ padding: 12, paddingBottom: "25%" }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="cursor-pointer"
            >
                {refreshing && (
                    <div style={{ textAlign: "center", marginBottom: 10 }}>
                        Refreshing...
                    </div>
                )}
                {loading ? (
                    <GameLoader />
                ) : promoList.length === 0 ? (
                    <div>No Promotions Available</div>
                ) : (
                    promoList.map((item, i) => (
                        <div
                            onClick={() => handleNavigate(item)}
                            key={item.id}
                            style={{
                                height: 160,
                                borderRadius: 18,
                                overflow: "hidden",
                                marginBottom: 16,
                                position: "relative",
                                color: "#fff",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                animation: "fadeInUp 0.4s ease forwards",
                                animationDelay: `${i * 100}ms`,
                                opacity: 0,
                            }}
                        >
                            {/* <p className="text-black">{JSON.stringify(item)}</p> */}
                            {/* Background Image */}
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    backgroundImage: `url(${item.image})`,
                                    backgroundPosition: "center",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background:
                                        "linear-gradient(90deg, rgba(120,120,120,0.1), rgba(60,60,60,0.9))",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background:
                                        "linear-gradient(135deg, rgba(123,31,162,0.2), rgba(74,20,140,0.1))",
                                }}
                            />
                            <div
                                style={{
                                    position: "relative",
                                    padding: 14,
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    bottom: 8,
                                    left: -2,
                                }}
                            >
                                <div
                                    style={{
                                        background: "rgba(255,255,255,0.9)",
                                        padding: "4px 10px",
                                        borderRadius: 5,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        width: "fit-content",
                                        color: "#222",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {item.key}
                                </div>
                                <div>
                                </div>
                                <div onClick={() => handleNavigate(item)} style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <div
                                        style={{
                                            background: "#fff",
                                            color: "#6a1b9a",
                                            padding: "6px 14px",
                                            borderRadius: 20,
                                            fontWeight: 700,
                                            fontSize: 13,
                                        }}
                                    >
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