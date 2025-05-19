import React, { useState } from "react";
import { DealInput } from "../types/DealInput";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

interface Props {
  onSubmit: (data: DealInput) => void;
}

const roles = ["Finder", "Agent", "Owner"] as const;
type Role = typeof roles[number];

export default function Questionaire({ onSubmit }: Props) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<Omit<DealInput, "role">>({
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
    loanPayment: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, role: selectedRole });
  };

const handleSave = async () => {
  if (selectedRole !== "Finder") return;

  try {
    await addDoc(collection(db, "deals"), {
      ...formData,
      role: selectedRole,
      createdAt: new Date().toISOString()
    });
    alert("Deal saved to Firebase.");
  } catch (error) {
    console.error("🔥 Firebase Save Error:", error); // This is critical
    alert("Failed to save");
  }
};


  const renderField = (name: keyof typeof formData, label: string, span = 1) => (
    <div className={span === 2 ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input name={name} value={formData[name]} onChange={handleChange} className="input" />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-3xl mx-auto space-y-6">
      {/* Role Toggle */}
      <div className="flex justify-center gap-2">
        {roles.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setSelectedRole(role)}
            className={`px-4 py-2 rounded-full border ${
              selectedRole === role ? "bg-blue-600 text-white" : "bg-white text-black"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Grouped Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-800 pt-6">
        {renderField("address", "Address")}
        {renderField("zillowUrl", "Zillow URL")}
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
        {renderField("hoa", "Monthly HOA")}
        {renderField("insurance", "Monthly Insurance", 2)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-800 pt-6">
        {renderField("loanAmount", "Original Loan Amount")}
        {renderField("mortgageBalance", "Outstanding Mortgage Balance")}
        {renderField("interestRate", "Mortgage Interest Rate")}
        {renderField("loanPayment", "Monthly Loan Payment")}
      </div>

      {/* Submit & Save */}
      <div className="flex justify-center gap-4 border-t border-neutral-800 pt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          Submit
        </button>
        {selectedRole === "Finder" && (
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition"
          >
            Save
          </button>
        )}
      </div>
    </form>
  );
}
