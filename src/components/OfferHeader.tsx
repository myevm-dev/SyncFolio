// components/OfferHeader.tsx
import React from "react";

interface OfferHeaderProps {
  propertyAddress: string;
  jvPartners: string;
}

export default function OfferHeader({ propertyAddress, jvPartners }: OfferHeaderProps) {
  return (
    <p className="text-white text-sm mb-4">
      I’m submitting an offer for <span className="font-semibold">{propertyAddress}</span> with two purchase options. This acquisition will be structured as a joint venture between <span className="font-semibold">{jvPartners}</span>.
    </p>
  );
}
