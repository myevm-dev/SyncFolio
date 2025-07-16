// src/components/Flowboard.tsx
import React, { useState } from "react";
import { Dialog, DialogContent } from "./Dialog";
import FlowboardTable, { LeaderData } from "./FlowboardTable";

interface FlowboardProps {
  open: boolean;
  onClose: () => void;
}

const baseMock: LeaderData[] = [
  {
    id: "0x123...abcd",
    displayName: "agent-zero",
    avatar: window.multiavatar("agent-zero"),
    quantity: "4,200 FIPS",
    analyze: true,
  },
  {
    id: "0x456...efgh",
    displayName: "metro-max",
    avatar: window.multiavatar("metro-max"),
    quantity: "2,830 FIPS",
    analyze: false,
  },
  {
    id: "0x789...wxyz",
    displayName: "txwhale",
    avatar: window.multiavatar("txwhale"),
    quantity: "2,300 FIPS",
    analyze: true,
  },
];

const Flowboard: React.FC<FlowboardProps> = ({ open, onClose }) => {
  const [mode, setMode] = useState<"overall" | "state" | "county">("overall");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-zinc-900 border-zinc-700 px-4 py-8">
        <div className="text-white">
          <h2 className="text-2xl font-bold text-center mb-6">Dealflow Leaderboard</h2>

          <div className="flex justify-center gap-4 mb-4">
            {["overall", "state", "county"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m as "overall" | "state" | "county")}
                className={`w-32 py-2 rounded-full transition font-medium text-center ${
                  mode === m
                    ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-black shadow-md"
                    : "bg-transparent border border-zinc-600 text-white"
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>

          {mode === "overall" && <FlowboardTable title="Overall" data={baseMock} />}
          {mode === "state" && <FlowboardTable title="State (TX)" data={baseMock} />}
          {mode === "county" && <FlowboardTable title="County (El Paso)" data={baseMock} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Flowboard;
