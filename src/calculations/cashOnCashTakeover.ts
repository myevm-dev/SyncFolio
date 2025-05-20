import { DealInput } from "../types/DealInput";

export interface CashOnCashResult {
  type: string;
  monthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCash: number;
  entry: number;
}

export default function cashOnCashTakeover(_: DealInput): CashOnCashResult {
  return {
    type: "Mortgage Takeover",
    monthlyCashFlow: 0,
    annualCashFlow: 0,
    cashOnCash: 0,
    entry: 0
  };
}
