import React from "react";

interface Props {
  index: number;
}

export default function SellerUploadStep({ index }: Props) {
  const handleUpload = () => alert("Upload contract signed by seller");
  
  return (
    <button
      onClick={handleUpload}
      className="text-xs px-4 py-1 rounded bg-yellow-500 text-black font-semibold w-max"
    >
      Upload Signed Contract
    </button>
  );
}
