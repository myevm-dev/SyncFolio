import React, { useEffect, useState } from "react";
import SignaturePad from "./SignaturePad";
import { saveSignature } from "../lib/saveSignature";
import { getAuth } from "firebase/auth";

// Debug log to confirm Firebase UID (optional)
console.log("🔥 Firebase UID:", getAuth().currentUser?.uid);

interface Props {
  walletAddress: string;
  onClose: () => void;
  onSigned: () => void;
}

const SignatureModal: React.FC<Props> = ({ walletAddress, onClose, onSigned }) => {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!walletAddress) {
      setError("❌ No wallet address found. Please connect your wallet.");
    }
  }, [walletAddress]);

  const handleSave = async (dataUrl: string) => {
    console.log("📥 handleSave called with dataUrl length:", dataUrl.length);

    if (!walletAddress || !dataUrl) {
      setError("❌ Missing wallet or signature.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await saveSignature(walletAddress, dataUrl);
      console.log("✅ Signature saved successfully.");
      setSuccess(true);
      setTimeout(() => {
        setSaving(false);
        setSuccess(false);
        onSigned();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("🔥 Error saving signature:", err);
      setError("❌ Failed to save. Check console.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-neutral-900 rounded p-6 w-full max-w-md text-white text-center">
        {error && (
          <div className="text-red-400 text-sm mb-4">{error}</div>
        )}

        {!walletAddress ? (
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 w-full text-white"
          >
            Close
          </button>
        ) : success ? (
          <div className="text-green-400 text-lg font-semibold">✅ Signature saved!</div>
        ) : (
          <>
            <SignaturePad onSave={handleSave} disabled={saving} />
            {saving && <div className="text-blue-400 mt-3 text-sm">Saving...</div>}
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 w-full text-white"
              disabled={saving}
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
