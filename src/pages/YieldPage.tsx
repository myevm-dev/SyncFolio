// src/pages/YieldPage.tsx
import React, { useState } from "react";
import BasicYieldGroup from "../components/BasicYieldGroup";
import AdvancedYieldGroup from "../components/AdvancedYieldGroup";

export default function YieldPage() {
  const [mode, setMode] = useState<"basic" | "advanced">("basic");

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">
        Passively Earn with USD or Hedge Ꞙolio
      </h1>

      <div className="flex justify-center gap-6 mb-6">
        {["basic", "advanced"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m as "basic" | "advanced")}
            className={`w-40 py-2 rounded-full transition font-medium text-center ${
              mode === m
                ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-black shadow-md"
                : "bg-transparent border border-zinc-600 text-white"
            }`}
          >
            {m === "basic" ? "Basic" : "Advanced"}
          </button>
        ))}
      </div>

      {mode === "basic" ? (
        <BasicYieldGroup />
      ) : (
        <AdvancedYieldGroup />
      )}
    </div>
  );
}
