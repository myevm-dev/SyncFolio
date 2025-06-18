// components/FeaturesSection.tsx
import React from "react";

const features = [
  {
    title: "Lead Management CRM",
    description:
      ".",
  },
  {
    title: "Creative Offer Generator",
    description:
      ".",
  },
  {
    title: "Customizable Call Scripts",
    description:
      ".",
  },
  {
    title: "Quick Repair Calculator",
    description:
      ".",
  },
];

export default function FeaturesSection() {
  return (
    <section className="max-w-5xl mx-auto px-4 mt-16 text-white">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#6e5690]">
        Platform Features
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="border border-zinc-700 bg-black p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2 text-[#068989]">{feature.title}</h3>
            <p className="text-sm text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
