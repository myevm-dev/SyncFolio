import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Pencil } from "lucide-react";

declare global {
  interface Window {
    multiavatar: (id: string) => string;
  }
}

export default function ProfilePage() {
  const account = useActiveAccount();
  const walletAddress = account?.address || "";

  const [displayName, setDisplayName] = useState("");
  const [editing, setEditing] = useState(false);
  const [liveName, setLiveName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!walletAddress) return;
      const ref = doc(db, "users", walletAddress);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setDisplayName(data.displayName || "Unnamed");
        setLiveName(data.displayName || "Unnamed");
      } else {
        setDisplayName("Unnamed");
        setLiveName("Unnamed");
      }
      setLoading(false);
    };
    fetchProfile();
  }, [walletAddress]);

  const handleSave = async () => {
    if (!walletAddress) return;
    const ref = doc(db, "users", walletAddress);
    await setDoc(ref, { displayName: liveName }, { merge: true });
    setDisplayName(liveName);
    setEditing(false);
  };

  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-[#0B1519] text-white text-center px-4 py-20">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <p className="text-gray-400">Please connect your wallet to view profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1519] text-white text-center px-4 py-20">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  const svg = window.multiavatar(liveName);

  return (
    <div className="min-h-screen bg-[#0B1519] text-white text-center px-4 py-20">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>

      <div
        className="w-28 h-28 mx-auto mb-4"
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      {editing ? (
        <div className="flex flex-col items-center gap-2 mb-2">
          <input
            value={liveName}
            onChange={(e) => setLiveName(e.target.value)}
            className="bg-zinc-800 px-3 py-1 rounded text-sm"
          />
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm"
          >
            Save Name
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="font-bold text-lg">{displayName}</span>
          <button
            onClick={() => setEditing(true)}
            className="text-blue-400 text-sm hover:underline flex items-center"
          >
            <Pencil size={14} className="mr-1" />
            Edit
          </button>
        </div>
      )}

      <p className="text-gray-400 break-all">Account: {walletAddress}</p>
            {/* Dashboard Cards */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          {
            label: "Earnings",
            value: "$0.00",
            icon: "💰",
          },
          {
            label: "Buying",
            value: "0 Properties",
            icon: "🏠",
          },
          {
            label: "Selling",
            value: "0 Properties",
            icon: "📤",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-[#111827] rounded-xl p-6 shadow-md border border-zinc-700 flex justify-between items-center"
          >
            <div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-sm text-gray-400">{card.label}</p>
            </div>
            <div className="text-3xl">{card.icon}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
