import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface Props {
  onContinue: () => void;
  totalUSD?: number;
}

const WelcomeReferralPage: React.FC<Props> = ({ onContinue, totalUSD }) => {
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");

    const fetchReferrerName = async () => {
      if (!ref) return setLoading(false);
      const snapshot = await getDocs(collection(db, "users"));
      const matched = snapshot.docs.find(
        (doc) =>
          doc.data().displayName?.toLowerCase() === ref.toLowerCase()
      );
      setReferrerName(matched?.data().displayName || "a Syncfolio user");
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
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-16 text-white">
      <div className="max-w-2xl w-full text-center space-y-10">
        <div>
          <h1 className="text-5xl font-extrabold mb-4">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              SyncFolio.Space
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            You’ve been invited by<br />
            <span className="text-accent font-bold text-3xl">
              {referrerName}
            </span>{" "}
            <br />
            to join a smarter way to grow your real estate career.
          </p>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 backdrop-blur-md rounded-2xl p-6 text-left">
          <h2 className="text-2xl font-semibold mb-5 text-accent">
            Get Started in 3 Steps
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-base text-gray-100">
            <li>
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
                Sign in
              </span>{" "}
              to access your private dashboard
            </li>
            <li>
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
                Set your Name, ZIP code, and Role
              </span>{" "}
              so we can personalize your experience
            </li>
            <li>
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
                Start earning
              </span>{" "}
              through exclusive tools and referrals
              {totalUSD !== undefined && (
                <div className="mt-2 text-green-400 text-xl mb-2 font-bold">
                  Earn a minimum of ${totalUSD.toLocaleString()} per closed deal!
                </div>
              )}
            </li>
          </ol>

        </div>

        <button
          onClick={handleContinue}
          className="bg-gradient-to-r from-purple-400 to-cyan-400 text-black hover:text-white font-medium px-8 py-3 rounded-lg shadow-md transition"
        >
          Continue to Dashboard
        </button>

        <p className="text-sm text-gray-500 mt-4">
          Powered by SyncFolio. Your network, your advantage.
        </p>
      </div>
    </div>
  );
};

export default WelcomeReferralPage;
