import { ChevronLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { homeApi ,getWalletSummary} from "../services/authService";
import { getThreeDigitGame ,placeThreeDigitBet,getThreeDigitBets } from "../services/gameSevice";
 
 
function useCountdown(initialSeconds) {
  const [secs, setSecs] = useState(initialSeconds);

  useEffect(() => {
    setSecs(initialSeconds); // 👈 reset when value changes
  }, [initialSeconds]);

  useEffect(() => {
    const t = setInterval(() => {
      setSecs((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(t);
  }, []);

  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");

  return [h, m, s];
}
 
function DigitBall({ label, color }) {
  const colors = {
    A: "bg-red-500",
    B: "bg-orange-400",
    C: "bg-blue-600",
  };
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm ${colors[color] || "bg-gray-400"}`}>
      {label}
    </div>
  );
}
 
function ResultBall({ value, color }) {
  const colors = {
    A: "bg-red-500",
    B: "bg-orange-400",
    C: "bg-blue-600",
  };
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${colors[color]}`}>
      {value}
    </div>
  );
}
 
function DigitInput({ value, onChange }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/, "").slice(-1))}
      className="w-9 h-9 border border-gray-200 rounded-lg text-center text-sm font-semibold text-gray-700 focus:outline-none focus:border-purple-400 bg-white"
      placeholder="–"
    />
  );
}

function QuantitySelector({ qty, setQty }) {
  return (
    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setQty((q) => Math.max(1, q - 1))}
        className="px-3 py-1 text-gray-600"
      >
        –
      </button>

      <input
        type="text"
        value={qty}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, "");
          setQty(val === "" ? "" : Math.max(1, Number(val)));
        }}
        className="w-10 text-center outline-none"
      />

      <button
        onClick={() => setQty((q) => q + 1)}
        className="px-3 py-1 text-gray-600"
      >
        +
      </button>
    </div>
  );
}
 
// ─── DETAIL PAGE ──────────────────────────────────────────────────────────────
 
export function ThreeDigitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("result");
      const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);
const [loadingOrders, setLoadingOrders] = useState(false);
  const [game, setGame] = useState(null);
   const [toast,      setToast]       = useState(null);

     const showT=(msg,type="info")=>{
    setToast({msg,type});
    setTimeout(()=>setToast(null),2600);
  };

  useEffect(() => {
  fetchGame();
}, [id]);

useEffect(() => {
  if (activeTab === "myorder" && user?.id && game?.id) {
    fetchOrders();
  }
}, [activeTab, user?.id, game?.id]);
const fetchOrders = async () => {
  try {
    setLoadingOrders(true);

    const res = await getThreeDigitBets({
      userId: user?.id,
      gameId: game?.id,
    });

    if (!res?.success) return;

    const formatted = (res.data || []).map((bet) => ({
      id: bet.betId,
      amount: bet.totalAmount,
      winAmount: bet.winAmount,
      status: bet.status, // pending / win / lose
      date: bet.createdAt,
      items: bet.items || [],
      round: bet.round,
    }));

    setOrders(formatted);
  } catch (err) {
    console.log("orders error", err);
  } finally {
    setLoadingOrders(false);
  }
};


const fetchGame = async () => {
  const res = await getThreeDigitGame({ gameId: id });

  if (res?.success) {
    setGame(res.data);
  }
};
const resultHistory = Array.isArray(game?.rounds) ? game.rounds : [];

const [balance, setBalance] = useState({
  totalWallet: 0
});
const [loadingWallet, setLoadingWallet] = useState(true);

useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      fetchWallet(parsedUser.id);
    } else {
      setLoadingLottery(false);
    }
  }, []);
const fetchWallet = async (uid) => {
  try {
    const res = await getWalletSummary({ id: uid });
    const api = res?.data;

    setBalance({
      totalWallet: Number(api?.wallet?.total || 0)
    });

  } catch (err) {
    console.log("API Error:", err);
  } finally {
    setLoadingWallet(false);
  }
};
  const isIntervalGame = Array.isArray(game?.intervals) && game.intervals.length > 0;

const activeSessions = Array.isArray(game?.sessions)
  ? game.sessions.filter(s => s.status === true)
  : [];

