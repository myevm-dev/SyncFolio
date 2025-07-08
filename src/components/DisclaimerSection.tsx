import React from "react";

export default function DisclaimerSection() {
  return (
    <section className="mt-16 bg-[#050505] border border-neutral-700 rounded-lg p-6 text-sm text-gray-300 shadow-md">
      <h2 className="text-xl font-semibold mb-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
        Disclaimer
      </h2>

      <p>
        SyncFolio.Space is a peer-to-peer marketplace for real estate opportunities. All deals listed or routed through the platform are submitted by users and matched to other users based on their submitted buyboxes. SyncFolio does not broker, represent, or assign contracts. Instead, it facilitates introductions between principals or licensed parties. This routing approach helps ensure compliance with local laws while providing a standardized and transparent system for deal sourcing and review.
      </p>
    </section>
  );
}
