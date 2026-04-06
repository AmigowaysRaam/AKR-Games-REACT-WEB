import { useEffect, useState } from "react";

export default function Timer() {
  const [time, setTime] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 60));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#1c1c1c] p-4 rounded-xl text-center mb-4 text-white">
      <p className="text-gray-400">Time Left</p>
      <h2 className="text-3xl font-bold">{time}s</h2>
    </div>
  );
}   