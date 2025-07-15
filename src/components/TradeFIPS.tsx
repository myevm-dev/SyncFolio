// src/components/TradeFips.tsx
import React, { useState } from "react";
import FIPSBondChart from "./FIPSBondChart";

interface TradeFipsProps {
  fipsCode: string;
  countyName: string;
}

const TradeFips: React.FC<TradeFipsProps> = ({ fipsCode, countyName }) => {
  const [quantity, setQuantity] = useState<string>("");

  return (
    <div className="bg-black border border-neutral-700 rounded-xl p-6 text-white shadow-lg w-full max-w-4xl mx-auto">
      <div className="mb-6">
        {/* Chart container given full available width */}
        <div className="w-full h-64">
          <FIPSBondChart />
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*"
          className="w-full px-4 py-2 rounded-md bg-black text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
          placeholder="Enter amount"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <div className="flex gap-4 mb-2">
        {/* Disabled Buy button */}
        <button
          disabled
          className="flex-1 py-2 rounded-full text-black text-sm font-semibold bg-gradient-to-r from-green-500 to-lime-500 opacity-50 cursor-not-allowed"
        >
          Buy
        </button>
        <button
          onClick={() => console.log(`Sell not implemented`)}
          className="flex-1 py-2 rounded-full text-black text-sm font-semibold bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
        >
          Sell
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between text-sm mt-2 gap-1 sm:gap-0">
        <span className="text-[#fd01f5] font-medium">Folio Balance:</span>
        <span className="text-white font-medium">{countyName} Balance:</span>
      </div>
    </div>
  );
};

export default TradeFips;