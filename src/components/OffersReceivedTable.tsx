// src/components/OffersReceivedTable.tsx
import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useActiveAccount } from "thirdweb/react";

interface Offer {
  id: string;
  propertyAddress: string;
  method: string;
  offerAmount: string;
  name: string;
  phone: string;
  createdAt?: any;
}

const OffersReceivedTable: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const account = useActiveAccount();
  const walletAddress = account?.address || "";

  useEffect(() => {
    const fetchOffers = async () => {
      if (!walletAddress) return;
      const offersRef = collection(db, `users/${walletAddress}/offersReceived`);
      const snapshot = await getDocs(offersRef);
      const data: Offer[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Offer, "id">),
      }));
      setOffers(data);
    };
    fetchOffers();
  }, [walletAddress]);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-white border-collapse border border-neutral-700">
        <thead className="bg-neutral-900">
          <tr>
            <th className="px-4 py-2 border-b border-neutral-700">Property</th>
            <th className="px-4 py-2 border-b border-neutral-700">Method</th>
            <th className="px-4 py-2 border-b border-neutral-700">Amount</th>
            <th className="px-4 py-2 border-b border-neutral-700">From</th>
            <th className="px-4 py-2 border-b border-neutral-700">Phone</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer.id} className="hover:bg-neutral-800">
              <td className="px-4 py-2 border-b border-neutral-700">{offer.propertyAddress}</td>
              <td className="px-4 py-2 border-b border-neutral-700">{offer.method}</td>
              <td className="px-4 py-2 border-b border-neutral-700">${offer.offerAmount}</td>
              <td className="px-4 py-2 border-b border-neutral-700">{offer.name}</td>
              <td className="px-4 py-2 border-b border-neutral-700">{offer.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OffersReceivedTable;
