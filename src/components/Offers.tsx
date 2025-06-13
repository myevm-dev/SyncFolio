import React, { useState } from "react";
import { OfferResults } from "../types/OfferResults";
import { CashOnCashResult } from "../types/CashOnCashResult";

interface Props {
  results: OfferResults;
  cashOnCashResults: CashOnCashResult[];
}

export default function Offers({ results, cashOnCashResults }: Props) {
  const labels = {
    cash: "Cash Offer via DSCR",
    sellerFinance: "Seller Finance",
    takeover: "Mortgage Takeover",
    hybrid: "Hybrid",
  };

  const typeMap: Record<string, string> = {
    cash: "Cash via DSCR",
    sellerFinance: "Seller Finance",
    takeover: "Mortgage Takeover",
    hybrid: "Hybrid",
  };

  const [finderFees, setFinderFees] = useState<Record<string, string>>({});

  const handleFeeChange = (key: string, value: string) => {
    setFinderFees((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 max-w-6xl mx-auto">
      {Object.entries(results).map(([key, value]) => {
        const isComingSoon = value.toLowerCase().includes("coming soon");
        const coc = cashOnCashResults.find((r) => r.type === typeMap[key]);
        const borderColor = isComingSoon
          ? "border-gray-500"
          : coc?.pass
          ? "border-green-500"
          : "border-red-500";

        return (
          <div
            key={key}
            className={`border-2 ${borderColor} p-6 rounded-2xl shadow hover:shadow-lg transition text-center flex flex-col justify-between`}
          >
            <div className="mb-4 min-h-[120px] flex flex-col justify-start">
              <div className="text-lg font-semibold mb-2">
                {labels[key as keyof OfferResults]}
              </div>
              <pre className="text-sm whitespace-pre-wrap">{value}</pre>
            </div>

            {!isComingSoon && coc && (
              <div className="text-xs bg-zinc-800 rounded p-3 text-left space-y-1 mb-4">
                <h4 className="text-lg font-bold mb-1">Cash-on-Cash</h4>
                <p>
                  <strong>Return:</strong>{" "}
                  <span className={coc.pass ? "text-green-400" : "text-red-400"}>
                    {Number(coc.cashOnCash).toFixed(2)}%
                  </span>{" "}
                  <span
                    className={
                      coc.pass
                        ? "text-green-500 font-bold ml-2"
                        : "text-red-500 font-bold ml-2"
                    }
                  >
                    {coc.pass ? "✅" : "❌"}
                  </span>
                </p>
                <p>
                  <strong>Entry:</strong> ${Number(coc.entry).toFixed(2)}
                </p>
                <p>
                  <strong>Monthly Payment:</strong> ${Number(coc.monthlyPayment).toFixed(2)}
                </p>
                <p>
                  <strong>Monthly Cash Flow:</strong> ${Number(coc.monthlyCashFlow).toFixed(2)}
                </p>
                <p>
                  <strong>Annual Cash Flow:</strong> ${Number(coc.annualCashFlow).toFixed(2)}
                </p>
              </div>
            )}

            {!isComingSoon && (
              <div className="mb-4 text-sm text-left">
                <label htmlFor={`finderFee-${key}`} className="block mb-1 text-white">
                  Finder’s Fee (optional)
                </label>
                <input
                  id={`finderFee-${key}`}
                  type="text"
                  value={finderFees[key] || ""}
                  onChange={(e) => handleFeeChange(key, e.target.value)}
                  className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-white text-sm"
                  placeholder="e.g. 1000"
                />
              </div>
            )}

            <div className="mt-auto">
              <button
                className={`px-4 py-2 rounded-full transition w-full ${
                  isComingSoon
                    ? "bg-gray-500 text-gray-200 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={isComingSoon}
              >
                Details
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
