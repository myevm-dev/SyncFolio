import React, { useState } from "react";
import OffersReceivedTable from "../components/OffersReceivedTable";
import ClosingTable from "../components/ClosingTable";
import CompletedTable from "../components/CompletedTable";

export default function SellingPage() {
  const [activeTab, setActiveTab] = useState<"received" | "closing" | "completed">("received");

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold text-center text-cyan-400 mb-10">Selling Center</h1>

      <div className="flex justify-center mb-6 gap-4">
        <button
          className={`px-4 py-2 rounded-full border ${
            activeTab === "received" ? "bg-blue-600" : "bg-zinc-800"
          }`}
          onClick={() => setActiveTab("received")}
        >
          Offers Received
        </button>
        <button
          className={`px-4 py-2 rounded-full border ${
            activeTab === "closing" ? "bg-blue-600" : "bg-zinc-800"
          }`}
          onClick={() => setActiveTab("closing")}
        >
          Deals Closing
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

      {activeTab === "received" && <OffersReceivedTable />}
      {activeTab === "closing" && <ClosingTable />}
      {activeTab === "completed" && <CompletedTable />}
    </div>
  );
}
