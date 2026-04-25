import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate,useParams } from "react-router-dom";
import redBall from "../assets/redBall.png"
import greenBall from "../assets/greenBall.png"
import { getDiceGame,getDiceHistory,getCategoryDesc, placeDiceBet ,getUserBets ,getConfig} from "../services/gameSevice";
import { getWalletSummary } from "../services/authService";
import { ChevronLeft } from "lucide-react";
import oddImg from "../assets/Odd.png";
import evenImg from "../assets/Even.png";
import smallImg from "../assets/Small.png";
import bigImg from "../assets/Big.png";
function useAudioEngine() {
  const ctxRef = useRef(null);
const masterGainRef = useRef(null);
const getCtx = useCallback(() => {
  if (!ctxRef.current) {
    ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();

    // 🔥 MASTER VOLUME CONTROL
    masterGainRef.current = ctxRef.current.createGain();
    masterGainRef.current.gain.value = 1.5; // increase overall volume

    masterGainRef.current.connect(ctxRef.current.destination);
  }

  if (ctxRef.current.state === "suspended") ctxRef.current.resume();
  return ctxRef.current;
}, []);
  /** Single white-noise burst — one rattle "click" */
  const noiseHit = useCallback((ctx, when, gain = 0.18, dur = 0.055) => {
    const buf  = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 1400;

    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, when);
    g.gain.exponentialRampToValueAtTime(0.001, when + dur);

    src.connect(hp).connect(g).connect(masterGainRef.current || ctx.destination);
    src.start(when);
  }, []);


const playRoll = useCallback(() => {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const HITS = 35; // more hits = more realism
  for (let i = 0; i < HITS; i++) {
    const t = now + Math.pow(i / HITS, 0.45) * 1.1;

    // stronger start, softer end
    const gain = Math.max(0.05, 0.35 - i * 0.008);

    noiseHit(ctx, t, gain, 0.045);

    // 🔥 ADD LOW "THUD" LAYER (real dice impact)
    if (i % 3 === 0) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(120, t);

      g.gain.setValueAtTime(0.3, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(g).connect(masterGainRef.current || ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    }
  }
}, [getCtx, noiseHit]);

  /**
   * ⏱ Tick beep — for last-3-second countdown
   * @param {boolean} urgent  — true on the very last second (higher pitch)
   */
const playTick = useCallback((urgent = false) => {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const g = ctx.createGain();

  osc.type = urgent ? "square" : "sine";
  osc.frequency.value = urgent ? 1800 : 1000;

  // sharper attack
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(urgent ? 0.6 : 0.4, now + 0.004);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc.connect(g).connect(masterGainRef.current || ctx.destination);
  osc.start(now);
  osc.stop(now + 0.12);

  // 🔥 EXTRA DOUBLE TICK ON LAST SECOND
  if (urgent) {
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();

    osc2.type = "square";
    osc2.frequency.value = 2200;

    g2.gain.setValueAtTime(0, now + 0.08);
    g2.gain.linearRampToValueAtTime(0.5, now + 0.09);
    g2.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc2.connect(g2).connect(masterGainRef.current || ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.18);
  }
}, [getCtx]);

  /** 🏆 Win chime — ascending C-major triad + octave */
  const playWin = useCallback(() => {
    const ctx  = getCtx();
    const now  = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = now + i * 0.11;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.32, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
      osc.connect(g).connect(masterGainRef.current || ctx.destination);
      osc.start(t);
      osc.stop(t + 0.42);
    });
  }, [getCtx]);

  /** 💔 Lose buzz — descending sawtooth drop */
  const playLose = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.32);
    g.gain.setValueAtTime(0.26, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    osc.connect(g).connect(masterGainRef.current || ctx.destination);
    osc.start(now);
    osc.stop(now + 0.32);
  }, [getCtx]);

  return { playRoll, playTick, playWin, playLose };
}


const PERIODS = [
  { key: "1m",  label: "1min",  seconds: 60,  lockAt: 10 },
  { key: "3m",  label: "3min",  seconds: 180, lockAt: 30 },
  { key: "5m",  label: "5min",  seconds: 300, lockAt: 30 },
  { key: "15m", label: "15min", seconds: 900, lockAt: 30 },
];

const BET_TABS = ["Sum", "Triple", "Double", "Single"];


const TRIPLE_BETS = [1,2,3,4,5,6].map((n,i)=>({
  id:`T${n}`,
  label:String(n),
  payout:"180",
  multiplier:180,
  color:i%2===0 ? "#e8302a" : "#4caf50"
}));

const DOUBLE_BETS = [1,2,3,4,5,6].map((n,i)=>({
  id:`D${n}`, label:`${n}-${n}`, payout:"11", multiplier:11, color:i%2===0?"#e8302a":"#4caf50",
}));

const SINGLE_BETS = [1,2,3,4,5,6].map((n,i)=>({
  id:`S${n}`, label:String(n), payout:"1/2/3", multiplier:1, color:i%2===0?"#e8302a":"#4caf50",
}));

const DICE_DOTS = {
  1:[[50,50]],
  2:[[28,28],[72,72]],
  3:[[28,28],[50,50],[72,72]],
  4:[[28,28],[72,28],[28,72],[72,72]],
  5:[[28,28],[72,28],[50,50],[28,72],[72,72]],
  6:[[28,22],[72,22],[28,50],[72,50],[28,78],[72,78]],
};

const QUICK_AMOUNTS = [10, 50, 100, 500, 1000];

const BALL_IMAGES = {
  red: redBall,
  green: greenBall
}


/* ══════════════════════════════════════════════════════
   SEED HISTORY
══════════════════════════════════════════════════════ */
function seedHistory() {
  return Array.from({ length:20 }, (_,i) => {
    const dice=[Math.ceil(Math.random()*6),Math.ceil(Math.random()*6),Math.ceil(Math.random()*6)];
    const sum=dice.reduce((a,b)=>a+b,0);
    return { issue:String(20260325010655-(19-i)), dice, sum, tag:sum>=11?"BIG":"SMALL", even:sum%2===0 };
  });
}

/* ══════════════════════════════════════════════════════
   ATOMS
══════════════════════════════════════════════════════ */
function Dice3D({ value, rolling, size = 60 }) {
  const half = size / 2;

  // Each face is placed with getFacePosition(face, half).
  // To SHOW face N, we rotate the CUBE in the OPPOSITE direction.
  const faceTransforms = {
    1: "rotateX(0deg) rotateY(0deg)",     // translateZ → no rotation needed
    2: "rotateX(-90deg)",                  // face2 = rotateX(90) translateZ → show with rotateX(-90)
    3: "rotateY(-90deg)",                  // ✅ FIXED — face3 = rotateY(90) → show with rotateY(-90)
    4: "rotateY(90deg)",                   // ✅ FIXED — face4 = rotateY(-90) → show with rotateY(+90)
    5: "rotateX(90deg)",                   // face5 = rotateX(-90) → show with rotateX(+90)
    6: "rotateX(180deg)",                  // face6 = rotateX(180)
  };

  return (
    <div style={{ perspective: size * 6 }}>
      <div
        style={{
          width: size,
          height: size,
          position: "relative",
          transformStyle: "preserve-3d",
          transform: rolling
            ? "rotateX(720deg) rotateY(720deg)"
            : faceTransforms[value],
          transition: rolling
            ? "transform 0.8s cubic-bezier(0.2,0.8,0.2,1)"
            : "transform 0.4s ease-out",
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((face) => (
          <div
            key={face}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: "white",
              border: "2px solid #ccc",
              borderRadius: size * 0.15,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: getFacePosition(face, half),
            }}
          >
            <DiceDots value={face} size={size} />
          </div>
        ))}
      </div>
    </div>
  );
}

