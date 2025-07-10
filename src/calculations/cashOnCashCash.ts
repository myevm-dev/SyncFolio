import { DealInput } from "../types/DealInput";
import { CashOnCashResult } from "../types/CashOnCashResult";

export default function cashOnCashCash(input: DealInput): CashOnCashResult {
  const arv = parseFloat(input.arv || "0");
  const rehab = parseFloat(input.rehabCost || "0");
  const rent = parseFloat(input.rentalValue || "0");
  const taxes = parseFloat(input.taxes || "0");
  const insurance = parseFloat(input.insurance || "0");
  const hoa = parseFloat(input.hoa || "0");

  const offerPrice = (arv * 0.73) - rehab;
  const down = offerPrice * 0.2;
  const financed = offerPrice * 0.8;

  const rate = 0.07 / 12;
  const months = 30 * 12;
  const loanPayment = (financed * rate) / (1 - Math.pow(1 + rate, -months));

  const monthlyPayment = loanPayment + taxes + insurance + hoa;

  const mmr = rent * 0.8;
  const monthlyCashFlow = mmr - monthlyPayment;
  const annualCashFlow = monthlyCashFlow * 12;
  const totalEntry = down + rehab;
  const cashOnCash = totalEntry > 0 ? (annualCashFlow / totalEntry) * 100 : 0;

  return {
    type: "Cash via DSCR",
    monthlyCashFlow,
    annualCashFlow,
    entry: totalEntry,
    cashOnCash,
    pass: cashOnCash >= 15,
    monthlyPayment
  };
}
