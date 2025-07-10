// src/components/WalletWithdrawModal.tsx
import React, { useState, useEffect } from "react";
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
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (!open) setStep(1);
  }, [open]);

  const handleBack = () => setStep(1);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setStep(1);
          onClose();
        }
      }}
    >
      <DialogContent className="bg-[#0a0a0a] border border-neutral-700 max-w-2xl text-white rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold mb-6">Withdraw from Wallet</h2>
            <div className="flex flex-col sm:flex-row gap-6">
              <WalletWithdrawCard
                label="Withdraw to Another Wallet"
                description="Send USDC, ꞘOLIO, or ETH from your connected wallet to any other address."
                icon={Send}
                onClick={() => setStep(2)}
              />
              <WalletWithdrawCard
                label="Withdraw to Coinbase"
                description="Transfer funds to your Coinbase account using Coinbase Wallet or Pay."
                icon={Landmark}
                onClick={() => {
                  window.open("https://www.coinbase.com/signin", "_blank");
                  onSelect("coinbase");
                  onClose();
                }}
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-bold mb-4">Withdraw to Another Wallet</h2>
            <p className="text-sm text-gray-400 mb-6 text-center max-w-2xl mx-auto leading-relaxed">
              In the top-right of the app, click on your wallet, then click <span className="text-red-400">“Send”</span> to transfer funds to another wallet. <br /><br />
              Enter the destination address and token amount. Make sure to keep some <span className="text-red-400">ETH</span> in your wallet to pay for network transaction fees.
            </p>
            <div className="flex flex-col items-center gap-4">
              <img
                src="/assets/clickwallet.png"
                alt="Click Wallet"
                className="w-full max-w-sm rounded shadow"
              />
              <img
                src="/assets/clicksend.png"
                alt="Click Send"
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

export default WalletWithdrawModal;
