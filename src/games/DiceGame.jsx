/**
 * DiceGame.jsx  — Enhanced with:
 *  🔊 Web Audio API sound engine (zero external files)
 *     • Dice rolling rattle (multi-hit noise bursts)
 *     • Last-3-second tick-tock beeps
 *     • Win chime / Lose buzz
 *  📊 Full Result History section (Result History · Winners · Analyze · My Order)
 *     identical pattern to ColorPrediction screen
 *
 * Zero external dependencies — pure React + Web Audio API
 *
 * Usage:
 *   import DiceGame from './DiceGame';
 *   <DiceGame onBack={() => navigation.goBack()} />
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

/* ══════════════════════════════════════════════════════
   🔊  WEB AUDIO ENGINE   (all sounds synthesised)
══════════════════════════════════════════════════════ */
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

  /**
   * 🎲 Dice rolling rattle — 20 hits spread over 0.8 s
   *    Density highest at start, slows toward end (physical feel)
   */
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

/* ══════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════ */
const PERIODS = [
  { key: "1min",  label: "1min",  seconds: 60,  lockAt: 10 },
  { key: "3min",  label: "3min",  seconds: 180, lockAt: 30 },
  { key: "5min",  label: "5min",  seconds: 300, lockAt: 30 },
  { key: "15min", label: "15min", seconds: 900, lockAt: 30 },
];

const BET_TABS = ["Sum", "Triple", "Double", "Single"];

const SUM_BETS = [
  { id:"BIG",   label:"BIG",   payout:"1.95", multiplier:1.95, type:"special", color:"#e8302a" },
  { id:"SMALL", label:"SMALL", payout:"1.95", multiplier:1.95, type:"special", color:"#3aaee0" },
  { id:"ODD",   label:"Odd",   payout:"1.95", multiplier:1.95, type:"special", color:"#e8302a", italic:true },
  { id:"EVEN",  label:"Even",  payout:"1.95", multiplier:1.95, type:"special", color:"#3aaee0", italic:true },
  ...[
    [3,150],[4,50],[5,18],[6,14],[7,12],[8,8],[9,6],
    [10,6],[11,6],[12,6],[13,8],[14,12],[15,14],[16,18],[17,50],[18,150],
  ].map(([id,m],i) => ({ id, payout:String(m), multiplier:m, color:i%2===0?"#e8302a":"#4caf50" })),
];

const TRIPLE_BETS = [
  { id:"ANY_TRIPLE", label:"Any Triple", payout:"30",  multiplier:30,  color:"#9c27b0", type:"label" },
  ...[1,2,3,4,5,6].map((n,i)=>({ id:`T${n}`, label:String(n), payout:"180", multiplier:180, color:i%2===0?"#e8302a":"#4caf50" })),
];

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

