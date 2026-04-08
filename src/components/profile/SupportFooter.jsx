// components/profile/SupportFooter.jsx
import { Mail } from "lucide-react";

export default function SupportFooter() {
  return (
    <div className="bg-white rounded-2xl p-4 text-center shadow-sm w=[20px]">
      <p className="text-xs text-gray-500 mb-2">
        For any queries and complaints please email us
      </p>

      <div className="flex items-center justify-center gap-2 text-purple-600 font-medium">
        <Mail size={16} />
        support@akrlottery.in
      </div>
    </div>
  );
}