function DiceDots({ value, size }) {
  const dots = DICE_DOTS[value];

  // 🔥 smarter scaling
  const r = Math.max(3.5, size * 0.14);   // minimum size + responsive
  const svgSize = size * 0.85;

  return (
    <svg width={svgSize} height={svgSize} viewBox="0 0 100 100">
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#111" />
      ))}
    </svg>
  );
}

function getFacePosition(face, half) {
  switch (face) {
    case 1: return `translateZ(${half}px)`;
    case 2: return `rotateX(90deg) translateZ(${half}px)`;
    case 3: return `rotateY(90deg) translateZ(${half}px)`;
    case 4: return `rotateY(-90deg) translateZ(${half}px)`;
    case 5: return `rotateX(-90deg) translateZ(${half}px)`;
    case 6: return `rotateX(180deg) translateZ(${half}px)`;
    default: return "";
  }
}
function DigitBox({digit,urgent}) {
  return (
    <div style={{
      background:"#111", color: urgent?"#ef4444":"white",
      fontSize:11, fontWeight:600,
      width:20, height:20,
      display:"flex", alignItems:"center", justifyContent:"center",
      borderRadius:5, border:`1px solid ${urgent?"#ef444480":"#333"}`,
      fontVariantNumeric:"tabular-nums",
      transition:"color 0.3s, border-color 0.3s",
    }}>{digit}</div>
  );
}

function CountdownTimer({seconds, urgent}) {
  const mm=String(Math.floor(seconds/60)).padStart(2,"0");
  const ss=String(seconds%60).padStart(2,"0");
  return (
    <div style={{display:"flex",alignItems:"center",gap:1}}>
      {[mm[0],mm[1]].map((d,i)=><DigitBox key={i} digit={d} urgent={urgent}/>)}
      <span style={{color:urgent?"#ef4444":"white",fontSize:20,fontWeight:900,lineHeight:1}}>:</span>
      {[ss[0],ss[1]].map((d,i)=><DigitBox key={i+2} digit={d} urgent={urgent}/>)}
    </div>
  );
}

function PeriodSelector({selected,onSelect}) {
  return (
    <div style={{display:"flex",gap:8,padding:"10px 12px",background:"#f0eef8",
      borderBottom:"1px solid #e0dcf0",overflowX:"auto"}}>
      {PERIODS.map(p=>(
        <button key={p.key} onClick={()=>onSelect(p)} style={{
          flex:1, minWidth:62, padding:"9px 0", borderRadius:10, cursor:"pointer",
          background:selected.key===p.key?"white":"transparent",
          border:selected.key===p.key?"2px solid #7c3aed":"2px solid transparent",
          boxShadow:selected.key===p.key?"0 2px 10px rgba(124,58,237,0.18)":"none",
          display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all 0.2s",
        }}>
          <div style={{
            width:30,height:30,borderRadius:"50%",
            background:"linear-gradient(135deg,#f59e0b,#f97316)",
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 2px 6px rgba(245,158,11,0.4)",fontSize:14,
          }}>⏱</div>
          <span style={{fontSize:12,fontWeight:selected.key===p.key?800:500,
            color:selected.key===p.key?"#5b21b6":"#666"}}>{p.label}</span>
        </button>
      ))}
    </div>
  );
}

function BetTabs({selected,onSelect}) {
  return (
    <div style={{display:"flex",background:"white",borderBottom:"1px solid #f0eef8", marginTop:4}}>
      {BET_TABS.map(tab=>(
        <button key={tab} onClick={()=>onSelect(tab)} style={{
          flex:1,padding:"13px 0",
          background:selected===tab?"#7c3aed":"white",
          color:selected===tab?"white":"#333",
          border:"none",cursor:"pointer",fontSize:14,
          fontWeight:selected===tab?800:500,transition:"all 0.2s",
        }}>{tab}</button>
      ))}
    </div>
  );
}

