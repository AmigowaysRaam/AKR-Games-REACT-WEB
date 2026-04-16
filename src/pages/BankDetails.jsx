import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { getBankAccountList, removeBankId } from "../services/authService";
import { useNavigate } from "react-router-dom";
import GameLoader from "./LoaderComponet";
export default function BankList() {
    const [listData, setListData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedBank, setSelectedBank] = useState(null);
    const navigate = useNavigate();
    const fetchBankList = async () => {
        try {
            setLoading(true);
            const res = await getBankAccountList();
            if (res?.success && Array.isArray(res?.data)) {
                setListData(res.data);
            } else {
                setListData([]);
            }
        } catch (err) {
            console.error(err);
            setListData([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchBankList();
    }, []);
    const handleDeleteClick = (bank) => {
        setSelectedBank(bank);
        setShowConfirm(true);
    };
    const confirmDelete = async () => {
        if (!selectedBank) return;
        try {
            setLoading(true);
            const res = await removeBankId({ id: selectedBank.id });
            if (res?.success) {
                setListData((prev) => prev.filter((b) => b.id !== selectedBank.id));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setShowConfirm(false);
            setSelectedBank(null);
        }
    };
    return (
        <div className="p-4 max-w-xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Bank Accounts</h1>
                <button
                    onClick={() => navigate("/AddbankAccount")}
                    className="flex items-center gap-2 cursor-pointer bg-blue-500 text-white px-3 py-2 rounded-lg shadow hover:bg-blue-600 transition">
                    <Plus size={16} />
                    Add Bank
                </button>
            </div>
            {loading ? (
                      <GameLoader />

            ) : (
                <div className="h-[50vh] overflow-y-auto space-y-3 pr-1">
                    {listData.length === 0 ? (
                        <p className="text-gray-500 text-center mt-10">
                            No bank accounts found
                        </p>
                    ) : (
                        listData.map((bank, index) => (
                            <div
                                key={bank.id || index}
                                className="border p-4 rounded-xl shadow-sm flex justify-between items-center bg-white hover:shadow-md transition"
                            >
                                <div>
                                    <p className="font-semibold">
                                        {bank.account_name || "User"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Acc: {bank.account_number || "XXXX"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        IFSC: {bank.ifsc_code || "-"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => navigate("/AddbankAccount", { state: { bank } })}
                                        className="text-blue-500 hover:text-blue-700 transition cursor-pointer">
                                        <Pencil size={24} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(bank)}
                                        className="text-red-500 hover:text-red-700 transition cursor-pointer"
                                    >
                                        <Trash2 size={24} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-[90%] max-w-sm shadow-xl">
                        <h2 className="text-lg font-semibold mb-2">Confirm Delete</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Are you sure you want to delete this bank account?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}