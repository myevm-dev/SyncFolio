import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useActiveAccount } from "thirdweb/react";
import { useNavigate } from "react-router-dom";

interface Contract {
  id: string;
  address: string;
  closeDate?: string;
  status: string;
  offerAmount?: string;
  createdAt?: any;
  statusIndex?: number;
  steps?: string[];
  content?: string;
}

const defaultSteps = [
  "You Sign",
  "Seller Signs",
  "Dispo Options",
  "JV Agreement",
  "Searching for Buyer",
  "Buyer Committed",
  "Closed & Credited",
];

const MyContractsTable: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [viewingContent, setViewingContent] = useState<string | null>(null);
  const account = useActiveAccount();
  const walletAddress = account?.address || "";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContracts = async () => {
      if (!walletAddress) return;
      const contractsRef = collection(db, `users/${walletAddress}/contracts`);
      const snapshot = await getDocs(contractsRef);
      const data: Contract[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Contract, "id">),
      }));
      setContracts(data);
    };
    fetchContracts();
  }, [walletAddress]);

  const handleCancel = async (contractId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to cancel this contract?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, `users/${walletAddress}/contracts/${contractId}`));
      setContracts((prev) => prev.filter((c) => c.id !== contractId));
    } catch (error) {
      console.error("Failed to delete contract:", error);
      alert("Error deleting contract. Please try again.");
    }
  };

  const getStatusLabel = (contract: Contract): string => {
    const steps = Array.isArray(contract.steps) ? contract.steps : defaultSteps;
    const index = typeof contract.statusIndex === "number" ? contract.statusIndex : 0;

    if (Number.isInteger(index) && index >= 0 && index < steps.length) {
      return steps[index];
    }

    return "Unknown Status";
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-white border-collapse border border-neutral-700">
        <thead className="bg-neutral-900">
          <tr>
            <th className="px-4 py-3 border-b border-neutral-700">Address</th>
            <th className="px-4 py-3 border-b border-neutral-700">Date</th>
            <th className="px-4 py-3 border-b border-neutral-700">Price</th>
            <th className="px-4 py-3 border-b border-neutral-700">Status</th>
            <th className="px-4 py-3 border-b border-neutral-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr key={contract.id} className="hover:bg-neutral-800">
              <td className="px-4 py-3 border-b border-neutral-700">{contract.address}</td>
              <td className="px-4 py-3 border-b border-neutral-700">
                {contract.createdAt?.toDate?.().toLocaleDateString?.() || contract.closeDate || "—"}
              </td>
              <td className="px-4 py-3 border-b border-neutral-700 text-green-400 font-medium">
                {contract.offerAmount
                  ? `$${parseFloat(
                      contract.offerAmount.replace(/[^0-9.]/g, "")
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : "—"}
              </td>
              <td className="px-4 py-3 border-b border-neutral-700">
                <span className="px-4 py-1 inline-block rounded-full bg-gradient-to-r from-green-400 to-teal-400 text-black font-semibold text-sm">
                  {getStatusLabel(contract)}
                </span>
              </td>
              <td className="px-4 py-3 border-b border-neutral-700 space-x-2">
                <button
                  onClick={() => navigate(`/contracts/${contract.id}`)}
                  className="px-4 py-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-black font-semibold text-sm hover:brightness-110"
                >
                  Status
                </button>
                <button
                  onClick={() => setViewingContent(contract.content || "No content available.")}
                  className="px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-300 text-black font-semibold text-sm hover:brightness-110"
                >
                  View
                </button>
                <button
                  onClick={() => handleCancel(contract.id)}
                  className="px-4 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold text-sm hover:brightness-110"
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {viewingContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
          <div className="bg-zinc-900 text-white p-6 rounded-lg max-w-2xl w-full shadow-xl border border-neutral-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Offer Preview</h2>
              <button
                onClick={() => setViewingContent(null)}
                className="text-sm font-semibold text-red-400 hover:underline"
              >
                Close
              </button>
            </div>
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: viewingContent }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyContractsTable;
