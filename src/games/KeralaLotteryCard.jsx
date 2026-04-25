import { ChevronLeft } from "lucide-react";
import { useState ,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getkeralaLottery, generateTickets,deleteTicket,createBet,getBettingList} from "../services/gameSevice";
import { getWalletSummary,homeApi } from "../services/authService";
import { getAllLotteryResults,getLotteryDetails } from "../services/gameSevice";



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
function BettingTab({ lottery, tickets, setTickets }) {

  const [newTicket, setNewTicket] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
  show: false,
  message: "",
  type: "success",
});
const showToast = (message, type = "success") => {
  setToast({ show: true, message, type });

  setTimeout(() => {
    setToast({ show: false, message: "", type: "success" });
  }, 2500);
};

const handleGenerate = async (type, qty = 0, customTickets = null) => {
  try {
    setLoading(true);

    let payload = {};

    if (type === "custom") {
      payload = {
        type: "custom",
        number: customTickets || tickets,
        lotteryId: lottery.id, // ✅ FIX
      };
    } else {
      payload = {
        type: "quantity",
        quantity: qty,
        lotteryId: lottery.id, // ✅ FIX
      };
    }

    console.log("GENERATE PAYLOAD:", payload);

    const res = await generateTickets(payload);

    console.log("GENERATE RESPONSE:", res);

    if (res?.success) {
      const formatted = (res.data || []).map((item) => ({
        id: item.id,
        ticket: item.ticket,
      }));

      setTickets((prev) => [...prev, ...formatted]);
    } else {
      showToast(res?.message || "Failed to generate tickets", "error");
    }

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
const remove = async (i) => {
  try {
    const ticket = tickets[i];

    if (ticket.id) {
      await deleteTicket({ ticketId: ticket.id });
    }

    setTickets((prev) => prev.filter((_, idx) => idx !== i));
  } catch (err) {
    console.error("Delete failed", err);
  }
};

const add = () => {
  if (newTicket.length !== 6) {
   showToast("Enter exactly 6 digits", "error");
    return;
  }

  const fullTicket = `${lottery.code}${newTicket}`;

  setTickets((prev) => [
    ...prev,
    { ticket: fullTicket }
  ]);

  setNewTicket("");
  setShowInput(false);
};

  return (
    <div className="flex flex-col gap-1 pt-4">
        {toast.show && (
  <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
    <div
      className={`px-4 py-2 rounded-full text-white text-sm
      ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}
    >
      {toast.message}
    </div>
  </div>
)}
    
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-gray-800 text-medium">
            Shopping Cart ({tickets?.length || 0})
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
          {(tickets || []).map(((t, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm font-medium text-gray-700"
            >
              {t.ticket}
              <button
                onClick={() => remove(i)}
                className="ml-1 text-gray-400 hover:text-red-500 w-4 h-4 flex items-center justify-center rounded-full"
              >
                ✕
              </button>
            </div>
          )))}
          {showInput ? (
            <div className="flex items-center gap-1">
  <span className="bg-gray-200 px-2 py-1 rounded-full text-xs font-semibold">
    {lottery.code}
  </span>

  <input
    autoFocus
    value={newTicket}
    maxLength={6} // ✅ only 6 digits
    onChange={(e) => {
      const val = e.target.value;

      // allow only digits
      if (/^[0-9]*$/.test(val)) {
        setNewTicket(val);
      }
    }}
    onKeyDown={(e) => e.key === "Enter" && add()}
    placeholder="123456"
    className="border border-purple-300 rounded-full px-3 py-1 text-xs w-20 outline-none focus:border-purple-500"
  />

  <button
    onClick={add}
    className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full"
  >
    Add
  </button>
</div>
          ) : (
            <button
              onClick={() => handleGenerate("quantity", 1)}
              className="flex items-center gap-1 border border-purple-400 rounded-full px-3 py-1 text-xs font-medium text-purple-600 hover:bg-purple-50 transition-colors"
            >
              + Add
            </button>
          )}
        </div>
      </div>

<div className="grid grid-cols-3 gap-2 mt-4">
  {[
    { label: "10 Quick Picks", type: "quantity", value: 10 },
    { label: "25 Quick Picks", type: "quantity", value: 25 },
    { label: "Customize Your Tickets", type: "custom" }
  ].map((item) => (
    <button
      key={item.label}
      onClick={() => {
        if (item.type === "quantity") {
          handleGenerate("quantity", item.value);
        } else {
          setShowInput(true);
        }
      }}
      className="border border-gray-200 rounded-xl py-3 text-xs text-center text-gray-700 hover:border-purple-400 hover:text-purple-600 transition-colors leading-snug"
    >
      {item.type === "custom" ? (
        <span className="flex items-center justify-center gap-1">
          {item.label} <span className="text-gray-400">›</span>
        </span>
      ) : (
        <>
          <div className="font-semibold text-sm">{item.value}</div>
          <div>Quick Picks</div>
        </>
      )}
    </button>
  ))}
</div>

    </div>
  );
}
function ResultHistoryTab({ lottery }) {
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [lottery]);

  const fetchResults = async () => {
    try {
      const res = await getAllLotteryResults({
        
      });

      if (res?.success) {
        setResults(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openDetails = async (item) => {
    setSelected(item);

    try {
      const res = await getLotteryDetails({
        lotteryDigit: item.lotteryDigit,
      });

      if (res?.success) {
        setDetails(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const goBack = () => {
    setSelected(null);
    setDetails(null);
  };

  if (loading) {
    return <div className="pt-4 text-center text-gray-400">Loading...</div>;
  }

  // ✅ DETAILS VIEW
 if (selected) {
  return (
    <div className="pt-4">

      {/* 🔙 BACK HEADER */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={goBack} className="text-lg"><ChevronLeft/></button>
        <div>
          <div className="font-bold text-gray-800">
            {selected.lotteryDigit}
          </div>
          <div className="text-xs text-gray-500">
            {selected.name} | {selected.drawDate} {selected.drawTime}
          </div>
        </div>
      </div>

      {/* 📊 DETAILS UI (YOUR STYLE) */}
      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : (
        <div className="flex flex-col gap-4">

          {(details?.draws || []).map((draw, i) => (
            <div key={i}>

              {draw.prizes.map((p, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-4 bg-gradient-to-r from-yellow-100 to-pink-100 shadow-sm"
                >
                  {/* 🏆 HEADER */}
                  <div className="flex justify-between mb-3">
                    <span className="font-bold text-gray-800">
                      Rank {p.rank}
                    </span>
                    <span className="text-orange-600 font-semibold">
                      ₹{p.amount}
                    </span>
                  </div>

                  {/* 🎯 NUMBERS */}
                  <div className="flex flex-wrap gap-2">
                    {(p.winningNumbers || []).map((num, i2) => (
                      <div
                        key={i2}
                        className="bg-white px-3 py-1 rounded-full text-sm font-medium shadow"
                      >
                        {num}
                      </div>
                    ))}
                  </div>

                </div>
              ))}

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

  // ✅ ORIGINAL LIST UI (UNCHANGED STYLE)
  return (
    <div className="pt-4 flex flex-col gap-2">
      {results.map((r) => (
        <div
          key={r.lotteryDigit}
          onClick={() => openDetails(r)} // ✅ ONLY CHANGE
          className="flex items-center gap-3 border border-yellow-300 bg-yellow-50 rounded-xl px-4 py-3 cursor-pointer hover:bg-yellow-100 transition-colors"
        >
          <div className="border-r border-dashed border-yellow-400 pr-3 min-w-[72px]">
            <span className="font-bold text-gray-800 text-sm">
              {r.lotteryDigit}
            </span>
          </div>

          <div className="flex-1">
            <div className="font-semibold text-gray-800 text-sm">
              {r.name}
            </div>
            <div className="text-xs text-gray-500">
              {r.drawDate} {r.drawTime}
            </div>
          </div>

          <span className="text-gray-400 text-lg">›</span>
        </div>
      ))}
    </div>
  );
}

function MyOrderTab({ lottery }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
    const formatDateTime = (date) => {
  if (!date) return "-";

  const d = new Date(date);

  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

  useEffect(() => {
    fetchOrders();
  }, [lottery]);

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await getBettingList({
        userId: user?.id,
        lotteryDigit: lottery?.lotteryDigit,
      });

      if (res?.success) {
        setOrders(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ STATUS UI HELPER
const getStatusUI = (order) => {
  const status = order.status?.toLowerCase();

  if (status === "won" || status === "success") {
    return (
      <span className="text-green-600 font-semibold">
        Win ₹{order.win_amount || order.winAmount || 0}
      </span>
    );
  }

  if (status === "lost" || status === "failed") {
    return (
      <span className="text-red-500 font-semibold">
        Lost
      </span>
    );
  }

  return (
    <span className="text-yellow-500 font-semibold">
      Result Awaited
    </span>
  );
};

  if (loading) {
    return <div className="pt-4 text-center text-gray-400">Loading...</div>;
  }

  if (!orders.length) {
    return (
      <div className="pt-4 text-center text-gray-400 text-sm py-12">
        No orders yet.
      </div>
    );
  }

    return (
      <div className="pt-4 flex flex-col gap-4">
        {orders.map((order, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border">

            {/* 🔝 STATUS HEADER */}
            <div className="flex justify-between items-center px-3 py-2 border-b bg-gray-50 rounded-t-xl">
              {getStatusUI(order)}

              <span className="text-xs text-gray-500">
                ID {order.id}
              </span>
            </div>

            {/* 🎯 WINNING NUMBER */}
            {order.winningNumber && (
              <div className="px-3 py-2 text-xs text-green-600 font-semibold border-b">
                Winning Number: {order.winningNumber}
              </div>
            )}

            {/* 🧾 ORDER HEADER */}
            <div className="flex justify-between items-center px-3 py-3">
              <div>
                <div className="font-semibold text-gray-800 text-sm">
                  {order.number}
                </div>

                <div className="text-xs text-gray-500">
                 {order.status === "PENDING"
  ? `Draw Time ${formatDateTime(order.drawTime || order.created_at)}`
  : `Played on ${formatDateTime(order.created_at)}`}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-400">Total</div>
                <div className="font-semibold text-gray-800">
                  ₹{order.amount}
                </div>
              </div>
            </div>

          
          </div>
        ))}
      </div>
    );
}

export function KeralaLotteryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
 const [lottery, setLottery] = useState(null);
const [loadingLottery, setLoadingLottery] = useState(true);
const [loadingWallet, setLoadingWallet] = useState(true);
const [toast, setToast] = useState({
  show: false,
  message: "",
  type: "success",
});
const showToast = (message, type = "success") => {
  setToast({ show: true, message, type });

  setTimeout(() => {
    setToast({ show: false, message: "", type: "success" });
  }, 2500);
};
const [balance, setBalance] = useState({
  totalWallet: 0
});
  const [tab, setTab] = useState("betting");

const [tickets, setTickets] = useState([]);

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

useEffect(() => {
  const fetchLottery = async () => {
    try {
      const res = await getkeralaLottery({ gameId: id });

      console.log("API FULL:", res);

      if (res?.success && res?.data?.length > 0) {
        const item = res.data[0];

        setLottery({
           id: item.id,           // ✅ lotteryId
           gameId: item.gameId,   // ✅ keep separately
          name: item.name,
          code: item.code,
          number: item.lotteryDigit?.split(""),
          drawTime: `${item.drawDate} ${item.drawTime}`,
          price: item.price,
          prize: item.jackpot,
          tickets: [],
          lastJackpot: [],
          lotteryDigit: item.lotteryDigit,
          bgColor: "from-orange-500 to-red-500",
          img: item.game?.image || "https://via.placeholder.com/150",
        });

      } else {
        setLottery(null);
      }

    } catch (err) {
      console.error(err);
      setLottery(null);
    } finally {
      setLoadingLottery(false);
    }
  };

  if (id) fetchLottery();
}, [id]);

  if (!lottery) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Lottery not found.{" "}
        <button onClick={() => navigate(-1)} className="ml-2 text-purple-600 underline">Go back</button>
      </div>
    );
  }

if (loadingLottery) {
  return <div className="p-4 text-center">Loading...</div>;
}
const handlePayNow = async () => {
  try {
    if (!tickets.length) {
      showToast("Please add tickets", "error");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));

     if (!storedUser?.id) {
      showToast("Login to continue play", "error");

      setTimeout(() => {
        navigate("/login"); // 👈 change route if needed
      }, 1500);

      return;
    }

   const payload = {
  userId: storedUser?.id,
  lotteryId: lottery.id,
  tickets: tickets.map((t) => t.ticket),
  amount: tickets.length * lottery.price,
};
    console.log("PAYLOAD:", payload);

    const res = await createBet(payload);

    if (res?.success) {
     showToast("Bet placed successfully ✅", "success");

      // ✅ clear tickets after success
      setTickets([]);

      // optional: refresh wallet
      fetchWallet(storedUser.id);
    } else {
     showToast(res?.message || "Payment failed ❌", "error");
      console.log("bet",res?.message)
    }

  } catch (err) {
    console.error(err);
    showToast("Something went wrong");
  }
};
const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {toast.show && (
  <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
    <div
      className={`px-4 py-2 rounded-full text-white text-sm
      ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}
    >
      {toast.message}
    </div>
  </div>
)}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800 text-xl"><ChevronLeft/></button>
        <p className="font-semibold text-gray-800">Kerala State Lottery</p>
        <div className="flex items-center gap-2">
          <span className="text-medium font-semibold text-black-400">
  {user ? `₹${balance.totalWallet || 0}` : "-"}
</span>
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
              <div className="text-xs text-gray-500">{lottery.number}</div>
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
            <TabButton key={t.ticket} label={t.charAt(0).toUpperCase() + t.slice(1)} active={tab === t} onClick={() => setTab(t)} />
          ))}
        </div>
      </div>

      <div className="px-4 flex-1 overflow-y-auto bg-white">
        {tab === "betting" && (
  <BettingTab
    lottery={lottery}
    tickets={tickets}
    setTickets={setTickets}
  />
)}
        {tab === "result history" && (
  <ResultHistoryTab lottery={lottery} />
)}
        {tab === "my order" && <MyOrderTab  lottery={lottery}/>}
      </div>
      <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between">
  <div>
    <div className="text-xl font-bold text-gray-900">
      ₹{((tickets?.length || 0) * (lottery?.price || 0)).toFixed(2)}
    </div>
    <div className="text-xs text-gray-500">{tickets?.length || 0} Tickets</div>
  </div>
