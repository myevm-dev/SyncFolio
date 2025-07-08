import React from "react";

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

const BalanceCard = ({
  title,
  items,
  hideActions = false,
  walletAddress,
  showVerifyLink,
  showPofButton,
}: {
  title: string;
  items: { label: string; value: number }[];
  hideActions?: boolean;
  walletAddress?: string;
  showVerifyLink?: boolean;
  showPofButton?: boolean;
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
      {items.map((item) => (
        <div key={item.label} className="flex justify-between text-sm">
          <span className="text-gray-400">{item.label}</span>
          <span className="text-green-400 font-semibold">
            ${format(item.value)}
          </span>
        </div>
      ))}
    </div>

    {!hideActions && (
      <div className="flex gap-2 mt-auto">
        <button className="flex-1 py-1 text-sm rounded-full bg-blue-600 hover:bg-blue-700 text-white">
          Deposit
        </button>
        <button className="flex-1 py-1 text-sm rounded-full bg-red-600 hover:bg-red-700 text-white">
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
  const platformItems = [
    { label: "USD", value: balances.platform.USD },
    { label: "ꞘOLIO", value: balances.platform.FOLIO },
    { label: "Credits", value: balances.platform.CREDITS },
  ];

  const walletItems = [
    { label: "USDC", value: balances.wallet.USDC },
    { label: "ꞘOLIO", value: balances.wallet.FOLIO },
    { label: "ETH", value: balances.wallet.ETH },
  ];

  return (
    <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
      <BalanceCard
        title="Platform Balance"
        items={platformItems}
        hideActions={hideActions}
        showPofButton={true}
      />
      <BalanceCard
        title="Wallet Balance"
        items={walletItems}
        hideActions={hideActions}
        showVerifyLink={!!walletAddress}
        walletAddress={walletAddress}
      />

    </div>
  );
};

export default Balances;