const BetBall = React.memo(function BetBall({item,selected,onSelect,size=74}) {
  const isSel=selected?.id===item.id;
  const common={
    width:size, height:size, borderRadius:14,
    border:`2.5px solid ${isSel?item.color:"#e8e4f5"}`,
    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,
    cursor:"pointer",
    boxShadow:isSel?`0 4px 16px ${item.color}55`:"0 2px 6px rgba(0,0,0,0.07)",
    transform:isSel?"scale(1.06)":"scale(1)",
    transition:"all 0.15s",
  };

if (item.type === "special") return (
  <button
    onClick={() => onSelect(item)}
    style={{
      ...common,
      background: isSel ? "#f5f0ff" : "white"
    }}
  >
    {/* 🎯 IMAGE */}
    <div
      style={{
        width: 54,
        height: 54,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
    <img
  src={getTagImage(item.label?.toUpperCase())}
  alt={item.label}
  style={{
    width: "100%",
    height: "100%",
    objectFit: "contain",
  }}
/>
    </div>

    {/* 💰 PAYOUT */}
    <span
      style={{
        fontSize: 11,
        color: isSel ? item.color : "#888",
        fontWeight: 600
      }}
    >
      {item.payout}X
    </span>
  </button>
);
  if (item.type==="label") return (
    <button onClick={()=>onSelect(item)} style={{...common,background:isSel?"#ede9fe":"white"}}>
      <div style={{width:50,height:50,borderRadius:"50%",background:item.color,
        display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{color:"white",fontSize:10,fontWeight:800,textAlign:"center",lineHeight:1.2}}>
          {item.label}
        </span>
      </div>
      <span style={{fontSize:11,color:isSel?item.color:"#888",fontWeight:600}}>{item.payout}X</span>
    </button>
  );
 const idStr = String(item.id);
 const isRed = item.color === "#e8302a";
const isGreen = item.color === "#4caf50";

 // 🎯 SUM NUMBER BALL (3–18)
if (typeof item.id === "number") {
  return (
    <button
      onClick={() => onSelect(item)}
      style={{
        width: size,
        height: size,
        borderRadius: 14,
        border: `2.5px solid ${isSel ? item.color : "#e8e4f5"}`,
        background: isSel ? "#f5f0ff" : "#F5F5F5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        cursor: "pointer",
        boxShadow: isSel
          ? `0 4px 16px ${item.color}55`
          : "0 2px 6px rgba(0,0,0,0.07)",
        transform: isSel ? "scale(1.06)" : "scale(1)",
        transition: "all 0.15s",
      }}
    >
      {/* 🔥 BALL */}
<div
  style={{
    width: 60,
    height: 60,
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  {/* 🎯 BALL IMAGE */}
<img
  src={isRed ? BALL_IMAGES.red : BALL_IMAGES.green}
  alt="ball"
  style={{
    width: "90%",
    height: "90%",
    objectFit: "contain",
  }}
/>

  {/* 🔢 NUMBER ON TOP */}
  <span
    style={{
      position: "absolute",
      fontSize: 16,
      fontWeight: 900,
      color: item.color,
    }}
  >
    {item.id}
  </span>
</div>
      <span
        style={{
          fontSize: 11,
          color: isSel ? item.color : "#888",
          fontWeight: 600,
        }}
      >
        {item.payout}X
      </span>
    </button>
  );
}
// 🎯 For Single / Double / Triple → show ONLY dice (no ball)
if (idStr.startsWith("S") || idStr.startsWith("D") || idStr.startsWith("T")) {
  return (
    <button
      onClick={() => onSelect(item)}
      style={{
        width: size,
        height: size,
        borderRadius: 14,
        border: `2.5px solid ${isSel ? item.color : "#e8e4f5"}`,
        background: isSel ? "#f5f0ff" : "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        cursor: "pointer",
        boxShadow: isSel
          ? `0 4px 16px ${item.color}55`
          : "0 2px 6px rgba(0,0,0,0.07)",
        transform: isSel ? "scale(1.06)" : "scale(1)",
        transition: "all 0.15s",
      }}
    >


      {/* 🎲 BIG DICE UI */}
      {idStr.startsWith("S") && (
        <Dice3D  value={parseInt(idStr.replace("S", ""))} size={42} dotScale={0.22}/>
      )}

      {idStr.startsWith("D") && (
        <div style={{ display: "flex", gap: 4 }}>
          <Dice3D  value={parseInt(idStr.replace("D", ""))} size={34} dotScale={0.26}/>
          <Dice3D  value={parseInt(idStr.replace("D", ""))} size={34} dotScale={0.26}/>
        </div>
      )}

      { idStr.startsWith("T") && (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
    }}
  >
    {/* TOP DICE */}
    <Dice3D  value={parseInt(idStr.replace("T", ""))} size={28} dotScale={0.30}/>

    {/* BOTTOM TWO */}
    <div style={{ display: "flex", gap: 4 }}>
      <Dice3D  value={parseInt(idStr.replace("T", ""))} size={28} dotScale={0.30}/>
      <Dice3D  value={parseInt(idStr.replace("T", ""))} size={28} dotScale={0.30}/>
    </div>
  </div>
)}
      <span
        style={{
          fontSize: 11,
          color: isSel ? item.color : "#888",
          fontWeight: 600,
        }}
      >
        {item.payout}X
      </span>
    </button>
  );
}
});
/* ══════════════════════════════════════════════════════
   BET SLIP
══════════════════════════════════════════════════════ */
function BetSlip({ selection, onClose, onConfirm }) {
  const [amount, setAmount] = useState(100);
  const [multiplier, setMultiplier] = useState(1);

  const amounts = [10, 100, 500, 1000];
  const multipliers = [1, 3, 9, 27, 81, 243, 729];

  const total = amount * multiplier;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 430,
        background: "#fff",
        borderRadius: "18px 18px 0 0",
        zIndex: 100,
        boxShadow: "0 -6px 30px rgba(0,0,0,0.25)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: 700 }}>Bets</span>
        <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 18 }}>
          ×
        </button>
      </div>

      {/* SELECTED BALL */}
      <div
        style={{
          background: "#f5f1e6",
          padding: 20,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 20,
            color: "#e11d48",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          {selection.label || selection.id}
        </div>
      </div>

      {/* AMOUNT BUTTONS */}
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {amounts.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 8,
                border: "none",
                fontWeight: 700,
                background: amount === a ? "#7c3aed" : "#eee",
                color: amount === a ? "#fff" : "#000",
              }}
            >
              ₹{a}
            </button>
          ))}
        </div>

        {/* MULTIPLIER */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 6, fontSize: 13 }}>Multiplier:</div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setMultiplier((m) => Math.max(1, m - 1))}
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                border: "none",
                background: "#eee",
              }}
            >
              -
            </button>

            <div
              style={{
                width: 60,
                textAlign: "center",
                fontWeight: 700,
              }}
            >
              {multiplier}
            </div>

            <button
              onClick={() => setMultiplier((m) => m + 1)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                border: "none",
                background: "#eee",
              }}
            >
              +
            </button>
          </div>

          {/* QUICK MULTIPLIERS */}
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {multipliers.map((m) => (
              <button
                key={m}
                onClick={() => setMultiplier(m)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  background: multiplier === m ? "#f3e8ff" : "#fff",
                  color: multiplier === m ? "#7c3aed" : "#333",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                x{m}
              </button>
            ))}
          </div>
        </div>

        {/* CHECKBOX */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13 }}>
            <input type="checkbox" defaultChecked style={{ marginRight: 6 }} />
            I Agree <span style={{ color: "#7c3aed" }}>(Pre-sale rules)</span>
          </label>
        </div>

        {/* TOTAL BUTTON */}
        <button
          onClick={() => onConfirm(selection, amount, multiplier)}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 30,
            border: "none",
            background: "linear-gradient(90deg,#7c3aed,#a855f7)",
            color: "#fff",
            fontWeight: 800,
            fontSize: 16,
          }}
        >
          Total Price ₹{total}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   RESULT HISTORY SECTION  (same pattern as ColorPrediction)
══════════════════════════════════════════════════════ */
const HIST_TABS = [
  {key:"result",  label:"Result History"},
  {key:"winners", label:"Winners"},
  {key:"analyze", label:"Analyze"},
  {key:"myorder", label:"My Order"},
];
const getTagImage = (type) => {
  if (type === "BIG") return bigImg;
  if (type === "SMALL") return smallImg;
  if (type === "ODD") return oddImg;
  if (type === "EVEN") return evenImg;
  return null;
};


function ResultHistoryTab({
  history,
  histPage,
  hasMoreHistory,
  handleNext,
  handlePrev
}) {

  const Ball = ({ text, color }) => (
    <div style={{
      minWidth: 36,
      height: 36,
      borderRadius: "50%",
      background: color,
      color: "#fff",
      fontSize: 11,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.25)"
    }}>
      {text}
    </div>
  );

  const SmallBall = ({ text, color }) => (
    <div style={{
      minWidth: 36,
      height: 36,
      borderRadius: "50%",
      background: "#eee",
      color: color,
      fontSize: 11,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      {text}
    </div>
  );
const cellCenter = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cellLeft = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
};
  return (
    <div style={{ padding: 10 }}>

      {/* HEADER */}
<div style={{
  display: "grid",
  gridTemplateColumns: "1.4fr 1.2fr 0.6fr 0.9fr 0.9fr",
  fontSize: 12,
  fontWeight: 700,
  color: "#666",
  padding: "8px 6px"
}}>
  <div style={{ textAlign: "left" }}>Issue</div>
  <div style={{ textAlign: "center" }}>Result</div>
  <div style={{ textAlign: "center" }}>Sum</div>
  <div style={{ textAlign: "center" }}>Value</div>
  <div style={{ textAlign: "center" }}>Number</div>
</div>

      {/* LIST */}
      {history.map((row, i) => (
        <div key={i} style={{
            display: "grid",
  gridTemplateColumns: "1.4fr 1.2fr 0.6fr 0.9fr 0.9fr",
  alignItems: "center",
  padding: "10px 6px",
  borderRadius: 10,
  marginBottom: 6,
  background: i % 2 === 0 ? "#fff" : "#f9f9fb"
        }}>

          {/* ISSUE */}
          <div style={{
  ...cellLeft,
  fontSize: 12,
  color: "#444",
  lineHeight: "14px"
}}>
  {row.issue}
</div>

          {/* DICE */}
          <div style={{
  ...cellCenter,
  gap: 4
}}>
  {row.dice.map((d, j) => (
    <Dice3D key={j} value={d} size={26} dotScale={0.36} />
  ))}
</div>

          {/* SUM */}
          <div style={{
  ...cellCenter,
  fontSize: 16,
  fontWeight: 700
}}>
  {row.sum}
</div>
          {/* BIG / SMALL */}
<div style={cellCenter}>
  <img
    src={getTagImage(row.tag)}
    style={{ width: 32, height: 32 }}
  />
</div>

          {/* ODD / EVEN */}
<div style={cellCenter}>
  <img
    src={getTagImage(row.even ? "EVEN" : "ODD")}
    style={{ width: 32, height: 32 }}
  />
</div>

        </div>
      ))}  

      {/* PAGINATION */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 12,
        padding: "8px"
      }}>
        <button
          onClick={handlePrev}
          disabled={histPage === 1}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            border: "none",
            background: histPage === 1 ? "#ddd" : "#eee",
            cursor: histPage === 1 ? "not-allowed" : "pointer"
          }}
        >
          ‹
        </button>

        <div style={{ fontWeight: 600 }}>
          {histPage}
        </div>

        <button
          onClick={handleNext}
          disabled={!hasMoreHistory}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            border: "none",
            background: !hasMoreHistory ? "#ddd" : "#eee",
            cursor: !hasMoreHistory ? "not-allowed" : "pointer"
          }}
        >
          ›
        </button>
      </div>

    </div>
  );
}

