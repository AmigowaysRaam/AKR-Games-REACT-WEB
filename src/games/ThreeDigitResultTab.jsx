import { useEffect, useState } from "react";
import { getThreeDigitGameResult } from "../services/gameSevice";

function ResultBall({ value, color }) {
    const colors = {
        A: "bg-red-500",
        B: "bg-orange-400",
        C: "bg-blue-600",
    };

    return (
        <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${colors[color]}`}
        >
            {value}
        </div>
    );
}

export default function ThreeDigittHistoryTable({ gameId }) {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const perPage = 10;

    useEffect(() => {
        fetchResults();
    }, [gameId]);

    const fetchResults = async () => {
        try {
            setLoading(true);
            setError("");

            // ✅ If gameId exists send it, else fetch all
            const payload = gameId ? { gameId: Number(gameId) } : {};

            const res = await getThreeDigitGameResult(payload);

            if (!res?.success) {
                throw new Error("Invalid API response");
            }
           

          const mapped =
  res?.data?.flatMap((game) =>
    game.todaySessions.map((session) => {
      const result = session?.result;

      return {
        gameName: game?.gameName ,
        issue: session?.sessionCode || "-",
        time: session?.startTime
          ? new Date(session.startTime).toLocaleTimeString()
          : "--",
        a: session.resultDeclared ? result?.resultA : "*",
        b: session.resultDeclared ? result?.resultB : "*",
        c: session.resultDeclared ? result?.resultC : "*",
      };
    })
  ) || [];

            setData(mapped);
        } catch (err) {
            console.log("result error", err);
            setData([]);
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
    }, [data]);

    const totalPages = Math.ceil(data.length / perPage);
    const start = (page - 1) * perPage;
    const pagedData = data.slice(start, start + perPage);

    return (
        <>
            <table className="w-full text-sm mt-2">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">
                            Issue
                        </th>
                        <th className="text-center py-2 text-xs text-gray-400 font-semibold">
                            Time
                        </th>
                        <th className="py-2 pr-2">
                            <div className="flex gap-1 justify-end">
                                <ResultBall value="A" color="A" />
                                <ResultBall value="B" color="B" />
                                <ResultBall value="C" color="C" />
                            </div>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {/* 🔄 LOADING */}
                    {loading ? (
                        <tr>
                            <td colSpan="3" className="text-center py-8">
                                <div className="flex justify-center items-center gap-2 text-gray-400">
                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
                                    Loading results...
                                </div>
                            </td>
                        </tr>
                    ) : error ? (
                        /* ❌ ERROR */
                        <tr>
                            <td colSpan="3" className="text-center py-8 text-red-400">
                                <div className="flex flex-col items-center gap-2">
                                    <span>{error}</span>
                                    <button
                                        onClick={fetchResults}
                                        className="text-xs px-3 py-1 bg-purple-600 text-white rounded"
                                    >
                                        Retry
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        /* ⚠️ EMPTY */
                        <tr>
                            <td colSpan="3" className="text-center py-8 text-gray-400">
                                No result available
                            </td>
                        </tr>
                    ) : (
                        /* ✅ DATA */
                        pagedData.map((r, i) => (
                            <tr key={i} className="border-t border-gray-50">
                                <td className="py-2 px-2 text-xs text-gray-500">
                                    {r.gameName}
                                </td>
                                <td className="py-2 text-center text-xs text-gray-500">
                                    {r.time}
                                </td>
                                <td className="py-2 pr-2">
                                    <div className="flex gap-1 justify-end">
                                        <ResultBall value={r.a} color="A" />
                                        <ResultBall value={r.b} color="B" />
                                        <ResultBall value={r.c} color="C" />
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* 📄 PAGINATION */}
            {!loading && !error && data.length > 0 && (
                <div className="flex items-center justify-center gap-3 mt-4 text-sm">
                    <span className="text-gray-400 text-xs">
                        Total {data.length}
                    </span>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`w-7 h-7 rounded-full text-xs font-semibold ${
                                page === i + 1
                                    ? "bg-purple-600 text-white"
                                    : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() =>
                            setPage((p) => Math.min(p + 1, totalPages))
                        }
                        disabled={page === totalPages}
                        className="w-7 h-7 rounded-full border border-gray-200 text-gray-400 text-xs flex items-center justify-center hover:bg-gray-100 disabled:opacity-40"
                    >
                        ›
                    </button>
                </div>
            )}
        </>
    );
}