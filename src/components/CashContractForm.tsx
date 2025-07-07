import React from "react";
import { useForm } from "react-hook-form";
import { generateContractPdf } from "../lib/generateContractPdf";

export default function CashContractForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    generateContractPdf(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Generate Cash Contract</h1>

      <input {...register("sellerName")} placeholder="Seller Name" className="input" />
      <input {...register("sellerAddress")} placeholder="Seller Address" className="input" />
      <input {...register("buyerName")} placeholder="Buyer Name" className="input" />
      <input {...register("buyerAddress")} placeholder="Buyer Address" className="input" />
      <input {...register("propertyAddress")} placeholder="Property Address" className="input" />
      <input {...register("purchasePrice")} placeholder="Total Purchase Price" className="input" />
      <input {...register("earnestMoney")} placeholder="Earnest Money Deposit" className="input" />
      <input {...register("balanceDue")} placeholder="Balance Due at Closing" className="input" />
      <input {...register("closingDate")} placeholder="Closing Date (MM/DD/YYYY)" className="input" />
      <input {...register("dueDiligenceDays")} placeholder="Due Diligence Days" className="input" />
      <input {...register("state")} placeholder="Governing State" className="input" />

      <button type="submit" className="bg-green-500 px-6 py-2 rounded text-black font-bold w-full">
        Generate PDF
      </button>
    </form>
  );
}
