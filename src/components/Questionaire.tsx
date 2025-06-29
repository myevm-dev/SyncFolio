import React, { useState, useEffect } from "react";
import { DealInput } from "../types/DealInput";
import ScriptModal from "./ScriptModal";
import PropertySection from "./sections/PropertySection";
import ContactInfoSection from "./sections/ContactInfoSection";
import MortgageSection from "./sections/MortgageSection";
import DiscoveryCallSection from "./sections/DiscoveryCallSection";
import FormActions from "./sections/FormActions";
import {
  collection,
  addDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

interface Props {
  onSubmit: (data: DealInput) => void;
  onSaveSuccess: () => void;
  formData: DealInput;
  setFormData: React.Dispatch<React.SetStateAction<DealInput>>;
  walletAddress: string;
  currentDealId: string | null;
  setCurrentDealId: React.Dispatch<React.SetStateAction<string | null>>;
}

const emptyForm: DealInput = {
  address: "",
  zillowUrl: "",
  beds: "",
  baths: "",
  listingPrice: "",
  rentalValue: "",
  rehabCost: "",
  arv: "",
  taxes: "",
  hoa: "",
  insurance: "",
  loanAmount: "",
  mortgageBalance: "",
  interestRate: "",
  loanPayment: "",
  sqft: "",
  yearBuilt: "",
  notes: "",
  agentName: "",
  agentPhone: "",
  agentEmail: "",
  agentTimezone: "",
  occupancyStatus: "",
  highRiskArea: "",
  agentRating: 0,
};

export default function Questionaire({
  onSubmit,
  onSaveSuccess,
  formData,
  setFormData,
  walletAddress,
  currentDealId,
  setCurrentDealId,
}: Props) {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);

  useEffect(() => {
    const price = parseFloat(formData.listingPrice || "");
    const isHighRisk = formData.highRiskArea === "yes";
    if (!isNaN(price)) {
      const rate = isHighRisk ? 0.012 : 0.005;
      const monthly = ((price * rate) / 12).toFixed(2);
      if (formData.insurance !== monthly) {
        setFormData((prev) => ({ ...prev, insurance: monthly }));
      }
    }
  }, [formData.listingPrice, formData.highRiskArea]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "zillowUrl") {
      const match = value.match(/\/homedetails\/([^/]+)\//);
      if (match?.[1]) {
        const address = decodeURIComponent(match[1].replace(/-/g, " "));
        setFormData((prev) => ({ ...prev, zillowUrl: value, address }));
        return;
      }
    }

    if (name === "listingPrice" || name === "highRiskArea") {
      const updated = { ...formData, [name]: value };
      const price = parseFloat(
        name === "listingPrice" ? value : formData.listingPrice || ""
      );
      const risk =
        name === "highRiskArea"
          ? value === "yes"
          : formData.highRiskArea === "yes";
      if (!isNaN(price)) {
        const rate = risk ? 0.012 : 0.005;
        updated.insurance = ((price * rate) / 12).toFixed(2);
      }
      setFormData(updated);
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSave = async () => {
    if (!walletAddress) return;

    try {
      const dealsRef = collection(db, `users/${walletAddress}/deals`);
      let preserved: Partial<DealInput & { createdAt?: any }> = {};

      if (currentDealId) {
        const prevRef = doc(dealsRef, currentDealId);
        const snap = await getDoc(prevRef);
        if (snap.exists()) {
          const prev = snap.data();
          preserved = {
            status: prev.status || "lead",
            method: prev.method || "unknown",
            createdAt: prev.createdAt || serverTimestamp(),
          };
          await deleteDoc(prevRef);
        }
        setCurrentDealId(null);
      }

      const agent = {
        name: formData.agentName,
        phone: formData.agentPhone,
        email: formData.agentEmail,
        timezone: formData.agentTimezone,
        rating: formData.agentRating ?? 0,
      };

      const { agentRating, ...dealWithoutRating } = formData;

      const payload = {
        ...dealWithoutRating,
        agent,
        updatedAt: serverTimestamp(),
        ...preserved,
      };

      await addDoc(dealsRef, payload);

      const agentId = (formData.agentEmail || formData.agentPhone || formData.agentName || 'unknown-agent').toLowerCase().trim();
      if (agentId !== 'unknown-agent') {
        const agentRef = doc(db, `users/${walletAddress}/agents`, agentId);
        await setDoc(
          agentRef,
          {
            name: formData.agentName,
            phone: formData.agentPhone,
            email: formData.agentEmail,
            timezone: formData.agentTimezone,
            rating: formData.agentRating ?? 0,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      setSaveSuccess(true);
      onSaveSuccess?.();
      if (!currentDealId) setFormData(emptyForm);
    } catch (err: any) {
      console.error("🔥 Firebase Save Error:", err?.message || err);
    }
  };

  const handleClear = () => {
    setFormData(emptyForm);
    setCurrentDealId(null);
    setSaveSuccess(false);
  };

  const renderField = (name: keyof DealInput, label: string, span = 1) => (
    <div className={span === 2 ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        name={name}
        value={(formData[name] as string | number) ?? ""}
        onChange={handleChange}
        className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 autofill:bg-zinc-900"
      />
    </div>
  );

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 max-w-3xl mx-auto space-y-6">
        <PropertySection
          formData={formData}
          renderField={renderField}
          handleChange={handleChange}
        />
        <ContactInfoSection
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
        />
        <DiscoveryCallSection
          showScriptModal={showScriptModal}
          setShowScriptModal={setShowScriptModal}
          formData={formData}
          setFormData={setFormData}
        />
        <MortgageSection
          formData={formData}
          renderField={renderField}
          handleChange={handleChange}
        />
        <FormActions
          handleSubmit={handleSubmit}
          handleSave={handleSave}
          handleClear={handleClear}
          saveSuccess={saveSuccess}
          walletAddress={walletAddress}
          currentDealId={currentDealId}
          formData={formData}
          handleChange={handleChange}
        />
      </form>

      <button
        id="openScriptModalTrigger"
        onClick={() => {
          if (formData.zillowUrl) window.open(formData.zillowUrl, "_blank");
          setShowScriptModal(true);
        }}
        className="hidden"
        type="button"
      />

      <ScriptModal
        open={showScriptModal}
        onClose={() => setShowScriptModal(false)}
        formData={{
          ...formData,
          taxes: formData.taxes ? (parseFloat(formData.taxes) * 12).toFixed(2) : "",
        }}
        setFormData={setFormData}
      />
    </>
  );
}
