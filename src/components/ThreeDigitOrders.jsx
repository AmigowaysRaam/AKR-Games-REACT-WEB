import { useEffect, useState } from "react";
import { getThreeDigitBets } from "../services/gameSevice";

export default function ThreeDigitOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.id) {
            fetchOrders(user.id);
        }
    }, []);

    const fetchOrders = async (userId) => {
        try {
            setLoading(true);

            const res = await getThreeDigitBets({ userId });

            if (!res?.success) return;

            const formatted = (res.data || []).map((bet) => ({
                id: bet.betId,
                amount: bet.totalAmount,
                winAmount: bet.winAmount,
                status: bet.status,
                date: bet.createdAt,
                items: bet.items || [],
                round: bet.round,
            }));

            setOrders(formatted);
        } catch (err) {
            console.log("orders error", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-10 text-gray-400 text-sm">
                Loading orders...
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-10 text-gray-400 text-sm">
                No orders found
            </div>
        );
    }

    return (
        <div className="p-2 space-y-3">
            {orders.map((o) => {
                const isPending = o.status === "pending";
                const isWin = o.status === "win";
                const isLose = o.status === "lose";

                const statusColor = isPending
                    ? "bg-yellow-100 text-yellow-600"
                    : isWin
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500";

                return (
                    <div
                        key={o.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-3"
                    >
                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <div className="text-sm font-semibold text-gray-800">
                                    3 Digit
                                </div>
                                <div className="text-[11px] text-gray-400">
                                    Round: {o.round || "-"}
                                </div>
                            </div>
                            <span
                                className={`text-[11px] px-3 py-1 rounded-full font-medium ${statusColor}`}
                            >
                                {o.status.toUpperCase()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm mb-2">
                            <div className="text-gray-600">
                                Bet: ₹{o.amount}
                            </div>

                            {isWin && (
                                <div className="text-green-600 font-bold">
                                    +₹{o.winAmount}
                                </div>
                            )}

                            {isLose && (
                                <div className="text-red-500 font-bold">
                                    −₹{o.amount}
                                </div>
                            )}

                            {isPending && (
                                <div className="text-yellow-500 font-semibold">
                                    Pending
                                </div>
                            )}
                        </div>

                        {/* ITEMS */}
                        <div className="flex flex-wrap gap-1 mt-2">
                            {o.items.map((it, i) => (
                                <div
                                    key={i}
                                    className="text-[11px] bg-purple-50 text-purple-600 px-2 py-[3px] rounded-md"
                                >
                                    {it.type} • {it.text} • ₹{it.value}
                                </div>
                            ))}
                        </div>

                        {/* FOOTER */}
                        <div className="mt-2 text-[12px] text-gray-800">
                            {new Date(o.date).toLocaleString()}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}