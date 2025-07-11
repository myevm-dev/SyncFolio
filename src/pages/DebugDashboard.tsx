import { useActiveAccount } from "thirdweb/react";
import { backfillAgentZips } from "../scripts/backfillZips";

export default function DebugDashboard() {
  const account = useActiveAccount();

  const runBackfill = async () => {
    if (!account?.address) return alert("Connect wallet first");
    await backfillAgentZips(account.address.toLowerCase());
  };

  return (
    <div className="p-6">
      <button
        onClick={runBackfill}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Backfill Agent ZIPs
      </button>
    </div>
  );
}
