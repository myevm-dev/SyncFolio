// src/pages/YieldPage.tsx
import React, { useState } from "react";

export default function YieldPage() {
  const [mode, setMode] = useState<"basic" | "advanced">("basic");

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">Passively Earn with USD or Hedge Ꞙolio</h1>

      {/* Toggle Buttons */}
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

      <p className="text-center text-cyan-400 text-lg mb-4">
        {mode === "basic" ? "Basic View (coming soon)" : "Advanced View (coming soon)"}
      </p>

      <div className="bg-zinc-800 border border-zinc-700 p-8 rounded-lg text-center text-neutral-400">
        {mode === "basic" ? "Basic Yield Stats Placeholder" : "Advanced Yield Analytics Placeholder"}
      </div>
    </div>
  );
}
