import { useEffect } from "react";

export default function QuickRace({ items = [] }) {
  useEffect(() => { 

  }, [items]);

  if (!items.length) return null;

  return (
    <div className="px-3 py-3">
      <div className="grid grid-cols-3 gap-3  cursor-pointer">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-xl text-white p-2 py-8 shadow-md relative overflow-hidden"
            style={{
              // background: `linear-gradient(135deg, ${item.colorCode?.join(",")})`,
              background: item.color_code,

            }}
          >
            {/* Logo */}
            <div className="flex justify-center mb-1">
              <img
                src={item.img}
                alt="lottery"
                className="h-18 object-contain"
              />
            </div>

            <div className="text-center">
              <h3
                className="text-sm font-bold leading-tight"
                style={{
                  textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
                }}
              >
                Race Car
              </h3>
              <p
                className="text-[16px]"
                style={{
                  textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
                }}
              >
                5 min
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}