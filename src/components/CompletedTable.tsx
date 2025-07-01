// components/CompletedTable.tsx
import React from "react";

export default function CompletedTable() {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-[#050505] border border-neutral-700 text-sm text-left text-white rounded-md overflow-hidden">
        <thead className="bg-[#0B1519] border-b border-neutral-700">
          <tr>
            <th className="px-4 py-3">Property</th>
            <th className="px-4 py-3">Buyer</th>
            <th className="px-4 py-3">Closed On</th>
            <th className="px-4 py-3">Final Price</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-zinc-700">
            <td className="px-4 py-2">456 Oak Ave</td>
            <td className="px-4 py-2 text-accent">0xDef...456</td>
            <td className="px-4 py-2">06/28/2025</td>
            <td className="px-4 py-2 text-green-400">$295,000</td>
          </tr>
          {/* More rows as needed */}
        </tbody>
      </table>
    </div>
  );
}
