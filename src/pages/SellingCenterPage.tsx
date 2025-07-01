// src/pages/SellingPage.tsx
import React, { useState } from "react";
import ClosingTable from "../components/ClosingTable";
import CompletedTable from "../components/CompletedTable";

export default function SellingPage() {
  const [activeTab, setActiveTab] = useState<"closing" | "completed">("closing");

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <div className="flex justify-center mb-10">
        <p className="text-cyan-400 text-lg">Coming soon</p>
      </div>

      <div className="flex justify-center mb-6 gap-4">
        <button
          className={`px-4 py-2 rounded-full border ${
            activeTab === "closing" ? "bg-blue-600" : "bg-zinc-800"
          }`}
          onClick={() => setActiveTab("closing")}
        >
          Closing
        </button>
        <button
          className={`px-4 py-2 rounded-full border ${
            activeTab === "completed" ? "bg-blue-600" : "bg-zinc-800"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Completed
        </button>
      </div>

      {activeTab === "closing" ? <ClosingTable /> : <CompletedTable />}
    </div>
  );
}
