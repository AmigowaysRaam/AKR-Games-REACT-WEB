import React, { useEffect, useMemo, useState } from "react";
import { getColorUserBets } from "../services/gameSevice";

/* 🎨 Color Map */
const COLOR_MAP = {
    red: "#ef4444",
    green: "#22c55e",
    violet: "#a855f7",
};

/* 📅 Format Date */
const formatDateTime = (dateStr) => {
    if (!dateStr) return "--";

    const d = new Date(dateStr);

    return {
        date: d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }),
        time: d.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        }),
    };
};

/* 🎯 Status */
function StatusBadge({ status }) {
    const map = {
        win: { bg: "#dcfce7", color: "#16a34a", text: "WIN" },
        loss: { bg: "#fee2e2", color: "#dc2626", text: "LOSS" },
        pending: { bg: "#fef3c7", color: "#d97706", text: "PENDING" },
    };
    const s = map[status] || map.pending;

    return (
        <span style={{
            background: s.bg,
            color: s.color,
            padding: "4px 10px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
        }}>
            {s.text}
        </span>
    );
}

/* 🎨 Value */
function ValueBadge({ type, value }) {
    const bg = type === "COLOR" ? COLOR_MAP[value] || "#999" : "#3b82f6";

    return (
        <span style={{
            background: bg,
            color: "#fff",
            padding: "5px 12px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
        }}>
            {type === "COLOR" ? value : `No. ${value}`}
        </span>
    );
}

/* 🔄 Loader */
function Loader() {
    return (
        <div style={{ textAlign: "center", padding: 40 }}>
            <div className="loader" />
            <p style={{ marginTop: 10 }}>Loading...</p>

            <style>{`
                .loader {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #eee;
                    border-top: 4px solid #7c3aed;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: auto;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

/* ❌ Empty */
function EmptyState() {
    return (
        <div style={{ textAlign: "center", padding: 50 }}>
            <p>No orders found</p>
        </div>
    );
}

/* 🧠 MAIN */
export default function MyOrderColorPrediction() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    /* 📄 Pagination */
    const [page, setPage] = useState(1);
    const perPage = 3;

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user?.id) {
            console.warn("User not found");
            setLoading(false);
            return;
        }
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const res = await getColorUserBets({
                user_id: user.id,
            });

            if (!res?.success || !Array.isArray(res.data)) {
                setOrders([]);
                return;
            }

            const formatted = res.data.map((item) => ({
                id: item.id,
                issue: item.slotNum,
                type: item.type,
                value: item.value,
                amount: item.betAmount,
                result: item.result || "pending",
                credit: item.creditAmount || 0,
                debit: item.debitAmount || 0,
                createdAt: item.createdAt,
                settledAt: item.settledAt,
            }));

            setOrders(formatted);
        } catch (err) {
            console.error(err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    /* 📦 Group */
    const grouped = useMemo(() => {
        const map = {};
        orders.forEach((o) => {
            if (!map[o.issue]) {
                map[o.issue] = { issue: o.issue, items: [] };
            }
            map[o.issue].items.push(o);
        });
        return Object.values(map);
    }, [orders]);

    /* 📄 Pagination Logic */
    const totalPages = Math.ceil(grouped.length / perPage);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * perPage;
        return grouped.slice(start, start + perPage);
    }, [grouped, page]);

    if (loading) return <Loader />;
    if (!grouped.length) return <EmptyState />;

    return (
        <div style={{ padding: 12 }}>
            {paginatedData.map((group, i) => {
                const isPending = group.items.some((o) => o.result === "pending");
                const isWin = group.items.some((o) => o.result === "win");

                return (
                    <div key={i} style={{
                        background: "#fff",
                        borderRadius: 16,
                        marginBottom: 16,
                        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                        overflow: "hidden",
                    }}>
                        {/* HEADER */}
                        <div style={{
                            background: "linear-gradient(90deg,#7c3aed,#6366f1)",
                            color: "#fff",
                            padding: "10px 14px",
                            display: "flex",
                            justifyContent: "space-between",
                        }}>
                            <span>Issue #{group.issue}</span>
                            <span>
                                {isPending ? "⏳ Pending" : isWin ? "✅ Win" : "❌ Loss"}
                            </span>
                        </div>

                        {/* ITEMS */}
                        {group.items.map((o, j) => {
                            const created = formatDateTime(o.createdAt);
                            const settled = formatDateTime(o.settledAt);

                            return (
                                <div key={j} style={{
                                    padding: 12,
                                    borderTop: "1px solid #f1f1f1",
                                }}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}>
                                        <ValueBadge type={o.type} value={o.value} />
                                        <StatusBadge status={o.result} />
                                        <div style={{
                                            fontWeight: 700,
                                            color:
                                                o.credit > 0
                                                    ? "#16a34a"
                                                    : o.debit > 0
                                                        ? "#dc2626"
                                                        : "#888",
                                        }}>
                                            {o.credit > 0 && `+₹${o.credit}`}
                                            {o.debit > 0 && `-₹${o.debit}`}
                                        </div>
                                    </div>

                                    {/* 📅 TIME INFO */}
                                    <div style={{
                                        fontSize: 11,
                                        color: "#777",
                                        marginTop: 6,
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}>
                                        <span>
                                            Bet: {created.date} {created.time}
                                        </span>
                                        {o.result !== "pending" && (
                                            <span>
                                                Result: {settled.date} {settled.time}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })}

            {/* 📄 PAGINATION */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: 10,
                marginTop: 10,
            }}>
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                >
                    Prev
                </button>
                <span>
                    Page {page} / {totalPages}
                </span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}