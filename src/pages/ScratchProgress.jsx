import { useEffect, useRef, useState } from "react";

export default function GoldenProgressBar({ progresspercent = 0 }) {
    const [progress, setProgress] = useState(0);
    const animationRef = useRef(null);

    useEffect(() => {
        let start = null;
        const duration = 800; // animation duration (ms)
        const initial = progress;
        const target = progresspercent;

        // easeOutCubic (smooth finish)
        const ease = (t) => 1 - Math.pow(1 - t, 3);

        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progressRatio = Math.min(elapsed / duration, 1);
            const eased = ease(progressRatio);
            const value = Math.round(initial + (target - initial) * eased);
            setProgress(value);
            if (progressRatio < 1) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        cancelAnimationFrame(animationRef.current);
        animationRef.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationRef.current);
    }, [progresspercent]);

    return (
        <div className="w-full flex flex-col items-center justify-center px-6 mt-6">

            {/* Progress Wrapper */}
            <div className="relative w-full max-w-md h-6 rounded-full border-2 border-yellow-400 shadow-[0_0_12px_rgba(255,215,0,0.7)] overflow-hidden bg-black">

                {/* Gradient Fill */}
                <div
                    className="h-full flex items-center justify-center transition-[width] duration-300"
                    style={{
                        width: `${progress}%`,
                        background:
                            "linear-gradient(90deg, #facc15, #f97316, #ec4899, #8b5cf6)",
                    }}
                >
                    <span className="text-xs font-bold text-black drop-shadow">
                        {progress}%
                    </span>
                </div>

                {/* Glow Shine Animation */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="w-1/3 h-full bg-white/20 blur-md animate-shine" />
                </div>
                <div className="absolute inset-0 flex pointer-events-none">
                    {[1, 2, 3, 4].map((_, i) => (
                        <div key={i} className="flex-1 border-r border-yellow-300/40" />
                    ))}
                </div>
            </div>
            {/* Custom animation */}
            <style>
                {`
          @keyframes shine {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(900%); }
          }
          .animate-shine {
            animation: shine 0.9s linear infinite;
          }
        `}
            </style>
        </div>
    );
}