function WinnersTab({history}) {
  const rows = useMemo(()=>history.slice(0,14).map((h,i)=>({
    ...h,
    user:`User***${String(1000+i*41).slice(-4)}`,
    bet:Math.floor(Math.random()*400+50),
    win:Math.floor(Math.random()*3000+100),
  })),[history]);
  return (
    <div>
      {rows.map((w,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"11px 14px",borderBottom:"1px solid #f4f2fc"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:"50%",
              background:`hsl(${i*37+100},55%,55%)`,
              display:"flex",alignItems:"center",justifyContent:"center",
              color:"white",fontSize:14,fontWeight:700}}>U</div>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#1a1a2e"}}>{w.user}</div>
              <div style={{display:"flex",gap:3,marginTop:2,alignItems:"center"}}>
                {w.dice.map((d,j)=><Dice3D  key={j} value={d} size={16}/>)}
                <span style={{fontSize:11,color:"#888",marginLeft:3}}>Sum {w.sum}</span>
              </div>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:14,fontWeight:800,color:"#16a34a"}}>+₹{w.win}</div>
            <div style={{fontSize:11,color:"#888"}}>Bet ₹{w.bet}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyzeTab({history}) {
  const stats=useMemo(()=>{
    const s={big:0,small:0,odd:0,even:0,triple:0,sums:Array(16).fill(0)};
    history.forEach(h=>{
      const isTpl=h.dice[0]===h.dice[1]&&h.dice[1]===h.dice[2];
      if(isTpl) s.triple++;
      else if(h.tag==="BIG") s.big++; else s.small++;
      if(h.sum%2!==0&&!isTpl) s.odd++; else if(!isTpl) s.even++;
      if(h.sum>=3&&h.sum<=18) s.sums[h.sum-3]++;
    });
    return s;
  },[history]);

  const total=history.length||1;
  const rows=[
    {label:"🔴 BIG",    val:stats.big,    color:"#ef4444"},
    {label:"🔵 SMALL",  val:stats.small,  color:"#3b82f6"},
    {label:"Odd",       val:stats.odd,    color:"#f59e0b"},
    {label:"Even",      val:stats.even,   color:"#8b5cf6"},
    {label:"Triple",    val:stats.triple, color:"#ec4899"},
  ];

  return (
    <div style={{padding:14}}>
      <div style={{fontSize:12,fontWeight:700,color:"#888",marginBottom:10,textTransform:"uppercase",letterSpacing:0.5}}>
        Frequency ({history.length} rounds)
      </div>
      {rows.map(({label,val,color})=>{
        const pct=Math.round(val/total*100);
        return (
          <div key={label} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:color}}/>
                <span style={{fontSize:13,fontWeight:600}}>{label}</span>
              </div>
              <span style={{fontSize:12,color:"#888"}}>{val}x ({pct}%)</span>
            </div>
            <div style={{height:8,background:"#f0eef8",borderRadius:4,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:4,transition:"width 0.8s"}}/>
            </div>
          </div>
        );
      })}

      <div style={{height:1,background:"#f0eef8",margin:"14px 0"}}/>

      <div style={{fontSize:12,fontWeight:700,color:"#888",marginBottom:10,textTransform:"uppercase",letterSpacing:0.5}}>
        Sum Distribution (3–18)
      </div>
      <div style={{display:"flex",alignItems:"flex-end",gap:4,height:80}}>
        {stats.sums.map((count,i)=>{
          const mx=Math.max(...stats.sums)||1;
          const h=count?Math.max(8,Math.round(count/mx*74)):4;
          const sumVal=i+3;
          const col=sumVal>=11?"#ef4444":"#3b82f6";
          return (
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
              <span style={{fontSize:8,color:"#888"}}>{count||""}</span>
              <div style={{width:"100%",height:h,background:col,borderRadius:"3px 3px 0 0",opacity:0.85}}/>
              <span style={{fontSize:8,fontWeight:700,color:"#555"}}>{sumVal}</span>
            </div>
          );
        })}
      </div>

      <div style={{height:1,background:"#f0eef8",margin:"14px 0"}}/>
      <div style={{fontSize:12,fontWeight:700,color:"#888",marginBottom:8,textTransform:"uppercase",letterSpacing:0.5}}>
        Last 20 results
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {history.slice(0,20).map((h,i)=>(
          <div key={i} style={{
            width:34,height:34,borderRadius:"50%",
            background:h.tag==="BIG"?"#ef4444":"#3b82f6",
            display:"flex",alignItems:"center",justifyContent:"center",
            color:"white",fontSize:11,fontWeight:800,
          }}>{h.sum}</div>
        ))}
      </div>
    </div>
  );
}

