import { ChevronLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLangList } from "../services/authService";

export default function LanguageListScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("en");
  const [pressedId, setPressedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [languages, setLanguages] = useState([]);
  useEffect(() => {
    const saved = localStorage.getItem("app_language");
    if (saved) setSelected(saved);
  }, []);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const res = await getLangList({
          id: user?.id,
        });

        // 🔥 EXPECTING: res.languages or res.data
        const apiLangs = res?.data || [];
        // normalize structure
        const formatted = apiLangs.map((item) => ({
          id: item.id || item.code,
          name: item.name,
          code: (item.code || item.name?.slice(0, 2)).toUpperCase(),
        }));

        setLanguages(formatted);
      } catch (err) {
        console.log("API Error:", err);
        setLanguages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  // ✅ Select language
  const selectLanguage = (langId) => {
    setPressedId(langId);

    setTimeout(() => {
      setSelected(langId);
      localStorage.setItem("app_language", langId);
      setPressedId(null);
    }, 120);
  };

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 bg-white/80 backdrop-blur sticky top-0 z-10 border-b">
        <ChevronLeft
          onClick={() => navigate(-1)}
          className="cursor-pointer active:scale-90 transition"
        />
        <span className="font-semibold text-lg">Select Language</span>
        <div className="w-5" />
      </div>

      {/* CONTENT */}
      <div className="p-4">

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading languages...
          </div>
        ) : languages.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            No Languages Found
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">

            {languages.map((lang, index) => {
              const isSelected = selected === lang.id;
              const isPressed = pressedId === lang.id;

              return (
                <div
                  key={lang.id}
                  onClick={() => selectLanguage(lang.id)}
                  className={`
                    relative cursor-pointer rounded-2xl p-4
                    flex flex-col items-center justify-center text-center
                    transition-all duration-300 transform bg-white
                    ${isSelected
                      ? "shadow-lg scale-[1.05] border border-blue-500"
                      : "shadow-sm border border-gray-100"}
                    ${isPressed ? "scale-95" : ""}
                  `}
                  style={{
                    animation: `fadeUp 0.4s ease ${index * 0.05}s both`
                  }}
                >

                  {/* Ripple */}
                  {isPressed && (
                    <span className="absolute inset-0 bg-blue-100 opacity-40 animate-ping rounded-2xl" />
                  )}

                  {/* Code */}
                  <div
                    className={`
                      w-14 h-14 flex items-center justify-center rounded-full text-sm font-bold
                      transition-all duration-300
                      ${isSelected
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600"}
                    `}
                  >
                    {lang.code}
                  </div>

                  {/* Name */}
                  <p className="mt-3 font-semibold text-gray-800">
                    {lang.name}
                  </p>

                  {/* Tick */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1 shadow">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}

                  {/* Glow */}
                  {isSelected && (
                    <div className="absolute inset-0 rounded-2xl bg-blue-50 opacity-40 pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>
        {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(15px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}