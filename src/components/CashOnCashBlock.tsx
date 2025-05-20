import { CashOnCashResult } from "../calculations/cashOnCashCash";

export default function CashOnCashBlock({ result }: { result: CashOnCashResult }) {
  const { type, monthlyCashFlow, annualCashFlow, cashOnCash, entry } = result;

  return (
    <div className="border rounded-2xl bg-zinc-900 text-white p-4 shadow-md text-sm space-y-1">
      <h3 className="text-lg font-bold mb-1">{type} Cash-on-Cash</h3>
      <p><strong>Monthly Cash Flow:</strong> ${monthlyCashFlow.toFixed(2)}</p>
      <p><strong>Annual Cash Flow:</strong> ${annualCashFlow.toFixed(2)}</p>
      <p><strong>Entry / Down Payment:</strong> ${entry.toFixed(2)}</p>
      <p>
        <strong>Return:</strong>
        <span className={cashOnCash >= 20 ? "text-green-400 ml-2" : "text-red-400 ml-2"}>
          {cashOnCash.toFixed(2)}%
        </span>
      </p>
      <p className={cashOnCash >= 20 ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
        {cashOnCash >= 20 ? "Deal ✅" : "No Deal ❌"}
      </p>
    </div>
  );
}
