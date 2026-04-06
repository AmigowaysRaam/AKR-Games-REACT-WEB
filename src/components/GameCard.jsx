import { useNavigate } from "react-router-dom";

export default function GameCard({ title, path, color }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className="bg-[#1c1c1c] p-6 rounded-xl text-white flex flex-col items-center cursor-pointer hover:scale-105 transition"
    >
      <div className={`w-12 h-12 ${color} rounded-full mb-3`} />
      <p className="font-semibold">{title}</p>
    </div>
  );
}   