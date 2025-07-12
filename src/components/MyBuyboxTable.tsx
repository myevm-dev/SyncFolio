import React from "react";
import { Link } from "react-router-dom";

const mockBuyboxes = [
  { county: "El Paso", state: "TX" },
  { county: "Maricopa", state: "AZ" },
  { county: "Fulton", state: "GA" },
  { county: "Orange", state: "FL" },
  { county: "Travis", state: "TX" },
];

const MyBuyboxTable: React.FC = () => {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-700">
      <table className="min-w-full divide-y divide-zinc-700 text-sm text-left text-white">
        <thead className="bg-zinc-800">
          <tr>
            <th scope="col" className="px-6 py-3 font-medium text-cyan-300">
              County
            </th>
            <th scope="col" className="px-6 py-3 font-medium text-cyan-300">
              State
            </th>
            <th scope="col" className="px-6 py-3 font-medium text-cyan-300 text-right">
              Boost
            </th>
          </tr>
        </thead>
        <tbody className="bg-zinc-900 divide-y divide-zinc-800">
          {mockBuyboxes.map((item, index) => (
            <tr key={index} className="hover:bg-zinc-800">
              <td className="px-6 py-3">{item.county}</td>
              <td className="px-6 py-3">{item.state}</td>
              <td className="px-6 py-3 text-right">
                <Link
                  to="/dealflow"
                  className="inline-block px-3 py-1 text-xs font-semibold text-black bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full shadow hover:opacity-90"
                >
                  Boost
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyBuyboxTable;
