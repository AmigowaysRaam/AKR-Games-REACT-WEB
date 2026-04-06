// import React from "react";
// export default function HomePage() {
//   return (
//     <div className="bg-gray-100 min-h-screen pb-20">
//       <div className="flex justify-between items-center p-3 bg-white shadow">
//         <div className="flex items-center gap-2">
//           <span className="text-xl">☰</span>
//           <span className="font-semibold">Menu</span>
//         </div>
//         <div className="flex items-center gap-3">
//           <button className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm">
//             LOGIN
//           </button>
//           <span className="text-xl">🔍</span>
//         </div>
//       </div>
//       <div className="p-3">
//         <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-40 rounded-xl flex items-center justify-center text-white font-bold text-lg">
//           Banner Image
//         </div>
//       </div>

//       {/* 🎮 CATEGORY ICONS */}
//       <div className="flex justify-around bg-white py-3">
//         {["Lottery", "Casino", "Live", "Scratch", "Sports"].map((item) => (
//           <div key={item} className="flex flex-col items-center text-xs">
//             <div className="w-12 h-12 bg-gray-200 rounded-full mb-1" />
//             {item}
//           </div>
//         ))}
//       </div>

//       {/* 📊 TABS */}
//       <div className="flex gap-5 px-3 py-2 bg-white overflow-x-auto">
//         <span className="font-bold border-b-2 border-purple-500">
//           Hot Matches
//         </span>
//         <span>Dice</span>
//         <span>Color</span>
//         <span>3Digits</span>
//       </div>

//       {/* 🔥 MATCH CARD */}
//       <div className="p-3">
//         <div className="bg-black rounded-xl p-3 shadow">
//           <p className="text-sm text-gray-500 mb-2">
//             Women T20 Match
//           </p>

//           <div className="flex justify-between">
//             <span>New Zealand</span>
//             <span className="text-red-500 font-bold">0</span>
//           </div>

//           <div className="flex justify-between mt-2">
//             <span>South Africa</span>
//             <span className="text-red-500 font-bold">0</span>
//           </div>

//           <div className="mt-3 bg-gray-100 text-center p-2 rounded">
//             18 Available Outcomes
//           </div>
//         </div>
//       </div>
//       <div className="px-3">
//         <h3 className="font-bold mb-2 text-black">Dice Game</h3>

//         <div className="grid grid-cols-2 gap-3">
//           <div className="bg-gradient-to-r from-red-400 to-orange-400 p-4 rounded-xl text-white">
//             <p className="text-black">DICE 1 Min</p>
//             <button className="mt-3 bg-white text-black px-3 py-1 rounded">
//               Play Now
//             </button>
//           </div>

//           <div className="bg-gradient-to-r from-green-400 to-green-600 p-4 rounded-xl text-white">
//             <p>DICE 3 Min</p>
//             <button className="mt-3 bg-white text-black px-3 py-1 rounded">
//               Play Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }