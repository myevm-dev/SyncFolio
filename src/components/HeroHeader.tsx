import React from "react";

export default function HeroHeader() {
  return (
    <header className="text-center mb-16">
      <h1 className="text-4xl text-gray-300 md:text-5xl font-bold mb-4">
        Welcome to{" "}
        <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          SyncFolio.Space
        </span>
      </h1>
      <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mt-1">
        A creative platform for real estate deals.<br/> Built to connect, analyze, and close faster with social proof by default.
      </p>
    </header>
  );
}
