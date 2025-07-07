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
  const account = useActiveAccount();
  const wallet  = account?.address ?? "";

  const [users,   setUsers]   = useState<any[]>([]);
  const [agents,  setAgents]  = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState<"users" | "agents">("users");
  const [view,    setView]    = useState<"table" | "card">("table");

  useEffect(() => {
    const normalizePhone = (phone = "") => phone.replace(/\D/g, "").slice(-10);
    const agentKey = (name = "", phone = "", email = "") =>
      email ? email.trim().toLowerCase() :
      name && phone ? `${name.trim().toLowerCase()}-${normalizePhone(phone)}` : "unknown";

    (async () => {
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

      const agentMap: { [key: string]: any } = {};

      for (const u of allUsers) {
        const deals = await getDocs(collection(db, `users/${u.id}/deals`));
        deals.forEach((deal) => {
          const ag = deal.data().agent;
          if (ag && ag.rating > 0) {
            const key = agentKey(ag.name, ag.phone, ag.email);
            if (!agentMap[key]) {
              agentMap[key] = {
                name: ag.name,
                phone: ag.phone,
                email: ag.email,
                timezone: ag.timezone,
                ratingSum: ag.rating,
                ratingCount: 1,
              };
            } else {
              agentMap[key].ratingSum += ag.rating;
              agentMap[key].ratingCount += 1;
            }
          }
        });
      }

      const tempAgents = Object.values(agentMap).map((a: any) => ({
        name: a.name,
        phone: a.phone,
        email: a.email,
        timezone: a.timezone,
        rating: a.ratingSum / a.ratingCount,
        ratingCount: a.ratingCount,
      }));

      setAgents(tempAgents);
      setLoading(false);
    })();
  }, [wallet]);

  return (
    <div className="min-h-screen w-full bg-[#0B1519] text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Analytics
        </h1>

        <div className="flex justify-center gap-6 mb-10">
          {["users", "agents"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-6 py-2 rounded-full transition font-medium ${
                tab === t
                  ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-black shadow-md"
                  : "bg-transparent border border-zinc-600 text-white"
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
