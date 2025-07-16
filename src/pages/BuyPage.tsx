import React, { useState } from "react";
import Marketplace from "../components/Marketplace";
import DealFlowPage from "./DealFlowPage";
import { Users } from "lucide-react";
import AnimatedButton from "../components/AnimatedButton";
import MyBuyboxModal from "../components/MyBuyboxModal";
import Flowboard from "../components/Flowboard";
import { Dialog, DialogContent } from "../components/Dialog";

export default function BuyPage() {
  const [mode, setMode] = useState<"dealflow" | "marketplace">("dealflow");
  const [showMyBox, setShowMyBox] = useState(false);
  const [showFlowboard, setShowFlowboard] = useState(false);

  return (
    <div className="w-full bg-[#0B1519] text-white flex flex-col px-4 py-10">
      <div className="w-full">
        <h1 className="text-3xl font-bold text-center mb-4">
          Submit your Buybox or Search our Deal Marketplace.
        </h1>

        <p className="text-center text-cyan-400 text-sm mb-4">Coming soon</p>

        {/* Button Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          {/* Left: Total Buyers + Deploy */}
          <div className="flex gap-2 w-full md:w-auto justify-center md:justify-start items-center">
            <div className="flex flex-col justify-center text-cyan-300 border border-cyan-400 hover:bg-cyan-400 hover:text-black font-semibold px-4 py-2 rounded w-full md:w-auto min-h-[44px] cursor-pointer">
              <div className="flex items-center gap-1 text-xs md:text-sm justify-center">
                <Users size={16} />
                <span>Total Buyers</span>
              </div>
              <div className="text-white text-base font-bold leading-none text-center">
                2112
              </div>
            </div>

            <AnimatedButton
              onClick={() => alert("Coming Soon")}
              className="w-full md:w-auto min-h-[44px] px-4 py-2 flex items-center justify-center"
            >
              DeployAnalyzer
            </AnimatedButton>
          </div>

          {/* Center: Toggle */}
          <div className="flex justify-center gap-6">
            {["dealflow", "marketplace"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m as "dealflow" | "marketplace")}
                className={`w-40 py-2 rounded-full transition font-medium text-center ${
                  mode === m
                    ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-black shadow-md"
                    : "bg-transparent border border-zinc-600 text-white"
                }`}
              >
                {m === "dealflow" ? "Deal Flow" : "Marketplace"}
              </button>
            ))}
          </div>

          {/* Right: My Buybox + Flowboard Button */}
          <div className="flex gap-2 w-full md:w-auto justify-center md:justify-end">
            <button
              onClick={() => setShowMyBox(true)}
              className="bg-zinc-800 text-white font-medium px-4 py-2 rounded w-full md:w-auto hover:bg-[#6e5690] hover:text-black transition min-h-[44px]"
            >
              My BuyBox
            </button>

            <button
              onClick={() => setShowFlowboard(true)}
              className="bg-gradient-to-r from-purple-400 to-cyan-400 text-black hover:text-white font-medium px-4 py-2 rounded w-full md:w-auto transition min-h-[44px] shadow-md text-center flex items-center justify-center"
            >
              Flowboard
            </button>
          </div>
        </div>

        {/* View Switcher */}
        {mode === "dealflow" && <DealFlowPage />}
        {mode === "marketplace" && <Marketplace />}
      </div>

      {/* Modals */}
      {showMyBox && <MyBuyboxModal onClose={() => setShowMyBox(false)} />}
        <Flowboard open={showFlowboard} onClose={() => setShowFlowboard(false)} />
          
    </div>
  );
}
