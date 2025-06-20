import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useActiveAccount } from "thirdweb/react";
import { db } from "../lib/firebase";
import UsersTab from "../components/analytics/UsersTab";
import AgentsTab from "../components/analytics/AgentsTab";

declare global {
  interface Window {
    multiavatar: (id: string) => string;
  }
}

export default function AnalyticsPage() {
  /* wallet / admin */
  const account = useActiveAccount();
  const wallet  = account?.address ?? "";
  const ADMIN   = "0x91706ECbA7af59616D4005F37979528226532E6B".toLowerCase();

  /* state */
  const [users,   setUsers]   = useState<any[]>([]);
  const [agents,  setAgents]  = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState<"users" | "agents">("users");
  const [view,    setView]    = useState<"table" | "card">("table");

  /* fetch */
  useEffect(() => {
    if (wallet.toLowerCase() !== ADMIN) return;

    (async () => {
      /* ---------- users ---------- */
      const snap = await getDocs(collection(db, "users"));
      const allUsers = await Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data();
          const ref  = doc(db, "users", d.id);
          const meta = await getDoc(ref);
          let createdAt = meta.exists() ? meta.data()?.createdAt?.toDate?.() : null;
          if (!createdAt) {
            await updateDoc(ref, { createdAt: serverTimestamp() });
            createdAt = new Date();
          }
          return {
            id: d.id,
            ...data,
            createdAt,
            avatar: window.multiavatar(`${data.displayName}-${d.id}`),
          };
        })
      );
      setUsers(
        allUsers.sort((a, b) => (b.createdAt?.getTime?.() ?? 0) - (a.createdAt?.getTime?.() ?? 0))
      );

      /* ---------- agents ---------- */
      const tempAgents: any[] = [];
      for (const u of allUsers) {
        const deals = await getDocs(collection(db, `users/${u.id}/deals`));
        deals.forEach((deal) => {
          const ag = deal.data().agent;
          if (ag && ag.rating && ag.rating > 0) {
            tempAgents.push({
              userId: u.id,
              ...ag,
            });
          }
        });
      }
      setAgents(tempAgents);
      setLoading(false);
    })();
  }, [wallet]);

  /* access gate after hooks */
  if (wallet.toLowerCase() !== ADMIN) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0B1519]">
        <p className="text-lg">Access restricted.</p>
      </div>
    );
  }

  /* render */
  return (
    <div className="min-h-screen w-full bg-[#0B1519] text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-[#00FFFF]">🧠 SyncFolio Analytics</h1>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-10">
          {(["users", "agents"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-full transition ${
                tab === t ? "bg-[#6e5690] text-black" : "bg-transparent border border-zinc-600 text-white"
              }`}
            >
              {t === "users" ? "Deal Finders" : "RE Agents"}
            </button>
          ))}
        </div>

        {tab === "users" ? (
          <UsersTab
            users={users}
            loading={loading}
            viewMode={view}
            setViewMode={setView}
          />
        ) : (
          <AgentsTab agents={agents} loading={loading} />
        )}
      </div>
    </div>
  );
}
