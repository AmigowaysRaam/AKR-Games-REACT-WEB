import React, { useEffect, useState } from "react";
import { getPromoList } from "../services/authService";
import GameLoader from "./LoaderComponet";

export default function PromoList() {
    const [promoList, setPromoList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            fetchHistory(parsedUser.id);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchHistory = async (userId) => {
        try {
            const res = await getPromoList({
                id: userId,
            });

            if (res?.data) {
                setPromoList(res.data); // ✅ store API data
            }
        } catch (err) {
            console.log("API Error:", err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <style>
                {`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(15px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0px);
                    }
                }
                `}
            </style>
            <div style={{ padding: 12 }}>
                {loading ? (
                    <GameLoader />

                ) : promoList.length === 0 ? (
                    <div>No Promotions Available</div>
                ) : (
                    promoList.map((item, i) => (
                        <div
                            key={item.id}
                            className="cursor-pointer"
                            style={{
                                borderRadius: 16,
                                overflow: "hidden",
                                marginBottom: 14,
                                position: "relative",
                                height: 140,
                                color: "white",

                                opacity: 0,
                                transform: "translateY(15px)",
                                animation: "fadeInUp 0.4s ease forwards",
                                animationDelay: `${i * 80}ms`,
                            }}
                        >
                            {/* Background Image */}
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    backgroundImage: `url(${item.image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            />

                            {/* Overlay */}
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background:
                                        "linear-gradient(135deg, rgba(123,31,162,0.5), rgba(74,20,140,0.1))",
                                }}
                            />

                            {/* Content */}
                            <div style={{ position: "relative", padding: 14 }}>
                                <div style={{ fontSize: 13 }}>
                                    {item.title}
                                </div>

                                <div style={{
                                    fontWeight: 800, background: "#fff",
                                    color: "#6a1b9a", alignSelf: "center", padding: "4px 12px", borderRadius: 8, display: "inline-block",
                                }}>
                                    {item.button_name}
                                </div>

                                <div
                                    style={{
                                        fontSize: 28,
                                        color: "#ffca28",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {item.key}
                                </div>

                                <div>
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}