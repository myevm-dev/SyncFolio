import { useEffect, useState } from "react";
import { Deal } from "../types/deal";

import { Dice5Icon } from "lucide-react";
import { CurrencyDollarIcon, LinkIcon } from "@heroicons/react/24/solid";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { XCircleIcon, PlusCircleIcon, ShareIcon } from "@heroicons/react/24/solid";
import TeamShareModal from "./TeamShareModal";



interface TeamMember {
  address: string;
  displayName: string;
}

const statuses = [
  "lead",
  "called",
  "contacted",
  "offer sent",
  "contract sent",
  "closed",
];

const statusColors: Record<string, string> = {
  lead: "bg-yellow-400 text-black",
  called: "bg-blue-400 text-black",
  contacted: "bg-indigo-400 text-white",
  "offer sent": "bg-orange-400 text-black",
  "contract sent": "bg-purple-400 text-white",
  closed: "bg-green-500 text-white",
};

const methods = ["unknown", "cash", "seller finance", "takeover", "hybrid"];


  export default function DealsTable({
    refreshKey,
    onLoad,
    walletAddress,
    showChart,
    setShowChart,
  }: {
    refreshKey: number;
    onLoad: (deal: Deal) => void;
    walletAddress: string;
    showChart: boolean;
    setShowChart: React.Dispatch<React.SetStateAction<boolean>>;
  }) {

  const [toast, setToast] = useState<string | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const [editingMethodId, setEditingMethodId] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [sharedUsers, setSharedUsers] = useState<Record<string, { displayName: string }>>({});



  const fetchDeals = async () => {
    if (!walletAddress) return;
    try {
      const snapshot = await getDocs(collection(db, `users/${walletAddress}/deals`));
      const data = snapshot.docs.map((doc) => ({
        ...(doc.data() as Deal),
        id: doc.id,
        status: doc.data().status || "lead",
        createdAt: doc.data().createdAt || { seconds: 0 },
      }));

      const ADMIN = "0x91706ECbA7af59616D4005F37979528226532E6B".toLowerCase();
      const isAdmin = walletAddress.toLowerCase() === ADMIN;
      const limitedData = isAdmin ? data : data.slice(0, 500);

      setDeals(limitedData);
      await fetchSharedUsers(limitedData); // <-- Add this line

    } catch (err) {
      console.error("Error fetching deals:", err);
    } finally {
      setLoading(false);
    }
  };


  const fetchTeamMembers = async () => {
    if (!walletAddress) return;
    try {
      const userSnap = await getDoc(doc(db, "users", walletAddress));
      const userData = userSnap.exists() ? userSnap.data() : {};
      const team = userData.team || [];
      const memberData = await Promise.all(team.map(async (addr: string) => {
        const ref = doc(db, "users", addr);
        const snap = await getDoc(ref);
        return { address: addr, displayName: snap.data()?.displayName || addr };
      }));
      setTeamMembers(memberData);
    } catch (err) {
      console.error("Error fetching team members:", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchDeals();
    fetchTeamMembers();
  }, [refreshKey, walletAddress]);

  const fetchSharedUsers = async (deals: Deal[]) => {
  const addresses = Array.from(
    new Set([
      ...deals.map((d) => d.sharedBy).filter(Boolean),
      ...deals.flatMap((d) => d.sharedWith || []),
    ])
  ) as string[];

  const result: Record<string, { displayName: string }> = {};

  await Promise.all(
    addresses.map(async (addr) => {
      const ref = doc(db, "users", addr);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        result[addr] = { displayName: snap.data().displayName || "Unnamed" };
      }
    })
  );

  setSharedUsers(result);
};

  const handleDelete = async (id: string) => {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50";
    modal.innerHTML = `
      <div class='bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl max-w-sm w-full text-center'>
        <h2 class='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>Confirm Delete</h2>
        <p class='text-sm text-gray-700 dark:text-gray-300 mb-6'>Are you sure you want to delete this deal?</p>
        <div class='flex justify-center gap-4'>
          <button id='confirmYes' class='px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700'>Yes</button>
          <button id='confirmNo' class='px-4 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'>Cancel</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    return new Promise<void>((resolve) => {
      modal.querySelector("#confirmYes")?.addEventListener("click", async () => {
        try {
          await deleteDoc(doc(db, `users/${walletAddress}/deals`, id));
          setDeals((prev) => prev.filter((deal) => deal.id !== id));
        } catch (err) {
          console.error("Failed to delete deal:", err);
        } finally {
          modal.remove();
          resolve();
        }
      });
      modal.querySelector("#confirmNo")?.addEventListener("click", () => {
        modal.remove();
        resolve();
      });
    });
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, `users/${walletAddress}/deals`, id), {
        status: newStatus,
      });
      setDeals((prev) =>
        prev.map((deal) =>
          deal.id === id ? { ...deal, status: newStatus } : deal
        )
      );
      setEditingStatusId(null);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleMethodChange = async (id: string, newMethod: string) => {
    try {
      await updateDoc(doc(db, `users/${walletAddress}/deals`, id), {
        method: newMethod,
      });
      setDeals((prev) =>
        prev.map((deal) =>
          deal.id === id ? { ...deal, method: newMethod } : deal
        )
      );
      setEditingMethodId(null);
    } catch (err) {
      console.error("Failed to update method:", err);
    }
  };

  const sortedDeals = [...deals].sort((a, b) => {
    const aTime = a?.createdAt?.seconds || 0;
    const bTime = b?.createdAt?.seconds || 0;
    return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
  });

  const filteredDeals = sortedDeals.filter((deal) => {
    const matchesStatus = filter ? deal.status === filter : true;
    const lowerSearch = search.toLowerCase();
    const matchesSearch =
      deal.address?.toLowerCase().includes(lowerSearch) ||
      deal.agentName?.toLowerCase().includes(lowerSearch) ||
      deal.agentPhone?.toLowerCase().includes(lowerSearch);
    return matchesStatus && matchesSearch;
  });

  if (!walletAddress) {
    return <div className="text-center text-sm text-zinc-400">Sign In to view saved deals.</div>;
  }

  if (loading) return <div className="text-center text-sm">Loading deals...</div>;
  if (!deals.length) return <div className="text-center text-sm text-zinc-400">No deals saved yet.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 mb-20">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 flex-wrap">
        Saved Deals

        {/* Toggle Chart */}
        <button
          onClick={() => setShowChart((prev) => !prev)}
          className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          {showChart ? "Hide Chart" : "Show Chart"}
        </button>

        {/* Call Random Lead */}
        <button
          title="Call Random Lead"
          onClick={() => {
            const validLeads = deals.filter((d) => {
              if (d.status !== "lead") return false;
              const timeZoneMap: Record<string, string> = {
                Hawaii: "Pacific/Honolulu",
                Pacific: "America/Los_Angeles",
                Mountain: "America/Denver",
                Central: "America/Chicago",
                Eastern: "America/New_York",
              };
              const timeZone = timeZoneMap[d.agentTimezone || ""];
              if (!timeZone) return false;

              const localHour = parseInt(
                new Intl.DateTimeFormat("en-US", {
                  hour: "numeric",
                  hour12: false,
                  timeZone,
                }).format(new Date())
              );

              return localHour >= 8 && localHour < 17;
            });

            if (!validLeads.length) {
              setToast("No leads are currently within working hours (8 AM – 5 PM).");
              setTimeout(() => setToast(null), 4000);
              return;
            }

            const random = validLeads[Math.floor(Math.random() * validLeads.length)];
            onLoad(random);

            setTimeout(() => {
              const modalTrigger = document.querySelector("#openScriptModalTrigger") as HTMLButtonElement;
              modalTrigger?.click();
            }, 100);
          }}
          className="hover:opacity-80 transition"
        >
          <Dice5Icon className="w-5 h-5 text-cyan-500" />
        </button>
      </h2>
      {toast && (
        <div className="bg-yellow-600 text-white px-4 py-2 rounded shadow mb-4 animate-fade-in">
          {toast}
        </div>
      )}





      <div className="mb-4 flex flex-wrap items-center gap-2 sm:flex-nowrap sm:justify-between">
        <span className="text-sm">Filter:</span>
        <button onClick={() => setFilter("")} className={`text-xs px-3 py-1 rounded-full border ${filter === "" ? "bg-blue-600 text-white" : "bg-white text-black"}`}>All</button>
        {statuses.map((status) => (
          <button key={status} onClick={() => setFilter(status)} className={`text-xs px-3 py-1 rounded-full border ${filter === status ? "bg-blue-600 text-white" : "bg-white text-black"}`}>{status}</button>
        ))}
        <button
          onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
          className={`text-xs px-3 py-1 rounded border text-white ${
            sortOrder === "newest"
              ? "bg-[#068989] hover:bg-[#057676]"
              : "bg-[#6e5690] hover:bg-[#5b4677]"
          }`}
        >
          {sortOrder === "newest" ? "Sort: Newest First" : "Sort: Oldest First"}
        </button>

        <input
          type="text"
          placeholder="Search address, agent, or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] max-w-xs px-4 py-2 rounded border text-sm bg-white text-black"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-neutral-700 text-sm">
          <thead className="bg-neutral-800 text-white">
            <tr>
              <th className="border px-3 py-2">Address</th>
              <th className="border px-3 py-2">Beds</th>
              <th className="border px-3 py-2">Baths</th>
              <th className="border px-3 py-2">ARV</th>
              <th className="border px-3 py-2">Price</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Method</th>
              <th className="border px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeals.map((deal) => (
              <tr key={deal.id} className="hover:bg-neutral-900">
                <td className="border px-3 py-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {deal.zillowUrl ? (
                      <a
                        href={deal.zillowUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {deal.address}
                      </a>
                    ) : (
                      deal.address
                    )}

                    {/* Avatar for sharedBy (sender) */}
                    {deal.sharedBy && sharedUsers[deal.sharedBy] && (
                      <a
                        href={`/profile/${deal.sharedBy}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-5 h-5 rounded-full overflow-hidden border border-white"
                        title={`Shared by ${sharedUsers[deal.sharedBy].displayName}`}
                        dangerouslySetInnerHTML={{
                          __html: window.multiavatar(
                            `${sharedUsers[deal.sharedBy].displayName}-${deal.sharedBy}`
                          ),
                        }}
                      />
                    )}

                    {/* Avatars for sharedWith (recipients) */}
                    {deal.sharedWith?.map(
                      (addr) =>
                        sharedUsers[addr] && (
                          <a
                            key={addr}
                            href={`/profile/${addr}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-5 h-5 rounded-full overflow-hidden border border-blue-400"
                            title={`Shared with ${sharedUsers[addr].displayName}`}
                            dangerouslySetInnerHTML={{
                              __html: window.multiavatar(
                                `${sharedUsers[addr].displayName}-${addr}`
                              ),
                            }}
                          />
                        )
                    )}
                  </div>
                </td>


                <td className="border px-3 py-2 text-center">{deal.beds || "-"}</td>
                <td className="border px-3 py-2 text-center">{deal.baths || "-"}</td>
                <td className="border px-3 py-2 text-center">${deal.arv || "-"}</td>
                <td className="border px-3 py-2 text-center">${deal.listingPrice || "-"}</td>
                <td className="border px-3 py-2 text-center">
                  {editingStatusId === deal.id ? (
                    <select
                      value={deal.status || ""}
                      onChange={(e) => handleStatusChange(deal.id, e.target.value)}
                      className="bg-neutral-800 border text-white text-xs px-2 py-1 rounded"
                    >
                      <option value="" disabled>Select status</option>
                      {statuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  ) : (
                    <span onClick={() => setEditingStatusId(deal.id)} className={`px-2 py-1 text-xs rounded-full font-medium cursor-pointer hover:opacity-80 ${statusColors[deal.status ?? ""] || "bg-neutral-700 text-white"}`}>{deal.status || "lead"}</span>
                  )}
                </td>
                <td className="border px-3 py-2 text-center">
                  {editingMethodId === deal.id ? (
                    <select
                      value={deal.method || ""}
                      onChange={(e) => handleMethodChange(deal.id, e.target.value)}
                      className="bg-neutral-800 border text-white text-xs px-2 py-1 rounded"
                    >
                      <option value="" disabled>Select method</option>
                      {methods.map((method) => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  ) : deal.method ? (
                    <span onClick={() => setEditingMethodId(deal.id)} className="text-xs font-semibold inline-block px-2 py-1 rounded-full bg-neutral-700 text-white cursor-pointer hover:bg-neutral-600">{deal.method}</span>
                  ) : (
                    <button onClick={() => setEditingMethodId(deal.id)} title="Set method">
                      <PlusCircleIcon className="w-5 h-5 text-blue-400 hover:text-blue-600 mx-auto" />
                    </button>
                  )}
                </td>
                <td className="border px-3 py-2 text-center space-x-2">
                {/* Load Button */}
                <button onClick={() => onLoad(deal)} className="text-xs px-2 py-1 bg-blue-700 text-white rounded hover:bg-blue-800">
                  Load
                </button>

                {/* Delete Button */}
                <button onClick={() => handleDelete(deal.id)} title="Delete">
                  <XCircleIcon className="w-5 h-5 text-red-500 hover:text-red-700 inline-block" />
                </button>

                {/* Link Button */}
                {deal.zillowUrl && (
                  <a href={deal.zillowUrl} target="_blank" rel="noopener noreferrer" title="Open Link">
                    <LinkIcon className="w-5 h-5 text-blue-400 hover:text-blue-600 inline-block" />
                  </a>
                )}

                {/* Dollar Icon */}
                <button title="Sell Lead Soon">
                  <CurrencyDollarIcon className="w-5 h-5 text-green-500 hover:text-green-700 inline-block" />
                </button>

                {/* Share Button */}
                <button
                  onClick={() => (setSelectedDeal(deal), setShowShareModal(true))}
                  title="Share"
                >
                  <ShareIcon className="w-5 h-5 text-purple-500 hover:text-purple-600 inline-block" />
                </button>


              </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedDeal && showShareModal && (
        <TeamShareModal
          teamMembers={teamMembers}
          selectedDeal={selectedDeal}
          walletAddress={walletAddress}
          onClose={() => {
            setSelectedDeal(null);
            setShowShareModal(false);
          }}
        />


      )}
    </div>
  );
}
