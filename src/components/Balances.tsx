import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "./Dialog";
import PlatformDepositModal from "./PlatformDepositModal";
import PlatformWithdrawModal from "./PlatformWithdrawModal";
import WalletDepositModal from "./WalletDepositModal";
import WalletWithdrawModal from "./WalletWithdrawModal";
import { usePlatformCredits } from "../hooks/usePlatformCredits";

interface BalancesProps {
  balances: {
    platform: { USD: number; FOLIO: number };
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
        const isUSD = item.label === "USD";
        const isUSDC = item.label === "USDC";
        const isETH = item.label === "ETH";
        const isCredits = item.label === "Credits";
        const folioUsd = isFolio && typeof opPrice === "number"
          ? item.value * folioToOP * opPrice
          : null;

        let labelColor = "text-gray-400";
        let valueColor = "text-green-400";
        let quantityPrefix = "$";
        let quantityColor = valueColor;

        if (isUSD || isUSDC) labelColor = "text-blue-400";
        if (isETH) labelColor = "text-white";
        if (isCredits) labelColor = "text-white";
        if (isFolio) labelColor = "text-[#fd01f5]";

        if (isFolio) {
          quantityPrefix = "Ꞙ";
          quantityColor = "text-[#fd01f5]";
        } else if (isETH) {
          quantityPrefix = "Ξ";
          quantityColor = "text-white";
        } else if (isUSD || isUSDC) {
          quantityPrefix = "$";
          quantityColor = "text-blue-400";
        } else if (isCredits) {
          quantityPrefix = "";
          quantityColor = "text-white";
        }

        return (
          <div key={item.label} className="flex justify-between text-sm">
            <span className={`${labelColor} font-semibold`}>
              {isCredits ? "Credits" : item.label}
            </span>
            <span className="flex items-center gap-2">
              <span className={`${quantityColor} font-semibold`}>
                {isCredits
                  ? `${format(item.value)}`
                  : `${quantityPrefix}${format(item.value)}`}
              </span>
              {isFolio && (
                <span className="text-sm italic text-green-400">
                  (~${folioUsd != null ? format(folioUsd) : "--"})
                </span>
              )}
              {isETH && (
                <span className="text-green-400 text-sm">
                  (~${typeof opPrice === "number"
                    ? format(item.value * opPrice)
                    : "--"})
                </span>
              )}
              {(isUSD || isUSDC) && (
                <span className="text-green-400 text-sm">
                  (~${format(item.value)})
                </span>
              )}
              {isCredits && (
                <span className="text-green-400 text-sm">--</span>
              )}
            </span>
          </div>
        );
      })}
    </div>

    {!hideActions && (
      <div className="flex gap-2 mt-auto">
        <button
          onClick={onDepositClick}
          className="flex-1 py-1 text-sm rounded-full text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        >
          Deposit
        </button>
        <button
          onClick={onWithdrawClick}
          className="flex-1 py-1 text-sm rounded-full text-white bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
        >
          Withdraw
        </button>
      </div>
    )}
  </div>
);

const Balances: React.FC<BalancesProps> = ({ balances, walletAddress, hideActions = false }) => {
  const [showPlatformDeposit, setShowPlatformDeposit] = useState(false);
  const [showPlatformWithdraw, setShowPlatformWithdraw] = useState(false);
  const [showWalletDeposit, setShowWalletDeposit] = useState(false);
  const [showWalletWithdraw, setShowWalletWithdraw] = useState(false);
  const [opPrice, setOpPrice] = useState<number | null>(null);
  const credits = usePlatformCredits();

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=optimism&vs_currencies=usd")
      .then((res) => res.json())
      .then((data) => {
        const price = data?.optimism?.usd;
        if (typeof price === "number") setOpPrice(price);
      })
      .catch((err) => console.error("Error fetching OP price:", err));
  }, []);

  const platformItems = [
    { label: "USD", value: balances.platform.USD },
    { label: "ꞘOLIO", value: balances.platform.FOLIO },
    { label: "Credits", value: credits || 0 },
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
          title="Platform Balance (WEB 2)"
          items={platformItems}
          hideActions={hideActions}
          showPofButton={true}
          onDepositClick={() => setShowPlatformDeposit(true)}
          onWithdrawClick={() => setShowPlatformWithdraw(true)}
          opPrice={opPrice}
        />
        <BalanceCard
          title="Wallet Balance (WEB 3)"
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
        onSelect={() => setShowPlatformDeposit(false)}
      />

      <PlatformWithdrawModal
        open={showPlatformWithdraw}
        onClose={() => setShowPlatformWithdraw(false)}
        onSelect={() => setShowPlatformWithdraw(false)}
      />

      <WalletDepositModal
        open={showWalletDeposit}
        onClose={() => setShowWalletDeposit(false)}
        onSelect={() => setShowWalletDeposit(false)}
        walletAddress={walletAddress || ""}
      />

      <WalletWithdrawModal
        open={showWalletWithdraw}
        onClose={() => setShowWalletWithdraw(false)}
        onSelect={() => setShowWalletWithdraw(false)}
      />
    </>
  );
};

export default Balances;

