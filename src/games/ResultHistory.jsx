import ResultBalls from "./ResultBalls";

export default function ResultHistory({ history }) {
  return (
    <div className="mt-4 bg-white rounded-xl">
      {history.map((item,i)=>(
        <div key={i} className="flex justify-between p-3 border-b">
          
          {/* LEFT */}
          <div className="text-xs text-gray-500">
            <p>{item.date}</p>
            <p>{item.time}</p>
          </div>

          {/* RIGHT */}
          <div>
            <p className="text-sm font-semibold">1st Prize</p>
            <ResultBalls numbers={item.first} colors={item.colors} />

            <p className="text-sm font-semibold mt-1">2nd Prize</p>
            <ResultBalls numbers={item.second} colors={item.colors} />
          </div>
        </div>
      ))}
    </div>
  );
}