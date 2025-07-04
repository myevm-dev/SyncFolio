import React, { useState } from "react";
import MyOffersTable from "../components/MyOffersTable";
import MyContractsTable from "../components/MyContractsTable";
import CompletedTable from "../components/CompletedTable";

export default function BuyingPage() {
  const [activeTab, setActiveTab] = useState<"offers" | "contracts" | "completed">("offers");

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold text-center text-white mb-4">Buying Center</h1>

      <div className="flex justify-center mb-10">
        <p className="text-cyan-400 text-lg">Coming soon</p>
      </div>

      <div className="flex justify-center mb-6 gap-4">
        <button
          className={`px-4 py-2 rounded-full border ${
            activeTab === "offers" ? "bg-blue-600" : "bg-zinc-800"
          }`}
          onClick={() => setActiveTab("offers")}
        >
          Offers Made
        </button>
        <button
          className={`px-4 py-2 rounded-full border ${
            activeTab === "contracts" ? "bg-blue-600" : "bg-zinc-800"
          }`}
          onClick={() => setActiveTab("contracts")}
        >
          Contracts Sent
        </button>
        <button
          className={`px-4 py-2 rounded-full border ${
            activeTab === "completed" ? "bg-blue-600" : "bg-zinc-800"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Deals Completed
        </button>
      </div>

      {activeTab === "offers" && <MyOffersTable />}
      {activeTab === "contracts" && <MyContractsTable />}
      {activeTab === "completed" && <CompletedTable />}
    </div>
  );
}
