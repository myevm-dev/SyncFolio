import { DealInput } from "../types/DealInput";

export default function cashOffer(input: DealInput): string {
  const arv = parseFloat(input.arv || "0");
  const rehab = parseFloat(input.rehabCost || "0");

  const offer = (arv * 0.71) - rehab;
  const downPayment = offer * 0.20;

  if (isNaN(offer) || offer <= 0) return "Invalid input";

  return `Offer: $${offer.toFixed(2)} (Down: $${downPayment.toFixed(2)})`;
}
