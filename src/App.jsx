import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { BottomNav } from "./components/BottomNav";
import HomePage from "./pages/HomePage";
import DiceGame from "./games/DiceGame";
import InviteFriends from "./pages/EarnMoney";
import PromotionScreen from "./pages/PromotionScreen";
import PlayerProfileScreen from "./pages/PlayerProfileScreen";
import Profile from "./pages/Profile";
import RechargeListScreen from "./pages/RechargeListScreen";

import SplashScreen from "./Splash";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignScreen";

import AgencyCenter from "./pages/AgencyCenter";
import ResultHistory from "./pages/ResultHistory";
import MyTransaction from "./pages/MyTransaction";
import MyCommission from "./pages/MyCommission";
import NotificationScreen from "./pages/NotificationScreen";
import PasswordSetScreen from "./pages/PasswordSetScreen";
import CustomerSupport from "./pages/CustomerSupport";
import ChatDetailScreen from "./components/ChatDetailScreen";
import { App as CapacitorApp } from "@capacitor/app";
import RechargeScreen from "./pages/RechargeScreen";
import ColorPrediction from "./games/ColorPrediction";
import RulesScreen from "./pages/RulesScreen";
import ForgetPassword from "./pages/ForgetPassword";
import WithdrawScreen from "./pages/WithdrawScreen";
import TransferScreen from "./pages/TransferScreen";
import TransferRecordScreen from "./pages/TransferRecordScreen";
import MyBets from "./pages/MyBets";
import SearchScreen from "./pages/SearchScreen";
import PasswordChangeScreen from "./pages/PasswordChangeScreen";
import RechargeRecords from "./pages/RechargeRecords";
import Maintenance from "./pages/Maintaincemode";
import WalletScreen from "./pages/WalletScreen";
import AddbankAccount from "./pages/AddbankAccount";
import StateLotteryGrid from "./games/StateLotteryGrid";
import StateLotteryScreen from "./games/StateLotteryScreen";
import StateLotteryGridWrapper from "./games/StateLotteryGridWrapper";
import KeralaLotteryList, { KeralaLotteryDetail } from "./games/KeralaLotteryCard";
import SattaMatkaList, { SattaMatkaDetail } from "./games/SattaMatkaGame";
import ThreeDigitList, { ThreeDigitDetail } from "./games/ThreeDigit";
import WithdrawHistory from "./pages/WithdrawalHistory";
import JackPotScreen from "./pages/JackPotScreen";
import LanguageListScreen from "./pages/LanguageListScreen";
import InviteRecord from "./pages/InviteRecord";
import HotmatchesScreen from "./pages/HotmatchesScreen";
import WeeklySignIn from "./pages/WeeklySignIn";
import PromoEventDetails from "./pages/PromoEventDetails";
import MeetThreeScreeen from "./pages/MeetThreeScreeen";
import CommingSoon from "./pages/commingSoon";
import BonusClainHIstory from "./pages/BonusClainHIstory";
import ScratchFullScreen from "./pages/ScratchCard";
import QuickRaceGame from "./games/QuickRaceGame";
// ─── APP WRAPPER ─────────────────
function AppWrapper() {
  const location = useLocation();
  const { pathname } = location;
  const [navActive, setNavActive] = useState("home");
  useEffect(() => {
    document.title = "AKR Games";
    const storedUser = localStorage.getItem("user");

  }, []);
  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  // Bottom nav active state
  const pathToNav = {
    "/": "home",
    "/dice": "dice",
    "/earn": "earn",
    "/promo": "promo",
    "/profile": "profile",
  };


  useEffect(() => {
    setNavActive(pathToNav[pathname] || "home");
  }, [pathname]);

  // 🔥 BACK BUTTON FIX (FINAL)
  useEffect(() => {
    const handler = CapacitorApp.addListener("backButton", () => {
      if (window.history.state?.idx > 0) {
        window.history.back();
      } else {
        CapacitorApp.exitApp();
      }
    });

    return () => handler.remove();
  }, []);
  useEffect(() => {
    document.title = "AKR Games";
    const storedUser = localStorage.getItem("user");
  }, []);
  const storedUser = localStorage.getItem("user");
  const showBottomNavRoutes = [
    "/",
    "/earn",
    ...(!storedUser ? ["/promo"] : []),
    "/profile",
  ];
  // 🌐 NETWORK STATE
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [toast, setToast] = useState("");

  // 🌐 NETWORK LISTENER
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast("Back online", "success");
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast("No internet connection", "error", true);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 🔥 TOAST FUNCTION
  const showToast = (message, type = "success", persist = false) => {
    setToast({ message, type, persist });
    if (!persist) {
      setTimeout(() => {
        setToast(null);
      }, 2000);
    }
  };
  return (
    <div className="min-h-screen flex justify-center ">
      <div className="relative w-full max-w-[430px] min-h-screen flex flex-col bg-white shadow-lg bg-black">
        <div className="flex-1 overflow-y-auto 
        ">
          {toast && (
            <div
              className={`fixed top-[8%] left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300 ${toast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
                }`}
            >
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white shadow-xl backdrop-blur-md ${toast.type === "error"
                  ? "bg-red-500/90"
                  : "bg-green-500/90"
                  }`}
              >
                <span className="text-lg">
                  {toast.type === "error" ? "⚠️" : "✔️"}
                </span>

                {/* MESSAGE */}
                <span className="font-medium">{toast.message}</span>
              </div>
            </div>
          )}
          <Routes>
          <Route path="/quickrace" element={<PrivateRoute><QuickRaceGame /></PrivateRoute>} />
            <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
            <Route path="/dice/:key" element={<PrivateRoute><DiceGame /></PrivateRoute>} />
            {/* <Route path="/dice" element={<PrivateRoute><DiceGame /></PrivateRoute>} /> */}
            <Route path="/AddbankAccount" element={<PrivateRoute><AddbankAccount /></PrivateRoute>} />
            <Route path="/color" element={<PrivateRoute><ColorPrediction /></PrivateRoute>} />
            <Route path="/earn" element={<PrivateRoute><InviteFriends /></PrivateRoute>} />
            <Route path="/promo" element={<PrivateRoute><PromotionScreen /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

            <Route path="/bonusclainhist" element={<PrivateRoute><BonusClainHIstory /></PrivateRoute>} />
            <Route path="/comingsoon" element={<PrivateRoute><CommingSoon /></PrivateRoute>} />
            <Route path="/meetthreescreen" element={<PrivateRoute><MeetThreeScreeen /></PrivateRoute>} />
            <Route path="/PlayerProfileScreen" element={<PrivateRoute><PlayerProfileScreen /></PrivateRoute>} />
            <Route path="/Recharge" element={<PrivateRoute><RechargeListScreen /></PrivateRoute>} />
            <Route path="/payRecharge" element={<PrivateRoute><RechargeScreen /></PrivateRoute>} />
            <Route path="/WithdrawScreen" element={<PrivateRoute><WithdrawScreen /></PrivateRoute>} />
            <Route path="/MyBets" element={<PrivateRoute><MyBets /></PrivateRoute>} />
            <Route path="/SearchScreen" element={<PrivateRoute><SearchScreen /></PrivateRoute>} />
            <Route path="/TransferScreen" element={<PrivateRoute><TransferScreen /></PrivateRoute>} />
            <Route path="/TransferRecordScreen" element={<PrivateRoute><TransferRecordScreen /></PrivateRoute>} />
            <Route path="/withdrawhistory" element={<PrivateRoute><WithdrawHistory /></PrivateRoute>} />
            {/* JackPotScreen */}
            <Route path="/jackPotScreen" element={<PrivateRoute><JackPotScreen /></PrivateRoute>} />
            <Route path="/scratch" element={<PrivateRoute><ScratchFullScreen /></PrivateRoute>} />
            <Route path="/hotmatchscreen" element={<PrivateRoute><HotmatchesScreen /></PrivateRoute>} />

            <Route path="/invitationRecord" element={<PrivateRoute><InviteRecord /></PrivateRoute>} />
            <Route path="/langscreen" element={<PrivateRoute><LanguageListScreen /></PrivateRoute>} />
            <Route path="/AgencyCenter" element={<PrivateRoute><AgencyCenter /></PrivateRoute>} />
            <Route path="/MyTransaction" element={<PrivateRoute><MyTransaction /></PrivateRoute>} />
            <Route path="/ResultHistory" element={<PrivateRoute><ResultHistory /></PrivateRoute>} />
            <Route path="/MyCommission" element={<PrivateRoute><MyCommission /></PrivateRoute>} />
            <Route path="/rechargRecords" element={<PrivateRoute><RechargeRecords /></PrivateRoute>} />
            {/* rechargRecords */}
            <Route path="/WalletScreen" element={<PrivateRoute><WalletScreen /></PrivateRoute>} />
            <Route path="/weeklysignup" element={<PrivateRoute><WeeklySignIn /></PrivateRoute>} />

            <Route path="/eventdetails" element={<PrivateRoute><PromoEventDetails /></PrivateRoute>} />
            <Route path="/Maintenance" element={<PrivateRoute><Maintenance /></PrivateRoute>} />
            <Route path="/PasswordChangeScreen" element={<PrivateRoute><PasswordChangeScreen /></PrivateRoute>} />
            <Route path="/NotificationScreen" element={<PrivateRoute><NotificationScreen /></PrivateRoute>} />
            <Route path="/PasswordSetScreen" element={<PrivateRoute><PasswordSetScreen /></PrivateRoute>} />
            <Route path="/CustomerSupport" element={<PrivateRoute><CustomerSupport /></PrivateRoute>} />
            <Route path="/ChatDetailScreen" element={<PrivateRoute><ChatDetailScreen /></PrivateRoute>} />
            <Route path="/RulesScreeen" element={<PrivateRoute><RulesScreen /></PrivateRoute>} />
            {/*  */}
            <Route path="/ForgetPassword" element={<PrivateRoute><ForgetPassword /></PrivateRoute>} />
            {/* Public */}
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Sign" element={<SignUpPage />} />

            <Route
              path="/state-lottery"
              element={
                <PrivateRoute>
                  <StateLotteryGridWrapper />
                </PrivateRoute>
              }
            />
            <Route
              path="/state-lottery/:id"
              element={
                <PrivateRoute>
                  <StateLotteryScreen />
                </PrivateRoute>
              }
            />
            <Route path="/threedigit" element={<PrivateRoute><ThreeDigitList /></PrivateRoute>} />
            <Route path="/threedigit/:id" element={<PrivateRoute><ThreeDigitDetail /></PrivateRoute>} />
            <Route path="/matka" element={<PrivateRoute><SattaMatkaList /></PrivateRoute>} />
            <Route path="/matka/:id" element={<PrivateRoute><SattaMatkaDetail /></PrivateRoute>} />
            <Route path="/kerala-lottery" element={<PrivateRoute><KeralaLotteryList /></PrivateRoute>} />
            <Route path="/kerala-lottery/:id" element={<PrivateRoute><KeralaLotteryDetail /></PrivateRoute>} />
          </Routes>
        </div>
        {showBottomNavRoutes.includes(pathname) && (
          <BottomNav active={navActive} onChange={setNavActive} />
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────
export default function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);
  return (
    <Router>
      {loading ? <SplashScreen /> : <AppWrapper />}
    </Router>
  );
}