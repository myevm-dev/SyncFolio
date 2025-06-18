import React from "react";
import FAQSection from "../components/FAQSection";
import DisclaimerSection from "../components/DisclaimerSection";
import HeroHeader from "../components/HeroHeader";
import ComingSoonSection from "../components/ComingSoonSection";

const roles = [
  {
    title: "For Deal Finders",
    text: "Track and manage leads, generate creative and wholesale offers instantly, and present them to buyers with confidence.",
  },
  {
    title: "For Buyers",
    text: "Define your buy box and get matched with high-quality, verified deals in real time. Filter by your preferences and let SyncFolio do the sourcing.",
  },
  {
    title: "For Sellers & Agents",
    text: "Get fast, qualified offers from active investors. Skip the listing process, reduce time on market, and close with certainty.",
  },
];

const comingSoonItems = [
  { label: "Team Collaboration", percent: 80 },
  { label: "Portfolio Management", percent: 10 },
  { label: "Employable AI Agents", percent: 30 },
  { label: "Tradable Trust Rights", percent: 10 },
  { label: "Funding & Yield Plugins", percent: 85 },
  { label: "Lead Gamification", percent: 60 },
  { label: "Deal Marketplace", percent: 55 },
  { label: "Earn Platform Credits", percent: 65 },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-[#0B1519] text-white px-6 py-20 flex flex-col">
      <div className="max-w-6xl mx-auto flex-grow">
        <HeroHeader />

        {/* Role Cards */}
        <section className="grid gap-8 md:grid-cols-3">
          {roles.map((card) => (
            <div
              key={card.title}
              className="bg-[#050505] border border-neutral-700 rounded-lg p-6 shadow-md transition hover:bg-[#6e5690] hover:text-black hover:border-[#6e5690]"
            >
              <h2 className="text-lg font-semibold mb-2" style={{ color: "#068989" }}>
                {card.title}
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">{card.text}</p>
            </div>
          ))}
        </section>

        {/* Coming Soon */}
        <ComingSoonSection items={comingSoonItems} />

        {/* FAQ & Disclaimer */}
        <FAQSection />
        <DisclaimerSection />
      </div>
    </div>
  );
}