import { useEffect, useState } from "react";
import { getColorHistory } from "../services/gameSevice";

const NUM_COLORS = {
    0: ["violet", "red"],
    1: ["green"],
    2: ["red"],
    3: ["green"],
    4: ["red"],
    5: ["violet", "green"],
    6: ["red"],
    7: ["green"],
    8: ["red"],
    9: ["green"],
};

const COLOR_HEX = {
    red: "#ef4444",
    green: "#22c55e",
    violet: "#a855f7",
};

export default function ColorHistoryComp() {
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [loading, setLoading] = useState(false);

    const periodKey = "1m";
    const LIMIT = 12; // 🔥 keep this constant

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);

            try {
                const res = await getColorHistory({
                    key: periodKey,
                    limit: LIMIT,
                    page: page,
                });

                if (!res?.success) {
                    setHistory([]);
                    return;
                }

                const formatted = res.data.map((item) => {
                    const num = Number(item.result?.number ?? 0);

                    return {
                        issue: item.slotNum,
                        number: num,
                        colors: NUM_COLORS[num],
                        primary: NUM_COLORS[num][0],
                    };
                });

                setHistory(formatted);

                setHasNext(res.data.length === LIMIT);
            } catch (err) {
                console.error(err);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [page]);

    return (
        <div>
            {/* Header */}
            <div
                className="grid px-3.5 py-2"
                style={{
                    gridTemplateColumns: "1fr 1fr 80px",
                    background: "#f8f6ff",
                    borderBottom: "1px solid #ede9f8",
                }}
            >
                <span className="text-[11px] font-bold text-gray-400 uppercase">
                    ISSUE
                </span>
                <span className="text-[11px] font-bold text-gray-400 text-center uppercase">
                    NUMBER
                </span>
                <span className="text-[11px] font-bold text-gray-400 text-right uppercase">
                    COLOR
                </span>
            </div>
            {loading && (
                [1, 2, 3, 4, 5, 6, 7, 8, 9,].map((i) => {
                    return <div className="animate-pulse" style={{
                        padding: 20, textAlign: "center",
                        backgroundColor: "#c9c9c9",
                        margin:'2%',borderRadius:"4%"
                    }}>
                    </div>
                })
            )}
            {!loading &&
                history.map((row, i) => {
                    const isViolet = row.number === 0 || row.number === 5;

                    const numColor = isViolet
                        ? "#a855f7"
                        : row.number % 2 === 0
                            ? "#ef4444"
                            : "#22c55e";

                    const dotBg = COLOR_HEX[row.primary] || "#888";

                    return (
                        <div
                            key={i}
                            className="grid items-center px-3 py-3 border-b border-purple-50"
                            style={{
                                gridTemplateColumns: "1fr 1fr 80px",
                                backgroundColor: `${dotBg}30`,
                            }}
                        >
                            <span className="text-[10px] text-black-500 font-mono">
                                {`${(page - 1) * LIMIT + (i + 1)}. ${row.issue}`}
                            </span>

                            <span
                                className="text-[15px] font-black text-center"
                                style={{ color: numColor }}
                            >
                                {row.number}
                            </span>

                            <div
                                className="w-[25px] h-[8px] rounded-sm ml-auto"
                                style={{ background: dotBg }}
                            />
                        </div>
                    );
                })}

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3">
                {/* Prev */}
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 rounded-lg text-sm font-bold"
                    style={{
                        background: page === 1 ? "#ddd" : "#7c3aed",
                        color: "#fff",
                    }}
                >
                    ← Prev
                </button>

                {/* Page */}
                <div className="text-sm font-semibold text-gray-600">
                    Page {page}
                </div>

                {/* Next */}
                <button
                    disabled={!hasNext}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 rounded-lg text-sm font-bold"
                    style={{
                        background: !hasNext ? "#ddd" : "#7c3aed",
                        color: "#fff",
                    }}
                >
                    Next →
                </button>
            </div>
        </div>
    );
}