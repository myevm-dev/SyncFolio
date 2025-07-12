import React, { useState } from "react";
import { Dialog, DialogContent } from "./Dialog";
import DealflowTable from "./DealFlowTable";
import TradeFIPS from "./TradeFIPS";

interface FIPSModalProps {
  open: boolean;
  onClose: () => void;
  fipsCode: string;
  countyName: string;
}

const FIPSModal: React.FC<FIPSModalProps> = ({
  open,
  onClose,
  fipsCode,
  countyName,
}) => {
  const [view, setView] = useState<"trade" | "dealflow">("trade");

  /* ---------- dynamic heading ---------- */
  const heading =
    view === "dealflow"
      ? `${countyName} Leaderboard`
      : `Buy Deal Flow in ${countyName}`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-black text-black dark:text-white rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">{heading}</h2>

        <div className="flex justify-center gap-6 mb-6">
          <button
            onClick={() => setView("trade")}
            className={`w-32 py-2 rounded-full transition font-medium text-center ${
              view === "trade"
                ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-black shadow-md"
                : "bg-transparent border border-zinc-600 text-white"
            }`}
          >
            Trade
          </button>
          <button
            onClick={() => setView("dealflow")}
            className={`w-32 py-2 rounded-full transition font-medium text-center ${
              view === "dealflow"
                ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-black shadow-md"
                : "bg-transparent border border-zinc-600 text-white"
            }`}
          >
            Deal Flow
          </button>
        </div>

        {view === "trade" ? (
          <TradeFIPS fipsCode={fipsCode} countyName={countyName} />
        ) : (
          <DealflowTable fipsCode={fipsCode} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FIPSModal;
