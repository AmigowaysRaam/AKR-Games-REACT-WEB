export default function Wallet() {
  return (
    <div className="p-4 min-h-screen bg-[#0d0d0d] text-white">

      <h2 className="text-xl font-bold mb-4">Wallet</h2>

      <div className="bg-[#1c1c1c] p-4 rounded-xl mb-4">
        <p>Balance: ₹500</p>
      </div>

      <button className="w-full bg-green-500 p-3 rounded-xl mb-3">
        Deposit
      </button>

      <button className="w-full bg-red-500 p-3 rounded-xl">
        Withdraw
      </button>

    </div>
  );
}