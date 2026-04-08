import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const LOTTERY_DATA = [
  {
    id: "karunya",
    name: "KARUNYA",
    nav: "karunya",
    number: "KN-618",
    drawTime: "11-04-2026 01:30 PM",
    lastJackpot: ["K", "A", "8", "3", "6", "0", "1", "7"],
    tickets: ["KA456789","KA456789"],
    prize: "80 Lakhs",
    bgColor: "from-orange-500 to-red-500",
    price: 50,
    img:'https://cdn2.cloudfrontstatic.com/manager/3b38b10e93364fb28afb0ddd82395abe.webp'
  },
  {
    id: "online-only",
    name: "ONLINE-ONLY",
    nav: "online-only",
    number: "OA-1441",
    drawTime: "07-04-2026 08:00 PM",
    lastJackpot: ["O", "M", "7", "1", "0", "2", "3", "8"],
    tickets: ["OV210517", "OR430360", "OU862308", "OR888079", "OP832236", "OZ348931"],
    prize: "1.2 Crores",
    bgColor: "from-green-500 to-teal-600",
    price: 50,
    img: 'https://cdn2.cloudfrontstatic.com/manager/2074adc38db24ca4a676d0c43554c721.webp'
  },
  {
    id: "samrudh",
    name: "SAMRUDHI",
    nav: "samrudhi",
    number: "SA-1441",
    drawTime: "07-04-2026 08:00 PM",
    lastJackpot: ["O", "M", "7", "1", "0", "2", "3", "8"],
    tickets: ["OV210517", "OR430360", "OU862308", "OR888079", "OP832236", "OZ348931"],
    prize: "1.2 Crores",
    bgColor: "from-green-500 to-teal-600",
    price: 50,
     img: 'https://cdn2.cloudfrontstatic.com/manager/94b3640dd9f346f6b3daed0dfbfb99f8.webp'
  },
  {
    id: "online-only",
    name: "ONLINE-ONLY",
    nav: "online-only",
    number: "OA-1441",
    drawTime: "07-04-2026 08:00 PM",
    lastJackpot: ["O", "M", "7", "1", "0", "2", "3", "8"],
    tickets: ["OV210517", "OR430360", "OU862308", "OR888079", "OP832236", "OZ348931"],
    prize: "1.2 Crores",
    bgColor: "from-green-500 to-teal-600",
    price: 50,
    img: 'https://cdn2.cloudfrontstatic.com/manager/2074adc38db24ca4a676d0c43554c721.webp'
  },
  {
    id: "bhagyadhara",
    name: "BHAGYADHARA",
    nav: "bhagyadhara",
    number: "BH-618",
    drawTime: "11-04-2026 01:30 PM",
    lastJackpot: ["B", "H", "8", "3", "6", "0", "1", "7"],
    tickets: ["BH456789"],
    prize: "80 Lakhs",
    bgColor: "from-orange-500 to-red-500",
    price: 50,
     img: 'https://cdn2.cloudfrontstatic.com/manager/f4a9a49106da40c8be0e5ef2848498d8.webp'
  },
  {
    id: "sthree-sakthi",
    name: "STHREE-SAKTHI",
    nav: "sthree-sakthi",
    number: "SS-514",
    drawTime: "07-04-2026 03:00 PM",
    lastJackpot: ["S", "P", "3", "0", "7", "5", "0", "8"],
    tickets: ["SH945178", "SB678245", "SE422160", "SM596096", "SD816737"],
    prize: "75 Lakhs",
    bgColor: "from-pink-500 to-purple-600",
    price: 50,
    img: 'https://cdn2.cloudfrontstatic.com/manager/e823528c97b046d99c14bdf47c4c39d6.webp'
  },
  {
    id: "dhanalakshmi",
    name: "DHANALAKSHMI",
    nav: "dhanalakshmi",
    number: "DL-47",
    drawTime: "08-04-2026 03:00 PM",
    lastJackpot: ["D", "L", "4", "5", "2", "1", "9", "3"],
    tickets: ["DH123456", "DL789012"],
    prize: "1 Crore",
    bgColor: "from-blue-500 to-indigo-600",
    price: 50,
    img: 'https://cdn2.cloudfrontstatic.com/manager/f2f8289f43b8421889671fc3d83a5aaa.webp'
  },
  {
    id: "karunya-plus",
    name: "KARUNYA PLUS",
    nav: "karunya-plus",
    number: "KN-618",
    drawTime: "11-04-2026 01:30 PM",
    lastJackpot: ["K", "P", "8", "3", "6", "0", "1", "7"],
    tickets: ["KP456789"],
    prize: "80 Lakhs",
    bgColor: "from-orange-500 to-red-500",
    price: 50,
    img: 'https://cdn2.cloudfrontstatic.com/manager/3b089a01b87c4c2a90df0c6412060c90.webp'
  },
  {
    id: "suvarana-keralam",
    name: "SUVARANA KERALAM",
    nav: "suvarana keralam",
    number: "SK-618",
    drawTime: "11-04-2026 01:30 PM",
    lastJackpot: ["S", "K", "8", "3", "6", "0", "1", "7"],
    tickets: ["SK456789"],
    prize: "80 Lakhs",
    bgColor: "from-orange-500 to-red-500",
    price: 50,
    img: 'https://cdn2.cloudfrontstatic.com/manager/c9d5d47a575d4dd997bf16e17997ad55.webp'
  },


];




