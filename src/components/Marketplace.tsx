import React, { useState } from "react";
import { Link } from "react-router-dom";
import DealCard from "./DealCard";
import { Users } from "lucide-react";
import SubmitBuyboxModal from "./SubmitBuyboxModal"; // Make sure this is the correct path

const mockDeals = [
  {
    address: "123 Main St, El Paso, TX",
    daysLeft: 3,
    method: "Seller Finance",
    returnValue: "17.5%",
    monthlyCashflow: "$950",
    price: "$85,000",
    imageUrl: "https://via.placeholder.com/400x200",
    buyNowPrice: "$7,500",
    currentBid: "$4,000",
  },
  {
    address: "456 Oak Ave, Phoenix, AZ",
    daysLeft: 5,
    method: "Subject-To",
    returnValue: "22.1%",
    monthlyCashflow: "$1,100",
    price: "$120,000",
    imageUrl: "https://via.placeholder.com/400x200",
    buyNowPrice: "$12,000",
    currentBid: "$6,500",
  },
  {
    address: "789 Pine Dr, Atlanta, GA",
    daysLeft: 2,
    method: "Seller Finance",
    returnValue: "15.3%",
    monthlyCashflow: "$880",
    price: "$95,000",
    imageUrl: "https://via.placeholder.com/400x200",
    buyNowPrice: "$9,500",
    currentBid: "$5,000",
  },
  {
    address: "101 River Rd, Orlando, FL",
    daysLeft: 4,
    method: "Lease Option",
    returnValue: "19.8%",
    monthlyCashflow: "$1,050",
    price: "$110,000",
    imageUrl: "https://via.placeholder.com/400x200",
    buyNowPrice: "$10,500",
    currentBid: "$7,000",
  },
  {
    address: "202 Market St, Austin, TX",
    daysLeft: 6,
    method: "Subject-To",
    returnValue: "25.0%",
    monthlyCashflow: "$1,250",
    price: "$135,000",
    imageUrl: "https://via.placeholder.com/400x200",
    buyNowPrice: "$15,000",
    currentBid: "$8,000",
  },
  {
    address: "303 Ocean Blvd, San Diego, CA",
    daysLeft: 1,
    method: "Seller Finance",
    returnValue: "18.2%",
    monthlyCashflow: "$970",
    price: "$140,000",
    imageUrl: "https://via.placeholder.com/400x200",
    buyNowPrice: "$13,000",
    currentBid: "$9,000",
  },
];

const Marketplace: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4 px-4">
        <Link
          to="/buybox-directory"
          className="flex items-center gap-2 border border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-black font-semibold px-3 py-1 rounded transition"
        >
          <Users size={16} /> Total Buyers: <span className="text-white">112</span>
        </Link>

        <div className="flex gap-2">
          <button className="bg-zinc-800 text-white font-medium px-4 py-2 rounded hover:bg-[#6e5690] hover:text-black transition">
            My BuyBox
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#6e5690] text-white font-medium px-4 py-2 rounded hover:bg-accent2 hover:text-black transition"
          >
            Submit BuyBox
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {mockDeals.map((deal, idx) => (
          <DealCard key={idx} {...deal} />
        ))}
      </div>

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
