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
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center z-10">
        <span className="text-white text-2xl font-bold">Coming Soon</span>
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

      <div className="px-4 pb-4 mt-auto flex justify-between gap-2">
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
  );
};

export default SellerCard;
