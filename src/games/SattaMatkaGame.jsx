import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
 
// ─── DATA ────────────────────────────────────────────────────────────────────
 
const MATKA_MARKETS = [
  {
    id: 21,
    name: "MP BAZAR",
    number: "NO.9",
    panel: "* * * - * * - * * *",
    openTime: "11:30 AM",
    closeTime: "12:30 PM",
    bidPrice: 10,
    winPrize: "₹1,00,000",
    bgImage: "https://cdn.cloudstaticfile.com/manager/2af56488065e4aa7a2d73d041516ffa8MPBazar.png",
    currentResult: "170-84-248",
    resultHistory: [
      { issue: "NO.202604069", numbers: "170-84-248", time: "06-04-2026" },
      { issue: "NO.202604059", numbers: "359-75-267", time: "05-04-2026" },
      { issue: "NO.202604049", numbers: "169-69-333", time: "04-04-2026" },
      { issue: "NO.202604039", numbers: "555-52-246", time: "03-04-2026" },
      { issue: "NO.202604029", numbers: "379-97-269", time: "02-04-2026" },
    ],
    winners: [
      { rank: 1, user: "620****048", won: 1995 },
      { rank: 2, user: "805****421", won: 1745 },
      { rank: 3, user: "701****595", won: 1745 },
      { rank: 4, user: "897****274", won: 1460 },
      { rank: 5, user: "812****205", won: 1415 },
    ],
  },
  {
    id: 22,
    name: "KUBER",
    number: "NO.3",
    panel: "* * * - * * - * * *",
    openTime: "01:00 PM",
    closeTime: "02:00 PM",
    bidPrice: 10,
    winPrize: "₹1,00,000",
    bgImage: "https://cdn.cloudstaticfile.com/manager/bcc06c40ad2b4d8b8b9e162cc8090e4bKuber.png",
    currentResult: "220-44-130",
    resultHistory: [
      { issue: "NO.202604068", numbers: "220-44-130", time: "06-04-2026" },
      { issue: "NO.202604058", numbers: "445-31-166", time: "05-04-2026" },
      { issue: "NO.202604048", numbers: "678-12-255", time: "04-04-2026" },
      { issue: "NO.202604038", numbers: "112-40-226", time: "03-04-2026" },
      { issue: "NO.202604028", numbers: "990-80-334", time: "02-04-2026" },
    ],
    winners: [
      { rank: 1, user: "512****340", won: 2200 },
      { rank: 2, user: "713****099", won: 1900 },
      { rank: 3, user: "344****782", won: 1750 },
      { rank: 4, user: "601****441", won: 1500 },
      { rank: 5, user: "289****113", won: 1300 },
    ],
  },
  {
    id: 23,
    name: "MUMBAI MAIN",
    number: "NO.11",
    panel: "* * * - * * - * * * *",
    openTime: "04:00 PM",
    closeTime: "06:00 PM",
    bidPrice: 10,
    winPrize: "₹1,00,000",
    bgImage: "https://cdn.cloudstaticfile.com/manager/374e3ffff34d4b04b51bbce0bba0a9d1MumbaiMain.png",
    currentResult: "448-62-779",
    resultHistory: [
      { issue: "NO.202604067", numbers: "448-62-779", time: "06-04-2026" },
      { issue: "NO.202604057", numbers: "239-40-145", time: "05-04-2026" },
      { issue: "NO.202604047", numbers: "558-81-236", time: "04-04-2026" },
      { issue: "NO.202604037", numbers: "667-90-460", time: "03-04-2026" },
      { issue: "NO.202604027", numbers: "114-60-330", time: "02-04-2026" },
    ],
    winners: [
      { rank: 1, user: "801****203", won: 3100 },
      { rank: 2, user: "920****557", won: 2800 },
      { rank: 3, user: "443****882", won: 2500 },
      { rank: 4, user: "672****119", won: 2100 },
      { rank: 5, user: "355****744", won: 1800 },
    ],
  },
  {
    id: 20,
    name: "BENGAL BAZAR",
    number: "NO.7",
    panel: "* * * - * * - * * *",
    openTime: "06:30 PM",
    closeTime: "07:30 PM",
    bidPrice: 10,
    winPrize: "₹1,00,000",
    bgImage: "https://cdn.cloudstaticfile.com/manager/d6076f0a387e483e91cbdb33f401a115BengalBazar.png",
    currentResult: "336-20-019",
    resultHistory: [
      { issue: "NO.202604066", numbers: "336-20-019", time: "06-04-2026" },
      { issue: "NO.202604056", numbers: "789-50-234", time: "05-04-2026" },
      { issue: "NO.202604046", numbers: "112-44-557", time: "04-04-2026" },
      { issue: "NO.202604036", numbers: "445-72-335", time: "03-04-2026" },
      { issue: "NO.202604026", numbers: "890-61-456", time: "02-04-2026" },
    ],
    winners: [
      { rank: 1, user: "310****678", won: 2700 },
      { rank: 2, user: "528****401", won: 2300 },
      { rank: 3, user: "791****023", won: 2050 },
      { rank: 4, user: "463****889", won: 1750 },
      { rank: 5, user: "234****556", won: 1450 },
    ],
  },
  {
    id: 5,
    name: "RATNAGIRI",
    number: "NO.5",
    panel: "* * * - * * - * * *",
    openTime: "08:00 PM",
    closeTime: "10:00 PM",
    bidPrice: 10,
    winPrize: "₹1,00,000",
    bgImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    currentResult: "567-80-125",
    resultHistory: [
      { issue: "NO.202604065", numbers: "567-80-125", time: "06-04-2026" },
      { issue: "NO.202604055", numbers: "234-90-677", time: "05-04-2026" },
      { issue: "NO.202604045", numbers: "890-11-344", time: "04-04-2026" },
      { issue: "NO.202604035", numbers: "123-60-228", time: "03-04-2026" },
      { issue: "NO.202604025", numbers: "445-50-445", time: "02-04-2026" },
    ],
    winners: [
      { rank: 1, user: "711****334", won: 2950 },
      { rank: 2, user: "822****890", won: 2600 },
      { rank: 3, user: "533****112", won: 2200 },
      { rank: 4, user: "944****667", won: 1900 },
      { rank: 5, user: "155****445", won: 1600 },
    ],
  },
  {
    id: 6,
    name: "DELHI DARBAR",
    number: "NO.2",
    panel: "200-2*-***",
    openTime: "09:00 AM",
    closeTime: "11:00 AM",
    bidPrice: 10,
    winPrize: "₹1,00,000",
    bgImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80",
    currentResult: "200-24-568",
    resultHistory: [
      { issue: "NO.202604064", numbers: "200-24-568", time: "06-04-2026" },
      { issue: "NO.202604054", numbers: "345-70-256", time: "05-04-2026" },
      { issue: "NO.202604044", numbers: "678-91-347", time: "04-04-2026" },
      { issue: "NO.202604034", numbers: "901-23-789", time: "03-04-2026" },
      { issue: "NO.202604024", numbers: "456-80-235", time: "02-04-2026" },
    ],
    winners: [
      { rank: 1, user: "411****234", won: 4200 },
      { rank: 2, user: "622****788", won: 3800 },
      { rank: 3, user: "833****345", won: 3400 },
      { rank: 4, user: "244****901", won: 2900 },
      { rank: 5, user: "655****567", won: 2500 },
    ],
  },
];
 
