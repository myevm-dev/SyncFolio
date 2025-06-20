import React from "react";

interface Agent {
  userId: string;
  name: string;
  phone?: string;
  email?: string;
  timezone?: string;
  rating: number;
}

interface Props {
  agents: Agent[];
  loading: boolean;
}

const Star: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg
    viewBox="0 0 22 20"
    className={`h-4 w-4 ${filled ? "fill-yellow-400" : "fill-gray-600"}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
  </svg>
);

const AgentsTab: React.FC<Props> = ({ agents, loading }) => {
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
            <th className="px-4 py-2">Timezone</th>
            <th className="px-4 py-2 text-center">Avg ⭐</th>
            <th className="px-4 py-2 text-center"># Ratings</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((ag, i) => (
            <tr key={i} className={i % 2 ? "bg-neutral-900" : "bg-neutral-950"}>
              <td className="px-4 py-2 whitespace-nowrap">{ag.name}</td>
              <td className="px-4 py-2 text-gray-400 whitespace-nowrap">{ag.phone || "—"}</td>
              <td className="px-4 py-2 text-gray-400 whitespace-nowrap">{ag.email || "—"}</td>
              <td className="px-4 py-2 text-gray-400 whitespace-nowrap">{ag.timezone || "—"}</td>
              <td className="px-4 py-2">
                <div className="flex justify-center gap-0.5">
                  {Array.from({ length: 5 }, (_, j) => (
                    <Star key={j} filled={j < Math.round(ag.rating)} />
                  ))}
                </div>
              </td>
              <td className="px-4 py-2 text-center text-gray-400">{ag.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentsTab;
