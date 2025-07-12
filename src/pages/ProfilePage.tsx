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
import Balances from "../components/Balances";
import DealflowCard from "../components/DealflowCard";


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

const adminWallets = ["0x91706ECbA7af59616D4005F37979528226532E6B"];

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
  const [editingRoles, setEditingRoles] = useState(false);
  const [balances, setBalances] = useState({
    platform: { USD: 0, FOLIO: 0, CREDITS: 0 },
    wallet: { USDC: 0, FOLIO: 0, ETH: 0 },
  });

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
        setSelectedRoles(data.roles || []);
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

  const handleSaveRoles = async () => {
    if (!walletAddress) return;
    const ref = doc(db, "users", walletAddress);
    await setDoc(ref, { roles: selectedRoles }, { merge: true });
    setEditingRoles(false);
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
      <div className="min-h-screen bg-[#0B1519] text-white text-center px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  const avatarSeed = `${liveName}-${walletAddress}`;
  const svg = window.multiavatar(avatarSeed);

  return (
    <div className="min-h-screen bg-[#0B1519] text-white text-center px-4 py-6">
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

      <p className="text-gray-400 break-all">Account: {walletAddress}</p>

      {adminWallets.includes(walletAddress) && (
        <div className="inline-block px-3 py-1 mt-2 mb-4 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500">
          Admin
        </div>
      )}

      <div className="mt-6">
        <div className="flex justify-center items-center gap-2">
          <h2 className="text-lg font-bold">Roles</h2>
          <button
            onClick={() => setEditingRoles(!editingRoles)}
            className="text-blue-400 text-sm hover:underline flex items-center"
          >
            <Pencil size={14} className="mr-1" />
            Edit Roles
          </button>
        </div>

        {editingRoles ? (
          <div className="mt-4 space-y-2 text-center">
            {Array.from({ length: Math.ceil(roleOptions.length / 5) }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex justify-center flex-wrap gap-2">
                {roleOptions
                  .slice(rowIndex * 5, rowIndex * 5 + 5)
                  .map((role) => (
                    <button
                      key={role}
                      onClick={() => toggleRole(role)}
                      className={`w-44 px-3 py-1 rounded-full text-sm text-white font-semibold transition border border-white/10 ${
                        selectedRoles.includes(role)
                          ? roleGradients[role] || "bg-zinc-600"
                          : "bg-zinc-800 hover:bg-zinc-700"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
              </div>
            ))}
            <div className="mt-4">
              <button
                onClick={handleSaveRoles}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm"
              >
                Save Roles
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {selectedRoles.map((role) => (
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
      </div>

      <DashboardCards walletAddress={walletAddress} />
      <Balances balances={balances} walletAddress={walletAddress} />
      <IncomingInvites walletAddress={walletAddress} onUpdateTeam={() => setReloadFlag((n) => n + 1)} />


      <div className="max-w-6xl mx-auto mt-10 space-y-6">
        <div className="border border-zinc-700 rounded-xl p-6">
          <p className="text-left text-gray-300 text-sm mb-3">
            You can {" "}
            <span className="text-green-400 font-semibold">connect and JV with other users</span> to collaborate on deals.
          </p>
          <TeamSection walletAddress={walletAddress} reloadFlag={reloadFlag} />
        </div>

        <div className="border border-zinc-700 rounded-xl p-6">
          <div className="flex items-center justify-between text-sm mb-3">
            <p className="text-left text-gray-300">
              You’ll earn <span className="text-green-400 font-semibold">$300 for every closed deal</span> made by
              someone you invite.
            </p>
          </div>
          <ReferralSection walletAddress={walletAddress} />
        </div>
        <div className="max-w-6xl mx-auto mt-6">
          <DealflowCard />
        </div>

      </div>

    </div>
  );
}
