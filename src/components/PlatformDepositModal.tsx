// src/components/PlatformDepositModal.tsx
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "./Dialog";
import { DollarSign } from "lucide-react";

interface PlatformDepositModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (
    method: "stripe" | "crypto",
    receive: "USD" | "CREDITS"
  ) => void;
}

const DepositCard = ({
  label,
  description,
  image,
  imageClassName = "w-10 h-10",
  onClick,
}: {
  label: string;
  description: string;
  image: string;
  imageClassName?: string;
  onClick: () => void;
}) => (

  <div
    onClick={onClick}
    className="flex flex-col justify-between bg-black border border-neutral-700 rounded-xl p-6 text-left text-white hover:shadow-xl cursor-pointer hover:border-blue-600 transition-all duration-200 w-full max-w-sm"
  >
    <div className="flex items-center gap-4 mb-4">
      <img src={image} alt={label} className={`${imageClassName}`} />

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
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedMethod, setSelectedMethod] = useState<"stripe" | "crypto" | null>(null);
  const [receiveType, setReceiveType] = useState<"USD" | "CREDITS" | null>(null);

  useEffect(() => {
    if (open) {
      setStep(1);
      setSelectedMethod(null);
      setReceiveType(null);
    }
  }, [open]);

  const handleMethodSelect = (method: "stripe" | "crypto") => {
    setSelectedMethod(method);
    setStep(2);
  };

  const handleReceiveSelect = (receive: "USD" | "CREDITS") => {
    setReceiveType(receive);
    if (receive === "USD") {
      if (selectedMethod) {
        onSelect(selectedMethod, receive);
        setTimeout(() => {
          setStep(1);
          setSelectedMethod(null);
          setReceiveType(null);
        }, 300);
      }
    } else {
      setStep(3);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setStep(1);
          setSelectedMethod(null);
          setReceiveType(null);
          onClose();
        }
      }}
    >
      <DialogContent className="bg-[#0a0a0a] border border-neutral-700 max-w-2xl text-white rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-6">
          {step === 1
            ? "Choose Deposit Method"
            : step === 2
            ? "What do you want to receive?"
            : "Choose a Credit Tier"}
        </h2>

        {step === 1 && (
          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            <DepositCard
              label="Deposit with Stripe"
              description="Use your debit/credit card to deposit USD directly into your platform balance."
              image="/assets/stripelogo.png"
              onClick={() => handleMethodSelect("stripe")}
              imageClassName="w-[80px] h-[80px] object-contain"
            />


            <DepositCard
              label="Deposit with Crypto"
              description="Transfer USDC from your wallet to fund your platform balance."
              image="/assets/ethlogo.png"
              onClick={() => handleMethodSelect("crypto")}
              imageClassName="w-[50px] h-[50px] object-contain"
            />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col sm:flex-row justify-center items-stretch gap-4">
            {[{
              label: "Receive USD",
              description: "Deposit to receive USD in your platform balance.",
              icon: () => (
                <div className="bg-green-600 p-3 rounded-full">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              ),
              onClick: () => handleReceiveSelect("USD"),
            }, {
              label: "Receive Credits",
              description: "Deposit to receive non-withdrawable platform credits.",
              icon: () => <img src="/assets/isailogo.png" alt="Credits" className="w-14 h-14" />, // matched sizing
              onClick: () => handleReceiveSelect("CREDITS"),
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
            {[{
              name: "Starter",
              credits: "10,000",
              url: "https://buy.stripe.com/9B63cuaby361dOn9fr1ZS05",
            }, {
              name: "Pro",
              credits: "60,000",
              url: "https://buy.stripe.com/3cI28qerO361aCb77j1ZS06",
            }, {
              name: "Elite",
              credits: "350,000",
              url: "https://buy.stripe.com/bJe28q83q9up7pZajv1ZS07",
            }].map(({ name, credits, url }) => (
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
                >
                  Buy with Stripe
                </a>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlatformDepositModal;