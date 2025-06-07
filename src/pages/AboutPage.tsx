import React from "react";

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-[#0B1519] text-white px-6 py-20 flex flex-col">
      <div className="max-w-6xl mx-auto flex-grow">
        {/* Hero */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to <span className="text-accent">SyncFolio.Space</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            A streamlined platform to buy, sell, or submit real estate deals — built for deal finders,
            buyers, sellers, and agents to connect, analyze, and close faster.
          </p>
        </header>

        {/* Role Cards */}
        <section className="grid gap-8 md:grid-cols-3">
          {[
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
          ].map((card) => (
            <div
              key={card.title}
              className="bg-[#050505] border border-neutral-700 rounded-lg p-6 shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-accent mb-2">{card.title}</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{card.text}</p>
            </div>
          ))}
        </section>

        {/* Coming Soon */}
        <section className="mt-16 bg-[#050505] border border-neutral-700 rounded-lg p-8 text-center shadow-md hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-accent mb-4">🚀 Coming Soon</h2>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Unlock the next generation of real estate intelligence. AI-driven tools will soon help
            you analyze, score, and optimize deals. Collaborate with partners or deploy smart agents
            to work deals on your behalf.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {[
              "Team Collaboration",
              "Portfolio Management",
              "Employable AI Agents",
              "Tradable Trust Rights",
            ].map((feature) => (
              <div
                key={feature}
                className="bg-[#0B1519] border border-zinc-700 text-gray-200 text-sm rounded-md px-4 py-3 shadow-sm hover:border-accent transition"
              >
                {feature}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
