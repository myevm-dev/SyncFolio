import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";

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

export default function App() {
  const account = useActiveAccount();
  const walletAddress = account?.address || "";

  const [results, setResults] = useState<OfferResults | null>(null);
  const [cocResults, setCocResults] = useState<CashOnCashResult[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentDealId, setCurrentDealId] = useState<string | null>(null);

  const [formData, setFormData] = useState<DealInput>({
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
  });

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
    });

    setTimeout(() => {
      setFormData({
        address: deal.address || "",
        zillowUrl: deal.zillowUrl || "",
        beds: deal.beds || "",
        baths: deal.baths || "",
        listingPrice: deal.listingPrice || "",
        rentalValue: deal.rentalValue || "",
        rehabCost: deal.rehabCost || "",
        arv: deal.arv || "",
        taxes: deal.taxes || "",
        hoa: deal.hoa || "",
        insurance: deal.insurance || "",
        loanAmount: deal.loanAmount || "",
        mortgageBalance: deal.mortgageBalance || "",
        interestRate: deal.interestRate || "",
        loanPayment: deal.loanPayment || "",
        sqft: deal.sqft || "",
        yearBuilt: deal.yearBuilt || "",
      });

      if (deal.id) setCurrentDealId(deal.id);
      handleSubmit(deal);
    }, 0);
  };

  return (
    <div className="w-full min-h-screen flex flex-col overflow-hidden">
      <LinkBar walletAddress={walletAddress} />
      <div className="flex-grow space-y-8 overflow-y-auto">
        <Questionaire
          onSubmit={handleSubmit}
          onSaveSuccess={triggerRefreshDeals}
          formData={formData}
          setFormData={setFormData}
          walletAddress={walletAddress}
          currentDealId={currentDealId}
        />
        {results && (
          <Offers results={results} cashOnCashResults={cocResults} />
        )}
        <DealsTable
          refreshKey={refreshKey}
          onLoad={handleLoadDeal}
          walletAddress={walletAddress}
        />
      </div>
    </div>
  );
}
