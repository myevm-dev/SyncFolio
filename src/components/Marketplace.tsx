import React from "react";
import DealCard from "./DealCard";

const mockDeals = [
  {
    address: "123 Main St, El Paso, TX",
    daysLeft: 3,
    method: "Seller Finance",
    returnValue: "17.5%",
    monthlyCashflow: "$950",
    price: "$85,000",
    imageUrl: "https://via.placeholder.com/400x200",
  },
  {
    address: "456 Oak Ave, Las Cruces, NM",
    daysLeft: 5,
    method: "Cash",
    returnValue: "16.4%",
    monthlyCashflow: "$610",
    price: "$10,249",
    imageUrl: "https://via.placeholder.com/400x200",
  },
  {
    address: "123 Main St, El Paso, TX",
    daysLeft: 3,
    method: "Seller Finance",
    returnValue: "17.5%",
    monthlyCashflow: "$950",
    price: "$85,000",
    imageUrl: "https://via.placeholder.com/400x200",
  },
  {
    address: "456 Oak Ave, Las Cruces, NM",
    daysLeft: 5,
    method: "Cash",
    returnValue: "16.4%",
    monthlyCashflow: "$610",
    price: "$10,249",
    imageUrl: "https://via.placeholder.com/400x200",
  },
  {
    address: "123 Main St, El Paso, TX",
    daysLeft: 3,
    method: "Seller Finance",
    returnValue: "17.5%",
    monthlyCashflow: "$950",
    price: "$85,000",
    imageUrl: "https://via.placeholder.com/400x200",
  },
  {
    address: "456 Oak Ave, Las Cruces, NM",
    daysLeft: 5,
    method: "Cash",
    returnValue: "16.4%",
    monthlyCashflow: "$610",
    price: "$10,249",
    imageUrl: "https://via.placeholder.com/400x200",
  },

];

const Marketplace: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex justify-end mb-4 px-4">
        <button className="bg-[#6e5690] text-white font-medium px-4 py-2 rounded hover:bg-accent2 hover:text-black transition">
          Submit BuyBox
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {mockDeals.map((deal, idx) => (
          <DealCard key={idx} {...deal} />
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
