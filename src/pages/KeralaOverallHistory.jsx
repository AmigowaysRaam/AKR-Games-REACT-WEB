import { useEffect, useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { getAllLotteryResults, getLotteryDetails } from "../services/gameSevice";

export default function KeralaLotteryTab({ lottery }) {
    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState(null);
    const [details, setDetails] = useState(null);

    const [listLoading, setListLoading] = useState(true);
    const [detailsLoading, setDetailsLoading] = useState(false);

    useEffect(() => {
        fetchResults();
    }, [lottery]);

    const fetchResults = async () => {
        try {
            const res = await getAllLotteryResults({ lottery });
            if (res?.success) setResults(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setListLoading(false);
        }
    };
    const openDetails = async (item) => {
        setSelected(item);
        setDetailsLoading(true);
        try {
            const res = await getLotteryDetails({
                lotteryDigit: item.lotteryDigit,
            });

            if (res?.success) setDetails(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setDetailsLoading(false);
        }
    };

    const goBack = () => {
        setSelected(null);
        setDetails(null);
    };

    if (listLoading) {
        return <div className="text-center text-gray-400 mt-4">Loading...</div>;
    }
    if (selected) {
        return (
            <div className="pt-2">
                <div className="flex items-center gap-2 mb-4">
                    <button onClick={goBack} className="mx-4"><X /></button>
                    <div>
                        <div className="font-bold">{selected.lotteryDigit}</div>
                        <div className="text-xs text-gray-500">
                            {selected.name} | {selected.drawDate} {selected.drawTime}
                        </div>
                    </div>
                </div>
                {detailsLoading ? (
                    <div className="text-center text-gray-400">Loading...</div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {(details?.draws || []).map((draw, i) => (
                            <div key={i}>
                                {(draw.prizes || []).map((p, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-xl p-2  mb-1 bg-gradient-to-r from-yellow-100 to-pink-100 shadow-sm"
                                    >
                                        <div className="flex justify-between mb-3">
                                            <span className="font-bold text-[10px]">Rank {p.rank}</span>
                                            <span className="text-orange-600">₹{p.amount}</span>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {(p.winningNumbers || []).map((num, i2) => (
                                                <div
                                                    key={i2}
                                                    className="bg-white px-3 py-1 rounded-full text-[10px] shadow"
                                                >
                                                    {num}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-2">
            {results.map((r) => (
                <div
                    key={r.lotteryDigit}
                    onClick={() => openDetails(r)}
                    className="flex items-center gap-3 border border-yellow-300 bg-yellow-50 rounded-xl px-4 py-3 cursor-pointer hover:bg-yellow-100"
                >
                    <div className="border-r border-dashed pr-3 min-w-[72px]">
                        <span className="font-bold text-[10px]">{r?.lotteryDigit}</span>
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-[10px]">{r.name}</div>
                        <div className="text-[10px] text-gray-500">
                            {r.drawDate} {r.drawTime}
                        </div>
                    </div>
                    <span>›</span>
                </div>
            ))}
        </div>
    );
}