// ─── BET TYPES ────────────────────────────────────────────────────────────────
 
const BET_TYPES = [
  {
    key: "Ank",
    label: "Ank",
    description: "Single Digit",
    placeholder: "Enter Open Digit",
    hint: "Click Open or Close, and enter a digit you want in the input box, such as 1",
    maxLen: 1,
  },
  {
    key: "Jodi",
    label: "Jodi",
    description: "Jodi",
    placeholder: "Enter Jodi (e.g. 45)",
    hint: "Enter a two digit Jodi number, such as 45",
    maxLen: 2,
  },
  {
    key: "SP",
    label: "SP",
    description: "Single Patti",
    placeholder: "Enter Open Digits",
    hint: "Click Open or Close, and enter the three numbers you want to bet in the input box, such as 123",
    maxLen: 3,
  },
  {
    key: "DP",
    label: "DP",
    description: "Double Patti",
    placeholder: "Enter Digits",
    hint: "Enter a double patti number, such as 112",
    maxLen: 3,
  },
  {
    key: "TP",
    label: "TP",
    description: "Triple Patti",
    placeholder: "Enter Digits",
    hint: "Enter a triple patti number, such as 111",
    maxLen: 3,
  },
  {
    key: "HalfSangam",
    label: "Half Sangam",
    description: "Half Sangam",
    placeholder: "Enter Digits",
    hint: "Enter digits for Half Sangam bet",
    maxLen: 4,
  },
  {
    key: "FullSangam",
    label: "Full Sangam",
    description: "Full Sangam",
    placeholder: "Enter Digits",
    hint: "Enter digits for Full Sangam bet",
    maxLen: 6,
  },
];
 
