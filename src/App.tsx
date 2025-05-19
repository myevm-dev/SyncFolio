import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Questionaire from "./components/Questionaire";
import Offers from "./components/Offers";

import cashOffer from "./calculations/cashOffer";
import sellerFinance from "./calculations/sellerFinance";
import mortgageTakeover from "./calculations/takeover";
import hybridOffer from "./calculations/hybridOffer";

import { DealInput } from "./types/DealInput";
import { OfferResults } from "./types/OfferResults";

export default function App() {
  const [results, setResults] = useState<OfferResults | null>(null);

  const handleSubmit = (data: DealInput) => {
    setResults({
      cash: cashOffer(data),
      sellerFinance: sellerFinance(data),
      takeover: mortgageTakeover(data),
      hybrid: hybridOffer(data),
    });
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-between overflow-x-hidden">
      <Navbar />
      <div className="flex-grow space-y-8">
        <Questionaire onSubmit={handleSubmit} />
        {results && <Offers results={results} />}
      </div>
      <Footer />
    </div>
  );
}
