import React from "react";

const mockListings = [
  { address: "123 Main St, El Paso, TX 79901" },
  { address: "456 Desert Ave, Phoenix, AZ 85001" },
  { address: "789 Peach Rd, Atlanta, GA 30303" },
  { address: "321 Palm Blvd, Orlando, FL 32801" },
  { address: "654 Hilltop Dr, Austin, TX 73301" },
];

const MyListingsTable: React.FC = () => {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-700">
      <table className="min-w-full divide-y divide-zinc-700 text-sm text-left text-white">
        <thead className="bg-zinc-800">
          <tr>
            <th className="px-6 py-3 font-medium text-white">Address</th>
            <th className="px-6 py-3 text-right font-medium text-white">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-zinc-900 divide-y divide-zinc-800">
          {mockListings.map((item, index) => (
            <tr key={index} className="hover:bg-zinc-800">
              <td className="px-6 py-3">{item.address}</td>
              <td className="px-6 py-3 text-right">
                <button
                  className="bg-gradient-to-r from-pink-500 to-pink-400 text-black px-3 py-1 rounded-full text-xs font-medium hover:opacity-90"
                >
                  Incentivize
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyListingsTable;