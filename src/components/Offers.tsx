import React from "react";
import { OfferResults } from "../types/OfferResults";

export default function Offers({ results }: { results: OfferResults }) {
  const labels = {
    cash: "Cash Offer",
    sellerFinance: "Seller Finance",
    takeover: "Mortgage Takeover",
    hybrid: "Hybrid"
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 max-w-5xl mx-auto">
      {Object.entries(results).map(([key, value]) => (
        <div
          key={key}
          className="border p-6 rounded-2xl shadow hover:shadow-lg transition text-center flex flex-col justify-between"
        >
          <div>
            <div className="text-lg font-semibold mb-2">
              {labels[key as keyof OfferResults]}
            </div>
            <pre className="text-sm whitespace-pre-wrap">{value}</pre>
          </div>

          <div className="mt-4 flex justify-center gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
              Details
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition">
              Accept
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
