// SubmitBuyboxModal.tsx (Parent)
import React, { useState } from "react";
import StepOneBuyBoxForm from "./StepOneBuyBoxForm";
import StepTwoContactForm from "./StepTwoContactForm";
import StepThreeDeposit from "./StepThreeDeposit";
import { BuyBox } from "../types/BuyBox";

interface Props {
  onClose: () => void;
  onSubmit: (data: { buybox: BuyBox; contact: any; depositConfirmed: boolean }) => void;
}

const SubmitBuyboxModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [buybox, setBuybox] = useState<BuyBox>({
    city: "",
    propertyType: "single family",
    bedMin: 1,
    bathMin: 1,
    sqftMin: 0,
    hoa: false,
  });
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [depositConfirmed, setDepositConfirmed] = useState(false);

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  const handleFinalSubmit = () => {
    onSubmit({ buybox, contact, depositConfirmed });
    onClose();
  };

  const stepTitles = ["Buy Box", "User Details", "Deposit"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-[#0B1519] text-white p-6 rounded-xl border border-cyan-400 w-full max-w-2xl space-y-6 overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-bold text-cyan-400">Submit Your BuyBox</h2>

        <div className="flex justify-between text-sm font-medium text-gray-300">
          {stepTitles.map((title, index) => (
            <div key={index} className={`flex-1 text-center border-b-2 pb-2 ${
              step === index + 1 ? "border-cyan-400 text-white" : "border-gray-600"
            }`}>
              Step {index + 1}: {title}
            </div>
          ))}
        </div>

        {step === 1 && <StepOneBuyBoxForm form={buybox} setForm={setBuybox} onNext={next} onClose={onClose} />}
        {step === 2 && <StepTwoContactForm contact={contact} setContact={setContact} onNext={next} onBack={prev} />}
        {step === 3 && <StepThreeDeposit confirmed={depositConfirmed} setConfirmed={setDepositConfirmed} onBack={prev} onSubmit={handleFinalSubmit} />}
      </div>
    </div>
  );
};

export default SubmitBuyboxModal;