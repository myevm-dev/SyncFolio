// src/components/StakingCard.tsx
import React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const StakingCard = () => {
  return (
    <div className="bg-[#1A1B27] text-white p-6 rounded-2xl w-[340px] shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-purple-400">Earn USD</h2>
          <p className="text-sm text-neutral-300">Stake USD</p>
        </div>
        <img
        src="/assets/usdclogo.png"
        alt="USDC Token"
        className="w-10 h-10 rounded-full"
        />
      </div>

      <div className="flex justify-between items-center text-sm border-t border-b border-neutral-700 py-3">
        <div className="text-neutral-400">APR:</div>
        <div className="text-white font-medium">21.39%</div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-neutral-400">USD EARNED</p>
        <div className="text-lg font-semibold">0</div>
        <div className="text-xs text-neutral-500">0 USD</div>
        <button
          disabled
          className="w-full mt-2 bg-[#3A3B47] text-white py-2 rounded-lg cursor-not-allowed"
        >
          Harvest
        </button>
      </div>

      <div className="mt-6">
        <p className="text-xs text-neutral-400 mb-1">STAKE USD</p>
        <button className="w-full bg-cyan-400 text-black hover:bg-cyan-300 py-2 rounded-lg font-semibold">
          Stake
        </button>
      </div>

      
    </div>
  );
};

export default StakingCard;
