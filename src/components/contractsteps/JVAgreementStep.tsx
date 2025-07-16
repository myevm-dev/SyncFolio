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
    <button
      onClick={() => {
        setShowJvModal(true);
        setTimeout(() => {
          handleJvDownload();
        }, 0);
      }}
      className="px-4 py-2 rounded bg-neutral-800 border border-cyan-500 hover:bg-cyan-600 hover:text-black text-white font-semibold w-full text-left"
    >
      Sign and Download JV Agreement
    </button>
  );
}
