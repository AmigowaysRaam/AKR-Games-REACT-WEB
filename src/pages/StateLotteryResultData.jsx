import { useEffect, useState } from "react";
import { getSateResultMain } from "../services/gameSevice";
import { useNavigate } from "react-router-dom";

export default function StateLotteryResult() {
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const LIMIT = 12;

    useEffect(() => {
        let parsedUser = null;

        try {
            const storedUser = localStorage.getItem("user");
            parsedUser = storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
            console.error("Invalid user in localStorage");
        }

        const fetchHistory = async () => {
            if (!parsedUser?.id) {
                setError("User not found");
                setHistory([]);
                return;
            }

            setLoading(true);
            setError("");

            try {
                const res = await getSateResultMain({
                    userId: parsedUser.id,
                    limit: LIMIT,
                    page: page,
                });

                if (!res || !res.success || !Array.isArray(res.data)) {
                    setHistory([]);
                    setHasNext(false);
                    setError("Invalid response from server");
                    return;
                }

                setHistory(res.data);
                setHasNext(res.data.length === LIMIT);

            } catch (err) {
                console.error(err);
                setError("Something went wrong!");
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [page]);

    return (
        <div className="max-w-2xl mx-auto p-4">

            {/* Loading */}
            {loading && (
                <div className="space-y-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse p-4 rounded-lg bg-gray-300 h-16" />
                    ))}
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="text-red-500 text-center mb-4">
                    {error}
                </div>
            )}

            {/* Empty */}
            {!loading && !error && history.length === 0 && (
                <div className="text-center text-gray-500">
                    No results found
                </div>
            )}

            {/* List */}
            {!loading && history.length > 0 && (
                <div className="space-y-2">
                    {history.map((item, index) => {
                        const name = item?.name || "Unknown";
                        const image = item?.image || "https://via.placeholder.com/50";
                        const date = item?.last_result
                            ? new Date(item.last_result?.draw_no).toLocaleDateString()
                            : "- - - - ";

                        return (
                            <div
                                key={item.id || index}
                                onClick={() =>
                                    navigate(`/lotterydetails/${item.id}`, {
                                        state: item, // ✅ pass full object
                                    })
                                }
                                className="flex items-center gap-3 p-1 bg-white border rounded-lg shadow cursor-pointer hover:bg-gray-100 transition"
                            >
                                <img
                                    src={image}
                                    alt={name}
                                    className="w-10 h-10 rounded-full object-cover border"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/50";
                                    }}
                                />

                                <div>
                                    <div className="font-semibold text-[12px] text-black-900">
                                        {name}
                                    </div>
                                    <div className="text-[10px] text-gray-900">
                                        {date}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            <div className="flex items-center justify-between mt-6">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold ${page === 1
                        ? "bg-gray-300 text-gray-500"
                        : "bg-purple-600 text-white"
                        }`}
                >
                    ← Prev
                </button>
                <div className="text-sm font-semibold text-gray-600">
                    Page {page}
                </div>
                <button
                    disabled={!hasNext}
                    onClick={() => setPage((p) => p + 1)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold ${!hasNext
                        ? "bg-gray-300 text-gray-500"
                        : "bg-purple-600 text-white"
                        }`}
                >
                    Next →
                </button>
            </div>
        </div>
    );
}