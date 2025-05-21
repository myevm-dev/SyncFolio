import { DealInput } from "../types/DealInput";

export default function cashOnCashCash(input: DealInput) {
  const arv = parseFloat(input.arv || "0");
  const rehab = parseFloat(input.rehabCost || "0");
  const rent = parseFloat(input.rentalValue || "0");
  const taxes = parseFloat(input.taxes || "0");
  const insurance = parseFloat(input.insurance || "0");
  const hoa = parseFloat(input.hoa || "0");

  // 68% of ARV minus rehab
  const offerPrice = (arv * 0.68) - rehab;
  const down = offerPrice * 0.2; // 20% down payment
  const financed = offerPrice * 0.8;

  // Est. loan payment: assume 7% interest, 30 years amortized
  const rate = 0.07 / 12;
  const months = 30 * 12;
  const loanPayment = (financed * rate) / (1 - Math.pow(1 + rate, -months));

  const mmr = rent * 0.8;
  const monthlyCashFlow = mmr - taxes - insurance - hoa - loanPayment;
  const annualCashFlow = monthlyCashFlow * 12;
  const cashOnCash = down > 0 ? (annualCashFlow / down) * 100 : 0;

  return {
    type: "cash",
    monthlyCashFlow: monthlyCashFlow.toFixed(2),
    annualCashFlow: annualCashFlow.toFixed(2),
    entry: down.toFixed(2),
    cashOnCash: cashOnCash.toFixed(2),
    pass: cashOnCash >= 20
  };
}
