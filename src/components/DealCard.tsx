import React from "react";
import placeholder from "../placeholder.png";

interface DealCardProps {
  address: string;
  daysLeft: number;
  method: string;
  returnValue: string;
  price: string;
  monthlyCashflow: string;
  buyNowPrice: string;
  currentBid: string;
}

const DealCard: React.FC<DealCardProps> = ({
  address,
  daysLeft,
  method,
  returnValue,
  price,
  monthlyCashflow,
  buyNowPrice,
  currentBid,
}) => {
  const isCash = method.toLowerCase() === "cash";

  return (
    <div className="relative bg-[#050505] border border-neutral-700 rounded-lg shadow-md overflow-hidden flex flex-col">
      {/* Coming Soon Overlay */}
      <div className="absolute top-[25%] left-0 right-0 z-10 flex justify-center">
        <span className="bg-black/30 backdrop-blur-[1px] px-4 py-2 rounded text-black text-2xl font-bold">
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
        <p className="text-sm text-gray-300">
          {isCash ? "Cap Rate" : "CoC Return"}: {returnValue}
        </p>
        <p className="text-sm text-gray-300">Monthly Cashflow: {monthlyCashflow}</p>
        <p className="text-sm text-gray-300">Entry Cost: {price}</p>
        <p className="text-sm text-accent1 mt-1 font-medium">
          Current Finder's Fee Bid: {currentBid}
        </p>
      </div>

      <div className="px-4 pb-4 mt-auto flex justify-between gap-2">
        <button className="flex-1 border border-[#fd01f5] text-[#fd01f5] hover:bg-[#fd01f5] hover:text-black text-sm py-2 rounded transition">
          Bid
        </button>
        <button className="flex-1 bg-[#01fcfc] text-black text-sm py-2 rounded hover:bg-[#00e0e0] transition">
          Buy Now for {buyNowPrice}
        </button>
      </div>
    </div>
  );
};

export default DealCard;
