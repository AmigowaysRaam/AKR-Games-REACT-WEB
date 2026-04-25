import { useState, useEffect, useRef, useCallback } from "react";
import car1 from "../assets/car1.png";
import car2 from "../assets/car2.png";
import car3 from "../assets/car3.png";
import car4 from "../assets/car4.png";
import car5 from "../assets/car5.png";
import car6 from "../assets/car6.png";
import car7 from "../assets/car7.png";
import car8 from "../assets/car8.png";
import car9 from "../assets/car9.png";
import car10 from "../assets/car10.png";
import carBetting from "../assets/carbetting.jpg"
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
 
const CAR_IMAGES = {
  1: car1,
  2: car2,
  3: car3,
  4: car4,
  5: car5,
  6: car6,
  7: car7,
  8: car8,
  9: car9,
  10: car10,
};
const BANNER_IMG = carBetting;
 
const CAR_COLORS = {
  1:  { bg:"#FFD600", text:"#000", border:"#c8a800" },
  2:  { bg:"#29ABE2", text:"#fff", border:"#1a80b0" },
  3:  { bg:"#555",    text:"#fff", border:"#333"    },
  4:  { bg:"#FF6D00", text:"#fff", border:"#cc5800" },
  5:  { bg:"#00BFA5", text:"#fff", border:"#009980" },
  6:  { bg:"#3F51B5", text:"#fff", border:"#2c3a8a" },
  7:  { bg:"#78909C", text:"#fff", border:"#546e7a" },
  8:  { bg:"#E53935", text:"#fff", border:"#b71c1c" },
  9:  { bg:"#F44336", text:"#fff", border:"#c62828" },
  10: { bg:"#43A047", text:"#fff", border:"#2e7d32" },
};
 
const CYCLE_OPTIONS = [
  { label:"1.5 min", seconds:90  },
  { label:"3 min",   seconds:180 },
  { label:"5 min",   seconds:300 },
];
 
const BET_AMOUNTS  = [10,100,500,1000];
const MULT_OPTIONS = [
  {label:"x1",val:1},{label:"x3",val:3},{label:"x9",val:9},
  {label:"x27",val:27},{label:"x81",val:81},{label:"x243",val:243},{label:"x729",val:729}
];
const BET_TYPES = [
  {key:"BIG",  label:"BIG",   color:"#FF6B35"},
  {key:"SMALL",label:"SMALL", color:"#00BFA5"},
  {key:"ODD",  label:"ODD",   color:"#9C27B0"},
  {key:"EVEN", label:"EVEN",  color:"#E53935"},
];
 
