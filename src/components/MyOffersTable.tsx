// src/components/MyOffersTable.tsx
import React from "react";

const MyOffersTable = () => {
  const offers = [
    { id: 1, address: "123 Main St", amount: "$150,000", status: "Submitted" },
    { id: 2, address: "456 Oak Ave", amount: "$210,000", status: "Pending" },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-white border-collapse border border-neutral-700">
        <thead className="bg-neutral-900">
          <tr>
            <th className="px-4 py-2 border-b border-neutral-700">Address</th>
            <th className="px-4 py-2 border-b border-neutral-700">Amount</th>
            <th className="px-4 py-2 border-b border-neutral-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer.id} className="hover:bg-neutral-800">
              <td className="px-4 py-2 border-b border-neutral-700">{offer.address}</td>
              <td className="px-4 py-2 border-b border-neutral-700">{offer.amount}</td>
              <td className="px-4 py-2 border-b border-neutral-700">{offer.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyOffersTable;
