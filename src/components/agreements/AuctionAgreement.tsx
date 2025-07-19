import React, { forwardRef } from "react";
import AuctionJVContractPdf from "./AuctionJVContractPdf";

const AuctionJVAgreement = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <>
      <p className="text-sm text-center mb-6 space-y-2">
        If your deal is sold through the auction marketplace, you will receive{" "}
        <span className="font-semibold text-cyan-400">70%</span> of the assignment fee.
        <br /><br />
        The fee is split as follows:
        <br />
        <span className="text-cyan-400 font-semibold">• 70% to you</span> (deal creator)
        <br />
        <span className="text-yellow-400 font-semibold">• 30% to platform</span> (auction, compliance, closing)
        <br /><br />
        Syncfolio facilitates the auction, contract review, and buyer onboarding.
        The highest bidder within the set timeline wins the deal.
      </p>

      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <AuctionJVContractPdf ref={ref} />
      </div>
    </>
  );
});

export default AuctionJVAgreement;
