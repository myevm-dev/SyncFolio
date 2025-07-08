import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import DashboardCards from "../components/DashboardCards";
import Balances from "../components/Balances";

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
      <Link
        to={`/profile/${id}`}
        className="w-28 h-28 mx-auto mb-4 block"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
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

      {/* Balances Card */}
      <div className="mt-10">
        <Balances
          hideActions
          walletAddress={id}
          balances={{
            platform: {
              USD: profile.platformUSD || 0,
              FOLIO: profile.platformFOLIO || 0,
              CREDITS: profile.platformCREDITS || 0,
            },
            wallet: {
              USDC: profile.walletUSDC || 0,
              FOLIO: profile.walletFOLIO || 0,
              ETH: profile.walletETH || 0,
            },
          }}
        />


      </div>

      {/* Closed Deals Table (Social Proof) */}
      <div className="mt-16 max-w-5xl mx-auto text-left">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Closed Deals</h3>
          <p className="text-green-400 font-semibold">Total Volume: $825,000</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#050505] border border-neutral-700 text-sm text-left text-white rounded-md overflow-hidden">
            <thead className="bg-[#0B1519] border-b border-neutral-700">
              <tr>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Close Date</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Method</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-700">
                <td className="px-4 py-2">123 Main St</td>
                <td className="px-4 py-2">Dallas, TX</td>
                <td className="px-4 py-2">06/30/2025</td>
                <td className="px-4 py-2 text-green-400 font-medium">$280,000</td>
                <td className="px-4 py-2 text-cyan-300">Seller Finance</td>
              </tr>
              <tr className="border-b border-zinc-700">
                <td className="px-4 py-2">456 Oak Ave</td>
                <td className="px-4 py-2">Phoenix, AZ</td>
                <td className="px-4 py-2">05/12/2025</td>
                <td className="px-4 py-2 text-green-400 font-medium">$195,000</td>
                <td className="px-4 py-2 text-blue-300">Cash</td>
              </tr>
              <tr className="border-b border-zinc-700">
                <td className="px-4 py-2">789 Sunset Blvd</td>
                <td className="px-4 py-2">Las Vegas, NV</td>
                <td className="px-4 py-2">04/02/2025</td>
                <td className="px-4 py-2 text-green-400 font-medium">$350,000</td>
                <td className="px-4 py-2 text-yellow-300">Subto</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
