// src/components/WalletWithdrawModal.tsx
import React from "react";
import { Dialog, DialogContent } from "./Dialog";
import { Send, Landmark } from "lucide-react";

interface WalletWithdrawModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (method: "wallet" | "coinbase") => void;
}

const WalletWithdrawCard = ({
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
    className="flex flex-col justify-between bg-black border border-neutral-700 rounded-xl p-6 text-left text-white hover:shadow-xl cursor-pointer hover:border-red-500 transition-all duration-200 w-full max-w-sm"
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

const WalletWithdrawModal: React.FC<WalletWithdrawModalProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border border-neutral-700 max-w-2xl text-white rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-6">Withdraw from Wallet</h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <WalletWithdrawCard
            label="Withdraw to Another Wallet"
            description="Send USDC, ꞘOLIO, or ETH from your connected wallet to any other address."
            icon={Send}
            onClick={() => {
              onSelect("wallet");
              onClose();
            }}
          />
          <WalletWithdrawCard
            label="Withdraw to Coinbase"
            description="Transfer funds to your Coinbase account using Coinbase Wallet or Pay."
            icon={Landmark}
            onClick={() => {
              onSelect("coinbase");
              onClose();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletWithdrawModal;
