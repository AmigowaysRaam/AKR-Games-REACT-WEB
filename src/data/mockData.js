// ─── BANNERS ──────────────────────────────────────────────────────────────────
export const banners = [
  {
    id: 1,
    title: "IPL 2026 LIVE",
    subtitle: "Bet on every ball. Win every moment.",
    badge: "LIVE NOW",
    badgeColor: "bg-red-500",
    gradient: "from-violet-900 via-purple-800 to-pink-700",
    accent: "#f472b6",
    emoji: "🏏",
    tag: "Cricket",
  },
  {
    id: 2,
    title: "WIN ₹75 LAKHS",
    subtitle: "Kerala Lottery — Today 3:00 PM Draw",
    badge: "TODAY",
    badgeColor: "bg-amber-500",
    gradient: "from-emerald-900 via-teal-800 to-cyan-700",
    accent: "#34d399",
    emoji: "🎟️",
    tag: "Kerala Lottery",
  },
  {
    id: 3,
    title: "COLOR PREDICTION",
    subtitle: "Green • Red • Violet — Round every 1 minute",
    badge: "HOT",
    badgeColor: "bg-orange-500",
    gradient: "from-rose-900 via-red-800 to-orange-700",
    accent: "#fb923c",
    emoji: "🎨",
    tag: "Color Game",
  },
  {
    id: 4,
    title: "SATTA MATKA",
    subtitle: "Kalyan • Milan • Rajdhani Markets Open",
    badge: "OPEN",
    badgeColor: "bg-blue-500",
    gradient: "from-blue-900 via-indigo-800 to-violet-700",
    accent: "#818cf8",
    emoji: "🎯",
    tag: "Matka",
  },
  {
    id: 5,
    title: "REFER & EARN",
    subtitle: "Invite friends. Get ₹100 per referral instantly.",
    badge: "BONUS",
    badgeColor: "bg-yellow-500",
    gradient: "from-yellow-900 via-amber-800 to-orange-700",
    accent: "#fbbf24",
    emoji: "💰",
    tag: "Offer",
  },
];

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
export const categories = [
  { id: 1, label: "Lottery",  emoji: "🎟️", color: "from-violet-600 to-purple-700",  glow: "#7c3aed" },
  { id: 2, label: "Casino",   emoji: "🎰", color: "from-rose-600 to-pink-700",       glow: "#e11d48" },
  { id: 3, label: "Live",     emoji: "📡", color: "from-red-600 to-orange-600",      glow: "#dc2626" },
  { id: 4, label: "Scratch",  emoji: "🪙", color: "from-amber-500 to-yellow-600",    glow: "#d97706" },
  { id: 5, label: "Sports",   emoji: "⚽", color: "from-emerald-600 to-teal-700",    glow: "#059669" },
];

// ─── SUB TABS ────────────────────────────────────────────────────────────────
export const subTabs = [
  { id: "hot",     label: "🔥 Hot Matches" },
  { id: "dice",    label: "🎲 Dice" },
  { id: "color",   label: "🎨 Color" },
  { id: "3digit",  label: "🔢 3Digits" },
  { id: "lottery", label: "🎟️ State Lottery" },
  { id: "matka",   label: "🎯 Matka" },
  { id: "ipl",     label: "🏏 IPL" },
];

// ─── HOT MATCHES ──────────────────────────────────────────────────────────────
export const hotMatches = [
  {
    id: 1,
    status: "LIVE",
    league: "IPL 2026",
    team1: { name: "CSK", short: "CSK", score: "186/4", overs: "18.2", emoji: "🦁" },
    team2: { name: "MI",  short: "MI",  score: "142/6", overs: "16.0", emoji: "🦅" },
    outcomes: 24,
    time: "LIVE",
    popularity: 98,
  },
  {
    id: 2,
    status: "LIVE",
    league: "IPL 2026",
    team1: { name: "RCB", short: "RCB", score: "201/3", overs: "20.0", emoji: "🔴" },
    team2: { name: "KKR", short: "KKR", score: "67/2",  overs: "8.4",  emoji: "🟣" },
    outcomes: 18,
    time: "LIVE",
    popularity: 87,
  },
  {
    id: 3,
    status: "UPCOMING",
    league: "IPL 2026",
    team1: { name: "SRH", short: "SRH", score: "—", overs: "—", emoji: "🟠" },
    team2: { name: "DC",  short: "DC",  score: "—", overs: "—", emoji: "🔵" },
    outcomes: 12,
    time: "7:30 PM",
    popularity: 72,
  },
  {
    id: 4,
    status: "UPCOMING",
    league: "IPL 2026",
    team1: { name: "GT",   short: "GT",  score: "—", overs: "—", emoji: "🔷" },
    team2: { name: "PBKS", short: "PBKS",score: "—", overs: "—", emoji: "🔴" },
    outcomes: 15,
    time: "Tomorrow 3:30 PM",
    popularity: 65,
  },
];

