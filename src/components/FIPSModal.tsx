/* src/components/FIPSModal.tsx – updated
   – Fixes DialogTitle accessibility warning using VisuallyHidden
   – Adds numeric field for initial WETH liquidity
   – Calls createAndBuy(name,symbol,cap,reserveWei)
*/

import { useState } from "react";
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

export default function FIPSModal({
  open,
  onClose,
  fipsCode,
  countyName,
}: FIPSModalProps) {
  const [view, setView] = useState<"trade" | "dealflow">("trade");
  const [deploying, setDeploy] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [seedWeth, setSeedWeth] = useState<string>("");

  const { createAndBuy } = useDFBond();

  const toWei = (val: string): bigint => {
    if (!val || isNaN(Number(val))) return 0n;
    const [whole, frac = ""] = val.split(".");
    const weiStr = whole + frac.padEnd(18, "0").slice(0, 18);
    return BigInt(weiStr || "0");
  };

  const heading =
    view === "dealflow"
      ? `${countyName} Leaderboard`
      : deployed
      ? `Buy Deal Flow in ${countyName}`
      : `${countyName} is not yet active`;

  const deployCounty = async () => {
    try {
      setDeploy(true);
      const name = countyName;
      const symbol = fipsCode;
      const cap = 1_000_000n * 10n ** 18n;
      const reserveWei = toWei(seedWeth);
      await createAndBuy(name, symbol, cap, reserveWei);
      setDeployed(true);
    } catch (err) {
      console.error("Deployment failed", err);
      alert("Token deployment failed. See console.");
    } finally {
      setDeploy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="bg-white dark:bg-black text-black dark:text-white rounded-xl p-6"
      >
        <VisuallyHidden>
          <h2 id="df-heading">{heading}</h2>
        </VisuallyHidden>
        <h2 className="text-xl font-semibold mb-4 text-center">{heading}</h2>

        <div className="flex justify-center gap-6 mb-6">
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
            <div className="text-center space-y-5">
              <p className="text-sm text-gray-400">
                Seed this county with WETH to launch its Deal‑Flow token.
              </p>
              <div className="flex justify-center gap-2 items-center">
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
              <button
                onClick={deployCounty}
                disabled={deploying || !seedWeth || Number(seedWeth) <= 0}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 text-black font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deploying ? "Deploying…" : "Deploy & Buy"}
              </button>
            </div>
          )
        ) : (
          <DealflowTable fipsCode={fipsCode} />
        )}
      </DialogContent>
    </Dialog>
  );
}
