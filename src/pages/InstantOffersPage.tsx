import React, { useState } from "react";
import { DealInput } from "../types/DealInput";
import SendOfferModal from "../components/SendOfferModal";

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
  const [showModal, setShowModal] = useState(false);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleOfferSelection = (offerType: string) => {
    setSelectedOffers((prev) =>
      prev.includes(offerType)
        ? prev.filter((t) => t !== offerType)
        : [...prev, offerType]
    );
  };

  const parseNum = (value: string | undefined) => parseFloat(value || "0");

  const arv = parseNum(formData.arv);
  const rehab = parseNum(formData.rehabCost);
  const rent = parseNum(formData.rentalValue);

  const cashOffer = ((arv - rehab) * 0.75).toFixed(0);
  const sellerBasePrice = arv - rehab;
  const sellerPriceNum = sellerBasePrice * 1.1;
  const sellerPrice = sellerPriceNum.toFixed(0);
  const sellerDownNum = sellerPriceNum * 0.1;
  const sellerDown = sellerDownNum.toFixed(0);
  const sellerMonthlyNum = rent * 0.38;
  const sellerMonthly = sellerMonthlyNum.toFixed(0);
  const balloon = (sellerPriceNum - sellerDownNum - (sellerMonthlyNum * 84)).toFixed(0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
        Instant Offer Form
      </h1>

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
          <p className="text-sm text-gray-100 mt-6 mb-4 px-4 py-3 bg-gradient-to-r from-purple-900 to-cyan-900 border border-purple-600 rounded text-center font-semibold">
            Select the offer types you'd like to receive below.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div
              className={`border border-neutral-700 p-4 rounded bg-zinc-800 cursor-pointer transition ${
                selectedOffers.includes("cash") ? "ring-2 ring-green-400" : ""
              }`}
              onClick={() => toggleOfferSelection("cash")}
            >
              <h2 className="text-lg font-bold text-green-400 mb-2">Cash Offer</h2>
              <p className="text-white">Offer Price: ${cashOffer}</p>
            </div>

            <div
              className={`border border-neutral-700 p-4 rounded bg-zinc-800 cursor-pointer transition ${
                selectedOffers.includes("seller") ? "ring-2 ring-blue-400" : ""
              }`}
              onClick={() => toggleOfferSelection("seller")}
            >
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
              disabled={selectedOffers.length === 0}
              className={`px-6 py-2 font-semibold rounded shadow-md transition ${
                selectedOffers.length === 0
                  ? "bg-zinc-700 text-gray-400 cursor-not-allowed opacity-60"
                  : "text-black bg-gradient-to-r from-purple-400 to-cyan-400 hover:opacity-90"
              }`}
              onClick={() => setShowModal(true)}
            >
              Send and Download
            </button>
          </div>
        </>
      )}

      {showModal && (
        <SendOfferModal
          formData={formData}
          offerTypes={selectedOffers}
          cashOffer={cashOffer}
          sellerFinance={{
            price: sellerPrice,
            down: sellerDown,
            monthly: sellerMonthly,
            balloon,
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
