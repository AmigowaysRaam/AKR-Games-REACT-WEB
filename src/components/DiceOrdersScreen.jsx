// MyDiceOrderTab.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getUserBets } from "../services/gameSevice";
import DiceLoader from "./Diceloader";

/* 🎲 Dice UI */
function DiceMini({ value }) {
    return (
        <div
            style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "linear-gradient(145deg,#ffffff,#f1f1f1)",
                border: "1px solid #ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
            }}
        >
            {value}
        </div>
    );
}

export default function MyDiceOrderTab() {
    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));

    /* ✅ FETCH */
    useEffect(() => {
        if (user?.id) fetchUserBets();
    }, [user?.id]);

    const fetchUserBets = async () => {
        try {
            setLoading(true);

            const res = await getUserBets({
                user_id: user?.id,
            });

            if (!res?.success) return;

            const formatted = (res.data || []).map((item) => {
                let status = "pending";

                if (item.result === "win" || item.result === 1) status = "win";
                else if (item.result === "lose" || item.result === 0) status = "lose";

                return {
                    id: item.id,
                    issue: item.slot_num,
                    amount: item.bet_amount,
                    payout: item.credit_amount || 0,
                    selection: {
                        label: item.value,
                        type: item.type,
                    },
                    settled: status !== "pending",
                    won: status === "win",
                    dice: item.slotResult?.dice || [],
                    sum: item.slotResult?.sum,
                    tag: item.slotResult?.value,
                };
            });

            setBets(formatted);
        } catch (err) {
            console.log("fetchUserBets error", err);
        } finally {
            setLoading(false);
        }
    };

    const groupedBets = useMemo(() => {
        return Object.values(
            bets.reduce((acc, bet) => {
                if (!acc[bet.issue]) {
                    acc[bet.issue] = { issue: bet.issue, items: [] };
                }
                acc[bet.issue].items.push(bet);
                return acc;
            }, {})
        );
    }, [bets]);
    if (loading) {
        return (
            <DiceLoader />
        );
    }
    if (!groupedBets.length) {
        return (
            <div style={{ padding: 60, textAlign: "center", color: "#bbb" }}>
                <div style={{ fontSize: 50 }}>🎲</div>
                <div style={{ marginTop: 10, fontWeight: 600 }}>
                    No orders yet
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: 12 }}>
            {groupedBets.map((group, i) => {
                const first = group.items[0];

                const isPending = group.items.some((b) => !b.settled);
                const isWon = group.items.some((b) => b.won);

                const statusColor = isPending
                    ? "#f59e0b"
                    : isWon
                        ? "#16a34a"
                        : "#ef4444";

                const statusText = isPending
                    ? "Pending"
                    : isWon
                        ? "Win"
                        : "Lose";

                return (
                    <div
                        key={i}
                        style={{
                            background: "#fff",
                            borderRadius: 16,
                            marginBottom: 16,
                            overflow: "hidden",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                            border: "1px solid #f0f0f0",
                        }}
                    >
                        {/* 🔹 TOP BAR */}
                        <div
                            style={{
                                padding: "10px 14px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                background: "#fafafa",
                                borderBottom: "1px solid #eee",
                            }}
                        >
                            <span style={{ fontSize: 12, color: "#666" }}>
                                Issue #{group.issue}
                            </span>

                            <span
                                style={{
                                    background: statusColor,
                                    color: "#fff",
                                    fontSize: 11,
                                    padding: "4px 10px",
                                    borderRadius: 20,
                                    fontWeight: 700,
                                }}
                            >
                                {statusText}
                            </span>
                        </div>

                        {/* 🔹 RESULT SECTION */}
                        <div
                            style={{
                                padding: 14,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            {/* 🎲 DICE */}
                            <div style={{ display: "flex", gap: 6 }}>
                                {first.dice.length ? (
                                    first.dice.map((d, idx) => (
                                        <DiceMini key={idx} value={d} />
                                    ))
                                ) : (
                                    <span style={{ fontSize: 12, color: "#aaa" }}>
                                        Waiting...
                                    </span>
                                )}
                            </div>

                            {/* 📊 RESULT */}
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 12, color: "#888" }}>Sum</div>
                                <div style={{ fontWeight: 800, fontSize: 16 }}>
                                    {first.sum ?? "-"}
                                </div>
                            </div>

                            {/* 🏷 TAG */}
                            <div
                                style={{
                                    background: "#3b82f6",
                                    color: "#fff",
                                    padding: "6px 10px",
                                    borderRadius: 12,
                                    fontSize: 11,
                                    fontWeight: 700,
                                }}
                            >
                                {first.tag || "-"}
                            </div>
                        </div>

                        {/* 🔹 BET LIST */}
                        {group.items.map((b, j) => (
                            <div
                                key={j}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "12px 14px",
                                    borderTop: "1px dashed #eee",
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 13 }}>
                                        {b.selection.label}
                                    </div>
                                    <div style={{ fontSize: 11, color: "#888" }}>
                                        {b.selection.type}
                                    </div>
                                </div>
                                <div style={{ fontSize: 13 }}>₹{b.amount}</div>
                                <div
                                    style={{
                                        fontWeight: 800,
                                        fontSize: 13,
                                        color: b.won
                                            ? "#16a34a"
                                            : b.settled
                                                ? "#ef4444"
                                                : "#f59e0b",
                                    }}
                                >
                                    {b.settled
                                        ? b.won
                                            ? `+₹${b.payout}`
                                            : "No win"
                                        : "Pending"}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}