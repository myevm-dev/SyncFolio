// src/components/JVAgreementModal.tsx
import React from "react";
import { Info } from "lucide-react"; // make sure lucide-react is installed

interface Props {
  onClose: () => void;
  onConfirm: () => void;
}

const JVAgreementModal: React.FC<Props> = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md text-white">
        <h2 className="text-xl font-bold mb-4 text-center text-cyan-400">
          JV Agreement Summary
        </h2>

        <p className="text-sm text-center mb-6 space-y-2">
          <>
            If this deal closes, you will receive{" "}
            <span className="font-semibold text-green-400">40%</span> of the
            total assignment fee, or a minimum of{" "}
            <span className="font-semibold text-green-400">$2250</span> +{" "}
            <span className="font-semibold" style={{ color: "#ff00ff" }}>
              Bonus 50k Ꞙolio Token
            </span>
            , whichever is <span className="font-bold">MORE</span>.
            <br />
            <br />
            The assignment fee is split as follows:
            <br />
            <span className="text-green-400 font-semibold">• 40%</span> to you (for sourcing the deal)
            <br />
            <span className="text-cyan-400 font-semibold">• 40%</span> to the Dispo partner (for finding the buyer)
            <br />
            <span className="text-yellow-400 font-semibold">• 20%</span> platform fee (for managing compliance, contracts, and infrastructure)
            <br />
            <br />
            Syncfolio or one of its approved partners will handle the assignment and funding process, ensuring all parties are paid based on the structure above.
          </>
        </p>

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
          >
            Confirm and Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default JVAgreementModal;
