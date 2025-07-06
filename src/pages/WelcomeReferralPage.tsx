import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface Props {
  onContinue: () => void;
}

const WelcomeReferralPage: React.FC<Props> = ({ onContinue }) => {
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");

    const fetchReferrerName = async () => {
      if (!ref) {
        setLoading(false);
        return;
      }

      const snapshot = await getDocs(collection(db, "users"));
      const matched = snapshot.docs.find(
        (doc) =>
          doc.data().displayName?.toLowerCase() === ref.toLowerCase()
      );

      if (matched) {
        setReferrerName(matched.data().displayName || "a Syncfolio user");
      } else {
        setReferrerName("a Syncfolio user");
      }

      setLoading(false);
    };

    fetchReferrerName();
  }, []);

  const handleContinue = () => {
    onContinue();
    navigate("/profile");
  };

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-black text-white px-4">
      <h1 className="text-3xl font-bold mb-6">
        You were invited by <span className="text-accent">{referrerName}</span>!
      </h1>

      <p className="text-lg mb-6">Follow the steps below to get started:</p>

      <ol className="text-left text-white text-md mb-8 space-y-2 list-decimal list-inside">
        <li><span className="text-accent font-medium">Sign in</span> to your dashboard </li>
        <li><span className="text-accent font-medium">Set name & zipcode</span></li>
        <li><span className="text-accent font-medium">Start earning now</span></li>
      </ol>

      <button
        onClick={handleContinue}
        className="bg-white text-black px-6 py-2 rounded hover:bg-accent"
      >
        Continue to Dashboard
      </button>
    </div>
  );
};

export default WelcomeReferralPage;
