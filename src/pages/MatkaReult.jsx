import {
    Clock1, Clock2, Clock3, Clock4, Clock5, Clock6,
    Clock7, Clock8, Clock9, Clock10, Clock11, Clock12
} from "lucide-react";
import React, { useEffect, useState } from "react";
export default function MatkaResultTab() {
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const clockIcons = {
        1: Clock1, 2: Clock2, 3: Clock3, 4: Clock4, 5: Clock5,
        6: Clock6, 7: Clock7, 8: Clock8,
        9: Clock9, 10: Clock10, 11: Clock11,
        12: Clock12,
    };
    const getHour12 = (time) => {
        if (!time) return 1;
        let hour = parseInt(time.split(":")[0], 10);
        return hour === 0 ? 12 : hour;
    };
    const staticData = [
        { name: "NO.12562200", time: "11:30 AM", result: "115-122-222" },
        { name: "NO.1256227865", time: "01:30 PM", result: "***-***-***" },
        { name: "NO.112562200", time: "03:30 PM", result: "***-***-***" },
        { name: "NO.12562200KY", time: "05:30 PM", result: "***-***-***" },
        { name: "NO.12562200", time: "07:30 PM", result: "***-***-***" },
        { name: "NO.12562200", time: "09:30 PM", result: "***-***-***" },
        { name: "NO.12562200", time: "11:00 PM", result: "***-***-***" },
    ];
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            if (page === 1) {
                setHistory(staticData);
                setHasMore(true);
            } else if (page === 2) {
                setHistory(staticData);
                setHasMore(false);
            } else {
                setHistory([]);
                setHasMore(false);
            }

            setLoading(false);
        }, 500);
    }, [page]);
    const handleNext = () => {
        if (!hasMore) return;
        setPage((p) => p + 1);
    };
    const handlePrev = () => {
        if (page === 1) return;
        setPage((p) => p - 1);
    };
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    padding: "12px 16px",
                    background: "#f9fafb",
                    fontWeight: 600,
                    fontSize: 13,
                    color: "#555",
                }}
            >
                <div style={{ flex: 1 }}>Name</div>
                <div style={{ flex: 1, textAlign: "center" }}>Numbers</div>
                <div style={{ flex: 1, textAlign: "right" }}>Time</div>
            </div>
            {loading && (
                <div style={{ padding: 20, textAlign: "center" }}>
                    <div
                        style={{
                            width: 30,
                            height: 30,
                            border: "3px solid #eee",
                            borderTop: "3px solid #7c3aed",
                            borderRadius: "50%",
                            margin: "auto",
                            animation: "spin 1s linear infinite",
                        }}
                    />
                </div>
            )}
            {!loading && history.length === 0 && (
                <div style={{ padding: 20, textAlign: "center", color: "#999" }}>
                    No Data Available
                </div>
            )}
            {!loading &&
                history.map((item, index) => {
                    const hour = getHour12(item.time);
                    const Icon = clockIcons[hour] || Clock1;
                    return (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                padding: "12px 16px",
                                borderBottom: "1px solid #f1f1f1",
                                alignItems: "center",
                                fontSize: 12,
                            }}
                        >
                            <div style={{ flex: 1, fontWeight: 500 }}>
                                {item.name}
                            </div>
                            <div
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: 6,
                                }}
                            >

                                <span
                                    style={{
                                        padding: "6px 12px",
                                        borderRadius: 8,
                                        background: item.result.includes("*") ? "#eee" : "#7a3aed",
                                        color: item.result.includes("*") ? "#999" : "#fff",
                                        fontWeight: 600,
                                        fontSize: 10,
                                        letterSpacing: 1,
                                    }}
                                >
                                    {item.result}
                                </span>
                            </div>
                            <div
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    gap: 6,
                                    color: "#222",
                                    fontSize: 12,
                                }}
                            >
                                <Icon size={16} />
                                {item.time}
                            </div>
                        </div>
                    );
                })}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px",
                }}
            >
                <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    style={{
                        padding: "6px 14px",
                        borderRadius: 6,
                        border: "1px solid #ddd",
                        background: page === 1 ? "#eee" : "#fff",
                        cursor: "pointer",
                    }}
                >
                    ⬅ Prev
                </button>
                <span style={{ fontSize: 11, fontWeight: 600 }}>
                    Page {page}
                </span>
                <button
                    onClick={handleNext}
                    disabled={!hasMore}
                    style={{
                        padding: "6px 14px",
                        borderRadius: 6,
                        border: "1px solid #ddd",
                        background: !hasMore ? "#eee" : "#fff",
                        cursor: "pointer",
                    }}
                >
                    Next ➡
                </button>
            </div>
            <style>
                {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
            </style>
        </div>
    );
}