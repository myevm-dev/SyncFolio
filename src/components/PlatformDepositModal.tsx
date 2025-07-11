import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "./Dialog";
import { CheckoutWidget, darkTheme, useActiveAccount } from "thirdweb/react";
import { client } from "../client";
import { base } from "thirdweb/chains";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../lib/firebase";

interface PlatformDepositModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (
    method: "stripe" | "crypto",
    receive: "CREDITS",
    tier?: string
  ) => void;
}

const supportedTokens = {
  [base.id]: [
    {
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      name: "USDC",
      symbol: "USDC",
    },
  ],
};

const PlatformDepositModal: React.FC<PlatformDepositModalProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  const [step, setStep] = useState<1 | 3 | 4>(1);
  const [selectedMethod, setSelectedMethod] = useState<"stripe" | "crypto" | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const account = useActiveAccount();

  const tierUsdValue: Record<string, number> = {
    starter: 10,
    pro: 50,
    elite: 250,
  };

  const tierCredits: Record<string, number> = {
    starter: 10000,
    pro: 60000,
    elite: 350000,
  };

  useEffect(() => {
    if (open) {
      setStep(1);
      setSelectedMethod(null);
      setSelectedTier(null);
    }
  }, [open]);

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

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setStep(1);
          setSelectedMethod(null);
          setSelectedTier(null);
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
            : "Checkout"}
        </h2>

        {step === 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
            {[{
              label: "Deposit with Stripe",
              description: "Use a debit or credit card to fund your platform balance. Stripe Fees Apply",
              icon: () => (
                <img src="/assets/stripelogo.png" alt="Stripe" className="w-14 h-14 object-contain" />
              ),
              onClick: () => handleMethodSelect("stripe"),
            }, {
              label: "Deposit with Crypto",
              description: "Send an altcoin from an EVM chain to fund your platform balance. Network Fees Apply",
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
                <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{label}</h3>
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
                        onSelect("stripe", "CREDITS", cryptoKey);
                        window.open(stripeUrl, "_blank");
                      } else {
                        setSelectedTier(cryptoKey);
                        setStep(4);
                      }
                    }}
                    className="bg-gradient-to-r from-purple-400 to-cyan-400 text-black hover:text-white font-medium px-3 py-1 rounded-md text-sm"
                  >
                    {label}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {step === 4 && selectedTier && (
          <div className="w-full flex justify-center">
            <CheckoutWidget
              client={client}
              chain={base}
              supportedTokens={supportedTokens}
              tokenAddress="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
              amount={tierUsdValue[selectedTier].toString()}
              seller="0x7aF53BA9c01ecB6893a4a6af87393805b1c05444"
              name={`${selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Credit Tier`}
              description={`Purchase ${selectedTier} credits`}
              paymentMethods={["crypto", "card"]}
              onSuccess={async () => {
                const uid = account?.address;
                if (!uid) return;
                const credits = tierCredits[selectedTier];
                const userDocRef = doc(db, "users", uid);
                await updateDoc(userDocRef, {
                  "balances.platform.CREDITS": increment(credits),
                });
                onSelect("crypto", "CREDITS", selectedTier);
                onClose();
              }}
              onCancel={() => setStep(3)}
              theme={darkTheme({
                colors: {
                  modalBg: "#0a0a0a",
                },
              })}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlatformDepositModal;
