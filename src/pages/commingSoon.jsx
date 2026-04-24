import { useNavigate } from "react-router-dom";
import { ChevronLeft, Headphones, Sparkles } from "lucide-react";

export default function CommingSoon() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full flex flex-col items-center overflow-hidden relative
      bg-gradient-to-br from-purple-500 via-blue-500 to-pink-600 animate-gradient">

      {/* Gradient Animation Style */}
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradientMove 6s ease infinite;
          }

          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(8deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }

          @keyframes fadeUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          .float-anim {
            animation: float 3s ease-in-out infinite;
          }

          .fade-up {
            animation: fadeUp 0.8s ease forwards;
          }
        `}
      </style>

      {/* Header */}
      <div className="w-full max-w-[430px] flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md shadow-sm z-10">
        <ChevronLeft onClick={() => navigate(-1)} className="cursor-pointer" />
        <span className="font-semibold text-gray-800">Coming Soon</span>
        <Headphones
          onClick={() => navigate("/CustomerSupport")}
          className="cursor-pointer"
        />
      </div>

      {/* Content */}
      <div className="w-full max-w-[430px] flex flex-1 flex-col items-center justify-center px-6 text-white text-center relative z-10">

        {/* Glow Background Circle */}
        <div className="absolute w-40 h-40 bg-white/10 blur-3xl rounded-full"></div>

        {/* Icon */}
        <div className="bg-white/20 p-6 rounded-full shadow-xl float-anim fade-up">
          <Sparkles size={42} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mt-6 fade-up" style={{ animationDelay: "0.2s" }}>
          Something Exciting is Coming 🚀
        </h1>

        {/* Subtitle */}
        <p
          className="text-sm opacity-90 mt-2 leading-relaxed fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          We're working hard to bring this feature to you.
          Stay tuned for updates and amazing rewards!
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 rounded-full bg-white text-pink-600 font-semibold shadow-lg
          hover:shadow-2xl hover:scale-105 active:scale-95 transition fade-up"
          style={{ animationDelay: "0.6s" }}
        >
          Back to Home
        </button>

        {/* Footer */}
        <p
          className="text-xs opacity-70 mt-6 fade-up"
          style={{ animationDelay: "0.8s" }}
        >
          📢 You’ll be notified once it's live!
        </p>
      </div>
    </div>
  );
}