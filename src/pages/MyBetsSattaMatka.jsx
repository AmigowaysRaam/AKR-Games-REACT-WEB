import { useEffect, useState } from "react";
import { getSattaUserBets } from "../services/gameSevice";

export default function MySattaMatkaBets({ market_id }) {
    const [myOrders, setMyOrders] = useState([]);
    const [orderPage, setOrderPage] = useState(1);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);

    const LIMIT = 10;

    useEffect(() => {
        fetchMyOrders();
    }, [orderPage, market_id]);

    const fetchMyOrders = async () => {
        try {
            setLoadingOrders(true);
            const payload = {
                user_id: 12,
                page: orderPage,
                limit: LIMIT,
                ...(market_id ? { market_id } : {}),
            };
            const res = await getSattaUserBets(payload);
            if (res?.success) {
                const data = res.data || [];
                setMyOrders(data);

                setHasNextPage(data.length === LIMIT);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handlePrev = () => {
        if (orderPage > 1) setOrderPage((p) => p - 1);
    };

    const handleNext = () => {
        if (hasNextPage) setOrderPage((p) => p + 1);
    };

    return (
        <div className="mt-3 flex flex-col gap-3">
            {loadingOrders ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    {/* Spinner */}
                    <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>

                    {/* Text */}
                    <div className="text-sm text-gray-500 animate-pulse">
                        Loading your bets...
                    </div>
                </div>
            ) : myOrders.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                    No orders found
                </div>
            ) : (
                myOrders.map((order, i) => (
                    <div
                        key={i}
                        className="bg-blue-100 mb-1 border border-gray-100 rounded-xl p-3 flex flex-col gap-1"
                    >
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>{order.slot_number}</span>
                            <span>{order.session?.toUpperCase()}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-gray-800">
                                {order.bet_type} — {order.number}
                            </span>
                            <span className="text-sm font-bold text-purple-600">
                                ₹{order.amount}
                            </span>
                        </div>

                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Win: ₹{order.potential_win}</span>
                            <span className="text-green-600 font-semibold">
                                {order.status || "Placed"}
                            </span>
                        </div>
                    </div>
                ))
            )}

            {/* ✅ PAGINATION */}
            <div className="flex justify-center items-center gap-3 mt-4">
                <button
                    onClick={handlePrev}
                    disabled={orderPage === 1}
                    className={`px-4 py-1 rounded text-sm font-medium ${orderPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300"
                        }`}
                >
                    Prev
                </button>

                <span className="text-sm font-semibold text-gray-700">
                    Page {orderPage}
                </span>

                <button
                    onClick={handleNext}
                    disabled={!hasNextPage}
                    className={`px-4 py-1 rounded text-sm font-medium ${!hasNextPage
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}