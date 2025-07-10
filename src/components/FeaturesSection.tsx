import React from "react";

const features = [
  { title: "🚀 Get Started", description: "As simple as Click sign in, pick a username, and enter your zip code." },
  { title: "🤝 Social Proof Network", description: "Build credibility, JV, and connect with trusted investors, agents, and dealmakers." },
  { title: "🎁 Sign Up Rewards", description: "Get 100k Ꞙolio Token for signing up *subject to vesting." },
  { title: "📁 Lead Management CRM", description: "Manage up to 500 leads for free and share with team members." },
  { title: "🛠️ Quick Repair Calculator", description: "Calculate repairs by pictures and just a few questions." },
  { title: "✨ Creative Offer Generator", description: "Create Creative Finance and Cash offers that are sure to sell to our buyer list." },
  { title: "📜 Customizable Call Scripts", description: "Dynamic call script using the checkmate pitch w/ real time calculations." },
  { title: "💸 Referral Program", description: "Earn $300 every time a person you invite closes a deal. Invite to your own welcome page." },
  { title: "🏆 Top Ranked Real Estate Agents", description: "View America's best and worst agents based on user rankings." },
];

export default function FeaturesSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 mt-16 text-white">
      <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
        Live Platform Features
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="border border-zinc-700 bg-black p-6 rounded-2xl shadow-md hover:shadow-xl transition hover:border-cyan-500"
          >
            <h3 className="text-lg font-semibold mb-2 text-[#068989] flex items-center">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-300">
              {feature.description.includes("*subject to vesting") ? (
                <>
                  {feature.description.replace(" *subject to vesting.", "").replace(" *subject to vesting", "")}
                  <br />
                  <span className="text-xs italic text-gray-400">*subject to vesting</span>
                </>
              ) : (
                feature.description
              )}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}