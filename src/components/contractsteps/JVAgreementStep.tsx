import React from "react";

interface Props {
  index: number;
  currentStep: number;
  setShowJvModal: (open: boolean) => void;
}

export default function JVAgreementStep({ index, currentStep, setShowJvModal }: Props) {
  if (index !== currentStep) return null;

  return (
    <button
      onClick={() => setShowJvModal(true)}
      className="text-xs px-4 py-1 rounded bg-cyan-500 text-black font-semibold w-max"
    >
      Sign and Download JV Agreement
    </button>
  );
}
