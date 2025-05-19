import React, { useState } from "react";
import { DealInput } from "../types/DealInput";

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

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 max-w-3xl mx-auto space-y-6"
    >
      {/* Role Toggle */}
      <div className="flex justify-center gap-2">
        {roles.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setSelectedRole(role)}
            className={`px-4 py-2 rounded-full border ${
              selectedRole === role
                ? "bg-blue-600 text-white"
                : "bg-white text-black"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Group 1: Address, Zillow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-800 pt-6">
        <input name="address" placeholder="Address" onChange={handleChange} className="input" />
        <input name="zillowUrl" placeholder="Zillow URL" onChange={handleChange} className="input" />
      </div>

      {/* Group 2: Price, Rental, Rehab, ARV */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-800 pt-6">
        <input name="listingPrice" placeholder="Listing Price" onChange={handleChange} className="input" />
        <input name="rentalValue" placeholder="Monthly Rental Value" onChange={handleChange} className="input" />
        <input name="rehabCost" placeholder="Estimated Rehab Cost" onChange={handleChange} className="input" />
        <input name="arv" placeholder="ARV (Worth After Repairs)" onChange={handleChange} className="input" />
      </div>

      {/* Group 3: Taxes, HOA, Insurance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-800 pt-6">
        <input name="taxes" placeholder="Monthly Taxes" onChange={handleChange} className="input" />
        <input name="hoa" placeholder="Monthly HOA" onChange={handleChange} className="input" />
        <input name="insurance" placeholder="Monthly Insurance" onChange={handleChange} className="input md:col-span-2" />
      </div>

      {/* Group 4: Loan Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-800 pt-6">
        <input name="loanAmount" placeholder="Original Loan Amount" onChange={handleChange} className="input" />
        <input name="mortgageBalance" placeholder="Outstanding Mortgage Amount" onChange={handleChange} className="input" />
        <input name="interestRate" placeholder="Outstanding Mortgage Interest Rate" onChange={handleChange} className="input" />
        <input name="loanPayment" placeholder="Loan Payment Amount" onChange={handleChange} className="input" />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center border-t border-neutral-800 pt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
