// src/components/PlatformWithdrawModal.tsx
import React from "react";
import { Dialog, DialogContent } from "./Dialog";
import { Banknote, Landmark } from "lucide-react";

interface PlatformWithdrawModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (method: "crypto" | "ach") => void;
}

const WithdrawCard = ({
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
    className="flex flex-col justify-between bg-black border border-neutral-700 rounded-xl p-6 text-left text-white hover:shadow-xl cursor-pointer hover:border-red-600 transition-all duration-200 w-full max-w-sm"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="bg-red-700 p-3 rounded-full">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold">{label}</h3>
    </div>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

const PlatformWithdrawModal: React.FC<PlatformWithdrawModalProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border border-neutral-700 max-w-2xl text-white rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-6">Choose Withdrawal Method</h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <WithdrawCard
            label="Withdraw to Crypto Wallet"
            description="Transfer funds to your connected wallet in USDC or ꞘOLIO."
            icon={Banknote}
            onClick={() => onSelect("crypto")}
          />
          <WithdrawCard
            label="Request ACH Withdrawal"
            description="Send funds to your linked U.S. bank account via ACH."
            icon={Landmark}
            onClick={() => onSelect("ach")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlatformWithdrawModal;
