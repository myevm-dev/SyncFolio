// src/components/PlatformWithdrawModal.tsx
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "./Dialog";
import { Banknote, Landmark, DollarSign, Star } from "lucide-react";

interface PlatformWithdrawModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (
    method: "crypto" | "ach",
    tokenOrData?: "USDC" | "FOLIO" | { routing: string; account: string }
  ) => void;
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
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedMethod, setSelectedMethod] = useState<"crypto" | "ach" | null>(null);
  const [routing, setRouting] = useState("");
  const [account, setAccount] = useState("");

  useEffect(() => {
    if (open) {
      setStep(1);
      setSelectedMethod(null);
      setRouting("");
      setAccount("");
    }
  }, [open]);

  const handleMethodSelect = (method: "crypto" | "ach") => {
    setSelectedMethod(method);
    setStep(2);
  };

  const handleTokenSelect = (token: "USDC" | "FOLIO") => {
    onSelect("crypto", token);
    reset();
  };

  const handleAchSubmit = () => {
    if (routing && account) {
      onSelect("ach", { routing, account });
      reset();
    }
  };

  const reset = () => {
    setTimeout(() => {
      setStep(1);
      setSelectedMethod(null);
      setRouting("");
      setAccount("");
      onClose();
    }, 200);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setStep(1);
          setSelectedMethod(null);
          setRouting("");
          setAccount("");
          onClose();
        }
      }}
    >
      <DialogContent className="bg-[#0a0a0a] border border-neutral-700 max-w-2xl text-white rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-6">
          {step === 1
            ? "Choose Withdrawal Method"
            : selectedMethod === "crypto"
            ? "Withdraw to Crypto Wallet"
            : "Enter ACH Bank Info"}
        </h2>

        {step === 1 && (
          <div className="flex flex-col sm:flex-row gap-6">
            <WithdrawCard
              label="Withdraw to Crypto Wallet"
              description="Transfer funds to your connected wallet in USDC or ꞘOLIO."
              icon={Banknote}
              onClick={() => handleMethodSelect("crypto")}
            />
            <WithdrawCard
              label="Request ACH Withdrawal"
              description="Send funds to your linked U.S. bank account via ACH."
              icon={Landmark}
              onClick={() => handleMethodSelect("ach")}
            />
          </div>
        )}

        {step === 2 && selectedMethod === "crypto" && (
          <div className="flex flex-col sm:flex-row justify-center items-stretch gap-4">
            {[
              {
                label: "Withdraw USDC",
                icon: DollarSign,
                onClick: () => handleTokenSelect("USDC"),
              },
              {
                label: "Withdraw ꞘOLIO",
                icon: Star,
                onClick: () => handleTokenSelect("FOLIO"),
              },
            ].map(({ label, icon, onClick }) => (
              <div
                key={label}
                onClick={onClick}
                className="flex flex-col justify-start items-center text-center bg-black border border-neutral-700 rounded-xl px-6 py-8 text-white hover:shadow-xl cursor-pointer hover:border-red-600 transition-all min-w-[200px] min-h-[200px]"
              >
                <div className="bg-red-700 p-3 rounded-full mb-3">
                  {React.createElement(icon, { className: "w-6 h-6 text-white" })}
                </div>
                <h3 className="text-lg font-semibold mb-2">{label}</h3>
              </div>
            ))}
          </div>
        )}

        {step === 2 && selectedMethod === "ach" && (
          <div className="space-y-4">
            <input
              className="w-full bg-neutral-900 text-white border border-neutral-700 p-3 rounded-lg"
              placeholder="Routing Number"
              value={routing}
              onChange={(e) => setRouting(e.target.value)}
            />
            <input
              className="w-full bg-neutral-900 text-white border border-neutral-700 p-3 rounded-lg"
              placeholder="Account Number"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            />
            <button
              onClick={handleAchSubmit}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
            >
              Submit ACH Withdrawal Request
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlatformWithdrawModal;
