import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-xl font-bold text-white">Lottery App</h1>

      <button
        onClick={() => navigate("/wallet")}
        className="bg-yellow-500 px-3 py-1 rounded-lg text-black font-semibold"
      >
        Wallet
      </button>
    </div>
  );
}