// import React from "react";


// export default function LotteryHeader({ lottery }) {
//   return (
//     <div className="flex justify-between bg-white p-3 rounded-xl shadow">
//       <div className="flex gap-2 items-center">
//         <img src={lottery.logo} className="w-8 h-8" />
//         <div>
//           <h2 className="font-bold">{lottery.name}</h2>
//           <p className="text-xs text-gray-500">{lottery.drawDate}</p>
//         </div>
//       </div>

//       <div className="flex gap-1">
//         {lottery.timer.map((t,i)=>(
//           <div key={i} className="bg-black text-white px-2 py-1 rounded">
//             {t}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


// export default function ResultBalls({ numbers, colors }) {
//   return (
//     <div className="flex gap-2">
//       {numbers.map((n, i) => (
//         <div
//           key={i}
//           className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
//           style={{ background: colors[i] }}
//         >
//           {n}
//         </div>
//       ))}
//     </div>
//   );
// }


// import { useState } from "react";

// const rowColors = {
//   A: "#f59e0b",
//   B: "#3b82f6",
//   C: "#ef4444",
//   D: "#22c55e",
// };

// export default function BetGrid() {
//   const [selected, setSelected] = useState(null);

//   return (
//     <div className="mt-3">
//       {["A","B","C","D"].map((row) => {
//         const color = rowColors[row];

//         return (
//           <div key={row} className="flex gap-3 mb-4 items-center">
            
//             {/* DOT */}
//             <div className="w-4 h-4 rounded-full" style={{ background: color }} />

//             {/* BUTTONS */}
//             <div className="grid grid-cols-4 gap-2 flex-1">
//               {["Odd","Even","Big","Small"].map((type)=> {
//                 const key = row + type;
//                 const isActive = selected === key;

//                 return (
//                   <button
//                     key={key}
//                     onClick={()=>setSelected(key)}
//                     className={`rounded-xl py-2 text-sm font-semibold transition ${
//                       isActive ? "bg-purple-100" : ""
//                     }`}
//                     style={{ border:`2px solid ${color}` }}
//                   >
//                     {type}
//                     <div className="text-xs text-gray-400">1.95X</div>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }




// export default function LotteryGame({ lottery }) {

//   const rowColors = {
//   A: "#f59e0b", // orange
//   B: "#3b82f6", // blue
//   C: "#ef4444", // red
//   D: "#22c55e", // green
// };
//   return (
//     <div className="p-3">
//       {/* HEADER */}
//       <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow">
//         <div className="flex items-center gap-2">
//           <img src={lottery.logo} alt="" className="w-8 h-8" />
//           <div>
//             <h2 className="font-bold text-lg">{lottery.name}</h2>
//             <p className="text-xs text-gray-500">{lottery.drawDate}</p>
//           </div>
//         </div>

//         {/* TIMER */}
//         <div className="flex gap-1">
//           {lottery.timer.map((t, i) => (
//             <div key={i} className="bg-black text-white px-2 py-1 rounded">
//               {t}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* RESULT */}
//       <div className="mt-4 bg-white p-3 rounded-xl shadow">
//         <p className="text-sm text-gray-500">Previous Result</p>

//         <div className="mt-2">
//           <p className="font-semibold text-sm">1st Prize</p>
//           <div className="flex gap-2 mt-1">
//             {lottery.firstPrize.map((n, i) => (
//               <span key={i}
//   className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
//   style={{ background: lottery.colors?.[i] || "#ccc" }}
// >
//   {n}
// </span>
//             ))}
//           </div>
//         </div>

//         <div className="mt-2">
//           <p className="font-semibold text-sm">2nd Prize</p>
//           <div className="flex gap-2 mt-1">
//             {lottery.secondPrize.map((n, i) => (
//               <span key={i} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold">
//                 {n}
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>
// <div className="flex gap-4 border-b pb-2 mt-3">
//   {["TwoSide", "FishPrawnCrab", "1Digit", "2D", "3D"].map((tab) => (
//     <button
//       key={tab}
//       className="text-sm font-semibold pb-1 border-b-2 border-transparent hover:border-purple-500"
//     >
//       {tab}
//     </button>
//   ))}
// </div>
//       {/* BET OPTIONS */}
//      {["A","B","C","D"].map((row) => {
//   const color = rowColors[row];

//   return (
//     <div key={row} className="mb-4 flex items-center gap-3">
      
//       {/* LEFT DOT */}
//       <div
//         className="w-4 h-4 rounded-full"
//         style={{ background: color }}
//       />

//       {/* BET BUTTONS */}
//       <div className="grid grid-cols-4 gap-2 flex-1">
//         {["Odd", "Even", "Big", "Small"].map((type) => (
//           <button
//             key={type}
//             className="rounded-xl py-2 text-sm font-semibold"
//             style={{
//               border: `2px solid ${color}`,
//               color: "#111",
//             }}
//           >
//             {type}
//             <div className="text-xs text-gray-400">1.95X</div>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// })}
//     </div>
//   );
// }

// function ResultHistory({ history }) {
//   return (
//     <div className="mt-4 bg-white rounded-xl">
//       {history.map((item, i) => (
//         <div key={i} className="flex justify-between p-3 border-b">
          
//           {/* LEFT DATE */}
//           <div className="text-xs text-gray-500">
//             <p>{item.date}</p>
//             <p>{item.time}</p>
//           </div>

//           {/* RIGHT RESULT */}
//           <div>
//             <p className="text-sm font-semibold">1st Prize</p>
//             <div className="flex gap-1">
//               {item.first.map((n, i) => (
//                 <span
//                   key={i}
//                   className="w-6 h-6 rounded-full text-white flex items-center justify-center text-xs"
//                   style={{ background: item.colors[i] }}
//                 >
//                   {n}
//                 </span>
//               ))}
//             </div>

//             <p className="text-sm font-semibold mt-1">2nd Prize</p>
//             <div className="flex gap-1">
//               {item.second.map((n, i) => (
//                 <span
//                   key={i}
//                   className="w-6 h-6 rounded-full text-white flex items-center justify-center text-xs"
//                   style={{ background: item.colors[i] }}
//                 >
//                   {n}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }



