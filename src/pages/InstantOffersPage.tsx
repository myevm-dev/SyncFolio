import React, { useState } from "react";
import { DealInput } from "../types/DealInput";

const emptyForm: DealInput = {
  address: "",
  agentName: "",
  agentPhone: "",
  listingPrice: "",
  rentalValue: "",
  rehabCost: "",
  arv: "",
  taxes: "",
  hoa: "",
  insurance: "",
  occupancyStatus: "",
  highRiskArea: "",
  notes: "",
};

export default function InstantOfferPage() {
  const [formData, setFormData] = useState<DealInput>(emptyForm);
  const [submitted, setSubmitted] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const parseNum = (value: string | undefined) => parseFloat(value || "0");

  const arv = parseNum(formData.arv);
  const rehab = parseNum(formData.rehabCost);
  const rent = parseNum(formData.rentalValue);

  const cashOffer = ((arv - rehab) * 0.75).toFixed(0);
  const sellerPriceNum = (arv - rehab) * 1.1;
  const sellerPrice = sellerPriceNum.toFixed(0);
  const sellerDown = (sellerPriceNum * 0.1).toFixed(0);
  const sellerMonthly = (rent * 0.38).toFixed(0);
  const balloon = (sellerPriceNum - parseFloat(sellerDown)).toFixed(0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
        Instant Offer Form
      </h1>
      <p className="text-center text-gray-400 mb-6">
        No Sign Up Required. Fill out the form below to get your instant offer.
      </p>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="address"
          placeholder="Property Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2"
        />
        <input
          name="arv"
          placeholder="After Repair Value (ARV)"
          value={formData.arv}
          onChange={handleChange}
          className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2"
        />
        <input
          name="rehabCost"
          placeholder="Estimated Rehab Cost"
          value={formData.rehabCost}
          onChange={handleChange}
          className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2"
        />
        <input
          name="rentalValue"
          placeholder="Estimated Monthly Rent"
          value={formData.rentalValue}
          onChange={handleChange}
          className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2"
        />
        <input
          name="agentName"
          placeholder="Your Name"
          value={formData.agentName}
          onChange={handleChange}
          className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2"
        />
        <input
          name="agentPhone"
          placeholder="Contact Info"
          value={formData.agentPhone}
          onChange={handleChange}
          className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2"
        />
      </form>

      {submitted && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="border border-neutral-700 p-4 rounded bg-zinc-800">
              <h2 className="text-lg font-bold text-green-400 mb-2">Cash Offer</h2>
              <p className="text-white">Offer Price: ${cashOffer}</p>
            </div>

            <div className="border border-neutral-700 p-4 rounded bg-zinc-800">
              <h2 className="text-lg font-bold text-blue-400 mb-2">Seller Finance</h2>
              <p className="text-white">Price: ${sellerPrice}</p>
              <p className="text-white">Down Payment: ${sellerDown}</p>
              <p className="text-white">Monthly Payment: ${sellerMonthly}</p>
              <p className="text-white">8-Year Balloon</p>
              <p className="text-white">Balloon Payment: ${balloon}</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              className="px-6 py-2 text-black bg-gradient-to-r from-purple-400 to-cyan-400 rounded font-semibold shadow-md"
              onClick={() => alert("Send logic coming soon")}
            >
              Send and Download
            </button>
          </div>
        </>
      )}
    </div>
  );
}