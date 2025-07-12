// src/components/DealflowTable.tsx
import React from "react";

interface DealflowTableProps {
  fipsCode: string;
}

const DealflowTable: React.FC<DealflowTableProps> = ({ fipsCode }) => {
  return (
    <div className="bg-black border border-neutral-700 rounded-xl p-6 text-white shadow-lg w-full max-w-2xl mx-auto mt-6 text-center">
      <p className="text-sm">
        Dealflow table coming soon for FIPS {fipsCode}...
      </p>
    </div>
  );
};

export default DealflowTable;
