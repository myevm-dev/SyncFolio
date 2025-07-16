// src/pages/YieldPage.tsx
import React, { useState } from "react";
import BasicYieldGroup from "../components/BasicYieldGroup";
import AdvancedYieldGroup from "../components/AdvancedYieldGroup";
import Web3Notice from "../components/Web3Notice"; // ✅ Import notice

export default function YieldPage() {
  const [mode, setMode] = useState<"basic" | "advanced" | "swap">("basic");

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">
        Passively Earn with USD or Hedge Ꞙolio
      </h1>

      <Web3Notice /> {/* ✅ Notice bar inserted */}

      <div className="flex justify-center gap-6 mb-4 mt-6">
        {["basic", "advanced", "swap"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m as "basic" | "advanced" | "swap")}
            className={`w-40 py-2 rounded-full transition font-medium text-center ${
              mode === m
                ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-black shadow-md"
                : "bg-transparent border border-zinc-600 text-white"
            }`}
          >
            {m === "basic"
              ? "Basic"
              : m === "advanced"
              ? "Advanced"
              : "Swap"}
          </button>
        ))}
      </div>

      <p className="text-center text-cyan-400 text-sm mb-6">
        {mode === "basic"
          ? "Basic Yield Strategies (coming soon)"
          : mode === "advanced"
          ? "Advanced Hedging Strategies (coming soon)"
          : "Token Swap (coming soon)"}
      </p>

      {mode === "basic" && <BasicYieldGroup />}
      {mode === "advanced" && <AdvancedYieldGroup />}
      {mode === "swap" && (
        <div className="bg-zinc-800 border border-zinc-700 p-8 rounded-lg text-center text-neutral-400">
          Swap Interface Placeholder
        </div>
      )}
    </div>
  );
}
