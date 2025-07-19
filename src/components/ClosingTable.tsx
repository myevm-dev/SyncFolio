// components/ClosingTable.tsx
import React from "react";

export default function ClosingTable() {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-[#050505] border border-neutral-700 text-sm text-left text-white rounded-md overflow-hidden">
        <thead className="bg-[#0B1519] border-b border-neutral-700">
          <tr>
            <th className="px-4 py-3">Property</th>
            <th className="px-4 py-3">Buyer</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-zinc-700">
            <td className="px-4 py-2">123 Main St</td>
            <td className="px-4 py-2 text-accent">0xAbc...123</td>
            <td className="px-4 py-2">07/15/2025</td>
            <td className="px-4 py-2 text-green-400">$240,000</td>
          </tr>
          {/* More rows as needed */}
        </tbody>
      </table>
    </div>
  );
}
