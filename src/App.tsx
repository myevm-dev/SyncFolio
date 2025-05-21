import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Questionaire from "./components/Questionaire";
import Offers from "./components/Offers";
import DealsTable from "./components/DealsTable";


import { DealInput } from "./types/DealInput";
import { OfferResults } from "./types/OfferResults";
import { CashOnCashResult } from "./types/CashOnCashResult";

import cashOffer from "./calculations/cashOffer";
import sellerFinance from "./calculations/sellerFinance";
import mortgageTakeover from "./calculations/takeover";
import hybridOffer from "./calculations/hybridOffer";

import cashOnCashCash from "./calculations/cashOnCashCash";
import cashOnCashSeller from "./calculations/cashOnCashSeller";
import cashOnCashTakeover from "./calculations/cashOnCashTakeover";
import cashOnCashHybrid from "./calculations/cashOnCashHybrid";

export default function App() {
  const [results, setResults] = useState<OfferResults | null>(null);
  const [cocResults, setCocResults] = useState<CashOnCashResult[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmit = (data: DealInput) => {
    setResults({
      cash: cashOffer(data),
      sellerFinance: sellerFinance(data),
      takeover: mortgageTakeover(data),
      hybrid: hybridOffer(data),
    });

    setCocResults([
      cashOnCashCash(data),
      cashOnCashSeller(data),
      cashOnCashTakeover(data),
      cashOnCashHybrid(data),
    ]);
  };

  const triggerRefreshDeals = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleLoadDeal = (deal: DealInput) => {
    handleSubmit(deal);
  };

  return (
    <div className="w-full min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <div className="flex-grow space-y-8">
        <Questionaire onSubmit={handleSubmit} onSaveSuccess={triggerRefreshDeals} />
        
        {results && (
          <Offers results={results} cashOnCashResults={cocResults} />
        )}


        <DealsTable refreshKey={refreshKey} onLoad={handleLoadDeal} />
      </div>
      <div className="mt-20" />
      <Footer />
    </div>
  );
}
