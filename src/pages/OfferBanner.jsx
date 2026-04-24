import { useEffect, useState } from "react";

export default function OfferBanner({ offer }) {
    const [visible, setVisible] = useState(false);

    if (!offer?.message) return null;
    const { message, available } = offer;

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <style>
                {`
          /* 🔥 Glow Burst (every 1s) */
          @keyframes glowBurst {
            0% {
              box-shadow: 0 0 0px rgba(0,105,180,10);
            }
            30% {
              box-shadow: 0 0 25px rgba(255,105,180,0.9),
                          0 0 60px rgba(1,105,180,0.6);
            }
            100% {
              box-shadow: 0 0 0px rgba(255,105,180,0);
            }
          }

          /* 🌊 subtle floating */
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
            100% { transform: translateY(0px); }
          }
        `}
            </style>

            <div
                style={{
                    margin: "12px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    position: "relative",
                    marginTop: "24px",
                    // 🎬 entry animation
                    opacity: visible ? 1 : 0,
                    transform: visible
                        ? "translateY(0) scale(1)"
                        : "translateY(120px) scale(0.1)",
                    animation: visible
                        ? "glowBurst 0.9s ease-in-out infinite, float 0.5s ease-in-out infinite"
                        : "none",
                }}
            >

                <img
                    src={message?.image}
                    alt="offer-banner"
                    style={{
                        width: "100%",
                        height: "90px",
                        objectFit: "cover",
                    }}
                />

                {/* Gradient Overlay */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(360deg, rgba(255,105,180,0.3), rgba(0,0,0,0.5))",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        padding: "12px",
                        color: "white",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <div>
                        <h3
                            style={{
                                fontSize: "12px",
                                fontWeight: "bold",
                                marginBottom: "2px",
                                opacity: visible ? 1 : 0,
                            }}
                        >
                            {message?.title}
                        </h3>
                        <p
                            style={{
                                fontSize: "10px",
                                opacity: 0.9,
                                marginTop: 4,
                            }}
                        >
                            {message?.subtitle}
                        </p>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                        }}
                    >
                        <p style={{ fontSize: "10px" }}>{message?.text}</p>
                        {!available && message?.next_day && (
                            <span
                                style={{
                                    fontSize: "20px",
                                    background: "rgba(255,255,255,0.2)",
                                    padding: "4px 6px",
                                    borderRadius: "6px",
                                }}
                            >
                                {message?.next_day}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}