const RESULT_HISTORY = [
  { id: "OA-1440", name: "ONLINE-ONLY", date: "06-04-2026 08:00 PM" },
  { id: "BT-48", name: "BHAGYATHARA", date: "06-04-2026 03:00 PM" },
  { id: "SM-49", name: "SAMRUDHI", date: "05-04-2026 03:00 PM" },
  { id: "OA-1439", name: "ONLINE-ONLY", date: "05-04-2026 08:00 PM" },
  { id: "OA-1438", name: "ONLINE-ONLY", date: "04-04-2026 08:00 PM" },
  { id: "KR-749", name: "KARUNYA", date: "04-04-2026 03:00 PM" },
];

function JackpotBall({ value, index }) {
  const isLetter = isNaN(value);
  return (
    <div
      className={`w-20 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-inner ${isLetter ? "bg-orange-400" : "bg-red-500"
        }`}
    >
      {value}
    </div>
  );
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 text-sm font-medium transition-colors relative ${active
          ? "text-purple-600"
          : "text-gray-500 hover:text-gray-700"
        }`}
    >
      {label}
      {active && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-purple-600 rounded-full" />
      )}
    </button>
  );
}

function BettingTab({ lottery, onRemoveTicket }) {
  const [tickets, setTickets] = useState(lottery.tickets);
  const [newTicket, setNewTicket] = useState("");
  const [showInput, setShowInput] = useState(false);

  const remove = (i) => setTickets((t) => t.filter((_, idx) => idx !== i));

  const add = () => {
    if (newTicket.trim()) {
      setTickets((t) => [...t, newTicket.trim().toUpperCase()]);
      setNewTicket("");
      setShowInput(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 pt-4">
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-gray-800 text-medium">
            Shopping Cart ({tickets.length})
          </span>
          <button
            onClick={() => setTickets([])}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
          </button>
        </div>
        <div className="flex flex-wrap gap-4 mt-8">
          {tickets.map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm font-medium text-gray-700"
            >
              {t}
              <button
                onClick={() => remove(i)}
                className="ml-1 text-gray-400 hover:text-red-500 w-4 h-4 flex items-center justify-center rounded-full"
              >
                ✕
              </button>
            </div>
          ))}
          {showInput ? (
            <div className="flex items-center gap-1">
              <input
                autoFocus
                value={newTicket}
                onChange={(e) => setNewTicket(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && add()}
                placeholder="Ticket no."
                className="border border-purple-300 rounded-full px-3 py-1 text-xs w-28 outline-none focus:border-purple-500"
              />
              <button
                onClick={add}
                className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700"
              >
                Add
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="flex items-center gap-1 border border-purple-400 rounded-full px-3 py-1 text-xs font-medium text-purple-600 hover:bg-purple-50 transition-colors"
            >
              + Add
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        {["10 Quick Picks", "25 Quick Picks", "Customize Your Tickets"].map((label) => (
          <button
            key={label}
            className="border border-gray-200 rounded-xl py-3 text-xs text-center text-gray-700 hover:border-purple-400 hover:text-purple-600 transition-colors leading-snug"
          >
            {label.includes("Customize") ? (
              <span className="flex items-center justify-center gap-1">
                {label} <span className="text-gray-400">›</span>
              </span>
            ) : (
              <>
                <div className="font-semibold text-sm">{label.split(" ")[0]}</div>
                <div>Quick Picks</div>
              </>
            )}
          </button>
        ))}
      </div>
      <div className=" absolute bottom-29 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between z-20">
        <div>
          <div className="text-xl font-bold text-gray-900">
            ₹{(tickets.length * lottery.price).toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">{tickets.length} Tickets</div>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm">
          Pay Now
        </button>
      </div>
    </div>
  );
}
function ResultHistoryTab() {
  return (
    <div className="pt-4 flex flex-col gap-2">
      {RESULT_HISTORY.map((r) => (
        <div
          key={r.id}
          className="flex items-center gap-3 border border-yellow-300 bg-yellow-50 rounded-xl px-4 py-3 cursor-pointer hover:bg-yellow-100 transition-colors"
        >
          <div className="border-r border-dashed border-yellow-400 pr-3 min-w-[72px]">
            <span className="font-bold text-gray-800 text-sm">{r.id}</span>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-800 text-sm">{r.name}</div>
            <div className="text-xs text-gray-500">{r.date}</div>
          </div>
          <span className="text-gray-400 text-lg">›</span>
        </div>
      ))}
    </div>
  );
}

function MyOrderTab() {
  return (
    <div className="pt-4 text-center text-gray-400 text-sm py-12">
      No orders yet.
    </div>
  );
}

export function KeralaLotteryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lottery = LOTTERY_DATA.find((l) => l.id === id);
  const [tab, setTab] = useState("betting");

  if (!lottery) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Lottery not found.{" "}
        <button onClick={() => navigate(-1)} className="ml-2 text-purple-600 underline">Go back</button>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800 text-xl"><ChevronLeft/></button>
        <span className="font-semibold text-gray-800">Kerala State Lottery</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Balance</span>
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">💰</div>
        </div>
      </div>

      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${lottery.bgColor} flex items-center justify-center overflow-hidden`}>
  <img
    src={lottery.img}
    alt="lottery"
    className="w-full h-full object-cover"
  />
