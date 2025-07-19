import React from "react";

interface Props {
  index: number;
  currentStep: number;
  setShowJvModal: (open: boolean) => void;
  handleJvDownload: () => Promise<void>;
}

export default function JVAgreementStep({
  index,
  currentStep,
  setShowJvModal,
  handleJvDownload,
}: Props) {
  if (index > currentStep) return null;

  return (
    <div className="w-[250px] md:w-[440px] bg-black border border-cyan-500 rounded-xl p-6 shadow-md flex flex-col text-center">
      <p className="text-white font-semibold text-lg mb-4">
        Joint Venture Agreement
      </p>
      <button
        onClick={() => {
          setShowJvModal(true);
          setTimeout(() => handleJvDownload(), 0); // optional, depending on intent
        }}
        className="w-full py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white transition"
      >
        Sign & Download JV Agreement
      </button>
    </div>
  );
}
