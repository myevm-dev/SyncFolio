import React from "react";

interface Props {
  index: number;
  currentStep: number;
  isPaid: boolean;
}

export default function ClosedPaymentStep({ index, currentStep, isPaid }: Props) {
  if (index > currentStep) return null;

  return (
    <div className="w-[250px] md:w-[440px] bg-black border border-cyan-500 rounded-xl p-6 shadow-md text-center">
      <p className="text-white font-semibold text-lg mb-3">
        Payment Status
      </p>
      <div
        className={`inline-block px-4 py-1.5 rounded text-sm font-medium tracking-wide ${
          isPaid
            ? "bg-green-700 text-white border border-green-400"
            : "bg-yellow-700 text-white border border-yellow-400"
        }`}
      >
        {isPaid ? "Paid" : "Pending"}
      </div>
    </div>
  );
}
