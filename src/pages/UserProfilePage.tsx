import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
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
  const { id } = useParams();            // displayName or 0x address
  const [profile, setProfile] = useState<any | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------------------------------------------- *
   *  Load profile data (by displayName, then by address) *
   * ---------------------------------------------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;

      const usersRef = collection(db, "users");

      // 1️⃣  Try displayName match
      const q = query(usersRef, where("displayName", "==", id));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        setProfile(docSnap.data());
        setWalletAddress(docSnap.id);
      } else {
        // 2️⃣  Fallback to wallet-address match
        const fallbackSnap = await getDocs(usersRef);
        const fallbackDoc = fallbackSnap.docs.find(
          (doc) => doc.id.toLowerCase() === id.toLowerCase()
        );

        if (fallbackDoc) {
          setProfile(fallbackDoc.data());
          setWalletAddress(fallbackDoc.id);
        } else {
          // 3️⃣  Nothing in DB → show raw address view
          setProfile(null);
          setWalletAddress(id);
        }
      }

      setLoading(false);
    };

    fetchProfile();
  }, [id]);

  /* ------------------------- *
   *        UI states          *
   * ------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1519] text-white text-center px-4 py-20">
        <h1 className="text-3xl font-bold mb-6">Loading Profile…</h1>
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-[#0B1519] text-white text-center px-4 py-20">
        <h1 className="text-3xl font-bold mb-6">Invalid Profile</h1>
      </div>
    );
  }

  /* ------------------------- *
   *        Main render        *
   * ------------------------- */
  const avatarSeed = `${profile?.displayName || walletAddress}-${walletAddress}`;
  const svg = window.multiavatar(avatarSeed);

  return (
    <div className="min-h-screen bg-[#0B1519] text-white text-center px-4 py-20">
      {/* Avatar */}
      <div
        className="w-28 h-28 mx-auto mb-4 block"
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      {/* Display name / wallet */}
      <h2 className="text-2xl font-bold mb-1">
        {profile?.displayName || "Unnamed Account"}
      </h2>
      <p className="text-sm text-gray-400 mb-1">
        <span className="font-semibold text-white">Account Address:</span>
      </p>
      <a
        href={`https://basescan.org/address/${walletAddress}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-400 break-all mb-4 underline hover:text-cyan-300"
      >
        {walletAddress}
      </a>

      {/* Zip code */}
      {profile?.zipcode && (
        <>
          <p className="text-sm text-gray-400 mb-1">
            <span className="font-semibold text-white">Zipcode:</span>
          </p>
          <p className="text-sm text-gray-400 mb-4">{profile.zipcode}</p>
        </>
      )}

      {/* Role badges */}
      {profile?.roles?.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {profile.roles.map((role: string) => (
            <span
              key={role}
              className={`w-44 px-3 py-1 rounded-full text-sm font-semibold text-center ${
                roleGradients[role] || "bg-zinc-600"
              }`}
            >
              {role}
            </span>
          ))}
        </div>
      )}

      {/* Dashboard cards */}
      <div className="mt-10">
        <DashboardCards walletAddress={walletAddress} />
      </div>

      {/* Balances card – ✨ NO 'CREDITS' here (hook supplies it) */}
      <div className="mt-10">
        <Balances
          hideActions
          remote
          walletAddress={walletAddress}
          balances={{
            platform: {
              USD:   profile?.platformUSD    ?? 0,
              FOLIO: profile?.platformFOLIO  ?? 0,
              CREDITS: profile?.platformCREDITS ?? 0,   // ← now accepted
            },
            wallet: {
              USDC: profile?.walletUSDC  ?? 0,
              FOLIO: profile?.walletFOLIO ?? 0,
              ETH:  profile?.walletETH   ?? 0,
            },
          }}
        />

      </div>

      {/* Closed deals (table) */}
      {profile && (
        <div className="mt-16 max-w-5xl mx-auto text-left">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Closed Deals</h3>
            <p className="text-green-400 font-semibold">
              Total Volume: $825,000
            </p>
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
                {/* …demo rows … */}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
