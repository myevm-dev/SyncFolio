// src/components/WalletDepositModal.tsx
import React, { useState } from "react";
import { Dialog, DialogContent } from "./Dialog";
import { Send, ShoppingCart } from "lucide-react";

interface WalletDepositModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (method: "send" | "coinbase") => void;
  walletAddress: string;
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
  walletAddress,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handleSelect = (method: "send" | "coinbase") => {
    if (method === "coinbase") {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  const handleBack = () => setStep(1);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setStep(1);         // Reset to step 1
          onClose();          // Then call the provided onClose
        }
      }}
    >
      <DialogContent className="bg-[#0a0a0a] border border-neutral-700 max-w-2xl text-white rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        {step === 1 && (
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
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-bold mb-4">Buy with Coinbase</h2>
              <p className="text-sm text-gray-400 mb-6 text-center max-w-2xl mx-auto leading-relaxed">
                In the top-right corner of the app, click on your wallet, <br/>then click <span className="text-blue-400">“Buy”</span> to purchase crypto using <span className="text-blue-400">Coinbase</span>. <br/><br/>You may purchase <span className="text-blue-400">USDC</span> or <span className="text-blue-400">ETH</span>, but be sure to keep a small<br/> amount of <span className="text-blue-400">ETH</span> in your wallet to cover network transaction fees.
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

        {step === 3 && (
          <>
            <h2 className="text-xl font-bold mb-4">Send From Another Wallet</h2>
            <div className="bg-black border border-zinc-800 rounded-lg p-4 text-sm space-y-2">
              <div>
                <span className="text-gray-400">Network:</span>{" "}
                <span className="text-white font-semibold">BaseChain (Chain ID 10)</span>
              </div>
              <div>
                <span className="text-gray-400">Your Wallet Address:</span>
                <div className="mt-1 break-all font-mono text-green-400">{walletAddress}</div>
              </div>
              <div>
                <a
                  href={`https://basescan.org/address/${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline text-sm"
                >
                  View on Basescan ↗
                </a>
              </div>
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
