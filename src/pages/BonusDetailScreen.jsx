import { useEffect, useState } from "react";
import { claimTaskBonus, getBonusDataList } from "../services/authService";
import GameLoader from "./LoaderComponet";
import { History } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BonusDetailScreen() {
    const [wallet, setWallet] = useState(0);
    const [bonusData, setbonusData] = useState(null);
    const [lodaing, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // ✅ Toast state as object
    const [toast, setToast] = useState({ message: "", type: "" });

    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const storedUser = localStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        await fetchChecinData(parsedUser?.id || null);
    };
    const fetchChecinData = async (userId) => {
        try {
            setLoading(true);
            const payload = userId ? { id: userId } : {};
            const res = await getBonusDataList(payload);

            if (res?.success) {
                setbonusData(res.data);
            }
        } catch (err) {
            console.log("API Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const openConfirm = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const showToast = (message, type = "success") => {
        setToast({ message, type });

        setTimeout(() => {
            setToast({ message: "", type: "" });
        }, 2500);
    };

    const handleClaim = async () => {
        if (!selectedTask) return;

        setShowModal(false);

        try {
            setLoading(true);

            const res = await claimTaskBonus({ task_id: selectedTask.id });

            if (res?.success) {
                showToast(res.message, "success");
                loadData();
            } else {
                showToast("Failed to claim reward", "error");
            }
        } catch (err) {
            console.log("API Error:", err);
            showToast("Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Bonus Details";
        const storedWallet = localStorage.getItem("wallet");
        setWallet(storedWallet || 0);
    }, []);

    if (lodaing) return <GameLoader />;

    const tasks = bonusData?.tasks || [];
    const message = bonusData?.message || "";
    const totalBonus = tasks.reduce(
        (sum, t) => sum + (t.bonus_amount || 0),
        0
    );

    return (
        <div style={{ background: "#f4a261", paddingBottom: "30%", position: "relative" }}>

            {/* HEADER */}
            <div style={{
                background: "linear-gradient(90deg, #e65100, #ff9800)",
                color: "#fff",
                padding: 16,
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <div style={{ fontSize: '75%' }}>REWARDS TASK CENTER</div>
                <div
                    onClick={() => navigate("/bonusclainhist")}
                    style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                >
                    <History size={18} />
                    <span style={{ marginLeft: 5, fontSize: 12 }}>History</span>
                </div>
            </div>

            {/* MESSAGE */}
            {message && (
                <div style={{ margin: 12, color: "#fff", fontSize: 13 }}>
                    {message}
                </div>
            )}

            {/* BONUS */}
            <div style={{ margin: 12, background: "#f1e5d6", borderRadius: 12, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 }}>
                    <span>Bonus</span>
                    <span>Wallet</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                    <div>₹ {totalBonus}</div>
                    <div>{wallet}</div>
                </div>
            </div>

            {/* TASKS */}
            <div style={{ margin: 12, background: "#fff", borderRadius: 12, padding: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 20 }}>Task List</div>

                {tasks.length === 0 ? (
                    <div style={{ marginTop: 100, color: "#999", textAlign: "center" }}>
                        <div style={{ fontSize: 40 }}>📭</div>
                        <div>All Empty</div>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div key={task.id} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "10px 0",
                            borderBottom: "1px solid #eee",
                        }}>
                            <div>
                                <div style={{ fontWeight: 600 }}>{task.title}</div>
                                <div style={{ fontSize: 12, color: "#777" }}>Day {task.day}</div>
                            </div>

                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontWeight: "bold" }}>{task.display}</div>

                                {task.is_claimable ? (
                                    <button
                                        onClick={() => openConfirm(task)}
                                        style={{
                                            marginTop: 4,
                                            background: "#4caf50",
                                            color: "#fff",
                                            padding: "4px 10px",
                                            borderRadius: 6,
                                            border: "none"
                                        }}
                                    >
                                        Claim
                                    </button>
                                ) : (
                                    <span style={{ fontSize: 12, color: "#999" }}>
                                        {task.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.6)",
                        backdropFilter: "blur(4px)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 999,
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            padding: "22px 18px",
                            borderRadius: 14,
                            width: 300,
                            textAlign: "center",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                            animation: "scaleIn 0.2s ease",

                        }}
                    >
                        {/* Icon */}
                        <div style={{ fontSize: 36, marginBottom: 8 }}>🎁</div>
                        {/* Title */}
                        <p style={{ fontWeight: 700, fontSize: 15 }}>
                            Claim Reward
                        </p>
                        <p style={{ fontSize: 13, color: "#555", marginTop: 6 }}>
                            Claim your reward of{" "}
                            <span style={{ fontWeight: 700, color: "#e65100" }}>
                                {selectedTask?.display}
                            </span>
                            ?
                        </p>
                        <div
                            style={{
                                marginTop: 18,
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 10,
                            }}
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    flex: 1,
                                    padding: "8px 0",
                                    borderRadius: 8,
                                    border: "1px solid #ddd",
                                    background: "#f5f5f5",
                                    cursor: "pointer",
                                    fontSize: 13,
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleClaim}
                                style={{
                                    flex: 1,
                                    padding: "8px 0",
                                    borderRadius: 8,
                                    border: "none",
                                    background: "linear-gradient(90deg, #ff9800, #f57c00)",
                                    color: "#fff",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontSize: 13,
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>

                    {/* Animation keyframes */}
                    <style>
                        {`
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}
                    </style>
                </div>
            )}
            {toast?.message && (
                <div style={{
                    position: "fixed",
                    top: '10%',
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: toast.type === "error" ? "#d32f2f" : "green",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: 20,
                    zIndex: 1000,

                }}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}