import React from "react";
import { useForm } from "react-hook-form";
import { generateContractPdf } from "../lib/generateContractPdf";

export default function CashContractForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    generateContractPdf(data);
  };

  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
    "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT",
    "VA", "WA", "WV", "WI", "WY"
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Generate Cash Contract</h1>

      <input {...register("sellerName")} placeholder="Seller Name" className="input" />
      <input {...register("sellerAddress")} placeholder="Seller Address" className="input" />
      <input {...register("buyerName")} placeholder="Buyer Name" className="input" />
      <input {...register("buyerAddress")} placeholder="Buyer Address" className="input" />
      <input {...register("propertyAddress")} placeholder="Property Address" className="input" />

      <input
        {...register("purchasePrice")}
        type="number"
        placeholder="Total Purchase Price"
        className="input"
      />
      <input
        {...register("earnestMoney")}
        type="number"
        placeholder="Earnest Money Deposit"
        className="input"
      />
      <input
        {...register("balanceDue")}
        type="number"
        placeholder="Balance Due at Closing"
        className="input"
      />

      <input
        {...register("closingDate")}
        type="date"
        placeholder="Closing Date"
        className="input"
      />
      <input
        {...register("dueDiligenceDays")}
        type="number"
        placeholder="Due Diligence Days"
        className="input"
      />

      <select {...register("state")} className="input bg-neutral-800 text-white">
        <option value="">Select State</option>
        {states.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <button type="submit" className="bg-green-500 px-6 py-2 rounded text-black font-bold w-full">
        Generate PDF
      </button>
    </form>
  );
}
