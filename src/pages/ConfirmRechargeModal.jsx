import { useState, useEffect } from "react";

export default function ConfirmRechargeModal({
  show, onClose,
  onConfirm, amount, channel, total, offer, activeTab
}) {
  const [useOffer, setUseOffer] = useState(false);

  useEffect(() => {
    setUseOffer(!!offer?.available);
  }, [offer]);

  if (!show) return null;

  const finalTotal = useOffer ? total : amount;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-2xl w-[90%] max-w-[400px] shadow-xl">

        {/* HEADER */}
        <h2 className="text-center text-lg font-bold mb-4">
          Confirm Recharge
        </h2>

        {/* 🔥 OFFER CARD */}
        {offer?.message && (
          <div className="mb-4">

            <div className="relative rounded-xl overflow-hidden border shadow-sm">
              <img
                src={offer.message.image}
                alt="offer"
                className="w-full h-[90px] object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20"></div>

              <div className="absolute inset-0 flex flex-col justify-center px-3 text-white">
                <p className="text-sm font-semibold">
                  {offer.message?.title || "Special Offer"}
                </p>

                {offer.message?.desc && (
                  <p className="text-xs opacity-90">
                    {offer.message.desc}
                  </p>
                )}
              </div>
            </div>

            {/* ✅ CHECKBOX SECTION */}
            <label className="flex items-center justify-between mt-3 bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={useOffer}
                  onChange={() => setUseOffer(!useOffer)}
                  className="w-4 h-4 accent-purple-600"
                />
                <span className="text-sm font-medium">
                  Apply this offer
                </span>
              </div>

              <span
                className={`text-xs font-semibold ${useOffer ? "text-green-600" : "text-gray-500"
                  }`}
              >
                {useOffer ? "Applied" : "Not using"}
              </span>
            </label>
          </div>
        )}

        {/* 💰 DETAILS */}
        <div className="space-y-2 text-sm border-t pt-3">
          <div className="flex justify-between">
            <span>Amount</span>
            <span>{`${activeTab == 'UPI' ? '₹' : '$'} ${amount}`}</span>
          </div>

          <div className="flex justify-between">
            <span>Channel</span>
            <span>{channel}</span>
          </div>

          {/* 💥 TOTAL */}
          <div className="flex justify-between text-base font-bold text-green-600 mt-2">
            <span>Total Pay</span>
            <span>{` ${activeTab == 'UPI' ? '₹' : '$'}${finalTotal}`}</span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 py-2.5 rounded-lg font-medium"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(useOffer)}
            className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg font-medium shadow-md active:scale-95 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}