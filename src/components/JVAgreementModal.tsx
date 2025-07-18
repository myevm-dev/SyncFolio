// src/components/JVAgreementModal.tsx
import React from "react";
import { Info } from "lucide-react";
import AuctionJVAgreement from "./agreements/AuctionAgreement";
import DealFlowAgreement from "./agreements/DealFlowAgreement";
import SyncDispoAgreement from "./agreements/SyncDispoAgreement";

interface Props {
  onClose: () => void;
  onConfirm: () => void;
  dispoChoice: "auction" | "dealflow" | "syncdispo";
}

const JVAgreementModal: React.FC<Props> = ({ onClose, onConfirm, dispoChoice }) => {
  const renderAgreement = () => {
    switch (dispoChoice) {
      case "auction":
        return <AuctionJVAgreement />;
      case "dealflow":
        return <DealFlowAgreement />;
      case "syncdispo":
        return <SyncDispoAgreement />;
      default:
        return <p className="text-sm text-center text-red-400">Invalid dispo option selected.</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md text-white">
        <h2 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          JV Agreement Summary
        </h2>

        {renderAgreement()}

        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-4">
          <Info size={16} className="text-blue-400" />
          In the future, you'll be able to choose your own buyer or 3rd party dispo from the platform.
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded w-full mr-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded w-full ml-2"
            disabled={!dispoChoice}
          >
            Confirm and Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default JVAgreementModal;