// components/colorPredictionCard.js

import { useNavigate } from "react-router-dom";

export default function ColorPredictionCard({ item }) {
  const navigate = useNavigate();
  if (!item) return null;
  return (
    <div className="px-4 py-3" onClick={() => navigate('/color')}>
      <div className="relative rounded-xl overflow-hidden">
        <img
          src={item.img}
          className="w-full h-35 object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-4">
          <h2 className="text-white font-bold text-lg">
            {item.title}
          </h2>
          {item.timings && (
            <p className="text-white text-xs mt-1">
              {item.timings.join(" · ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}