import React from "react";

interface Props {
  index: number;
}

export default function SellerUploadStep({ index }: Props) {
  if (index < 1) return null; // Optional: restrict button until prior step is done

  return (
    <div className="w-[320px]">
      <button
        type="button"
        onClick={() => {
          alert("Upload Signed Contract clicked");
        }}
        className="w-full px-6 py-4 rounded bg-neutral-800 border border-cyan-500 hover:bg-cyan-600 hover:text-black text-white text-center font-semibold transition"
      >
        Upload Signed Contract
      </button>
    </div>
  );
}
