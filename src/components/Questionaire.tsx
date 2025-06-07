import React, { useState } from "react";
import { DealInput } from "../types/DealInput";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
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
}

export default function Questionaire({
  onSubmit,
  onSaveSuccess,
  formData,
  setFormData,
  walletAddress,
  currentDealId,
}: Props) {
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSave = async () => {
    if (!walletAddress) {
      console.error("No wallet connected — cannot save.");
      return;
    }

    try {
      if (currentDealId) {
        await updateDoc(doc(db, `users/${walletAddress}/deals`, currentDealId), {
          ...formData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, `users/${walletAddress}/deals`), {
          ...formData,
          createdAt: serverTimestamp(),
          status: "lead",
        });
      }
      setSaveSuccess(true);
      onSaveSuccess?.();
    } catch (error: any) {
      console.error("🔥 Firebase Save Error:", error?.message || error);
    }
  };

  const handleClear = () => {
    setFormData({
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
      notes: "", // reset new field
    });
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
    <form onSubmit={handleSubmit} className="p-4 max-w-3xl mx-auto space-y-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-800 pt-6">
        {renderField("listingPrice", "Listing Price")}
        {renderField("rentalValue", "Monthly Rental Value")}
        {renderField("rehabCost", "Estimated Rehab Cost")}
        {renderField("arv", "After Repair Value (ARV)")}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-800 pt-6">
        {renderField("taxes", "Monthly Taxes")}
        {renderField("insurance", "Monthly Insurance")}
        {renderField("hoa", "Monthly HOA")}
        {renderField("yearBuilt", "Year Built")}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-800 pt-6">
        {renderField("loanAmount", "Original Loan Amount")}
        {renderField("mortgageBalance", "Outstanding Mortgage Balance")}
        {renderField("interestRate", "Mortgage Interest Rate")}
        {renderField("loanPayment", "Monthly Loan Payment")}
      </div>

      <div className="border-t border-neutral-800 pt-6">
        <label className="block text-sm font-medium mb-1">
          Notes / Why are they selling?
        </label>
        <textarea
          name="notes"
          value={formData.notes || ""}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={5}
          className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add any details, seller motivations, or notes here..."
        />
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
          Submit
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
  );
}
