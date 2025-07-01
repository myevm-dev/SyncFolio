import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useActiveAccount } from "thirdweb/react";

const DashboardCards = () => {
  const navigate = useNavigate();
  const account = useActiveAccount();
  const walletAddress = account?.address || "";

  const [offerCount, setOfferCount] = useState(0);
  const [opPrice, setOpPrice] = useState<number | null>(null);

  const vestingFolio = 15000;
  const folioToOP = 0.02; // 1 Folio = 0.02 OP

  useEffect(() => {
    const fetchOffers = async () => {
      if (!walletAddress) return;
      const offersRef = collection(db, `users/${walletAddress}/offers`);
      const snapshot = await getDocs(offersRef);
      setOfferCount(snapshot.size);
    };
    fetchOffers();
  }, [walletAddress]);

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=optimism&vs_currencies=usd")
      .then((res) => res.json())
      .then((data) => {
        const price = data?.optimism?.usd;
        if (price) setOpPrice(price);
      })
      .catch((err) => console.error("Error fetching OP price:", err));
  }, []);

  const cards = [
    {
      label: "Buying",
      value: `${offerCount} Properties`,
      icon: "🏠",
      extra: null,
    },
    {
      label: "Earnings",
      value: "$0.00",
      icon: "💰",
      extra: (
        <div className="text-[15px] mt-1 flex flex-wrap items-center gap-1">
          <span className="text-[#fd01f5] font-semibold">+ 15k Ꞙolio</span>
          {opPrice !== null && (
            <span className="text-green-400 text-sm font-normal">
              (~${(vestingFolio * folioToOP * opPrice).toFixed(2)})
            </span>
          )}
          <span className="text-gray-400 italic text-sm">(Vesting)</span>
        </div>
      ),
    },
    {
      label: "Selling",
      value: "0 Properties",
      icon: "📄",
      extra: null,
    },
  ];

  const handleCardClick = (label: string) => {
    if (label === "Buying") {
      navigate("/buying-center");
    }
  };

  return (
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-black rounded-xl p-6 shadow-md border border-neutral-700 flex flex-col items-center text-center cursor-pointer hover:border-blue-500"
          onClick={() => handleCardClick(card.label)}
        >
          <p className="text-sm text-accent font-semibold mb-4">{card.label}</p>
          <div className="w-full flex items-start justify-between px-2">
            <div className="flex flex-col items-start">
              <p className="text-2xl font-bold text-white">{card.value}</p>
              {card.extra && <div>{card.extra}</div>}
            </div>
            <div className="text-3xl">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
