import React from "react";

export default function QuickActions({ sections, user, navigate, setShowSpin }) {
    const handleClick = (item) => {
        if (user && user?.id) {
            if (item.name === "Lucky Spin") {
                setShowSpin(true);
            } else {
                navigate(`/${item.nav}`);
            }
        } else {
            navigate("/Login");
        }
    };
    const quickItems = sections
        .filter(sec => sec.type === "quick_actions")
        .flatMap(sec => sec.items);
    if (!quickItems.length) return null;
    const getGridCols = () => {
        if (quickItems.length <= 2) return "grid-cols-2";
        if (quickItems.length === 3) return "grid-cols-3";
        if (quickItems.length === 4) return "grid-cols-4";
        return "grid-cols-4";
    };
    return (
        <div className={`grid ${getGridCols()} gap-4 px-4 mt-6 text-center`}>
            {quickItems?.map((item, index) => (
                <div
                    key={item.name}
                    onClick={() => handleClick(item)}
                    className="transform transition duration-300 ease-out opacity-0 animate-fadeInUp"
                    style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: "forwards",
                    }}
                >
                    <div className="w-12 h-12 mx-auto flex items-center justify-center overflow-hidden cursor-pointer hover:scale-110 transition">
                        <img
                            src={item.img}
                            alt={item.name}
                            style={{
                                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                                borderRadius: "8px",
                            }}
                            className="w-full h-full object-contain "
                        />
                    </div>

                    <p className="cursor-pointer text-xs mt-1 text-gray-600 font-medium">
                        {item.name}
                    </p>
                </div>
            ))}
        </div>
    );
}