function MyOrderTab({ bets, user, setBets, periodKey }) {

const [page, setPage] = useState(1);
const [limit] = useState(5);
const [hasNext, setHasNext] = useState(true);
const [loading, setLoading] = useState(false);

  // ✅ GROUPING (same as yours)
  const groupedBets = Object.values(
    bets.reduce((acc, bet) => {
      if (!acc[bet.issue]) {
        acc[bet.issue] = {
          issue: bet.issue,
          items: []
        };
      }
      acc[bet.issue].items.push(bet);
      return acc;
    }, {})
  );

useEffect(() => {
  if (user?.id) {
    setPage(1);
    fetchUserBets(1);
  }
}, [user?.id, periodKey]);

const fetchUserBets = async (pageNum = 1) => {
  if (loading) return;

  setLoading(true);

  try {
    const res = await getUserBets({
      user_id: user?.id,
      key: periodKey,
      page: pageNum,   // ✅ REQUIRED
      limit: limit     // ✅ REQUIRED
    });

    if (!res?.success) return;

    const list = res.data || [];

    const formatted = list.map(item => {
      let status = "pending";

      if (item.result === "win" || item.result === 1 || item.result === true) {
        status = "win";
      } else if (
        item.result === "lose" ||
        item.result === "loss" ||
        item.result === 0 ||
        item.result === false
      ) {
        status = "lose";
      }

      return {
        id: item.id,
        selection: {
          id: item.value,
          label: item.value,
          payout: item.multiplier || "-",
          type: item.type
        },
        amount: item.bet_amount,
        qty: 1,
        issue: item.slot_num,
        settled: status !== "pending",
        won: status === "win",
        payout: item.credit_amount || 0,
        dice: item.slotResult?.dice || [],
        sum: item.slotResult?.sum,
        resultTag: item.slotResult?.value,
        oddEven: item.slotResult?.number
      };
    });

    setBets(formatted); // ✅ ALWAYS REPLACE

    // ✅ if less than limit → no next page
    setHasNext(list.length === limit);

  } catch (err) {
    console.log("fetchUserBets error", err);
  }

  setLoading(false);
};
const handleNext = () => {
  if (!hasNext) return;

  const nextPage = page + 1;
  setPage(nextPage);
  fetchUserBets(nextPage);
};

const handlePrev = () => {
  if (page === 1) return;

  const prevPage = page - 1;
  setPage(prevPage);
  fetchUserBets(prevPage);
};

  // 🟡 EMPTY (same as yours)
  if (!bets.length) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#bbb" }}>
        <div style={{ fontSize: 42, marginBottom: 12 }}>🎲</div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>
          No bets placed yet
        </div>
        <div style={{ fontSize: 12, marginTop: 4 }}>
          Place a bet to see your order history
        </div>
      </div>
    );
  }

  // ✅ 🔥 KEEP YOUR ORIGINAL UI BELOW (JUST FIX SMALL PART)
  return (
    <div style={{ padding: 10 }}>
      {groupedBets.map((group, i) => {
        const first = group.items[0];

        const isPending = group.items.some(b => !b.settled);
        const isWon = group.items.some(b => b.won);
        const isLost = !isPending && !isWon;

        return (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 14,
              marginBottom: 14,
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
            }}
          >

            {/* 🔹 DRAW HEADER */}
            <div style={{
              background: "#f5f5dc",
              padding: 10,
              fontSize: 13,
              fontWeight: 700
            }}>
              Draw results
            </div>

            {/* 🔹 RESULT SECTION */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 10,
              alignItems: "center"
            }}>
              <div style={{ display: "flex", gap: 6 }}>
                {first.dice?.length > 0 ? (
                  first.dice.map((d, idx) => (
                    <Dice3D key={idx} value={d} size={28} />
                  ))
                ) : (
                  <span style={{ fontSize: 12, color: "#999" }}>
                    Waiting result...
                  </span>
                )}
              </div>

              <div style={{ fontSize: 13 }}>
                Sum: {first.sum ?? "-"}
              </div>

              <div style={{
                background: "#3b82f6",
                color: "#fff",
                padding: "4px 8px",
                borderRadius: 10,
                fontSize: 11
              }}>
                {first.resultTag?.toUpperCase() || "-"}
              </div>
            </div>

            {/* 🔹 STATUS */}
            <div style={{
              background: "#f3f4f6",
              padding: "8px 10px",
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12
            }}>
              <div>
                {isPending && "⏳ Pending"}
                {isWon && "✅ Win"}
                {isLost && "❌ No Win"}
              </div>

              <div>ID {group.issue}</div>
            </div>

            {/* 🔹 BET LIST (UNCHANGED) */}
            <div>
              {group.items.map((b, j) => (
                <div
                  key={j}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderTop: "1px solid #f1f1f1",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>
                      {b.selection.label}
                    </div>
                    <div style={{ fontSize: 11, color: "#888" }}>
                      {b.selection.type}
                    </div>
                  </div>

                  <div style={{ fontSize: 13 }}>
                    ₹{b.amount}
                  </div>

                  <div style={{
                    fontWeight: 700,
                    color: b.won
                      ? "#16a34a"
                      : b.settled
                      ? "#ef4444"
                      : "#f59e0b"
                  }}>
                    {b.settled
                      ? b.won
                        ? `+₹${b.payout}`
                        : "No win"
                      : "Pending"}
                  </div>
                </div>
              ))}
            </div>

          </div>
        );
      })}
      <div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 10,
  padding: "10px 6px"
}}>
  <button
    onClick={handlePrev}
    disabled={page === 1 || loading}
    style={{
      padding: "8px 14px",
      borderRadius: 10,
      border: "none",
      background: page === 1 ? "#ccc" : "#7c3aed",
      color: "#fff",
      cursor: page === 1 ? "not-allowed" : "pointer"
    }}
  >
    ⬅ Prev
  </button>

  <span style={{ fontSize: 13, fontWeight: 600 }}>
    Page {page}
  </span>

  <button
    onClick={handleNext}
    disabled={!hasNext || loading}
    style={{
      padding: "8px 14px",
      borderRadius: 10,
      border: "none",
      background: !hasNext ? "#ccc" : "#7c3aed",
      color: "#fff",
      cursor: !hasNext ? "not-allowed" : "pointer"
    }}
  >
    Next ➡
  </button>
</div>
    </div>
  );
}

  const TimerDisplay = React.memo(({ timeLeft, urgent }) => {
  return <CountdownTimer seconds={timeLeft} urgent={urgent} />;
});

const BetGrid = React.memo(({ tabBets, selected, onSelect, betTab }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          betTab === "Sum" ? "repeat(4,1fr)" : "repeat(3,1fr)",
        gap: 8,
      }}
    >
      {tabBets.map((item) => (
        <BetBall
          key={item.id}
          item={item}
          selected={selected}
          onSelect={onSelect}
          size={betTab === "Sum" ? 74 : 90}
        />
      ))}
    </div>
  );
});

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function DiceGame({ onBack }) {

  useEffect(() => {
  const unlockAudio = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctx.resume();
    } catch (e) {}
    window.removeEventListener("click", unlockAudio);
  };

  window.addEventListener("click", unlockAudio);
}, []);
  const [period,      setPeriod]      = useState(PERIODS[0]);
  // const [timeLeft,    setTimeLeft]    = useState(PERIODS[0].seconds);
  // const [roundId,     setRoundId]     = useState("20260325010675");
  const [nextRoundId, setNextRoundId] = useState("20260325010676");
  const [dice,        setDice]        = useState([2,4,3]);
  const [rolling,     setRolling]     = useState(false);
  const [flashDice,   setFlashDice]   = useState(false);
  const [betTab,      setBetTab]      = useState("Sum");
  const [selected,    setSelected]    = useState(null);
  const [showSlip,    setShowSlip]    = useState(false);
  const [balance,     setBalance]     = useState({totalWallet: 0});
  const [bets,        setBets]        = useState([]);
  const [histTab,     setHistTab]     = useState("result");
  const [toast,       setToast]       = useState(null);
const { key } = useParams();

const [history, setHistory] = useState([]);
const [histPage, setHistPage] = useState(1);
const [hasMoreHistory, setHasMoreHistory] = useState(true);

