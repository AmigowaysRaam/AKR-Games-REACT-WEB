import React, { useEffect, useCallback, useState } from "react";
import HotMatchesSection from "../components/HotMatches";
import ColorPredictionCard from "./colorPredictionCard";
import DiceSection from "../components/DiceGameCard";
import ThreeDigits from "../components/ThreeDigits";
import StateLottery from "../components/StateLottery";
import QuickRace from "../components/QuickRace";
import KeralaLottery from "../components/KeralaLottery";
import SattaMatka from "../components/SattaMatka";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
    const [headerHeight, setHeaderHeight] = useState(0);
    useEffect(() => {
        const header = document.getElementById("main-header"); // give your header this id
        if (header) {
            setHeaderHeight(header.offsetHeight);
        }
        const handleResize = () => {
            if (header) setHeaderHeight(header.offsetHeight);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
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

    const renderSection = useCallback((key, items) => {
        if (!items || items.length === 0) {
            return <UpcomingGrid />;
        }
        console.log("Rendering section:", key, "with items:", items);
        switch (key) {
            case "hot-match":
                return <HotMatchesSection matches={items} />;
            case "dice":
                return <DiceSection items={items} />;
            case "color":
                return items?.length ? (
                    <ColorPredictionCard item={items[0]} />
                ) : (
                    <UpcomingGrid />
                );
            case "3-digit":
                return <ThreeDigits items={items} />;

            case "statelottery":
                return <StateLottery items={items} />;

            case "car":
                return <QuickRace items={items} />;

            case "keralalottery":
                return <KeralaLottery items={items} />;

            case "matka":
                return <SattaMatka items={items} />;
            default:
                return null;
        }
    }, []);
    if (!currentCategory) return null;
    return (
        <div className="pb-10">
            {/* <p>{JSON.stringify(currentCategory?.tabs,null,2)}</p> */}
            {currentCategory?.tabs?.map((t) => (
                <div
                    key={t.key}
                    id={`section-${t.key}`}
                    data-section={t.key}
                    className="scroll-mt-[122px]"
                // style={{ scrollMarginTop: `${headerHeight + 35}px` }}
                >
                    {
                        t?.key &&

                        <div className="flex items-center justify-between px-4 mt-4">
                            <div className="flex items-center gap-2">
                                <img
                                    src="https://www.singamlottery.com/static/media/little.afa75a1cf123482228a9.webp"
                                    alt="icon"
                                    className="w-3 h-3 object-contain"
                                />
                                <h2 className="font-semibold text-lg">
                                    {t.title}
                                </h2>
                            </div>
                            {
                                t?.key === 'hot-match' && (
                                    <span onClick={() => navigate('/hotmatchscreen')} className="text-md cursor-pointer font-indigo px-2">
                                        All
                                    </span>
                                )
                            }

                        </div>
                    }

                    {renderSection(t.key, t.items)}
                </div>
            ))}
        </div>
    );
}