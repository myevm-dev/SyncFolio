import React from "react";
import { Link } from "react-router-dom";

interface User {
  id: string;
  displayName: string;
  avatar: string;
  createdAt: Date;
}

export default function UserTable({ users }: { users: User[] }) {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-[#050505] border border-neutral-700 text-sm text-left text-white rounded-md overflow-hidden">
        <thead className="bg-[#0B1519] border-b border-neutral-700">
          <tr>
            <th className="px-4 py-3">Avatar</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Wallet</th>
            <th className="px-4 py-3">Signup Date</th>
            <th className="px-4 py-3">Ꞙ Balance</th>
            <th className="px-4 py-3">Earnings</th>
            <th className="px-4 py-3">Volume</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-zinc-700">
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
              <td className="px-4 py-2">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
              </td>
              <td className="px-4 py-2 text-[#fd01f5] font-semibold">100,000 Ꞙolio</td>
              <td className="px-4 py-2 text-green-400 font-medium">$0.00</td>
              <td className="px-4 py-2 text-blue-400 font-medium">$0.00</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
