// src/pages/BuyPage.tsx
import React, { useState } from "react";
import Marketplace from "../components/Marketplace";
import DealFlowPage from "./DealFlowPage";

export default function BuyPage() {
  const [mode, setMode] = useState<"dealflow" | "marketplace">("dealflow");

  return (
    <div className="min-h-screen w-full bg-[#0B1519] text-white flex flex-col px-4 py-10 overflow-y-auto">
      <div className="w-full">
        <h1 className="text-3xl font-bold text-center mb-4">
          Submit your Buybox or Search our Deal Marketplace.
        </h1>

        <p className="text-center text-cyan-400 text-sm mb-4">Coming soon</p>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-6 mb-6">
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

        {/* View Switcher */}
        {mode === "dealflow" && <DealFlowPage />}
        {mode === "marketplace" && <Marketplace />}
      </div>
    </div>
  );
}
