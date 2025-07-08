// src/components/WalletDepositModal.tsx
import React from "react";
import { Dialog, DialogContent } from "./Dialog";
import { Send, ShoppingCart } from "lucide-react";

interface WalletDepositModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (method: "send" | "coinbase") => void;
}

const WalletDepositCard = ({
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
    className="flex flex-col justify-between bg-black border border-neutral-700 rounded-xl p-6 text-left text-white hover:shadow-xl cursor-pointer hover:border-blue-500 transition-all duration-200 w-full max-w-sm"
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

const WalletDepositModal: React.FC<WalletDepositModalProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border border-neutral-700 max-w-2xl text-white rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-6">Add Funds to Wallet</h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <WalletDepositCard
            label="Send from Another Wallet"
            description="Transfer tokens (USDC, ꞘOLIO, ETH) from an external wallet to your connected wallet address."
            icon={Send}
            onClick={() => onSelect("send")}
          />
          <WalletDepositCard
            label="Buy with Coinbase"
            description="Purchase crypto using Coinbase and deposit it directly into your wallet."
            icon={ShoppingCart}
            onClick={() => onSelect("coinbase")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletDepositModal;
