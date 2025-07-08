import React, { useState } from "react";
import { Dialog, DialogContent } from "./Dialog";
import { Banknote, CreditCard, DollarSign, Star, Zap } from "lucide-react";

interface PlatformDepositModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (method: "stripe" | "crypto", receive: "USD" | "FOLIO" | "CREDITS") => void;
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
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedMethod, setSelectedMethod] = useState<"stripe" | "crypto" | null>(null);

  const handleMethodSelect = (method: "stripe" | "crypto") => {
    setSelectedMethod(method);
    setStep(2);
  };

  const handleReceiveSelect = (receive: "USD" | "FOLIO" | "CREDITS") => {
    if (selectedMethod) {
      onSelect(selectedMethod, receive);
      setTimeout(() => {
        setStep(1);
        setSelectedMethod(null);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border border-neutral-700 max-w-2xl text-white rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-6">
          {step === 1 ? "Choose Deposit Method" : "What do you want to receive?"}
        </h2>

        {step === 1 && (
          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            <DepositCard
              label="Deposit with Stripe"
              description="Use your debit/credit card to deposit USD directly into your platform balance."
              icon={CreditCard}
              onClick={() => handleMethodSelect("stripe")}
            />
            <DepositCard
              label="Deposit with Crypto"
              description="Transfer USDC or ꞘOLIO from your wallet to fund your platform balance."
              icon={Banknote}
              onClick={() => handleMethodSelect("crypto")}
            />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col sm:flex-row justify-center items-stretch gap-4">
            {[
              {
                label: "Receive USD",
                description: "Deposit to receive USD in your platform balance.",
                icon: DollarSign,
                onClick: () => handleReceiveSelect("USD"),
              },
              {
                label: "Receive ꞘOLIO",
                description: "Deposit to receive ꞘOLIO tokens in your platform balance.",
                icon: Star,
                onClick: () => handleReceiveSelect("FOLIO"),
              },
              {
                label: "Receive Credits",
                description: "Deposit to receive non-withdrawable platform credits.",
                icon: Zap,
                onClick: () => handleReceiveSelect("CREDITS"),
              },
            ].map(({ label, description, icon, onClick }) => (
              <div
                key={label}
                onClick={onClick}
                className="flex flex-col justify-start items-center text-center bg-black border border-neutral-700 rounded-xl px-6 py-8 text-white hover:shadow-xl cursor-pointer hover:border-blue-600 transition-all min-w-[200px] min-h-[220px]"
              >
                <div className="bg-blue-700 p-3 rounded-full mb-3">
                  {React.createElement(icon, { className: "w-6 h-6 text-white" })}
                </div>
                <h3 className="text-lg font-semibold mb-2">{label}</h3>
                <p className="text-gray-400 text-sm max-w-[200px]">{description}</p>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlatformDepositModal;
