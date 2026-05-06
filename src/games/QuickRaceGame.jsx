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
import carBetting from "../assets/carbetting.jpg";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
 
/* ─── CONSTANTS ──────────────────────────────────────────────────────────── */
 
const CAR_IMAGES = {
  1:car1,2:car2,3:car3,4:car4,5:car5,
  6:car6,7:car7,8:car8,9:car9,10:car10
};
const BANNER_IMG = carBetting;
 
const CAR_COLORS = {
  1:  { bg:"#FFD600", text:"#000", border:"#c8a800" },
  2:  { bg:"#29ABE2", text:"#fff", border:"#1a80b0" },
  3:  { bg:"#888",    text:"#fff", border:"#555"    },
  4:  { bg:"#FF6D00", text:"#fff", border:"#cc5800" },
  5:  { bg:"#00BFA5", text:"#fff", border:"#009980" },
  6:  { bg:"#3F51B5", text:"#fff", border:"#2c3a8a" },
  7:  { bg:"#78909C", text:"#fff", border:"#546e7a" },
  8:  { bg:"#E53935", text:"#fff", border:"#b71c1c" },
  9:  { bg:"#E91E63", text:"#fff", border:"#c2185b" },
  10: { bg:"#43A047", text:"#fff", border:"#2e7d32" },
};
 
const TYPE_META = {
  BIG:  { color:"#FF6B35", desc:"Cars 6–10",       mult:1.9 },
  SMALL:{ color:"#29ABE2", desc:"Cars 1–5",         mult:1.9 },
  ODD:  { color:"#9C27B0", desc:"Cars 1,3,5,7,9",  mult:1.9 },
  EVEN: { color:"#E53935", desc:"Cars 2,4,6,8,10", mult:1.9 },
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
 
function pad2(n){ return String(n).padStart(2,"0"); }
function genIssue(){
  const d=new Date();
  return `${d.getFullYear()}${pad2(d.getMonth()+1)}${pad2(d.getDate())}${String(Math.floor(Math.random()*9000)+1000)}`;
}
function genResult(){
  const a=[1,2,3,4,5,6,7,8,9,10];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
 
/* ─── TOP BAR ────────────────────────────────────────────────────────────── */
function TopBar({ balance, muted, onMute }) {
  const navigate = useNavigate();
  return (
    <div style={{background:"#4A2BA0",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{color:"#fff",cursor:"pointer",display:"flex"}} onClick={()=>navigate(-1)}>
          <ChevronLeft size={24}/>
        </span>
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
 
/* ─── CYCLE TABS ─────────────────────────────────────────────────────────── */
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
 
/* ─── ISSUE / TIMER BAR ──────────────────────────────────────────────────── */
function IssueBar({ issueNumber, nextIssue, betSecs, lastWinner }) {
  const mm=pad2(Math.floor(betSecs/60)), ss=pad2(betSecs%60);
  return (
    <div style={{background:"#3a2280",padding:"8px 10px 12px",display:"flex",gap:8,alignItems:"flex-start"}}>
      <div style={{flex:1}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.65)",fontWeight:600,marginBottom:1}}>1.5 minutes</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.85)",fontFamily:"monospace",marginBottom:7}}>{issueNumber}</div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <img src={lastWinner?CAR_IMAGES[lastWinner]:CAR_IMAGES[4]} alt=""
            style={{width:110,height:56,objectFit:"contain"}}/>
          <div style={{width:28,height:28,borderRadius:6,background:"#29ABE2",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,color:"#fff"}}>B</div>
          <div style={{width:28,height:28,borderRadius:6,background:"#E53935",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,color:"#fff"}}>E</div>
          <button style={{padding:"5px 9px",borderRadius:7,background:"rgba(255,255,255,0.13)",border:"1px solid rgba(255,255,255,0.28)",color:"#fff",fontSize:10,cursor:"pointer",fontWeight:600}}>How to play</button>
        </div>
      </div>
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
 
/* ─── LIVE RESULT BALLS (updates as race progresses) ─────────────────────── */
function LiveBalls({ raceOrder, finalResult, phase }) {
  const display = (phase==="racing"||phase==="results") && raceOrder.length>0
    ? raceOrder
    : finalResult || [];
  if(!display.length) return null;
  return (
    <div style={{
      display:"flex",gap:4,padding:"5px 8px",
      background:"#111",
      borderBottom:"3px solid #4caf50",
      overflowX:"auto",
    }}>
      {display.map((n,i)=>(
        <div key={n} style={{
          width:26,height:26,borderRadius:6,flexShrink:0,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontWeight:900,fontSize:11,
          background:CAR_COLORS[n].bg,color:CAR_COLORS[n].text,
          border:i===0?"2px solid #FFD700":"none",
          transition:"all 0.3s",
        }}>{n}</div>
      ))}
    </div>
  );
}
 
/* ─── RACE TRACK — pixel-perfect match to video ───────────────────────────── */
function RaceTrack({ phase, result, onRaceEnd, onLiveOrder }) {
  const LANES = [1,2,3,4,5,6,7,8,9,10];
 
  // xPct is from the RIGHT edge (cars move left = xPct grows)
  // 0% = right edge, 100% = left edge
  // We use rightOffset style so 0 = far right, big = far left
  const [rightOffset, setRightOffset] = useState(
    Object.fromEntries(LANES.map(n=>[n, -10])) // start off-screen right
  );
  const [done, setDone]         = useState(false);
  const [showWin, setShowWin]   = useState(false);
  const rafRef                  = useRef(null);
  const t0                      = useRef(null);
  const bgOffRef                = useRef(0); // for scrolling background
  const [bgOff, setBgOff]       = useState(0);
 
  // Animated background scroll during race
  useEffect(()=>{
    if(phase!=="racing") return;
    let raf;
    const scroll=()=>{
      bgOffRef.current = (bgOffRef.current + 1.5) % 800;
      setBgOff(bgOffRef.current);
      raf=requestAnimationFrame(scroll);
    };
    raf=requestAnimationFrame(scroll);
    return()=>cancelAnimationFrame(raf);
  },[phase]);
 
  useEffect(()=>{
    if(phase!=="racing"||!result) return;
    setDone(false); setShowWin(false);
    setRightOffset(Object.fromEntries(LANES.map(n=>[n,-10])));
    t0.current=null;
    cancelAnimationFrame(rafRef.current);
 
    // Winner ends up ~75% from right (far left on screen)
    // Last car ends up ~10% from right (still near right)
    // "rightOffset" = how far from right the car is, as % of track width
    const endPositions={};
    result.forEach((car,rank)=>{
      // rank 0=winner (leftmost=highest rightOffset), rank 9=last (rightmost=lowest)
      endPositions[car] = 75 - rank * 6.5;
    });
 
    const DUR = 8000; // 8 seconds race
 
    function step(ts){
      if(!t0.current) t0.current=ts;
      const el = ts - t0.current;
      const p  = Math.min(el/DUR, 1);
      // ease: fast start, slow finish
      const e = p < 0.5 ? 2*p*p : 1 - Math.pow(-2*p+2,2)/2;
 
      const newPos={};
      LANES.forEach(car=>{
        const rank    = result.indexOf(car);
        // each car has slightly different speed profile
        const sf      = 1 - rank*0.06;
        const prog    = Math.min(e*sf, 1);
        const start   = -10;
        const end     = endPositions[car];
        // tiny vertical wobble
        const wobble  = Math.sin(el*0.004 + rank*2.1) * 0.2;
        newPos[car]   = start + (end-start)*prog + wobble;
      });
      setRightOffset(newPos);
 
      // emit live order (sorted by rightOffset descending = leftmost first)
      const liveOrder = [...LANES].sort((a,b)=>(newPos[b]||0)-(newPos[a]||0));
      onLiveOrder?.(liveOrder);
 
      if(p<1){
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDone(true);
        setShowWin(true);
        onRaceEnd?.();
        setTimeout(()=>setShowWin(false), 4000);
      }
    }
    rafRef.current = requestAnimationFrame(step);
    return()=>cancelAnimationFrame(rafRef.current);
  },[phase,result]);
 
  const LANE_H = 28; // px per lane
  const TRACK_H = LANE_H * 10 + 44; // 10 lanes + top bar + bottom strip
 
  // Scenery items for scrolling background (Indian landmarks style)
  const sceneryItems = [
    {x:0,   icon:"🏛️", size:48, y:8},
    {x:120, icon:"🌴", size:32, y:14},
    {x:220, icon:"⛪", size:44, y:6},
    {x:360, icon:"🌴", size:28, y:16},
    {x:440, icon:"🕌", size:50, y:4},
    {x:580, icon:"🌴", size:30, y:12},
    {x:650, icon:"🗼", size:42, y:6},
    {x:760, icon:"🌴", size:26, y:15},
    {x:830, icon:"⛩️", size:46, y:8},
    {x:960, icon:"🌴", size:32, y:14},
    {x:1050,icon:"🏰", size:52, y:4},
    {x:1160,icon:"🌴", size:28, y:16},
  ];
 
  return (
    <div style={{width:"100%",background:"#222",userSelect:"none"}}>
 
      {/* ── SCENIC SCROLLING BACKGROUND + TRACK ── */}
      <div style={{position:"relative",width:"100%",height:TRACK_H,overflow:"hidden"}}>
 
        {/* Sky background (always visible) */}
        <div style={{
          position:"absolute",top:0,left:0,right:0,height:44,
          background:"linear-gradient(180deg,#4fa8d8 0%,#a8d8ea 100%)",
          overflow:"hidden",
        }}>
          {/* Scrolling scenery */}
          {phase==="racing" && sceneryItems.map((item,i)=>{
            const x = ((item.x - bgOff) % 1200 + 1200) % 1200;
            return (
              <span key={i} style={{
                position:"absolute",
                left:x,
                bottom:item.y,
                fontSize:item.size*0.6,
                lineHeight:1,
              }}>{item.icon}</span>
            );
          })}
          {phase!=="racing" && (
            <>
              <span style={{position:"absolute",bottom:8,left:10,fontSize:24}}>🏛️</span>
              <span style={{position:"absolute",bottom:10,left:80,fontSize:18}}>🌴</span>
              <span style={{position:"absolute",bottom:6,left:160,fontSize:26}}>🕌</span>
              <span style={{position:"absolute",bottom:10,left:250,fontSize:16}}>🌴</span>
              <span style={{position:"absolute",bottom:5,left:320,fontSize:22}}>⛪</span>
              <span style={{position:"absolute",bottom:8,right:60,fontSize:18}}>🌴</span>
              <span style={{position:"absolute",bottom:4,right:10,fontSize:24}}>🗼</span>
            </>
          )}
 
          {/* Checkered top border */}
          <div style={{
            position:"absolute",bottom:0,left:0,right:0,height:10,
            background:"repeating-linear-gradient(90deg,#E53935 0,#E53935 10px,#fff 10px,#fff 20px)",
            opacity:0.85,
          }}/>
        </div>
 
        {/* ── LANES ── */}
        <div style={{position:"absolute",top:44,left:0,right:0,bottom:22}}>
          {/* Lane background */}
          <div style={{position:"absolute",inset:0,background:"#2e2e2e"}}/>
 
          {/* Lane dividers */}
          {LANES.map((_,i)=>(
            <div key={i} style={{
              position:"absolute",left:0,right:0,
              top:`${(i/10)*100}%`,height:1,
              background:"rgba(255,255,255,0.12)"
            }}/>
          ))}
 
          {/* Animated dashed white lines (road speed effect) */}
          {phase==="racing"&&(
            <div style={{
              position:"absolute",inset:0,
              backgroundImage:"repeating-linear-gradient(90deg,rgba(255,255,255,0.1) 0,rgba(255,255,255,0.1) 2px,transparent 2px,transparent 30px)",
              backgroundSize:"30px 100%",
              animation:"dashMove 0.25s linear infinite",
            }}/>
          )}
 
          {/* ── CARS ── each car in its own lane */}
          {phase!=="betting" && LANES.map((car,laneIdx)=>{
            const rOff  = rightOffset[car] ?? -10;
            // convert rightOffset% to CSS: right = (100-rOff)% minus car width
            // Actually use: left = calc(container_width * rOff/100)
            // We'll use right offset: car sits at `right: (99-rOff)%`
            const rightPct = Math.max(-5, 100 - rOff - 14); // 14% = car width approx
            const isWinner = done && result?.[0]===car;
            const laneTop  = (laneIdx/10)*100;
 
            return (
              <div key={car} style={{
                position:"absolute",
                right:`${rightPct}%`,
                top:`${laneTop}%`,
                height:"10%",
                display:"flex",
                alignItems:"center",
                zIndex:isWinner?10:5,
                filter:isWinner?"drop-shadow(0 0 6px #FFD700)":"none",
              }}>
                {/* Exhaust particles when racing */}
                {phase==="racing"&&(
                  <div style={{
                    position:"absolute",right:"100%",top:"50%",transform:"translateY(-50%)",
                    display:"flex",gap:2,
                  }}>
                    {[1,2,3].map(j=>(
                      <div key={j} style={{
                        width:3+j,height:3+j,borderRadius:"50%",
                        background:"rgba(200,200,200,0.4)",
                        animation:`exhaust${j} ${0.3+j*0.1}s ease-out infinite alternate`,
                      }}/>
                    ))}
                  </div>
                )}
                <img
                  src={CAR_IMAGES[car]}
                  alt={`car${car}`}
                  style={{
                    height:"80%",
                    width:"auto",
                    maxHeight:22,
                    objectFit:"contain",
                    // Cars face LEFT (they go right-to-left)
                    // The car images face right, so we flip them
                    transform:"scaleX(-1)",
                    imageRendering:"crisp-edges",
                  }}
                />
                {/* Winner flag */}
                {isWinner&&(
                  <span style={{
                    fontSize:12,marginLeft:2,
                    animation:"popIn 0.4s ease",
                  }}>🏆</span>
                )}
              </div>
            );
          })}
        </div>
 
        {/* ── BOTTOM CHEVRON STRIP (animated) ── */}
        <div style={{
          position:"absolute",bottom:0,left:0,right:0,height:22,
          background:"#1a1a1a",
          display:"flex",alignItems:"center",
          overflow:"hidden",gap:0,
        }}>
          <div style={{
            display:"flex",alignItems:"center",gap:0,
            animation:phase==="racing"?"chevronMove 0.4s linear infinite":"none",
            whiteSpace:"nowrap",
          }}>
            {[...Array(32)].map((_,i)=>(
              <span key={i} style={{
                fontSize:14,color:"#FFD600",
                display:"inline-block",width:22,textAlign:"center",
                opacity:i%2===0?1:0.4,
              }}>»</span>
            ))}
          </div>
        </div>
 
        {/* ── BETTING TIME OVERLAY ── */}
        {phase==="betting"&&(
          <div style={{position:"absolute",inset:0,overflow:"hidden"}}>
            <img src={BANNER_IMG} alt="" style={{
              width:"100%",height:"100%",objectFit:"cover",
              position:"absolute",inset:0,
            }}/>
            <div style={{
              position:"absolute",inset:0,
              background:"linear-gradient(0deg,rgba(0,0,0,0.65) 0%,rgba(0,0,0,0.15) 55%,transparent 100%)"
            }}/>
            <div style={{
              position:"absolute",bottom:"12%",left:0,right:0,
              display:"flex",flexDirection:"column",alignItems:"center",gap:8
            }}>
              {/* <span style={{
                color:"#fff",fontWeight:900,fontSize:28,letterSpacing:2,
                textShadow:"0 3px 18px rgba(0,0,0,0.95)",
              }}>Quick Race</span>
              <div style={{
                padding:"6px 28px",background:"rgba(0,0,0,0.78)",
                border:"1.5px solid rgba(255,255,255,0.4)",borderRadius:3,
                color:"#fff",fontWeight:700,fontSize:12,letterSpacing:5,
              }}>BETTING TIME</div> */}
            </div>
          </div>
        )}
 
        {/* ── WINNER CELEBRATION ── */}
        {showWin && result && (
          <WinnerCelebration winner={result[0]}/>
        )}
      </div>
 
      {/* CSS animations */}
      <style>{`
        @keyframes dashMove    { from{background-position:0 0} to{background-position:-30px 0} }
        @keyframes chevronMove { from{transform:translateX(0)} to{transform:translateX(-44px)} }
        @keyframes popIn       { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes exhaust1    { from{opacity:0.2;width:3px} to{opacity:0.8;width:5px} }
        @keyframes exhaust2    { from{opacity:0.1;width:4px} to{opacity:0.6;width:7px} }
        @keyframes exhaust3    { from{opacity:0.05;width:5px} to{opacity:0.4;width:9px} }
        @keyframes confettiFall{ 0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(160px) rotate(720deg);opacity:0} }
        @keyframes winBadge    { 0%,100%{transform:translateX(-50%) scale(1)} 50%{transform:translateX(-50%) scale(1.06)} }
        @keyframes bgScroll    { from{background-position:0 0} to{background-position:-800px 0} }
      `}</style>
    </div>
  );
}
 
/* ─── WINNER CELEBRATION ─────────────────────────────────────────────────── */
function WinnerCelebration({ winner }) {
  const cols=["#FFD700","#FF6B35","#4CAF50","#29ABE2","#E91E63","#9C27B0","#fff"];
  const pieces=[...Array(30)].map((_,i)=>({
    x:5+Math.random()*90,
    delay:Math.random()*0.6,
    dur:1.2+Math.random()*1.2,
    color:cols[i%cols.length],
    size:5+Math.random()*7,
    rot:Math.random()*360,
    shape:i%3===0?"50%":"2px",
  }));
  return (
    <div style={{position:"absolute",inset:0,zIndex:30,pointerEvents:"none",overflow:"hidden"}}>
      {/* Winner badge */}
      <div style={{
        position:"absolute",top:"20%",left:"50%",
        transform:"translateX(-50%)",
        background:"linear-gradient(135deg,#FFD700 0%,#FF6B35 100%)",
        borderRadius:14,padding:"10px 24px",
        boxShadow:"0 6px 28px rgba(255,215,0,0.7)",
        border:"2px solid rgba(255,255,255,0.6)",
        animation:"winBadge 0.7s ease-in-out infinite",
        whiteSpace:"nowrap",
        zIndex:31,
      }}>
        <div style={{color:"#000",fontWeight:900,fontSize:17,textAlign:"center"}}>
          🏆 Car #{winner} WINS!
        </div>
      </div>
      {/* Confetti */}
      {pieces.map((p,i)=>(
        <div key={i} style={{
          position:"absolute",
          left:`${p.x}%`,top:0,
          width:p.size,height:p.size,
          borderRadius:p.shape,
          background:p.color,
          animation:`confettiFall ${p.dur}s ${p.delay}s ease-in forwards`,
          transform:`rotate(${p.rot}deg)`,
        }}/>
      ))}
    </div>
  );
}
 
/* ─── WAITING PANEL ──────────────────────────────────────────────────────── */
function WaitingPanel({ raceSecs }) {
  const mm=pad2(Math.floor(raceSecs/60)), ss=pad2(raceSecs%60);
  return (
    <div style={{background:"rgba(15,15,26,0.95)",padding:"16px 16px 20px",textAlign:"center",position:"relative"}}>
      {/* Blurred car grid */}
      <div style={{
        display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",
        marginBottom:12,filter:"blur(5px)",opacity:0.35,pointerEvents:"none",
      }}>
        {[1,2,3,4,5,6,7,8,9,10].map(n=>(
          <div key={n} style={{width:42,height:42,borderRadius:8,background:CAR_COLORS[n].bg}}/>
        ))}
      </div>
      <p style={{color:"#fff",fontWeight:700,fontSize:15,margin:"0 0 3px"}}>The game has already started,</p>
      <p style={{color:"rgba(255,255,255,0.7)",fontSize:13,margin:"0 0 14px"}}>please place your bets later.</p>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        <div style={{
          padding:"8px 20px",background:"#111",borderRadius:8,
          color:"#fff",fontWeight:900,fontSize:30,fontFamily:"monospace",
          border:"1px solid #333",
        }}>{mm}</div>
        <span style={{color:"#fff",fontWeight:900,fontSize:30}}>:</span>
        <div style={{
          padding:"8px 20px",background:"#111",borderRadius:8,
          color:"#fff",fontWeight:900,fontSize:30,fontFamily:"monospace",
          border:"1px solid #333",
        }}>{ss}</div>
      </div>
    </div>
  );
}
 
/* ─── CAR GRID ───────────────────────────────────────────────────────────── */
function CarGrid({ onCarClick, phase }) {
  const disabled=phase!=="betting";
  return (
    <div style={{background:"#0d1220",padding:"10px 8px 6px"}}>
      {[[1,2,3,4,5],[6,7,8,9,10]].map((row,ri)=>(
        <div key={ri} style={{marginBottom:ri===0?10:0}}>
          <div style={{display:"flex",gap:3,marginBottom:4}}>
            {row.map(n=>(
              <div key={n} style={{flex:1,display:"flex",justifyContent:"center"}}>
                <img src={CAR_IMAGES[n]} alt="" style={{width:90,height:48,objectFit:"contain"}}/>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:4}}>
            {row.map(n=>(
              <button key={n}
                onClick={()=>!disabled&&onCarClick(n)}
                onPointerDown={e=>!disabled&&(e.currentTarget.style.transform="scale(0.92)")}
                onPointerUp={e=>{e.currentTarget.style.transform="scale(1)"}}
                onPointerLeave={e=>{e.currentTarget.style.transform="scale(1)"}}
                style={{
                  flex:1,padding:"7px 0 5px",borderRadius:10,
                  cursor:disabled?"not-allowed":"pointer",
                  background:CAR_COLORS[n].bg,
                  border:`2.5px solid ${CAR_COLORS[n].border}`,
                  opacity:disabled?0.5:1,
                  display:"flex",flexDirection:"column",alignItems:"center",gap:1,
                  transition:"transform 0.1s",
                  boxShadow:"0 3px 10px rgba(0,0,0,0.35)",
                }}>
                <span style={{color:CAR_COLORS[n].text,fontWeight:900,fontSize:19,lineHeight:1}}>{n}</span>
                <span style={{color:CAR_COLORS[n].text,fontSize:10,opacity:0.8}}>9.2</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
 
/* ─── BET TYPE ROW ───────────────────────────────────────────────────────── */
function BetTypeRow({ onSelect, disabled }) {
  return (
    <div style={{display:"flex",gap:6,padding:"8px 8px",background:"#0d1220"}}>
      {Object.entries(TYPE_META).map(([key,meta])=>(
        <button key={key} disabled={disabled} onClick={()=>onSelect(key)} style={{
          flex:1,padding:"10px 0",borderRadius:10,fontWeight:700,fontSize:13,
          cursor:disabled?"not-allowed":"pointer",
          background:meta.color,color:"#fff",
          border:`2px solid ${meta.color}`,
          opacity:disabled?0.5:1,fontFamily:"inherit",
          boxShadow:disabled?"none":`0 4px 14px ${meta.color}55`,
          transition:"opacity 0.2s",
        }}>{key}</button>
      ))}
    </div>
  );
}
 
/* ─── UNIVERSAL BET MODAL ────────────────────────────────────────────────── */
function BetModal({ car, betType, onClose, onConfirm, balance }) {
  const [stake,setStake] = useState(10);
  const [mult,setMult]   = useState(1);
  const [count,setCount] = useState(1);
  const total = stake * mult;
  const isType = !!betType;
  const meta   = isType ? TYPE_META[betType] : null;
  const accent = isType ? meta.color : "#22c55e";
 
  if(!car && !betType) return null;
  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:50}}/>
      <div style={{
        position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
        width:"100%",maxWidth:430,
        background:"#fff",borderRadius:"18px 18px 0 0",
        zIndex:51,padding:"16px 16px 28px",
        animation:"su 0.3s cubic-bezier(.4,0,.2,1)",
      }}>
        <style>{`@keyframes su{from{transform:translateX(-50%) translateY(100%)}to{transform:translateX(-50%) translateY(0)}}`}</style>
 
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span style={{fontSize:17,fontWeight:700,color:"#111"}}>
            {isType ? `Bet — ${betType}` : "Bet"}
          </span>
          <button onClick={onClose} style={{
            width:30,height:30,borderRadius:"50%",background:"#f0f0f0",
            border:"none",cursor:"pointer",fontSize:16,color:"#555",
            display:"flex",alignItems:"center",justifyContent:"center"
          }}>✕</button>
        </div>
 
        {/* Preview */}
        {isType ? (
          <div style={{
            background:`${meta.color}18`,border:`2px solid ${meta.color}66`,
            borderRadius:14,padding:"16px 0",
            display:"flex",flexDirection:"column",alignItems:"center",gap:8,marginBottom:14
          }}>
            <div style={{
              width:62,height:62,borderRadius:"50%",background:meta.color,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,
              boxShadow:`0 4px 20px ${meta.color}55`,
            }}>
              {betType==="BIG"?"🔺":betType==="SMALL"?"🔻":betType==="ODD"?"🎯":"♾️"}
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontWeight:900,fontSize:22,color:meta.color,letterSpacing:1}}>{betType}</div>
              <div style={{fontSize:12,color:"#777",marginTop:2}}>{meta.desc}</div>
              <div style={{
                marginTop:6,display:"inline-block",
                background:meta.color,color:"#fff",
                fontSize:11,fontWeight:700,padding:"2px 12px",borderRadius:12
              }}>×{meta.mult} payout</div>
            </div>
          </div>
        ) : (
          <div style={{background:"#faf7e8",borderRadius:12,padding:"14px 0",display:"flex",justifyContent:"center",marginBottom:14}}>
            <img src={CAR_IMAGES[car]} alt="" style={{width:160,height:82,objectFit:"contain"}}/>
          </div>
        )}
 
        {/* Stake */}
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {BET_AMOUNTS.map(s=>(
            <button key={s} onClick={()=>setStake(s)} style={{
              flex:1,height:40,borderRadius:8,fontWeight:700,fontSize:13,
              cursor:"pointer",fontFamily:"inherit",
              background:stake===s?accent:"#fff",
              color:stake===s?"#fff":"#333",
              border:`1.5px solid ${stake===s?accent:"#ddd"}`,
              transition:"all 0.15s",
            }}>₹{s}</button>
          ))}
        </div>
 
        {/* Multiple */}
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
              padding:"5px 11px",borderRadius:7,cursor:"pointer",fontFamily:"inherit",
              fontSize:12,fontWeight:600,transition:"all 0.15s",
              background:mult===m.val?`${accent}22`:"#f3f4f6",
              border:`1.5px solid ${mult===m.val?accent:"#e0e0e0"}`,
              color:mult===m.val?accent:"#555",
            }}>{m.label}</button>
          ))}
        </div>
 
        <button
          disabled={balance<total}
          onClick={()=>{ onConfirm(car,betType,stake,mult,total); onClose(); }}
          style={{
            width:"100%",height:52,borderRadius:26,border:"none",fontFamily:"inherit",
            background:balance>=total?accent:"#ccc",
            color:"#fff",fontWeight:700,fontSize:16,
            cursor:balance>=total?"pointer":"not-allowed",
            boxShadow:balance>=total?`0 4px 18px ${accent}55`:"none",
          }}
        >Total Price ₹{total}</button>
      </div>
    </>
  );
}
 
/* ─── RESULT HISTORY ─────────────────────────────────────────────────────── */
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
                      width:22,height:22,borderRadius:5,flexShrink:0,
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
 
/* ─── MY ORDERS ──────────────────────────────────────────────────────────── */
function MyOrders({ orders }) {
  if(!orders.length) return (
    <div style={{padding:48,textAlign:"center",color:"#555",fontSize:13}}>No bets placed yet.</div>
  );
  return (
    <div style={{padding:"8px 10px",background:"#0f0f1a"}}>
      {orders.map((o,i)=>(
        <div key={i} style={{borderRadius:12,padding:12,marginBottom:8,background:"#1a1a2e"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:10,color:"#666",fontFamily:"monospace"}}>{o.issue}</span>
            <span style={{
              fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:10,
              background:o.status==="won"?"rgba(34,197,94,0.2)":o.status==="lost"?"rgba(239,68,68,0.2)":"rgba(234,179,8,0.2)",
              color:o.status==="won"?"#4ade80":o.status==="lost"?"#f87171":"#facc15"
            }}>
              {o.status==="won"?`+₹${o.payout}`:o.status==="lost"?`-₹${o.amount}`:"⏳ Pending"}
            </span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {o.car&&(
              <div style={{
                width:32,height:32,borderRadius:6,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontWeight:700,fontSize:13,
                background:CAR_COLORS[o.car].bg,color:CAR_COLORS[o.car].text,
              }}>{o.car}</div>
            )}
            {o.betType&&(
              <div style={{
                padding:"4px 12px",borderRadius:8,fontWeight:700,fontSize:12,
                background:TYPE_META[o.betType].color,color:"#fff"
              }}>{o.betType}</div>
            )}
            <div style={{marginLeft:"auto"}}>
              <div style={{fontSize:12,color:"#ccc",fontWeight:600}}>₹{o.amount}</div>
              {o.mult>1&&<div style={{fontSize:10,color:"#666"}}>×{o.mult}</div>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
 
/* ─── CHART TREND ────────────────────────────────────────────────────────── */
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
              <div style={{width:"100%",borderRadius:"3px 3px 0 0",height:`${Math.max(p*84,4)}px`,background:CAR_COLORS[n].bg,transition:"height 0.6s ease"}}/>
              <div style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,background:CAR_COLORS[n].bg,color:CAR_COLORS[n].text}}>{n}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
 
/* ─── WIN TOAST ──────────────────────────────────────────────────────────── */
function WinToast({ win, onClose }) {
  useEffect(()=>{if(!win) return;const t=setTimeout(onClose,3500);return()=>clearTimeout(t);},[win]);
  if(!win) return null;
  return (
    <div style={{
      position:"fixed",top:72,left:"50%",zIndex:99,
      transform:"translateX(-50%)",
      background:"linear-gradient(90deg,#FFD700,#FF6B35)",
      borderRadius:16,padding:"14px 28px",
      boxShadow:"0 8px 32px rgba(255,215,0,0.6)",
    }}>
      <div style={{color:"#000",fontWeight:900,fontSize:18}}>🏆 YOU WON! +₹{win}</div>
    </div>
  );
}
 
/* ─── BOTTOM TABS ────────────────────────────────────────────────────────── */
function BottomTabs({ active, onChange }) {
  return (
    <div style={{display:"flex",background:"#1a1a2e",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
      {["Result History","Chart Trend","My Order"].map((t,i)=>(
        <button key={t} onClick={()=>onChange(i)} style={{
          flex:1,padding:"12px 0",fontSize:11,fontWeight:600,cursor:"pointer",
          color:active===i?"#fff":"#888",background:"none",border:"none",
          position:"relative",fontFamily:"inherit",
        }}>
          {t}
          {active===i&&<div style={{position:"absolute",bottom:0,left:"25%",right:"25%",height:2,borderRadius:2,background:"#9B59B6"}}/>}
        </button>
      ))}
    </div>
  );
}
 
/* ─── MAIN ───────────────────────────────────────────────────────────────── */
export default function QuickRaceGame() {
  const [balance,setBalance]       = useState(2400);
  const [muted,setMuted]           = useState(false);
  const [cycleIdx,setCycleIdx]     = useState(0);
  const [phase,setPhase]           = useState("betting");
  const [betSecs,setBetSecs]       = useState(30);
  const [raceSecs,setRaceSecs]     = useState(0);
  const [issue,setIssue]           = useState(genIssue);
  const [nextIssue,setNextIssue]   = useState(genIssue);
  const [result,setResult]         = useState(null);
  const [lastResult,setLastResult] = useState(null);
  const [liveOrder,setLiveOrder]   = useState([]);
  const [history,setHistory]       = useState(()=>[...Array(10)].map(()=>({issue:genIssue(),result:genResult()})));
  const [orders,setOrders]         = useState([]);
  const [tab,setTab]               = useState(0);
  const [histPage,setHistPage]     = useState(1);
  const [winToast,setWinToast]     = useState(null);
  const [modalCar,setModalCar]     = useState(null);
  const [modalType,setModalType]   = useState(null);
 
  const cycleSecs = CYCLE_OPTIONS[cycleIdx].seconds;
  const betTime   = Math.floor(cycleSecs * 0.4);
  const raceTime  = cycleSecs - betTime;
 
  /* BETTING COUNTDOWN */
  useEffect(()=>{
    setBetSecs(betTime); setPhase("betting"); setResult(null); setLiveOrder([]);
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
    setResult(r); setPhase("racing"); setRaceSecs(raceTime);
    setModalCar(null); setModalType(null);
  },[raceTime]);
 
  /* RACE COUNTDOWN */
  useEffect(()=>{
    if(phase!=="racing") return;
    setRaceSecs(raceTime);
    const t=setInterval(()=>setRaceSecs(s=>Math.max(0,s-1)),1000);
    return()=>clearInterval(t);
  },[phase,raceTime]);
 
  /* SETTLE */
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
      if(won){ setBalance(b=>b+payout); setWinToast(payout); }
      return{...o,status:won?"won":"lost",payout};
    }));
    setHistory(p=>[{issue,result},...p].slice(0,100));
    setTimeout(()=>{ setIssue(genIssue()); setNextIssue(genIssue()); },3500);
  },[result,issue]);
 
  const openCarModal  = n  =>{ if(phase!=="betting") return; setModalCar(n);   setModalType(null); };
  const openTypeModal = key=>{ if(phase!=="betting") return; setModalType(key); setModalCar(null); };
  const closeModal    = ()=>{ setModalCar(null); setModalType(null); };
 
  const handleConfirm=(car,betType,stake,mult,total)=>{
    if(balance<total) return;
    setBalance(b=>b-total);
    setOrders(p=>[{issue,car,betType,amount:total,mult,status:"pending",payout:0},...p]);
  };
 
  const lastWinner=lastResult?.[0]||null;
 
  return (
    <div style={{
      display:"flex",flexDirection:"column",minHeight:"100vh",
      background:"#0f0f1a",maxWidth:430,margin:"0 auto",
      fontFamily:"system-ui,-apple-system,sans-serif"
    }}>
      <WinToast win={winToast} onClose={()=>setWinToast(null)}/>
 
      <TopBar balance={balance} muted={muted} onMute={()=>setMuted(m=>!m)}/>
      <CycleTabs active={cycleIdx} onChange={setCycleIdx}/>
      <IssueBar issueNumber={issue} nextIssue={nextIssue} betSecs={betSecs} lastWinner={lastWinner}/>
 
      {/* Live race order balls — updates in real time during race */}
      <LiveBalls raceOrder={liveOrder} finalResult={lastResult} phase={phase}/>
 
      {/* Race track */}
      <RaceTrack
        phase={phase}
        result={result}
        onRaceEnd={handleRaceEnd}
        onLiveOrder={setLiveOrder}
      />
 
      {/* Waiting panel during race */}
      {phase==="racing"&&<WaitingPanel raceSecs={raceSecs}/>}
 
      {/* Car grid */}
      <CarGrid onCarClick={openCarModal} phase={phase}/>
 
      {/* BIG/SMALL/ODD/EVEN */}
      <BetTypeRow onSelect={openTypeModal} disabled={phase!=="betting"}/>
 
      <BottomTabs active={tab} onChange={setTab}/>
      {tab===0&&<ResultHistory history={history} page={histPage} setPage={setHistPage}/>}
      {tab===1&&<ChartTrend history={history}/>}
      {tab===2&&<MyOrders orders={orders}/>}
 
      {/* Universal bet modal */}
      {(modalCar||modalType)&&(
        <BetModal
          car={modalCar}
          betType={modalType}
          onClose={closeModal}
          onConfirm={handleConfirm}
          balance={balance}
        />
      )}
    </div>
  );
}