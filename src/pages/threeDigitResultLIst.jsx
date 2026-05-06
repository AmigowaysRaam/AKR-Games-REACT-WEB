import React, { useEffect, useState } from "react";

export default function ThreeDIGITResultWithTabs() {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  // 🔥 Static mock data
  const staticData = [
    { name: "Skywin", time: "11:30 AM", result: [8, 5, 7] },
    { name: "Skywin", time: "13:30 PM", result: ["*", "*", "*"] },
    { name: "Skywin", time: "15:30 PM", result: ["*", "*", "*"] },
    { name: "Skywin", time: "17:30 PM", result: ["*", "*", "*"] },
    { name: "Skywin", time: "19:30 PM", result: ["*", "*", "*"] },
    { name: "Skywin", time: "21:30 PM", result: ["*", "*", "*"] },
    { name: "Skywin", time: "23:00 PM", result: ["*", "*", "*"] },
  ];

  // 🎯 Simulate API
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      if (page === 1) {
        setHistory(staticData);
        setHasMore(true);
      } else if (page === 2) {
        setHistory(staticData); // same mock
        setHasMore(false);
      } else {
        setHistory([]);
        setHasMore(false);
      }

      setLoading(false);
    }, 800);
  }, [page]);

  const handleNext = () => {
    if (!hasMore) return;
    setPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (page === 1) return;
    setPage((p) => p - 1);
  };

  const colors = ["#ef4444", "#f59e0b", "#3b82f6"]; // red, orange, blue

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          padding: "12px",
          background: "#f3f4f6",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        <div style={{ flex: 1 }}>Name</div>
        <div style={{ flex: 1 }}>Time</div>
        <div style={{ flex: 1, textAlign: "center" }}>A B C</div>
      </div>

      {/* Loader */}
      {loading && (
        <div style={{ padding: 20, textAlign: "center" }}>
          <div
            style={{
              width: 30,
              height: 30,
              border: "3px solid #ddd",
              borderTop: "3px solid #7c3aed",
              borderRadius: "50%",
              margin: "auto",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      )}

      {/* Empty State */}
      {!loading && history.length === 0 && (
        <div style={{ padding: 20, textAlign: "center", color: "#999" }}>
          No Data Available
        </div>
      )}

      {/* List */}
      {!loading &&
        history.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              padding: "12px",
              borderBottom: "1px solid #f1f1f1",
              alignItems: "center",
              fontSize: 14,
            }}
          >
            <div style={{ flex: 1 }}>{item.name}</div>
            <div style={{ flex: 1 }}>{item.time}</div>

            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {item.result.map((val, i) => (
                <div
                  key={i}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: colors[i],
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                  }}
                >
                  {val}
                </div>
              ))}
            </div>
          </div>
        ))}

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          padding: "12px",
        }}
      >
        <button
          onClick={handlePrev}
          disabled={page === 1}
          style={{
            padding: "5px 12px",
            borderRadius: 6,
            border: "1px solid #ddd",
            background: page === 1 ? "#eee" : "#fff",
            cursor: "pointer",
          }}
        >
          ⬅ Prev
        </button>

        <span style={{ fontSize: 12, fontWeight: 600 }}>
          Page {page}
        </span>

        <button
          onClick={handleNext}
          disabled={!hasMore}
          style={{
            padding: "5px 12px",
            borderRadius: 6,
            border: "1px solid #ddd",
            background: !hasMore ? "#eee" : "#fff",
            cursor: "pointer",
          }}
        >
          Next ➡
        </button>
      </div>

      {/* Spinner animation */}
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