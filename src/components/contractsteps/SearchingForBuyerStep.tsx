import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useActiveAccount } from "thirdweb/react";

interface Props {
  index: number;
}

export default function SearchingForBuyerStep({ index }: Props) {
  const { id: contractId } = useParams();
  const account = useActiveAccount();
  const walletAddress = account?.address;
  const [inspectionEndsAt, setInspectionEndsAt] = useState<string | null>(null);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const fetchInspectionTime = async () => {
      if (!walletAddress || !contractId) return;
      const ref = doc(db, `users/${walletAddress}/contracts/${contractId}`);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        if (data.inspectionEndsAt) {
          setInspectionEndsAt(data.inspectionEndsAt);
        }
      }
    };
    fetchInspectionTime();
  }, [walletAddress, contractId]);

  useEffect(() => {
    if (!inspectionEndsAt) return;

    const interval = setInterval(() => {
      const end = new Date(inspectionEndsAt).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setCountdown("Inspection period ended.");
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${hours}h ${minutes}m ${seconds}s remaining`);
    }, 1000);

    return () => clearInterval(interval);
  }, [inspectionEndsAt]);

  if (index < 4) return null;

  return (
    <div className="w-[250px] md:w-[440px] bg-black border border-cyan-500 rounded-xl p-6 shadow-md flex flex-col justify-between text-center">
      <p className="text-white font-semibold text-lg mb-2">Inspection Countdown</p>
      <p className="text-cyan-400 text-sm mb-4">{countdown || "Loading..."}</p>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => console.log("Cancel Contract clicked")}
          className="flex-1 py-1 text-sm rounded-full text-white bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
        >
          Cancel Contract
        </button>
        <button
          onClick={() => console.log("Extend Inspection clicked")}
          className="flex-1 py-1 text-sm rounded-full text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        >
          Extend Inspection
        </button>
      </div>
    </div>
  );
}
