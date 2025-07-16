import React, { useState } from "react";
import MyOffersTable from "../components/MyOffersTable";
import MyContractsTable from "../components/MyContractsTable";
import CompletedTable from "../components/CompletedTable";

export default function BuyingPage() {
  const [activeTab, setActiveTab] = useState<"offers" | "contracts" | "completed">("offers");

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold text-center text-white mb-10">My Buying Center</h1>

      <div className="flex flex-wrap md:flex-nowrap justify-center mb-10 gap-3">
        <button
          className={`px-6 py-2 rounded-full transition font-medium text-sm min-w-[120px] text-center ${
            activeTab === "offers"
              ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-black shadow-md"
              : "bg-transparent border border-zinc-600 text-white"
          }`}
          onClick={() => setActiveTab("offers")}
        >
          Offers Out
        </button>
        <button
          className={`px-6 py-2 rounded-full transition font-medium text-sm min-w-[120px] text-center ${
            activeTab === "contracts"
              ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-black shadow-md"
              : "bg-transparent border border-zinc-600 text-white"
          }`}
          onClick={() => setActiveTab("contracts")}
        >
          Contracts
        </button>
        <button
          className={`px-6 py-2 rounded-full transition font-medium text-sm min-w-[120px] text-center ${
            activeTab === "completed"
              ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-black shadow-md"
              : "bg-transparent border border-zinc-600 text-white"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Completed
        </button>
      </div>

      {activeTab === "offers" && <MyOffersTable />}
      {activeTab === "contracts" && <MyContractsTable />}
      {activeTab === "completed" && <CompletedTable />}
    </div>
  );
}
