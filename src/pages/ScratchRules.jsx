import { X } from "lucide-react";

export default function RulesModal({ open, onClose, rulesD }) {
    if (!open && rulesD) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 ">
            <div className="bg-white text-black w-[380px] max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h2 className="font-bold text-lg">Game Rules</h2>
                    <X className="cursor-pointer" onClick={onClose} />
                </div>
                <div className="max-h-[60vh] overflow-y-auto px-4 py-3 space-y-3 text-sm">
                    {rulesD?.map((rule, i) => {
                        const isNote = rule.startsWith("Note:");
                        return (
                            <div
                                key={i}
                                className={`text-[12px] whitespace-pre-line leading-relaxed p-1 rounded-lg
                  ${isNote ? "bg-yellow-100 text-yellow-800 font-medium p-" : ""}
                `}
                            >
                                {rule}
                            </div>
                        );
                    })}

                </div>

                {/* FOOTER */}
                <div className="p-3 border-t">
                    <button
                        onClick={onClose}
                        className="w-full bg-violet-600 text-white py-2 rounded-lg active:scale-95 transition"
                    >
                        Got it
                    </button>
                </div>

            </div>
        </div>
    );
}