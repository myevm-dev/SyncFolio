import React, { useState } from "react";
import { Link } from "react-router-dom";
import DealCard from "./DealCard";
import { Users } from "lucide-react";
import SubmitBuyboxModal from "./SubmitBuyboxFlow";
import AnimatedButton from "./AnimatedButton";
import MyBuyboxModal from "./MyBuyboxModal";

const mockDeals = [
  {
    address: "123 Main St, El Paso, TX",
    daysLeft: 3,
    method: "Seller Finance",
    returnValue: "57.5%",
    monthlyCashflow: "$950",
    price: "$0",
    imageUrl: "https://via.placeholder.com/400x200",
    buyNowPrice: "$11,500",
    currentBid: "$4,000",
    bonus: "100k Ꞙolio Tokens",
  },
  {
    address: "456 Oak Ave, Phoenix, AZ",
    daysLeft: 5,
    method: "Mortgage Takeover",
    returnValue: "22.1%",
    monthlyCashflow: "$1,100",
    price: "$7,344",
    imageUrl: "https://via.placeholder.com/400x200",
    buyNowPrice: "$7,000",
    currentBid: "$3,500",
    bonus: "100k Ꞙolio Tokens",
  },
  {
    address: "789 Pine Dr, Atlanta, GA",
    daysLeft: 2,
    method: "Seller Finance",
    returnValue: "35.3%",
    monthlyCashflow: "$480",
    price: "$9,130",
    imageUrl: "https://via.placeholder.com/400x200",
    buyNowPrice: "$9,000",
    currentBid: "$5,000",
    bonus: "100k Ꞙolio Tokens",
  },
];

const Marketplace: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showMyBox, setShowMyBox] = useState(false);

  return (
    <div className="w-full px-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 mb-6">
        {/* Left: Total Buyers + Deploy */}
        <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-start items-center">
          <Link
            to="/buybox-directory"
            className="flex flex-col justify-center text-cyan-300 border border-cyan-400 hover:bg-cyan-400 hover:text-black font-semibold px-4 py-2 rounded w-full sm:w-auto min-h-[44px]"
          >
            <div className="flex items-center gap-1 text-xs sm:text-sm justify-center">
              <Users size={16} />
              <span>Total Buyers</span>
            </div>
            <div className="text-white text-base font-bold leading-none text-center">
              2112
            </div>
          </Link>

          <AnimatedButton
            onClick={() => alert("Coming Soon")}
            className="w-full sm:w-auto min-h-[44px] px-4 py-2 flex items-center justify-center"
          >
            DeployAnalyzer
          </AnimatedButton>
        </div>

        {/* Right: BuyBox Buttons */}
        <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
          <button
            onClick={() => setShowMyBox(true)}
            className="bg-zinc-800 text-white font-medium px-4 py-2 rounded w-full sm:w-auto hover:bg-[#6e5690] hover:text-black transition min-h-[44px]"
          >
            My BuyBox
          </button>

          <Link
            to="/dealflow"
            className="bg-gradient-to-r from-purple-400 to-cyan-400 text-black hover:text-white font-medium px-4 py-2 rounded w-full sm:w-auto transition min-h-[44px] shadow-md text-center flex items-center justify-center"
          >
            DealFlow
          </Link>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mockDeals.map((deal, idx) => (
          <DealCard key={idx} {...deal} />
        ))}
      </div>

      {/* Modals */}
      {showModal && (
        <SubmitBuyboxModal onComplete={() => setShowModal(false)} />
      )}
      {showMyBox && <MyBuyboxModal onClose={() => setShowMyBox(false)} />}
    </div>
  );
};

export default Marketplace;
