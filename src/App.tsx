import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";

import ConversionChart from "./components/ConversionChart";
import LinkBar from "./components/LinkBar";
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

const initialDeal: DealInput = {
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
  loanPayment: "",
  sqft: "",
  yearBuilt: "",
  notes: "",
  agentName: "",
  agentPhone: "",
  agentEmail: "",
  agentTimezone: "",
};

export default function App() {
  const account = useActiveAccount();
  const walletAddress = account?.address || "";
  const [showChart, setShowChart] = useState(false);
  const [results, setResults] = useState<OfferResults | null>(null);
  const [cocResults, setCocResults] = useState<CashOnCashResult[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentDealId, setCurrentDealId] = useState<string | null>(null);
  const [formData, setFormData] = useState<DealInput>(initialDeal);

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
    setCurrentDealId(null);
  };

  const handleLoadDeal = (deal: DealInput & { id?: string }) => {
    setFormData({
      ...initialDeal,
      ...deal,
    });

    if (deal.id) setCurrentDealId(deal.id);
    handleSubmit(deal);
  };

  return (
    <div className="w-full min-h-screen flex flex-col overflow-hidden">
      <LinkBar walletAddress={walletAddress} />
      <div className="flex-grow space-y-8 overflow-y-auto px-4 py-8 pb-32">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Earn by Finding Deals</h1>
          <p className="text-gray-400">Manage real estate leads and send deals to Investors</p>
        </div>

        <Questionaire
          onSubmit={handleSubmit}
          onSaveSuccess={triggerRefreshDeals}
          formData={formData}
          setFormData={setFormData}
          walletAddress={walletAddress}
          currentDealId={currentDealId}
          setCurrentDealId={setCurrentDealId}
        />


        {results && (
          <Offers results={results} cashOnCashResults={cocResults} />
        )}
        {showChart && <ConversionChart walletAddress={walletAddress} />}
        <DealsTable
          refreshKey={refreshKey}
          onLoad={handleLoadDeal}
          walletAddress={walletAddress}
          showChart={showChart}
          setShowChart={setShowChart}
        />


        <div className="h-[100px]" /> {/* Adjust height to match or slightly exceed mobile footer/menu height */}

      </div>
    </div>
  );
}
