import { DealInput } from "../types/DealInput";
import { CashOnCashResult } from "../types/CashOnCashResult";

export default function cashOnCashTakeover(_: DealInput): CashOnCashResult {
  return {
    type: "Mortgage Takeover",
    monthlyCashFlow: 0,
    annualCashFlow: 0,
    entry: 0,
    cashOnCash: 0,
    pass: false,
  };
}
