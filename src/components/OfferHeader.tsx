// components/OfferHeader.tsx
import React from "react";

interface OfferHeaderProps {
  propertyAddress: string;
  jvPartners: string;
}

export default function OfferHeader({ propertyAddress, jvPartners }: OfferHeaderProps) {
  return (
    <p className="text-white text-sm mb-4">
      I’m submitting an offer for <span className="font-semibold">{propertyAddress}</span>. 
    </p>
  );
}
