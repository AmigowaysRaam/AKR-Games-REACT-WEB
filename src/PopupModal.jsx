import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getPopdata } from "./services/authService";
export default function PopupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const POPUP_EXPIRY = 6 * 60 * 60 * 1000; // 6 hours

  const getPopupHash = (images) => {
    return images.map((img) => img.src).join("|");
  };

  const handleNext = () => {
    if (current === images.length - 1) {
      const hash = getPopupHash(images);
      localStorage.setItem("popup_last_closed", Date.now().toString());
      localStorage.setItem("popup_data_hash", hash);
      setAnimate(false);
      setTimeout(() => setIsOpen(false), 250);
    } else {
      setAnimate(false);
      setTimeout(() => {
        setCurrent((prev) => prev + 1);
        setAnimate(true);
      }, 150);
    }
  };

  const openPopup = () => {
    setTimeout(() => {
      setIsOpen(true);
      setAnimate(true);
    }, 500);
  };

  useEffect(() => {
    if (!loading && images.length > 0) {
      const lastClosed = localStorage.getItem("popup_last_closed");
      const oldHash = localStorage.getItem("popup_data_hash");

      const newHash = getPopupHash(images);

      // ✅ If images changed → show immediately
      if (oldHash !== newHash) {
        openPopup();
        return;
      }

      // ✅ If same → check 6 hour expiry
      if (lastClosed) {
        const diff = Date.now() - parseInt(lastClosed, 10);
        if (diff < POPUP_EXPIRY) return;
      }

      openPopup();
    }
  }, [loading, images]);

  const fetchHome = async () => {
    try {
      const res = await getPopdata();
      // console.log("API RESPONSE:", res);
      if (res?.success && res?.popups?.length > 0 && res?.show) {
        const formatted = res.popups.map((item, index) => ({
          id: item.id || index + 1,
          src: item.image,
        }));
        console.log(formatted, "Formatted Popup Data");
        setImages(formatted);
      } else {
        console.log("No popup to show");
        setImages([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchHome();
  }, []);
  useEffect(() => {
    if (!loading && images.length > 0) {
      const lastClosed = localStorage.getItem("popup_last_closed");
      if (lastClosed) {
        const diff = Date.now() - parseInt(lastClosed, 10);
        if (diff < POPUP_EXPIRY) return;
      }
      const timer = setTimeout(() => {
        setIsOpen(true);
        setAnimate(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, images]);
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  if (loading) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!isOpen || images.length === 0) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-sm px-4">
        <button
          onClick={handleNext}
          className="absolute -top-3 right-4 z-20 
          w-9 h-9 flex items-center justify-center
          rounded-full bg-white text-black shadow-lg
          hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <X />
        </button>
        <div
          className={`w-full rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 ${animate ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
        >
          <img
            key={images[current]?.id}
            src={images[current]?.src}
            alt="popup"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}