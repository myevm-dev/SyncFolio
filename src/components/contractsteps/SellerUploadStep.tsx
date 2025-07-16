import React from "react";

interface Props {
  index: number;
}

export default function SellerUploadStep({ index }: { index: number }) {
  return (
    <button
      className="px-4 py-2 rounded bg-neutral-800 border border-yellow-400 hover:bg-yellow-400 hover:text-black text-yellow-400 font-semibold w-full text-left"
    >
      Upload Signed Contract
    </button>
  );
}
