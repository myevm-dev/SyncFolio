// src/components/FIPSModal.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "./Dialog";
import DealflowTable from "./DealFlowTable";
import TradeFIPS from "./TradeFIPS";
import { useDFBond } from "../hooks/useDFBond";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface FIPSModalProps {
  open: boolean;
  onClose: () => void;
  fipsCode: string;   // symbol of the county token
  countyName: string; // pretty label
}

/**
 * Modal that lets the user seed a county with WETH — or trade the token
 * once it is live.  We deliberately separate the *allowance* step from the
 * *launch/buy* step so the UX is crystal‑clear.
 */
export default function FIPSModal({
  open,
  onClose,
  fipsCode,
  countyName,
}: FIPSModalProps) {
  /* ------------- local ui state ------------- */
  const [view, setView] = useState<"trade" | "dealflow">("trade");
  const [seedWeth, setSeedWeth] = useState<string>("");           // user input
  const [allowance, setAllowance] = useState<bigint>(0n);          // fetched
  const [working, setWorking] = useState<"approve" | "deploy" | "">("");
  const [deployed, setDeployed] = useState(false);

  /* ------------- on‑chain helpers ------------- */
  const {
    connected,
    MAX_UINT256,
    currentAllowance,
    approveWeth,
    launchOrBuy,
  } = useDFBond();

  /* fetch allowance every time modal opens or tx completes */
  const refreshAllowance = async () => {
    try {
      const a = await currentAllowance();
      setAllowance(a);
    } catch {
      setAllowance(0n); // silent fail (wallet may not be connected yet)
    }
  };

  useEffect(() => {
    if (open) refreshAllowance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, connected]);

  /* bigint helpers ---------------------------------------------------------------- */
  const toWei = (val: string): bigint => {
    if (!val || isNaN(Number(val))) return 0n;
    const [whole, frac = ""] = val.split(".");
    return BigInt((whole + frac.padEnd(18, "0").slice(0, 18)) || "0");
  };
  const fmt = (wei: bigint) => (wei === MAX_UINT256 ? "∞" : Number(wei) / 1e18);

  /* approve step ------------------------------------------------------------------- */
  const handleApprove = async () => {
    try {
      setWorking("approve");
      const need = toWei(seedWeth || "0.0");
      await approveWeth(need);
      await refreshAllowance();
    } catch (err) {
      console.error("WETH approval failed", err);
      alert("WETH approval failed – see console");
    } finally {
      setWorking("");
    }
  };

  /* deploy+buy step ---------------------------------------------------------------- */
  const handleDeploy = async () => {
    try {
      setWorking("deploy");
      const reserveWei = toWei(seedWeth);
      await launchOrBuy(countyName, fipsCode, reserveWei);
      setDeployed(true);
    } catch (err) {
      console.error("Token deployment failed", err);
      alert("Token deployment failed – see console");
    } finally {
      setWorking("");
    }
  };

  /* dynamic ui bits --------------------------------------------------------------- */
  const hasAllowance = allowance === MAX_UINT256 || allowance >= toWei(seedWeth || "0");

  const heading =
    view === "dealflow"
      ? `${countyName} Leaderboard`
      : deployed
      ? `Buy Deal Flow in ${countyName}`
      : `${countyName} is not yet active`;

  /* -------------------------------------------------------------------------------- */
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-black text-white rounded-xl p-6 max-w-md w-[90vw]">
        <VisuallyHidden>
          <h2 id="df-heading">{heading}</h2>
        </VisuallyHidden>
        <h2 className="text-2xl font-semibold mb-6 text-center">{heading}</h2>

        {/* switcher */}
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

        {/* main body */}
        {view === "trade" ? (
          deployed ? (
            <TradeFIPS fipsCode={fipsCode} countyName={countyName} />
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-400">
                Provide WETH liquidity to launch this county.
              </p>

              {/* input */}
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

              {/* allowance readout */}
              <p className="text-sm text-gray-400">
                Current allowance: {fmt(allowance)} WETH
              </p>

              {/* action button */}
              {hasAllowance ? (
                <button
                  onClick={handleDeploy}
                  disabled={working === "deploy" || !seedWeth}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 text-black font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {working === "deploy" ? "Deploying…" : "Deploy & Buy"}
                </button>
              ) : (
                <button
                  onClick={handleApprove}
                  disabled={working === "approve" || !seedWeth}
                  className="px-6 py-2 rounded-full bg-green-600 hover:bg-green-500 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {working === "approve" ? "Approving…" : "Approve WETH"}
                </button>
              )}

              <p className="text-xs text-gray-500">
                You’ll sign {hasAllowance ? 1 : 2} transaction{hasAllowance ? "" : "s"}.
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
