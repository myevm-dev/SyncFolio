import React, { useState } from "react";
import StepOneBuyBoxForm from "./StepOneBuyBoxForm";
import StepTwoContactForm from "./StepTwoContactForm";
import StepThreeDeposit from "./StepThreeDeposit";
import { BuyBox } from "../types/Buybox";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

interface Props {
  onComplete?: () => void;
}

const SubmitBuyboxFlow: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [buybox, setBuybox] = useState<BuyBox>({
    cities: [],
    propertyType: "single family",
    hoa: false,
  });

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [depositConfirmed, setDepositConfirmed] = useState(false);

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  const handleFinalSubmit = async () => {
    const cities = buybox.cities || [];

    if (
      !buybox.bedMin ||
      !buybox.bathMin ||
      !buybox.sqftMin ||
      cities.length === 0 ||
      !depositConfirmed
    ) {
      alert("Please complete all required fields and confirm deposit.");
      return;
    }

    await Promise.all(
      cities.map((city: string) => {
        const individualBuybox = {
          ...buybox,
          city,
          cities: undefined,
          contact,
          depositConfirmed,
          timestamp: Date.now(),
        };
        return addDoc(collection(db, "buyboxes"), {
          ...individualBuybox,
          ownerId: contact.email || contact.phone || "unknown",
        });
      })
    );

    if (onComplete) onComplete();
  };

  const stepTitles = ["Buy Box", "User Details", "Confirm"];

  return (
    <div className="bg-[#0B1519] text-white p-4 rounded-xl border border-cyan-400 w-full max-w-2xl space-y-6">
      <h2 className="text-xl font-bold text-white text-center">
        Submit Your BuyBox
      </h2>

      <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-300">
        {stepTitles.map((title, index) => (
          <div
            key={index}
            className={`flex-1 text-center border-b-2 pb-2 ${
              step === index + 1
                ? "border-cyan-400 text-white"
                : "border-gray-600"
            }`}
          >
            Step {index + 1}: {title}
          </div>
        ))}
      </div>

      {step === 1 && (
        <StepOneBuyBoxForm
          form={buybox}
          setForm={setBuybox}
          onNext={next}
          onClose={onComplete || (() => {})}
        />
      )}

      {step === 2 && (
        <StepTwoContactForm
          contact={contact}
          setContact={setContact}
          onNext={next}
          onBack={prev}
        />
      )}

      {step === 3 && (
        <StepThreeDeposit
          form={buybox}
          confirmed={depositConfirmed}
          setConfirmed={setDepositConfirmed}
          onBack={prev}
          onSubmit={handleFinalSubmit}
        />
      )}
    </div>
  );
};

export default SubmitBuyboxFlow;