const slots = isIntervalGame
  ? game.intervals.map((i) => `${i.seconds / 60} min`)
  : activeSessions.map(s => {
      const d = new Date(s.startTime);
      return d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    });



// fallback last result
const lastResult = resultHistory.length > 0
  ? resultHistory[0]
  : { issue: "N/A", a: "-", b: "-", c: "-", time: "--" };
const single = game?.payouts?.find(p => p.type === "SINGLE");
const double = game?.payouts?.find(p => p.type === "DOUBLE");
const triple = game?.payouts?.find(p => p.type === "TRIPLE");
  
 
  // All hooks before early return
  const [activeSlotIdx, setActiveSlotIdx] = useState(0);

  const [resultPage, setResultPage] = useState(1);
  const [bets, setBets] = useState([]);
 
  // Single digit inputs: A, B, C
  const [singleA, setSingleA] = useState("");
  const [singleB, setSingleB] = useState("");
  const [singleC, setSingleC] = useState("");
 
  // Double digit inputs: AB(2), AC(2), BC(2)
  const [doubleAB, setDoubleAB] = useState(["", ""]);
  const [doubleAC, setDoubleAC] = useState(["", ""]);
  const [doubleBC, setDoubleBC] = useState(["", ""]);
 
  // Triple digit inputs: ABC(3)
  const [tripleDigits, setTripleDigits] = useState(["", "", ""]);

const selectedSession = activeSessions?.[activeSlotIdx];
const selectedInterval = game?.intervals?.[activeSlotIdx];

const sessionId = selectedSession?.id || null;

const roundId = selectedSession?.currentSlotNum 
  || Math.floor(Date.now() / (selectedInterval?.seconds * 1000)); // 👈 IMPORTANT

const formatBetsForApi = () => {
  let formatted = [];

  bets.forEach((b) => {
  if (b.type === "Single") {
  formatted.push({
    type: "SINGLE",
    text: b.label,        // A / B / C
    value: Number(b.digits[0]), // only one digit
    quantity: b.qty,
  });
}

    if (b.type === "Double") {
      formatted.push({
        type: "DOUBLE",
        text: "AB", // 👈 you can improve dynamic later
        value: Number(b.digits.join("")),
        quantity: b.qty,
      });
    }

    if (b.type === "Triple") {
      formatted.push({
        type: "TRIPLE",
        text: "ABC",
        value: Number(b.digits.join("")),
        quantity: b.qty,
      });
    }
  });

  return formatted;
};

const placeBet = async () => {
  try {
   const payload = {
  gameId: game.id,
  userId: user.id,
  sessionId: sessionId, // null for interval
  intervalId: selectedInterval?.id || null, // 👈 important
  roundId: roundId,
  bets: formatBetsForApi(),
};

    console.log("BET PAYLOAD 👉", payload);

    const res = await placeThreeDigitBet(payload);

    if (res?.success) {
      showT("Bet placed successfully ✅");
      setBets([]); // clear cart
    }
  } catch (err) {
    console.log(err);
  }
};


  const [qtySingle, setQtySingle] = useState({
  A: 3,
  B: 3,
  C: 3,
});
const [qtyDouble, setQtyDouble] = useState(3);
  const [qtyTriple, setQtyTriple] = useState(3);

const getRemainingSeconds = () => {
  const now = Math.floor(Date.now() / 1000);

  // ✅ INTERVAL GAME
  if (isIntervalGame) {
    const selected = game?.intervals?.[activeSlotIdx];
    if (!selected) return 0;

    const duration = selected.seconds;
    return duration - (now % duration);
  }

  // ✅ SESSION GAME
  if (!selectedSession?.startTime) return 0;

  const start = Math.floor(new Date(selectedSession.startTime).getTime() / 1000);

  return Math.max(0, start - now);
};
 
const [remaining, setRemaining] = useState(0);

useEffect(() => {
  if (!game) return;

  const interval = setInterval(() => {
    setRemaining(getRemainingSeconds());
  }, 1000);

  return () => clearInterval(interval);
}, [game, activeSlotIdx, isIntervalGame, selectedSession]);

const h = String(Math.floor(remaining / 3600)).padStart(2, "0");
const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
const s = String(remaining % 60).padStart(2, "0");
 
  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Game not found.{" "}
        <button onClick={() => navigate(-1)} className="ml-2 text-purple-600 underline">Go back</button>
      </div>
    );
  }

