// components/HeroHeader.tsx
import React from "react";

export default function HeroHeader() {
  return (
    <header className="text-center mb-16">
      <h1 className="text-4xl text-gray-300 md:text-5xl font-bold mb-4">
        Welcome to <span className="text-[#6e5690]">SyncFolio.Space</span>
      </h1>
      <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
        A streamlined platform for real estate deals.
      </p>
      <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mt-1">
        Built for deal finders, buyers, sellers, and agents to connect, analyze, and close faster.
      </p>
    </header>
  );
}
