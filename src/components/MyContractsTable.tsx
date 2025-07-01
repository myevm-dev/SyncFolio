// src/components/MyContractsTable.tsx
import React from "react";

const MyContractsTable = () => {
  const contracts = [
    { id: 1, address: "789 Pine Ln", closeDate: "2025-07-15", status: "Under Contract" },
    { id: 2, address: "101 Maple Rd", closeDate: "2025-08-01", status: "Closing Soon" },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-white border-collapse border border-neutral-700">
        <thead className="bg-neutral-900">
          <tr>
            <th className="px-4 py-2 border-b border-neutral-700">Address</th>
            <th className="px-4 py-2 border-b border-neutral-700">Close Date</th>
            <th className="px-4 py-2 border-b border-neutral-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr key={contract.id} className="hover:bg-neutral-800">
              <td className="px-4 py-2 border-b border-neutral-700">{contract.address}</td>
              <td className="px-4 py-2 border-b border-neutral-700">{contract.closeDate}</td>
              <td className="px-4 py-2 border-b border-neutral-700">{contract.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyContractsTable;
