import { useEffect } from "react";
import { WifiOff } from "lucide-react";
import { checkMaintaince } from "../services/authService";
export default function ServerDown() {
    const handleRetry = () => {
        window.location.href = "/";
    };
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await checkMaintaince({ name: "general" });
                if (res) {
                    window.location.href = "/";
                }
            } catch (err) {
                console.log("Still down...");
            }
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center px-4">
            <div className="text-center max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-500/10 p-6 rounded-full">
                        <WifiOff className="text-red-400 w-12 h-12 animate-pulse" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">
                    Server Unreachable
                </h1>
                {/* Description */}
                <p className="text-gray-400 mb-6">
                    We can’t connect to the server right now. This might be due to
                    network issues or server downtime.
                </p>

                {/* Status */}
                <div className="text-sm text-red-400 mb-4">
                    Please check your connection or try again.
                </div>

                {/* Retry */}
                <button
                    onClick={handleRetry}
                    className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-400 transition"
                >
                    Retry
                </button>
            </div>
        </div>
    );
}