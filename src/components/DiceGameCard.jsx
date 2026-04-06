import { useNavigate } from "react-router-dom";

// components/DiceSection.js
export default function DiceSection({ items = [] }) {
    if (!items.length) return null;
     const navigate = useNavigate();
    return (
        <div className="px-3 py-2">
            <div className="grid grid-cols-2 gap-3">
                {items.map((item) => (
                    <div
                    onClick={() => navigate('/dice')}
                        key={item.id}
                        className="rounded-sm p-8 text-white relative overflow-hidden"
                        style={{
                            backgroundImage: `url(${item.bgImage || item.img})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                    >
                        <div className="relative z-10 top-6">
                            <button className="mt-16 w-full bg-white/20  rounded-sm py-2 text-xs font-bold">
                                Play Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}