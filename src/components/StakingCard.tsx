import React from "react";

const StakingCard: React.FC = () => {
  return (
    <div className="bg-[#12121A] text-white p-6 rounded-2xl w-[340px] shadow-lg border border-zinc-700">
      {/* Token Info */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src="/assets/usdclogo.png"
          alt="USDC Token"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold text-purple-400">Stake USD</h2>
          <p className="text-sm text-neutral-400">EARN USD</p>
        </div>
      </div>

      {/* APR Info */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-neutral-400">APR</span>
        <span className="text-lg font-semibold">21.39%</span>
      </div>

      {/* Earnings Block */}
      <div className="bg-[#1A1B27] border border-zinc-700 rounded-xl p-4 mb-6">
        <p className="text-xs text-neutral-400 mb-1">EARNED</p>
        <div className="text-2xl font-bold">0</div>
        <div className="text-xs text-neutral-500">0 USD</div>
        <button
          disabled
          className="w-full mt-4 bg-[#2D2E3A] text-white py-2 rounded-lg opacity-60 cursor-not-allowed"
        >
          Harvest
        </button>
      </div>

      {/* Stake Action */}
      <div>
        <button className="w-full bg-cyan-400 hover:bg-cyan-300 text-black py-2 rounded-lg font-semibold">
          Stake
        </button>
      </div>
    </div>
  );
};

export default StakingCard;


