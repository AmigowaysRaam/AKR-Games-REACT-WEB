import { useEffect, useState } from "react";
import API from "../api/api";
import { Wrench } from "lucide-react";
import { checkMaintaince, homeApi } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Maintenance() {
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const checkServer = async () => {
    try {
      setChecking(true);
      const res = await checkMaintaince({ name: "general" });
      if (res?.data) {
        const isMaintenance = res.maintenance; // ✅ correct
        if (!isMaintenance) {
          navigate("/"); // go back to home
        }
      }
    } catch (err) {
      console.log("Server still down", err);
    } finally {
      setChecking(false);
    }
  };
  useEffect(() => {
    const init = async () => {
      const res = await checkMaintaince({ name: "general" });
      if (!res.maintenance) {
        navigate("/"); // go back to home
      }
    };
    init();
  }, []);

  const fetchHome = async () => {
    try {
      const res = await checkMaintaince({ "name": "general" });
      if (res?.data) {
        if (res?.maintenance)
          navigate("/");
        ;  // if it is false back to home page
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchHome();
  }, []);

  // 🔥 Auto check every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      checkServer();
    }, 5000);

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
        <div className="text-sm text-yellow-400 mb-4">
          {checking ? "Checking server..." : "Server unavailable"}
        </div>
      </div>
    </div>
  );
}