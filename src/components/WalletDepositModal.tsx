// src/components/WalletDepositModal.tsx
import React, { useState } from "react";
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
  const [step, setStep] = useState<1 | 2>(1);

  const handleSelect = (method: "send" | "coinbase") => {
    if (method === "coinbase") {
      setStep(2);
    } else {
      onSelect(method);
      onClose();
    }
  };

  const handleBack = () => setStep(1);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border border-neutral-700 max-w-2xl text-white rounded-2xl p-8">
        {step === 1 ? (
          <>
            <h2 className="text-xl font-bold mb-6">Add Funds to Wallet</h2>
            <div className="flex flex-col sm:flex-row gap-6">
              <WalletDepositCard
                label="Send from Another Wallet"
                description="Transfer tokens (USDC, ꞘOLIO, ETH) from an external wallet to your connected wallet address."
                icon={Send}
                onClick={() => handleSelect("send")}
              />
              <WalletDepositCard
                label="Buy with Coinbase"
                description="Purchase crypto using Coinbase and deposit it directly into your wallet."
                icon={ShoppingCart}
                onClick={() => handleSelect("coinbase")}
              />
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">Buy with Coinbase</h2>
            <p className="text-sm text-gray-400 mb-6 text-center">
              In the top right of the App, click on your wallet, then click buy to purchase crypto using Coinbase. You may purchase USDC or ETH, but you must keep a small amount of ETH to pay for network transaction fees.
            </p>
            <div className="flex flex-col items-center gap-4">
              <img
                src="/assets/clickwallet.png"
                alt="Click Wallet"
                className="w-full max-w-sm rounded shadow"
              />
              <img
                src="/assets/clickbuy.png"
                alt="Click Buy"
                className="w-full max-w-sm rounded shadow"
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
              >
                Back
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WalletDepositModal;
