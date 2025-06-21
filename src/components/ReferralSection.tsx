import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface ReferralSectionProps {
  walletAddress: string;
}

const ReferralSection: React.FC<ReferralSectionProps> = ({ walletAddress }) => {
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    if (!walletAddress) return;
    const refCode = walletAddress.slice(2, 10);
    setReferralLink(`${window.location.origin}/?ref=${refCode}`);
  }, [walletAddress]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      alert("Referral link copied!");
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  return (
    <div className="mt-10 text-left max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-white mb-2">Referral</h2>
      <div className="flex items-center gap-2">
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
    </div>
  );
};

export default ReferralSection;



