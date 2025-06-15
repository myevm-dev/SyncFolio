import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useActiveAccount } from "thirdweb/react";
import { db } from "../lib/firebase";
import UserGrowthChart from "../components/UserGrowthChart";
import UserTable from "../components/UserTable";

declare global {
  interface Window {
    multiavatar: (id: string) => string;
  }
}

export default function AnalyticsPage() {
  const account = useActiveAccount();
  const walletAddress = account?.address || "";
  const ADMIN = "0x91706ECbA7af59616D4005F37979528226532E6B".toLowerCase();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"card" | "table">("table");

  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      const all = await Promise.all(
        snap.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const ref = doc(db, "users", docSnap.id);
          const meta = await getDoc(ref);
          let createdAt = meta.exists() ? meta.data()?.createdAt?.toDate?.() : null;

          if (!createdAt) {
            await updateDoc(ref, { createdAt: serverTimestamp() });
            createdAt = new Date();
          }

          return {
            id: docSnap.id,
            ...data,
            createdAt,
            avatar: window.multiavatar(`${data.displayName}-${docSnap.id}`),
          };
        })
      );

      const sorted = all.sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0));
      setUsers(sorted);
      setLoading(false);
    };

    if (walletAddress.toLowerCase() === ADMIN) {
      fetchUsers();
    }
  }, [walletAddress]);

  if (walletAddress.toLowerCase() !== ADMIN) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0B1519]">
        <p className="text-lg">Access restricted.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0B1519] text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-[#00FFFF]">
          🧠 SyncFolio Analytics
        </h1>

        <p className="text-center text-white text-2xl font-bold mb-6">
          Total Users: <span className="text-accent font-semibold">{users.length}</span>
        </p>

        {/* Chart */}
        <UserGrowthChart users={users} />

        {/* View toggle */}
        <div className="flex justify-center mb-6 gap-3">
          <button
            onClick={() => setViewMode("table")}
            className={`px-4 py-1 rounded border transition ${
              viewMode === "table"
                ? "bg-[#6e5690] text-black border-[#6e5690]"
                : "bg-transparent text-gray-400 border-zinc-600"
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setViewMode("card")}
            className={`px-4 py-1 rounded border transition ${
              viewMode === "card"
                ? "bg-[#6e5690] text-black border-[#6e5690]"
                : "bg-transparent text-gray-400 border-zinc-600"
            }`}
          >
            Cards
          </button>
        </div>

        {/* View Content */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : viewMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-[#050505] border border-neutral-700 rounded-lg p-4 shadow-md"
              >
                <div
                  className="w-16 h-16 rounded-full overflow-hidden mb-3 mx-auto"
                  dangerouslySetInnerHTML={{ __html: user.avatar }}
                />
                <h2 className="text-center font-semibold text-[#068989] mb-1">{user.displayName}</h2>
                <p className="text-center text-gray-400 text-xs break-all">{user.id}</p>
                <p className="text-center text-gray-500 text-xs mt-1">
                  Signed up: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <UserTable users={users} />
        )}
      </div>
    </div>
  );
}