<button
  onClick={handlePayNow}
  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
>
  Pay Now
</button>
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
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await homeApi(); // ✅ using service

        if (res?.success) {
          const categories = res.data?.categories || [];

          // ✅ find Lottery category
          const lotteryCategory = categories.find(
            (c) => c.name === "Lottery"
          );

          // ✅ find Kerala Lottery tab
          const keralaTab = lotteryCategory?.tabs?.find(
            (t) => t.key === "keralalottery"
          );

          const apiItems = keralaTab?.items || [];

          // ✅ format UI data
          const formatted = apiItems.map((item) => ({
            id: item.id, // ✅ IMPORTANT (gameId)
            name: item.name,
            number: item.nav || item.name,
            price: item.price,
            drawTime: item.start_date
              ? new Date(item.start_date).toLocaleString()
              : "Coming Soon",
            img: item.img,
          }));

          setItems(formatted);
        }
      } catch (err) {
        console.error("Home API error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading lotteries...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-5 bg-green-500 rounded-sm" />
        <h2 className="font-bold text-gray-800 text-lg">
          Kerala State Lottery
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/kerala-lottery/${item.id}`)} // ✅ gameId
            className="rounded-sm overflow-hidden bg-white shadow-sm cursor-pointer"
          >
            {/* IMAGE */}
            <div
              className="h-[140px]"
              style={{
                backgroundImage: `url(${item.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* CONTENT */}
            <div className="px-2 py-2 flex justify-between items-center text-xs">
              <div>
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-[10px] text-gray-500">
                  {item.number}
                </p>
              </div>

              <div className="text-right text-gray-500">
                <p>₹{item.price || "50"}</p>
                <p className="text-[10px]">
                  {item.drawTime}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center mt-6">
        Tap any lottery to view details & buy tickets
      </p>
    </div>
  );
}

export default KeralaLotteryList;