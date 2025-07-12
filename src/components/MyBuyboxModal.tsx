import React, { useState } from "react";
import { Dialog, DialogContent } from "./Dialog";
import SubmitBuyboxFlow from "./SubmitBuyboxFlow";
import MyBuyboxTable from "./MyBuyboxTable";

interface MyBuyboxModalProps {
  onClose: () => void;
}

const MyBuyboxModal: React.FC<MyBuyboxModalProps> = ({ onClose }) => {
  const [mode, setMode] = useState<"live" | "submit">("live");

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 text-white rounded-2xl p-6 w-full max-w-2xl mx-auto text-center">
        <h2 className="text-xl font-bold mb-6">My BuyBox</h2>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {["live", "submit"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as "live" | "submit")}
              className={`w-32 py-2 rounded-full transition font-medium ${
                mode === m
                  ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-black shadow-md"
                  : "bg-transparent border border-zinc-600 text-white"
              }`}
            >
              {m === "live" ? "Live" : "Submit"}
            </button>
          ))}
        </div>

        {/* Mode Content */}
        <div className="text-left">
          {mode === "live" ? (
            <div className="space-y-4">
              <div className="bg-zinc-800 p-4 rounded shadow text-sm text-zinc-300">
                Your active BuyBox settings and matches will appear here.
              </div>
              <MyBuyboxTable />
            </div>
          ) : (
            <SubmitBuyboxFlow onComplete={onClose} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MyBuyboxModal;
