// src/components/Balances.tsx
import React, { useEffect, useState } from "react";
import PlatformDepositModal from "./PlatformDepositModal";
import PlatformWithdrawModal from "./PlatformWithdrawModal";
import WalletDepositModal from "./WalletDepositModal";
import WalletWithdrawModal from "./WalletWithdrawModal";
import { usePlatformCredits } from "../hooks/usePlatformCredits";
import { useWalletBalances } from "../hooks/useWalletBalances";
import { ethers } from "ethers";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const BASE_RPC = import.meta.env.VITE_BASE_RPC || "https://mainnet.base.org";
const BASE_USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const USDC_DECIMALS = 6;

const smartFormat = (val: number, force = 2) => {
  const tiny = val !== 0 && val < 0.01;
  return val.toLocaleString(undefined, {
    minimumFractionDigits: tiny ? 6 : force,
    maximumFractionDigits: tiny ? 6 : force,
  });
};
const folioToOP = 0.02;

interface BalanceCardProps {
  title: string;
  items: { label: string; value: number }[];
  hideActions?: boolean;
  walletAddress?: string;
  showVerifyLink?: boolean;
  showPofButton?: boolean;
  onDepositClick?: () => void;
  onWithdrawClick?: () => void;
  opPrice?: number | null;
  ethPrice?: number | null;
  showPayButton?: boolean;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  title,
  items,
  hideActions = false,
  walletAddress,
  showVerifyLink,
  showPofButton,
  onDepositClick,
  onWithdrawClick,
  opPrice,
  ethPrice,
  showPayButton = false,
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

        const folioUsd =
          isFolio && typeof opPrice === "number"
            ? item.value * folioToOP * opPrice
            : null;

        const ethUsd =
          isETH && typeof ethPrice === "number"
            ? item.value * ethPrice
            : null;

        let labelColor = "text-gray-400";
        let quantityColor = "text-green-400";
        let prefix = "$";

        if (isUSD || isUSDC) {
          labelColor = "text-blue-400";
          quantityColor = "text-blue-400";
        }
        if (isETH) {
          labelColor = "text-white";
          quantityColor = "text-white";
          prefix = "Ξ";
        }
        if (isFolio) {
          labelColor = "text-[#fd01f5]";
          quantityColor = "text-[#fd01f5]";
          prefix = "Ꞙ";
        }
        if (isCredits) {
          labelColor = "text-white";
          quantityColor = "text-white";
          prefix = "";
        }

        const formatted = smartFormat(item.value);

