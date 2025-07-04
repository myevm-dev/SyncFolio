// src/components/CompletedTableBuyer.tsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useActiveAccount } from "thirdweb/react";

interface CompletedContract {
  id: string;
  address: string;
  closeDate: string;
  status: string;
  completedAt?: any;
}

const CompletedTableBuyer: React.FC = () => {
  const [completed, setCompleted] = useState<CompletedContract[]>([]);
  const account = useActiveAccount();
  const walletAddress = account?.address || "";

  useEffect(() => {
    const fetchCompleted = async () => {
      if (!walletAddress) return;
      const ref = collection(db, `users/${walletAddress}/contracts`);
      const snap = await getDocs(ref);
      const data = snap.docs
        .map(doc => ({ id: doc.id, ...(doc.data() as Omit<CompletedContract, "id">) }))
        .filter(item => item.status?.toLowerCase() === "completed");
      setCompleted(data);
    };
    fetchCompleted();
  }, [walletAddress]);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-white border-collapse border border-neutral-700">
        <thead className="bg-neutral-900">
          <tr>
            <th className="px-4 py-2 border-b border-neutral-700">Property Address</th>
            <th className="px-4 py-2 border-b border-neutral-700">Close Date</th>
            <th className="px-4 py-2 border-b border-neutral-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {completed.map((item) => (
            <tr key={item.id} className="hover:bg-neutral-800">
              <td className="px-4 py-2 border-b border-neutral-700">{item.address}</td>
              <td className="px-4 py-2 border-b border-neutral-700">{item.closeDate}</td>
              <td className="px-4 py-2 border-b border-neutral-700">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompletedTableBuyer;
