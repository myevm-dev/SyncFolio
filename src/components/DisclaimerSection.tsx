import React from "react";

export default function DisclaimerSection() {
  return (
    <section className="mt-16 bg-[#050505] border border-neutral-700 rounded-lg p-6 text-sm text-gray-300 shadow-md">
      <h2 className="text-xl font-semibold mb-3" style={{ color: '#068989' }}>
        Disclaimer
      </h2>
      <p>
        SyncFolio.Space is a peer-to-peer marketplace. All deals listed or facilitated through the platform are direct contracts between users, investors, or licensed agents. SyncFolio does not participate in the transaction and assumes no responsibility for deal outcomes. Our mission is to simplify and standardize the process of real estate deal sourcing and submission for all parties involved.
      </p>
    </section>
  );
}
