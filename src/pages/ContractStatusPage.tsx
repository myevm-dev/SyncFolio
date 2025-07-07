import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useActiveAccount } from "thirdweb/react";
import { generateContractPdf } from "../lib/generateContractPdf";
import SignatureModal from "../components/SignatureModal";

const defaultSteps = [
  "Contract Signed by You",
  "Contract Signed by Seller",
  "JV Agreement Signed Between You and Syncfolio",
  "Searching for Buyer (Inspection Period)",
  "Buyer Identified and Committed",
  "Closed, Payment Credited to Account"
];

const ContractStatusPage = () => {
  const { id: contractId } = useParams();
  const account = useActiveAccount();
  const walletAddress = account?.address || "";
  const [contract, setContract] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const [formData, setFormData] = useState({
    sellerName: "",
    sellerAddress: "",
    buyerName: "",
    buyerAddress: "",
    propertyAddress: "",
    purchasePrice: "",
    earnestMoney: "",
    balanceDue: "",
    closingDate: "",
    dueDiligenceDays: "7",
    state: "",
  });

  useEffect(() => {
    const fetchContract = async () => {
      if (!walletAddress || !contractId) return;
      try {
        const ref = doc(db, `users/${walletAddress}/contracts/${contractId}`);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setContract(data);
          setFormData((prev) => ({
            ...prev,
            propertyAddress: data.address || "",
          }));
        }
      } catch (err) {
        console.error("Failed to fetch contract:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [walletAddress, contractId]);

  useEffect(() => {
    const checkSignature = async () => {
      if (!walletAddress) return;
      const sigRef = doc(db, "signatures", walletAddress);
      const snap = await getDoc(sigRef);
      setHasSignature(snap.exists());
    };
    checkSignature();
  }, [walletAddress]);

  useEffect(() => {
    const price = parseFloat(formData.purchasePrice);
    const emd = parseFloat(formData.earnestMoney);
    if (!isNaN(price) && !isNaN(emd)) {
      const balance = (price - emd).toFixed(2);
      setFormData((prev) => ({ ...prev, balanceDue: balance }));
    }
  }, [formData.purchasePrice, formData.earnestMoney]);

  const handleDownload = async () => {
    if (Number(formData.dueDiligenceDays) < 7) {
      alert("Inspection period must be at least 7 business days.");
      return;
    }
    await generateContractPdf(formData);
    setShowForm(false);
  };

  if (loading) {
    return <div className="text-center text-white py-10">Loading contract status...</div>;
  }

  if (!contract) {
    return <div className="text-center text-red-500 py-10">Contract not found.</div>;
  }

  const steps = Array.isArray(contract.steps) ? contract.steps : defaultSteps;
  const currentStep = Number.isInteger(contract.statusIndex) ? contract.statusIndex : 0;

  return (
    <div className="max-w-xl mx-auto px-6 py-12 text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Contract Status</h1>
      <p className="text-center text-lg text-cyan-400 mb-8">{contract.address}</p>

      <div className="h-2 rounded mb-8 bg-neutral-800 overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      <div className="relative">
        <div className="absolute left-4 top-2 bottom-2 w-1 bg-neutral-700 rounded" />
        <ul className="space-y-6 pl-10">
          {steps.map((label: string, index: number) => (
            <li key={index} className="relative flex items-start gap-3">
              <div
                className={`relative z-10 w-6 h-6 flex items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 ${
                  index <= currentStep
                    ? "bg-green-500 border-green-500 text-black"
                    : "bg-black text-white border-white"
                }`}
              >
                {index + 1}
              </div>
              <div className="flex flex-col mt-1 gap-2">
                <span
                  className={`${
                    index <= currentStep ? "text-white" : "text-neutral-500"
                  }`}
                >
                  {label}
                </span>
                {index === 0 && currentStep === 0 && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="text-xs px-4 py-1 rounded bg-cyan-500 text-black font-semibold w-max"
                  >
                    Sign and Download
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-white text-center">Sign Your Contract</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData).map(([key, value], idx) => {
                const label =
                  key === "dueDiligenceDays"
                    ? "Inspection Period"
                    : key === "closingDate"
                    ? "Closing Date"
                    : key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

                if (key === "closingDate") {
                  return (
                    <div key={key} className="relative">
                      <input
                        type="date"
                        value={value}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, closingDate: e.target.value }))
                        }
                        className="p-2 w-full rounded bg-neutral-800 text-white text-sm appearance-none"
                      />
                      <div className="pointer-events-none absolute right-3 top-2.5 text-white text-sm">
                        📅
                      </div>
                    </div>
                  );
                }

                if (key === "state") {
                  const states = [
                    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN",
                    "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV",
                    "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN",
                    "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
                  ];
                  return (
                    <React.Fragment key={key}>
                      <select
                        className="p-2 rounded bg-neutral-800 text-white text-sm w-full"
                        value={value}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, state: e.target.value }))
                        }
                      >
                        <option value="" disabled>Select State</option>
                        {states.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        className="bg-white text-black px-4 py-2 rounded text-sm font-semibold w-full"
                        type="button"
                        onClick={() => {
                          if (hasSignature) {
                            alert("Signature already saved. Proceeding...");
                            // Optional: update contract step here
                          } else {
                            setShowSignaturePad(true);
                          }
                        }}
                      >
                        {hasSignature ? "Sign" : "Create Signature"}
                      </button>
                    </React.Fragment>
                  );
                }

                return (
                  <input
                    key={key}
                    className="p-2 rounded bg-neutral-800 text-white text-sm"
                    placeholder={label}
                    value={value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    disabled={key === "balanceDue"}
                  />
                );
              })}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="text-white px-4 py-1">
                Cancel
              </button>
              <button
                onClick={handleDownload}
                className="bg-green-500 text-black font-bold px-6 py-2 rounded"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {showSignaturePad && (
        <SignatureModal
          walletAddress={walletAddress}
          onClose={() => setShowSignaturePad(false)}
          onSigned={() => {
            setHasSignature(true);
            setShowSignaturePad(false);
          }}
        />
      )}
    </div>
  );
};

export default ContractStatusPage;
