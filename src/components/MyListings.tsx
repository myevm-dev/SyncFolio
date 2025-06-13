import React, { useState } from "react";
import { Link } from "react-router-dom";
import SellerCard from "./SellerCard";
import { Users } from "lucide-react";
import CreateListingModal from "./CreateListingModal";

const mockListings = [
  {
    address: "101 Oak Dr, Dallas, TX",
    daysLeft: 5,
    method: "Seller Finance",
    returnValue: "31.2%",
    monthlyCashflow: "$890",
    price: "$6,500",
    imageUrl: "https://via.placeholder.com/400x200",
    buyNowPrice: "$11,000",
    currentBid: "$3,800",
  },
  {
    address: "222 Maple St, Tampa, FL",
    daysLeft: 3,
    method: "Mortgage Takeover",
    returnValue: "19.9%",
    monthlyCashflow: "$1,200",
    price: "$0",
    imageUrl: "https://via.placeholder.com/400x200",
    buyNowPrice: "$9,800",
    currentBid: "$4,000",
  },
  {
    address: "789 Sunset Blvd, Los Angeles, CA",
    daysLeft: 7,
    method: "Morby Method",
    returnValue: "24.1%",
    monthlyCashflow: "$1,050",
    price: "$5,000",
    imageUrl: "https://via.placeholder.com/400x200",
    buyNowPrice: "$10,200",
    currentBid: "$6,100",
  },
];

const MyListings: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 mb-4 px-4">
        <Link
          to="/buybox-directory"
          className="flex flex-col items-center justify-center text-cyan-300 border border-cyan-400 hover:bg-cyan-400 hover:text-black font-semibold px-3 py-2 rounded transition w-full sm:w-auto"
        >
          <div className="flex items-center gap-1 text-xs sm:text-sm">
            <Users size={16} />
            <span>Active Buyers</span>
          </div>
          <div className="text-white text-base font-bold leading-none">112</div>
        </Link>

        <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
          <button className="bg-zinc-800 text-white font-medium px-4 py-2 rounded w-full sm:w-auto hover:bg-[#6e5690] hover:text-black transition">
            My Listings
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#6e5690] text-white font-medium px-4 py-2 rounded w-full sm:w-auto hover:bg-accent2 hover:text-black transition"
          >
            Create Listing
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {mockListings.map((listing, idx) => (
          <SellerCard key={idx} {...listing} />
        ))}
      </div>

      {showModal && (
        <CreateListingModal
          onClose={() => setShowModal(false)}
          onSubmit={(data) => {
            console.log("Listing submitted:", data);
          }}
        />
      )}
    </div>
  );
};

export default MyListings;
