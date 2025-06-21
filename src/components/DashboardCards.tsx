import React from "react";
// src/components/DashboardCards.tsx
const DashboardCards = () => {
  const cards = [
    { label: "Earnings", value: "$0.00", icon: "💰" },
    { label: "Buying", value: "0 Properties", icon: "🏠" },
    { label: "Selling", value: "0 Properties", icon: "📄" },
  ];

  return (
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-black rounded-xl p-6 shadow-md border border-neutral-700 flex flex-col items-center text-center"
        >
          <p className="text-sm text-accent font-semibold mb-4">{card.label}</p>
          <div className="w-full flex items-center justify-between px-2">
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <div className="text-3xl">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