        return (
          <div key={item.label} className="flex justify-between text-sm">
            <span className={`${labelColor} font-semibold`}>{item.label}</span>
            <span className="flex items-center gap-2">
              <span className={`${quantityColor} font-semibold`}>
                {isCredits ? formatted : `${prefix}${formatted}`}
              </span>
              {isFolio && (
                <span className="text-green-400 text-sm italic">
                  (~${folioUsd != null ? smartFormat(folioUsd) : "--"})
                </span>
              )}
              {isETH && (
                <span className="text-green-400 text-sm">
                  (~${ethUsd != null ? smartFormat(ethUsd) : "--"})
                </span>
              )}
              {(isUSD || isUSDC) && (
                <span className="text-green-400 text-sm">
                  (~${smartFormat(item.value)})
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
    {!hideActions ? (
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
    ) : showPayButton ? (

      <div className="flex mt-auto">
        <button
          onClick={() => alert("TODO: Payment modal")}
          className="flex-1 py-1 text-sm rounded-full text-black font-semibold bg-gradient-to-r from-[#fed7aa] to-[#fdba74] hover:from-[#fdba74] hover:to-[#fb923c]"
        >
          Pay
        </button>
      </div>



    ) : null}
  </div>
);


interface BalancesProps {
  balances: {
    platform: { USD: number; FOLIO: number; CREDITS?: number };
    wallet: { USDC: number; FOLIO: number; ETH: number };
  };
  walletAddress?: string;
  hideActions?: boolean;
  remote?: boolean;
  showPayButton?: boolean;
}

const Balances: React.FC<BalancesProps> = ({
  balances,
  walletAddress,
  hideActions = false,
  remote = false,
  showPayButton = false,
}) => {
  const creditsHook = usePlatformCredits();
  const { eth: ethHook, usdc: usdcHook } = useWalletBalances();

  const [remoteEth, setRemoteEth] = useState<number>(0);
  const [remoteUsdc, setRemoteUsdc] = useState<number>(0);
  const [remoteCredits, setRemoteCredits] = useState<number>(0);
  const [opPrice, setOpPrice] = useState<number | null>(null);
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [modal, setModal] = useState<null | "platformDeposit" | "platformWithdraw" | "walletDeposit" | "walletWithdraw">(
    null
  );

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=optimism,ethereum&vs_currencies=usd")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d?.optimism?.usd === "number") setOpPrice(d.optimism.usd);
        if (typeof d?.ethereum?.usd === "number") setEthPrice(d.ethereum.usd);
      })
      .catch((e) => console.error("Price fetch failed:", e));
  }, []);

  useEffect(() => {
    if (!remote || !walletAddress) return;
    (async () => {
      try {
        const provider = new ethers.JsonRpcProvider(BASE_RPC);
        const bal = await provider.getBalance(walletAddress);
        setRemoteEth(Number(ethers.formatEther(bal)));

        const erc20 = new ethers.Contract(BASE_USDC, ["function balanceOf(address) view returns (uint256)"], provider);
        const usdc = await erc20.balanceOf(walletAddress);
        setRemoteUsdc(Number(ethers.formatUnits(usdc, USDC_DECIMALS)));

        const snap = await getDoc(doc(db, "users", walletAddress));
        if (snap.exists()) {
          const d = snap.data();
          let credits = 0;
          if (typeof d.credits === "number") credits = d.credits;
          else if (typeof d.platformCREDITS === "number") credits = d.platformCREDITS;
          setRemoteCredits(credits);
        }
      } catch (err) {
        console.error("🔥 Remote data fetch failed:", err);
      }
    })();
  }, [remote, walletAddress]);

  const creditsVal = remote ? remoteCredits : Number(creditsHook ?? 0);
  const usdcVal = remote ? remoteUsdc : Number(usdcHook ?? 0);
  const ethVal = remote ? remoteEth : Number(ethHook ?? 0);

  const platformItems = [
    { label: "USD", value: balances.platform.USD },
    { label: "ꞘOLIO", value: 100_000 },
    { label: "Credits", value: creditsVal },
  ];

  const walletItems = [
    { label: "USDC", value: usdcVal },
    { label: "ꞘOLIO", value: balances.wallet.FOLIO },
    { label: "ETH", value: ethVal },
  ];

  return (
    <>
      <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <BalanceCard
          title="Platform Balance (WEB 2)"
          items={platformItems}
          hideActions={hideActions}
          showPofButton
          onDepositClick={() => setModal("platformDeposit")}
          onWithdrawClick={() => setModal("platformWithdraw")}
          opPrice={opPrice}
          showPayButton={showPayButton}
        />

        <BalanceCard
          title="Wallet Balance (WEB 3)"
          items={walletItems}
          hideActions={hideActions}
          showVerifyLink={!!walletAddress}
          walletAddress={walletAddress}
          onDepositClick={() => setModal("walletDeposit")}
          onWithdrawClick={() => setModal("walletWithdraw")}
          opPrice={opPrice}
          ethPrice={ethPrice}
          showPayButton={showPayButton}
        />

      </div>
      {!remote && (
        <>
          <PlatformDepositModal open={modal === "platformDeposit"} onClose={() => setModal(null)} onSelect={() => setModal(null)} />
          <PlatformWithdrawModal open={modal === "platformWithdraw"} onClose={() => setModal(null)} onSelect={() => setModal(null)} />
          <WalletDepositModal open={modal === "walletDeposit"} onClose={() => setModal(null)} onSelect={() => setModal(null)} walletAddress={walletAddress || ""} />
          <WalletWithdrawModal open={modal === "walletWithdraw"} onClose={() => setModal(null)} onSelect={() => setModal(null)} />
        </>
      )}
    </>
  );
};

export default Balances;
