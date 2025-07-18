// /components/agreements/DealFlowAgreement.tsx
import React from "react";

const DealFlowAgreement = () => {
  return (
    <p className="text-sm text-center mb-6 space-y-2">
      <>
        When you list through our internal deal flow network, you retain{" "}
        <span className="font-semibold text-cyan-400">80%</span> of the assignment fee.
        <br /><br />
        The flat finder’s fee is split as follows:
        <br />
        <span className="text-cyan-400 font-semibold">• 80% to you</span> (deal owner)
        <br />
        <span className="text-yellow-400 font-semibold">• 20% to platform</span> (distribution + compliance)
        <br /><br />
        Syncfolio will broadcast your deal to pre-vetted buyers. You manage negotiations, we manage paperwork.
      </>
    </p>
  );
};

export default DealFlowAgreement;