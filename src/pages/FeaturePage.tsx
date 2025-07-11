import React from "react";
import { useParams, Link } from "react-router-dom";

const features = [
  { slug: "full-platform-walkthrough", title: "🧭 Full Platform Walkthrough", description: "A step-by-step demo of how SyncFolio works from sign up to offer submission." },

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
    <section className="max-w-6xl mx-auto px-6 mt-20 text-white">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#068989] mb-2">{feature.title}</h1>
        <p className="text-gray-400 text-md">{feature.description}</p>
      </div>

      {/* Video Placeholder */}
      <div className="mb-12 flex justify-center">
        <div className="w-full max-w-3xl aspect-video bg-neutral-800 rounded-xl flex items-center justify-center text-gray-500">
          {/* Replace with <iframe> or video embed */}
          <span>Video demo coming soon</span>
        </div>
      </div>

      {/* Details Section */}
      <div className="mb-12 space-y-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-cyan-400">What it does</h2>
        <p className="text-gray-300">
          This section will explain the functionality of the feature in more detail. You can outline workflows, describe user actions, or highlight results.
        </p>

        <h2 className="text-2xl font-semibold text-cyan-400">Use Cases</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Real-world scenario #1</li>
          <li>Real-world scenario #2</li>
          <li>Example benefit for users</li>
        </ul>

        <h2 className="text-2xl font-semibold text-cyan-400">Benefits</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Saves time and reduces manual work</li>
          <li>Improves team collaboration</li>
          <li>Increases deal closing rate</li>
        </ul>
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <Link to="/" className="inline-block bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-6 py-3 rounded-xl transition">
          Try Now
        </Link>
      </div>

      {/* Back link */}
      <div className="text-center mt-8">
        <Link to="/about" className="text-cyan-400 hover:underline">← Back to About</Link>
      </div>
    </section>
  );
}
