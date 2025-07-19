import React, { forwardRef } from "react";
import SyncDispoJVContractPdf from "./SyncDispoJVContractPdf";

const SyncDispoAgreement = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <>
      <p className="text-sm text-center mb-6 space-y-2">
        If Syncfolio handles the dispo end-to-end, you will receive{" "}
        <span className="font-semibold text-cyan-400">50%</span> of the assignment fee.
        <br /><br />
        The fee is split as follows:
        <br />
        <span className="text-cyan-400 font-semibold">• 50% to you</span> (deal creator)
        <br />
        <span className="text-yellow-400 font-semibold">• 50% to platform</span> (full service dispo, buyer onboarding, contract)
        <br /><br />
        Syncfolio acts as your partner to ensure maximum exposure and smooth closing.
      </p>

      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <SyncDispoJVContractPdf ref={ref} />
      </div>
    </>
  );
});

export default SyncDispoAgreement;
