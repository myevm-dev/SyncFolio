import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: "What is SyncFolio?",
      answer:
        "A platform connecting real estate investors, agents, and deal finders to streamline sourcing, submitting, and reviewing property deals.",
    },
    {
      question: "It says ETH on my profile, is blockchain or cryptocurrency used?",
      answer:
        "No, SyncFolio does not use cryptocurrency or blockchain for real estate deals. The app uses the same cryptographic system as Ethereum (Keccak256 hashing and ECDSA signatures) to generate and verify accounts. This enables secure, private deal submission so your data is encrypted and even the site admin cannot view anything unless you choose to share it. While we may collect platform fees in ETH or USD for features or services, no cryptocurrency is used in any deals.",
    },
    {
      question: "How do I submit a deal?",
      answer:
        "Fill out the property questionnaire on the home page and click 'Save' or 'Update'. Your deal will be added to your dashboard.",
    },
    {
      question: "Who sees the deals I submit?",
      answer:
        "If one of our current 112 Buyers are subscribed to your criteria or region, they will see your deals when you submit them to the platform.",
    },
    {
      question: "Do I need to pay to use SyncFolio?",
      answer:
        "The platform charges fees on a transactional basis when a deal is complete. In the future, you will also have the option to purchase credits if you want to use AI-powered assistance.",
    },
  ];

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="mt-20 bg-[#050505] border border-neutral-700 rounded-lg p-8 shadow-md hover:shadow-lg transition text-white">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8" style={{ color: "#068989" }}>
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="border border-zinc-700 bg-[#0B1519] rounded-md overflow-hidden"
          >
            <button
              onClick={() => handleToggle(index)}
              className="w-full text-left px-4 py-3 flex justify-between items-center hover:bg-[#6e5690] hover:text-black transition"
            >
              <span className="font-semibold">{item.question}</span>
              <span className="text-xl">{activeIndex === index ? "-" : "+"}</span>
            </button>
            {activeIndex === index && (
              <div className="px-4 pb-4 text-sm text-gray-300 mt-2">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
