import React, { useState } from "react";
import DealCard from "./DealCard";


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
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mockDeals.map((deal, idx) => (
          <DealCard key={idx} {...deal} />
        ))}
      </div>

      
    </div>
  );
};

export default Marketplace;
