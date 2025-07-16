import React from "react";
import { Link } from "react-router-dom";

export interface LeaderData {
  id: string;
  displayName: string;
  avatar: string;
  quantity: string;
  analyze: boolean;
}

interface FlowboardTableProps {
  title: string;
  data: LeaderData[];
}

const FlowboardTable: React.FC<FlowboardTableProps> = ({ title, data }) => {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-center text-white mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#050505] border border-neutral-700 text-sm text-left text-white rounded-md overflow-hidden">
          <thead className="bg-[#0B1519] border-b border-neutral-700">
            <tr>
              <th className="px-4 py-3">No.</th>
              <th className="px-4 py-3">Avatar</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Wallet</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Analyze</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
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
                <td className="px-4 py-2">
                  {user.analyze ? (
                    <span className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
                      On
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-300">
                      Off
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FlowboardTable;
