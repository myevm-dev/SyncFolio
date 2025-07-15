// src/components/FIPSModal.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./Dialog";
import DealflowTable from "./DealFlowTable";
import TradeFips from "./TradeFIPS";

import { useDFBond } from "../hooks/useDFBond";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useActiveAccount } from "thirdweb/react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

interface FIPSModalProps {
  open: boolean;
  onClose: () => void;
  fipsCode: string;
  countyName: string;
}

export default function FIPSModal({ open, onClose, fipsCode, countyName }: FIPSModalProps) {
  // Firestore setup
  const db = getFirestore();

  /* ------------- local ui state ------------- */
  const [view, setView] = useState<"trade" | "dealflow">("trade");
  const [seedWeth, setSeedWeth] = useState<string>("");
  const [allowance, setAllowance] = useState<bigint>(0n);
  const [working, setWorking] = useState<"approve" | "create" | "buy" | "">("");
  const [created, setCreated] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  /* ------------- on‑chain helpers ------------- */
  const {
    connected,
    MAX_UINT256,
    currentAllowance,
    approveWeth,
    createToken,
    buy,
  } = useDFBond();

  // check Firestore for existing token
  useEffect(() => {
    if (!open || !fipsCode) return;
    (async () => {
      const recRef = doc(db, "countyTokens", fipsCode);
      const snap = await getDoc(recRef);
      setCreated(snap.exists());
    })();
  }, [open, fipsCode]);

  // refresh allowance when modal opens or wallet changes
  useEffect(() => {
    if (open) refreshAllowance();
  }, [open, connected]);

  const refreshAllowance = async () => {
    try {
      const a = await currentAllowance();
      setAllowance(a);
    } catch {
      setAllowance(0n);
    }
  };

  const toWei = (val: string): bigint => {
    if (!val || isNaN(Number(val))) return 0n;
    const [whole, frac = ""] = val.split(".");
    return BigInt((whole + frac.padEnd(18, "0").slice(0, 18)) || "0");
  };
  const fmt = (wei: bigint) => (wei === MAX_UINT256 ? "∞" : Number(wei) / 1e18);

  /* approve WETH */
  const handleApprove = async () => {
    try {
      setWorking("approve");
      const need = toWei(seedWeth || "0.0");
      await approveWeth(need);
      await refreshAllowance();
    } catch (err) {
      console.error("WETH approval failed", err);
      alert("WETH approval failed – see console");
    } finally {
      setWorking("");
    }
  };

  /* create token on-chain + save Firestore */
  const handleCreate = async () => {
    try {
      setWorking("create");
      const receipt = await createToken(countyName, fipsCode, 1_000_000n);
      if (receipt?.transactionHash) {
        setTxHash(receipt.transactionHash);
        const recRef = doc(db, "countyTokens", fipsCode);
        await setDoc(recRef, { fipsCode, countyName, createdAt: Date.now() });
        setCreated(true);
      }
    } catch (err) {
      console.error("Token creation failed", err);
      alert("Token creation failed – see console");
    } finally {
      setWorking("");
    }
  };

  /* buy tokens on-chain */
  const handleBuy = async () => {
    try {
      setWorking("buy");
      const reserveWei = toWei(seedWeth);
      const receipt = await buy(fipsCode, reserveWei, 0n);
      if (receipt?.transactionHash) setTxHash(receipt.transactionHash);
    } catch (err) {
      console.error("Token purchase failed", err);
      alert("Token purchase failed – see console");
    } finally {
      setWorking("");
    }
  };

  /* UI logic */
  const hasAllowance = allowance === MAX_UINT256 || allowance >= toWei(seedWeth || "0");
  const heading =
    view === "dealflow"
      ? `${countyName} Leaderboard`
      : created
      ? `Buy Deal Flow in ${countyName}`
      : `${countyName} is not yet active`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-black text-white rounded-xl p-6 w-full max-w-[620px] mx-auto my-auto flex flex-col justify-center items-center">
        <DialogTitle>
          <VisuallyHidden>
            <h2 id="df-heading">{heading}</h2>
          </VisuallyHidden>
        </DialogTitle>

        <h2 className="text-2xl font-semibold mb-6 text-center">{heading}</h2>

        <div className="flex justify-center gap-6 mb-6">
          {["trade", "dealflow"].map((t) => (
            <button
              key={t}
              onClick={() => setView(t as any)}
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
          created ? (
            <div className="text-center space-y-4">
              <TradeFips fipsCode={fipsCode} countyName={countyName} />
              {txHash && (
                <a
                  href={`https://basescan.org/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-4 py-2 text-sm text-white border border-white rounded hover:bg-white hover:text-black"
                >
                  View on BaseScan
                </a>
              )}
              <p className="text-xs text-gray-500">Then you can buy more below.</p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-400">Provide WETH liquidity to create this county token.</p>
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
              <p className="text-sm text-gray-400">Current allowance: {fmt(allowance)} WETH</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleApprove}
                  disabled={working === "approve" || !seedWeth}
                  className="px-6 py-2 rounded-full bg-green-600 hover:bg-green-500 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {working === "approve" ? "Approving…" : "Approve WETH"}
                </button>
                <button
                  onClick={handleCreate}
                  disabled={working === "create" || !hasAllowance || !seedWeth}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 text-black font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {working === "create" ? "Creating…" : "Create Token"}
                </button>
              </div>
            </div>
          )
        ) : (
          <DealflowTable fipsCode={fipsCode} />
        )}
      </DialogContent>
    </Dialog>
  );
}
