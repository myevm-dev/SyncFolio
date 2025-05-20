import { DealInput } from "../types/DealInput";

export interface CashOnCashResult {
  type: string;
  monthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCash: number;
  entry: number;
}

export default function cashOnCashCash(input: DealInput): CashOnCashResult {
  const rent = parseFloat(input.rentalValue || "0");
  const taxes = parseFloat(input.taxes || "0");
  const insurance = parseFloat(input.insurance || "0");
  const hoa = parseFloat(input.hoa || "0");

  const price = parseFloat(input.arv || "0") * 0.68;
  const rehab = parseFloat(input.rehabCost || "0");
  const totalCost = price + rehab;

  const mmr = rent * 0.8;
  const monthlyCashFlow = mmr - taxes - insurance - hoa;
  const annualCashFlow = monthlyCashFlow * 12;

  return {
    type: "Cash Offer",
    monthlyCashFlow,
    annualCashFlow,
    entry: totalCost,
    cashOnCash: totalCost > 0 ? (annualCashFlow / totalCost) * 100 : 0
  };
}