const isTripleFilled = tripleDigits.every((v) => v !== "");
  const totalBet = bets.reduce((s, b) => s + b.price, 0);
  const perPage = 10;
 const totalPages = Math.ceil(resultHistory.length / perPage);
   const pagedHistory = resultHistory.slice(
  (resultPage - 1) * perPage,
  resultPage * perPage
);
 
const addBet = (type, digits, price, qty, label = "") => {
  if (digits.some((d) => d === "")) return;

  setBets((prev) => [
    ...prev,
    {
      type,
      digits,
      label, // 👈 ADD THIS
      qty,
      price: price * qty,
    },
  ]);
};
 
  const quickGuess = (setter, len) => {
    if (len === 1) setter(String(Math.floor(Math.random() * 10)));
    else setter(Array.from({ length: len }, () => String(Math.floor(Math.random() * 10))));
  };

 
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

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

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="text-2xl text-gray-500 leading-none"><ChevronLeft/></button>
        <span className="font-semibold text-gray-900">{game.name}</span>
        <div className="flex items-center gap-1 font-semibold text-medium text-black-400">
          <p >{user ? `₹${balance.totalWallet || 0}` : "-"}</p>
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">💰</div>
        </div>
      </div>
 
      {/* Notice */}
      {game.notice && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center gap-2 text-xs text-yellow-800">
          <span>🔔</span>
          <span>{game.notice}</span>
        </div>
      )}
 
      {/* Time Slots */}
      <div className="bg-white border-b border-gray-100 px-3 py-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {slots.length === 0 ? (
  <div className="text-xs text-gray-400 px-3 py-2">
    No slots available
  </div>
) : (
  slots.map((slot, i) => (
            <button
              key={i}
              onClick={() => setActiveSlotIdx(i)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
                activeSlotIdx === i
                  ? "bg-purple-100 border-purple-400 text-purple-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              <div style={{
            width:30,height:30,borderRadius:"50%",
            background:"linear-gradient(135deg,#f59e0b,#f97316)",
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 2px 6px rgba(245,158,11,0.4)",fontSize:14,
          }}>⏱</div>
          <span style={{fontSize:12,fontWeight:800,
            color:"#666"}}>{slot}</span>
            </button>
            ))
)}
        </div>
      </div>
 
      {/* Current Draw Info */}
      <div className="mx-4 mt-3 mb-2 bg-purple-50 border border-purple-200 rounded-2xl px-4 py-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-bold text-gray-800 text-sm">{game.name} {game.subtitle}</div>
            <div className="text-xs text-gray-400 mb-2">
  {lastResult.issue}
</div>
            <div className="flex items-center gap-1">
              <button className="text-xs border border-gray-300 rounded-lg px-2 py-0.5 text-gray-500 hover:bg-gray-100">
                How to play
              </button>
            </div>
            <div className="flex gap-2 mt-2">
  <ResultBall value={lastResult.a} color="A" />
  <ResultBall value={lastResult.b} color="B" />
  <ResultBall value={lastResult.c} color="C" />
</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 mb-1">Time remaining</div>
            <div className="flex items-center justify-end gap-1 text-xs sm:text-sm">
  {[h, m, s].map((unit, idx) => (
    <div key={idx} className="flex items-center gap-1">
      
      {unit.split("").map((digit, i) => (
        <div
          key={i}
          className="
            min-w-[22px] h-7 
            sm:min-w-[24px] sm:h-8
            px-1 
            bg-gray-900 text-white 
            rounded-md 
            flex items-center justify-center 
            font-semibold
          "
        >
          {digit}
        </div>
      ))}

      {idx < 2 && (
        <span className="text-gray-400 font-semibold px-[2px]">:</span>
      )}
    </div>
  ))}
