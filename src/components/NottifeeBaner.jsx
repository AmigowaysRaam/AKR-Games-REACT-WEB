import React, { useEffect, useRef, useState } from "react";
import { useBannerSlider } from "../hooks/useCountdown";
import { X } from "lucide-react";
import logo from "../assets/logo.png";

export default function NottifeeBaner({ api_data }) {
  const banners = [api_data?.bannerData];
  const { active, goTo } = useBannerSlider(banners.length, 3200);

  const [visible, setVisible] = useState(true);

  const touchStart = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);

  const STORAGE_KEY = "banner_closed_date";

  /* 👉 Check on load */
  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem(STORAGE_KEY);

    if (storedDate === today) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, []);

  /* 👉 Close handler */
  const handleClose = () => {
    const today = new Date().toDateString();
    localStorage.setItem(STORAGE_KEY, today);
    setVisible(false);
  };

  /* 👉 Touch */
  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;

    if (Math.abs(dx) > 40) {
      goTo(
        dx < 0
          ? (active + 1) % banners.length
          : (active - 1 + banners.length) % banners.length
      );
    }
    touchStart.current = null;
  };

  /* 👉 Mouse */
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    if (!isDragging.current) return;

    const dx = e.clientX - startX.current;

    if (Math.abs(dx) > 40) {
      goTo(
        dx < 0
          ? (active + 1) % banners.length
          : (active - 1 + banners.length) % banners.length
      );
    }

    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  if (!visible) return null;

  const b = banners[active];

  return (
    <div className="w-full">
      <div
        className="relative w-full overflow-hidden shadow-md"
        style={{ height: 72 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600" />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

        {/* Content */}
        <div className="relative flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center">
              <img
                src={b?.imageUrl || logo}
                alt="banner"
                className="w-9 h-9 object-contain"
              />
            </div>

            <div className="text-white leading-tight">
              <p className="text-sm font-semibold tracking-wide">
                {b?.title || ""}
              </p>
              <p className="text-[11px] opacity-90">
                {b?.subtitle || ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-white text-orange-600 text-xs px-4 py-1.5 rounded-full font-bold shadow hover:scale-105 active:scale-95 transition">
              {b?.button}
            </button>

            <button
              onClick={handleClose}
              className="text-white/90 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Bottom line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/30" />
      </div>
    </div>
  );
}