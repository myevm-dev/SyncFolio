import React, { useState, useEffect } from "react";
import { DealInput } from "../types/DealInput";
import ScriptModal from "./ScriptModal";

import {
  collection,
  addDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
  doc,
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

  // Auto-calculate insurance on load
  useEffect(() => {
    const price = parseFloat(
      name === "listingPrice" ? value : formData.listingPrice || ""
    );

    const isHighRisk = formData.highRiskArea === "yes";
    if (!isNaN(price)) {
      const rate = isHighRisk ? 0.012 : 0.005;
      const monthlyInsurance = ((price * rate) / 12).toFixed(2);
      if (formData.insurance !== monthlyInsurance) {
        setFormData(prev => ({ ...prev, insurance: monthlyInsurance }));
      }
    }
  }, [formData.listingPrice, formData.highRiskArea]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "zillowUrl") {
      const match = value.match(/\/homedetails\/([^/]+)\//);
      if (match && match[1]) {
        const addressFromUrl = decodeURIComponent(match[1].replace(/-/g, " "));
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          address: addressFromUrl,
        }));
        return;
      }
    }

    if (name === "listingPrice" || name === "highRiskArea") {
      const newFormData = { ...formData, [name]: value };
      const price = parseFloat(
        name === "listingPrice" ? value : formData.listingPrice
      );
      const isHighRisk =
        name === "highRiskArea" ? value === "yes" : formData.highRiskArea === "yes";

      if (!isNaN(price)) {
        const rate = isHighRisk ? 0.012 : 0.005;
        newFormData.insurance = ((price * rate) / 12).toFixed(2);
      }

      setFormData(newFormData);
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
        const prevSnap = await getDoc(prevRef);

        if (prevSnap.exists()) {
          const prevData = prevSnap.data();
          preserved = {
            status: prevData.status || "lead",
            method: prevData.method || "unknown",
            createdAt: prevData.createdAt || serverTimestamp(),
          };

          await deleteDoc(prevRef);
        }

        setCurrentDealId(null);
      }

      const payload = {
        ...formData,
        ...preserved,
        updatedAt: serverTimestamp(),
      };

      await addDoc(dealsRef, payload);
      setSaveSuccess(true);
      onSaveSuccess?.();

      if (!currentDealId) {
        setFormData(emptyForm);
      }
    } catch (error: any) {
      console.error("🔥 Firebase Save Error:", error?.message || error);
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
        value={formData[name] as string}
        onChange={handleChange}
        className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 autofill:bg-zinc-900"
      />
    </div>
  );

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 max-w-3xl mx-auto space-y-6">
        <h2 className="text-center text-xl font-semibold text-[#6e5690] mt-4">Property Details</h2>

        <div className="grid grid-cols-1 gap-4">
          {renderField("zillowUrl", "Zillow URL", 2)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField("address", "Address")}
          {renderField("sqft", "Square Footage")}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField("beds", "Number of Beds")}
          {renderField("baths", "Number of Baths")}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField("listingPrice", "Listing Price")}
          {renderField("yearBuilt", "Year Built")}
        </div>

        <h2 className="text-center text-xl font-semibold text-[#6e5690] mt-8">Contact Info</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {renderField("agentName", "Agent Name")}
          {renderField("agentPhone", "Agent Phone")}
          {renderField("agentEmail", "Agent Email")}
          <div>
            <label className="block text-sm font-medium mb-1">Agent Timezone</label>
            <select
              name="agentTimezone"
              value={formData.agentTimezone || ""}
              onChange={handleChange}
              className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Timezone</option>
              {["Hawaii", "Pacific", "Mountain", "Central", "Eastern"].map((label) => (
                <option key={label} value={label}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <h2 className="text-center text-xl font-semibold text-[#6e5690] mt-8">Discovery Call</h2>
        <div className="flex justify-center mt-2 mb-4">
          <button
            type="button"
            onClick={() => setShowScriptModal(true)}
            className="px-4 py-1 text-sm bg-cyan-700 text-white rounded hover:bg-purple-800 transition"
          >
            Open Call Script
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField("rentalValue", "Monthly Rental Value")}
          <div>
            <label className="block text-sm font-medium mb-1">Occupancy Status</label>
            <select
              name="occupancyStatus"
              value={formData.occupancyStatus || ""}
              onChange={handleChange}
              className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Status</option>
              <option value="vacant">Vacant</option>
              <option value="rented">Rented</option>
              <option value="owner occupied">Owner Occupied</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField("rehabCost", "Estimated Rehab Cost")}
          {renderField("arv", "After Repair Value (ARV)")}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {renderField("taxes", "Monthly Taxes")}
          {renderField("hoa", "Monthly HOA")}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField("insurance", "Monthly Insurance Estimate")}
          <div>
            <label className="block text-sm font-medium mb-1">High Risk Area?</label>
            <select
              name="highRiskArea"
              value={formData.highRiskArea || ""}
              onChange={handleChange}
              className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>

        <h2 className="text-center text-xl font-semibold text-[#6e5690] mt-4">Is there a Mortgage?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4  pt-6">
          {renderField("loanAmount", "Original Loan Amount")}
          {renderField("mortgageBalance", "Outstanding Mortgage Balance")}
          {renderField("interestRate", "Mortgage Interest Rate")}
          {renderField("loanPayment", "Monthly Loan Payment")}
        </div>

        <div className="border-t border-neutral-800 pt-6">
          <label className="block text-sm font-medium mb-1">Notes / Why Are They Selling?</label>
          <textarea
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
            maxLength={1000}
            rows={4}
            className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-right text-xs text-gray-400">{(formData.notes?.length || 0)}/1000</div>
        </div>

        {saveSuccess && (
          <div className="text-green-500 text-center font-medium">
            ✔ Deal saved successfully!
          </div>
        )}

        <div className="flex justify-center gap-4 border-t border-neutral-800 pt-6 flex-wrap">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Calculate
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={`px-6 py-2 rounded-full transition ${
              walletAddress
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!walletAddress}
          >
            {currentDealId ? "Update" : "Save"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition"
          >
            Clear
          </button>
        </div>
      </form>

      <ScriptModal
        open={showScriptModal}
        onClose={() => setShowScriptModal(false)}
        formData={formData}
        setFormData={setFormData}
      />
    </>
  );
}