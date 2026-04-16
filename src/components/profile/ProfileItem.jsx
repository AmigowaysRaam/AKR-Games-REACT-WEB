import { useState, useEffect } from "react";
import { ChevronRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GiftCodeModal from "./GiftCodeModal";

export default function ProfileItem({
  icon: Icon,
  label,
  badge,
  color,
  nav,
  allow,
  loadData
}) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [code, setCode] = useState("");
  const [selectedLang, setSelectedLang] = useState("English");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    loadData && loadData();
  }, [open]);

  const languages = ["English", "Hindi", "Spanish", "French"];

  const handleClick = () => {
    if (!allow) return navigate("/Login");

    if (label === "Gift Code") {
      setModalType("gift");
      setOpen(true);
    } else if (label === "Languages") {
      // setModalType("language");
      // setOpen(true);
      navigate("/langscreen");
    } else {
      navigate("/" + nav);
    }
  };

  // Toast
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2500);
  };

  // ESC close
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  // Gift Submit
  const handleSubmit = async () => {
  
  };

  // Language select
  const handleLanguageSelect = (lang) => {

    setSelectedLang(lang);
    showToast(`Language set to ${lang}`, "success");
    setOpen(false);
  };

  return (
    <>
      {/* TOAST */}
      <div
        className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${
          toast.show
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-5 pointer-events-none"
        }`}
      >
        <div
          className={`px-4 py-2 rounded-lg shadow-lg text-white text-sm font-semibold ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      </div>

      {/* ITEM */}
      <div
        onClick={handleClick}
        className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-50 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${color[0]}, ${color[1]})`,
            }}
          >
            <Icon size={18} className="text-white" />
          </div>

          <span className="text-sm font-semibold text-gray-700">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500 text-white">
              {badge}
            </span>
          )}
          <ChevronRight size={18} className="text-gray-400" />
        </div>
      </div>
      <GiftCodeModal
        open={open && modalType === "gift"}
        onClose={() => setOpen(false)}
        code={code}
        setCode={setCode}
        loading={loading}
        onSubmit={handleSubmit}
        // loadData={loadData}
      />
      {open && modalType === "language" && (
        <div
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        >
          <div className="bg-white w-[90%] max-w-sm rounded-2xl p-5 relative">
            <h2 className="text-center font-bold mb-4">SELECT LANGUAGE</h2>

            <div className="space-y-2">
              {languages.map((lang) => (
                <div
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <span>{lang}</span>

                  {selectedLang === lang && (
                    <Check size={16} className="text-purple-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}