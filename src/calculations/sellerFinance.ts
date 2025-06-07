import { DealInput } from "../types/DealInput";

export default function sellerFinance(input: DealInput): string {
  const listingPrice = parseFloat(input.listingPrice || "0");
  const rehab = parseFloat(input.rehabCost || "0");
  const rent = parseFloat(input.rentalValue || "0");

  if (listingPrice <= 0 || rent <= 0) return "Invalid input";

  const offerPrice = listingPrice * 1.10; // ✅ 10% above listing
  const downPayment = offerPrice * 0.10;
  const monthlyPayment = rent * 0.40;
  const balloon = offerPrice - downPayment - (monthlyPayment * 72);

  return [
    `Total Offer: $${offerPrice.toFixed(2)}`,
    `Down: $${downPayment.toFixed(2)}`,
    `Monthly: $${monthlyPayment.toFixed(2)} x 72 months`,
    `Balloon: $${balloon.toFixed(2)}`
  ].join("\n");
}
