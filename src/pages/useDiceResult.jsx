import React, { useEffect, useState } from "react";
import { getDiceHistory } from "../services/gameSevice";
import oddImg from "../assets/Odd.png";
import evenImg from "../assets/Even.png";
import smallImg from "../assets/Small.png";
import bigImg from "../assets/Big.png";

const PERIODS = [
    { key: "1m", label: "1min", seconds: 60, lockAt: 10 },
    { key: "3m", label: "3min", seconds: 180, lockAt: 30 },
    { key: "5m", label: "5min", seconds: 300, lockAt: 30 },
    { key: "15m", label: "15min", seconds: 900, lockAt: 30 },
];
const DICE_DOTS = {
    1: [[50, 50]],
    2: [[28, 28], [72, 72]],
    3: [[28, 28], [50, 50], [72, 72]],
    4: [[28, 28], [72, 28], [28, 72], [72, 72]],
    5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
    6: [[28, 22], [72, 22], [28, 50], [72, 50], [28, 78], [72, 78]],
};
function DiceDots({ value, size }) {
    const dots = DICE_DOTS[value];
    // 🔥 smarter scaling
    const r = Math.max(3.5, size * 0.14);   // minimum size + responsive
    const svgSize = size * 0.85;
    return (
        <svg width={svgSize} height={svgSize} viewBox="0 0 100 100">
            {dots.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={r} fill="#111" />
            ))}
        </svg>
    );
}
function getFacePosition(face, half) {
    switch (face) {
        case 1: return `translateZ(${half}px)`;
        case 2: return `rotateX(90deg) translateZ(${half}px)`;
        case 3: return `rotateY(90deg) translateZ(${half}px)`;
        case 4: return `rotateY(-90deg) translateZ(${half}px)`;
        case 5: return `rotateX(-90deg) translateZ(${half}px)`;
        case 6: return `rotateX(180deg) translateZ(${half}px)`;
        default: return "";
    }
}
function Dice3D({ value, rolling, size = 60 }) {
    const half = size / 2;
    const faceTransforms = {
        1: "rotateX(0deg) rotateY(0deg)",     // translateZ → no rotation needed
        2: "rotateX(-90deg)",                  // face2 = rotateX(90) translateZ → show with rotateX(-90)
        3: "rotateY(-90deg)",                  // ✅ FIXED — face3 = rotateY(90) → show with rotateY(-90)
        4: "rotateY(90deg)",                   // ✅ FIXED — face4 = rotateY(-90) → show with rotateY(+90)
        5: "rotateX(90deg)",                   // face5 = rotateX(-90) → show with rotateX(+90)
        6: "rotateX(180deg)",                  // face6 = rotateX(180)
    };
    return (
        <div style={{ perspective: size * 6 }}>
            <div
                style={{
                    width: size,
                    height: size,
                    position: "relative",
                    transformStyle: "preserve-3d",
                    transform: rolling
                        ? "rotateX(720deg) rotateY(720deg)"
                        : faceTransforms[value],
                    transition: rolling
                        ? "transform 0.8s cubic-bezier(0.2,0.8,0.2,1)"
                        : "transform 0.4s ease-out",
                }}
            >
                {[1, 2, 3, 4, 5, 6].map((face) => (
                    <div
                        key={face}
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            background: "white",
                            border: "2px solid #ccc",
                            borderRadius: size * 0.15,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transform: getFacePosition(face, half),
                        }}
                    >
                        <DiceDots value={face} size={size} />
                    </div>
                ))}
            </div>
        </div>
    );
}
const getTagImage = (type) => {
    if (type === "BIG") return bigImg;
    if (type === "SMALL") return smallImg;
    if (type === "ODD") return oddImg;
    if (type === "EVEN") return evenImg;
    return null;
};
export default function DiceResultWithTabs() {
    const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[0]);
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);


    const getSerialNumber = (page, index, limit = 10) => {
        return (page - 1) * limit + index + 1;
    };

    const getTagColor = (tag) => (tag === "BIG" ? "#ef4444" : "#3b82f6");
    // 🔥 API CALL
    const fetchHistory = async (pageNum = 1, key = selectedPeriod.key) => {
        try {
            setLoading(true);
            const res = await getDiceHistory({
                key,
                limit: 10,
                page: pageNum,
            });
            if (!res?.success) return;

            const list = res.data || [];
            const formatted = list.map((item) => {
                const dice = item.result?.dice || [];
                const sum = item.result?.sum || 0;
                const openAt = item.openAt;
                const closeAt = item?.closeAt;
                return {
                    issue: item.slotNum,
                    dice,
                    sum,
                    tag: sum >= 11 ? "BIG" : "SMALL",
                    openAt,
                    closeAt
                };
            });

            setHistory(formatted);
            setHasMore(list.length === 10);
        } catch (err) {
            console.log("History API error:", err);
        } finally {
            setLoading(false);
        }
    };

    // 🔁 Initial load + tab change
    useEffect(() => {
        setPage(1);
        fetchHistory(1, selectedPeriod.key);
    }, [selectedPeriod]);

    // ▶ NEXT
    const handleNext = () => {
        if (!hasMore) return;
        const next = page + 1;
        setPage(next);
        fetchHistory(next, selectedPeriod.key);
    };
    // ◀ PREV
    const handlePrev = () => {
        if (page === 1) return;
        const prev = page - 1;
        setPage(prev);
        fetchHistory(prev, selectedPeriod.key);
    };

    return (
        <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden" }}>

            {/* 🔷 PERIOD TABS */}
            <div
                style={{
                    display: "flex",
                    borderBottom: "1px solid #eee",
                    background: "#f8f6ff",
                }}
            >
                {PERIODS.map((p) => (
                    <button
                        key={p.key}
                        onClick={() => setSelectedPeriod(p)}
                        style={{
                            flex: 1,
                            padding: "10px 0",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: 700,
                            fontSize: 10,
                            background:
                                selectedPeriod.key === p.key ? "#7c3aed" : "transparent",
                            color:
                                selectedPeriod.key === p.key ? "#fff" : "#555",
                            transition: "0.2s",
                        }}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* 🔹 HEADER */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1.4fr 1.2fr 0.6fr 0.9fr 0.9fr",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#666",
                    padding: "8px 6px"
                }}
            >

                <div style={{ textAlign: "left" }}>Issue</div>
                <div style={{ textAlign: "center" }}>Result</div>
                <div style={{ textAlign: "center" }}>Sum</div>
                <div style={{ textAlign: "center" }}>Value</div>
                <div style={{ textAlign: "center" }}>Number</div>
            </div>

            {/* 🔄 LOADING */}
            {loading && (
                <div style={{ padding: 20, textAlign: "center" }}>
                    Loading...
                </div>
            )}

            {history?.map((row, i) => (
                <div key={i} style={{
                    display: "grid",
                    gridTemplateColumns: "1.4fr 1.2fr 0.6fr 0.9fr 0.9fr",
                    alignItems: "center",
                    padding: "10px 6px",
                    borderRadius: 10,
                    marginBottom: 6,
                    background: i % 2 === 0 ? "#fff" : "#f9f9fb"
                }}>

                    <div style={{
                        ...cellLeft,
                        fontSize: 9, color: "#111",
                        lineHeight: "14px"
                    }}>
                        {row.issue}
                    </div>

                    {/* DICE */}
                    <div style={{
                        ...cellCenter,
                        gap: 4
                    }}>
                        {row.dice.map((d, j) => (
                            <Dice3D key={j} value={d} size={20} dotScale={0.36} />
                        ))}
                    </div>
                    <div style={{
                        ...cellCenter,
                        fontSize: 16,
                        fontWeight: 700
                    }}>
                        {row.sum}
                    </div>
                    {/* BIG / SMALL */}
                    <div style={cellCenter}>
                        <img
                            src={getTagImage(row.tag)}
                            style={{ width: 30, height: 30 }}
                        />
                    </div>

                    {/* ODD / EVEN */}
                    <div style={cellCenter}>
                        <img
                            src={getTagImage(row.even ? "EVEN" : "ODD")}
                            style={{ width: 30, height: 30 }}
                        />
                    </div>

                </div>
            ))}

            {/* 🔻 PAGINATION */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px",
                }}
            >
                <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    style={{
                        padding: "1px 12px",
                        borderRadius: 6,
                        border: "1px solid #ddd",
                        background: page === 1 ? "#eee" : "#fff",
                    }}
                >
                    ⬅ Prev
                </button>
                <span style={{ fontSize: 10, fontWeight: 600 }}>
                    Page {page}
                </span>
                <button
                    onClick={handleNext}
                    disabled={!hasMore}
                    style={{
                        padding: "1px 10px",
                        borderRadius: 6,
                        border: "1px solid #ddd",
                        background: !hasMore ? "#eee" : "#fff",
                    }}
                >
                    Next ➡
                </button>
            </div>
        </div>
    );
}
const cellCenter = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const cellLeft = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
};