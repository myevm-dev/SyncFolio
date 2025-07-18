// /components/agreements/SyncDispoAgreement.tsx
import React from "react";

const SyncDispoAgreement = () => {
  return (
    <p className="text-sm text-center mb-6 space-y-2">
      <>
        If this deal closes, you will receive{" "}
        <span className="font-semibold text-cyan-400">40%</span> of the total assignment fee, or a minimum of{" "}
        <span className="font-semibold text-cyan-400">$2250</span> +{" "}
        <span className="font-semibold" style={{ color: "#ff00ff" }}>
          Bonus 50k Ꞙolio Token
        </span>
        , whichever is <span className="font-bold text-cyan-400">MORE</span>.
        <br /><br />
        The assignment fee is split as follows:
        <br />
        <span className="text-cyan-400 font-semibold">• 40% to you</span> (sourcing the deal)
        <br />
        <span className="text-pink-400 font-semibold">• 40% to Syncfolio Dispo</span> (dispo/funding partner)
        <br />
        <span className="text-yellow-400 font-semibold">• 20% to platform</span> (compliance, infra, admin)
      </>
    </p>
  );
};

export default SyncDispoAgreement;