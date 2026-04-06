import React, { useState } from "react";
import { categories, subTabs } from "../data/mockData";

// ─── WALLET QUICK BAR ─────────────────────────────────────────────────────────
export function WalletBar() {
  return (
    <div
      className="mx-4 my-3 rounded-2xl p-3 flex items-center justify-between gap-2"
      style={{
        background:
          "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(219,39,119,0.10))",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-base shadow-lg shadow-violet-500/30">
          💳
        </div>
        <div>
          <p className="text-white/40 text-xs">Wallet Balance</p>
          <p className="text-white font-black text-base leading-tight">
            ₹0.00
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="px-3 py-1.5 rounded-xl text-xs font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          }}
        >
          + Deposit
        </button>
        <button className="px-3 py-1.5 rounded-xl text-xs font-bold text-white/70 border border-white/10">
          Withdraw
        </button>
      </div>
    </div>
  );
}

// ─── CATEGORY ROW ─────────────────────────────────────────────────────────────
export function CategoryRow() {
  const [active, setActive] = useState("Lottery");

  const categoryList = ["Lottery", "Casino", "Live", "Scratch", "Sports"];

  return (
    <div className="px-3 mt-3">
      <div className="flex justify-between">
        {categoryList.map((item) => (
          <div
            key={item}
            onClick={() => setActive(item)}
            className="flex flex-col items-center cursor-pointer"
          >
            {active === item && (
              <div className="w-10 h-1 bg-purple-600 rounded-full mb-1"></div>
            )}

            <div
              className={`w-16 h-16 rounded-full bg-white flex items-center justify-center
              shadow-sm border border-gray-100
              ${active === item ? "shadow-md scale-105" : ""}
              transition-all duration-200`}
            >
              <img
                src="https://via.placeholder.com/40"
                alt={item}
                className="w-10 h-10 object-contain"
              />
            </div>
            <p
              className={`text-xs mt-1 ${
                active === item
                  ? "text-black font-medium"
                  : "text-gray-500"
              }`}
            >
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
export function Divider({ icon, title, action }) {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <span className="text-black font-bold text-sm">{title}</span>
      </div>
      {action && (
        <button className="text-violet-400 text-xs font-semibold hover:text-violet-300 transition-colors">
          {action} →
        </button>
      )}
    </div>
  );
}
export function SubTabs({ active, onChange }) {
  const tabs = ["hot", "dice", "color", "3digit", "lottery"];
  const labels = {
    hot: "Hot Matches",
    dice: "Dice",
    color: "Color",
    "3digit": "3Digits",
    lottery: "State Lottery",
    klottery: "Kerala Lottery",

  };
  return (
    <div className="flex gap-5 px-4 mt-3 overflow-x-auto bg-white py-2 sticky top-0 z-10">
      {tabs.map((tab) => (
        <div
          key={tab}
          onClick={() => onChange(tab)}
          className="cursor-pointer"
        >
          <p
            className={`text-sm ${
              active === tab
                ? "text-black font-semibold"
                : "text-gray-400"
            }`}
          >
            {labels[tab]}
          </p>
          {active === tab && (
            <div className="h-1 bg-purple-600 mt-1 rounded-full"></div>
          )}
        </div>
      ))}
    </div>
  );
}