import React, { useEffect } from "react";

export default function WinToast({
  show,
  onClose,
  autoClose = true,
  duration = 3000,
  totalamount,
  winToast = {},
}) {
  if (!show) return null;
  const amounts = winToast?.amounts || [];
  const isMulti = amounts.length > 1;
  const total =
    totalamount ||
    winToast?.totalamount ||
    amounts.reduce((sum, a) => sum + Number(a?.win || a || 0), 0);
  useEffect(() => {
    if (show && autoClose) {
      const timer = setTimeout(() => {
        // onClose && onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, duration, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>

      {/* PARTICLES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <span
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* MAIN CARD */}
      <div
        className="relative z-10 w-[390px] max-h-[75vh] overflow-hidden
        bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500
        text-black px-6 py-5 rounded-[28px]
        shadow-[0_0_40px_rgba(255,215,0,0.7)]
        text-center animate-[scaleIn_0.3s_ease]"
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-black font-bold text-lg"
        >
          ✕
        </button>
        <div className="text-xl font-extrabold tracking-wide">
          🎉 {isMulti ? "MULTI WIN" : "JACKPOT"} 🎉
        </div>
        {/* TOTAL */}
        <div className="text-3xl font-black mt-2 text-green-900 drop-shadow">
          ₹{winToast?.totalamount}
        </div>
        <div className="mt-5">
          {isMulti ? (
            // ✅ MULTI GRID
            <>
              <div className="grid grid-cols-3 gap-3 max-h-[350px] overflow-y-auto pr-1">
                {amounts.map((amt, i) => {
                  const value = Number(amt?.win);
                  return (
                    <div
                      key={i}
                      className="h-[70px] bg-gradient-to-br from-yellow-200 to-orange-400 
                      rounded-xl flex flex-col items-center justify-center shadow-md"
                    >
                      <span className="text-[10px] opacity-70">
                        #{i + 1}
                      </span>
                      <span className="text-lg font-bold text-green-900">
                        ₹{value}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="text-xs mt-3 font-semibold text-gray-800">
                {amounts.length} Spins Completed 🎯
              </div>
            </>
          ) : (
            // ✅ SINGLE BIG CARD
            <div className="flex justify-center mt-4">
              <div
                className="w-[140px] h-[140px]
                bg-gradient-to-br from-yellow-200 to-orange-400
                rounded-2xl flex flex-col items-center justify-center
                shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
              >
                <span className="text-sm opacity-70">#1</span>
                <span className="text-3xl font-extrabold text-green-900">
                  ₹{Number(amounts[0]?.win || amounts[0] || total)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="text-sm mt-4 font-semibold text-gray-900">
          {isMulti
            ? "Amazing! Multi Spins Completed 🎯"
            : "Congratulations! Big Win 🎊"}
        </div>
      </div>
    </div>
  );
}