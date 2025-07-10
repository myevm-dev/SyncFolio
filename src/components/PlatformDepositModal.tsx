// src/components/PlatformDepositModal.tsx
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "./Dialog";

interface PlatformDepositModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (
    method: "stripe" | "crypto",
    receive: "CREDITS"
  ) => void;
}

const PlatformDepositModal: React.FC<PlatformDepositModalProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  const [step, setStep] = useState<1 | 3>(1);
  const [selectedMethod, setSelectedMethod] = useState<"stripe" | "crypto" | null>(null);

  useEffect(() => {
    if (open) {
      setStep(1);
      setSelectedMethod(null);
    }
  }, [open]);

  const handleMethodSelect = (method: "stripe" | "crypto") => {
    setSelectedMethod(method);
    setStep(3); // Skip straight to credit tiers
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setStep(1);
          setSelectedMethod(null);
          onClose();
        }
      }}
    >
      <DialogContent className="bg-[#0a0a0a] border border-neutral-700 max-w-2xl text-white rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-6">
          {step === 1
            ? "Choose Deposit Method"
            : "Choose a Credit Tier"}
        </h2>

        {step === 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-stretch gap-4 mb-6">
            {[{
              label: "Deposit with Stripe",
              description: "Use your debit/credit card to deposit USD to your platform balance.",
              icon: () => (
                <img
                  src="/assets/stripelogo.png"
                  alt="Stripe"
                  className="w-14 h-14 object-contain"
                />
              ),
              onClick: () => handleMethodSelect("stripe"),
            }, {
              label: "Deposit with Crypto",
              description: "Transfer an altcoin from your basechain wallet to fund your platform balance.",
              icon: () => (
                <img
                  src="/assets/ethlogo.png"
                  alt="Ethereum"
                  className="w-14 h-14 object-contain"
                />
              ),
              onClick: () => handleMethodSelect("crypto"),
            }].map(({ label, description, icon, onClick }) => (
              <div
                key={label}
                onClick={onClick}
                className="flex flex-col justify-start items-center text-center bg-black border border-neutral-700 rounded-xl px-6 py-8 text-white hover:shadow-xl cursor-pointer hover:border-blue-600 transition-all min-w-[200px] min-h-[220px]"
              >
                <div className="mb-3">{icon()}</div>
                <h3 className="text-lg font-semibold mb-2">{label}</h3>
                <p className="text-gray-400 text-sm max-w-[200px]">{description}</p>
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col sm:flex-row justify-center items-stretch gap-4">
            {[
              {
                name: "Starter",
                credits: "10,000",
                stripeUrl: "https://buy.stripe.com/9B63cuaby361dOn9fr1ZS05",
                cryptoUrl: "https://your-dapp.com/pay/starter", // Replace with your crypto logic
              },
              {
                name: "Pro",
                credits: "60,000",
                stripeUrl: "https://buy.stripe.com/3cI28qerO361aCb77j1ZS06",
                cryptoUrl: "https://your-dapp.com/pay/pro",
              },
              {
                name: "Elite",
                credits: "350,000",
                stripeUrl: "https://buy.stripe.com/bJe28q83q9up7pZajv1ZS07",
                cryptoUrl: "https://your-dapp.com/pay/elite",
              },
            ].map(({ name, credits, stripeUrl, cryptoUrl }) => {
              const isStripe = selectedMethod === "stripe";
              const url = isStripe ? stripeUrl : cryptoUrl;
              const label = isStripe ? "Buy with Stripe" : "Buy with Crypto";

              return (
                <div
                  key={name}
                  className="bg-black border border-neutral-700 rounded-xl p-6 flex flex-col items-center min-w-[200px]"
                >
                  <img src="/assets/isailogo.png" alt="Logo" className="w-10 h-10 mb-3" />
                  <h3 className="text-white text-lg font-bold mb-1">{name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{credits} Credits</p>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto text-blue-400 hover:underline"
                    onClick={() => {
                      if (selectedMethod) onSelect(selectedMethod, "CREDITS");
                    }}
                  >
                    {label}
                  </a>
                </div>
              );
            })}
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
};

export default PlatformDepositModal;
