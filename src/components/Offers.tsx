import React, { useState, useEffect } from "react";
import { OfferResults } from "../types/OfferResults";
import { CashOnCashResult } from "../types/CashOnCashResult";
import OfferModal from "./OfferModal";

interface Props {
  results: OfferResults;
  cashOnCashResults: CashOnCashResult[];
}

export default function Offers({ results, cashOnCashResults }: Props) {
  const [activeOfferType, setActiveOfferType] = useState<keyof OfferResults | null>(null);
  const [folioValueUSD, setFolioValueUSD] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=optimism&vs_currencies=usd")
      .then((res) => res.json())
      .then((data) => {
        const opPrice = data?.optimism?.usd;
        if (opPrice) setFolioValueUSD(opPrice * 1000);
      })
      .catch((err) => console.error("Error fetching OP price:", err));
  }, []);

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

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 max-w-6xl mx-auto">
        {Object.entries(results).map(([key, value]) => {
          const typedKey = key as keyof OfferResults;
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
                  <p><strong>Entry:</strong> ${Number(coc.entry).toFixed(2)}</p>
                  <p><strong>Monthly Payment:</strong> ${Number(coc.monthlyPayment).toFixed(2)}</p>
                  <p><strong>Monthly Cash Flow:</strong> ${Number(coc.monthlyCashFlow).toFixed(2)}</p>
                  <p><strong>Annual Cash Flow:</strong> ${Number(coc.annualCashFlow).toFixed(2)}</p>
                </div>
              )}

              <div className="mt-auto flex flex-col gap-2 items-center">
                {coc?.pass && (
                  <div className="text-center mt-2">
                    <p className="text-md text-gray-400">You Earn Minimum</p>
                    <p className="text-3xl mb-2 text-green-500 font-bold">$2250</p>
                    <p className="text-[15px] max-w-[200px] leading-tight">
                      <span className="text-cyan-400">+ 50k Folio Token</span>
                      {folioValueUSD !== null && (
                        <span className="text-green-400 ml-1">(~${folioValueUSD.toFixed(2)})</span>
                      )}
                    </p>

                  </div>
                )}
                <div className="flex w-full gap-2 mt-2">
                  <button
                    className={`px-4 py-2 rounded-full transition w-full ${
                      isComingSoon
                        ? "bg-gray-500 text-gray-200 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    disabled={isComingSoon}
                    onClick={() => setActiveOfferType(key as keyof OfferResults)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeOfferType && (
        <OfferModal
          type={activeOfferType}
          onClose={() => setActiveOfferType(null)}
        />
      )}
    </>
  );
}