</div>
            <div className="text-xs text-gray-400 mt-1">{lastResult.issue.slice(-6)}</div>
          </div>
        </div>
      </div>
 
      {/* ── SINGLE DIGIT ── */}
      <div className="mx-4 mb-3 bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-bold text-gray-800 text-sm">Single </span>
            <span className="text-gray-400 text-sm">Digit </span>
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
              Win ₹{single?.winAmount}
            </span>
          </div>
          <button
            onClick={() => { quickGuess(setSingleA, 1); quickGuess(setSingleB, 1); quickGuess(setSingleC, 1); }}
            className="text-xs border border-purple-300 text-purple-600 px-3 py-1 rounded-lg hover:bg-purple-50"
          >
            Quick Guess
          </button>
        </div>
        <div className="text-sm text-black-400 font-semibold mb-3">₹{single?.price}</div>
 
        {[
          { label: "A", val: singleA, set: setSingleA },
          { label: "B", val: singleB, set: setSingleB },
          { label: "C", val: singleC, set: setSingleC },
        ].map(({ label, val, set }) => (
          <div className="flex items-center justify-between mb-2">
  {/* LEFT */}
  <div className="flex items-center gap-3">
    <DigitBall label={label} color={label} />
    <DigitInput value={val} onChange={set} />

    {val !== "" && (
      <QuantitySelector
        qty={qtySingle[label]}
        setQty={(newQty) =>
          setQtySingle((prev) => ({
            ...prev,
            [label]:
              typeof newQty === "function"
                ? newQty(prev[label])
                : newQty,
          }))
        }
      />
    )}
  </div>

  {/* RIGHT */}
  <button
onClick={() => {
  const valueMap = {
    A: singleA,
    B: singleB,
    C: singleC,
  };

  const val = valueMap[label];

  if (!val) return; // prevent empty

  addBet("Single", [val], Number(single?.price), qtySingle[label], label);
}}
    className="bg-purple-100 text-purple-700 font-bold text-xs px-4 py-2 rounded-lg"
  >
    ADD
  </button>
</div>
        ))}
      </div>
 
      {/* ── DOUBLE DIGIT ── */}
      <div className="mx-4 mb-3 bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-bold text-gray-800 text-sm">Double </span>
            <span className="text-gray-400 text-sm">Digit </span>
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
              Win ₹{double?.winAmount}
            </span>
          </div>
          <button
            onClick={() => {
              quickGuess(setDoubleAB, 2);
              quickGuess(setDoubleAC, 2);
              quickGuess(setDoubleBC, 2);
            }}
            className="text-xs border border-purple-300 text-purple-600 px-3 py-1 rounded-lg hover:bg-purple-50"
          >
            Quick Guess
          </button>
        </div>
        <div className="text-sm text-black-400 font-semibold mb-3">₹{double?.price}</div>
 
        {[
  { labels: ["A", "B"], val: doubleAB, set: setDoubleAB },
  { labels: ["A", "C"], val: doubleAC, set: setDoubleAC },
  { labels: ["B", "C"], val: doubleBC, set: setDoubleBC },
].map(({ labels, val, set }) => {
  const isFilled = val.every((v) => v !== "");

  return (
    <div key={labels.join("")} className="flex items-center justify-between mb-2">
      
      {/* LEFT */}
      <div className="flex items-center gap-2">
        {labels.map((l) => (
          <DigitBall key={l} label={l} color={l} />
        ))}

        {val.map((v, i) => (
          <DigitInput
            key={i}
            value={v}
            onChange={(nv) =>
              set((prev) => {
                const copy = [...prev];
                copy[i] = nv;
                return copy;
              })
            }
          />
        ))}

        {isFilled && (
          <QuantitySelector qty={qtyDouble} setQty={setQtyDouble} />
        )}
      </div>

      {/* RIGHT */}
      <button
        onClick={() => addBet("Double", val, Number(double?.price), qtyDouble)}
        className="bg-purple-100 text-purple-700 font-bold text-xs px-5 py-2 rounded-lg"
      >
        ADD
      </button>
    </div>
  );
})}
      </div>
 
      {/* ── TRIPLE DIGIT ── */}
      <div className="mx-4 mb-3 bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-bold text-gray-800 text-sm">Triple </span>
            <span className="text-gray-400 text-sm">Digit </span>
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
             Win ₹{triple?.winAmount}
            </span>
          </div>
          <button
            onClick={() => quickGuess(setTripleDigits, 3)}
            className="text-xs border border-purple-300 text-purple-600 px-3 py-1 rounded-lg hover:bg-purple-50"
          >
            Quick Guess
          </button>
        </div>
        <div className="text-sm text-black-400 font-semibold mb-3">₹{triple?.price}</div>
 
        <div className="flex items-center gap-2">
          <DigitBall label="A" color="A" />
          <DigitBall label="B" color="B" />
          <DigitBall label="C" color="C" />
          <div className="flex gap-1 ml-auto">
            {tripleDigits.map((v, i) => (
              <DigitInput key={i} value={v} onChange={(nv) =>
  setTripleDigits((prev) => {
    const copy = [...prev];
    copy[i] = nv;
    return copy;
  })
} />
            ))}
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-3">
          <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold text-xs px-5 py-2 rounded-lg transition-colors">
            BOX
          </button>
          {isTripleFilled && (
          <QuantitySelector qty={qtyTriple} setQty={setQtyTriple} />
          )}

