import { DealInput } from "../types/DealInput";
import { CashOnCashResult } from "../types/CashOnCashResult";

export default function cashOnCashSeller(input: DealInput): CashOnCashResult {
  const rent = parseFloat(input.rentalValue || "0");
  const taxes = parseFloat(input.taxes || "0");
  const insurance = parseFloat(input.insurance || "0");
  const hoa = parseFloat(input.hoa || "0");

  const arv = parseFloat(input.arv || "0");
  const rehab = parseFloat(input.rehabCost || "0");

  const offerPrice = arv * 1.08 - rehab;
  const downPayment = offerPrice * 0.10;
  const sellerPayment = rent * 0.40;

  const mmr = rent * 0.8;
  const monthlyCashFlow = mmr - taxes - insurance - hoa - sellerPayment;
  const annualCashFlow = monthlyCashFlow * 12;
  const totalEntry = downPayment + rehab;
  const cashOnCash = totalEntry > 0 ? (annualCashFlow / totalEntry) * 100 : 0;

  return {
    type: "Seller Finance",
    monthlyCashFlow,
    annualCashFlow,
    entry: totalEntry,
    cashOnCash,
    pass: cashOnCash >= 15,
    monthlyPayment: sellerPayment,
  };
}
