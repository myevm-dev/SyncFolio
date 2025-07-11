// src/components/UsersTab.tsx
import { FC } from "react";
import { Link } from "react-router-dom";
import UserGrowthChart from "../UserGrowthChart";
import UserTable from "../UserTable";

interface Props {
  users: any[];
  loading: boolean;
  viewMode: "card" | "table";
  setViewMode: (v: "card" | "table") => void;
}

const UsersTab: FC<Props> = ({ users, loading, viewMode, setViewMode }) => {
  return (
    <>
      <p className="text-center text-white text-2xl font-bold mb-6">
        Total Users: <span className="text-accent font-semibold">{users.length}</span>
      </p>

      <UserGrowthChart users={users} />

      <div className="flex justify-center mb-6 gap-3">
        {(["table", "card"] as const).map((mode) => {
          const isActive = viewMode === mode;
          return (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`w-32 py-2 rounded-full transition font-medium text-center ${
                isActive
                  ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-black shadow-md hover:brightness-110"
                  : "bg-zinc-900 text-white border border-zinc-700 hover:border-cyan-400"
              }`}
            >
              {mode[0].toUpperCase() + mode.slice(1)}
            </button>
          );
        })}
      </div>


      {loading ? (
        <p className="text-center text-gray-500">Loading…</p>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {users.map((u) => (
              <Link
                to={`/profile/${u.displayName}`}
                key={u.id}
                className="bg-[#050505] border border-neutral-700 rounded-lg p-4 shadow-md hover:ring-2 hover:ring-cyan-500 transition"
              >

              <div
                className="w-16 h-16 rounded-full overflow-hidden mb-3 mx-auto"
                dangerouslySetInnerHTML={{ __html: u.avatar }}
              />
              <h2 className="text-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-1">
                {u.displayName}
              </h2>
              <p className="text-center text-gray-400 text-xs break-all">{u.id}</p>
              <p className="text-center text-gray-500 text-xs mt-1">
                Signed up:{" "}
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Unknown"}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <UserTable users={users} />
      )}
    </>
  );
};

export default UsersTab;
