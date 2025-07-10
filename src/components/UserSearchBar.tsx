// src/components/UserSearchBar.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function UserSearchBar() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();
  const q = query.trim().toLowerCase();
  if (!q) return;

  setLoading(true);

  const snapshot = await getDocs(collection(db, "users"));
  const users = snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as { displayName?: string }),
  }));

  const match =
    users.find((u) => u.displayName?.toLowerCase() === q) ||
    users.find((u) => u.id.toLowerCase() === q);

  setLoading(false);

  if (match?.displayName) {
    navigate(`/profile/${match.displayName}`);
    setQuery(""); // ✅ reset input field
  } else {
    alert("User not found");
  }
};


  return (
    <form
      onSubmit={handleSearch}
      className="bg-[#0D1B24] border-b border-zinc-800 px-4 py-2 flex items-center gap-2"
    >
      <input
        type="text"
        placeholder="Search Name or 0xAccount"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 bg-zinc-900 text-white px-3 py-2 rounded-full text-sm border border-zinc-700 focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className={`w-32 py-2 rounded-full transition font-medium text-center ${
          loading
            ? "bg-zinc-600 text-white cursor-not-allowed"
            : "bg-gradient-to-r from-purple-400 to-cyan-400 text-black shadow-md hover:brightness-110"
        }`}
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}
