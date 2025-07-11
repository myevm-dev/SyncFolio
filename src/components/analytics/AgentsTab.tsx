import React from "react";
import { useActiveAccount } from "thirdweb/react";

export interface Agent {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  region?: string;
  zip?: string;
  rating: number;
  ratingCount: number;
}

interface Props {
  agents: Agent[];
  loading: boolean;
}

const ADMIN_WALLET = "0x91706ECbA7af59616D4005F37979528226532E6B".toLowerCase();

const maskName = (fullName: string): string => {
  const [first, last] = fullName.split(" ");
  return `${first} ${last?.charAt(0) || ""}.`;
};

const maskPhone = (phone?: string): string =>
  phone ? phone.replace(/\d/g, "*") : "—";

const maskEmail = (email?: string): string =>
  email ? "••••@••••.com" : "—";

const AgentsTab: React.FC<Props> = ({ agents, loading }) => {
  const account = useActiveAccount();
  const walletAddress = account?.address?.toLowerCase();
  const isLocked = walletAddress !== ADMIN_WALLET;

  if (loading) return <p className="text-center text-gray-500">Loading…</p>;
  if (!agents.length) return <p className="text-center text-gray-400">No rated agents yet.</p>;

  return (
    <div className="overflow-x-auto border border-neutral-700 rounded-lg">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-neutral-800 text-gray-300 text-xs uppercase">
          <tr>
            <th className="px-4 py-2">Agent</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">ZIP</th>
            <th className="px-4 py-2 text-center">Avg ⭐</th>
            <th className="px-4 py-2 text-center"># Ratings</th>
          </tr>
        </thead>
        <tbody>
          {[...agents]
            .sort((a, b) => {
              if (b.rating === a.rating) {
                return b.ratingCount - a.ratingCount;
              }
              return b.rating - a.rating;
            })
            .map((ag, i) => (
              <tr key={ag.id || i} className={i % 2 ? "bg-neutral-900" : "bg-neutral-950"}>
                <td className="px-4 py-2 whitespace-nowrap text-white">
                  {isLocked ? maskName(ag.name) : ag.name}
                  {isLocked && <span className="text-yellow-500 text-xs ml-1">🔒</span>}
                </td>
                <td className="px-4 py-2 text-gray-400 whitespace-nowrap">
                  {isLocked ? maskPhone(ag.phone) : ag.phone || "—"}
                </td>
                <td className="px-4 py-2 text-gray-400 whitespace-nowrap">
                  {isLocked ? maskEmail(ag.email) : ag.email || "—"}
                </td>
                <td className="px-4 py-2 text-gray-400 whitespace-nowrap">
                  {ag.zip || "—"}
                </td>
                <td className="px-4 py-2 text-center text-gray-200">
                  {ag.rating?.toFixed(1) || "—"}
                </td>
                <td className="px-4 py-2 text-center text-gray-400">
                  {ag.ratingCount || 0}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentsTab;
