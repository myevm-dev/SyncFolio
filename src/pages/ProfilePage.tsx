import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Pencil } from "lucide-react";

export default function ProfilePage() {
  const account = useActiveAccount();
  const walletAddress = account?.address;

  const [displayName, setDisplayName] = useState("Anonymous");
  const [editing, setEditing] = useState(false);
  const [inputName, setInputName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchDisplayName = async () => {
      if (!walletAddress) return;
      const ref = doc(db, "users", walletAddress);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        if (data.displayName) {
          setDisplayName(data.displayName);
          setInputName(data.displayName);
        }
      }
    };

    fetchDisplayName();
  }, [walletAddress]);

  const handleUpdate = async () => {
    if (!walletAddress || !inputName.trim()) return;
    setLoading(true);
    try {
      await setDoc(
        doc(db, "users", walletAddress),
        { displayName: inputName.trim() },
        { merge: true }
      );
      setDisplayName(inputName.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto py-16 px-4 text-white">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">User Profile</h1>

      {walletAddress ? (
        <div className="bg-[#0B1519] border border-gray-700 rounded-xl p-6 max-w-lg mx-auto space-y-6 shadow-md">
          {/* Display Name */}
          <div>
            <p className="text-sm text-gray-400 mb-1">Display Name</p>
            {!editing ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{displayName}</span>
                <button
                  onClick={() => setEditing(true)}
                  className="text-gray-400 hover:text-white"
                  title="Edit display name"
                >
                  <Pencil size={16} />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#044a4b]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="bg-[#044a4b] hover:brightness-110 text-white px-4 py-1 rounded-md text-sm transition disabled:opacity-50"
                  >
                    {loading ? "Saving..." : saved ? "Saved ✔" : "Update Name"}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setInputName(displayName);
                    }}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Wallet Address */}
          <div>
            <p className="text-sm text-gray-400 mb-1">Account</p>
            <p className="text-sm font-mono break-all text-green-400">{walletAddress}</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-12 text-lg">Please log in to view your profile.</p>
      )}
    </div>
  );
}