/* ══════════════════════════════════════════════════════
   BET SETTLEMENT LOGIC
══════════════════════════════════════════════════════ */
function settleBet(bet, dice, sum) {
  const isTriple = dice[0]===dice[1] && dice[1]===dice[2];
  const isBig    = sum>=11 && sum<=17 && !isTriple;
  const isSmall  = sum>=4  && sum<=10 && !isTriple;
  const isOdd    = sum%2!==0 && !isTriple;
  const isEven   = sum%2===0 && !isTriple;
  switch (bet.id) {
    case "BIG":         return isBig    ? bet.multiplier : 0;
    case "SMALL":       return isSmall  ? bet.multiplier : 0;
    case "ODD":         return isOdd    ? bet.multiplier : 0;
    case "EVEN":        return isEven   ? bet.multiplier : 0;
    case "ANY_TRIPLE":  return isTriple ? 30             : 0;
    case "T1": return dice.every(d=>d===1) ? 180 : 0;
    case "T2": return dice.every(d=>d===2) ? 180 : 0;
    case "T3": return dice.every(d=>d===3) ? 180 : 0;
    case "T4": return dice.every(d=>d===4) ? 180 : 0;
    case "T5": return dice.every(d=>d===5) ? 180 : 0;
    case "T6": return dice.every(d=>d===6) ? 180 : 0;
    case "D1": return dice.filter(d=>d===1).length>=2 ? 11 : 0;
    case "D2": return dice.filter(d=>d===2).length>=2 ? 11 : 0;
    case "D3": return dice.filter(d=>d===3).length>=2 ? 11 : 0;
    case "D4": return dice.filter(d=>d===4).length>=2 ? 11 : 0;
    case "D5": return dice.filter(d=>d===5).length>=2 ? 11 : 0;
    case "D6": return dice.filter(d=>d===6).length>=2 ? 11 : 0;
    case "S1":{ const c=dice.filter(d=>d===1).length; return c?c:0; }
    case "S2":{ const c=dice.filter(d=>d===2).length; return c?c:0; }
    case "S3":{ const c=dice.filter(d=>d===3).length; return c?c:0; }
    case "S4":{ const c=dice.filter(d=>d===4).length; return c?c:0; }
    case "S5":{ const c=dice.filter(d=>d===5).length; return c?c:0; }
    case "S6":{ const c=dice.filter(d=>d===6).length; return c?c:0; }
    default:
      if (typeof bet.id === "number") return sum===bet.id ? bet.multiplier : 0;
      return 0;
  }
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
function DiceFace({ value, size=38, rolling=false, flash=false }) {
  const dots = DICE_DOTS[value] || DICE_DOTS[1];
  const r    = Math.max(5, Math.round(size*0.115));
  return (
    <div style={{
      width:size, height:size,
      background: flash?"#fff9c4":"white",
      borderRadius:size*0.18,
      border:`2px solid ${flash?"#f59e0b":"#ccc"}`,
      display:"flex", alignItems:"center", justifyContent:"center",
      boxShadow: rolling?"0 0 16px rgba(255,200,0,0.6)":"0 2px 6px rgba(0,0,0,0.25)",
      animation: rolling?"rollDice 0.18s ease-in-out infinite alternate":"none",
      transition:"box-shadow 0.2s, border-color 0.2s, background 0.2s",
      flexShrink:0,
    }}>
      <svg width={size-8} height={size-8} viewBox="0 0 100 100">
        {dots.map(([cx,cy],i)=>(
          <circle key={i} cx={cx} cy={cy} r={r} fill={flash?"#92400e":"#1a1a2e"}/>
        ))}
      </svg>
    </div>
  );
}

function DigitBox({digit,urgent}) {
  return (
    <div style={{
      background:"#111", color: urgent?"#ef4444":"white",
      fontSize:19, fontWeight:900,
      width:28, height:34,
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
    <div style={{display:"flex",alignItems:"center",gap:3}}>
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
    <div style={{display:"flex",background:"white",borderBottom:"1px solid #f0eef8"}}>
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

function BetBall({item,selected,onSelect,size=74}) {
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

  if (item.type==="special") return (
    <button onClick={()=>onSelect(item)} style={{...common,background:isSel?item.color:"white"}}>
      <div style={{width:44,height:44,borderRadius:"50%",background:item.color,
        display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{color:"white",fontSize:item.italic?13:14,fontWeight:900,fontStyle:item.italic?"italic":"normal"}}>
          {item.label}
        </span>
      </div>
      <span style={{fontSize:11,color:isSel?"white":"#888",fontWeight:600}}>{item.payout}X</span>
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

  return (
    <button onClick={()=>onSelect(item)} style={{...common,background:isSel?"#f5f0ff":"white"}}>
      <div style={{
        width:48,height:48,borderRadius:"50%",background:item.color,
        display:"flex",alignItems:"center",justifyContent:"center",
        position:"relative",overflow:"hidden",
        borderTop:"2px solid rgba(255,255,255,0.4)",
        boxShadow:"inset -3px -3px 8px rgba(0,0,0,0.25)",
      }}>
        <div style={{position:"absolute",top:6,left:9,width:12,height:8,
          borderRadius:"50%",background:"rgba(255,255,255,0.5)"}}/>
        <span style={{color:"white",fontSize:17,fontWeight:900,
          textShadow:"0 1px 3px rgba(0,0,0,0.4)"}}>{item.id}</span>
      </div>
      <span style={{fontSize:11,color:isSel?item.color:"#888",fontWeight:600}}>{item.payout}X</span>
    </button>
  );
}

/* ══════════════════════════════════════════════════════
   BET SLIP
══════════════════════════════════════════════════════ */
function BetSlip({selection,balance,onClose,onConfirm}) {
  const [amount,setAmount]=useState(100);
  const [qty,setQty]=useState(1);
  const [active,setActive]=useState(100);
  const total=amount*qty;
  const potential=Math.round(total*(selection.multiplier||1.95));
  const canBet=total<=balance&&total>0;
  const label=selection.label||String(selection.id);

  return (
    <div style={{
      position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
      width:"100%",maxWidth:430,background:"white",borderRadius:"20px 20px 0 0",
      boxShadow:"0 -8px 40px rgba(0,0,0,0.22)",zIndex:100,animation:"slideUp 0.25s ease-out",
    }}>
      <div style={{width:40,height:4,background:"#ddd",borderRadius:2,margin:"10px auto 0"}}/>
      <div style={{background:"#7c3aed",padding:"14px 18px",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        borderRadius:"20px 20px 0 0"}}>
        <div>
          <div style={{color:"white",fontSize:15,fontWeight:800}}>{label} — {selection.payout}X</div>
          <div style={{color:"rgba(255,255,255,0.6)",fontSize:11,marginTop:2}}>Multiplier: {selection.multiplier}x</div>
        </div>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"white",
          width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:18,fontWeight:700}}>×</button>
      </div>
      <div style={{padding:"16px 18px"}}>
        <div style={{display:"flex",justifyContent:"space-between",background:"#f8f6ff",
          borderRadius:10,padding:"10px 14px",marginBottom:14}}>
          <div>
            <div style={{fontSize:11,color:"#888"}}>Wallet Balance</div>
            <div style={{fontSize:16,fontWeight:900,color:"#1a1a2e"}}>₹{balance.toLocaleString("en-IN")}</div>
          </div>
        </div>
        <div style={{fontSize:11,color:"#888",marginBottom:6,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5}}>
          Quick Amount
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
          {QUICK_AMOUNTS.map(a=>(
            <button key={a} onClick={()=>{setAmount(a);setActive(a);}} style={{
              padding:"7px 14px",borderRadius:8,cursor:"pointer",
              background:active===a?"#7c3aed":"#f0eef8",
              color:active===a?"white":"#5b3fa0",
              border:`1.5px solid ${active===a?"#7c3aed":"#ddd"}`,
              fontSize:13,fontWeight:700,transition:"all 0.15s",
            }}>₹{a}</button>
          ))}
        </div>
        <div style={{fontSize:11,color:"#888",marginBottom:6,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5}}>
          Bet Amount
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <button onClick={()=>setAmount(a=>Math.max(10,a-10))} style={{
            width:40,height:40,borderRadius:10,background:"#f0eef8",
            border:"1.5px solid #e0dcf0",color:"#7c3aed",fontSize:20,fontWeight:900,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
          <input type="number" value={amount}
            onChange={e=>{setAmount(Math.max(10,parseInt(e.target.value)||10));setActive(null);}}
            style={{flex:1,border:"2px solid #d4ccf0",borderRadius:10,padding:"10px",
              fontSize:18,fontWeight:800,textAlign:"center",color:"#1a1a2e",outline:"none"}}/>
          <button onClick={()=>setAmount(a=>a+10)} style={{
            width:40,height:40,borderRadius:10,background:"#7c3aed",
            border:"none",color:"white",fontSize:20,fontWeight:900,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
          <span style={{fontSize:11,color:"#888",fontWeight:700,textTransform:"uppercase"}}>Qty</span>
          <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{
            width:34,height:34,borderRadius:"50%",background:"#f0eef8",
            border:"1.5px solid #e0dcf0",color:"#7c3aed",fontSize:20,fontWeight:900,cursor:"pointer"}}>−</button>
          <span style={{fontSize:18,fontWeight:900,minWidth:32,textAlign:"center"}}>{qty}</span>
          <button onClick={()=>setQty(q=>q+1)} style={{
            width:34,height:34,borderRadius:"50%",background:"#7c3aed",
            border:"none",color:"white",fontSize:20,fontWeight:900,cursor:"pointer"}}>+</button>
          <div style={{marginLeft:"auto",textAlign:"right"}}>
            <div style={{fontSize:11,color:"#888"}}>Total</div>
            <div style={{fontWeight:900,color:"#7c3aed",fontSize:16}}>₹{total}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:11,color:"#888"}}>Potential Win</div>
            <div style={{fontWeight:900,color:"#16a34a",fontSize:16}}>₹{potential}</div>
          </div>
        </div>
        <button onClick={()=>canBet&&onConfirm(selection,amount,qty)} style={{
          width:"100%",padding:15,borderRadius:14,border:"none",
          background:canBet?"linear-gradient(135deg,#7c3aed,#9d5cf5)":"#ccc",
          color:"white",fontSize:16,fontWeight:800,cursor:canBet?"pointer":"not-allowed",
          boxShadow:canBet?"0 4px 16px rgba(124,58,237,0.4)":"none",
        }}>{!canBet?"Insufficient Balance":`Confirm Bet · ₹${total}`}</button>
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

function ResultHistoryTab({history}) {
  const tc = t => t==="BIG"?"#ef4444":"#3b82f6";
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 90px 60px 60px",
        padding:"8px 14px",background:"#f8f6ff",borderBottom:"1px solid #ede9f8"}}>
        {["ISSUE","DICE","SUM","TAG"].map(h=>(
          <span key={h} style={{fontSize:11,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:0.5}}>{h}</span>
        ))}
      </div>
      {history.map((row,i)=>(
        <div key={i} style={{
          display:"grid",gridTemplateColumns:"1fr 90px 60px 60px",
          padding:"11px 14px",borderBottom:"1px solid #f4f2fc",alignItems:"center",
          background:i%2===0?"white":"#faf9ff",
        }}>
          <span style={{fontSize:11,color:"#555",fontVariantNumeric:"tabular-nums"}}>{row.issue}</span>
          <div style={{display:"flex",gap:3}}>
            {row.dice.map((d,j)=><DiceFace key={j} value={d} size={20}/>)}
          </div>
          <span style={{fontSize:15,fontWeight:800,color:tc(row.tag)}}>{row.sum}</span>
          <span style={{
            fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:20,
            background:tc(row.tag)+"18",color:tc(row.tag),
          }}>{row.tag}</span>
        </div>
      ))}
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
                {w.dice.map((d,j)=><DiceFace key={j} value={d} size={16}/>)}
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

function MyOrderTab({bets}) {
  if (!bets.length) return (
    <div style={{padding:40,textAlign:"center",color:"#bbb"}}>
      <div style={{fontSize:42,marginBottom:12}}>🎲</div>
      <div style={{fontSize:14,fontWeight:600}}>No bets placed yet</div>
      <div style={{fontSize:12,marginTop:4}}>Place a bet to see your order history</div>
    </div>
  );
  return (
    <div>
      {bets.map((b,i)=>{
        const settled=b.settled;
        const wlColor=!settled?"#f59e0b":b.won?"#16a34a":"#ef4444";
        const wlLabel=!settled?"PENDING":b.won?"WON":"LOST";
        return (
          <div key={i} style={{padding:"12px 14px",borderBottom:"1px solid #f4f2fc",
            display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                <span style={{fontSize:14,fontWeight:700,color:"#1a1a2e"}}>
                  {b.selection.label||String(b.selection.id)}
                </span>
                <span style={{fontSize:11,fontWeight:700,padding:"1px 8px",borderRadius:10,
                  background:wlColor+"22",color:wlColor}}>{wlLabel}</span>
              </div>
              <div style={{fontSize:11,color:"#888"}}>
                Issue {b.issue} · Bet ₹{b.amount} · {b.selection.payout}X
              </div>
              {settled&&b.dice&&(
                <div style={{display:"flex",gap:3,marginTop:4,alignItems:"center"}}>
                  {b.dice.map((d,j)=><DiceFace key={j} value={d} size={18}/>)}
                  <span style={{fontSize:11,color:"#888",marginLeft:3}}>Sum {b.dice.reduce((a,c)=>a+c,0)}</span>
                </div>
              )}
            </div>
            <div style={{textAlign:"right"}}>
              {settled
                ?b.won
                  ?<div style={{fontSize:16,fontWeight:800,color:"#16a34a"}}>+₹{b.payout}</div>
                  :<div style={{fontSize:16,fontWeight:800,color:"#ef4444"}}>−₹{b.amount}</div>
                :<div style={{fontSize:13,fontWeight:600,color:"#f59e0b"}}>Pending</div>
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}

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
  const [timeLeft,    setTimeLeft]    = useState(PERIODS[0].seconds);
  const [roundId,     setRoundId]     = useState("20260325010675");
  const [nextRoundId, setNextRoundId] = useState("20260325010676");
  const [dice,        setDice]        = useState([2,4,3]);
  const [rolling,     setRolling]     = useState(false);
  const [flashDice,   setFlashDice]   = useState(false);
  const [history,     setHistory]     = useState(()=>seedHistory());
  const [betTab,      setBetTab]      = useState("Sum");
  const [selected,    setSelected]    = useState(null);
  const [showSlip,    setShowSlip]    = useState(false);
  const [balance,     setBalance]     = useState(5000);
  const [bets,        setBets]        = useState([]);
  const [histTab,     setHistTab]     = useState("result");
  const [toast,       setToast]       = useState(null);

  const timerRef  = useRef(null);
  const audio     = useAudioEngine();
  const isLocked  = timeLeft <= period.lockAt;
  const urgent    = timeLeft <= 3 && isLocked;
  const progress  = ((period.seconds - timeLeft) / period.seconds) * 100;
  const sum       = dice.reduce((a,b)=>a+b,0);
  const sumTag    = sum>=11?"BIG":"SMALL";
  const tabBets   = {Sum:SUM_BETS,Triple:TRIPLE_BETS,Double:DOUBLE_BETS,Single:SINGLE_BETS}[betTab];

  /* ── TIMER ── */
  useEffect(()=>{
    clearInterval(timerRef.current);
    setTimeLeft(period.seconds);
    timerRef.current=setInterval(()=>{
      setTimeLeft(prev=>{
        const next=prev-1;
        /* Tick: last 3 seconds while in lock zone */
        if (next > 0 && next <= 3) {
  audio.playTick(next === 1);
}
        if(next<=0){ triggerRoll(); return period.seconds; }
        return next;
      });
    },1000);
    return ()=>clearInterval(timerRef.current);
  },[period]);

  /* ── ROLL ── */
  const triggerRoll=useCallback(()=>{
    audio.playRoll();
    setRolling(true);
    setFlashDice(false);
    const rollInt=setInterval(()=>{
      setDice([Math.ceil(Math.random()*6),Math.ceil(Math.random()*6),Math.ceil(Math.random()*6)]);
    },80);
    setTimeout(()=>{
      clearInterval(rollInt);
      const fd=[Math.ceil(Math.random()*6),Math.ceil(Math.random()*6),Math.ceil(Math.random()*6)];
      const fsum=fd.reduce((a,b)=>a+b,0);
      setDice(fd);
      setRolling(false);
      setFlashDice(true);
      setTimeout(()=>setFlashDice(false),800);

      let anyWin=false,anyLose=false;
      setBets(prev=>{
        const settled=prev.map(b=>{
          if(b.settled)return b;
          const mult=settleBet(b.selection,fd,fsum);
          const won=mult>0;
          const payout=won?Math.round(b.amount*mult):0;
          if(won){anyWin=true;setBalance(bal=>bal+payout);}
          else anyLose=true;
          return{...b,settled:true,dice:fd,won,payout};
        });
        return settled;
      });
      setTimeout(()=>{
        if(anyWin) audio.playWin();
        else if(anyLose) audio.playLose();
      },100);

      const tag=fsum>=11?"BIG":"SMALL";
      setHistory(prev=>[
        {issue:String(parseInt(roundId)+1),dice:fd,sum:fsum,tag,even:fsum%2===0},
        ...prev.slice(0,49),
      ]);
      setRoundId(r=>String(parseInt(r)+1));
      setNextRoundId(r=>String(parseInt(r)+1));
    },750);
  },[roundId,audio]);

  const handleSelect=item=>{
    if(isLocked){showT("⏳ Betting closed! Wait for next round.","error");return;}
    setSelected(item);setShowSlip(true);
  };

  const handleConfirm=(selection,amount,qty)=>{
    const total=amount*qty;
    if(total>balance){showT("❌ Insufficient balance","error");return;}
    setBalance(b=>b-total);
    setBets(prev=>[{id:Date.now(),selection,amount:total,qty,issue:roundId,settled:false},...prev]);
    setShowSlip(false);setSelected(null);
    showT(`✅ Bet ₹${total} on ${selection.label||selection.id}`);
  };

  const showT=(msg,type="info")=>{
    setToast({msg,type});
    setTimeout(()=>setToast(null),2600);
  };
  const navigate =useNavigate();

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
      <div style={{background:"#7c3aed",display:"flex",alignItems:"center",
        justifyContent:"space-between",padding:"12px 16px",
        position:"sticky",top:0,zIndex:50}}>
        <button onClick={()=>navigate(-1)} style={{background:"rgba(255,255,255,0.15)",border:"none",
          color:"white",width:36,height:36,borderRadius:"50%",cursor:"pointer",
          fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
        <span style={{color:"white",fontSize:17,fontWeight:800}}>🎲 Dice — {period.label}</span>
        <div style={{display:"flex",alignItems:"center",gap:8,
          background:"rgba(255,255,255,0.15)",borderRadius:20,padding:"4px 12px"}}>
          <span style={{color:"rgba(255,255,255,0.75)",fontSize:10}}>Balance</span>
          <span style={{color:"#ffd700",fontWeight:900,fontSize:14}}>₹{balance.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* PERIOD SELECTOR */}
      <PeriodSelector selected={period} onSelect={p=>{setPeriod(p);setTimeLeft(p.seconds);}}/>

      {/* ROUND INFO PANEL */}
      <div style={{background:"#e8e4f5",padding:"10px 14px",
        display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
            <span style={{fontSize:12,fontWeight:800,color:"#3b1a8a"}}>{period.label}</span>
            <span style={{fontSize:11,color:"#6b4fa0",fontVariantNumeric:"tabular-nums"}}>{roundId}</span>
            <button style={{background:"white",border:"1px solid #ccc",borderRadius:12,
              padding:"2px 10px",fontSize:11,color:"#555",cursor:"pointer"}}>How to play</button>
          </div>
          {/* mini history dice */}
          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
            {history.slice(0,3).map((h,i)=>(
              <div key={i} style={{display:"flex",gap:2,alignItems:"center"}}>
                {h.dice.map((d,j)=><DiceFace key={j} value={d} size={22}/>)}
                <span style={{fontSize:10,fontWeight:700,marginLeft:2,
                  color:h.tag==="BIG"?"#ef4444":"#3b82f6"}}>{h.sum}</span>
                {i<2&&<div style={{width:1,height:20,background:"#c5bde8",margin:"0 4px"}}/>}
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
          <span style={{fontSize:10,color:urgent?"#ef4444":"#6b4fa0",
            fontWeight:urgent?700:400,transition:"color 0.3s"}}>
            {urgent?"⚠️ Time remaining":"Time remaining"}
          </span>
          <CountdownTimer seconds={timeLeft} urgent={urgent}/>
          <span style={{fontSize:10,color:"#8b6bbf",fontVariantNumeric:"tabular-nums"}}>{nextRoundId}</span>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div style={{height:5,background:"#d4ccf0"}}>
        <div style={{height:"100%",width:`${progress}%`,
          background:isLocked?"linear-gradient(90deg,#ef4444,#dc2626)":"linear-gradient(90deg,#7c3aed,#ec4899)",
          transition:"width 1s linear, background 0.5s"}}/>
      </div>

      {/* LIVE DICE PANEL */}
      <div style={{
        background:urgent
          ?"linear-gradient(135deg,#dc2626,#ef4444)"
          :"linear-gradient(135deg,#7c3aed,#9d5cf5)",
        padding:"18px 20px",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        transition:"background 0.4s",
        ...(urgent?{animation:"urgentPulse 0.8s ease infinite"}:{})
      }}>
        <div>
          <div style={{color:"rgba(255,255,255,0.75)",fontSize:11,marginBottom:8}}>
            {rolling?"🎲 Rolling...":isLocked?"🔒 Betting Locked":"🎲 Place Your Bets"}
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {dice.map((d,i)=>(
              <DiceFace key={i} value={d} size={46} rolling={rolling} flash={flashDice}/>
            ))}
            <div style={{
              background:"rgba(255,255,255,0.18)",borderRadius:12,
              padding:"6px 14px",marginLeft:6,
              animation:flashDice?"resultPop 0.45s ease":"none",
            }}>
              <div style={{color:"rgba(255,255,255,0.7)",fontSize:10}}>Sum</div>
              <div style={{color:"#ffd700",fontSize:24,fontWeight:900,lineHeight:1.1}}>{sum}</div>
              <div style={{fontSize:11,fontWeight:800,marginTop:2,
                color:sumTag==="BIG"?"#fca5a5":"#93c5fd"}}>{sumTag}</div>
            </div>
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          {bets.filter(b=>!b.settled).length>0&&(
            <div style={{background:"#ffd700",color:"#333",borderRadius:10,
              padding:"4px 12px",marginBottom:6,fontSize:12,fontWeight:800}}>
              {bets.filter(b=>!b.settled).length} Active Bet{bets.filter(b=>!b.settled).length>1?"s":""}
            </div>
          )}
          {urgent&&(
            <div style={{color:"#ffd700",fontSize:13,fontWeight:900,letterSpacing:1}}>
              ⚡ {timeLeft}s
            </div>
          )}
        </div>
      </div>

      {/* BET TABS */}
      <BetTabs selected={betTab} onSelect={setBetTab}/>

      {/* BET GRID */}
      <div style={{padding:"12px 10px 8px",position:"relative"}}>
        <div style={{
          display:"grid",
          gridTemplateColumns:betTab==="Sum"?"repeat(4,1fr)":"repeat(3,1fr)",
          gap:8,
        }}>
          {tabBets.map(item=>(
            <BetBall key={item.id} item={item} selected={selected}
              onSelect={handleSelect} size={betTab==="Sum"?74:90}/>
          ))}
        </div>
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

      {/* ════════════════════════════════════════
          📊 RESULT HISTORY  (like ColorPrediction)
      ════════════════════════════════════════ */}
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

        {histTab==="result"  &&<ResultHistoryTab history={history}/>}
        {histTab==="winners" &&<WinnersTab       history={history}/>}
        {histTab==="analyze" &&<AnalyzeTab       history={history}/>}
        {histTab==="myorder" &&<MyOrderTab       bets={bets}/>}

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
    </div>
  );
}
