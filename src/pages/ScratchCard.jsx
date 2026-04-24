import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, StarIcon } from "lucide-react";
import Confetti from "react-confetti";
import RewardTabs from "./ScratchTabScreen";
import { getPlayResult, getScratchData } from "../services/authService";
import GameLoader from "../../src/pages/LoaderComponet";

export default function ScratchFullScreen() {
  const navigate = useNavigate();

  const [balance, setBalance] = useState(0);
  const [revealed, setRevealed] = useState(Array(9).fill(false));
  const [winIndex, setWinIndex] = useState(null);
  const [winAmount, setWinAmount] = useState(0);
  const [gamePlayed, setGamePlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showWinToast, setShowWinToast] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  const resultAudioRef = useRef(null);

  useEffect(() => {
    resultAudioRef.current = new Audio("/sounds/resultAudio.mp3");
    generateGame();
  }, []);

  const generateGame = async () => {
    setLoading(true);
    try {
      const res = await getScratchData();
      if (res?.success) setApiData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }

    setRevealed(Array(9).fill(false));
    setGamePlayed(false);
    setIsPlaying(false);
    setShowWinToast(false);
    setWinIndex(null);
  };

  // 🎯 PLAY
  const handlePlay = async () => {
    if (gamePlayed || isPlaying) return;

    setIsPlaying(true);
    setLoading(true);

    let result;
    try {
      result = await getPlayResult();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }

    const reward = result?.reward || 0;
    const randomIndex = Math.floor(Math.random() * 9);

    setWinIndex(randomIndex);

    setTimeout(() => {
      setRevealed((prev) => {
        const updated = [...prev];
        updated[randomIndex] = true;
        return updated;
      });

      setWinAmount(reward);
      setBalance((p) => p + reward);

      setShowConfetti(true);
      setShowWinToast(true);
      setGamePlayed(true);
      setIsPlaying(false);

      if (result) {
        setApiData((prev) => ({
          ...prev,
          remaining: result.remaining,
          progress_percent: result.progress_percent,
          near_message: result.near_message,
        }));
      }

      resultAudioRef.current?.play().catch(() => { });

      // auto hide confetti
      setTimeout(() => setShowConfetti(false), 3000);

      // 🚀 AUTO NAVIGATE AFTER 4s
      setTimeout(() => {
        navigate(-1);
      }, 4000);

    }, 500);
  };

  const rewards =
    apiData?.cells?.length === 9 ? apiData.cells : Array(9).fill(0);

  const formatTime = (ms) => {
    if (!ms) return "--";
    return new Date(Number(ms)).toLocaleString();
  };

  const rewardRecords =
    apiData?.reward_record?.map((item, i) => ({
      id: i,
      phone: item.phone,
      time: formatTime(item.created_at),
      amount: Number(item.reward),
    })) || [];

  const rewardGuide =
    apiData?.reward_guide?.map((item, i) => ({
      id: i,
      title: item.title || "Guide",
      desc: item.desc || "",
    })) || [];

  return (
    <div
      className="max-w-md mx-auto min-h-screen text-white bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://www.akrlottery.com/assets/images/bg.jpg')",
      }}
    >
      {loading && <GameLoader />}
      {showConfetti && <Confetti />}

      {/* 🔥 WIN TOAST (FULL SCREEN) */}
      {showWinToast && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-2xl p-6 text-center w-[85%] animate-scaleIn shadow-2xl">
            <h2 className="text-2xl font-bold mb-2 text-green-600">
              🎉 Congratulations!
            </h2>

            <p className="text-lg mb-4">
              You won <span className="font-bold">₹{winAmount}</span>
            </p>

            <button
              onClick={() => navigate(-1)}
              className="bg-violet-600 text-white px-5 py-2 rounded-lg active:scale-95"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* BACK */}
      <div className="p-3">
        <ChevronLeft className="cursor-pointer" onClick={() => navigate(-1)} />
      </div>

      {/* API INFO */}
      {apiData && (
        <div className="text-center text-sm mb-2">
          <p>Cards: {apiData.card_count}</p>
          <p>Next Card: {apiData.next_card_in}</p>
          <p className="text-yellow-300 font-bold">{apiData.near_message}</p>
        </div>
      )}

      {/* GAME */}
      <div
        className="p-6 rounded-2xl w-full min-h-[520px] flex flex-col justify-between text-center"
        style={{
          backgroundImage:
            "url('https://www.akrlottery.com/assets/images/ticket%20%20-%2003.png')",
          backgroundSize: "cover",
        }}
      >
        {/* HEADER */}
        <div className="inline-block px-1 py-1 font-bold text-white bg-gradient-to-r from-red-400 via-indigo-600 to-red-400 rounded-full shadow-xl">
          <span className="text-[25px]">
            WIN UPTO ₹{apiData?.remaining || 200}
          </span>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-5 m-7">
          {rewards.map((val, i) => (
            <div
              key={i}
              className={`h-17 rounded-xl flex items-center justify-center text-lg transition-all duration-300 relative top-10
              ${!revealed[i]
                  ? "bg-green-800"
                  : "bg-yellow-400 text-black scale-110"
                }
              ${isPlaying ? "animate-pulse" : ""}`}
            >
              {!revealed[i] ? (
                <StarIcon className="animate-pulse" />
              ) : i === winIndex ? (
                <span className="font-bold text-xl animate-bounce">
                  ₹{winAmount}
                </span>
              ) : (
                "❌"
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4 relative left-8">
          <button className="w-[150px] bg-orange-400 text-black py-3 rounded-lg">
            Share to
          </button>
          <button
            onClick={handlePlay}
            disabled={gamePlayed || isPlaying}
            className={`w-[150px] rounded-lg transition-all duration-300
              ${gamePlayed ? "bg-gray-400" : "bg-violet-500 active:scale-95"}
            `}
          >
            {isPlaying ? "SCRATCHING..." : "PLAY"}
          </button>
        </div>
      </div>
      <RewardTabs
        rewardRecords={rewardRecords}
        rewardGuide={rewardGuide}
      />
    </div>
  );
}