// ─── DICE GAMES ───────────────────────────────────────────────────────────────
export const diceGames = [
  {
    id: 1,
    duration: "1 Min",
    label: "DICE",
    sublabel: "Fast & Furious",
    gradient: "from-orange-500 via-red-500 to-rose-600",
    shadowColor: "rgba(239,68,68,0.4)",
    players: "12.4K",
    maxWin: "150X",
    emoji: "🎲",
  },
  {
    id: 2,
    duration: "3 Min",
    label: "DICE",
    sublabel: "Classic Mode",
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    shadowColor: "rgba(20,184,166,0.4)",
    players: "8.1K",
    maxWin: "150X",
    emoji: "🎲",
  },
  {
    id: 3,
    duration: "5 Min",
    label: "DICE",
    sublabel: "Pro Mode",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-600",
    shadowColor: "rgba(139,92,246,0.4)",
    players: "5.2K",
    maxWin: "150X",
    emoji: "🎲",
  },
];

// ─── COLOR GAMES ──────────────────────────────────────────────────────────────
export const colorGames = [
  {
    id: 1,
    duration: "1 Min",
    label: "COLOR",
    sublabel: "Win Go",
    gradient: "from-pink-500 via-rose-500 to-red-500",
    shadowColor: "rgba(244,63,94,0.4)",
    players: "18.7K",
    maxWin: "9X",
    emoji: "🎨",
    colors: ["#ef4444","#22c55e","#a855f7"],
  },
  // {
  //   id: 2,
  //   duration: "3 Min",
  //   label: "COLOR",
  //   sublabel: "Win Go",
  //   gradient: "from-blue-500 via-indigo-500 to-violet-500",
  //   shadowColor: "rgba(99,102,241,0.4)",
  //   players: "9.3K",
  //   maxWin: "9X",
  //   emoji: "🎨",
  //   colors: ["#ef4444","#22c55e","#a855f7"],
  // },
];

// ─── STATE LOTTERY ────────────────────────────────────────────────────────────
export const stateLotteries = [
  { id: 1, name: "Win-Win",       drawTime: "3:00 PM", day: "Monday",    prize: "₹75 Lakh",  tickets: "2,341", color: "from-violet-600 to-purple-700" },
  { id: 2, name: "Sthree Sakthi",drawTime: "3:00 PM", day: "Tuesday",   prize: "₹75 Lakh",  tickets: "1,892", color: "from-pink-600 to-rose-700"     },
  { id: 3, name: "Fifty Fifty",  drawTime: "3:00 PM", day: "Wednesday", prize: "₹1 Crore",  tickets: "3,104", color: "from-amber-600 to-orange-700"  },
  { id: 4, name: "Karunya Plus", drawTime: "3:00 PM", day: "Thursday",  prize: "₹80 Lakh",  tickets: "1,654", color: "from-emerald-600 to-teal-700"  },
  { id: 5, name: "Nirmal",       drawTime: "3:00 PM", day: "Friday",    prize: "₹70 Lakh",  tickets: "2,210", color: "from-blue-600 to-indigo-700"   },
  { id: 6, name: "Karunya",      drawTime: "3:00 PM", day: "Saturday",  prize: "₹80 Lakh",  tickets: "1,876", color: "from-rose-600 to-red-700"      },
];

// ─── PROMOTIONS (Marquee) ─────────────────────────────────────────────────────
export const promotions = [
  "🎉 Welcome Bonus: 100% on first deposit up to ₹500",
  "🏆 IPL Special: Predict winner — Win ₹10,000",
  "💰 Daily Check-in Bonus: Earn up to ₹50/day",
  "🎯 Refer a Friend: Get ₹100 per successful referral",
  "🃏 New Game: Satta Matka — Up to 10,000X payout",
];

// ─── BOTTOM NAV ITEMS ─────────────────────────────────────────────────────────
export const navItems = [
  { id: "home",       label: "Home",       emoji: "🏠", isCenter: false },
  { id: "earn",       label: "Earn",       emoji: "💰", isCenter: false },
  { id: "center",     label: "",           emoji: "🎲", isCenter: true  },
  { id: "promo",      label: "Promo",      emoji: "🎁", isCenter: false },
  { id: "profile",    label: "Profile",    emoji: "👤", isCenter: false },
];
