import Timer from "../components/Timer";
import { useState } from "react";

export default function Game() {
  const [amount, setAmount] = useState("");

  return (
    <div className="p-4 min-h-screen bg-[#0d0d0d] text-white">

      <h2 className="text-xl font-bold mb-4">Color Game</h2>

      <Timer />

      {/* Buttons */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <button className="bg-red-500 p-3 rounded-xl">Red</button>
        <button className="bg-green-500 p-3 rounded-xl">Green</button>
        <button className="bg-purple-500 p-3 rounded-xl">Violet</button>
      </div>

      {/* Input */}
      <input
        type="number"
        className="w-full p-3 rounded-xl bg-[#1c1c1c] mb-4 outline-none"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* Button */}
      <button className="w-full bg-yellow-500 text-black p-3 rounded-xl font-bold">
        Place Bet
      </button>

    </div>
  );
}   