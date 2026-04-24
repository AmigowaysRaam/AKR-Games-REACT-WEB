import React, { useEffect, useRef, useState, useMemo } from "react";
import BannerSlider from "../components/BannerSlider";
import { TopBar } from "../components/TopBar";
import MasterCategoryScreen from "./MasterCategory";
import NottifeeBaner from "../components/NottifeeBaner";
import PopupModal from "../PopupModal";
import { homeApi } from "../services/authService";
export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [homedata, setHomeData] = useState(null);
  const [apiCategories, setApiCategories] = useState([]);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const isPulling = useRef(false);
  const triggerRef = useRef(null);
  const [dataFromChild, setDataFromChild] = useState("");
  const [closeSignal, setCloseSignal] = useState(false);
  useEffect(() => {
    if (closeSignal) {
      setCloseSignal(false); // reset after trigger
    }
  }, [closeSignal]);
  const handleAction = () => {
    setCloseSignal(true); // 👈 trigger child close
  };

  const handleChildData = (value) => {
    setDataFromChild(value);
  };

  // ✅ Categories from API only
  const categories = useMemo(() => {
    return Array.isArray(apiCategories) ? apiCategories : [];
  }, [apiCategories]);

  const fetchHome = async () => {
    try {
      const res = await homeApi();
      if (res?.data) {
        setHomeData(res.data);
        setApiCategories(res.data?.categories || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchHome();
  }, []);

  // ✅ Set default category/tab
  useEffect(() => {
    if (categories.length > 0) {
      setActiveCategory(categories[0]?.name || "");
      setActiveTab(categories[0]?.tabs?.[0]?.key || "");
    } else {
      setActiveCategory("");
      setActiveTab("");
    }
  }, [categories]);

  // ✅ Sticky tab
  useEffect(() => {
    const node = triggerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky((prev) => {
          const next = !entry.isIntersecting;
          return prev !== next ? next : prev;
        });
      },
      { threshold: 0 }
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  // ✅ Auto scroll active tab
  useEffect(() => {
    const el = document.querySelector(`[data-tab="${activeTab}"]`);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeTab]);

  const currentCategory = useMemo(
    () => categories.find((c) => c.name === activeCategory),
    [categories, activeCategory]
  );

  // ✅ Pull to refresh handlers
  const handleTouchStart = (e) => {
    if (window.scrollY === 0 && !isRefreshing) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  };

  const handleTouchMove = (e) => {
    if (!isPulling.current) return;

    const distance = (e.touches[0].clientY - startY.current) * 0.5;

    if (distance > 0) {
      setPullDistance(Math.min(distance, 100));
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance >= 100) {
      triggerRefresh();
    } else {
      setPullDistance(0);
    }
    isPulling.current = false;
  };

  const triggerRefresh = async () => {
    setIsRefreshing(true);
    await fetchHome();
    setIsRefreshing(false);
    setPullDistance(0);
    if (categories.length > 0) {
      setActiveCategory(categories[0]?.name || "");
      setActiveTab(categories[0]?.tabs?.[0]?.key || "");
    }
  };
  useEffect(() => {
    if (dataFromChild) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none"; // 👈 improves mobile behavior
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
  
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [dataFromChild]);
  return (
    <div
      className={`flex flex-col pb-24 max-w-[430px] mx-auto overflow-hidden }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <PopupModal />
      {dataFromChild && (
        <div
          className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
          onClick={() => {
            setDataFromChild(false);     // 👈 remove overlay
            setCloseSignal(true);        // 👈 trigger child close
          }}
        />
      )}
      <div
        style={{ height: pullDistance }}
        className="flex items-center justify-center transition-all duration-200"
      >
        {(pullDistance > 0 || isRefreshing) && (
          <div className="flex flex-col items-center text-xs text-black-500">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-1" />
            {isRefreshing ? "Refreshing..." : "Pull to refresh"}
          </div>
        )}
      </div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white">
        <TopBar sendDataToParent={handleChildData}
          onClosetheModal={closeSignal} // need to close the modal from the parent
        />
      </div>
      <div className="pt-[55px]">
        <NottifeeBaner api_data={homedata} />
        <BannerSlider />

        <div ref={triggerRef} />
        {categories.length > 0 && (
          <div className="flex gap-4 p-3  bg-gray-100 overflow-x-auto no-scrollbar">
            {categories?.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => {
                    if (!isActive) {
                      setActiveCategory(cat.name);
                      setActiveTab(cat.tabs?.[0]?.key || "");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className={`flex flex-col items-center justify-center min-w-[90px] p-3 rounded-2xl transition-all duration-300 ${isActive
                    ? "bg-gradient-to-br from-purple-500 via-fuchsia-500 to-indigo-500 text-white shadow-lg scale-105"
                    : "bg-white text-gray-600"
                    }`}
                >
                  <div
                    className={`w-14 h-14 flex items-center justify-center rounded-full ${isActive ? "bg-white/20 backdrop-blur-sm" : ""
                      }`}
                  >
                    <img
                      src={cat?.image || ""}
                      alt={cat?.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <span
                    className={`mt-2 text-sm font-semibold ${isActive ? "text-white" : "text-gray-500"
                      }`}
                  >
                    {cat?.name?.toUpperCase() || ""}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        <div
          className={`z-40 left-1/2 -translate-x-1/2 w-full  max-w-[430px] ${isSticky ? "fixed top-[56px]" : "relative "
            }`}
        >
          <div className="bg-white shadow">
            <div className="flex overflow-x-auto no-scrollbar px-3 py-3 gap-6">
              {currentCategory?.tabs?.length > 0 &&
                currentCategory.tabs.map((t) => (
                  <button
                    key={t.key}
                    data-tab={t.key}
                    onClick={() => {
                      // const element = document.getElementById(`section-${t.key}`);
                      // if (element) {
                      //   const yOffset = -2; // adjust based on your header + tabs height
                      //   const y =
                      //     element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      //   window.scrollTo({
                      //     top: y,
                      //     behavior: "smooth",
                      //   });
                      // }
                      setActiveTab(t.key);
                      setTimeout(() => {
                        const element = document.getElementById(`section-${t.key}`);
                        element?.scrollIntoView({ behavior: "smooth" });
                      }, 150);
                    }}
                    className="flex-shrink-0 text-sm relative pb-2 whitespace-nowrap"
                    style={{
                      color: activeTab === t.key ? "#6b21a8" : "#444",
                      fontWeight: activeTab === t.key ? "600" : "400",
                    }}
                  >
                    {t.title}
                    {activeTab === t.key && (
                      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-purple-700 rounded" />
                    )}
                  </button>
                ))}
            </div>
          </div>
        </div>
        <MasterCategoryScreen
          currentCategory={currentCategory}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
}