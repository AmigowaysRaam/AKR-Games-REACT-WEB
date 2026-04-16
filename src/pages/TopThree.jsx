import React, { useEffect, useState } from "react";

export default function TopThree({ leaders }) {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimate(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!leaders || leaders.length < 3) return null;

    const ordered = [
        leaders.find((p) => p.rank === 2),
        leaders.find((p) => p.rank === 1),
        leaders.find((p) => p.rank === 3),
    ];

    return (
        <div style={styles.wrapper}>
            <div style={styles.topThree}>
                {ordered.map((p, index) => {
                    const isWinner = p.rank === 1;

                    return (
                        <div
                            key={p.rank}
                            style={{
                                ...styles.podium,
                                height: isWinner ? 110 : 90,
                                opacity: animate ? 1 : 0,
                                transform: animate
                                    ? isWinner
                                        ? "translateY(0) scale(1.2)"
                                        : "translateY(0) scale(1)"
                                    : "translateY(80px) scale(0.7)",
                                transition: `all 0.7s cubic-bezier(.17,.67,.83,.67) ${index * 0.2}s`,
                                background: isWinner
                                    ? "linear-gradient(180deg,#FFD700,#FF8C00)"
                                    : "linear-gradient(180deg,#f5c542,#a85c00)",
                                boxShadow: isWinner
                                    ? "0 0 25px rgba(255,215,0,0.9)"
                                    : "0 6px 15px rgba(0,0,0,0.3)",
                            }}
                        >
                            {/* Crown */}
                            {isWinner && (
                                <div style={styles.crown}>👑</div>
                            )}

                            {/* Avatar Section */}
                            <div style={styles.avatarWrapper}>
                                <div
                                    style={{
                                        ...styles.avatarGlow,
                                        boxShadow: isWinner
                                            ? "0 0 20px rgba(255,215,0,0.8)"
                                            : "0 0 10px rgba(255,255,255,0.4)",
                                    }}
                                >
                                    <img
                                        src={p?.img}
                                        alt="avatar"
                                        style={{
                                            width: isWinner ? 70 : 55,
                                            height: isWinner ? 70 : 55,
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Score */}
                            <div style={styles.scoreBox}>
                                ₹{p.amount}
                            </div>

                            {/* Name */}
                            <div style={styles.name}>{p.name}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
const styles = {
    wrapper: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "15%",
    },

    topThree: {
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        gap: 25,
    },

    podium: {
        width: 110,
        borderRadius: 18,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "10px 0",
        color: "#fff",
        fontWeight: "bold",
        position: "relative",
    },

    crown: {
        position: "absolute",
        top: -20,
        fontSize: 22,
        animation: "bounce 1.2s infinite",
    },

    avatarWrapper: {
        marginBottom: 6,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    avatarGlow: {
        borderRadius: "50%",
        padding: 4,
        background: "rgba(255,255,255,0.2)",
        transition: "all 0.3s ease",
    },
    scoreBox: {
        background: "#000",
        padding: "4px 12px",
        borderRadius: 10,
        marginBottom: 6,
        marginTop: 6,
        fontSize: 11,
        letterSpacing: 0.5,
    },

    name: {
        fontSize: 12,
        textAlign: "center",
        textShadow: "0 2px 6px rgba(0,0,0,0.9)",
    },
};