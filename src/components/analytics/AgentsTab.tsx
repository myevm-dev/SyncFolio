import React from "react";
import { useActiveAccount } from "thirdweb/react";

interface Agent {
  name: string;
  phone?: string;
  email?: string;
  region?: string;
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

const Star: React.FC<{ fill: number }> = ({ fill }) => (
  <svg
    viewBox="0 0 22 20"
    className="h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id={`grad-${fill}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset={`${fill * 100}%`} stopColor="#facc15" />
        <stop offset={`${fill * 100}%`} stopColor="#4b5563" />
      </linearGradient>
    </defs>
    <path
      fill={`url(#grad-${fill})`}
      d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
    />
  </svg>
);

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
            <th className="px-4 py-2">Region</th>
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
              <tr key={i} className={i % 2 ? "bg-neutral-900" : "bg-neutral-950"}>
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
                  {ag.region || "—"}
                </td>
                <td className="px-4 py-2 text-center text-gray-200">
                  {ag.rating.toFixed(1)}
                </td>
                <td className="px-4 py-2 text-center text-gray-400">
                  {ag.ratingCount}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentsTab;