function pad2(n){ return String(n).padStart(2,"0"); }
function genIssue(){
  const d=new Date();
  return `${d.getFullYear()}${pad2(d.getMonth()+1)}${pad2(d.getDate())}${String(Math.floor(Math.random()*9000)+1000)}`;
}
function genResult(){
  const a=[1,2,3,4,5,6,7,8,9,10];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

/* ── TOP BAR ─────────────────────────────────────────────────────────────── */
function TopBar({ balance, muted, onMute }) {
   const navigate = useNavigate()
  return (
    <div style={{background:"#4A2BA0",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{color:"#fff",fontSize:24,cursor:"pointer",lineHeight:1}} onClick={()=>navigate(-1)}><ChevronLeft/></span>
        <span style={{color:"#fff",fontWeight:800,fontSize:15,letterSpacing:0.5}}>QUICK RACE</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={onMute} style={{
          width:34,height:34,borderRadius:"50%",
          border:"2px solid rgba(255,255,255,0.45)",background:"rgba(255,255,255,0.15)",
          cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff"
        }}>{muted?"🔇":"🔊"}</button>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.7)"}}>Balance</div>
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            <span style={{color:"#fff",fontWeight:700,fontSize:14}}>₹{balance.toFixed(1)}</span>
            <span style={{fontSize:20}}>👜</span>
          </div>
        </div>
      </div>
    </div>
  );
}
 
/* ── CYCLE TABS ──────────────────────────────────────────────────────────── */
function CycleTabs({ active, onChange }) {
  return (
    <div style={{display:"flex",gap:8,padding:"10px 10px 0",background:"#3a2280"}}>
      {CYCLE_OPTIONS.map((o,i)=>(
        <button key={i} onClick={()=>onChange(i)} style={{
          flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,
          padding:"8px 4px",borderRadius:10,cursor:"pointer",border:"none",
          background:active===i?"rgba(255,255,255,0.13)":"rgba(0,0,0,0.25)",
          outline:active===i?"2.5px solid #4caf50":"2.5px solid transparent",
          transition:"all 0.2s",
        }}>
          <span style={{fontSize:20}}>⏱️</span>
          <span style={{fontSize:11,fontWeight:700,color:"#fff"}}>{o.label}</span>
        </button>
      ))}
    </div>
  );
}
 
/* ── ISSUE / TIMER BAR ───────────────────────────────────────────────────── */
function IssueBar({ issueNumber, nextIssue, betSecs, phase, lastWinner }) {
  const mm=pad2(Math.floor(betSecs/60)), ss=pad2(betSecs%60);
  return (
    <div style={{background:"#3a2280",padding:"8px 10px 12px",display:"flex",gap:8,alignItems:"flex-start"}}>
      {/* left */}
      <div style={{flex:1}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.65)",fontWeight:600,marginBottom:1}}>1.5 minutes</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.85)",fontFamily:"monospace",marginBottom:7}}>{issueNumber}</div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <img src={lastWinner?CAR_IMAGES[lastWinner]:CAR_IMAGES[4]} alt="" style={{width:66,height:34,objectFit:"contain"}}/>
          <div style={{width:28,height:28,borderRadius:6,background:"#FF6D00",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,color:"#fff"}}>S</div>
          <div style={{width:28,height:28,borderRadius:6,background:"#E53935",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,color:"#fff"}}>E</div>
          <button style={{padding:"5px 9px",borderRadius:7,background:"rgba(255,255,255,0.13)",border:"1px solid rgba(255,255,255,0.28)",color:"#fff",fontSize:10,cursor:"pointer",fontWeight:600}}>How to play</button>
        </div>
      </div>
      {/* right */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.65)",fontWeight:600}}>Left time to bet</div>
        <div style={{display:"flex",alignItems:"center",gap:2}}>
          {[mm[0],mm[1],":",ss[0],ss[1]].map((ch,i)=>
            ch===":"
              ? <span key={i} style={{color:"#fff",fontWeight:900,fontSize:20,margin:"0 1px"}}>:</span>
              : <div key={i} style={{width:26,height:32,background:"#0a0a0a",border:"1px solid #555",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:17,fontFamily:"monospace"}}>{ch}</div>
          )}
        </div>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontFamily:"monospace"}}>{nextIssue}</div>
      </div>
    </div>
  );
}
 
/* ── RESULT BALLS STRIP ──────────────────────────────────────────────────── */
function ResultBalls({ result }) {
  if(!result) return null;
  return (
    <div style={{display:"flex",gap:4,padding:"6px 8px",background:"#1a1a2e",overflowX:"auto",borderBottom:"3px solid #4caf50"}}>
      {result.map((n,i)=>(
        <div key={n} style={{
          width:26,height:26,borderRadius:"50%",flexShrink:0,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontWeight:900,fontSize:11,
          background:CAR_COLORS[n].bg,color:CAR_COLORS[n].text,
          border:i===0?"2.5px solid #FFD700":"none",
          boxShadow:i===0?`0 0 8px ${CAR_COLORS[n].bg}`:"none"
        }}>{n}</div>
      ))}
    </div>
  );
}
 
