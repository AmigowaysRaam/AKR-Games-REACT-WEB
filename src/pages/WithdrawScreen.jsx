import { useState, useEffect } from "react";
import { Banknote, ChevronLeft, Headphones, History, PictureInPictureIcon, Plus, Trash2, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getWithdrawApi, removeBankId, withdrawCreate } from "../services/authService";
import WithdrawConfirmModal from "./WithdrawConfirmModal";
import GameLoader from "./LoaderComponet";

export default function WithdrawScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("UPI"); // ✅ NEW
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [selectedBankId, setSelectedBankId] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [wihtdrawConfirm, setwihtdrawConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });
  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "error" });
    }, 2000);
  };
  const fetchWithdrawData = async () => {
    try {
      setLoading(true);
      const res = await getWithdrawApi({
        active: activeTab,
        tab: activeTab,

      });
      if (res?.success) {
        setApiData(res.data);
        // 👇 set default coin
        // alert(JSON.stringify(res.data?.upi?.list))
        const coins = res.data?.usdt?.coins || [];
        if (coins.length > 0) {
          setSelectedCoin(coins[0].id);
        }
        const selectedFromApi = res.data?.selected;
        if (selectedFromApi?.amount) {
          setAmount(selectedFromApi.amount);
        } else {
          const firstEnabled =
            res.data?.withdraw_options?.find((i) => i.enabled) ||
            res.data?.withdraw_options?.[0];
          if (firstEnabled) setAmount(firstEnabled.amount);
        }
        const defaultBank =
          res.data?.upi?.list?.default || res.data?.upi?.list?.[0];
        if (defaultBank) setSelectedBankId(defaultBank.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleWithdraw = async (otp) => {
    // return
    try {
      setwihtdrawConfirm(false);
      setLoading(true);
      // const res = await withdrawCreate({
      //   amount,
      //   bank_id: selectedBankId,
      //   otp, // 🔥 send otp
      // });
      const res = await withdrawCreate({
        amount,
        bank_id: activeTab === "UPI" ? selectedBankId : null,
        wallet_address: activeTab === "USDT" ? recipientAddress : null,
        type: activeTab, // 🔥 important (UPI / USDT)
        otp,
        coin: selectedCoin
      });
      if (res?.success) {
        showToast(res?.message, "success");
        navigate("/withdrawhistory");
      } else {
        showToast(res?.message, "error");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWithdrawData();
  }, [activeTab]); // ✅ refetch when tab changes
  const balance = apiData?.balance || {};
  const bank = apiData?.upi || {};
  const summary = apiData?.summary || {};
  const withdrawOptions = apiData?.withdraw_options || [];
  const bankList = bank?.list || [];

  const noteText =
    apiData?.note ||
    summary?.note ||
    "Minimum withdrawal amount is ₹100. Withdrawals are processed within 2–3 business days.";

  const selectedOption =
    withdrawOptions.find((i) => i.amount === amount) || {};

  const preview =
    apiData?.selected?.amount === amount
      ? apiData.selected
      : {
        amount,
        fee: selectedOption?.fee || 0,
        final_amount: selectedOption?.final_amount || 0,
      };

  // 🧠 MODAL HANDLERS
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const res = await removeBankId({ id: deleteId });
      if (res?.success) {
        setShowConfirm(false);
        setDeleteId(null);
        fetchWithdrawData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[430px] mx-auto bg-gray-100 min-h-screen pb-28 ">
      <div className="flex items-center justify-between px-4 py-4 bg-white shadow-sm sticky top-0 z-10">
        <ChevronLeft onClick={() => navigate(-1)} className="cursor-pointer" />
        <span className="font-semibold text-lg">Withdraw</span>
        <div className="flex">
          <History onClick={() => navigate("/withdrawhistory")} className="cursor-pointer mx-5" />
          <Headphones onClick={() => navigate("/CustomerSupport")} className="cursor-pointer" />
        </div>
      </div>
      {/* <p>{JSON.stringify(apiData?.usdt?.coins, null, 2)}</p>
      [ { "id": "USDT-BEP20", "label": "USDT-BEP20", "network": "BSC", "icon": "usdt_bep20" }, { "id": "USDT-TRC20", "label": "USDT-TRC20", "network": "Tron", "icon": "usdt_trc20" } ] */}
      <div className="flex gap-3 p-3">
        <div className="flex-1 rounded-xl p-3 bg-gradient-to-r from-orange-800 to-orange-500 text-white flex items-center justify-between">
          <div>
            <p className="text-sm">Cash Balance</p>
            <p className="text-lg font-bold">
              ₹ {balance?.non_withdrawable || 0}
            </p>
          </div>
          <Wallet size={28} className="opacity-100" />
        </div>
        <div className="flex-1 rounded-xl p-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-between">
          <div>
            <p className="text-sm">Withdrawable</p>
            <p className="text-lg font-bold">
              ₹ {balance.withdrawable_balance || 0}
            </p>
          </div>
          <Banknote size={28} className="opacity-100" />
        </div>
      </div>
      <div className="mx-3 mt-3 bg-white rounded-xl p-2 flex">
        {["UPI", "USDT"].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center py-2 rounded-lg text-sm font-medium cursor-pointer transition ${activeTab === tab
              ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white"
              : "text-gray-600"
              }`}
          >
            {tab}
          </div>
        ))}
      </div>

      {activeTab == 'UPI' && <>
        <div className="mx-3 mt-3 bg-white rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-700">Accounts</p>
            {bank?.has_account && (
              <button
                onClick={() => navigate("/AddbankAccount")}
                className="flex items-center gap-1 cursor-pointer text-xs text-purple-600 font-medium"
              >
                <Plus size={14} /> Add
              </button>
            )}
          </div>


          {bank?.has_account && bankList.length > 0 ? (
            <div>
              <p className="text-xs text-gray-500 mb-2 px-1">
                Select Bank Account
              </p>

              <div className="space-y-2 max-h-40 overflow-y-auto p-1">
                {bankList.map((item) => {
                  const isSelected = selectedBankId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedBankId(item.id)}
                      className={`relative flex items-center justify-between rounded-xl p-3 cursor-pointer transition-all ${isSelected
                        ? "bg-purple-50 border-purple-500 border"
                        : "bg-white border border-gray-200"
                        }`}
                    >
                      <div className="pl-2">
                        <p className="text-sm font-semibold text-gray-800">
                          {item.account_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.account_number}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.ifsc_code || item.upi_address}
                        </p>
                      </div>

                      {/* RIGHT SELECT INDICATOR */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border ${isSelected
                            ? "border-purple-600 bg-purple-600"
                            : "border-gray-400"
                            }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <Trash2
                          size={16}
                          className="text-red-500 cursor-pointer"
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
            </div>
          ) : (
            <div
              onClick={() => navigate("/AddbankAccount")}
              className="border-2 border-dashed rounded-xl py-3 flex items-center justify-center text-purple-600 cursor-pointer"
            >
              + Add Account
            </div>
          )}
        </div>
      </>}
      {activeTab === "USDT" && (
        <div className="mx-3 mt-3 bg-white rounded-xl p-4">
          <p className="text-sm font-medium mb-2">Recipient Address</p>
          <input
            maxLength={24}
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="Enter USDT wallet address"
            className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none focus:border-purple-500"
          />
          <p className="text-xs text-gray-400 mt-2">
            Make sure the address is correct (TRC20 / ERC20 based on system).
          </p>
        </div>
      )}
      {toast.show && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
          <div
            className={`px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-lg ${toast.type === "error"
              ? "bg-red-500"
              : toast.type === "success"
                ? "bg-green-500"
                : "bg-black"
              }`}
          >
            {toast?.message}
          </div>
        </div>
      )}
      {
        activeTab === "USDT" && (
          <div className="mx-3 mt-3 bg-white rounded-xl p-4">
            <p className="text-sm font-medium mb-3">Select Network</p>

            <div className="space-y-2 mb-4">
              {(apiData?.usdt?.coins || []).map((coin) => {
                const isSelected = selectedCoin === coin.id;
                return (
                  <div
                    key={coin.id}
                    onClick={() => setSelectedCoin(coin.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${isSelected
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200"
                      }`}
                  >
                    <div>
                      <p className="text-sm font-semibold">{coin.label}</p>
                      <p className="text-xs text-gray-500">{coin.network}</p>
                    </div>

                    {/* radio */}
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected
                        ? "border-purple-600 bg-purple-600"
                        : "border-gray-400"
                        }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      <div className="mx-3 mt-3 bg-white rounded-xl p-4">
        <p className="text-sm font-medium mb-3">Withdraw Amount</p>
        <div className="grid grid-cols-3 gap-3">
          {withdrawOptions?.map((item) => (
            <div
              key={item.amount}
              onClick={() => {
                if (item.enabled) {
                  setAmount(item.amount);
                } else {
                  showToast(item.reason, "error");
                }
              }}
              className={`py-3 rounded-lg text-center text-sm font-semibold ${amount === item.amount
                ? "bg-purple-600 text-white"
                : "bg-gray-100"
                } ${!item.enabled ? "opacity-40" : "cursor-pointer"}`}
            >
              ₹{item.amount}
              {!item.enabled && (
                <div className="text-[10px] text-red-500 mt-1">
                  {item.reason}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {loading && (
        <GameLoader />
      )}

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
      <div className="mx-3 mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-gray-700">
        <span className="font-semibold block mb-1">Note:</span>
        {Array.isArray(noteText) ? (
          <ul className="list-disc pl-4 space-y-1">
            {noteText.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        ) : (
          <span>{noteText}</span>
        )}
      </div>
      <div className="fixed cursor-pointer bottom-0 w-full max-w-[430px] bg-white p-3 shadow-inner">
        <button
          onClick={() => {
            if (activeTab === "USDT" && !recipientAddress) {
              showToast("Please enter recipient address");
              return;
            }
            else setwihtdrawConfirm(true)
          }}
          disabled={!selectedOption?.enabled}
          className={`w-full py-3 rounded-full text-white font-bold ${selectedOption?.enabled
            //  && selectedBankId
            ? "bg-purple-600"
            : "bg-gray-400"
            }`}
        >
          Withdraw ({activeTab})
        </button>
      </div>
      <WithdrawConfirmModal
        open={wihtdrawConfirm}
        amount={preview.final_amount}
        onCancel={() => setwihtdrawConfirm(false)}
        onConfirm={handleWithdraw}
        preview={preview}
        selectedBankId={selectedBankId}
        activeTab={activeTab}
        recipientAddress={recipientAddress}
        coin={selectedCoin}
      />
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-sm rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-2">
              Remove Account
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to remove this account?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg bg-gray-200"
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