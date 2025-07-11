import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useActiveAccount } from "thirdweb/react";

interface Offer {
  id: string;
  propertyAddress: string;
  method: string;
  offerAmount: string;
  content: string;
  createdAt?: any;
  accepted?: boolean;
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

  const markAsAccepted = async (offerId: string, offer: Offer) => {
    if (!walletAddress) return;

    const contractsRef = collection(db, `users/${walletAddress}/contracts`);
    await addDoc(contractsRef, {
      address: offer.propertyAddress,
      closeDate: new Date().toISOString().slice(0, 10),
      status: "Under Contract",
      method: offer.method,
      offerAmount: offer.offerAmount,
      content: offer.content,
      createdAt: serverTimestamp(),
      ownerId: walletAddress,
    });


    const offerRef = doc(db, `users/${walletAddress}/offers/${offerId}`);
    await deleteDoc(offerRef);

    setOffers((prev) => prev.filter((o) => o.id !== offerId));
  };

  const deleteOffer = async (offerId: string) => {
    if (!walletAddress) return;
    const offerRef = doc(db, `users/${walletAddress}/offers/${offerId}`);
    await deleteDoc(offerRef);
    setOffers((prev) => prev.filter((offer) => offer.id !== offerId));
  };

  const handleEdit = (offerId: string) => {
    alert(`Edit offer not yet implemented: ${offerId}`);
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-white border-collapse border border-neutral-700">
        <thead className="bg-neutral-900">
          <tr>
            <th className="px-4 py-3 border-b border-neutral-700">Address</th>
            <th className="px-4 py-3 border-b border-neutral-700">Method</th>
            <th className="px-4 py-3 border-b border-neutral-700">Offer Amount</th>
            <th className="px-4 py-3 border-b border-neutral-700">Date</th>
            <th className="px-4 py-3 border-b border-neutral-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer.id} className="hover:bg-neutral-800">
              <td className="px-4 py-3 border-b border-neutral-700">{offer.propertyAddress}</td>
              <td className="px-4 py-3 border-b border-neutral-700 capitalize">{offer.method}</td>
              <td className="px-4 py-3 border-b border-neutral-700">${offer.offerAmount}</td>
              <td className="px-4 py-3 border-b border-neutral-700">
                {offer.createdAt?.toDate?.().toLocaleDateString() || "—"}
              </td>
              <td className="px-4 py-3 border-b border-neutral-700 space-x-2">
                <button
                  onClick={() => markAsAccepted(offer.id, offer)}
                  className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-semibold text-sm hover:brightness-110"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleEdit(offer.id)}
                  className="px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-semibold text-sm hover:brightness-110"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteOffer(offer.id)}
                  className="px-4 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold text-sm hover:brightness-110"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyOffersTable;
