import { useEffect, useState } from "react";
import { getBettingList } from "../services/gameSevice";

export default function KeralLotteryMyOrders({
  activeTab,
  selectedDate,
}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    setPage(1); // reset page on filter change
  }, [activeTab, selectedDate]);

  useEffect(() => {
    fetchOrders();
  }, [page, activeTab, selectedDate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) return;

      const res = await getBettingList({
        userId: user.id,
        page,
        limit,
        status: activeTab,
        date: selectedDate,
      });

      const list = res?.data || [];
      setOrders(list);
      setHasNext(list.length === limit);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-IN");
  };

  const getStatusUI = (order) => {
    const status = order.status?.toLowerCase();

    if (status === "won" || status === "success") {
      return <span style={{ color: "#16a34a" }}>Win ₹{order.winAmount || 0}</span>;
    }
    if (status === "lost" || status === "failed") {
      return <span style={{ color: "#dc2626" }}>Lost</span>;
    }
    return <span style={{ color: "#f59e0b" }}>Pending</span>;
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  if (!orders.length)
    return <p style={{ textAlign: "center" }}>No orders found</p>;

  return (
    <div style={{ padding: 12 }}>
      {orders.map((order, i) => (
        <div key={i} style={styles.card}>
          {/* Header */}
          <div style={styles.cardHeader}>
            <span>{getStatusUI(order)}</span>
            <span style={styles.orderId}>#{order.id}</span>
          </div>

          {/* Lottery Name */}
          <div style={styles.lotteryName}>
            {order?.Lottery?.name || "Lottery"}
          </div>

          {/* Body */}
          <div style={styles.cardBody}>
            <div>
              <div style={styles.number}>{order.number}</div>
              <div style={styles.date}>
                {formatDateTime(order.created_at)}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={styles.amount}>₹{order.amount}</div>
            </div>
          </div>

          {/* Winning Number */}
          {order.winningNumber && (
            <div style={styles.winBox}>
              Winning: {order.winningNumber}
            </div>
          )}
        </div>
      ))}

      {/* ✅ Pagination */}
      {/* <div style={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span>Page {page}</span>

        <button
          disabled={!hasNext}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div> */}
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 6,
    fontSize: 13,
  },
  orderId: {
    color: "#888",
  },
  lotteryName: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  cardBody: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  number: {
    fontSize: 16,
    fontWeight: 600,
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  amount: {
    fontSize: 16,
    fontWeight: 600,
  },
  winBox: {
    marginTop: 8,
    padding: 6,
    background: "#ecfdf5",
    color: "#16a34a",
    fontSize: 12,
    borderRadius: 6,
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginTop: 16,
  },
};