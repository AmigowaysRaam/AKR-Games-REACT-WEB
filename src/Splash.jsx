import React, { useEffect, useState } from "react";
import logo from "./assets/logo.png";

  export default function SplashScreen({ onFinish }) {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
     
    } catch (err) {
      console.error("ERROR:", err.response || err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[999] bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#1e3a8a] to-[#7c3aed]" />
      <div className="absolute w-[350px] h-[350px] bg-purple-600/30 blur-[120px] rounded-full animate-pulse" />

      {/* Content */}
      <div className="relative text-center flex flex-col items-center">

        {/* 🔥 Dynamic Logo */}
        <img
          src={settings?.logo || logo}
          alt="Logo"
          className="w-64 md:w-72 animate-logo"
        />

        {/* 🔥 Dynamic Title */}
        <h1 className="text-white text-3xl font-extrabold mt-6 tracking-widest animate-fade">
          {settings?.site_name || "AKR LOTTERY"}
        </h1>

        {/* 🔥 Dynamic Tagline */}
        <p className="text-gray-300 text-sm mt-2 animate-fade delay-200">
          {settings?.tagline || "Play Smart • Win Big • 2026 🚀"}
        </p>

      </div>
    </div>
  );
}