import React from "react";

interface Props {
  index: number;
  currentStep: number;
  setShowJvModal: (open: boolean) => void;
  handleJvDownload: () => void;
}

export default function JVAgreementStep({
  index,
  currentStep,
  setShowJvModal,
  handleJvDownload,
}: Props) {
  if (index > currentStep) return null;

  return (
    <div className="w-[320px]">
      <button
        onClick={() => {
          setShowJvModal(true);
          setTimeout(() => handleJvDownload(), 0);
        }}
        className="w-full px-6 py-4 rounded bg-neutral-800 border border-cyan-500 hover:bg-cyan-600 hover:text-black text-white text-center font-semibold transition"
      >
        Sign and Download JV Agreement
      </button>
    </div>
  );
}
