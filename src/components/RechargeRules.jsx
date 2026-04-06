export default function RechargeRules() {
  const rows = [
    { range: "₹200~₹499", bonus: 10 },
    { range: "₹500~₹999", bonus: 50 },
    { range: "₹1000~₹1999", bonus: 200 },
    { range: "₹2000~₹4999", bonus: 300 },
    { range: "₹5000~₹9999", bonus: 750 },
    { range: "₹10000~₹99999", bonus: 1000 },
  ];

  return (
    <div className="mx-3 mt-4 bg-[#f3f4f6] rounded-2xl shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-3 bg-[#e5e7eb] text-[13px] font-semibold text-gray-700 bg-purple-200">
        <span className="tracking-wide text-xl text-black">BETTING REQUIREMENTS:</span>
        <span className="font-medium text-gray-600">Water multiplier 1</span>
      </div>

      {/* BODY */}
      <div className="p-4">

        {/* TITLE */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-[3px] h-4 bg-blue-500 rounded"></div>
          <h3 className="text-[18px] font-bold text-black-100">
            Recharge Promotions
          </h3>
        </div>

        <p className="text-[11px] text-gray-500 mb-3">
          Select And Recharge To Automatically Participate
        </p>

        {/* TABLE */}
        <div className="rounded-xl overflow-hidden bg-[#e5e7eb]">

          {/* HEAD */}
          <div className="grid grid-cols-2 text-[16px] font-bold text-gray-800 bg-[#d1d5db]">
            <div className="py-2 text-center">Recharge Amount</div>
            <div className="py-2 text-center">Bonus</div>
          </div>

          {/* ROWS */}
          {rows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-2 text-[13px] ${
                i % 2 === 0 ? "bg-[#f9fafb]" : "bg-[#e5e7eb]"
              }`}
            >
              <div className="py-2 flex items-center justify-center gap-1 text-gray-600 font-semibold text-base">
                <span className="text-[12px]">🪙</span>
                {row.range}
              </div>
              <div className="py-2 text-center text-gray-600 font-semibold text-base">
                {row.bonus}
              </div>
            </div>
          ))}
        </div>

        {/* DESCRIPTION */}
        <p className="text-[15px] text-gray-600 mt-4 leading-relaxed font-medium">
          After Participating In This Event, Your Withdrawal Will Be Subject To A
          Wagering Requirement Of 1 Times The Deposit Amount.
        </p>

        {/* TIPS */}
        <div className="mt-3">
          <p className="text-[18px] font-bold text-black-800 mb-1">
            • Deposit Tips:
          </p>
          <ol className="list-decimal pl-4 space-y-1 text-[15px] text-gray-600 font-medium">
            <li>Each Deposit Will Be Credited Within 1-5 Minutes.</li>
            <li>
              After The Payment Is Successful, Please Return To The Game Deposit
              Page To Check Your Account Balance.
            </li>
            <li>
              If Your Deposit Does Not Arrive Within 30 Minutes, Please Contact
              Customer Service For Help.
            </li>
          </ol>
        </div>

        {/* NOTES */}
        <div className="mt-3">
          <p className="text-[18px] font-bold text-black-800 mb-1">
            • Important Notes:
          </p>
          <p className="text-[15px] text-gray-600 font-medium">
            Please Do Not Modify The Payment Amount. Avoid Reusing Saved QR Codes Or UPI Accounts For Multiple Payments.
          </p>
        </div>

      </div>
    </div>
  );
}