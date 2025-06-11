import React from "react";
import placeholder from "../placeholder.jpg"; // adjust path if needed

interface DealCardProps {
  address: string;
  daysLeft: number;
  method: string;
  returnValue: string;
  price: string;
  monthlyCashflow: string;
}

const DealCard: React.FC<DealCardProps> = ({
  address,
  daysLeft,
  method,
  returnValue,
  price,
  monthlyCashflow,
}) => {
  const isCash = method.toLowerCase() === "cash";

  return (
    <div className="bg-[#050505] border border-neutral-700 rounded-lg shadow-md hover:bg-[#6e5690] hover:text-black hover:border-[#6e5690] transition overflow-hidden">
      <img
        src={placeholder}
        alt="Property"
        className="w-full h-48 object-cover border-b border-neutral-800"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{address}</h3>
        <p className="text-sm text-gray-300">Method: {method}</p>
        <p className="text-sm text-gray-300">Days Left: {daysLeft}</p>
        <p className="text-sm text-gray-300">
          {isCash ? "Cap Rate" : "CoC Return"}: {returnValue}
        </p>
        <p className="text-sm text-gray-300">Monthly Cashflow: {monthlyCashflow}</p>
        <p className="text-sm text-gray-300">Entry: {price}</p>
      </div>
    </div>
  );
};

export default DealCard;

