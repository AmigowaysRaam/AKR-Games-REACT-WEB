import { useState } from "react";

export default function Tabs() {
  const [active, setActive] = useState("TwoSide");

  const tabs = ["TwoSide","FishPrawnCrab","1Digit","2D","3D"];

  return (
    <div className="flex gap-4 border-b mt-3">
      {tabs.map(tab=>(
        <button
          key={tab}
          onClick={()=>setActive(tab)}
          className={`pb-2 text-sm font-semibold ${
            active === tab
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}