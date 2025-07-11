import React from "react";
import { useParams, Link } from "react-router-dom";

const features = [
  { slug: "get-started", title: "🚀 Get Started", description: "Click sign in, pick a username, and enter your zip code." },
  { slug: "social-proof-network", title: "🤝 Social Proof Network", description: "Build credibility, JV, and connect with trusted investors, agents, and dealmakers." },
  { slug: "sign-up-rewards", title: "🎁 Sign Up Rewards", description: "Get 100k Ꞙolio Token for signing up." },
  { slug: "lead-management-crm", title: "📁 Lead Management CRM", description: "Manage up to 500 leads for free." },
  { slug: "quick-repair-calculator", title: "🛠️ Quick Repair Calculator", description: "Calculate repairs by picture and just a few questions." },
  { slug: "creative-offer-generator", title: "✨ Creative Offer Generator", description: "Create offers that are sure to sell to our buyer list." },
  { slug: "customizable-call-scripts", title: "📜 Customizable Call Scripts", description: "Dynamic call script using the checkmate pitch." },
  { slug: "referral-program", title: "💸 Referral Program", description: "Earn $300 every time a person you invite closes a deal." },
  { slug: "top-ranked-agents", title: "🏆 Top Ranked Real Estate Agents", description: "View America's best and worst agents based on user rankings." },
];

export default function FeaturePage() {
  const { slug } = useParams();
  const feature = features.find(f => f.slug === slug);

  if (!feature) {
    return (
      <div className="max-w-3xl mx-auto px-4 mt-20 text-white text-center">
        <h1 className="text-2xl font-bold mb-4">Feature Not Found</h1>
        <Link to="/about" className="text-cyan-400 hover:underline">← Back to About</Link>
      </div>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-4 mt-20 text-white">
      <h1 className="text-3xl font-bold mb-4 text-[#068989]">{feature.title}</h1>
      <p className="text-md text-gray-300 mb-6">{feature.description}</p>
      <Link to="/about" className="text-cyan-400 hover:underline">← Back to About</Link>
    </section>
  );
}
