// src/pages/SellingPage.tsx
import React, { useState } from "react";
import OffersReceivedTable from "../components/OffersReceivedTable";
import ClosingTable from "../components/ClosingTable";
import CompletedTable from "../components/CompletedTable";

export default function SellingPage() {
  const [activeTab, setActiveTab] = useState<"received" | "closing" | "completed">("received");

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold text-center text-cyan-400 mb-10">Selling Center</h1>

      <div className="flex justify-center mb-10 gap-4">
        <button
          className={`px-6 py-2 rounded-full transition font-medium text-sm min-w-[150px] text-center ${
            activeTab === "received"
              ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-black shadow-md"
              : "bg-transparent border border-zinc-600 text-white"
          }`}
          onClick={() => setActiveTab("received")}
        >
          Offers Received
        </button>
        <button
          className={`px-6 py-2 rounded-full transition font-medium text-sm min-w-[150px] text-center ${
            activeTab === "closing"
              ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-black shadow-md"
              : "bg-transparent border border-zinc-600 text-white"
          }`}
          onClick={() => setActiveTab("closing")}
        >
          Deals Closing
        </button>
        <button
          className={`px-6 py-2 rounded-full transition font-medium text-sm min-w-[150px] text-center ${
            activeTab === "completed"
              ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-black shadow-md"
              : "bg-transparent border border-zinc-600 text-white"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Deals Completed
        </button>
      </div>

      {activeTab === "received" && <OffersReceivedTable />}
      {activeTab === "closing" && <ClosingTable />}
      {activeTab === "completed" && <CompletedTable />}
    </div>
  );
}
