// src/components/TradeFips.tsx
import React, { useState } from "react";
import FIPSBondChart from "./FIPSBondChart";

interface TradeFipsProps {
  fipsCode: string;
  countyName: string;
}

const TradeFips: React.FC<TradeFipsProps> = ({ fipsCode, countyName }) => {
  const [quantity, setQuantity] = useState<string>("");

  const handleTrade = (type: "buy" | "sell") => {
    const amount = parseFloat(quantity);
    if (amount > 0) {
      console.log(`Executing ${type} of ${amount} for FIPS ${fipsCode}`);
    }
  };

  return (
    <div className="bg-black border border-neutral-700 rounded-xl p-6 text-white shadow-lg w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <FIPSBondChart />
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

      <div className="flex gap-4">
        <button
          onClick={() => handleTrade("buy")}
          className="flex-1 py-2 rounded-full text-black text-sm font-semibold bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600"
        >
          Buy
        </button>
        <button
          onClick={() => handleTrade("sell")}
          className="flex-1 py-2 rounded-full text-black text-sm font-semibold bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
        >
          Sell
        </button>
      </div>
    </div>
  );
};

export default TradeFips;