const [periodKey, setPeriodKey] = useState(key || "1m");
const [timeLeft, setTimeLeft] = useState(0);
const [totalTime, setTotalTime] = useState(60);
const [roundId, setRoundId] = useState("");
const [isRolling, setIsRolling] = useState(false);
const [preRoundId,setPreRoundId]=useState('')
const[lastResultDice,setLastResultDice]=useState([])
  const lastResultDiceRef = useRef([]);
const audio     = useAudioEngine();

const [isRunning, setIsRunning] = useState(true);


const [config, setConfig] = useState([]);

useEffect(() => {
  console.log("CONFIG:", config);
  console.log("PAYOUT MAP:", payoutMap);
}, [config]);

useEffect(() => {
  fetchConfig();
}, [periodKey]); // ✅ MUST

const fetchConfig = async () => {
  const res = await getConfig({ key: periodKey });

  if (res?.success) {
    setConfig(res.data?.payouts || []);
  }
};

  const payoutMap = useMemo(() => {
    const map = {};
    config.forEach(item => {
      map[item.bet_type] = Number(item.payout);
    });
    return map;
  }, [config]);

const SUM_BETS = useMemo(() => {
  if (!config.length) return [];

  return [
    {
      id: "BIG",
      label: "BIG",
      payout: payoutMap["BIG"] ?? "-",
      multiplier: payoutMap["BIG"] ?? 0,
      type: "special",
      color: "#e8302a"
    },
    {
      id: "SMALL",
      label: "SMALL",
      payout: payoutMap["SMALL"] ?? "-",
      multiplier: payoutMap["SMALL"] ?? 0,
      type: "special",
      color: "#3aaee0"
    },
    {
      id: "ODD",
      label: "Odd",
      payout: payoutMap["ODD"] ?? "-",
      multiplier: payoutMap["ODD"] ?? 0,
      type: "special",
      color: "#e8302a"
    },
    {
      id: "EVEN",
      label: "Even",
      payout: payoutMap["EVEN"] ?? "-",
      multiplier: payoutMap["EVEN"] ?? 0,
      type: "special",
      color: "#3aaee0"
    },

    ...Array.from({ length: 16 }, (_, i) => {
      const sum = i + 3;
      const key = `SUM_${sum}`;

      return {
        id: sum,
        label: String(sum),
        payout: payoutMap[key] ?? "-",
        multiplier: payoutMap[key] ?? 0,
        color: i % 2 === 0 ? "#e8302a" : "#4caf50"
      };
    })
  ];
}, [payoutMap, config]);

const fetchHistory = async (page = 1) => {
  const res = await getDiceHistory({
    key: periodKey,
    limit: 10,
    page
  });

  if (!res?.success) return;

  const list = res.data || [];

  const formatted = list.map(item => {
    const dice = item.result?.dice || [];
    const sum = item.result?.sum || 0;

    return {
      issue: item.slotNum,
      dice,
      sum,
      tag: sum >= 11 ? "BIG" : "SMALL",
      even: sum % 2 === 0
    };
  });

  setHistory(formatted);

  // if less than limit → last page
  setHasMoreHistory(list.length === 10);
};

const handleNext = () => {
  if (!hasMoreHistory) return;

  const nextPage = histPage + 1;
  setHistPage(nextPage);
  fetchHistory(nextPage);
};

const handlePrev = () => {
  if (histPage === 1) return;

  const prevPage = histPage - 1;
  setHistPage(prevPage);
  fetchHistory(prevPage);
};

useEffect(() => {
  setHistPage(1);
  fetchHistory(1, false);
}, [periodKey]);

const loadMoreHistory = () => {
  if (!hasMoreHistory) return;

  const nextPage = histPage + 1;
  setHistPage(nextPage);
  fetchHistory(nextPage, true);
};
  /* ── ROLL ── */
const triggerRoll = useCallback(() => {
  audio.playRoll();
  setRolling(true);

  let start = null;
  const animate = (time) => {
    if (!start) start = time;
    const progress = time - start;

    if (progress < 700) {
      setDice([
        Math.ceil(Math.random()*6),
        Math.ceil(Math.random()*6),
        Math.ceil(Math.random()*6),
      ]);
      requestAnimationFrame(animate);
    } else {
      // ✅ Read from ref, not state — always has latest value
      const finalDice = lastResultDiceRef.current.length === 3
        ? lastResultDiceRef.current
        : [
            Math.ceil(Math.random()*6),
            Math.ceil(Math.random()*6),
            Math.ceil(Math.random()*6),
          ];

      setDice(finalDice);
      setRolling(false);
      setFlashDice(true);
      setTimeout(() => setFlashDice(false), 800);
    }
  };

  requestAnimationFrame(animate);
}, [audio]); // ✅ Remove lastResultDice from deps — ref doesn't need it


const prevRoundRef = useRef("");

useEffect(() => {
  if (!prevRoundRef.current) {
    prevRoundRef.current = roundId;
    return;
  }

  if (roundId !== prevRoundRef.current) {
    // 🎯 New round started → trigger roll
    triggerRoll();
    prevRoundRef.current = roundId;
  }
}, [roundId, triggerRoll]);

useEffect(() => {
  if (key) {
    setPeriodKey(key);

    const found = PERIODS.find(p => p.key === key);
    if (found) setPeriod(found);
  }
}, [key]);


useEffect(() => {
  fetchGameData(periodKey);
}, [periodKey]);

const fetchGameData = async (key = periodKey) => {
  const res = await getDiceGame({ key });

  if (!res?.success) return;

  const g = res.data?.[0]; // ✅ FIX

  if (!g) return;

  setIsRunning(g.isRunning); 
  setTimeLeft(Math.max(0, g.remaining)); // avoid negative
  setTotalTime(g.seconds);
  setRoundId(g.currentSlotNum);
  setPreRoundId(g.lastResult?.slotNum)
  setIsRolling(g.isRolling);



  // 🎯 SET LAST RESULT (important)
if (g.lastResult?.result) {
  const diceData = g.lastResult.result.dice;

  setLastResultDice(diceData);
  lastResultDiceRef.current = diceData;
}
}
useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
  }, 1000);

  return () => clearInterval(timer);
}, []);

const isGameClosed = !isRunning;

useEffect(() => {
  const sync = setInterval(() => {
    fetchGameData(periodKey);
  }, 3000); // every 10 sec

  return () => clearInterval(sync);
}, [periodKey]);

useEffect(() => {
  if (isRolling) {
    triggerRoll(); // your existing animation
  }
}, [isRolling,triggerRoll]);

  const timerRef  = useRef(null);
  
  const isLocked  = timeLeft <= period.lockAt;
  const urgent    = timeLeft <= 3 && isLocked;
const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const sum       = dice.reduce((a,b)=>a+b,0);
  const sumTag    = sum>=11?"BIG":"SMALL";
