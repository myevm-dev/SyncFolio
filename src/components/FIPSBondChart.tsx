// src/components/FIPSBondChart.tsx
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

const FIPSBondChart: React.FC = () => {
  const data = Array.from({ length: 101 }, (_, i) => ({
    supply: i,
    price: i, // linear: y = x
  }));

  return (
    <div className="w-full h-64 bg-black border border-neutral-700 rounded-md">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="supply" stroke="#888" tick={{ fill: '#aaa', fontSize: 12 }} />
          <YAxis stroke="#888" tick={{ fill: '#aaa', fontSize: 12 }} />
          <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#555' }} labelStyle={{ color: '#fff' }} />
          <Line type="monotone" dataKey="price" stroke="#00FFAA" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FIPSBondChart;
