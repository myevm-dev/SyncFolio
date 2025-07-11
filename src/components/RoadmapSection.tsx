import React from "react";

interface ComingSoonItem {
  label: string;
  percent: number;
}

interface Props {
  items: ComingSoonItem[];
}

export default function RoadmapSection({ items }: Props) {
  return (
    <section className="mt-16 bg-[#050505] border border-neutral-700 rounded-lg p-8 text-center shadow-md hover:shadow-lg transition">
      <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
        Roadmap
      </h2>

      <p className="text-gray-300 text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-6">
        Unlock the next generation of real estate intelligence. AI-driven tools will soon help
        you analyze, score, and optimize deals. Collaborate with partners or deploy smart agents
        to work deals on your behalf.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.label} className="text-left space-y-1">
            <div className="text-sm font-medium bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {item.label}
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-400 to-cyan-400 h-3 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${item.percent}%` }}
              />
            </div>
            <div className="text-xs text-gray-400">{item.percent}% complete</div>
          </div>
        ))}
      </div>
    </section>
  );
}