const tabBets = {
  Sum: SUM_BETS,
  Triple: TRIPLE_BETS,
  Double: DOUBLE_BETS,
  Single: SINGLE_BETS
}[betTab];

  useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        fetchWallet(parsedUser.id);
      } else {
        console.log("...")
      }
    }, []);
  const fetchWallet = async (uid) => {
    try {
      const res = await getWalletSummary({ id: uid });
      const api = res?.data;
  
      setBalance({
        totalWallet: Number(api?.wallet.total || 0)
      });
  
    } catch (err) {
      console.log("API Error:", err);
    }
  };
    const showT=(msg,type="info")=>{
    setToast({msg,type});
    setTimeout(()=>setToast(null),2600);
  };


  const handleSelect=item=>{
   if (isGameClosed) {
    showT("🚫 Game is temporarily closed", "error");
    return;
  }

    if(isLocked){showT("⏳ Betting closed! Wait for next round.","error");return;}
    setSelected(item);setShowSlip(true);
  };

  const getApiType = (tab) => {
  switch (tab) {
    case "Sum": return "SUM";
    case "Triple": return "TRIPLE";
    case "Double": return "DOUBLE";
    case "Single": return "SINGLE";
    default: return "SUM";
  }
};

const getApiValue = (selection) => {
  const id = String(selection.id);

  // 🎯 SINGLE (S1 → 1)
  if (id.startsWith("S")) {
    return Number(id.replace("S", ""));
  }

  // 🎯 DOUBLE (D1 → 1)
  if (id.startsWith("D")) {
    return Number(id.replace("D", ""));
  }

  // 🎯 TRIPLE (T1 → 1)
  if (id.startsWith("T")) {
    return Number(id.replace("T", ""));
  }

  // 🎯 SUM (BIG / SMALL / ODD / EVEN OR 3–18)
  return id;
};

const handleConfirm = async (selection, amount, qty) => {
  const total = amount * qty;

  if (total > balance.totalWallet) {
    showT("❌ Insufficient balance", "error");
    return;
  }

  try {
    const payload = {
      user_id: user?.id,
      key: periodKey,
      type: getApiType(betTab),
      value: getApiValue(selection),
      amount: total
    };

    const res = await placeDiceBet(payload);

    if (!res?.success) {
      showT(res?.message || "❌ Bet failed", "error");
      return;
    }

    // ✅ update wallet
    setBalance(prev => ({
      ...prev,
      totalWallet: prev.totalWallet - total
    }));

    // ✅ update local bets
    setBets(prev => [
      {
        id: Date.now(),
        selection,
        amount: total,
        qty,
        issue: roundId,
        settled: false
      },
      ...prev
    ]);

    setShowSlip(false);
    setSelected(null);

    showT(`✅ Bet placed ₹${total}`, "success");

  } catch (err) {
    console.log(err);
    showT("❌ Server error", "error");
  }
};



  const navigate =useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [showHowTo, setShowHowTo] = useState(false);
const [howToData, setHowToData] = useState("");
const [loadingHowTo, setLoadingHowTo] = useState(false);
const formatHowTo = (text) => {
  if (!text) return [];

  return text
    .split("\r\n")
    .filter(line => line.trim() !== "");
};
const lines = formatHowTo(howToData);

const handleHowToPlay = async () => {
  setShowHowTo(true);

  // prevent multiple calls
  if (howToData) return;

  setLoadingHowTo(true);

  const res = await getCategoryDesc({ seoUrl: "dice" });

  if (res?.success) {
    setHowToData(res.data?.description || "");
  }

  setLoadingHowTo(false);
};

