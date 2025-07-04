// src/components/MyContractsTable.tsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useActiveAccount } from "thirdweb/react";
import { useNavigate } from "react-router-dom";

interface Contract {
  id: string;
  address: string;
  closeDate: string;
  status: string;
  createdAt?: any;
}

const MyContractsTable: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
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

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-left text-white border-collapse border border-neutral-700">
        <thead className="bg-neutral-900">
          <tr>
            <th className="px-4 py-2 border-b border-neutral-700">Address</th>
            <th className="px-4 py-2 border-b border-neutral-700">Close Date</th>
            <th className="px-4 py-2 border-b border-neutral-700">Status</th>
            <th className="px-4 py-2 border-b border-neutral-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr key={contract.id} className="hover:bg-neutral-800">
              <td className="px-4 py-2 border-b border-neutral-700">{contract.address}</td>
              <td className="px-4 py-2 border-b border-neutral-700">{contract.closeDate}</td>
              <td className="px-4 py-2 border-b border-neutral-700">{contract.status}</td>
              <td className="px-4 py-2 border-b border-neutral-700">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => navigate(`/contracts/${contract.id}`)}
                    className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 whitespace-nowrap"
                    aria-label={`View status of contract at ${contract.address}`}
                  >
                    See Status
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 whitespace-nowrap"
                    aria-label={`Cancel contract at ${contract.address}`}
                  >
                    Cancel
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyContractsTable;
