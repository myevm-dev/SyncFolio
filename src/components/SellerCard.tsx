import React from "react";
import placeholder from "../placeholder.png";

interface SellerCardProps {
  address: string;
  daysLeft: number;
  method: string;
  returnValue: string;
  price: string;
  monthlyCashflow: string;
  buyNowPrice: string;
  currentBid: string;
}

const SellerCard: React.FC<SellerCardProps> = ({
  address,
  daysLeft,
  method,
  returnValue,
  price,
  monthlyCashflow,
  buyNowPrice,
  currentBid,
}) => {
  return (
    <div className="relative bg-[#050505] border border-neutral-700 rounded-lg shadow-md overflow-hidden flex flex-col">
      {/* Coming Soon Overlay */}
      <div className="absolute top-[17%] left-0 right-0 z-10 flex justify-center">
        <span className="bg-black/30 backdrop-blur-[1px] px-4 py-2 rounded text-black text-4xl font-bold">
          Coming Soon
        </span>
      </div>

      <img
        src={placeholder}
        alt="Property"
        className="w-full h-48 object-cover border-b border-neutral-800"
      />

      <div className="p-4 flex-grow">
        <h3 className="text-lg font-semibold mb-1">{address}</h3>
        <p className="text-sm text-gray-300">Method: {method}</p>
        <p className="text-sm text-gray-300">Inspection Days Left: {daysLeft}</p>
        <p className="text-sm text-gray-300">CoC Return: {returnValue}</p>
        <p className="text-sm text-gray-300">Monthly Cashflow: {monthlyCashflow}</p>
        <p className="text-sm text-gray-300">Entry Cost: {price}</p>
        <p className="text-sm text-accent1 mt-1 font-medium">
          Current Offer: {currentBid}
        </p>
      </div>

      <div className="px-4 pb-4 mt-auto flex flex-col gap-2">
        <button
          disabled
          className="w-full bg-[#fd01f5] text-black text-sm py-2 rounded font-semibold cursor-not-allowed"
        >
          Incentivize with Ꞙolio
        </button>
        <div className="flex gap-2">
          <button
            disabled
            className="flex-1 bg-cyan-400 text-black text-sm py-2 rounded font-semibold cursor-not-allowed"
          >
            Send to
          </button>
          <button
            disabled
            className="flex-1 bg-green-600 text-white text-sm py-2 rounded font-semibold cursor-not-allowed"
          >
            Delist
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerCard;
