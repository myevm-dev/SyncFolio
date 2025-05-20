import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { XCircleIcon, PlusCircleIcon } from "@heroicons/react/24/solid";

interface Deal {
  id: string;
  address: string;
  zillowUrl?: string;
  beds?: string;
  baths?: string;
  listingPrice?: string;
  arv?: string;
  status?: string;
  method?: string;
  rentalValue?: string;
  rehabCost?: string;
  taxes?: string;
  hoa?: string;
  insurance?: string;
  loanAmount?: string;
  mortgageBalance?: string;
  interestRate?: string;
  loanPayment?: string;
}

const statuses = [
  "lead",
  "called",
  "contacted",
  "offer sent",
  "contract sent",
  "closed",
];

const methods = [
  "unknown",
  "cash",
  "seller finance",
  "takeover",
  "hybrid",
];

export default function DealsTable({ refreshKey, onLoad }: { refreshKey: number; onLoad: (deal: Deal) => void }) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [editingMethodId, setEditingMethodId] = useState<string | null>(null);

  const fetchDeals = async () => {
    try {
      const snapshot = await getDocs(collection(db, "deals"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
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

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "deals", id), { status: newStatus });
      setDeals((prev) =>
        prev.map((deal) =>
          deal.id === id ? { ...deal, status: newStatus } : deal
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleMethodChange = async (id: string, newMethod: string) => {
    try {
      await updateDoc(doc(db, "deals", id), { method: newMethod });
      setDeals((prev) =>
        prev.map((deal) =>
          deal.id === id ? { ...deal, method: newMethod } : deal
        )
      );
      setEditingMethodId(null);
    } catch (err) {
      console.error("Failed to update method:", err);
    }
  };

  const filteredDeals = filter
    ? deals.filter((deal) => deal.status === filter)
    : deals;

  if (loading) return <div className="text-center text-sm">Loading deals...</div>;
  if (!deals.length) return <div className="text-center text-sm text-zinc-400">No deals saved yet.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 mb-20">
      <h2 className="text-xl font-semibold mb-4">Saved Deals</h2>

      <div className="mb-4 flex gap-2 flex-wrap items-center">
        <span className="text-sm">Filter by status:</span>
        <button
          onClick={() => setFilter("")}
          className={`text-xs px-3 py-1 rounded-full border ${filter === "" ? "bg-blue-600 text-white" : "bg-white text-black"}`}
        >
          All
        </button>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`text-xs px-3 py-1 rounded-full border ${filter === status ? "bg-blue-600 text-white" : "bg-white text-black"}`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-neutral-700 text-sm">
          <thead className="bg-neutral-800 text-white">
            <tr>
              <th className="border border-neutral-700 px-3 py-2 text-left">Address</th>
              <th className="border border-neutral-700 px-3 py-2 text-center">Beds</th>
              <th className="border border-neutral-700 px-3 py-2 text-center">Baths</th>
              <th className="border border-neutral-700 px-3 py-2 text-center">ARV</th>
              <th className="border border-neutral-700 px-3 py-2 text-center">Price</th>
              <th className="border border-neutral-700 px-3 py-2 text-center">Status</th>
              <th className="border border-neutral-700 px-3 py-2 text-center">Method</th>
              <th className="border border-neutral-700 px-3 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeals.map((deal) => (
              <tr key={deal.id} className="hover:bg-neutral-900">
                <td className="border border-neutral-700 px-3 py-2 text-left">
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
                <td className="border border-neutral-700 px-3 py-2 text-center">{deal.beds || "-"}</td>
                <td className="border border-neutral-700 px-3 py-2 text-center">{deal.baths || "-"}</td>
                <td className="border border-neutral-700 px-3 py-2 text-center">${deal.arv || "-"}</td>
                <td className="border border-neutral-700 px-3 py-2 text-center">${deal.listingPrice || "-"}</td>
                <td className="border border-neutral-700 px-3 py-2 text-center">
                  <select
                    value={deal.status || ""}
                    onChange={(e) => handleStatusChange(deal.id, e.target.value)}
                    className="bg-neutral-800 border border-neutral-700 text-white text-xs px-2 py-1 rounded"
                  >
                    <option value="">-</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-neutral-700 px-3 py-2 text-center">
                  {editingMethodId === deal.id ? (
                    <select
                      value={deal.method || ""}
                      onChange={(e) => handleMethodChange(deal.id, e.target.value)}
                      className="bg-neutral-800 border border-neutral-700 text-white text-xs px-2 py-1 rounded"
                    >
                      <option value="" disabled>Select method</option>
                      {methods.map((method) => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  ) : deal.method ? (
                    <span
                      onClick={() => setEditingMethodId(deal.id)}
                      className="text-xs font-semibold inline-block px-2 py-1 rounded-full bg-neutral-700 text-white cursor-pointer hover:bg-neutral-600"
                    >
                      {deal.method}
                    </span>
                  ) : (
                    <button onClick={() => setEditingMethodId(deal.id)} title="Set method">
                      <PlusCircleIcon className="w-5 h-5 text-blue-400 hover:text-blue-600 mx-auto" />
                    </button>
                  )}
                </td>
                <td className="border border-neutral-700 px-3 py-2 text-center space-x-2">
                  <button
                    onClick={() => onLoad(deal)}
                    className="text-xs px-2 py-1 bg-blue-700 text-white rounded hover:bg-blue-800"
                  >
                    Load
                  </button>
                  <button onClick={() => handleDelete(deal.id)} title="Delete">
                    <XCircleIcon className="w-5 h-5 text-red-500 hover:text-red-700 inline-block" />
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