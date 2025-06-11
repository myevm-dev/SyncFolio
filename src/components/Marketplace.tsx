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
    buyNowPrice: "$7,500",
    currentBid: "$4,000",
  },
  {
    address: "456 Oak Ave, Las Cruces, NM",
    daysLeft: 5,
    method: "Cash",
    returnValue: "16.4%",
    monthlyCashflow: "$610",
    price: "$10,249",
    imageUrl: "https://via.placeholder.com/400x200",
    buyNowPrice: "$6,000",
    currentBid: "$3,800",
  },
  {
    address: "789 Desert Rd, Phoenix, AZ",
    daysLeft: 2,
    method: "Seller Finance",
    returnValue: "34.2%",
    monthlyCashflow: "$1,125",
    price: "$24,500",
    imageUrl: "https://via.placeholder.com/400x200",
    buyNowPrice: "$9,200",
    currentBid: "$6,250",
  },
  {
    address: "321 Cactus St, Tucson, AZ",
    daysLeft: 4,
    method: "Cash",
    returnValue: "14.7%",
    monthlyCashflow: "$710",
    price: "$18,000",
    imageUrl: "https://via.placeholder.com/400x200",
    buyNowPrice: "$5,700",
    currentBid: "$3,900",
  },
  {
    address: "789 Desert Rd, Phoenix, AZ",
    daysLeft: 2,
    method: "Seller Finance",
    returnValue: "34.2%",
    monthlyCashflow: "$1,125",
    price: "$24,500",
    imageUrl: "https://via.placeholder.com/400x200",
    buyNowPrice: "$9,200",
    currentBid: "$6,250",
  },
  {
    address: "321 Cactus St, Tucson, AZ",
    daysLeft: 4,
    method: "Cash",
    returnValue: "14.7%",
    monthlyCashflow: "$710",
    price: "$18,000",
    imageUrl: "https://via.placeholder.com/400x200",
    buyNowPrice: "$5,700",
    currentBid: "$3,900",
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
