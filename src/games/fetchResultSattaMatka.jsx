import React, { useEffect, useState } from "react";
import { getSattamAtkaResult } from "../services/gameSevice";

function SattaResutList({ marketKey }) {
    const [apiGameData, setApiGameData] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetchMainSattaMatka();
    }, [page, marketKey]);
    const fetchMainSattaMatka = async () => {
        try {
            setLoading(true);
            const res = await getSattamAtkaResult({
                key: marketKey,
                page: page,
                limit: 10,
            });

            if (res?.success) {
                setApiGameData(res.data || []);
                setPagination(res.pagination || null);
            } else {
                setApiGameData([]);
            }
        } catch (err) {
            console.log("Error fetching results", err);
            setApiGameData([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("en-IN");
    };

    const formatNumbers = (result) => {
        if (!result) return "***-**-***";
        if (result.open === "pending" || result.close === "pending") {
            return "***-**-***";
        }
        const open = result.open?.toString() || "";
        const close = result.close?.toString() || "";

        if (open.length < 3 || close.length < 3) {
            return "***-**-***";
        }

        return `${open.slice(0, 3)}-${open.slice(3, 5)}-${close.slice(-3)}`;
    };

    if (loading) {
        return (
            <div className="space-y-3 mt-4 animate-pulse">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="h-16 bg-gray-200 rounded-xl"
                    />
                ))}
            </div>
        );
    }

    // 🔹 Empty State
    if (!apiGameData || apiGameData?.length === 0) {
        return (
            <div className="mt-6 text-center text-gray-400 text-sm py-12">
                No result history available.
            </div>
        );
    }

    return (
        <div className="mt-4 space-y-4">
            {apiGameData.map((item, i) => (
                <div
                    key={item.slot_number || i}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition"
                >
                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-[12px] text-gray-900"
                            style={{
                                textTransform: "capitalize"
                            }}
                        >
                            {item.key?.replace("-", " ")}
                        </p>
                        <p className="text-xs text-gray-500">
                            {formatDate(item.result_date)}
                        </p>
                    </div>

                    {/* BODY */}
                    <div className="flex items-center justify-between">
                        {/* ISSUE */}
                        <div>
                            <p className="text-[11px] text-gray-400">Issue</p>
                            <p className="text-sm font-semibold text-gray-700">
                                #{item.slot_number}
                            </p>
                        </div>

                        {/* RESULT */}
                        <div className="text-center">
                            <p className="text-[11px] text-gray-400 mb-1">
                                Result
                            </p>
                            <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold px-4 py-1.5 rounded-full text-xs shadow-md tracking-wider">
                                {formatNumbers(item.result)}
                            </span>
                        </div>

                        {/* STATUS */}
                        <div className="text-right">
                            <p className="text-[11px] text-gray-400">Status</p>
                            <p className="text-xs font-medium text-green-500">
                                Declared
                            </p>
                        </div>
                    </div>
                </div>
            ))}

            {/* 🔹 PAGINATION */}
            {pagination && (
                <div className="flex items-center justify-between mt-4 px-2">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-1.5 text-xs bg-gray-100 rounded-lg disabled:opacity-40 hover:bg-gray-200"
                    >
                        Prev
                    </button>

                    <span className="text-xs text-gray-500">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>

                    <button
                        onClick={() =>
                            setPage((p) =>
                                p < pagination.totalPages ? p + 1 : p
                            )
                        }
                        disabled={page === pagination.totalPages}
                        className="px-4 py-1.5 text-xs bg-gray-100 rounded-lg disabled:opacity-40 hover:bg-gray-200"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default SattaResutList;