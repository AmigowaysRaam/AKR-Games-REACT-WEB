import React, { useRef } from "react";
import { useBannerSlider } from "../hooks/useCountdown";

const banners = [
  {
    uri: "https://cdn.cloudstaticfile.com/manager/7fdee84ee3384812a9b8abb73e34fb6a.jpg",
    title: "Play 3Digit Lottery",
    subtitle: "LOW PRICE : SINGLE BOARD ₹10.5\nDOUBLE BOARD ₹11",
  },
  {
    uri: "https://cdn.cloudstaticfile.com/manager/9c6fce7b12834cdb9891c866089ab557.jpg",
    title: "Win Big Today",
    subtitle: "Try your luck now!",
  },
  {
    uri: "https://cdn.cloudstaticfile.com/manager/71de744f287448e1ac2efc64397ca948.webp",
    title: "Mega Jackpot",
    subtitle: "Don't miss out",
  },
  {
    uri: "https://cdn.cloudstaticfile.com/manager/d82131329c6043bda3ae7ecfcd38cd74.jpg"
  }
];

export default function BannerSlider() {
  const { active, goTo } = useBannerSlider(banners.length, 3200);

  const touchStart = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  // 👉 Touch
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

  // 👉 Mouse
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

  const b = banners[active];

  return (
    <div className="px-2 pt-1 pb-2">
      <div
        className="relative rounded-1xl overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: 150 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={b.uri}
          alt="banner"
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 " />
        {/* Dots */}
        {banners?.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${i === active
                  ? "w-5 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/40"
                  }`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}