import React from "react";
import { useActiveAccount } from "thirdweb/react";
import SignaturePad from "./SignaturePad";
import { saveSignature } from "../lib/saveSignature";

const SignatureModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const account = useActiveAccount();

  const handleSave = async (dataUrl: string) => {
    if (!account?.address) {
      alert("No wallet connected");
      return;
    }

    await saveSignature(account.address, dataUrl);
    alert("Signature saved to Firebase!");
    onClose(); // close modal after save
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md text-black">
        <h2 className="text-xl font-bold mb-4 text-center">Sign Below</h2>
        <SignaturePad onSave={handleSave} />
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="text-sm px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;
