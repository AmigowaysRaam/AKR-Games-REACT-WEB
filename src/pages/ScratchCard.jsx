import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, InfoIcon, StarIcon } from "lucide-react";
import Confetti from "react-confetti";
import RewardTabs from "./ScratchTabScreen";
import { getPlayResult, getScratchData } from "../services/authService";
import GameLoader from "../../src/pages/LoaderComponet";
import GoldenProgressBar from "./ScratchProgress";
import RulesModal from "./ScratchRules";
export default function ScratchFullScreen() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0);
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
  const [showInfo, setshowInfo] = useState(false);
  useEffect(() => {
    if (timeLeft === 0 && apiData && !apiData?.play_enabled) {
      generateGame();
    }
  }, [timeLeft]);

  useEffect(() => {
    const ms = apiData?.next_card_in_ms || 0;
    setTimeLeft(Math.floor(ms / 1000)); // convert to seconds
  }, [apiData]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);
  useEffect(() => {
    resultAudioRef.current = new Audio("/sounds/success.mp3");
    generateGame();
  }, []);
  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };
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
      setTimeout(() => setShowConfetti(false), 3000);
    }, 500);
  };

  const shareLink = async () => {

  }

  // const handleShareLink = async () => {
  //   const url = `${window.location.origin}/Sign?ref=${data.referral_code}`;
  //   const shareData = {
  //     title: "Join me on AKR Lottery!",
  //     text: `Use my invite code ${data?.referral_code}`,
  //     url,
  //   };
  //   if (navigator.share) {
  //     try {
  //       await navigator.share(shareData);
  //       showToast("Shared successfully!", "success");
  //       return;
  //     } catch (err) {
  //     }
  //   }
  //   if (navigator.clipboard && window.isSecureContext) {
  //     try {
  //       await navigator.clipboard.writeText(data?.referral_code);
  //       showToast("Link copied!", "success");
  //       return;
  //     } catch (err) {

  //     }
  //   }
  //   try {
  //     const textarea = document.createElement("textarea");
  //     textarea.value = url;
  //     textarea.style.position = "fixed"; // avoid scroll
  //     textarea.style.opacity = "0";
  //     document.body.appendChild(textarea);
  //     textarea.focus();
  //     textarea.select();

  //     document.execCommand("copy");
  //     document.body.removeChild(textarea);

  //     showToast("Link copied!", "success");
  //   } catch (err) {
  //     showToast("Failed to copy link", "error");
  //   }
  // };

  const rewards =
    apiData?.cells?.length === 9 ? apiData.cells : Array(9).fill(0);


  const rewardRecords =
    apiData?.reward_record?.map((item, i) => ({
      id: i,
      phone: item.phone,
      time: item.created_at,
      amount: Number(item.reward),
    })) || [];

  const rewardGuide =
    apiData?.reward_guide?.map((item, i) => ({
      id: i,
      title: item.phone || "Guide",
      desc: item.reward || "",
      date: item.created_at || "",
    })) || [];
  return (
    <div
      className="max-w-md mx-auto min-h-screen text-white relative"
      style={{
        backgroundImage:
          "url('https://www.akrlottery.com/assets/images/bg.jpg')",
      }}
    >
      {loading && <GameLoader />}
      {showConfetti && <Confetti />}
      {showWinToast && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-2xl p-6 text-center w-[85%] max-w-sm animate-scaleIn shadow-2xl">
            <h2 className="text-2xl font-bold mb-2 text-green-600">
              🎉 Congratulations!
            </h2>
            <p className="text-lg mb-4">
              You won <span className="font-bold">₹{winAmount}</span>
            </p>
            <button
              onClick={() => { setShowWinToast(!showWinToast), generateGame() }}
              className="bg-violet-600 text-white px-5 py-2 rounded-lg active:scale-95 transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      {Number(apiData?.total) == 200 && (
        <div className="fixed inset-0 bg-black/80  flex items-center justify-center z-50">
          <div className="relative w-[85%] max-w-sm rounded-2xl p-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 animate-borderGlow">
            <div className="bg-gradient-to-br from-[#1a1f4a] to-[#0b0f2a] text-white rounded-2xl p-6 text-center animate-scaleIn shadow-2xl backdrop-blur-lg">
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-300 to-pink-400 text-transparent bg-clip-text animate-pulse">
                🎉 Congratulations!
              </h2>
              <p className="text-lg mb-4 text-gray-200">
                You Completed{" "}
                <span className="font-bold text-yellow-300 text-xl">
                  ₹{Number(apiData?.total)}
                </span>
              </p>
              <button
                onClick={() => navigate(-1)}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg active:scale-95 transition hover:opacity-90"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between p-3 mx-2">
        <ChevronLeft
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <InfoIcon
          className="cursor-pointer"
          onClick={() => setshowInfo(!showInfo)}
        />

      </div>
      <RulesModal rulesD={apiData?.rules} open={showInfo} onClose={() => setshowInfo(false)} />
      {
        apiData?.progress_percent && (
          <GoldenProgressBar progresspercent={apiData?.progress_percent} />
        )
      }
      <div
        className="p-8 w-full min-h-[500px] flex flex-col justify-between text-center"
        style={{
          backgroundImage:
            "url('https://www.akrlottery.com/assets/images/ticket%20%20-%2003.png')",
          backgroundSize: "cover",
          position: "relative",
        }}
      >
        <div className="inline-block px-1 py-1 font-bold text-white bg-gradient-to-r from-red-400 via-indigo-600 to-red-400 rounded-full shadow-xl">
          <span className="text-[18px] animate-pulse">
            {apiData?.near_message}
          </span>
        </div>
        <div className="flex justify-center mt-2">
          <div className="relative px-5 py-2 rounded-full bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 shadow-lg">
            <div className="absolute inset-0 rounded-full blur-md opacity-40 bg-yellow-400 animate-pulse"></div>
            <div className="relative flex items-center gap-2 text-black font-bold text-lg">
              <span className="text-sm opacity-70">Total</span>
              <span className="text-xl">₹{Number(apiData?.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 m-7">
          {rewards?.map((val, i) => (
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
        <div className="flex gap-2 mx-[10%] mt-4">
          <button onClick={shareLink} className="w-[150px] bg-orange-400 text-black py-3 rounded-lg">
            Share to
          </button>
          {
            apiData?.play_enabled ?
              <button
                onClick={handlePlay}
                disabled={gamePlayed || isPlaying}
                className={`w-[150px] rounded-lg transition-all duration-300
              ${gamePlayed ? "bg-gray-400" : "bg-violet-500 active:scale-95"}
            `}
              >
                {isPlaying ? "SCRATCHING..." : "PLAY"}
                <span className="ml-2 text-sm">
                  {` x${apiData?.card_count}`}
                </span>
              </button>
              :
              <button
                className={`w-[150px] rounded-lg transition-all duration-300
            ${"bg-gray-400"}
          `}
              >
                <span className="ml-2 text-sm">
                  Next card in <br />
                  {formatTime(timeLeft)}
                </span>
              </button>
          }

        </div>
      </div>
      <RewardTabs
        rewardRecords={rewardRecords}
        rewardGuide={rewardGuide}
      />
    </div>
  );
}