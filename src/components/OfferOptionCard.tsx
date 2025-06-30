// components/OfferOptionCard.tsx
import React from "react";

interface OfferOptionCardProps {
  label: string;
  price: number;
  terms: string[];
}

export default function OfferOptionCard({ label, price, terms }: OfferOptionCardProps) {
  return (
    <div className="bg-zinc-800 border border-neutral-700 rounded p-4 mb-4 text-white">
      <h3 className="text-lg font-bold mb-2 text-cyan-400">{label}</h3>
      <p className="mb-2"><strong>Offer Price:</strong> ${price.toLocaleString()}</p>
      <ul className="list-disc pl-6 space-y-1 text-sm">
        {terms.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

