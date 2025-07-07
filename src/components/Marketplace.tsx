import React, { useState } from "react";
import { Link } from "react-router-dom";
import DealCard from "./DealCard";
import { Users } from "lucide-react";
import SubmitBuyboxModal from "./SubmitBuyboxModal";
import AnimatedButton from "./AnimatedButton";

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
    buyNowPrice: "$9,500",
    currentBid: "$5,000",
    bonus: "100k Ꞙolio Tokens",
  },
  {
    address: "101 River Rd, Orlando, FL",
    daysLeft: 4,
    method: "Morby Method",
    returnValue: "19.8%",
    monthlyCashflow: "$1,050",
    price: "$13,200",
    imageUrl: "https://via.placeholder.com/400x200",
    buyNowPrice: "$10,500",
    currentBid: "$7,000",
    bonus: "100k Ꞙolio Tokens",
  },
  {
    address: "202 Market St, Austin, TX",
    daysLeft: 6,
    method: "Takeover",
    returnValue: "25.0%",
    monthlyCashflow: "$1,250",
    price: "$17,110",
    imageUrl: "https://via.placeholder.com/400x200",
    buyNowPrice: "$12,000",
    currentBid: "$3,000",
    bonus: "100k Ꞙolio Tokens",
  },
  {
    address: "303 Ocean Blvd, San Diego, CA",
    daysLeft: 1,
    method: "Seller Finance",
    returnValue: "28.2%",
    monthlyCashflow: "$970",
    price: "$34,000",
    imageUrl: "https://via.placeholder.com/400x200",
    buyNowPrice: "$13,000",
    currentBid: "$9,000",
    bonus: "100k Ꞙolio Tokens",
  },
];

const Marketplace: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 mb-4 px-4">
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
            <div className="text-white text-base font-bold leading-none text-center">2112</div>
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
          <button className="bg-zinc-800 text-white font-medium px-4 py-2 rounded w-full sm:w-auto hover:bg-[#6e5690] hover:text-black transition min-h-[44px]">
            My BuyBox
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-purple-400 to-cyan-400 text-black hover:text-white font-medium px-4 py-2 rounded w-full sm:w-auto transition min-h-[44px] shadow-md"
          >
            Submit BuyBox
          </button>


        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {mockDeals.map((deal, idx) => (
          <DealCard key={idx} {...deal} />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <SubmitBuyboxModal
          onClose={() => setShowModal(false)}
          onSubmit={(data) => {
            console.log("BuyBox submitted:", data);
          }}
        />
      )}
    </div>
  );
};

export default Marketplace;
