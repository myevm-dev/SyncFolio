// src/components/FIPSModal.tsx
import React from "react";
import { Dialog, DialogContent } from "./Dialog";
import DealflowTable from "./DealFlowTable";
import TradeFIPS from "./TradeFIPS";

interface FIPSModalProps {
  open: boolean;
  onClose: () => void;
  fipsCode: string;
  countyName: string;
}

const FIPSModal: React.FC<FIPSModalProps> = ({ open, onClose, fipsCode, countyName }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-black text-black dark:text-white rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
        Buy Deal Flow in {countyName}
        </h2>
        <TradeFIPS fipsCode={fipsCode} countyName={countyName} />
        <div className="mt-6">
          <DealflowTable fipsCode={fipsCode} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FIPSModal;
