import { DealInput } from "../types/DealInput";

export interface CashOnCashResult {
  monthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCash: number;
  entry: number;
}

export default function calcCashOnCash(input: DealInput): CashOnCashResult {
  const rent = parseFloat(input.rentalValue || "0");
  const taxes = parseFloat(input.taxes || "0");
  const insurance = parseFloat(input.insurance || "0");
  const hoa = parseFloat(input.hoa || "0");
  const principal = parseFloat(input.loanPayment || "0");
  const purchasePrice = parseFloat(input.listingPrice || "0") * 1.1;
  const downPayment = purchasePrice * 0.1;

  const mmr = rent * 0.8;
  const monthlyCashFlow = mmr - taxes - insurance - hoa - principal;
  const annualCashFlow = monthlyCashFlow * 12;
  const cashOnCash = downPayment > 0 ? (annualCashFlow / downPayment) * 100 : 0;

  return {
    monthlyCashFlow,
    annualCashFlow,
    cashOnCash,
    entry: downPayment
  };
}
