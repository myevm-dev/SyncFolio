import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Pencil } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../lottie/Animation - 1749869487293.json";
import DashboardCards from "../components/DashboardCards";
import TeamSection from "../components/TeamSection";
import ReferralSection from "../components/ReferralSection";
import IncomingInvites from "../components/IncomingInvites";

const roleOptions = [
  "Investor",
  "Wholesaler",
  "Real Estate Agent",
  "Homeowner",
  "Dispo Partner",
  "Deal Finder",
  "Contractor",
  "Lender",
  "Appraiser",
];

const roleGradients: Record<string, string> = {
  Investor: "bg-gradient-to-r from-green-400 to-blue-500",
  Wholesaler: "bg-gradient-to-r from-pink-500 to-yellow-500",
  "Real Estate Agent": "bg-gradient-to-r from-indigo-400 to-purple-500",
  Homeowner: "bg-gradient-to-r from-rose-400 to-red-500",
  "Dispo Partner": "bg-gradient-to-r from-cyan-400 to-blue-500",
  "Deal Finder": "bg-gradient-to-r from-amber-400 to-orange-500",
  Contractor: "bg-gradient-to-r from-lime-400 to-green-500",
  Lender: "bg-gradient-to-r from-fuchsia-400 to-pink-500",
  Appraiser: "bg-gradient-to-r from-sky-400 to-teal-500",
};

declare global {
  interface Window {
    multiavatar: (id: string) => string;
  }
}