const MiniBall = ({ number }) => {
  const isRed = number % 2 !== 0;   // same logic as your SUM_BETS
  const isGreen = number % 2 === 0;

  return (
    <div
      style={{
        width: 34,
        height: 34,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 🎯 BALL IMAGE */}
      <img
        src={isRed ? BALL_IMAGES.red : BALL_IMAGES.green}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />

      {/* 🔢 NUMBER */}
      <span
        style={{
          position: "absolute",
          fontSize: 13,
          fontWeight: 900,
          color: isRed ? "#e8302a" : "#2e7d32",
        }}
      >
        {number}
      </span>
    </div>
  );
};
  /* ══════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════ */
  return (
    <div style={{maxWidth:430,margin:"0 auto",background:"#f4f2fb",minHeight:"100vh",
      fontFamily:"'Poppins','Segoe UI',sans-serif",position:"relative",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes rollDice{0%{transform:rotate(-12deg) scale(1.05)}100%{transform:rotate(12deg) scale(0.95)}}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes fadeDown{from{opacity:0;transform:translateX(-50%) translateY(-12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        @keyframes resultPop{0%{transform:scale(0.6);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
        @keyframes urgentPulse{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)}50%{box-shadow:0 0 0 8px rgba(239,68,68,0)}}
        ::-webkit-scrollbar{display:none}
        button:active{opacity:0.85}
      `}</style>

      {/* TOAST */}
      {toast&&(
        <div style={{position:"fixed",top:68,left:"50%",transform:"translateX(-50%)",
          background:toast.type==="win"?"#16a34a":toast.type==="error"?"#ef4444":"#7c3aed",
          color:"white",padding:"10px 22px",borderRadius:24,
          fontSize:13,fontWeight:700,zIndex:999,
          boxShadow:"0 4px 20px rgba(0,0,0,0.3)",whiteSpace:"nowrap",
          animation:"fadeDown 0.3s ease"}}>
          {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <div style={{background:"#ffffff",display:"flex",alignItems:"center",
        justifyContent:"space-between",padding:"12px 16px",
        position:"sticky",top:0,zIndex:50}}>
        <button onClick={()=>navigate(-1)} style={{background:"rgba(255,255,255,0.15)",border:"none",
          color:"black",width:36,height:36,borderRadius:"50%",cursor:"pointer",
          fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}><ChevronLeft/></button>
        <span style={{color:"black",fontSize:17,fontWeight:800}}>🎲 Dice — {period.label}</span>
        <div style={{display:"flex",alignItems:"center",gap:8,
          background:"rgba(255,255,255,0.15)",borderRadius:20,padding:"4px 12px"}}>
          <span style={{color:"rgb(0, 0, 0)",fontSize:13}}>Balance</span>
          <span style={{color:"#ffd700",fontWeight:900,fontSize:14}}>{user ? `₹${balance.totalWallet || 0}` : "-"}</span>
        </div>
      </div>

      {/* PERIOD SELECTOR */}
      <PeriodSelector selected={period} onSelect={p => {
  setPeriod(p);
  setPeriodKey(p.key);   // ✅ IMPORTANT (API payload)
  setTimeLeft(p.seconds);
}}/>

      {/* ROUND INFO PANEL */}
      <div style={{background:"#e8e4f5",padding:"10px 14px",
        display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
        <div style={{flex:1}}>
          <button onClick={handleHowToPlay} style={{background:"white",border:"1px solid #ccc",borderRadius:12,
              padding:"2px 10px",fontSize:11,color:"#555",cursor:"pointer"}}>How to play</button>
          <div style={{display:"flex",alignItems:"center",gap:2,marginBottom:3, marginTop:3}}>
            <span style={{fontSize:12,fontWeight:800,color:"#3b1a8a"}}>{period.label}</span>
            <span style={{fontSize:11,color:"#6b4fa0",fontVariantNumeric:"tabular-nums"}}>{preRoundId}</span>
            
          </div>
          {/* mini history dice */}
          <div style={{ display: "flex", alignItems: "center", gap: 6,  marginTop:20}}>
  
  {/* 🎲 SMALL DICE */}
  {dice.map((d, i) => (
    <Dice3D  key={i} value={d} size={30}/>
  ))}

  {/* 🎯 RESULT TAGS */}  
  <div style={{ display: "flex", gap: 5, marginLeft: 6 }}>

    {/* SUM (green circle like image) */}
<MiniBall number={sum} />

{/* 🎯 BIG / SMALL IMAGE */}
<img
  src={getTagImage(sum <= 10 ? "SMALL" : "BIG")}
  style={{ width: 32, height: 32 }}
/>

{/* 🎯 ODD / EVEN IMAGE */}
<img
  src={getTagImage(sum % 2 === 0 ? "EVEN" : "ODD")}
  style={{ width: 32, height: 32 }}
/>

  </div>
</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
          <span style={{fontSize:10,color:urgent?"#ef4444":"#6b4fa0",
            fontWeight:urgent?700:400,transition:"color 0.3s"}}>
            {urgent?"⚠️ Time remaining":"Time remaining"}
          </span>
          <TimerDisplay timeLeft={timeLeft} urgent={urgent} />
          <span style={{fontSize:10,color:"#8b6bbf",fontVariantNumeric:"tabular-nums"}}>{roundId}</span>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div style={{height:5,background:"#d4ccf0"}}>
        <div style={{height:"100%",width:`${progress}%`,
          background:isLocked?"linear-gradient(90deg,#ef4444,#dc2626)":"linear-gradient(90deg,#7c3aed,#ec4899)",
          transition:"width 0.3s linear, background 0.3s"}}/>
      </div>

      {/* LIVE DICE PANEL */}


      {/* BET TABS */}
      <BetTabs selected={betTab} onSelect={setBetTab}/>

      {/* BET GRID */}
      <div style={{
  padding:"12px 10px 8px",
  position:"relative",
  minHeight: betTab === "Sum" ? 420 : 360
}}>
        <BetGrid
  tabBets={tabBets}
  selected={selected}
  onSelect={handleSelect}
  betTab={betTab}
/>
        {isLocked&&(
          <div style={{
            position:"absolute",inset:0,
            background:"rgba(0,0,0,0.18)",
            display:"flex",alignItems:"center",justifyContent:"center",
            borderRadius:8,pointerEvents:"none",
          }}>
            <span style={{background:"rgba(0,0,0,0.75)",color:"white",
              padding:"8px 18px",borderRadius:12,fontSize:13,fontWeight:700}}>
              🔒 Betting Closed
            </span>
          </div>
        )}
        {isGameClosed && (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.65)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      zIndex: 5,
    }}
  >
    <div
      style={{
        background: "rgba(0,0,0,0.85)",
        padding: "14px 22px",
        borderRadius: 12,
        color: "white",
        fontWeight: 800,
        fontSize: 14,
        textAlign: "center",
      }}
    >
      🚫 Game Closed<br />
      <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.8 }}>
        Please wait...
      </span>
    </div>
  </div>
)}
        {/* payout info */}
        <div style={{margin:"12px 4px 0",padding:"12px 14px",
          background:"#f0ebff",borderRadius:12,border:"1px solid #e0d8f8"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#7c3aed",marginBottom:5}}>📊 How Payouts Work</div>
          <div style={{fontSize:11,color:"#555",lineHeight:1.6}}>
            {betTab==="Sum"    &&"BIG (11–17) = 1.95X · SMALL (4–10) = 1.95X. Specific sum pays 6X–150X. Triple excluded from BIG/SMALL."}
            {betTab==="Triple" &&"All 3 dice show same number. Any Triple = 30X · Specific triple = 180X."}
            {betTab==="Double" &&"At least 2 dice show the same number = 11X."}
            {betTab==="Single" &&"1 matching die = 1X · 2 matching dice = 2X · 3 matching dice = 3X."}
          </div>
        </div>
      </div>

      <div style={{background:"white",marginTop:8}}>
        {/* Tab strip */}
        <div style={{display:"flex",borderBottom:"2px solid #f0eef8",overflowX:"auto"}}>
          {HIST_TABS.map(({key,label})=>(
            <button key={key} onClick={()=>setHistTab(key)} style={{
              flex:1,padding:"13px 4px",textAlign:"center",
              fontSize:13,fontWeight:600,whiteSpace:"nowrap",
              color:histTab===key?"#1a1a2e":"#888",
              background:"none",border:"none",cursor:"pointer",position:"relative",
            }}>
              {label}
              {histTab===key&&(
                <div style={{position:"absolute",bottom:-2,left:"15%",right:"15%",
                  height:3,background:"#7c3aed",borderRadius:2}}/>
              )}
            </button>
          ))}
        </div>

        {histTab === "result" && (
  <ResultHistoryTab
    history={history}
    histPage={histPage}
    hasMoreHistory={hasMoreHistory}
    handleNext={handleNext}
    handlePrev={handlePrev}
  />
)}
        {histTab==="winners" &&<WinnersTab       history={history}/>}
        {histTab==="analyze" &&<AnalyzeTab       history={history}/>}
        {histTab==="myorder" && <MyOrderTab 
  bets={bets} 
  setBets={setBets} 
  user={user} 
  periodKey={periodKey}   // ✅ ADD THIS
/>}

        <div style={{height:24}}/>
      </div>

      {/* BET SLIP */}
      {showSlip&&selected&&(
        <>
          <div onClick={()=>{setShowSlip(false);setSelected(null);}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:99}}/>
          <BetSlip selection={selected} balance={balance}
            onClose={()=>{setShowSlip(false);setSelected(null);}}
            onConfirm={handleConfirm}/>
        </>
      )}

      {showHowTo && (
  <>
    {/* BACKDROP */}
    <div
      onClick={() => setShowHowTo(false)}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 200
      }}
    />

    {/* MODAL */}
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%",
        maxWidth: 420,
        maxHeight: "70vh",
        overflowY: "auto",
        background: "#fff",
        borderRadius: 14,
        padding: 16,
        zIndex: 201,
        boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontWeight: 700 }}>How to Play</span>
        <button onClick={() => setShowHowTo(false)}>✕</button>
      </div>

      {loadingHowTo ? (
        <div style={{ textAlign: "center", padding: 20 }}>Loading...</div>
      ) : (
       <div style={{ fontSize: 13, color: "#444" }}>
  {lines.map((line, i) => {
    
    // 🎯 Section Titles
    if (
      line.includes("Big / Small") ||
      line.includes("Odd / Even") ||
      line.includes("Sum of Points") ||
      line.includes("Single Dice") ||
      line.includes("Double Dice") ||
      line.includes("Triple") ||
      line.includes("Game Odds") ||
      line.includes("DISCLAIMER")
    ) {
      return (
        <div key={i} style={{
          marginTop: 14,
          fontWeight: 700,
          fontSize: 14,
          color: "#7c3aed"
        }}>
          {line}
        </div>
      );
    }

    // 🎯 Highlight important lines
    if (line.includes("=") || line.includes("Bet on")) {
      return (
        <div key={i} style={{
          background: "#f5f3ff",
          padding: "8px 10px",
          borderRadius: 8,
          marginTop: 6,
          fontSize: 12
        }}>
          {line}
        </div>
      );
    }

    // 🧾 Normal text
    return (
      <div key={i} style={{ marginTop: 6 }}>
        {line}
      </div>
    );
  })}
</div>
      )}
    </div>
  </>
)}
    </div>
  );
}
