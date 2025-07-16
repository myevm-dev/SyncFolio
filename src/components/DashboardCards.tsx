import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface Props {
  walletAddress: string;
  readOnly?: boolean;
}

const DashboardCards: React.FC<Props> = ({ walletAddress, readOnly = false }) => {
  const navigate = useNavigate();
  const [offerCount, setOfferCount] = useState(0);
  const [contractCount, setContractCount] = useState(0);
  const [opPrice, setOpPrice] = useState<number | null>(null);
  const [buyingVolume, setBuyingVolume] = useState(0);
  const [sellingVolume, setSellingVolume] = useState(0);

  const vestingFolio = 100000;
  const folioToOP = 0.02;

  useEffect(() => {
    const fetchVolumes = async () => {
      if (!walletAddress) return;
      const offersRef = collection(db, `users/${walletAddress}/offers`);
      const contractsRef = collection(db, `users/${walletAddress}/contracts`);

      const [offersSnap, contractsSnap] = await Promise.all([
        getDocs(offersRef),
        getDocs(contractsRef),
      ]);

      setOfferCount(offersSnap.size);
      setContractCount(contractsSnap.size);

      let totalBuy = 0;
      let totalSell = 0;

      offersSnap.docs.forEach((doc) => {
        const data = doc.data();
        const amount = parseFloat(data.offerAmount?.replace(/[^0-9.]/g, "") || "0");
        if (["cash", "sellerFinance", "takeover", "hybrid"].includes(data.method)) {
          totalBuy += amount;
        } else {
          totalSell += amount;
        }
      });

      contractsSnap.docs.forEach((doc) => {
        const data = doc.data();
        const amount = parseFloat(data.offerAmount?.replace(/[^0-9.]/g, "") || "0");
        if (["cash", "sellerFinance", "takeover", "hybrid"].includes(data.method)) {
          totalBuy += amount;
        } else {
          totalSell += amount;
        }
      });

      setBuyingVolume(totalBuy);
      setSellingVolume(totalSell);
    };

    fetchVolumes();
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
      value: `${offerCount + contractCount} Properties`,
      icon: "🏠",
      route: "/buying-center",
      extra: (
        <div className="text-[15px] mt-1 text-blue-300">
          Total Volume: $
          {buyingVolume.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      ),
    },
    {
      label: "Earnings",
      value:
        opPrice !== null
          ? `$${(vestingFolio * folioToOP * opPrice).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : "$0.00",
      icon: "💰",
      route: "/yield",
      extra: (
        <div className="text-[15px] mt-1 flex flex-wrap items-center gap-1">
          <span className="text-[#fd01f5] font-semibold">+ 100k Ꞙolio</span>
          {opPrice !== null && (
            <span className="text-green-400 text-sm font-normal">
              (~${(vestingFolio * folioToOP * opPrice).toFixed(2)})
            </span>
          )}
          <span className="text-gray-400 italic text-sm flex items-center gap-1">
            (Vesting)
            <span className="relative group">
              <InformationCircleIcon className="w-4 h-4 text-blue-400 cursor-pointer" />
              <div className="absolute z-50 hidden group-hover:block w-[min(90vw,18rem)] p-3 bg-zinc-900 text-sm text-white border border-neutral-700 rounded-lg shadow-lg mt-2 left-1/2 -translate-x-1/2">
                100k <span className="text-[#fd01f5] font-semibold">Ꞙolio</span>{" "}
                unlockable over your first 4 deals. Tokens to be delivered at TGE or
                on completion if after the event. This does not replace any rewards
                earned elsewhere in the app.
              </div>
            </span>
          </span>
        </div>
      ),
    },
    {
      label: "Selling",
      value: "0 Properties",
      icon: "📄",
      route: "/selling-center",
      extra: (
        <div className="text-[15px] mt-1 text-orange-300">
          Total Volume: $
          {sellingVolume.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      ),
    },
  ];

  return (
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-black rounded-xl p-6 shadow-md border border-neutral-700 flex flex-col items-center text-center ${
            !readOnly ? "cursor-pointer hover:border-blue-500" : "opacity-70"
          }`}
          {...(!readOnly ? { onClick: () => navigate(card.route) } : {})}
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
