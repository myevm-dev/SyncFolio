import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useActiveAccount } from "thirdweb/react";

const steps = [
  "Submitted to Syncfolio",
  "Dispo Terms Accepted by Syncfolio",
  "Contract Signed by Seller",
  "Sent for Dispo (Buyer Search Ongoing)",
  "Buyer Identified and Committed",
  "Closed, Payment Credited to Account"
];

const ContractStatusPage = () => {
  const { contractId } = useParams();
  const account = useActiveAccount();
  const walletAddress = account?.address || "";
  const [contract, setContract] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContract = async () => {
      if (!walletAddress || !contractId) return;
      try {
        const ref = doc(db, `users/${walletAddress}/contracts/${contractId}`);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setContract(snap.data());
        }
      } catch (err) {
        console.error("Failed to fetch contract:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [walletAddress, contractId]);

  if (loading) {
    return <div className="text-center text-white py-10">Loading contract status...</div>;
  }

  if (!contract) {
    return <div className="text-center text-red-500 py-10">Contract not found.</div>;
  }

  const currentStep = typeof contract.statusIndex === "number" ? contract.statusIndex : 0;

  return (
    <div className="max-w-xl mx-auto px-6 py-12 text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Contract Status</h1>
      <p className="text-center text-lg text-cyan-400 mb-8">{contract.address}</p>

      <div className="relative">
        <div className="absolute left-4 top-2 bottom-2 w-1 bg-neutral-700 rounded" />
        <ul className="space-y-6 pl-10">
          {steps.map((label, index) => (
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
              <span
                className={`mt-1 ${
                  index <= currentStep ? "text-white" : "text-neutral-500"
                }`}
              >
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContractStatusPage;