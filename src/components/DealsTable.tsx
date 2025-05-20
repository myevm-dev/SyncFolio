import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { XCircleIcon } from "@heroicons/react/24/solid";

interface Deal {
  id: string;
  address: string;
  zillowUrl?: string;
  beds?: string;
  baths?: string;
  listingPrice?: string;
  arv?: string;
}

export default function DealsTable({ refreshKey }: { refreshKey: number }) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeals = async () => {
    try {
      const snapshot = await getDocs(collection(db, "deals"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Deal[];
      setDeals(data);
    } catch (err) {
      console.error("Error fetching deals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchDeals();
  }, [refreshKey]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "deals", id));
      setDeals((prev) => prev.filter((deal) => deal.id !== id));
    } catch (err) {
      console.error("Failed to delete deal:", err);
    }
  };

  if (loading) return <div className="text-center text-sm">Loading deals...</div>;
  if (!deals.length) return <div className="text-center text-sm text-zinc-400">No deals saved yet.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-xl font-semibold mb-4">Saved Deals</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-neutral-700 text-sm">
          <thead className="bg-neutral-800 text-white">
            <tr>
              <th className="border border-neutral-700 px-3 py-2">Address</th>
              <th className="border border-neutral-700 px-3 py-2">Beds</th>
              <th className="border border-neutral-700 px-3 py-2">Baths</th>
              <th className="border border-neutral-700 px-3 py-2">ARV</th>
              <th className="border border-neutral-700 px-3 py-2">Price</th>
              <th className="border border-neutral-700 px-3 py-2 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal.id} className="hover:bg-neutral-900">
                <td className="border border-neutral-700 px-3 py-2">
                  {deal.zillowUrl ? (
                    <a
                      href={deal.zillowUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {deal.address}
                    </a>
                  ) : (
                    deal.address
                  )}
                </td>
                <td className="border border-neutral-700 px-3 py-2">{deal.beds || "-"}</td>
                <td className="border border-neutral-700 px-3 py-2">{deal.baths || "-"}</td>
                <td className="border border-neutral-700 px-3 py-2">${deal.arv || "-"}</td>
                <td className="border border-neutral-700 px-3 py-2">${deal.listingPrice || "-"}</td>
                <td className="border border-neutral-700 px-3 py-2 text-center">
                  <button onClick={() => handleDelete(deal.id)} title="Delete">
                    <XCircleIcon className="w-5 h-5 text-red-500 hover:text-red-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
