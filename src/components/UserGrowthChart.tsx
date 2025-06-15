import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface User {
  createdAt: Date;
}

function formatData(users: User[]) {
  const counts: { [date: string]: number } = {};

  users.forEach((user) => {
    const date = new Date(user.createdAt).toLocaleDateString();
    counts[date] = (counts[date] || 0) + 1;
  });

  const sortedDates = Object.keys(counts).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  let cumulative = 0;
  return sortedDates.map((date) => {
    cumulative += counts[date];
    return { date, count: cumulative };
  });
}

export default function UserGrowthChart({ users }: { users: User[] }) {
  const data = formatData(users);

  return (
    <div className="w-full h-64 bg-[#050505] rounded-lg p-4 mb-8 border border-neutral-700">
      <h2 className="text-white text-lg font-semibold mb-4">📈 User Growth Over Time</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#333" />
          <XAxis dataKey="date" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#00FFFF" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
