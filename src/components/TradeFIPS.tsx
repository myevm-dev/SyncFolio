import React, { useState } from "react";
import FIPSBondChart from "./FIPSBondChart";

interface TradeFipsProps {
  fipsCode: string;
  countyName: string;
}

const TradeFips: React.FC<TradeFipsProps> = ({ fipsCode }) => {
  const [quantity, setQuantity] = useState<string>("");

  return (
    <div className="w-full max-w-[820px] bg-zinc-900 border border-zinc-700 rounded-2xl p-6 shadow-xl">
      <div className="w-full h-[260px] mb-4">
        <FIPSBondChart />
      </div>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*"
          className="w-[240px] px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Enter amount"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <button
          disabled
          className="w-28 py-2 rounded-full bg-gradient-to-r from-green-500 to-lime-500 text-black font-semibold disabled:opacity-50 cursor-not-allowed"
        >
          Buy
        </button>
        <button
          onClick={() => console.log(`Sell not implemented for ${fipsCode}`)}
          className="w-28 py-2 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-black font-semibold hover:from-pink-600 hover:to-red-600"
        >
          Sell
        </button>
      </div>

      <div className="text-center text-xs text-gray-400">
        <span className="text-[#fd01f5] font-medium">Folio Balance:</span>
      </div>
    </div>
  );
};

export default TradeFips;
