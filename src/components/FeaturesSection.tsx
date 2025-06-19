import React, { useRef, useEffect } from "react";

const features = [
  { title: "Lead Management CRM", description: "." },
  { title: "Creative Offer Generator", description: "." },
  { title: "Customizable Call Scripts", description: "." },
  { title: "Quick Repair Calculator", description: "." },
];

export default function FeaturesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const fullList = [...features, ...features, ...features]; // Duplicate for loop illusion
  const originalLength = features.length;

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

  // Reset scroll position if reaching clone edges
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const itemWidth = 300; // width of each card (match Tailwind min-w)
    const totalWidth = itemWidth * fullList.length;
    const resetPoint = itemWidth * originalLength;

    // Start at the center
    el.scrollLeft = resetPoint;

    const handleScroll = () => {
      if (el.scrollLeft <= 0) {
        el.scrollLeft = resetPoint;
      } else if (el.scrollLeft >= totalWidth - resetPoint) {
        el.scrollLeft = resetPoint;
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 mt-16 text-white">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#6e5690]">
        Platform Features
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
            <p className="text-sm text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
