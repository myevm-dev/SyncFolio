import React from "react";
import { Link } from "react-router-dom";

const features = [
  { slug: "get-started", title: "🚀 Get Started", description: "Click sign in, pick a username, and enter your zip code." },
  { slug: "social-proof-network", title: "🤝 Social Proof Network", description: "Build credibility, JV, and connect with trusted investors, agents, and dealmakers." },
  { slug: "sign-up-rewards", title: "🎁 Sign Up Rewards", description: "Get 100k Ꞙolio Token for signing up *subject to vesting." },
  { slug: "lead-management-crm", title: "📁 Lead Management CRM", description: "Manage up to 500 leads for free." },
  { slug: "quick-repair-calculator", title: "🛠️ Quick Repair Calculator", description: "Calculate repairs by picture and just a few questions." },
  { slug: "creative-offer-generator", title: "✨ Creative Offer Generator", description: "Create offers that are sure to sell to our buyer list." },
  { slug: "customizable-call-scripts", title: "📜 Customizable Call Scripts", description: "Dynamic call script using the checkmate pitch." },
  { slug: "referral-program", title: "💸 Referral Program", description: "Earn $300 every time a person you invite closes a deal." },
  { slug: "top-ranked-agents", title: "🏆 Top Ranked Real Estate Agents", description: "View America's best and worst agents based on user rankings." },
];

export default function FeaturesSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 mt-16 text-white">
      <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
        Live Platform Features
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Link
            to={`/features/${feature.slug}`}
            key={index}
            className="border border-zinc-700 bg-black p-6 rounded-2xl shadow-md hover:shadow-xl transition hover:border-cyan-500 block"
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
          </Link>
        ))}
      </div>
    </section>
  );
}
