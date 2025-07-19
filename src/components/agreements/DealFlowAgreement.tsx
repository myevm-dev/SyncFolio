import React, { forwardRef } from "react";
import DealFlowJVContractPdf from "./DealFlowJVContractPdf";

const DealFlowAgreement = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <>
      <p className="text-sm text-center mb-6 space-y-2">
        If your deal is sold through direct deal flow, you will receive{" "}
        <span className="font-semibold text-cyan-400">60%</span> of the assignment fee.
        <br /><br />
        The fee is split as follows:
        <br />
        <span className="text-cyan-400 font-semibold">• 60% to you</span> (deal creator)
        <br />
        <span className="text-yellow-400 font-semibold">• 40% to platform</span> (dispo, compliance, closing)
        <br /><br />
        Syncfolio sources a qualified buyer and assists with the full transaction lifecycle.
      </p>

      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <DealFlowJVContractPdf ref={ref} />
      </div>
    </>
  );
});

export default DealFlowAgreement;