/* ── RACE TRACK ─────────────────────────────────────────────────────────── */
function RaceTrack({ phase, result, onRaceEnd }) {
  const LANES=[1,2,3,4,5,6,7,8,9,10];
  const [pos,setPos]=useState(Object.fromEntries(LANES.map(n=>[n,80])));
  const [done,setDone]=useState(false);
  const rafRef=useRef(null);
  const t0=useRef(null);
 
  useEffect(()=>{
    if(phase!=="racing"||!result) return;
    setDone(false);
    setPos(Object.fromEntries(LANES.map(n=>[n,110])));
    t0.current=null;
    cancelAnimationFrame(rafRef.current);
 
    const targets={};
    result.forEach((car,i)=>{ targets[car] = -8 - (i * 5);   });
    const DUR=7000;
 
    function step(ts){
      if(!t0.current) t0.current=ts;
      const el=ts-t0.current;
      const p=Math.min(el/DUR,1);
      const e=p<0.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
setPos(prev => {
  const newPos = { ...prev };

  LANES.forEach((car, i) => {
    const start = 100;
    const end = -8; 



const rank = result.indexOf(car);

// winner fastest, last slowest (clean scaling)
const speedFactor = 1 - (rank * 0.08);

const current =
  start - (start - end) * Math.min(e * speedFactor, 1);

    newPos[car] =
      current + Math.sin(el * 0.006 + i) * 0.4;
  });

  return newPos;
});;
      if(p<1) rafRef.current=requestAnimationFrame(step);
      else{ setDone(true); onRaceEnd?.(); }
    }
    rafRef.current=requestAnimationFrame(step);
    return()=>cancelAnimationFrame(rafRef.current);
  },[phase,result]);
 
  const TRACK_H=300;
 
  return (
    <div style={{position:"relative",width:"100%",height:TRACK_H,overflow:"hidden"}}>
      {/* Sky */}
      <div style={{position:"absolute",top:0,left:0,right: 40,
width: 20,height:"28%",background:"linear-gradient(180deg,#4fa8d8 0%,#87ceeb 100%)"}}>
        <span style={{position:"absolute",top:4,left:8,fontSize:20}}>🌴</span>
        <span style={{position:"absolute",top:3,right:24,fontSize:15}}>☁️</span>
        <span style={{position:"absolute",top:2,left:"38%",fontSize:13}}>☁️</span>
        <span style={{position:"absolute",top:5,left:"62%",fontSize:11}}>☁️</span>
        <span style={{position:"absolute",top:1,right:"40%",fontSize:18}}>🗼</span>
        {/* Water */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:9,background:"rgba(0,80,160,0.5)"}}/>
      </div>
 
      {/* Road */}
      <div style={{position:"absolute",top:"28%",left:0,right:0,bottom:0,background:"#3a3a3a"}}>
        {[1,2,3,4,5,6,7,8,9].map(i=>(
          <div key={i} style={{position:"absolute",left:0,right:0,top:`${i*10}%`,height:1,background:"rgba(255,255,255,0.1)"}}/>
        ))}
        {/* Finish line */}
     {/* Finish line LEFT */}
<div style={{
  position:"absolute",
  left:0,
  top:0,
  bottom:22,
  width:18,
  display:"flex",
  flexDirection:"column"
}}>
  {[...Array(14)].map((_,i)=>(
    <div key={i} style={{
      flex:1,
      background:i%2===0?"#fff":"#000"
    }}/>
  ))}
</div>
        {/* Bottom chevron strip */}
        <div style={{
          position:"absolute",bottom:0,left:0,right:0,height:22,
          background:"#222",display:"flex",alignItems:"center",padding:"0 6px",gap:10,overflow:"hidden"
        }}>
          {[...Array(16)].map((_,i)=>(
            <span key={i} style={{color:"#FFD600",fontSize:15,flexShrink:0}}>»</span>
          ))}
        </div>
      </div>
 
      {/* Cars on track */}
{/* Cars on track */}
{phase !== "betting" && LANES.map((car,laneIdx)=>{
  const xPct=pos[car]||2;
  const isWinner=done&&result&&result[0]===car;
  return (
    <div key={car} style={{
      position:"absolute",
      left: `${xPct}%`,// (your reversed direction if applied)
      top:`${28+laneIdx*7.05}%`,
      transform:"translateY(-50%)",
      display:"flex",
      alignItems:"center",
      filter:isWinner?"drop-shadow(0 0 7px #FFD700)":"none",
      zIndex:isWinner?10:5,
    }}>
      <img src={CAR_IMAGES[car]} alt={`car${car}`} style={{width:58,height:31,objectFit:"contain"}}/>
      {isWinner&&<span style={{fontSize:13,marginLeft:3}}>🏆</span>}
      {isWinner && (
  <div style={{
    position: "absolute",
    right: "-20px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 18,
    animation: "pop 0.6s ease"
  }}> 
    🏁✨
  </div>
)}<style>
{`
@keyframes pop {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
`}
</style>
    </div>
  );
})}
 
      {/* BETTING TIME overlay */}
    {phase==="betting"&&(
  <div style={{position:"absolute",inset:0}}>
    
    {/* Banner Background */}
    <img 
      src={BANNER_IMG} 
      alt="" 
      style={{
        width:"100%",
        height:"100%",
        objectFit:"cover",
        position:"absolute",
        inset:0,
        // 👈 important (so cars visible)
      }}
    />

    {/* Dark overlay */}
    <div style={{
      position:"absolute",
      inset:0,
      background:"rgba(0,0,0,0.4)"
    }}/>




  </div>
)}
 
      {/* Results banner */}
      {phase==="results"&&result&&done&&(
        <div style={{position:"absolute",top:8,left:8,right:8,display:"flex",justifyContent:"center"}}>
          <div style={{background:"rgba(0,0,0,0.78)",borderRadius:20,padding:"5px 16px",display:"flex",alignItems:"center",gap:6}}>
            <span style={{background:"#FFD700",color:"#000",fontWeight:700,fontSize:11,padding:"2px 12px",borderRadius:12}}>
              🏁 Winner: Car #{result[0]}  ·  {result.slice(0,3).map(n=>`#${n}`).join(" → ")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
 
/* ── WAITING PANEL (race in progress) ────────────────────────────────────── */
function WaitingPanel({ raceSecs }) {
  const mm=pad2(Math.floor(raceSecs/60)), ss=pad2(raceSecs%60);
  return (
    <div style={{background:"rgba(15,15,26,0.9)",padding:"20px 16px",textAlign:"center"}}>
      {/* blurred car colour blocks */}
      <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginBottom:12,filter:"blur(4px)",opacity:0.45}}>
        {[1,2,3,4,5,6,7,8,9,10].map(n=>(
          <div key={n} style={{width:42,height:42,borderRadius:8,background:CAR_COLORS[n].bg}}/>
        ))}
      </div>
      <p style={{color:"#fff",fontWeight:700,fontSize:15,margin:"0 0 4px"}}>The game has already started,</p>
      <p style={{color:"rgba(255,255,255,0.75)",fontSize:13,margin:"0 0 14px"}}>please place your bets later.</p>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
        <div style={{padding:"8px 16px",background:"#111",borderRadius:8,color:"#fff",fontWeight:900,fontSize:28,fontFamily:"monospace"}}>{mm}</div>
        <span style={{color:"#fff",fontWeight:900,fontSize:28}}>:</span>
        <div style={{padding:"8px 16px",background:"#111",borderRadius:8,color:"#fff",fontWeight:900,fontSize:28,fontFamily:"monospace"}}>{ss}</div>
      </div>
    </div>
  );
}
 
/* ── CAR GRID (two rows of 5 matching screenshot) ────────────────────────── */
function CarGrid({ onCarClick, phase }) {
  const disabled=phase!=="betting";
  return (
    <div style={{background:"#0d1220",padding:"10px 8px 6px"}}>
      {[[1,2,3,4,5],[6,7,8,9,10]].map((row,ri)=>(
        <div key={ri} style={{marginBottom:ri===0?10:0}}>
          {/* car images */}
          <div style={{display:"flex",gap:3,marginBottom:4}}>
            {row.map(n=>(
              <div key={n} style={{flex:1,display:"flex",justifyContent:"center"}}>
                <img src={CAR_IMAGES[n]} alt="" style={{width:90,height:57,objectFit:"contain"}}/>
              </div>
            ))}
          </div>
          {/* number buttons */}
          <div style={{display:"flex",gap:4}}>
            {row.map(n=>(
              <button key={n} onClick={()=>!disabled&&onCarClick(n)} style={{
                flex:1,padding:"7px 0 5px",borderRadius:10,cursor:disabled?"not-allowed":"pointer",
                background:CAR_COLORS[n].bg,border:`2.5px solid ${CAR_COLORS[n].border}`,
                opacity:disabled?0.5:1,display:"flex",flexDirection:"column",alignItems:"center",gap:1,
                transition:"transform 0.1s",
              }}>
                <span style={{color:CAR_COLORS[n].text,fontWeight:900,fontSize:18,lineHeight:1}}>{n}</span>
                <span style={{color:CAR_COLORS[n].text,fontSize:10,opacity:0.8}}>9.2</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
 
/* ── BIG / SMALL / ODD / EVEN ────────────────────────────────────────────── */
function BetTypeRow({ selected, onSelect, disabled }) {
  return (
    <div style={{display:"flex",gap:6,padding:"8px 8px",background:"#0d1220"}}>
      {BET_TYPES.map(bt=>(
        <button key={bt.key} disabled={disabled} onClick={()=>onSelect(bt.key)} style={{
          flex:1,padding:"10px 0",borderRadius:10,fontWeight:700,fontSize:12,cursor:disabled?"not-allowed":"pointer",
          background:selected===bt.key?bt.color:`${bt.color}33`,
          color:"#fff",border:`2px solid ${selected===bt.key?bt.color:`${bt.color}55`}`,
          opacity:disabled?0.5:1,fontFamily:"inherit",transition:"all 0.15s",
          boxShadow:selected===bt.key?`0 4px 14px ${bt.color}77`:"none"
        }}>{bt.label}</button>
      ))}
    </div>
  );
}
 
/* ── BET MODAL SHEET ─────────────────────────────────────────────────────── */
function BetModal({ car, onClose, onConfirm, balance }) {
  const [stake,setStake]=useState(10);
  const [mult,setMult]=useState(1);
  const [count,setCount]=useState(1);
  const total=stake*mult;
  if(!car) return null;
  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.52)",zIndex:50}}/>
      <div style={{
        position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
        width:"100%",maxWidth:430,background:"#fff",borderRadius:"18px 18px 0 0",
        zIndex:51,padding:"16px 16px 24px",
        animation:"su 0.3s cubic-bezier(.4,0,.2,1)",
      }}>
        <style>{`@keyframes su{from{transform:translateX(-50%) translateY(100%)}to{transform:translateX(-50%) translateY(0)}}`}</style>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span style={{fontSize:17,fontWeight:700,color:"#111"}}>Bet</span>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:"50%",background:"#f0f0f0",border:"none",cursor:"pointer",fontSize:16,color:"#555",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        {/* Car preview */}
        <div style={{background:"#faf7e8",borderRadius:12,padding:"14px 0",display:"flex",justifyContent:"center",marginBottom:14}}>
          <img src={CAR_IMAGES[car]} alt="" style={{width:155,height:78,objectFit:"contain"}}/>
        </div>
        {/* Stake buttons */}
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {BET_AMOUNTS.map(s=>(
            <button key={s} onClick={()=>setStake(s)} style={{
              flex:1,height:40,borderRadius:8,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",
              background:stake===s?"#22c55e":"#fff",color:stake===s?"#fff":"#333",
              border:`1.5px solid ${stake===s?"#22c55e":"#ddd"}`,transition:"all 0.15s"
            }}>₹{s}</button>
          ))}
        </div>
        {/* Multiple counter */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <span style={{fontSize:13,color:"#555",minWidth:70}}>Multiple:</span>
          <div style={{display:"flex",alignItems:"center",gap:14,border:"1px solid #e0e0e0",borderRadius:8,padding:"5px 14px"}}>
            <button onClick={()=>setCount(c=>Math.max(1,c-1))} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#333",lineHeight:1}}>−</button>
            <span style={{fontSize:15,fontWeight:700,color:"#111",minWidth:24,textAlign:"center"}}>{count}</span>
            <button onClick={()=>setCount(c=>c+1)} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#333",lineHeight:1}}>+</button>
          </div>
        </div>
        {/* Multiplier chips */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
          {MULT_OPTIONS.map(m=>(
            <button key={m.val} onClick={()=>setMult(m.val)} style={{
              padding:"5px 11px",borderRadius:7,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600,
              background:mult===m.val?"#dcfce7":"#f3f4f6",
              border:`1.5px solid ${mult===m.val?"#22c55e":"#e0e0e0"}`,
              color:mult===m.val?"#15803d":"#555",transition:"all 0.15s"
            }}>{m.label}</button>
          ))}
        </div>
        <button disabled={balance<total} onClick={()=>{onConfirm(car,stake,mult,total);onClose();}} style={{
          width:"100%",height:52,borderRadius:26,border:"none",fontFamily:"inherit",
          background:balance>=total?"#22c55e":"#ccc",color:"#fff",fontWeight:700,fontSize:16,
          cursor:balance>=total?"pointer":"not-allowed"
        }}>Total Price ₹{total}</button>
      </div>
    </>
  );
}
 
/* ── RESULT HISTORY ──────────────────────────────────────────────────────── */
function ResultHistory({ history, page, setPage }) {
  const PER=10,tot=history.length,pages=Math.max(1,Math.ceil(tot/PER));
  const rows=history.slice((page-1)*PER,page*PER);
  return (
    <div style={{background:"#0f0f1a"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead>
          <tr style={{background:"#1a1a2e"}}>
            <th style={{padding:"8px 12px",textAlign:"left",color:"#888",fontWeight:600}}>BET ID</th>
            <th style={{padding:"8px 12px",textAlign:"right",color:"#888",fontWeight:600}}>RESULT</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.issue} style={{borderBottom:"1px solid #1a1a2e"}}>
              <td style={{padding:"7px 12px",color:"#555",fontFamily:"monospace",fontSize:11}}>{r.issue}</td>
              <td style={{padding:"7px 12px"}}>
                <div style={{display:"flex",justifyContent:"flex-end",gap:3}}>
                  {r.result.map((n,i)=>(
                    <div key={n} style={{
                      width:22,height:22,borderRadius:"50%",flexShrink:0,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontWeight:700,fontSize:10,
                      background:CAR_COLORS[n].bg,color:CAR_COLORS[n].text,
                      border:i===0?"1.5px solid #FFD700":"none"
                    }}>{n}</div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
          {!rows.length&&<tr><td colSpan={2} style={{padding:32,textAlign:"center",color:"#555"}}>No results yet</td></tr>}
        </tbody>
      </table>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px"}}>
        <span style={{fontSize:11,color:"#888"}}>Total {tot}</span>
        <div style={{display:"flex",gap:5}}>
          {[...Array(Math.min(pages,4))].map((_,i)=>(
            <button key={i} onClick={()=>setPage(i+1)} style={{
              width:26,height:26,borderRadius:"50%",border:"none",cursor:"pointer",
              background:page===i+1?"#9B59B6":"rgba(255,255,255,0.1)",
              color:"#fff",fontSize:11,fontWeight:700,fontFamily:"inherit"
            }}>{i+1}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
 
/* ── MY ORDERS ───────────────────────────────────────────────────────────── */
function MyOrders({ orders }) {
  if(!orders.length) return <div style={{padding:48,textAlign:"center",color:"#555",fontSize:13}}>No bets placed yet.</div>;
  return (
    <div style={{padding:"8px 10px",background:"#0f0f1a"}}>
      {orders.map((o,i)=>(
        <div key={i} style={{borderRadius:12,padding:12,marginBottom:8,background:"#1a1a2e"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:10,color:"#666",fontFamily:"monospace"}}>{o.issue}</span>
            <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:10,
              background:o.status==="won"?"rgba(34,197,94,0.2)":o.status==="lost"?"rgba(239,68,68,0.2)":"rgba(234,179,8,0.2)",
              color:o.status==="won"?"#4ade80":o.status==="lost"?"#f87171":"#facc15"
            }}>{o.status==="won"?`+₹${o.payout}`:o.status==="lost"?`-₹${o.amount}`:"Pending"}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {o.car&&<div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,background:CAR_COLORS[o.car].bg,color:CAR_COLORS[o.car].text}}>{o.car}</div>}
            {o.betType&&<span style={{fontSize:11,padding:"2px 8px",borderRadius:10,fontWeight:700,background:BET_TYPES.find(b=>b.key===o.betType)?.color+"33",color:BET_TYPES.find(b=>b.key===o.betType)?.color}}>{o.betType}</span>}
            <span style={{fontSize:11,color:"#666",marginLeft:"auto"}}>₹{o.amount}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
 
/* ── CHART ───────────────────────────────────────────────────────────────── */
function ChartTrend({ history }) {
  const c=Object.fromEntries([...Array(10)].map((_,i)=>[i+1,0]));
  history.forEach(h=>{if(h.result?.[0]) c[h.result[0]]++;});
  const mx=Math.max(...Object.values(c),1);
  return (
    <div style={{padding:"16px 10px",background:"#0f0f1a"}}>
      <div style={{fontSize:11,color:"#888",marginBottom:14}}>Win frequency (last {history.length} races)</div>
      <div style={{display:"flex",alignItems:"flex-end",gap:3,height:110}}>
        {[...Array(10)].map((_,i)=>{
          const n=i+1,p=c[n]/mx;
          return (
            <div key={n} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
              <span style={{fontSize:10,color:"#888"}}>{c[n]}</span>
              <div style={{width:"100%",borderRadius:"3px 3px 0 0",height:`${Math.max(p*84,4)}px`,background:CAR_COLORS[n].bg}}/>
              <div style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,background:CAR_COLORS[n].bg,color:CAR_COLORS[n].text}}>{n}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
 
/* ── WIN TOAST ───────────────────────────────────────────────────────────── */
function WinToast({ win, onClose }) {
  useEffect(()=>{if(!win) return;const t=setTimeout(onClose,3000);return()=>clearTimeout(t);},[win]);
  if(!win) return null;
  return (
    <div style={{position:"fixed",top:72,left:"50%",zIndex:99,transform:"translateX(-50%)",background:"linear-gradient(90deg,#FFD700,#FF6B35)",borderRadius:16,padding:"12px 24px",boxShadow:"0 8px 28px rgba(255,215,0,0.5)"}}>
      <div style={{color:"#000",fontWeight:900,fontSize:17}}>🏆 YOU WON! +₹{win}</div>
    </div>
  );
}
 
/* ── BOTTOM TABS ─────────────────────────────────────────────────────────── */
function BottomTabs({ active, onChange }) {
  return (
    <div style={{display:"flex",background:"#1a1a2e",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
      {["Result History","Chart Trend","My Order"].map((t,i)=>(
        <button key={t} onClick={()=>onChange(i)} style={{
          flex:1,padding:"12px 0",fontSize:11,fontWeight:600,cursor:"pointer",
          color:active===i?"#fff":"#888",background:"none",border:"none",position:"relative",fontFamily:"inherit"
        }}>
          {t}
          {active===i&&<div style={{position:"absolute",bottom:0,left:"25%",right:"25%",height:2,borderRadius:2,background:"#9B59B6"}}/>}
        </button>
      ))}
    </div>
  );
}
 
/* ── MAIN ────────────────────────────────────────────────────────────────── */
export default function QuickRaceGame() {
  const [balance,setBalance]      = useState(2400);
  const [muted,setMuted]          = useState(false);
  const [cycleIdx,setCycleIdx]    = useState(0);
  const [phase,setPhase]          = useState("betting");
  const [betSecs,setBetSecs]      = useState(30);
  const [raceSecs,setRaceSecs]    = useState(0);
  const [issue,setIssue]          = useState(genIssue);
  const [nextIssue,setNextIssue]  = useState(genIssue);
  const [result,setResult]        = useState(null);
  const [lastResult,setLastResult]= useState(null);
  const [history,setHistory]      = useState(()=>[...Array(10)].map(()=>({issue:genIssue(),result:genResult()})));
  const [orders,setOrders]        = useState([]);
  const [tab,setTab]              = useState(0);
  const [histPage,setHistPage]    = useState(1);
  const [winToast,setWinToast]    = useState(null);
  const [modalCar,setModalCar]    = useState(null);
  const [betType,setBetType]      = useState(null);
 
  const cycleSecs = CYCLE_OPTIONS[cycleIdx].seconds;
  const betTime   = Math.floor(cycleSecs*0.4);
  const raceTime  = cycleSecs-betTime;
 
  /* betting countdown */
  useEffect(()=>{
    setBetSecs(betTime); setPhase("betting"); setResult(null);
    const tick=setInterval(()=>{
      setBetSecs(prev=>{
        if(prev<=1){ clearInterval(tick); launchRace(); return 0; }
        return prev-1;
      });
    },1000);
    return()=>clearInterval(tick);
  },[issue,cycleIdx]);
 
  const launchRace=useCallback(()=>{
    const r=genResult();
    setResult(r); setPhase("racing"); setRaceSecs(raceTime); setModalCar(null);
  },[raceTime]);
 
  /* race countdown display */
  useEffect(()=>{
    if(phase!=="racing") return;
    setRaceSecs(raceTime);
    const t=setInterval(()=>setRaceSecs(s=>Math.max(0,s-1)),1000);
    return()=>clearInterval(t);
  },[phase,raceTime]);
 
  const handleRaceEnd=useCallback(()=>{
    setPhase("results"); setLastResult(result);
    setOrders(prev=>prev.map(o=>{
      if(o.status!=="pending") return o;
      const w=result?.[0]; let won=false;
      if(o.car===w) won=true;
      if(o.betType==="BIG"  &&w>=6) won=true;
      if(o.betType==="SMALL"&&w<=5) won=true;
      if(o.betType==="ODD"  &&w%2!==0) won=true;
      if(o.betType==="EVEN" &&w%2===0) won=true;
      const payout=won?Math.floor(o.amount*(o.car?9.2:1.9)):0;
      if(won){setBalance(b=>b+payout);setWinToast(payout);}
      return{...o,status:won?"won":"lost",payout};
    }));
    setHistory(p=>[{issue,result},...p].slice(0,100));
    setTimeout(()=>{setIssue(genIssue());setNextIssue(genIssue());setBetType(null);},3000);
  },[result,issue]);
 
  const handleCarClick=n=>{ if(phase!=="betting") return; setModalCar(n); };
 
  const handleBetConfirm=(car,stake,mult,total)=>{
    if(balance<total) return;
    setBalance(b=>b-total);
    setOrders(p=>[{issue,car,betType:null,amount:total,status:"pending",payout:0},...p]);
  };
 
  const handleTypeQuickBet=amount=>{
    if(!betType||balance<amount) return;
    setBalance(b=>b-amount);
    setOrders(p=>[{issue,car:null,betType,amount,status:"pending",payout:0},...p]);
    setBetType(null);
  };
 
  const lastWinner=lastResult?.[0]||null;
 
  return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"100vh",background:"#0f0f1a",maxWidth:430,margin:"0 auto",fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <WinToast win={winToast} onClose={()=>setWinToast(null)}/>
 
      <TopBar balance={balance} muted={muted} onMute={()=>setMuted(m=>!m)}/>
      <CycleTabs active={cycleIdx} onChange={setCycleIdx}/>
      <IssueBar issueNumber={issue} nextIssue={nextIssue} betSecs={betSecs} phase={phase} lastWinner={lastWinner}/>
 
      {/* result balls strip (shows between races) */}
      {lastResult&&<ResultBalls result={lastResult}/>}
 
      {/* Race track — always shown, changes by phase */}
      <RaceTrack phase={phase} result={result} onRaceEnd={handleRaceEnd}/>
 
      {/* Waiting / race-in-progress panel */}
      {phase==="racing"&&<WaitingPanel raceSecs={raceSecs}/>}
 
      {/* Car grid */}
      <CarGrid onCarClick={handleCarClick} phase={phase}/>
 
      {/* BIG/SMALL/ODD/EVEN */}
      <BetTypeRow selected={betType} onSelect={k=>setBetType(p=>p===k?null:k)} disabled={phase!=="betting"}/>
 
      {/* Quick bet amounts for type bets */}
      {betType&&phase==="betting"&&(
        <div style={{background:"#16213e",padding:"8px 10px",display:"flex",gap:6}}>
          {[10,50,100,500].map(a=>(
            <button key={a} onClick={()=>handleTypeQuickBet(a)} style={{
              flex:1,height:36,borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer",
              background:"rgba(255,255,255,0.1)",color:"#fff",
              border:"1.5px solid rgba(255,255,255,0.2)",fontFamily:"inherit"
            }}>₹{a}</button>
          ))}
        </div>
      )}
 
      <BottomTabs active={tab} onChange={setTab}/>
      {tab===0&&<ResultHistory history={history} page={histPage} setPage={setHistPage}/>}
      {tab===1&&<ChartTrend history={history}/>}
      {tab===2&&<MyOrders orders={orders}/>}
 
      {modalCar&&<BetModal car={modalCar} onClose={()=>setModalCar(null)} onConfirm={handleBetConfirm} balance={balance}/>}
    </div>
  );
}
 