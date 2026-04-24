import { useNavigate } from "react-router-dom";
import { ChevronLeft, Headphones } from "lucide-react";
import { useEffect, useState } from "react";
import { getmeetthreeDetails } from "../services/authService";
import GameLoader from "./LoaderComponet";
export default function MeetThreeScreeen() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const fetchEarning = async () => {
    try {
      setLoading(true);
      const res = await getmeetthreeDetails({
        userId: JSON.parse(localStorage.getItem("user"))?.id,
      });
      // alert(JSON.stringify(res?.image));
      if (res?.success) {
        setApiData(res);
      }
    } catch (err) {
      console.log(err);
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarning();
  }, []);
  if (loading) return <GameLoader />;
  const bgImage =
    apiData?.image 
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center scale-100 blur-sm brightness-45"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="relative w-full flex flex-col items-center">
        <div className="w-full max-w-[430px] flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md shadow-sm">
          <ChevronLeft onClick={() => navigate(-1)} className="cursor-pointer" />
          <span className="font-semibold text-gray-800">
            {apiData?.event?.title || "Meet 3"}
          </span>
          <Headphones
            onClick={() => navigate("/CustomerSupport")}
            className="cursor-pointer"
          />
        </div>
        <div className="w-full max-w-[430px] flex flex-col flex-1 px-4 text-white">
          <div className="space-y-4 mt-2">
            <div className="text-center">
              <p className="text-sm opacity-90">
                {apiData?.event?.subtitle || "Recharge and get gifts"}
              </p>
            </div>
            <div className="flex justify-center">
              <div className="bg-white/20 px-4 py-1 rounded-full text-xs">
                Every Month
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src={bgImage}
                alt="Recharge"
                className="w-100 h-40 rounded-xl shadow-lg object-cover"
              />
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center text-xs">
              🎉 {apiData?.event?.banner || "Recharge on special days and earn extra rewards!"}
            </div>
          </div>
          <div className="mt-4 flex-1 flex flex-col">
            <div className="bg-white/15 rounded-2xl p-4 shadow-lg flex flex-col flex-1">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-3">
                  <span>Recharge</span>
                  <span>Bonus</span>
                </div>

                <div className="space-y-2">
                  {(apiData?.slabs || []).map((row, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-sm py-3 px-3 bg-white/10 rounded-lg"
                    >
                      <span className="text-[16px]">{row?.range}</span>
                      <span className="font-semibold text-[19px]">
                        {row?.percent}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-auto pt-4">
                <p className="text-xs text-center opacity-80 mb-3">
                  {apiData?.terms?.length
                    ? apiData.terms.join(" ")
                    : "Only normal game players can participate. Malicious activity will cancel rewards."}
                </p>
                <button
                  disabled={!apiData?.button?.can_join}
                  onClick={() => {
                    if (apiData?.button?.can_join) {
                      navigate("/payRecharge");
                    }
                  }}
                  className={`w-full py-3 rounded-full text-white font-semibold shadow-xl active:scale-95 transition ${apiData?.button?.can_join
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                    : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                  {apiData?.button?.text || "Join Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}