// src/components/FIPSModal.tsx – two‑step WETH approve ➜ deploy (handles ∞ allowance)
// -------------------------------------------------------------------------------------------------
// * Detects existing allowance
// * Shows an “Approve WETH” button when needed
// * Lets the user seed with any amount (defaults to 0.1 WETH)
// * Once allowance ≥ reserveAmount the “Deploy & Buy” button is enabled
// * Gracefully handles “infinite” allowance so the UI doesn’t throw a RangeError
// * Content box is horizontally centered via mx-auto + flex utilities
// -------------------------------------------------------------------------------------------------

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent } from "./Dialog";
import DealflowTable from "./DealFlowTable";
import TradeFIPS from "./TradeFIPS";
import { useDFBond } from "../hooks/useDFBond";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface FIPSModalProps {
  open: boolean;
  onClose: () => void;
  fipsCode: string;
  countyName: string;
}

/** helper – human‑readable (protect against bigints > JS safe range) */
const formatEth = (wei: bigint) => {
  // treat any allowance ≥ ~1e30 wei (~1e12 ETH) as infinite for UI
  const INF_THRESHOLD = 10n ** 30n;
  if (wei >= INF_THRESHOLD) return "∞";
  return (Number(wei) / 1e18).toLocaleString(undefined, {
    maximumFractionDigits: 5,
  });
};

export default function FIPSModal({
  open,
  onClose,
  fipsCode,
  countyName,
}: FIPSModalProps) {
  const [view, setView] = useState<"trade" | "dealflow">("trade");
  const [seedWeth, setSeedWeth] = useState<string>("0.1");
  const [deploying, setDeploy] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [approving, setApproving] = useState(false);
  const [allowance, setAllowance] = useState<bigint>(0n);

  /* ───────────────── thirdweb hook ───────────────── */
  const {
    connected,
    approveWeth,
    currentAllowance,
    MAX_UINT256,
    createAndBuy,
  } = useDFBond();

  /* ───────────────── wei helpers ─────────────────── */
  const toWei = (val: string): bigint => {
    if (!val || isNaN(Number(val))) return 0n;
    const [whole, frac = ""] = val.split(".");
    const weiStr = whole + frac.padEnd(18, "0").slice(0, 18);
    return BigInt(weiStr || "0");
  };

  const reserveWei = useMemo(() => toWei(seedWeth), [seedWeth]);
  const hasAllowance = allowance >= reserveWei && reserveWei > 0n;

  /* ───────────────── effects ──────────────────────── */
  useEffect(() => {
    if (!open || !connected) return;
    (async () => {
      const a = await currentAllowance();
      setAllowance(a);
    })();
  }, [open, connected, currentAllowance]);

  /* ───────────────── actions ──────────────────────── */
  const handleApprove = async () => {
    try {
      setApproving(true);
      await approveWeth(MAX_UINT256); // approve once, good forever
      const fresh = await currentAllowance();
      setAllowance(fresh);
    } catch (err) {
      console.error("Approve failed", err);
      alert("WETH approval failed – see console");
    } finally {
      setApproving(false);
    }
  };

  const handleDeploy = async () => {
    try {
      setDeploy(true);
      const cap = 1_000_000n * 10n ** 18n; // 1M tokens (18 dec)
      await createAndBuy(countyName, fipsCode, cap, reserveWei);
      setDeployed(true);
    } catch (err) {
      console.error("Deployment failed", err);
      alert("Token deployment failed – see console");
    } finally {
      setDeploy(false);
    }
  };

  /* ───────────────── render ───────────────────────── */
  const heading =
    view === "dealflow"
      ? `${countyName} Leaderboard`
      : deployed
      ? `Buy Deal Flow in ${countyName}`
      : `${countyName} is not yet active`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-lg mx-auto flex flex-col items-center bg-white dark:bg-black text-black dark:text-white rounded-xl p-6">
        <VisuallyHidden>
          <h2 id="df-heading">{heading}</h2>
        </VisuallyHidden>
        <h2 className="text-xl font-semibold mb-4 text-center">{heading}</h2>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-6 w-full">
          {( ["trade", "dealflow"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setView(t)}
              className={`w-32 py-2 rounded-full transition font-medium text-center ${
                view === t
                  ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-black shadow-md"
                  : "bg-transparent border border-zinc-600 text-white"
              }`}
            >
              {t === "trade" ? "Trade" : "Deal Flow"}
            </button>
          ))}
        </div>

        {view === "trade" ? (
          deployed ? (
            <TradeFIPS fipsCode={fipsCode} countyName={countyName} />
          ) : (
            <div className="text-center space-y-5 w-full flex flex-col items-center">
              <p className="text-sm text-gray-400">
                Provide WETH liquidity to launch this county.
              </p>
              <div className="flex justify-center w-full gap-2 items-center">
                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  placeholder="WETH to seed"
                  value={seedWeth}
                  onChange={(e) => setSeedWeth(e.target.value)}
                  className="w-40 px-3 py-2 rounded bg-zinc-800 text-white text-sm text-center border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-300">WETH</span>
              </div>
              {/* Allowance status */}
              <p className="text-xs text-gray-500">
                Current allowance: {formatEth(allowance)} WETH
              </p>

              {!hasAllowance ? (
                <button
                  onClick={handleApprove}
                  disabled={approving || reserveWei === 0n || !connected}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-green-400 to-teal-400 text-black font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {approving ? "Approving…" : "Approve WETH"}
                </button>
              ) : (
                <button
                  onClick={handleDeploy}
                  disabled={deploying}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 text-black font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {deploying ? "Deploying…" : "Deploy & Buy"}
                </button>
              )}

              <p className="text-xs text-gray-500">
                You’ll sign {hasAllowance ? 1 : 2} transaction
                {hasAllowance ? "" : "s"}.
              </p>
            </div>
          )
        ) : (
          <DealflowTable fipsCode={fipsCode} />
        )}
      </DialogContent>
    </Dialog>
  );
}
