import { useState, useEffect } from "react";
import { ChevronLeft, Headphones, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getWithdrawApi, removeBankId } from "../services/authService";

export default function WithdrawScreen() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [selectedBankId, setSelectedBankId] = useState(null);

  // 🔥 NEW: modal state
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // 🔁 FETCH API
  const fetchWithdrawData = async () => {
    try {
      setLoading(true);
      const res = await getWithdrawApi({});
      if (res?.success) {
        setApiData(res.data);

        const firstEnabled =
          res.data.withdraw_options.find((i) => i.enabled) ||
          res.data.withdraw_options[0];
        if (firstEnabled) setAmount(firstEnabled.amount);

        const defaultBank =
          res.data.bank?.default || res.data.bank?.list?.[0];
        if (defaultBank) setSelectedBankId(defaultBank.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawData();
  }, []);

  const balance = apiData?.balance || {};
  const bank = apiData?.bank || {};
  const summary = apiData?.summary || {};
  const withdrawOptions = apiData?.withdraw_options || [];
  const bankList = bank?.list || [];

  const selectedOption =
    withdrawOptions.find((i) => i.amount === amount) || {};

  const preview = {
    amount,
    fee: selectedOption?.fee || 0,
    final_amount: selectedOption?.final_amount || 0,
  };

  // 🧠 OPEN MODAL
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  // ❌ CANCEL
  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  // ✅ CONFIRM DELETE
  const confirmDelete = async () => {
    try {
      setLoading(true);
      const res = await removeBankId({ id: deleteId });
      if (res?.success) {
        setShowConfirm(false);
        setDeleteId(null);
        await fetchWithdrawData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-[430px] mx-auto bg-gray-100 min-h-screen pb-24">

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 bg-white shadow-sm sticky top-0 z-10">
        <ChevronLeft onClick={() => navigate(-1)} className="cursor-pointer" />
        <span className="font-semibold text-lg">Withdraw</span>
        <Headphones
          className="w-5 h-5 text-gray-700"
          onClick={() => navigate("/CustomerSupport")}
        />
      </div>

      {/* BALANCE */}
      <div className="flex gap-3 p-3">
        <div className="flex-1 rounded-xl p-3 bg-gradient-to-r from-orange-300 to-orange-500 text-white">
          <p className="text-sm">Cash Balance</p>
          <p className="text-lg font-bold">₹ {balance.cash_balance || 0}</p>
        </div>

        <div className="flex-1 rounded-xl p-3 bg-gradient-to-r from-sky-400 to-blue-500 text-white">
          <p className="text-sm">Withdrawable</p>
          <p className="text-lg font-bold">
            ₹ {balance.withdrawable_balance || 0}
          </p>
        </div>
      </div>

      {/* BANK SECTION */}
      <div className="mx-3 mt-3 bg-white rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm text-gray-700">Bank Accounts</p>

          {bank?.has_account && (
            <button
              onClick={() => navigate("/AddbankAccount")}
              className="flex items-center gap-1 text-xs text-purple-600 font-medium"
            >
              <Plus size={14} /> Add
            </button>
          )}
        </div>

        {bank?.has_account && bankList.length > 0 ? (
          <div className="space-y-2">
            {bankList.map((item) => {
              const isSelected = selectedBankId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedBankId(item.id)}
                  className={`flex items-center justify-between border rounded-lg p-3 cursor-pointer ${
                    isSelected
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">
                      {item.account_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.account_number}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.ifsc_code || item.upi_address}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border ${
                        isSelected
                          ? "bg-purple-600 border-purple-600"
                          : "border-gray-400"
                      }`}
                    />

                    <Trash2
                      size={16}
                      className="text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(item.id);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            onClick={() => navigate("/AddbankAccount")}
            className="border-2 border-dashed rounded-xl py-6 flex flex-col items-center justify-center text-purple-600 cursor-pointer"
          >
            <span className="text-2xl">+</span>
            <span className="text-sm mt-1">Add Bank Account</span>
          </div>
        )}
      </div>

      {/* AMOUNT */}
      <div className="mx-3 mt-3 bg-white rounded-xl p-4">
        <p className="text-sm font-medium mb-3">Withdraw Amount</p>

        <div className="grid grid-cols-3 gap-3">
          {withdrawOptions.map((item) => (
            <div
              key={item.amount}
              onClick={() => item.enabled && setAmount(item.amount)}
              className={`py-3 rounded-lg text-center text-sm font-semibold ${
                amount === item.amount
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100"
              } ${!item.enabled ? "opacity-40" : "cursor-pointer"}`}
            >
              ₹{item.amount}
            </div>
          ))}
        </div>
      </div>

      {/* INFO */}
      <div className="mx-3 mt-3 bg-white rounded-xl p-4 text-sm">
        <div className="flex justify-between py-1">
          <span>Amount</span>
          <span>₹ {preview.amount}</span>
        </div>
        <div className="flex justify-between py-1">
          <span>Fee</span>
          <span>₹ {preview.fee}</span>
        </div>
        <div className="flex justify-between py-1 font-semibold text-green-600">
          <span>Final</span>
          <span>₹ {preview.final_amount}</span>
        </div>
      </div>

      {/* BUTTON */}
      <div className="fixed bottom-0 w-full max-w-[430px] bg-white p-3">
        <button
          disabled={!selectedOption?.enabled || !selectedBankId}
          className={`w-full py-3 rounded-full text-white font-bold ${
            selectedOption?.enabled && selectedBankId
              ? "bg-purple-600"
              : "bg-gray-400"
          }`}
        >
          Withdraw
        </button>
      </div>

      {/* 🔥 CUSTOM CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-sm rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-2">
              Remove Bank Account
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to remove this bank account?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}