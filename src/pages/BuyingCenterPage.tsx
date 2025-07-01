// src/pages/BuyingPage.tsx
import React, { useState } from "react";
import MyOffersTable from "../components/MyOffersTable";
import MyContractsTable from "../components/MyContractsTable";

export default function BuyingPage() {
  const [activeTab, setActiveTab] = useState<"offers" | "contracts">("offers");

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <div className="flex justify-center mb-6 gap-4">
        <button
          className={`px-4 py-2 rounded-full border ${
            activeTab === "offers" ? "bg-blue-600" : "bg-zinc-800"
          }`}
          onClick={() => setActiveTab("offers")}
        >
          My Offers
        </button>
        <button
          className={`px-4 py-2 rounded-full border ${
            activeTab === "contracts" ? "bg-blue-600" : "bg-zinc-800"
          }`}
          onClick={() => setActiveTab("contracts")}
        >
          My Contracts
        </button>
      </div>

      {activeTab === "offers" ? <MyOffersTable /> : <MyContractsTable />}
    </div>
  );
}