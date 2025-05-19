import { DealInput } from "../types/DealInput";

export default function cashOffer(input: DealInput): string {
  const arv = parseFloat(input.arv || "0");
  const rehab = parseFloat(input.rehabCost || "0");

  const offer = (arv * 0.68) - rehab;
  return isNaN(offer) ? "Invalid input" : `$${offer.toFixed(2)}`;
}