// ─── RANK MEDAL ───────────────────────────────────────────────────────────────
 
function RankMedal({ rank }) {
  if (rank === 1) return <span className="text-xl">🥇</span>;
  if (rank === 2) return <span className="text-xl">🥈</span>;
  if (rank === 3) return <span className="text-xl">🥉</span>;
  return (
    <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
      {rank}
    </span>
  );
}
 
// ─── DETAIL SCREEN ────────────────────────────────────────────────────────────
 
export function SattaMatkaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const market = MATKA_MARKETS.find((m) => m.id === parseInt(id));
  const onBack = () => navigate(-1);
 
  // ✅ All hooks MUST be called before any early return
  const [activeBetType, setActiveBetType] = useState("Ank");
  const [openClose, setOpenClose] = useState("open");
  const [digitInput, setDigitInput] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [bids, setBids] = useState([]);
  const [activeTab, setActiveTab] = useState("result");
 
  if (!market) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Market not found.{" "}
        <button onClick={onBack} className="ml-2 text-purple-600 underline">Go back</button>
      </div>
    );
  }
 
  const currentBet = BET_TYPES.find((b) => b.key === activeBetType);
  const multiplier = { Ank: 9, Jodi: 90, SP: 120, DP: 180, TP: 600, HalfSangam: 1000, FullSangam: 10000 };
  const expectedWin = buyAmount ? parseInt(buyAmount || 0) * (multiplier[activeBetType] || 9) : 0;
 
  const handleAdd = () => {
    if (!digitInput || !buyAmount) return;
    setBids((prev) => [
      ...prev,
      { type: activeBetType, digit: digitInput, side: openClose, amount: parseInt(buyAmount) },
    ]);
    setDigitInput("");
    setBuyAmount("");
  };
 
  const totalBid = bids.reduce((s, b) => s + b.amount, 0);
 
  const twoRow = ["HalfSangam", "FullSangam"].includes(activeBetType);
 
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-20">
        <button onClick={onBack} className="text-2xl text-gray-500 hover:text-gray-800 leading-none"><ChevronLeft/></button>
        <span className="font-semibold text-gray-900">Satta Matka</span>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>Balance</span>
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">💰</div>
        </div>
      </div>
 
      {/* Hero Banner */}
      <div
        className="relative w-full h-38 bg-cover bg-center flex flex-col justify-between p-3"
        style={{ backgroundImage: `url('${market.bgImage}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70 rounded-none" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="text-white font-extrabold text-lg tracking-wider drop-shadow">{market.name}</div>
            <div className="mt-1 bg-black/50 rounded-lg px-2 py-1 inline-flex items-center gap-1">
              <span className="text-xs text-gray-300 font-medium">PANEL:</span>
              <span className="text-white font-mono text-xs tracking-widest">{market.panel}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white text-xs font-semibold">{market.number}</span>
            <button className="flex items-center gap-1 bg-white/20 border border-white/30 rounded-lg px-2 py-1 text-white text-xs hover:bg-white/30 transition-colors">
              📋 Rule
            </button>
          </div>
        </div>
        <div className="relative flex items-center justify-between text-xs text-white/90">
          <span>🕐 Open {market.openTime}</span>
          <span>🕐 Close {market.closeTime}</span>
        </div>
      </div>
 
      {/* Bet Type Tabs */}
      <div className="bg-white border-b border-gray-100 px-3 pt-3 pb-2">
        <div className={`grid ${twoRow ? "grid-cols-5" : "grid-cols-5"} gap-2 mb-2`}>
          {BET_TYPES.slice(0, 5).map((bt) => (
            <button
              key={bt.key}
              onClick={() => { setActiveBetType(bt.key); setDigitInput(""); }}
              className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                activeBetType === bt.key
                  ? "bg-white border-purple-500 text-purple-600 shadow-sm"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {bt.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {BET_TYPES.slice(5).map((bt) => (
            <button
              key={bt.key}
              onClick={() => { setActiveBetType(bt.key); setDigitInput(""); }}
              className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                activeBetType === bt.key
                  ? "bg-white border-purple-500 text-purple-600 shadow-sm"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {bt.label}
            </button>
          ))}
        </div>
      </div>
 
      {/* Bet Input Section */}
      <div className="bg-white mx-0 px-4 pt-3 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-700 font-medium">
            {currentBet.description}: <span className="text-gray-400">-</span>
          </span>
          {activeBetType !== "Jodi" && activeBetType !== "FullSangam" && (
            <div className="flex rounded-xl overflow-hidden border border-gray-200 text-xs font-semibold">
              <button
                onClick={() => setOpenClose("open")}
                className={`px-4 py-1.5 transition-colors ${
                  openClose === "open" ? "bg-purple-600 text-white" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                open
              </button>
              <button
                onClick={() => setOpenClose("close")}
                className={`px-4 py-1.5 transition-colors ${
                  openClose === "close" ? "bg-purple-600 text-white" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                close
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mb-3 leading-relaxed">{currentBet.hint}</p>
        <input
          type="text"
          inputMode="numeric"
          maxLength={currentBet.maxLen}
          value={digitInput}
          onChange={(e) => setDigitInput(e.target.value.replace(/\D/g, "").slice(0, currentBet.maxLen))}
          placeholder={openClose === "open" ? `Enter Open ${currentBet.description === "Single Digit" ? "Digit" : "Digits"}` : `Enter Close ${currentBet.description === "Single Digit" ? "Digit" : "Digits"}`}
          className="w-full border border-purple-200 rounded-xl px-4 py-3 text-sm text-center text-gray-700 placeholder-gray-300 focus:outline-none focus:border-purple-400 bg-gray-50"
        />
      </div>
 
      {/* Expected Winning + Buy Amount */}
      <div className="bg-gray-50 px-4 pt-3 pb-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="text-sm text-gray-700 mb-3">
            Expected winning:{" "}
            <span className="font-bold text-gray-900">
              ₹{expectedWin.toLocaleString("en-IN")}.00
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter Buy Amount"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-purple-400 bg-gray-50"
            />
            <button
              onClick={handleAdd}
              disabled={!digitInput || !buyAmount}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              + Add
            </button>
          </div>
          {bids.length > 0 && (
            <div className="mt-3 border-t border-gray-100 pt-3 flex flex-col gap-1.5">
              {bids.map((b, i) => (
                <div key={i} className="flex items-center justify-between text-xs text-gray-600 bg-purple-50 rounded-lg px-3 py-1.5">
                  <span className="font-medium">{b.type} — {b.digit} ({b.side})</span>
                  <span className="font-semibold text-purple-700">₹{b.amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
 
      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-4">
        <div className="flex">
          {[
            { key: "result", label: "Result history" },
            { key: "winners", label: "Winners" },
            { key: "myorder", label: "My order" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-3 text-sm relative transition-colors ${
                activeTab === t.key ? "font-bold text-gray-900" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {t.label}
              {activeTab === t.key && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-purple-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
 
      {/* Tab Content */}
      <div className="flex-1 bg-white px-4 pb-24">
        {activeTab === "result" && (
          <table className="w-full mt-3 text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase">
                <th className="text-left py-2 font-semibold">Issue</th>
                <th className="text-center py-2 font-semibold">Numbers</th>
                <th className="text-right py-2 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {market.resultHistory.map((r, i) => (
                <tr key={i} className="border-t border-gray-50">
                  <td className="py-3 text-gray-500 text-xs">{r.issue}</td>
                  <td className="py-3 text-center">
                    <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full text-xs">
                      {r.numbers}
                    </span>
                  </td>
                  <td className="py-3 text-right text-gray-500 text-xs">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
 
        {activeTab === "winners" && (
          <div className="mt-3 flex flex-col gap-3">
            {market.winners.map((w) => (
              <div key={w.rank} className="flex items-center gap-3">
                <RankMedal rank={w.rank} />
                <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-gray-400 text-sm">
                  👤
                </div>
                <span className="flex-1 text-sm text-gray-700 font-medium">{w.user}</span>
                <span className="text-sm font-bold text-gray-900">
                  Won ₹{w.won.toLocaleString("en-IN")}.00
                </span>
              </div>
            ))}
          </div>
        )}
 
        {activeTab === "myorder" && (
          <div className="mt-6 text-center text-gray-400 text-sm py-12">
            No orders placed yet.
          </div>
        )}
      </div>
 
      {/* Bottom Pay Bar */}
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
            <div className="font-bold text-gray-900 text-base">₹{totalBid.toFixed(2)}</div>
            <div className="text-xs text-gray-400">{bids.length} numbers</div>
          </div>
          </div>
          <button
          disabled={bids.length === 0}
          className=" bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold px-8 py-3 rounded-full text-sm transition-colors"
        >
          Pay Now
        </button>
        </div>
        
      </div>
    </div>
  );
}
 
// ─── MARKET CARD ──────────────────────────────────────────────────────────────
 
function MarketCard({ market }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/matka/${market.id}`)}
      className="rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.02] transition-all"
    >
      <div
        className="relative h-44 bg-cover bg-center"
        style={{ backgroundImage: `url('${market.bgImage}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/80" />
        <div className="absolute inset-0 flex flex-col justify-between p-3">
          <div className="text-white font-extrabold text-xl tracking-widest drop-shadow">
            
          </div>
          <div className="flex flex-col gap-1">
            <div className="bg-black/50 rounded-lg px-2 py-1 self-start">
              <span className="text-white font-mono text-xs tracking-widest">{market.panel}</span>
            </div>
            <div className="flex items-center justify-between text-white text-xs">
              <span>₹{market.bidPrice}/BID</span>
              <span className="text-yellow-300 font-bold">WIN {market.winPrize}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white flex items-center justify-between px-3 py-2 text-xs text-gray-500 border-t border-gray-100">
        <span>🕐 Open {market.openTime}</span>
        <span>🕐 Close {market.closeTime}</span>
      </div>
    </div>
  );
}
 
export function SattaMatkaList() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-3 h-5 bg-green-500 rounded-sm" />
        <h2 className="font-bold text-gray-800 text-xl">Satta Matka</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {MATKA_MARKETS.map((m) => (
          <MarketCard key={m.id} market={m} />
        ))}
      </div>
    </div>
  );
}
 
export default SattaMatkaList;  