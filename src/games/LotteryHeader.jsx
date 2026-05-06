import React, { useEffect, useState } from "react";
import { getStateLottery } from "../services/gameSevice";
import { ResultBallRow } from "./ResultBall";

const COLUMN_LABELS = ["A", "B", "C", "D"];
const COLUMN_COLORS_LABEL = {
  A: "#F59E0B",
  B: "#3B82F6",
  C: "#EF4444",
  D: "#22C55E",
};

export default function LotteryHeader({ lottery, countdown, onRules ,onGameIdReady }) {
  const { hh, mm, ss, isUrgent } = countdown;
  const boxStyle = (isUrgent) => ({
  background: isUrgent ? "#EF4444" : "#1a1a2e",
  color: "#fff",
  fontSize: 14,
  fontWeight: 800,
  padding: "6px 8px",
  borderRadius: 6,
  minWidth: 40,
  textAlign: "center",
});


  const [apiLottery, setApiLottery] = useState(null);

  /* ───────── FETCH API ───────── */
useEffect(() => {
  const fetchData = async () => {
    const res = await getStateLottery({ key: lottery.key ?? lottery.id });
    console.log('getStateLottery response:', res);

    if (res.success && res.data) {
      const match = res.data; // ← direct object, NOT an array

      setApiLottery(match);
      
      const gid = match.game_id;
      console.log('game_id found:', gid);
      onGameIdReady?.(gid);
    }
  };
  fetchData();
}, [lottery.id, lottery.name]);
  /* ───────── MERGE DATA ───────── */
  const mergedLottery = {
    ...lottery,

    name: apiLottery?.name,
    image: apiLottery?.image ,
    drawNumber: apiLottery?.draw_no,

    prevResult: {
      "1st": apiLottery?.last_result?.first_prize
        ? apiLottery.last_result.first_prize.split("")
        : ["-", "-", "-", "-"],

      "2nd": apiLottery?.last_result?.second_prize
        ? apiLottery.last_result.second_prize.split("")
        : ["-", "-", "-", "-"],
    },

    key: apiLottery?.key || lottery.key,
  };
  useEffect(() => {
  const interval = setInterval(() => {
    const target = getTargetDateTime();
    if (!target) return;

    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      setTimeLeft({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isUrgent: true,
      });
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    setTimeLeft({
      days,
      hours,
      minutes,
      seconds,
      isUrgent: diff < 5 * 60 * 1000, // last 5 mins
    });
  }, 1000);

  return () => clearInterval(interval);
}, [apiLottery]);
  const [timeLeft, setTimeLeft] = useState({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isUrgent: false,
});
  const getTargetDateTime = () => {
  if (!apiLottery) return null;

  const dateStr = apiLottery.draw_no; // "07-05-2026"
  const timeStr = apiLottery.result_time; // "08:00 PM"

  if (!dateStr || !timeStr) return null;

  // Convert date
  const [day, month, year] = dateStr.split("-");
  
  // Convert time
  let [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");

  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return new Date(year, month - 1, day, hours, minutes, 0);
};

  return (
    <div
      style={{
        background: "#f5f5f5",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      {/* ── Name + Countdown ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #f8f8f8, #ececec)",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: logo + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* 🔥 IMAGE FROM API */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              overflow: "hidden",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img
              src={mergedLottery.image}
              alt={mergedLottery.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Name */}
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "#1a1a2e",
                fontFamily: "'Poppins',sans-serif",
              }}
            >
              {mergedLottery.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#888",
                marginTop: 1,
              }}
            >
              Draw No:{mergedLottery.drawNumber}
            </div>
          </div>
        </div>

        {/* Right: countdown */}
       <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
  {timeLeft.days > 0 && (
    <div style={boxStyle(timeLeft.isUrgent)}>
      {timeLeft.days}d
    </div>
  )}

  <div style={boxStyle(timeLeft.isUrgent)}>
    {String(timeLeft.hours).padStart(2, "0")}h
  </div>

  <div style={boxStyle(timeLeft.isUrgent)}>
    {String(timeLeft.minutes).padStart(2, "0")}m
  </div>

  <div style={boxStyle(timeLeft.isUrgent)}>
    {String(timeLeft.seconds).padStart(2, "0")}s
  </div>
</div>
      </div>

      {/* ── Previous Result + Rules ── */}
      <div
        style={{
          background: "#fff",
          padding: "12px 16px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Left: previous result */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 12,
              color: "#888",
              fontWeight: 500,
              marginBottom: 8,
            }}
          >
            Previous Result :
          </div>

          {/* Column labels */}
          <div
            style={{
              display: "flex",
              gap: 4,
              marginBottom: 4,
              paddingLeft: 2,
            }}
          >
            <div style={{ width: 60 }} />
            {COLUMN_LABELS.map((col) => (
              <div
                key={col}
                style={{
                  width: 32,
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: 800,
                  color: COLUMN_COLORS_LABEL[col],
                }}
              >
                {col}
              </div>
            ))}
          </div>

          {/* 1st Prize */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 60, fontSize: 11 }}>
              1st Prize :
            </span>
            <ResultBallRow digits={mergedLottery.prevResult["1st"]} />
          </div>

          {/* 2nd Prize */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 60, fontSize: 11 }}>
              2nd Prize :
            </span>
            <ResultBallRow digits={mergedLottery.prevResult["2nd"]} />
          </div>
        </div>

        {/* Right: rules */}
        <button onClick={onRules}>Rules</button>
      </div>
    </div>
  );
}