</div>
            <div>
              <div className="font-bold text-gray-900 text-base">{lottery.name}</div>
              <div className="text-xs text-gray-500">NO.{lottery.number}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-orange-500 font-semibold uppercase tracking-wide">Draw Time</div>
            <div className="font-bold text-gray-800 text-sm mt-3">{lottery.drawTime}</div>
          </div>
        </div>

        <div className="mt-8 bg-gray-100 rounded-xl px-3 py-6 flex items-center gap-3">
          <span className="text-xs text-gray-500 whitespace-nowrap">Last Jackpot<br />Outcome:</span>
          <div className="flex gap-1.5 overflow-x-auto">
            {lottery.lastJackpot.map((v, i) => (
              <JackpotBall key={i} value={v} index={i} />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 px-4 mt-5">
        <div className="flex">
          {["betting", "result history", "my order"].map((t) => (
            <TabButton key={t} label={t.charAt(0).toUpperCase() + t.slice(1)} active={tab === t} onClick={() => setTab(t)} />
          ))}
        </div>
      </div>

      <div className="px-4 pb-6 flex-1 bg-white">
        {tab === "betting" && <BettingTab lottery={lottery} />}
        {tab === "result history" && <ResultHistoryTab />}
        {tab === "my order" && <MyOrderTab />}
      </div>
    </div>
  );
}

function LotteryCard({ lottery }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/kerala-lottery/${lottery.id}`)}
      className={`relative rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-br ${lottery.bgColor} p-4 flex flex-col justify-between min-h-[160px] shadow-sm hover:scale-[1.02] transition-transform`}
    >
      <div>
        <div className="text-xs font-medium text-white/80 uppercase tracking-widest mb-1">weekly lottery</div>
        <div className="font-extrabold text-white text-lg leading-tight">{lottery.name}</div>
        <div className="text-xs text-white/70 mt-0.5">NO. {lottery.number}</div>
      </div>
      <div>
        <div className="text-xs text-white/70">Win Prize</div>
        <div className="font-extrabold text-white text-2xl">{lottery.prize}</div>
      </div>
      <div className="absolute top-3 right-3 bg-white/20 rounded-lg px-2 py-0.5 text-xs text-white font-semibold">
        {lottery.number}
      </div>
    </div>
  );
}

export function KeralaLotteryList() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-5 bg-green-500 rounded-sm" />
        <h2 className="font-bold text-gray-800 text-lg">Kerala State Lottery</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {LOTTERY_DATA.map((l) => (
          <LotteryCard key={l.id} lottery={l} />
        ))}
      </div>
      <p className="text-xs text-gray-400 text-center mt-6">Tap any lottery to view details & buy tickets</p>
    </div>
  );
}

export default KeralaLotteryList;