<button
  onClick={() =>
  addBet("Triple", tripleDigits, Number(triple?.price), qtyTriple)
}
   className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold text-xs px-5 py-2 rounded-lg transition-colors"
>
  ADD
</button>
        </div>
      </div>
 


      {/* ── TABS ── */}
      <div className="mx-4 bg-white rounded-t-2xl border border-gray-100 border-b-0">
        <div className="flex">
          {["result", "myorder"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-3 text-sm relative transition-colors ${
                activeTab === t ? "font-bold text-gray-900" : "text-gray-400"
              }`}
            >
              {t === "result" ? "Result history" : "My order"}
              {activeTab === t && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-purple-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
 
      {/* ── TAB CONTENT ── */}
      <div className="mx-4 mb-28 bg-white rounded-b-2xl border border-gray-100 border-t-0 px-3 pb-4">
        {activeTab === "result" && (
          <>
            <table className="w-full text-sm mt-2">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">Issue</th>
                  <th className="text-center py-2 text-xs text-gray-400 font-semibold">Time</th>
                  <th className="py-2 pr-2">
                    <div className="flex gap-1 justify-end">
                      <ResultBall value="A" color="A" />
                      <ResultBall value="B" color="B" />
                      <ResultBall value="C" color="C" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
  {resultHistory.length === 0 ? (
    <tr>
      <td colSpan="3" className="text-center py-6 text-gray-400 text-sm">
        No result available
      </td>
    </tr>
  ) : (
    pagedHistory.map((r, i) => (
      <tr key={i} className="border-t border-gray-50">
        <td className="py-2 px-2 text-xs text-gray-500">{r.issue}</td>
        <td className="py-2 text-center text-xs text-gray-500">{r.time}</td>
        <td className="py-2 pr-2">
          <div className="flex gap-1 justify-end">
            <ResultBall value={r.a} color="A" />
            <ResultBall value={r.b} color="B" />
            <ResultBall value={r.c} color="C" />
          </div>
        </td>
      </tr>
    ))
  )}
</tbody>
            </table>
            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-4 text-sm">
              <span className="text-gray-400 text-xs">Total {resultHistory.length}</span>
              {[...Array(Math.min(totalPages, 3))].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setResultPage(i + 1)}
                  className={`w-7 h-7 rounded-full text-xs font-semibold ${
                    resultPage === i + 1 ? "bg-purple-600 text-white" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setResultPage((p) => Math.min(p + 1, totalPages))}
                className="w-7 h-7 rounded-full border border-gray-200 text-gray-400 text-xs flex items-center justify-center hover:bg-gray-100"
              >
                ›
              </button>
            </div>
          </>
        )}
       {activeTab === "myorder" && (
  <div className="mt-2">
    {loadingOrders ? (
      <div className="text-center py-6 text-gray-400 text-sm">
        Loading orders...
      </div>
    ) : orders.length === 0 ? (
      <div className="text-center py-6 text-gray-400 text-sm">
        No orders found
      </div>
    ) : (
      orders.map((o) => {
        const isPending = o.status === "pending";
        const isWin = o.status === "win";
        const isLose = o.status === "lose";

        const color = isPending
          ? "text-yellow-500"
          : isWin
          ? "text-green-600"
          : "text-red-500";

        return (
          <div
            key={o.id}
            className="border-b border-gray-100 py-3 px-1 flex justify-between items-center"
          >
            {/* LEFT */}
            <div>
              <div className="flex gap-2 items-center mb-1">
                <span className="font-semibold text-sm text-gray-800">
                  {game.name}
                </span>

                <span
                  className={`text-[10px] px-2 py-[2px] rounded-full bg-gray-100 ${color}`}
                >
                  {o.status.toUpperCase()}
                </span>
              </div>

              <div className="text-xs text-gray-400">
                ₹{o.amount} · {o.items.length} items
              </div>

              {/* ITEMS */}
              <div className="flex gap-1 mt-1 flex-wrap">
                {o.items.map((it, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-purple-50 text-purple-600 px-2 py-[2px] rounded"
                  >
                    {it.type} - {it.text} -{it.value}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="text-right">
              {isPending && (
                <div className="text-sm text-yellow-500 font-semibold">
                  Pending
                </div>
              )}

              {isWin && (
                <div className="text-green-600 font-bold">
                  +₹{o.winAmount}
                </div>
              )}

              {isLose && (
                <div className="text-red-500 font-bold">
                  −₹{o.amount}
                </div>
              )}
            </div>
          </div>
        );
      })
    )}
  </div>
)}
      </div>
 
      {/* ── BOTTOM BAR ── */}
      <div style={{ 
              position: "fixed",
              bottom: 0,

              // 👇 center it to match app container
              left: "50%",
              transform: "translateX(-50%)",

              // 👇 SAME as your app max width
              width: "100%",
              maxWidth: 420,   // ⚠️ match your layout (420 / 480 etc)

              zIndex: 100,
              background: "#fff",
              borderTop: "1px solid #e5e7eb"
            }}>

        <div className="flex items-center gap-2 justify-between">
          <div className="flex gap-2">
          <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm">🛒</span>
          </div>
          <div>
            <div className="font-bold text-gray-900 text-base">₹{totalBet.toFixed(2)}</div>
            <div className="text-xs text-gray-400">{bets.length} numbers</div>
          </div>
          </div>
          <button
           onClick={placeBet}
          disabled={bets.length === 0}
          className=" bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold px-8 py-3 rounded-full text-sm transition-colors"
        >
          Pay Now
        </button>
        </div>
        
      </div>
    </div>
  );
}
 
// ─── GAME CARD ────────────────────────────────────────────────────────────────
 
function GameCard({ game }) {
  const navigate = useNavigate();
  const [h, m, s] = useCountdown(game.cycle * 60 - 15);
 
  return (
    <div
      onClick={() => navigate(`/threedigit/${game.id}`)}
      className="rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.02] transition-all border border-gray-100"
    >
      <div className={`relative h-36 bg-gradient-to-br ${game.bgColor} p-3 flex flex-col justify-between`}>
        <div>
          <div className="text-xs text-white/70 font-medium uppercase tracking-wider">{game.subtitle || "Lottery"}</div>
          <div className="text-white font-extrabold text-base leading-tight">
            WIN PRIZE<br />
            <span className="text-2xl">₹{game.tripleWin.toLocaleString("en-IN")}</span>
          </div>
        </div>
        <div className="text-xs text-white/80">
          Time for Next Booking
          <div className="font-mono font-bold text-white mt-0.5">
            {h} : {m} : {s}
          </div>
        </div>
      </div>
      <div className="bg-white px-3 py-1.5 flex items-center justify-between">
        <span className="text-xs text-gray-500">₹{game.ticketPrice}.00 / Ticket</span>
      </div>
    </div>
  );
}
 
// ─── LIST PAGE ────────────────────────────────────────────────────────────────
export function ThreeDigitList() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetchHome();
  }, []);

  const fetchHome = async () => {
    try {
      const res = await homeApi();

      const categories = res?.data?.categories || [];

      const lottery = categories.find(c => c.name === "Lottery");

      const threeDigitTab = lottery?.tabs.find(t => t.key === "3-digit");

      setGames(threeDigitTab?.items || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-3 h-5 bg-green-500 rounded-sm" />
        <h2 className="font-bold text-gray-800 text-xl">3 Digit Game</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {games.map((g) => (
          <GameCard key={g.id} game={g} />
        ))}
      </div>
    </div>
  );
}
 
export default ThreeDigitList;