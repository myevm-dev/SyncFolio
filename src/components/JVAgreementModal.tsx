import React from "react";

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
        <p className="text-sm text-center mb-6">
          If this deal closes, you will receive{" "}
          <span className="font-semibold text-green-400">40%</span> or a minimum of{" "}
          <span className="font-semibold text-green-400">$2250</span> +{" "}
          <span className="font-semibold" style={{ color: "#ff00ff" }}>
            Bonus 𝒇olio Token
          </span>
          , whichever is more.
          <br />
          <br />
          Syncfolio and/or any partner needed to secure a buyer will retain the remaining assignment fee.
        </p>
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
