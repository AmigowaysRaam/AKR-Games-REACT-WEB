import { useEffect, useState } from "react";
import API from "../api/api";
import { Wrench } from "lucide-react";

export default function Maintenance() {
  const [checking, setChecking] = useState(false);

  // 🔥 Function to check server status
  const checkServer = async () => {
    try {
      setChecking(true);

      const res = await API.post("?url=home"); // or use health API

      // ✅ If API responds normally → go back
      if (!res?.data?.maintenance) {
        window.location.href = "/";
      }
    } catch (err) {
      console.log("Still in maintenance...");
    } finally {
      setChecking(false);
    }
  };

  // 🔥 Auto check every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      checkServer();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-500/10 p-6 rounded-full">
            <Wrench className="text-yellow-400 w-12 h-12 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-3">
          Under Maintenance
        </h1>

        <p className="text-gray-400 mb-6">
          We’re fixing things. Please wait or retry.
        </p>

        {/* Status */}
        <div className="text-sm text-yellow-400 mb-4">
          {checking ? "Checking server..." : "Server unavailable"}
        </div>

        {/* Retry Button */}
        <button
          onClick={checkServer}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 rounded-xl transition"
        >
          {checking ? "Checking..." : "Retry Now"}
        </button>

      </div>
    </div>
  );
}