export default function ProfilePage() {
  const account = useActiveAccount();
  const walletAddress = account?.address || "";

  const [displayName, setDisplayName] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [editingZip, setEditingZip] = useState(false);
  const [liveName, setLiveName] = useState("");
  const [liveZip, setLiveZip] = useState("");
  const [loading, setLoading] = useState(true);
  const [nameTaken, setNameTaken] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(0);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [balances, setBalances] = useState({
    platform: { USD: 0, FOLIO: 0, CREDITS: 0 },
    wallet: { USDC: 0, FOLIO: 0, ETH: 0 },
  });

  useEffect(() => {
    const ensureUserRecord = async () => {
      if (!walletAddress) return;
      const ref = doc(db, "users", walletAddress);
      const snap = await getDoc(ref);

      const localReferrerName = localStorage.getItem("referrer");

      let resolvedReferrerName: string | null = null;
      if (localReferrerName) {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const referrerDoc = usersSnapshot.docs.find(
          (docSnap) =>
            docSnap.data().displayName?.toLowerCase() === localReferrerName.toLowerCase()
        );
        resolvedReferrerName = referrerDoc?.data()?.displayName || null;
      }

      if (!snap.exists()) {
        await setDoc(ref, {
          displayName: "Unnamed",
          zipcode: "",
          team: [],
          createdAt: new Date(),
          referredBy: resolvedReferrerName,
        });
      } else {
        const data = snap.data();
        if (!data.referredBy && resolvedReferrerName) {
          await setDoc(ref, { referredBy: resolvedReferrerName }, { merge: true });
        }
      }
    };

    ensureUserRecord();
  }, [walletAddress]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!walletAddress) return;
      const ref = doc(db, "users", walletAddress);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setDisplayName(data.displayName || "Unnamed");
        setZipcode(data.zipcode || "");
        setLiveName(data.displayName || "Unnamed");
        setLiveZip(data.zipcode || "");
      } else {
        setDisplayName("Unnamed");
        setZipcode("");
        setLiveName("Unnamed");
        setLiveZip("");
      }
      setLoading(false);
    };
    fetchProfile();
  }, [walletAddress]);

  useEffect(() => {
    const checkDuplicateName = async () => {
      if (!liveName.trim()) {
        setNameTaken(false);
        return;
      }
      const usersSnapshot = await getDocs(collection(db, "users"));
      const taken = usersSnapshot.docs.some(
        (docSnap) =>
          docSnap.id !== walletAddress &&
          docSnap.data().displayName?.toLowerCase() === liveName.toLowerCase()
      );
      setNameTaken(taken);
    };
    checkDuplicateName();
  }, [liveName, walletAddress]);

  const handleSave = async () => {
    if (!walletAddress || !liveName || nameTaken) return;
    const ref = doc(db, "users", walletAddress);
    await setDoc(ref, { displayName: liveName, zipcode: liveZip }, { merge: true });
    setDisplayName(liveName);
    setZipcode(liveZip);
    setEditingName(false);
    setEditingZip(false);
  };

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-[#0B1519] text-white text-center px-4 py-20 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="w-72 h-72">
          <Lottie animationData={animationData} loop autoplay />
        </div>
        <p className="text-gray-400 mb-6">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1519] text-white text-center px-4 py-20">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  const avatarSeed = `${liveName}-${walletAddress}`;
  const svg = window.multiavatar(avatarSeed);

  return (
    <div className="min-h-screen bg-[#0B1519] text-white text-center px-4 py-20">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="w-28 h-28 mx-auto mb-4" dangerouslySetInnerHTML={{ __html: svg }} />

      <div className="mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          {editingName ? (
            <input
              value={liveName}
              onChange={(e) => setLiveName(e.target.value)}
              className={`bg-zinc-800 px-3 py-1 rounded text-sm ${
                nameTaken ? "border border-red-500 text-red-400" : ""
              }`}
            />
          ) : (
            <span className="font-bold text-lg">{displayName}</span>
          )}
          <button
            onClick={() => setEditingName(!editingName)}
            className="text-blue-400 text-sm hover:underline flex items-center"
          >
            <Pencil size={14} className="mr-1" />
            Edit Name
          </button>
        </div>

        <div className="flex items-center justify-center gap-2">
          {editingZip ? (
            <input
              value={liveZip}
              onChange={(e) => setLiveZip(e.target.value)}
              className="bg-zinc-800 px-3 py-1 rounded text-sm"
            />
          ) : (
            <span className="text-sm text-zinc-400">{zipcode}</span>
          )}
          <button
            onClick={() => setEditingZip(!editingZip)}
            className="text-blue-400 text-sm hover:underline flex items-center"
          >
            <Pencil size={14} className="mr-1" />
            Edit ZipCode
          </button>
        </div>

        {(editingName || editingZip) && (
          <div className="mt-2">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm"
              disabled={nameTaken}
            >
              Save
            </button>
          </div>
        )}
      </div>

      {nameTaken && <p className="text-red-500 text-xs mb-2">Name already taken</p>}

      <p className="text-gray-400 break-all">Account: {walletAddress}</p>

      <div className="mt-4 space-y-2 text-center">
        {Array.from({ length: Math.ceil(roleOptions.length / 5) }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex justify-center flex-wrap gap-2">
            {roleOptions.slice(rowIndex * 5, rowIndex * 5 + 5).map((role) => (
              <button
                key={role}
                onClick={() => toggleRole(role)}
                className={`w-44 px-3 py-1 rounded-full text-sm text-white transition border-none text-center ${
                  selectedRoles.includes(role) ? "ring ring-offset-1 ring-white" : ""
                } ${roleGradients[role]}`}
              >
                {role}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-cyan-400 mb-2">Platform Balances</h3>
          <p className="text-sm text-white">USD: ${balances.platform.USD}</p>
          <p className="text-sm text-white">FOLIO: {balances.platform.FOLIO}</p>
          <p className="text-sm text-white">CREDITS: {balances.platform.CREDITS}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-400 mb-2">Wallet Balances</h3>
          <p className="text-sm text-white">USDC: ${balances.wallet.USDC}</p>
          <p className="text-sm text-white">FOLIO: {balances.wallet.FOLIO}</p>
          <p className="text-sm text-white">ETH: {balances.wallet.ETH}</p>
        </div>
      </div>

      <DashboardCards />

      <div className="max-w-6xl mx-auto mt-10 space-y-6">
        <div className="border border-zinc-700 rounded-xl p-6">
          <p className="text-left text-gray-300 text-sm mb-3">
            You can send team requests and <span className="text-green-400 font-semibold">JV with other users</span> to collaborate on deals.
          </p>
          <TeamSection walletAddress={walletAddress} reloadFlag={reloadFlag} />
        </div>

        <div className="border border-zinc-700 rounded-xl p-6">
          <div className="flex items-center justify-between text-sm mb-3">
            <p className="text-left text-gray-300">
              You’ll earn <span className="text-green-400 font-semibold">$300 for every closed deal</span> made by someone you invite.
            </p>
          </div>
          <ReferralSection walletAddress={walletAddress} />
        </div>
      </div>

      <IncomingInvites walletAddress={walletAddress} onUpdateTeam={() => setReloadFlag((n) => n + 1)} />
    </div>
  );
}