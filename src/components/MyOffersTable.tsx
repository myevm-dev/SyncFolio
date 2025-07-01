// src/components/MyOffersTable.tsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useActiveAccount } from "thirdweb/react";

interface Offer {
  id: string;
  propertyAddress: string;
  content: string;
  createdAt?: any;
}

const MyOffersTable = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const account = useActiveAccount();
  const walletAddress = account?.address || "";

  useEffect(() => {
    const fetchOffers = async () => {
      if (!walletAddress) return;
      const offersRef = collection(db, `users/${walletAddress}/offers`);
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
            <th className="px-4 py-2 border-b border-neutral-700">Address</th>
            <th className="px-4 py-2 border-b border-neutral-700">Preview</th>
            <th className="px-4 py-2 border-b border-neutral-700">Date</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer.id} className="hover:bg-neutral-800">
              <td className="px-4 py-2 border-b border-neutral-700">{offer.propertyAddress}</td>
              <td className="px-4 py-2 border-b border-neutral-700 truncate max-w-xs">
                {offer.content.slice(0, 50)}...
              </td>
              <td className="px-4 py-2 border-b border-neutral-700">
                {offer.createdAt?.toDate?.().toLocaleDateString() || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyOffersTable;
