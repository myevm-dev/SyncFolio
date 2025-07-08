import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";

import ConversionChart from "./components/ConversionChart";
import LinkBar from "./components/LinkBar";
import Questionaire from "./components/Questionaire";
import Offers from "./components/Offers";
import DealsTable from "./components/DealsTable";
import WelcomeReferralPage from "./pages/WelcomeReferralPage";

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
  const [showWelcome, setShowWelcome] = useState(false);
  const [folioValueUSD, setFolioValueUSD] = useState<number>(0);
  const [totalUSD, setTotalUSD] = useState<number>(0);

  // Show welcome screen if referral is present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");

    if (ref) {
      localStorage.setItem("referrer", ref);
      setShowWelcome(true);
    }
  }, []);

  // Fetch OP price → calculate FOLIO price
  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=optimism&vs_currencies=usd")
      .then((res) => res.json())
      .then((data) => {
        const opPrice = data?.optimism?.usd;
        if (opPrice) setFolioValueUSD(opPrice * 0.02);
      })
      .catch((err) => console.error("Error fetching OP price:", err));
  }, []);

  const handleSubmit = (data: DealInput) => {
    const offers = {
      cash: cashOffer(data),
      sellerFinance: sellerFinance(data),
      takeover: mortgageTakeover(data),
      hybrid: hybridOffer(data),
    };

    const cocs = [
      cashOnCashCash(data),
      cashOnCashSeller(data),
      cashOnCashTakeover(data),
      cashOnCashHybrid(data),
    ];

    setResults(offers);
    setCocResults(cocs);

    const numPassing = cocs.filter((r) => r.pass).length;
    const baseEarnUSD = 2250;
    const folioPerDeal = 50000;
    const total = numPassing * (baseEarnUSD + folioPerDeal * folioValueUSD);

    setTotalUSD(Math.round(total));
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

  if (showWelcome) {
    const fallbackUSD = 2250 + 50000 * folioValueUSD;
    return (
      <WelcomeReferralPage
        onContinue={() => setShowWelcome(false)}
        totalUSD={totalUSD > 0 ? totalUSD : Math.round(fallbackUSD)}
      />
    );
  }


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
          <Offers
            results={results}
            cashOnCashResults={cocResults}
            propertyAddress={formData.address || ""}
            walletAddress={walletAddress}
          />
        )}

        {showChart && <ConversionChart walletAddress={walletAddress} />}

        <DealsTable
          refreshKey={refreshKey}
          onLoad={handleLoadDeal}
          walletAddress={walletAddress}
          showChart={showChart}
          setShowChart={setShowChart}
        />

        <div className="h-[100px]" />
      </div>
    </div>
  );
}
