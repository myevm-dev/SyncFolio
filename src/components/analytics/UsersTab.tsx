import { FC } from "react";
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
        Total Users:{" "}
        <span className="text-accent font-semibold">{users.length}</span>
      </p>

      {/* Growth chart */}
      <UserGrowthChart users={users} />

      {/* view-toggle */}
      <div className="flex justify-center mb-6 gap-3">
        {(["table", "card"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-1 rounded border transition ${
              viewMode === mode
                ? "bg-[#6e5690] text-black border-[#6e5690]"
                : "bg-transparent text-gray-400 border-zinc-600"
            }`}
          >
            {mode[0].toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* list */}
      {loading ? (
        <p className="text-center text-gray-500">Loading…</p>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-[#050505] border border-neutral-700 rounded-lg p-4 shadow-md"
            >
              <div
                className="w-16 h-16 rounded-full overflow-hidden mb-3 mx-auto"
                dangerouslySetInnerHTML={{ __html: u.avatar }}
              />
              <h2 className="text-center font-semibold text-[#068989] mb-1">
                {u.displayName}
              </h2>
              <p className="text-center text-gray-400 text-xs break-all">{u.id}</p>
              <p className="text-center text-gray-500 text-xs mt-1">
                Signed up:{" "}
                {u.createdAt
                  ? new Date(u.createdAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <UserTable users={users} />
      )}
    </>
  );
};

export default UsersTab;
