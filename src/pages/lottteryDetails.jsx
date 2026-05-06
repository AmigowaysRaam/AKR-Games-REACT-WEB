import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { getSateResultDetails } from "../services/gameSevice";
import { ChevronLeft } from "lucide-react";

export default function LotteryDetail() {
    const { state } = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();

    const [history, setHistory] = useState([]);

    useEffect(() => {
        let parsedUser = null;

        try {
            const storedUser = localStorage.getItem("user");
            parsedUser = storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
            console.error("Invalid user in localStorage");
        }

        const fetchHistory = async () => {
            if (!parsedUser?.id) return;

            try {
                const res = await getSateResultDetails({
                    userId: parsedUser.id,
                    key: state?.key || id,
                });

                if (res?.success && Array.isArray(res.data)) {
                    setHistory(res.data);
                } else {
                    setHistory([]);
                }
            } catch (err) {
                console.error(err);
                setHistory([]);
            }
        };

        fetchHistory();
    }, [state, id]);

    const renderDigits = (num) => {
        if (!num) return null;

        const str = String(num);

        return (
            <div style={{ display: "flex", gap: 6 }}>
                {str.split("").map((d, i) => {
                    const colors = ["#9e9e9e", "#ff9800", "#2196f3", "#f44336", "#4caf50"];

                    return (
                        <div
                            key={i}
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background: colors[d % colors.length],
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: 13,
                                fontWeight: "bold",
                            }}
                        >
                            {d}
                        </div>
                    );
                })}
            </div>
        );
    };

    if (!state) {
        return (
            <div className="p-4 text-center">
                <p className="text-red-500">No data found</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-3 px-4 py-2 bg-purple-600 text-white rounded"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-gray-100 min-h-screen">

            {/* HEADER */}
            <div className="flex items-center justify-between bg-white p-4 shadow">
                <button onClick={() => navigate(-1)} className="text-purple-600 font-bold">
                    <ChevronLeft />
                </button>
            </div>

            {/* INFO CARD */}
            <div className="bg-white m-3 p-4 rounded shadow text-center">
                <h3 className="text-lg font-bold font-uppercase">{state?.name}</h3>
                <p className="text-gray-500">{state?.key}</p>
            </div>

            {/* TABLE HEADER */}
            <div className="bg-gray-200 flex justify-between px-4 py-2 font-semibold text-sm">
                <span>ISSUE</span>
                <span>NUMBER</span>
            </div>

            {/* LIST */}
            <div>
                {history.length === 0 ? (
                    <p className="text-center p-4 text-gray-500">No data available</p>
                ) : (
                    history.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white border-b p-3"
                        >
                            {/* ISSUE ROW */}
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <p className="font-semibold">{item.draw_no}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(item.result_date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* 1st Prize */}
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">1st Prize:</span>
                                {renderDigits(item.first_prize)}
                            </div>

                            {/* 2nd Prize */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">2nd Prize:</span>
                                {renderDigits(item.second_prize)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}