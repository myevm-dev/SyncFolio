import React, { useRef, useLayoutEffect } from "react";

const features = [
  { title: "🎁 Sign Up Rewards", description: "Get 150k Folio Token for signing up *subject to vesting." },
  { title: "🗂 Lead Management CRM", description: "Manage up to 500 leads for free." },
  { title: "✨ Creative Offer Generator", description: "Create offers that are sure to sell to our buyer list." },
  { title: "📜 Customizable Call Scripts", description: "Dynamic call script using the checkmate pitch." },
  { title: "💸 Referral Program", description: "Earn $300 every time a person you invite closes a deal." },
  { title: "🏆 Top Ranked Real Estate Agents", description: "View America's best and worst agents based on user rankings." },
  { title: "🛠️ Quick Repair Calculator", description: "Calculate repairs by picture and just a few questions." },
  { title: "🚀 Get Started", description: "Click sign in, pick a username, and enter your zip code." },
];


export default function FeaturesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const fullList = [...features, ...features, ...features];
  const itemWidth = 300;
  const originalLength = features.length;
  const centerIndex = originalLength; // Start of the middle copy

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDown = true;
    el.classList.add("cursor-grabbing");
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown = false;
    scrollRef.current?.classList.remove("cursor-grabbing");
  };

  const handleMouseUp = () => {
    isDown = false;
    scrollRef.current?.classList.remove("cursor-grabbing");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el || !isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeft - walk;
  };

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const resetScroll = () => {
      const scrollTo = centerIndex * itemWidth;
      el.scrollLeft = scrollTo;
    };

    resetScroll();

    const totalWidth = itemWidth * fullList.length;

    const handleScroll = () => {
      if (el.scrollLeft <= itemWidth) {
        el.scrollLeft = centerIndex * itemWidth;
      } else if (el.scrollLeft >= totalWidth - itemWidth * originalLength) {
        el.scrollLeft = centerIndex * itemWidth;
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 mt-16 text-white">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
        Live Platform Features
      </h2>


      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory cursor-grab select-none"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
        }}
      >
        {fullList.map((feature, index) => (
          <div
            key={index}
            className="min-w-[300px] snap-start flex-shrink-0 border border-zinc-700 bg-black p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2 text-[#068989]">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-300">
              {feature.description.includes("*subject to vesting") ? (
                <>
                  {feature.description.replace(" *subject to vesting.", "")}
                  <span className="text-xs italic text-gray-400"> *subject to vesting</span>
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
