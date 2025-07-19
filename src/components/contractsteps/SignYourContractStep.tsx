import React, { useEffect, useState } from "react";
import SignatureModal from "../SignatureModal";
import { useActiveAccount } from "thirdweb/react";
import { getFirestore, doc, getDoc } from "firebase/firestore";

interface Props {
  index: number;
  currentStep: number;
  showForm: boolean;
  setShowForm: (value: boolean) => void;
  formData: {
    [key: string]: string;
  };
  setFormData: (data: any) => void;
  handleDownload: () => void;
}

export default function SignYourContractStep({
  index,
  currentStep,
  showForm,
  setShowForm,
  formData,
  setFormData,
  handleDownload,
}: Props) {
  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS",
    "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY",
    "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV",
    "WI", "WY",
  ];

  const account = useActiveAccount();
  const walletAddress = account?.address || "";

  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [checkingSig, setCheckingSig] = useState(true);
  const [showUseTheirModal, setShowUseTheirModal] = useState(false);

  useEffect(() => {
    const checkSignature = async () => {
      if (!walletAddress) return;
      const db = getFirestore();
      const ref = doc(db, `users/${walletAddress}/signatures/default`);
      const snap = await getDoc(ref);
      setHasSignature(snap.exists());
      setCheckingSig(false);
    };
    checkSignature();
  }, [walletAddress]);

  if (index > currentStep) return null;

  const labelOverride: Record<string, string> = {
    buyerName: "Your Name",
    buyerAddress: "Your Address",
  };

  return (
    <>
      <div className="w-[250px] md:w-[440px] bg-black border border-cyan-500 rounded-xl p-6 shadow-md flex flex-col text-center">
        <p className="text-white font-semibold text-lg mb-4">Contract Signature</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              if (hasSignature) setShowForm(true);
              else setShowSignatureModal(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded font-semibold w-full"
          >
            Generate Contract
          </button>

          <button
            onClick={() => setShowUseTheirModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded font-semibold w-full"
          >
            Use Their Contract
          </button>
        </div>
      </div>

      {showUseTheirModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded w-full max-w-lg text-white">
            <h2 className="text-lg font-bold mb-4 text-center">Use Seller's Contract</h2>
            <p className="mb-6 text-sm text-center">
              Go ahead and sign, be sure to verify it says there is a <span className="font-bold text-cyan-400">7 business day inspection period</span> that you can cancel for any reason. <br/><br/>Also, make sure that it <span className="font-bold text-cyan-400">does not state anywhere that the contract is non assignable</span>.
              <br/><br/>Then continue to the next step to upload the contract once signed.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowUseTheirModal(false)}
                className="px-4 py-2 rounded bg-neutral-700 hover:bg-neutral-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowForm(true);
                  setShowUseTheirModal(false);
                }}
                className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && index === currentStep && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-white text-center">Sign & Generate Contract</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData).map(([key, value]) => {
                if ([
                  "earnestMoney",
                  "balanceDue",
                  "closingDate",
                  "dueDiligenceDays",
                  "state",
                  "daysToClose",
                ].includes(key)) {
                  return null;
                }

                const label = labelOverride[key] || key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());

                return (
                  <input
                    key={key}
                    className="p-2 rounded bg-neutral-800 text-white text-sm"
                    placeholder={label}
                    value={value}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                  />
                );
              })}

              <input
                key="earnestMoney"
                className="p-2 rounded bg-neutral-800 text-white text-sm"
                placeholder="Earnest Money ($1500?)"
                value={formData.earnestMoney}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    earnestMoney: e.target.value,
                  }))
                }
              />
              <div className="relative">
                <input
                  key="balanceDue"
                  className="p-2 rounded bg-neutral-800 text-sm text-gray-400 italic w-full pr-8"
                  placeholder="Balance Due (auto)"
                  value={formData.balanceDue}
                  disabled
                />
                <div className="pointer-events-none absolute right-2 top-2 text-white text-sm">🔒</div>
              </div>

              <div className="relative">
                <input
                  type="date"
                  value={formData.closingDate}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      closingDate: e.target.value,
                    }))
                  }
                  className="p-2 w-full rounded bg-neutral-800 text-white text-sm appearance-none"
                />
                <div className="pointer-events-none absolute right-3 top-2.5 text-white text-sm">📅</div>
              </div>
              <input
                key="daysToClose"
                className="p-2 rounded bg-neutral-800 text-white text-sm"
                placeholder="Days to Close (30 Days?)"
                value={formData.daysToClose || ""}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    daysToClose: e.target.value,
                  }))
                }
              />
              <input
                key="dueDiligenceDays"
                className="p-2 rounded bg-neutral-800 text-white text-sm"
                placeholder="Inspection Days (7+)"
                value={formData.dueDiligenceDays}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    dueDiligenceDays: e.target.value,
                  }))
                }
              />
              <select
                key="state"
                className="p-2 rounded bg-neutral-800 text-white text-sm"
                value={formData.state}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    state: e.target.value,
                  }))
                }
              >
                <option value="" disabled>Select State</option>
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="text-white px-4 py-1 hover:underline"
              >
                Cancel
              </button>
              <div className="w-[250px] md:w-[320px]">
                <button
                  onClick={handleDownload}
                  className="w-full px-6 py-3 rounded bg-neutral-800 border border-cyan-500 hover:bg-cyan-600 hover:text-black text-white text-center font-semibold transition"
                  disabled={!hasSignature}
                >
                  Sign and Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSignatureModal && (
        <SignatureModal
          walletAddress={walletAddress}
          onClose={() => setShowSignatureModal(false)}
          onSigned={() => {
            setHasSignature(true);
            setShowSignatureModal(false);
          }}
        />
      )}
    </>
  );
}
