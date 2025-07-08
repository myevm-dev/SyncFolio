// src/components/PlatformDepositModal.tsx
import React from "react";
import { Dialog, DialogContent } from "./Dialog";
import { Banknote, CreditCard } from "lucide-react";

interface PlatformDepositModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (method: "stripe" | "crypto") => void;
}

const DepositCard = ({
  label,
  description,
  icon: Icon,
  onClick,
}: {
  label: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="flex flex-col justify-between bg-black border border-neutral-700 rounded-xl p-6 text-left text-white hover:shadow-xl cursor-pointer hover:border-blue-600 transition-all duration-200 w-full max-w-sm"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="bg-blue-700 p-3 rounded-full">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold">{label}</h3>
    </div>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

const PlatformDepositModal: React.FC<PlatformDepositModalProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border border-neutral-700 max-w-2xl text-white rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-6">Choose Deposit Method</h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <DepositCard
            label="Deposit with Stripe"
            description="Use your debit/credit card to deposit USD directly into your platform balance."
            icon={CreditCard}
            onClick={() => onSelect("stripe")}
          />
          <DepositCard
            label="Deposit with Crypto"
            description="Transfer USDC or ꞘOLIO from your wallet to fund your platform balance."
            icon={Banknote}
            onClick={() => onSelect("crypto")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlatformDepositModal;
