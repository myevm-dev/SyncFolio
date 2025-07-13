import React, { useState } from "react";
import { Dialog, DialogContent } from "./Dialog";
import MyListingsTable from "./MyListingsTable";

interface MyListingsModalProps {
  onClose: () => void;
}

const MyListingsModal: React.FC<MyListingsModalProps> = ({ onClose }) => {
  const [mode, setMode] = useState<"live" | "submit">("live");

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 text-white rounded-2xl p-6 w-full max-w-2xl mx-auto text-center">
        <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent text-xl font-bold mb-4 block">
          My Listings
        </span>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {["live"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as "live")}
              className={`w-32 py-2 rounded-full transition font-medium ${
                mode === m
                  ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-black shadow-md"
                  : "bg-transparent border border-zinc-600 text-white"
              }`}
            >
              Live
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="text-left mt-6">
          <MyListingsTable />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MyListingsModal;
