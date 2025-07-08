import React, { useEffect, useState } from "react";
import PlatformDepositModal from "./PlatformDepositModal";
import PlatformWithdrawModal from "./PlatformWithdrawModal";
import WalletDepositModal from "./WalletDepositModal";
import WalletWithdrawModal from "./WalletWithdrawModal";

interface BalancesProps {
  balances: {
    platform: { USD: number; FOLIO: number; CREDITS: number };
    wallet: { USDC: number; FOLIO: number; ETH: number };
  };
  walletAddress?: string;
  hideActions?: boolean;
}

const format = (value: number) =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const folioToOP = 0.02;

const BalanceCard = ({
  title,
  items,
  hideActions = false,
  walletAddress,
  showVerifyLink,
  showPofButton,
  onDepositClick,
  onWithdrawClick,
  opPrice,
}: {
  title: string;
  items: { label: string; value: number }[];
  hideActions?: boolean;
  walletAddress?: string;
  showVerifyLink?: boolean;
  showPofButton?: boolean;
  onDepositClick?: () => void;
  onWithdrawClick?: () => void;
  opPrice?: number | null;
}) => (
  <div className="bg-black border border-neutral-700 rounded-xl p-6 shadow-md flex flex-col justify-between text-left min-w-[300px]">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-white font-semibold text-lg">{title}</h3>
      {showVerifyLink && walletAddress && (
        <a
          href={`https://basescan.org/address/${walletAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 text-xs hover:underline"
        >
          Verify
        </a>
      )}
      {showPofButton && (
        <button
          disabled
          className="text-xs text-white bg-zinc-700 px-3 py-1 rounded-full cursor-not-allowed opacity-60"
        >
          Get POF
        </button>
      )}
    </div>

    <div className="space-y-2 mb-4">
      {items.map((item) => {
        const isFolio = item.label.includes("ꞘOLIO");
        const folioUsd = isFolio && opPrice ? item.value * folioToOP * opPrice : null;

        return (
          <div key={item.label} className="flex justify-between text-sm">
            {item.label === "ꞘOLIO" ? (
              <>
                <span className="text-[#fd01f5] font-semibold">ꞘOLIO</span>
                <span className="text-[#fd01f5] font-semibold">
                  Ꞙ{format(item.value)}
                  {folioUsd !== null && (
                    <span className="text-sm italic text-green-400 ml-2">
                      (~${format(folioUsd)})
                    </span>
                  )}
                </span>
              </>
            ) : (
              <>
                <span className="text-gray-400">{item.label}</span>
                <span className="text-green-400 font-semibold">${format(item.value)}</span>
              </>
            )}
          </div>
        );
      })}
    </div>

    {!hideActions && (
      <div className="flex gap-2 mt-auto">
        <button
          onClick={onDepositClick}
          className="flex-1 py-1 text-sm rounded-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Deposit
        </button>
        <button
          onClick={onWithdrawClick}
          className="flex-1 py-1 text-sm rounded-full bg-red-600 hover:bg-red-700 text-white"
        >
          Withdraw
        </button>
      </div>
    )}
  </div>
);

const Balances: React.FC<BalancesProps> = ({
  balances,
  walletAddress,
  hideActions = false,
}) => {
  const [showPlatformDeposit, setShowPlatformDeposit] = useState(false);
  const [showPlatformWithdraw, setShowPlatformWithdraw] = useState(false);
  const [showWalletDeposit, setShowWalletDeposit] = useState(false);
  const [showWalletWithdraw, setShowWalletWithdraw] = useState(false);
  const [opPrice, setOpPrice] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=optimism&vs_currencies=usd")
      .then((res) => res.json())
      .then((data) => {
        const price = data?.optimism?.usd;
        if (price) setOpPrice(price);
      })
      .catch((err) => console.error("Error fetching OP price:", err));
  }, []);

  const platformItems = [
    { label: "USD", value: balances.platform.USD },
    { label: "ꞘOLIO", value: 150000 }, // static vesting amount
    { label: "Credits", value: balances.platform.CREDITS },
  ];

  const walletItems = [
    { label: "USDC", value: balances.wallet.USDC },
    { label: "ꞘOLIO", value: balances.wallet.FOLIO },
    { label: "ETH", value: balances.wallet.ETH },
  ];

  return (
    <>
      <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <BalanceCard
          title="Platform Balance"
          items={platformItems}
          hideActions={hideActions}
          showPofButton={true}
          onDepositClick={() => setShowPlatformDeposit(true)}
          onWithdrawClick={() => setShowPlatformWithdraw(true)}
          opPrice={opPrice}
        />
        <BalanceCard
          title="Wallet Balance"
          items={walletItems}
          hideActions={hideActions}
          showVerifyLink={!!walletAddress}
          walletAddress={walletAddress}
          onDepositClick={() => setShowWalletDeposit(true)}
          onWithdrawClick={() => setShowWalletWithdraw(true)}
          opPrice={opPrice}
        />
      </div>

      <PlatformDepositModal
        open={showPlatformDeposit}
        onClose={() => setShowPlatformDeposit(false)}
        onSelect={(method) => {
          console.log("Platform deposit method:", method);
          setShowPlatformDeposit(false);
        }}
      />

      <PlatformWithdrawModal
        open={showPlatformWithdraw}
        onClose={() => setShowPlatformWithdraw(false)}
        onSelect={(method) => {
          console.log("Platform withdraw method:", method);
          setShowPlatformWithdraw(false);
        }}
      />

      <WalletDepositModal
        open={showWalletDeposit}
        onClose={() => setShowWalletDeposit(false)}
        onSelect={(method) => {
          console.log("Wallet deposit method:", method);
          setShowWalletDeposit(false);
        }}
      />

      <WalletWithdrawModal
        open={showWalletWithdraw}
        onClose={() => setShowWalletWithdraw(false)}
        onSelect={(method) => {
          console.log("Wallet withdrawal method:", method);
          setShowWalletWithdraw(false);
        }}
      />
    </>
  );
};

export default Balances;
