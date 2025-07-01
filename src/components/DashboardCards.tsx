// src/components/DashboardCards.tsx
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

  useEffect(() => {
    const fetchOffers = async () => {
      if (!walletAddress) return;
      const offersRef = collection(db, `users/${walletAddress}/offers`);
      const snapshot = await getDocs(offersRef);
      setOfferCount(snapshot.size);
    };
    fetchOffers();
  }, [walletAddress]);

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
      extra: "+ 0 Ꞙolio (Vesting)",
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
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
              {card.extra && (
                <p className="text-md text-neutral-400">{card.extra}</p>
              )}
            </div>
            <div className="text-3xl">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
