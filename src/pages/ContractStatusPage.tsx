// ContractStatusPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useActiveAccount } from "thirdweb/react";
import SignatureModal from "../components/SignatureModal";
import JVAgreementModal from "../components/JVAgreementModal";
import SignYourContractStep from "../components/contractsteps/SignYourContractStep";
import SellerUploadStep from "../components/contractsteps/SellerUploadStep";
import DispoOptionsStep from "../components/contractsteps/DispoOptionsStep";
import JVAgreementStep from "../components/contractsteps/JVAgreementStep";
import { generateContractPdf } from "../lib/generateContractPdf";

const defaultSteps = [
  "Contract Signed by You",
  "Contract Signed by Seller",
  "Dispo Options",
  "JV Agreement Signed Between You and Syncfolio",
  "Searching for Buyer (Inspection Period)",
  "Buyer Identified and Committed",
  "Closed, Payment Credited to Account",
];

export default function ContractStatusPage() {
  const { id: contractId } = useParams();
  const account = useActiveAccount();
  const walletAddress = account?.address || "";
  const [contract, setContract] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [jvSigned, setJvSigned] = useState(false);
  const [showJvModal, setShowJvModal] = useState(false);

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
      setLoading(false);
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

  
  

  const steps = Array.isArray(contract?.steps) ? contract.steps : defaultSteps;
  const currentStep = Number.isInteger(contract?.statusIndex) ? contract.statusIndex : 0;

  return (
    <div className="max-w-xl mx-auto px-6 py-12 text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Contract Status</h1>
      <p className="text-center text-lg text-cyan-400 mb-8">{contract?.address}</p>

      <div className="h-2 rounded mb-8 bg-neutral-800 overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      <div className="relative">
        <div className="absolute left-4 top-2 bottom-2 w-1 bg-neutral-700 rounded" />
        <ul className="space-y-6 pl-10">
          {steps.map((label: string, index: number) => {
            let StepComponent = null;
            switch (index) {
              case 0:
                StepComponent = (
                  <SignYourContractStep
                    index={index}
                    currentStep={currentStep}
                    showForm={showForm}
                    setShowForm={setShowForm}
                    hasSignature={hasSignature}
                    setShowSignaturePad={setShowSignaturePad}
                    formData={formData}
                    setFormData={setFormData}
                    handleDownload={handleDownload}
                  />
                );
                break;
              case 1:
                StepComponent = <SellerUploadStep index={index} />;
                break;
              case 2:
                StepComponent = <DispoOptionsStep />;
                break;
              case 3:
                StepComponent = (
                  <JVAgreementStep
                    index={index}
                    currentStep={currentStep}
                    setShowJvModal={setShowJvModal}
                  />
                );
                break;
            }

            return (
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
                  <span className={`${index <= currentStep ? "text-white" : "text-neutral-500"}`}>{label}</span>
                  {StepComponent}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

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

      {showJvModal && (
        <JVAgreementModal
          onClose={() => setShowJvModal(false)}
          onConfirm={() => {
            setShowJvModal(false);
            alert("Generating JV Agreement...");
          }}
        />
      )}
    </div>
  );
}
