// src/components/DealflowTable.tsx
import React from "react";
import { Link } from "react-router-dom";

interface DealflowTableProps {
  fipsCode: string;
}

// Temporary mock data
const mockData = [
  {
    id: "0x123...abcd",
    displayName: "agent-zero",
    avatar: window.multiavatar("agent-zero"),
    quantity: "1,200 FIPS"
  },
  {
    id: "0x456...efgh",
    displayName: "metro-max",
    avatar: window.multiavatar("metro-max"),
    quantity: "830 FIPS"
  },
  {
    id: "0x789...wxyz",
    displayName: "txwhale",
    avatar: window.multiavatar("txwhale"),
    quantity: "2,300 FIPS"
  }
];

const DealflowTable: React.FC<DealflowTableProps> = ({ fipsCode }) => {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-[#050505] border border-neutral-700 text-sm text-left text-white rounded-md overflow-hidden">
        <thead className="bg-[#0B1519] border-b border-neutral-700">
          <tr>
            <th className="px-4 py-3">No.</th>
            <th className="px-4 py-3">Avatar</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Wallet</th>
            <th className="px-4 py-3">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((user, index) => (
            <tr key={user.id} className="border-b border-zinc-700">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">
                <Link to={`/profile/${user.displayName}`}>
                  <div
                    className="w-8 h-8 rounded-full overflow-hidden hover:scale-110 transition-transform"
                    dangerouslySetInnerHTML={{ __html: user.avatar }}
                  />
                </Link>
              </td>
              <td className="px-4 py-2">
                <Link
                  to={`/profile/${user.displayName}`}
                  className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 hover:underline"
                >
                  {user.displayName}
                </Link>
              </td>
              <td className="px-4 py-2 break-all text-accent">{user.id}</td>
              <td className="px-4 py-2 text-green-400 font-medium">{user.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DealflowTable;
