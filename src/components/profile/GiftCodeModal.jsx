import { X, Gift, CheckCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getCodeRedeem } from "../../services/authService";

export default function GiftCodeModal({ open, onClose, code, setCode, loadData }) {
    const [animate, setAnimate] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);
    const [coupon, setCoupon] = useState(null);
    const [progress, setProgress] = useState(100);
    const [redeemMessage, setredeemMessage] = useState('Successfully Redeemed!');
    const resultAudioRef = useRef(null);
    useEffect(() => {

        resultAudioRef.current = new Audio("/sounds/pointsCollcect.mp3");
    }, []);
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);
    useEffect(() => {
        if (open) {
            setMounted(true);
            setAnimate(false); setSuccess(false);
            setError(""); setLoading(false);
            setCoupon(""); setProgress(100);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimate(true);
                });
            });
        } else {
            setAnimate(false);
            const t = setTimeout(() => {
                setMounted(false); setCsetCouponode("");
            }, 250);
            return () => clearTimeout(t);
        }
    }, [open]);
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);
    const validateCode = (value) => value?.trim().length >= 4;
    const startAutoClose = () => {
        const duration = 2000;
        const step = 50;
        let elapsed = 0;
        intervalRef.current = setInterval(() => {
            elapsed += step;
            const pct = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(pct);
        }, step);

        timeoutRef.current = setTimeout(() => {
            onClose();
        }, duration);
    };
    const handleSubmit = async () => {
        setError("");
        if (!validateCode(coupon)) {
            setError("Code must be at least 4 characters");
            return;
        }
        try {
            setLoading(true);
            const res = await getCodeRedeem({
                user_id: JSON.parse(localStorage.getItem("user"))?.id,
                action: "claim_code",
                code: coupon,
            });
            console.log("Redeem Response:", res);
            if (!res?.success) {
                setError(res?.message || res?.error || "Invalid code");
                setLoading(false);
                return;
            }
            else {
                setredeemMessage(res?.message || "Successfully Redeemed!");
                setCode(coupon);
                setTimeout(() => {
                    setSuccess(true);
                    setLoading(false);
                    setProgress(100);
                    startAutoClose();
                }, 800);
            }

        } catch (e) {
            console.error("Redeem Error:", e.response?.data || e.message);
            setError("Something went wrong. Try again.");
            setLoading(false);
        }
    };
    if (!mounted) return null;
    return (
        <div
            onClick={(e) => e.target === e.currentTarget && onClose()}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
        >
            <div
                className={`
relative w-[92%] max-w-sm rounded-3xl p-6 text-white
bg-gradient-to-b from-[#1b0033] via-[#2a0a4a] to-[#120022]
border ${error ? "border-red-500/50" : "border-purple-500/40"}
shadow-[0_0_60px_rgba(${error ? "239,68,68,0.6" : "168,85,247,0.45"})]
transition-all duration-300 ease-out
${animate ? "scale-100 opacity-100" : "scale-90 opacity-0"}
`}
            >
                <div className="absolute inset-0 rounded-3xl blur-2xl opacity-40 bg-purple-600 -z-10" />
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-white/70 hover:text-white"
                >
                    <X size={20} />
                </button>
                <div className="flex flex-col items-center mb-5">
                    <div
                        className={`
              w-14 h-14 rounded-full flex items-center justify-center
              border shadow-lg transition-all duration-300
              ${success
                                ? "bg-green-500/20 border-green-400"
                                : "bg-purple-500/20 border-purple-400 animate-pulse"
                            }
            `}
                    >
                        {success ? (
                            <CheckCircle className="text-green-300" size={26} />
                        ) : (
                            <Gift className="text-purple-300" size={26} />
                        )}
                    </div>
                    <h2 className="mt-3 text-lg font-bold tracking-widest">
                        {success ? "REWARD UNLOCKED" : "REDEEM GIFT CODE"}
                    </h2>
                    <p className="text-xs text-white/60 mt-1">
                        {success
                            ? "Auto closing..."
                            : "Enter your code to unlock rewards"}
                    </p>
                </div>
                <input
                    maxLength={20}
                    disabled={success || loading}
                    value={coupon || ""}
                    onChange={(e) => {
                        setCoupon(
                            e.target.value
                                .toUpperCase()
                                .replace(/[^A-Z0-9-]/g, "")
                        ),
                            setError("")
                    }
                    }
                    placeholder="Enter code"
                    className="
            w-full px-4 py-3 mb-2 rounded-xl
            bg-white/10 text-white placeholder-white/40
            border border-white/10
            outline-none
            focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40
            transition
            tracking-widest text-center
            disabled:opacity-50"
                />
                {error && (
                    <p className="text-red-400 text-sm font-bold mb-3 text-center">{error}</p>
                )}
                <button
                    onClick={handleSubmit}
                    disabled={loading || success}
                    className={`
            w-full py-3 rounded-xl font-semibold tracking-wide
            transition-all duration-300
            ${success
                            ? "bg-green-500"
                            : loading
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 hover:scale-[1.03] active:scale-95"
                        }
            shadow-lg
          `}
                >
                    {success ? "✔ Claimed" : loading ? "Checking..." : "Unlock Reward"}
                </button>
                {success && (
                    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-xl bg-black/40 rounded-3xl">
                        <div className="absolute inset-0 bg-green-500/10 animate-pulse rounded-3xl" />

                        <div className="z-10 bg-white/10 backdrop-blur-xl border border-green-400/40 px-6 py-5 rounded-2xl text-center shadow-lg w-[80%]">
                            <div className="text-4xl mb-2">🎉</div>
                            <h3 className="text-green-300 font-bold text-lg">
                                {redeemMessage}
                            </h3>
                            <div className="mt-3 w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}