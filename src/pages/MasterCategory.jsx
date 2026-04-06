import React, { useEffect, useCallback } from "react";
import HotMatchesSection from "../components/HotMatches";
import ColorPredictionCard from "./colorPredictionCard";
import DiceSection from "../components/DiceGameCard";
import ThreeDigits from "../components/ThreeDigits";
import StateLottery from "../components/StateLottery";
import QuickRace from "../components/QuickRace";
import KeralaLottery from "../components/KeralaLottery";
import SattaMatka from "../components/SattaMatka";

/* 🔲 Card */
const Card = ({ item, isUpcoming }) => (
    <div
        className="rounded-xl overflow-hidden shadow"
        style={{
            background: item?.colorCode
                ? `linear-gradient(135deg, ${item.colorCode.join(",")})`
                : "#f3f4f6",
        }}
    >
        <div className="relative">
            <img
                src={
                    item?.img ||
                    "https://via.placeholder.com/300x150?text=Upcoming"
                }
                alt="card"
                className="w-full h-24 object-cover"
            />

            {isUpcoming && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold">
                        Upcoming
                    </span>
                </div>
            )}

            {item?.closed && (
                <img
                    src={item.closed}
                    alt="closed"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            )}
        </div>
    </div>
);

/* 🔲 Grid */
const Grid = ({ children }) => (
    <div className="grid grid-cols-2 gap-3 px-4 py-3">
        {children}
    </div>
);

/* 🔲 Upcoming Fallback */
const UpcomingGrid = () => {
    const dummy = new Array(4).fill(null);
    return (
        null
    );
};

export default function MasterCategoryScreen({
    currentCategory,
    setActiveTab,
}) {
    /* 🔥 SCROLL DETECTION */
    useEffect(() => {
        if (!currentCategory) return;

        const sections = document.querySelectorAll("[data-section]");

        const observer = new IntersectionObserver(
            (entries) => {
                let maxRatio = 0;
                let visible = null;

                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (entry.intersectionRatio > maxRatio) {
                            maxRatio = entry.intersectionRatio;
                            visible = entry.target.dataset.section;
                        }
                    }
                });

                if (visible) setActiveTab(visible);
            },
            {
                rootMargin: "-120px 0px -50% 0px",
                threshold: [0.2, 0.4, 0.6],
            }
        );

        sections.forEach((sec) => observer.observe(sec));

        return () => observer.disconnect();
    }, [currentCategory, setActiveTab]);

    /* 🔥 SWITCH RENDER */
    const renderSection = useCallback((key, items) => {
        // ✅ fallback if no data
        if (!items || items.length === 0) {
            return <UpcomingGrid />;
        }

        switch (key) {
            case "hot":
                return <HotMatchesSection matches={items} />;

            case "dice":
                return <DiceSection items={items} />;

            case "color":
                return items?.length ? (
                    <ColorPredictionCard item={items[0]} />
                ) : (
                    <UpcomingGrid />
                );

            case "threeDigits":
                return <ThreeDigits items={items} />;
                
            case "state":
                return <StateLottery items={items} />;

            case "quick":
                return <QuickRace items={items} />;

            case "kerala":
                return <KeralaLottery items={items} />;

            case "matka":
                return <SattaMatka items={items} />;
            default:
                return null;
        }
    }, []);
    if (!currentCategory) return null;
    return (
        <div>
            {currentCategory?.tabs?.map((t) => (
                <div
                    key={t.key}
                    id={`section-${t.key}`}
                    data-section={t.key}
                    className="scroll-mt-[120px]"
                >
                    {
                        t.key &&
                        <div className="flex items-center gap-2 px-4 mt-4">
                            <img
                                src="https://www.singamlottery.com/static/media/little.afa75a1cf123482228a9.webp"
                                alt="icon"
                                className="w-3 h-3 object-contain"
                            />
                            <h2 className="font-semibold text-lg">
                                {t.title}
                            </h2>
                        </div>
                    }

                    {/* 🔥 Section Content */}
                    {renderSection(t.key, t.items)}
                </div>
            ))}
        </div>
    );
}