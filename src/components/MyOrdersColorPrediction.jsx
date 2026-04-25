import React, { useEffect, useMemo, useState } from "react";
import { getColorUserBets } from "../services/gameSevice";

/* 🎨 Color helpers */
const COLOR_MAP = {
    red: "#ef4444",
    green: "#22c55e",
    violet: "#a855f7",
};

/* 🎯 Status Chip */
function StatusBadge({ status }) {
    const map = {
        win: { bg: "#dcfce7", color: "#16a34a", text: "WIN" },
        loss: { bg: "#fee2e2", color: "#dc2626", text: "LOSE" },
        pending: { bg: "#fef3c7", color: "#d97706", text: "PENDING" },
    };

    const s = map[status] || map.pending;

    return (
        <span
            style={{
                background: s.bg,
                color: s.color,
                padding: "4px 10px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
            }}
        >
            {s.text}
        </span>
    );
}

/* 🎨 Value Badge */
function ValueBadge({ type, value }) {
    const bg =
        type === "COLOR"
            ? COLOR_MAP[value] || "#999"
            : "#3b82f6";

    return (
        <span
            style={{
                background: bg,
                color: "#fff",
                padding: "4px 10px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                textTransform: "capitalize",
            }}
        >
            {type === "COLOR" ? value : `No. ${value}`}
        </span>
    );
}

/* 🎲 LOADER */
function ColorOrderLoader() {
    const [vals, setVals] = useState([1, 2, 3]);

    useEffect(() => {
        const interval = setInterval(() => {
            setVals([
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
            ]);
        }, 120); // faster for smooth rolling

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ textAlign: "center", padding: 50 }}>

            {/* 🎲 ROLLING BALLS */}
            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
                {vals.map((v, i) => (
                    <div
                        key={i}
                        style={{
                            width: 52,
                            height: 52,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg,#7c3aed,#ec4899)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: 900,
                            fontSize: 18,
                            animation: "roll 0.8s infinite ease-in-out",
                            animationDelay: `${i * 0.2}s`,
                            boxShadow: "0 6px 16px rgba(124,58,237,0.4)",
                        }}
                    >
                        {/* {v} */}
                    </div>
                ))}
            </div>

            {/* ✨ TEXT */}
            <div
                style={{
                    marginTop: 16,
                    fontSize: 14,
                    fontWeight: 600,
                    background: "linear-gradient(90deg,#7c3aed,#ec4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
            >
                Rolling orders...
            </div>

            {/* 🎬 ANIMATION */}
            <style>
                {`
            @keyframes roll {
              0% {
                transform: rotate(0deg) scale(1);
              }
              25% {
                transform: rotate(90deg) scale(1.1);
              }
              50% {
                transform: rotate(180deg) scale(0.95);
              }
              75% {
                transform: rotate(270deg) scale(1.1);
              }
              100% {
                transform: rotate(360deg) scale(1);
              }
            }
          `}
            </style>
        </div>
    );
}
function EmptyState() {
    return (
        <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>
            <div style={{ fontSize: 40 }}>🎨</div>
            <div style={{ marginTop: 10 }}>No orders found</div>
        </div>
    );
}

/* 🧠 MAIN COMPONENT */
export default function MyOrderColorPrediction() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (user?.id) fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const res = await getColorUserBets({
                user_id: user?.id,
            });

            if (!res?.success) {
                setOrders([]);
                return;
            }

            const formatted = res.data.map((item) => ({
                id: item.id,
                issue: item.slotNum,
                type: item.type,
                value: item.value,
                amount: item.betAmount,
                win: item.potentialWin,
                result: item.result || "pending",
                credit: item.creditAmount || 0,
                debit: item.debitAmount || 0,
            }));

            setOrders(formatted);
        } catch (err) {
            console.log(err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    /* 📦 GROUP BY ISSUE */
    const grouped = useMemo(() => {
        return Object.values(
            orders.reduce((acc, o) => {
                if (!acc[o.issue]) {
                    acc[o.issue] = { issue: o.issue, items: [] };
                }
                acc[o.issue].items.push(o);
                return acc;
            }, {})
        );
    }, [orders]);
    if (loading) return <ColorOrderLoader />;
    if (!grouped?.length) return <EmptyState />;
    return (
        <div style={{ padding: 10 }}>
            {grouped.map((group, i) => {
                const isPending = group.items.some((o) => o.result === "pending");
                const isWin = group.items.some((o) => o.result === "win");

                return (
                    <div
                        key={i}
                        style={{
                            background: "#fff",
                            borderRadius: 14,
                            marginBottom: 14,
                            overflow: "hidden",
                            boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
                        }}
                    >
                        {/* HEADER */}
                        <div
                            className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white"
                            style={{
                                padding: 10,
                                fontWeight: 700,
                                fontSize: 13,
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <span>Issue #{group.issue}</span>
                            <span>
                                {isPending && "⏳ Pending"}
                                {!isPending && isWin && "✅ Win"}
                                {!isPending && !isWin && "❌ Lose"}
                            </span>
                        </div>
                        {/* <p>{JSON.stringify(orders,null,2)}</p> */}
                        {/* ITEMS */}
                        {group.items.map((o, j) => (
                            <div
                                key={j}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    padding: "10px 12px",
                                    borderTop: "1px solid #f1f1f1",
                                    alignItems: "center",
                                }}
                            >
                                {/* LEFT */}
                                <div>
                                    <ValueBadge type={o.type} value={o.value} />
                                    <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
                                        Bet ₹{o.amount}
                                    </div>
                                </div>

                                {/* CENTER */}
                                <StatusBadge status={o.result} />

                                {/* RIGHT */}
                                <div
                                    style={{
                                        fontWeight: 700,
                                        fontSize: 13,
                                        color:
                                            o.credit > 0
                                                ? "#16a34a"
                                                : o.debit > 0
                                                    ? "#dc2626"
                                                    : "#888",
                                    }}
                                >
                                    {o.credit > 0 && `+₹${o.credit}`}
                                    {o.debit > 0 && `-₹${o.debit}`}
                                    {o.result === "pending" && "—"}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}