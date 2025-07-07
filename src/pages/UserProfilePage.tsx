import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import DashboardCards from "../components/DashboardCards";

const roleGradients: Record<string, string> = {
  Investor: "bg-gradient-to-r from-green-400 to-blue-600",
  Wholesaler: "bg-gradient-to-r from-lime-400 to-emerald-500",
  "Real Estate Agent": "bg-gradient-to-r from-indigo-500 to-purple-400",
  Homeowner: "bg-gradient-to-r from-pink-400 to-rose-500",
  "Dispo Partner": "bg-gradient-to-r from-blue-400 to-cyan-500",
  "Deal Finder": "bg-gradient-to-r from-yellow-400 to-orange-500",
  Contractor: "bg-gradient-to-r from-teal-400 to-emerald-300",
  Lender: "bg-gradient-to-r from-fuchsia-500 to-pink-400",
  Appraiser: "bg-gradient-to-r from-violet-400 to-sky-400",
  Admin: "bg-gradient-to-r from-amber-400 via-red-500 to-pink-500",
};

export default function UserProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      const ref = doc(db, "users", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProfile(snap.data());
      }
      setLoading(false);
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1519] text-white text-center px-4 py-20">
        <h1 className="text-3xl font-bold mb-6">Loading Profile…</h1>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0B1519] text-white text-center px-4 py-20">
        <h1 className="text-3xl font-bold mb-6">User Not Found</h1>
      </div>
    );
  }

  const avatarSeed = `${profile.displayName}-${id}`;
  const svg = window.multiavatar(avatarSeed);

  return (
    <div className="min-h-screen bg-[#0B1519] text-white text-center px-4 py-20">
      <Link to={`/profile/${id}`} className="w-28 h-28 mx-auto mb-4 block" dangerouslySetInnerHTML={{ __html: svg }} />
      <h2 className="text-2xl font-bold mb-1">{profile.displayName}</h2>
      <p className="text-gray-400 text-sm mb-4 break-all">{id}</p>
      {profile.zipcode && <p className="text-sm text-zinc-400">{profile.zipcode}</p>}

      {profile.roles && profile.roles.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {profile.roles.map((role: string) => (
            <span
              key={role}
              className={`w-44 px-3 py-1 rounded-full text-sm text-white font-semibold text-center ${
                roleGradients[role] || "bg-zinc-600"
              }`}
            >
              {role}
            </span>
          ))}
        </div>
      )}

      {/* Dashboard Cards */}
      <div className="mt-10">
        <DashboardCards walletAddress={id || ""} />
      </div>
    </div>
  );
}

