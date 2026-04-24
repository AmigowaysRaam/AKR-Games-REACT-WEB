import { useEffect, useState } from "react";
import { getOtpLogin, getWithdrawOtpLogin } from "../services/authService";

export default function WithdrawConfirmModal({
    open,
    onCancel,
    onConfirm,
    preview,
    selectedBankId
}) {
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    // 🔥 Toast state
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "error",
    });

    const showToast = (message, type = "error") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: "", type: "error" });
        }, 2000);
    };

    // ✅ RESET WHEN CLOSED
    useEffect(() => {
        if (!open) {
            setOtp("");
            setOtpSent(false);
            setLoading(false);
            setTimer(0);
            setToast({ show: false, message: "", type: "error" });
        }
    }, [open]);

    // ⏳ Timer countdown
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    if (!open) return null;
    const handleGetOtp = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.phone || user.phone.length < 10) {
            showToast("Invalid phone number");
            return;
        }

        try {
            setLoading(true);
            const res = await getWithdrawOtpLogin(
                user.phone,
                user.country_code,
                "withdraw",
                selectedBankId,
                preview?.amount
            );

            if (res?.success) {
                showToast(res?.message || "OTP sent", "success");
                setOtpSent(true);
                setTimer(30);
            } else {
                showToast(res?.message, "error");
                setOtpSent(false);
            }
        } catch (err) {
            showToast(
                err?.response?.data?.message || "Something went wrong",
                "error"
            );
            setOtpSent(false);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        if (!otp || otp.length < 4) {
            showToast("Enter valid OTP");
            return;
        }

        onConfirm(otp);
    };

    return (
        <>
            {/* 🔥 TOAST */}
            {toast.show && (
                <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100]">
                    <div
                        className={`px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-lg ${toast.type === "success"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                    >
                        {toast.message}
                    </div>
                </div>
            )}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">

                <div className="bg-white w-[90%] max-w-sm rounded-2xl p-5 shadow-xl animate-scaleIn">

                    {/* TITLE */}
                    <h2 className="text-lg font-semibold mb-1">
                        Confirm Withdrawal
                    </h2>

                    <div className="mx-3 mt-3 bg-white rounded-xl p-4 text-sm">
                        <div className="flex justify-between py-1">
                            <span>Amount</span>
                            <span>₹ {preview.amount}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span>Fee</span>
                            <span>₹ {preview.fee}</span>
                        </div>
                        <div className="flex justify-between py-1 font-semibold text-green-600">
                            <span>Final</span>
                            <span>₹ {preview.final_amount}</span>
                        </div>
                    </div>

                    {/* 🔥 GET OTP */}
                    {!otpSent ? (
                        <button
                            onClick={handleGetOtp}
                            disabled={loading}
                            className="w-full py-2 rounded-lg bg-purple-600 text-white font-medium my-3 disabled:bg-gray-400"
                        >
                            {loading ? "Sending OTP..." : "Get OTP"}
                        </button>
                    ) : (
                        <>
                            <input
                                type="number"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value?.length <= 4) {
                                        setOtp(value);
                                    }
                                }}
                                className="w-full border rounded-lg px-3 py-2 text-center tracking-widest text-lg mb-3 outline-none focus:ring-2 focus:ring-purple-500"
                            />

                            {/* RESEND */}
                            <div className="text-xs text-gray-500 mb-3 text-center">
                                {timer > 0 ? (
                                    <span>Resend OTP in {timer}s</span>
                                ) : (
                                    <button
                                        onClick={handleGetOtp}
                                        className="text-purple-600 font-medium"
                                    >
                                        Resend OTP
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 mt-2">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 rounded-lg bg-gray-200"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleConfirm}
                            disabled={!otpSent || loading}
                            className={`px-4 py-2 rounded-lg text-white ${otpSent ? "bg-indigo-500" : "bg-gray-400"
                                }`}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>

            {/* ANIMATIONS */}
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }

                .animate-scaleIn {
                    animation: scaleIn 0.2s ease-out;
                }
                `}
            </style>
        </>
    );
}