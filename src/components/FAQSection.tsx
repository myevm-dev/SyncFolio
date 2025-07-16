import React, { useState } from "react";
import TGEProgressBar from "./TGEProgressBar";


interface FAQItem {
  question: string;
  answer: React.ReactNode;
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
      question: "How to use SyncFolio as a Deal Finder?",
      answer: (
        <ol className="list-decimal list-inside space-y-1">
          <li>🔍 Find a property and fill in the home details + agent info.</li>
          <li>📞 Call the agent using the provided Call Script to get the needed information.</li>
          <li>🧮 Calculate offers and send to the agent.</li>
          <li>✅ If accepted, press “Finalize” for us to send the contract.</li>
          <li>📅 Closing will take less than 30 days and the💲balance will be added to your account.</li>
        </ol>
      ),
    },
    {
      question: "How to use SyncFolio as a Buyer?",
      answer: (
        <ol className="list-decimal list-inside space-y-1">
          <li>🏷️ Submit your Buybox criteria to get matched with ideal deals.</li>
          <li>🧠 Launch your personalized AI Deal Analyzer to filter and review live properties.</li>
          <li>💰 Deposit funds into escrow to let AI claim deals on your behalf in real-time.</li>
          <li>📈 Buy County Deal Flow Tokens to get first access to priority listings.</li>
          <li>🏅 Complete deals give you social proof on your public profile.</li>
        </ol>
      ),
    },
    {
      question: "How to use SyncFolio as an Agent or Seller?",
      answer: (
        <ol className="list-decimal list-inside space-y-1">
          <li>⚡ Get an instant offer from SyncFolio’s Dispo.</li>
          <li>📝 List your property on the Creative Deal Marketplace in a few minutes.</li>
          <li>📣 Instantly show your deal to 2,000+ active investors and buyers.</li>
          <li>📊 Track interest, buyer activity, and offers from your dashboard.</li>
          <li>💼 Finalize the deal and get full commission + additional referral rewards.</li>
        </ol>
      ),
    },

    {
      question: "What are Credits in the App?",
      answer: (
        <p>
          Credits are in-platform usage tokens that allow you to unlock premium features,
          including access to AI tools, advanced analytics, and automation. You can earn
          them through activity or purchase them to enhance your workflow.
        </p>
      ),
    },
    {
      question: "It says ETH on my profile, is blockchain or cryptocurrency used?",
      answer:
        "No, SyncFolio does not use cryptocurrency or blockchain for real estate deals or involving the homes themselves. The app uses the same cryptographic system as Ethereum (Keccak256 hashing and ECDSA signatures) to generate and verify accounts. This enables secure, private deal submission so your data is encrypted and even the site admin cannot view anything unless you choose to share it. While we may collect platform fees in ETH or USD for features or services, and likely offer onchain products, homes or deals are peer to peer in a traditional sense.",
    },
    {
      question: "Are users listing and selling houses?",
      answer:
        "No, users are not listing or marketing properties. Instead, they are transacting rights to contract placement, essentially selling the opportunity for a finder’s fee.",
    },
    {
      question: "How do I submit a deal?",
      answer:
        "Fill out the property questionnaire on the home page and click 'Save' or 'Update'. Your deal will be added to your dashboard.",
    },
    {
      question: "Who sees the deals I submit?",
      answer:
        "If one of our current 2100+ Buyers are subscribed to your criteria or region, they will see your deals when you submit them to the platform.",
    },
    {
      question: "Do I need to pay to use SyncFolio?",
      answer:
        "The platform charges fees on a transactional basis when a deal is complete. In the future, you will also have the option to purchase credits if you want to use AI-powered assistance.",
    },
    {
      question: "What is Ꞙolio Token?",
      answer:
        "Ꞙolio Token is a digital asset used within the SyncFolio platform to incentivize and reward users for their participation and contributions. Buyers may use Folio Tokens to buy and hold County specific Deal Flow tokens to amplify and get priority Deal Flow.",
    },
    {
      question: "How to get Ꞙolio Token?",
      answer:
        "Ꞙolio Token can be obtained through various activities on the SyncFolio platform, such as participating in deals, referring new users, or purchasing them directly. We are offering discounted presale rounds with a vesting period. Keep Reading for more details.",
    },
    {
      question: "What are Deal Flow Tokens?",
      answer:
        "Deal Flow Tokens are a type of digital asset within the SyncFolio platform that represent a buyer's stake in specific US Counties and can be purchased on a bonding curve. By holding these tokens, buyers can gain priority access to deal flow and potentially earn performance of the underlying assets and how early they are to the region.",
    },
    {
      question: "When is the Ꞙolio Token Generation Event (TGE)?",
      answer: (
        <div>
          The Ꞙolio Token Generation Event (TGE) will occur once the platform reaches{" "}
          <span className="text-pink-500 font-semibold">$30 million</span> in total real estate volume.
          <TGEProgressBar currentVolume={1} />
        </div>
      ),
    },
    {
      question: "Can I withdraw my Credits?",
      answer:
        "No, Credits are non-transferable and cannot be withdrawn from the platform. They are designed to be used within the SyncFolio ecosystem to access premium features and services.",
    },
    {
      question: "What is ETH?",
      answer:
        "ETH is the native cryptocurrency of Ethereum based blockchains. It is used to pay for transactions and computational services on the network. If operating on-chain, please keep a few dollars of ETH to pay for transaction costs on the Base Chain Network.",
    },
        {
      question: "What are smart contracts?",
      answer:
        "Smart contracts are self-executing contracts with the terms of the agreement directly written into code. They are transparent and audited for trust, as well as trustless because once published they cannot be altered.",
    },

    {
      question: "How many leads can I manage?",
      answer:
        "You may save and manage up to 500 leads for no cost. In the future, we may offer a way to purchase additional lead management credits.",
    },
    {
      question: "Do you have a pitch deck?",
      answer:
        "Yes, we have a pitch deck available for interested parties. Please contact us for more information at Yo@MyEVM.ORG.",
    },
  ];

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="mt-20 bg-[#050505] border border-neutral-700 rounded-lg p-8 shadow-md hover:shadow-lg transition text-white">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
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