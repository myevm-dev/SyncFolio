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
// import HeatMap from "../components/HeatMap";

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

  useEffect(() => {
    const ensureUserRecord = async () => {
      if (!walletAddress) return;
      const ref = doc(db, "users", walletAddress);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          displayName: "Unnamed",
          zipcode: "",
          team: [],
          createdAt: new Date(),
        });
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

      <DashboardCards />

      <div className="mt-10">{/* <HeatMap walletAddress={walletAddress} /> */}</div>

      <div className="flex flex-col lg:flex-row justify-center items-start gap-8 max-w-6xl mx-auto mt-10">
        <div className="flex-1 border border-zinc-700 rounded-xl p-6">
          <p className="text-left text-gray-300 text-sm mb-3">
            You can send team requests and{" "}
            <span className="text-green-400 font-semibold">JV with other users</span> to collaborate on deals.
          </p>
          <TeamSection walletAddress={walletAddress} reloadFlag={reloadFlag} />
        </div>
        <div className="flex-1 border border-zinc-700 rounded-xl p-6">
          <div className="flex items-center justify-between text-sm mb-3">
            <p className="text-left text-gray-300">
              You’ll earn <span className="text-green-400 font-semibold">$300 for every closed deal</span> made by
              someone you invite.
            </p>
            <button
              onClick={() => window.print()}
              className="text-blue-400 hover:text-blue-300 underline whitespace-nowrap ml-4"
            >
              BizCards
            </button>
          </div>
          <ReferralSection walletAddress={walletAddress} />
        </div>
      </div>

      <IncomingInvites walletAddress={walletAddress} onUpdateTeam={() => setReloadFlag((n) => n + 1)} />
    </div>
  );
}
