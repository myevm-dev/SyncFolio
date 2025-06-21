import React from "react";
import FAQSection from "../components/FAQSection";
import DisclaimerSection from "../components/DisclaimerSection";
import HeroHeader from "../components/HeroHeader";
import ComingSoonSection from "../components/ComingSoonSection";
import FeaturesSection from "../components/FeaturesSection";

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
  { label: "Earn Platform Credits", percent: 65 },
  { label: "Auto-Offers", percent: 60 },
  { label: "Lead Gamification", percent: 60 },
  { label: "Employable AI Agents", percent: 55 },
  { label: "Auto-Contracts", percent: 50 },
  { label: "Deal Marketplace", percent: 50 },
  { label: "JV With Us", percent: 50 },
  { label: "Funding & Yield Plugins", percent: 40 },
  { label: "Referral Program", percent: 35 },
  { label: "AI Chat Assistant", percent: 25 },
  { label: "Tokenlock Deal Flow", percent: 20 },
  { label: "Portfolio Management", percent: 10 },
  { label: "User Acreditation", percent: 10 },
  { label: "White Label Website", percent: 1 },
  { label: ".", percent: 1 },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-[#0B1519] text-white px-6 py-20 flex justify-center">
      <div className="w-full max-w-6xl flex-grow flex flex-col items-center">
        <HeroHeader />

        {/* Role Cards */}
        <section className="grid gap-8 md:grid-cols-3 w-full mt-12">
          {roles.map((card) => (
            <div
              key={card.title}
              className="bg-[#050505] border border-neutral-700 rounded-lg p-6 shadow-md transition hover:bg-[#6e5690] hover:text-black hover:border-[#6e5690] cursor-pointer group"
            >
              <h2 className="text-lg font-semibold mb-2 group-hover:text-black" style={{ color: "#068989" }}>
                {card.title}
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed group-hover:text-black">{card.text}</p>
            </div>
          ))}
        </section>

        <div className="w-full mt-16">
          <FeaturesSection />
        </div>

        {/* Coming Soon */}
        <div className="w-full max-w-6xl mx-auto mt-16">
          <ComingSoonSection items={comingSoonItems} />
        </div>

        {/* FAQ & Disclaimer */}
        <div className="w-full max-w-6xl mx-auto mt-16">
          <FAQSection />
          <DisclaimerSection />
        </div>
      </div>
    </div>
  );
}
