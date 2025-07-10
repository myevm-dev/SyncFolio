// Modified version of PlatformDepositModal to add step 4 for chain & token selection with token cost calculation

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "./Dialog";
import { CHAINS } from "../lib/chains";
import { tokens as arbitrumTokens } from "../lib/tokens/arbitrumTokens";
import { tokens as baseTokens } from "../lib/tokens/baseTokens";
import { tokens as ethTokens } from "../lib/tokens/ethTokens";
import { tokens as optimismTokens } from "../lib/tokens/optimismTokens";
import { tokens as polygonTokens } from "../lib/tokens/polygonTokens";

interface PlatformDepositModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (
    method: "stripe" | "crypto",
    receive: "CREDITS",
    tier?: string,
    chainId?: number,
    tokenAddress?: string
  ) => void;
}

const PlatformDepositModal: React.FC<PlatformDepositModalProps> = ({ open, onClose, onSelect }) => {
  const [step, setStep] = useState<1 | 3 | 4 | 5>(1);
  const [selectedMethod, setSelectedMethod] = useState<"stripe" | "crypto" | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedChainId, setSelectedChainId] = useState<number | null>(null);
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});

  const tierUsdValue: Record<string, number> = {
    starter: 10,
    pro: 50,
    elite: 250,
  };

  useEffect(() => {
    if (open) {
      setStep(1);
      setSelectedMethod(null);
      setSelectedTier(null);
      setSelectedChainId(null);
    }
  }, [open]);

  useEffect(() => {
    if (step === 5 && selectedChainId) {
      const tokens = getTokensForChain(selectedChainId);
      const ids = tokens.map(t => t.coingeckoId).join(',');
      fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`)
        .then(res => res.json())
        .then(data => {
          const prices: Record<string, number> = {};
          tokens.forEach(t => {
            if (t.coingeckoId && data[t.coingeckoId]?.usd) {
              prices[t.address] = data[t.coingeckoId].usd;
            }
          });
          setTokenPrices(prices);
        });
    }
  }, [step, selectedChainId]);

  const handleMethodSelect = (method: "stripe" | "crypto") => {
    setSelectedMethod(method);
    setStep(3);
  };

  const creditTiers = [
    {
      name: "Starter",
      credits: "10,000",
      price: "$10",
      stripeUrl: "https://buy.stripe.com/9B63cuaby361dOn9fr1ZS05",
      cryptoKey: "starter",
    },
    {
      name: "Pro",
      credits: "60,000",
      price: "$50",
      stripeUrl: "https://buy.stripe.com/3cI28qerO361aCb77j1ZS06",
      cryptoKey: "pro",
    },
    {
      name: "Elite",
      credits: "350,000",
      price: "$250",
      stripeUrl: "https://buy.stripe.com/bJe28q83q9up7pZajv1ZS07",
      cryptoKey: "elite",
    },
  ];

  const getTokensForChain = (chainId: number) => {
    switch (chainId) {
      case 42161:
        return arbitrumTokens;
      case 8453:
        return baseTokens;
      case 1:
        return ethTokens;
      case 10:
        return optimismTokens;
      case 137:
        return polygonTokens;
      default:
        return [];
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setStep(1);
          setSelectedMethod(null);
          setSelectedTier(null);
          setSelectedChainId(null);
          onClose();
        }
      }}
    >
      <DialogContent className="bg-[#0a0a0a] border border-neutral-700 max-w-2xl text-white rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-6">
          {step === 1
            ? "Choose Deposit Method"
            : step === 3
            ? "Choose a Credit Tier"
            : step === 4
            ? "Choose Chain"
            : "Choose Token"}
        </h2>

        {step === 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
            {[{
              label: "Deposit with Stripe",
              description: "Use your debit/credit card to deposit USD to your platform balance.",
              icon: () => (
                <img src="/assets/stripelogo.png" alt="Stripe" className="w-14 h-14 object-contain" />
              ),
              onClick: () => handleMethodSelect("stripe"),
            }, {
              label: "Deposit with Crypto",
              description: "Transfer an altcoin from your basechain wallet to fund your platform balance.",
              icon: () => (
                <img src="/assets/ethlogo.png" alt="Ethereum" className="w-14 h-14 object-contain" />
              ),
              onClick: () => handleMethodSelect("crypto"),
            }].map(({ label, description, icon, onClick }) => (
              <div
                key={label}
                onClick={onClick}
                className="flex flex-col justify-start items-center text-center bg-black border border-neutral-700 rounded-xl px-6 py-8 text-white hover:shadow-xl cursor-pointer hover:border-blue-600 transition-all min-w-[200px] min-h-[220px]"
              >
                <div className="mb-3">{icon()}</div>
                <h3 className="text-lg font-semibold mb-2">{label}</h3>
                <p className="text-gray-400 text-sm max-w-[200px]">{description}</p>
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {creditTiers.map(({ name, credits, price, stripeUrl, cryptoKey }) => {
              const isStripe = selectedMethod === "stripe";
              const label = isStripe ? "Buy with Stripe" : "Buy with Crypto";
              return (
                <div
                  key={name}
                  className="bg-black border border-neutral-700 rounded-xl p-5 flex flex-col items-center w-[160px]"
                >
                  <img src="/assets/isailogo.png" alt="Logo" className="w-10 h-10 mb-2" />
                  <h3 className="text-white text-base font-bold mb-1">{name}</h3>
                  <p className="text-sm text-gray-400 mb-1">{credits} Credits</p>
                  <p className="text-lg font-semibold text-white mb-3">{price}</p>
                  <button
                    onClick={() => {
                      if (isStripe) {
                        onSelect("stripe", "CREDITS");
                        window.open(stripeUrl, "_blank");
                      } else {
                        setSelectedTier(cryptoKey);
                        setStep(4);
                      }
                    }}
                    className="text-blue-400 hover:underline text-sm"
                  >
                    {label}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {step === 4 && selectedTier && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.entries(CHAINS).map(([key, { name, chainId }]) => (
              <div
                key={key}
                className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 cursor-pointer hover:border-blue-500"
                onClick={() => {
                  setSelectedChainId(chainId);
                  setStep(5);
                }}
              >
                <p className="font-semibold text-white text-center">{name}</p>
              </div>
            ))}
          </div>
        )}

        {step === 5 && selectedTier && selectedChainId && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {getTokensForChain(selectedChainId).map((token: { name: string; address: string; coingeckoId?: string }) => {
              const price = tokenPrices[token.address];
              const cost =
                selectedTier && price
                  ? (tierUsdValue[selectedTier] / price).toFixed(6)
                  : null;
              return (
                <div
                  key={token.address}
                  className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 cursor-pointer hover:border-green-500"
                  onClick={() => {
                    onSelect("crypto", "CREDITS", selectedTier, selectedChainId, token.address);
                  }}
                >
                  <p className="text-center font-semibold text-white">{token.name}</p>
                  {cost && (
                    <p className="text-center text-gray-400 text-sm">≈ {cost} {token.name}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
};

export default PlatformDepositModal;