// components/OfferFooter.tsx
import React from "react";

interface OfferFooterProps {
  contact: {
    name: string;
    phone: string;
    jv: string;
  };
  attachments: string[];
}

export default function OfferFooter({ contact, attachments }: OfferFooterProps) {
  return (
    <div className="mt-6 text-white text-sm">
      <p className="mb-1">Best regards,</p>
      <p className="font-semibold">{contact.name}</p>
      <p>{contact.phone}</p>
      <p className="mb-2">Joint Venture: {contact.jv}</p>
      <p><strong>Attachments:</strong> {attachments.join(", ")}</p>
    </div>
  );
}
