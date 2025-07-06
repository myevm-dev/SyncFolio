import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";

interface ReferralSectionProps {
  walletAddress: string;
}

const ReferralSection: React.FC<ReferralSectionProps> = ({ walletAddress }) => {
  const [referralLink, setReferralLink] = useState("");
  const [referrals, setReferrals] = useState<any[]>([]);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const fetchDisplayName = async () => {
      if (!walletAddress) return;
      const userRef = doc(db, "users", walletAddress);
      const snap = await getDoc(userRef);
      const name = snap.exists() ? snap.data().displayName : "";
      setDisplayName(name);
      setReferralLink(`${window.location.origin}/?ref=${name}`);
    };

    const fetchReferrals = async () => {
      if (!displayName) return;
      const snapshot = await getDocs(collection(db, "users"));
      const filtered = snapshot.docs
        .filter((docSnap) => docSnap.data().referredBy === displayName)
        .map((docSnap) => ({ ...docSnap.data(), id: docSnap.id }));
      setReferrals(filtered);
    };

    fetchDisplayName();
    // Delay fetchReferrals until name is known
    setTimeout(fetchReferrals, 300);
  }, [walletAddress, displayName]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      alert("Referral link copied!");
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  return (
    <div className="text-left flex flex-col justify-between h-full">
      <div className="mt-4">
        <h2 className="text-xl mt-4 font-bold text-white mb-2">Referral</h2>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          readOnly
          value={referralLink}
          className="bg-zinc-800 px-3 py-1 rounded text-sm w-full text-gray-300"
        />
        <button
          onClick={copyToClipboard}
          className="border border-white px-4 py-1 rounded text-sm hover:bg-accent hover:text-black"
        >
          Copy
        </button>
      </div>

      {referrals.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {referrals.map((ref) => {
            const svg = window.multiavatar(`${ref.displayName}-${ref.id}`);
            return (
              <div key={ref.id} className="text-center">
                <div
                  className="w-16 h-16 mx-auto"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
                <p className="text-sm text-white truncate">{ref.displayName}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReferralSection;
