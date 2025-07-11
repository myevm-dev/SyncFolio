import React from "react";
import FAQSection from "../components/FAQSection";
import DisclaimerSection from "../components/DisclaimerSection";
import HeroHeader from "../components/HeroHeader";
import RoadmapSection from "../components/RoadmapSection";
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
  { label: "Auto-Offers", percent: 85 },
  { label: "Decay and Expiring Offers", percent: 85 },
  { label: "Cash Auto-Contracts", percent: 80 },
  { label: "Printable Referral Cards", percent: 75 },
  { label: "Affiliate Page", percent: 65 },
  { label: "Earn Platform Credits", percent: 65 },
  { label: "JV With Us", percent: 55 },
  { label: "Offer Links", percent: 50 },
  { label: "Lead Gamification", percent: 45 },
  { label: "AI Deal Analysis", percent: 40 },
  { label: "AI Chat Assistant", percent: 35 },
  { label: "Deal Marketplace", percent: 30 },
  { label: "Funding & Yield Plugins", percent: 30 },
  { label: "Employable AI Agents", percent: 25  },
  { label: "Tokenlock Deal Flow", percent: 20 },
  { label: "How To Videos", percent: 20 },
  { label: "Twilio Integration", percent: 15 },
  { label: "Buy and Sell Leads", percent: 15 },
  { label: "AI Virtual Assistant", percent: 10 },
  { label: "Activity Heatmap", percent: 10 },
  { label: "User Acreditation", percent: 5 },
  { label: "Live AI Scripting", percent: 5 },
// { label: "Swipe to Shop Deals", percent: 5 },
// { label: "REI Portfolio Management", percent: 5 },
// { label: "Field Network", percent: 5 },
// { label: "Groups", percent: 5 },

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
              className="bg-black border border-neutral-700 rounded-2xl p-6 shadow-md hover:shadow-xl transition hover:border-cyan-500 cursor-pointer group"
            >
              <h2 className="text-lg font-semibold mb-2 text-[#068989] group-hover:text-[#068989]">
                {card.title}
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white">{card.text}</p>
            </div>
          ))}
        </section>

        <div className="w-full mt-16">
          <FeaturesSection />
        </div>

        {/* Coming Soon */}
        <div className="w-full max-w-6xl mx-auto mt-16">
          <RoadmapSection items={comingSoonItems} />
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
