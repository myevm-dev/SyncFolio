// src/components/SignatureModal.tsx
import React, { useState } from "react";
import SignaturePad from "./SignaturePad";
import { saveSignature } from "../lib/saveSignature";

interface Props {
  walletAddress: string;
  onClose: () => void;
  onSigned: () => void;
}

const SignatureModal: React.FC<Props> = ({ walletAddress, onClose, onSigned }) => {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (dataUrl: string) => {
    setSaving(true);
    try {
      await saveSignature(walletAddress, dataUrl);
      setSuccess(true);
      setTimeout(() => {
        setSaving(false);
        setSuccess(false);
        onSigned();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error saving signature:", err);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-neutral-900 rounded p-6 w-full max-w-md text-white">
        {success ? (
          <div className="text-center text-green-400 text-lg font-semibold">
            ✅ Signature saved!
          </div>
        ) : (
          <>
            <SignaturePad onSave={handleSave} disabled={saving} />
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 w-full text-white"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SignatureModal;
