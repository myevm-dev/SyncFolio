// src/components/FIPSModal.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./Dialog";
import CountyDealflowTable from "./CountyDealFlowTable";
import TradeFips from "./TradeFIPS";
import { useDFBond } from "../hooks/useDFBond";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useActiveAccount } from "thirdweb/react";

interface FIPSModalProps {
  open: boolean;
  onClose: () => void;
  fipsCode: string;
  countyName: string;
}

export default function FIPSModal({ open, onClose, fipsCode, countyName }: FIPSModalProps) {
  const db = getFirestore();
  const account = useActiveAccount(); // ensure wallet is connected

  const [view, setView] = useState<"trade" | "dealflow">("trade");
  const [working, setWorking] = useState<"create" | "buy" | "">("");
  const [created, setCreated] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { createToken } = useDFBond();

  useEffect(() => {
    if (!open || !fipsCode) return;
    (async () => {
      const recRef = doc(db, "countyTokens", fipsCode);
      const snap = await getDoc(recRef);
      setCreated(snap.exists());
    })();
  }, [open, fipsCode]);

  const handleCreate = async () => {
    if (!account) {
      alert("Connect wallet first");
      return;
    }

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

  const heading =
    view === "dealflow"
      ? `${countyName} Leaderboard`
      : created
      ? `Buy Deal Flow in ${countyName}`
      : `${countyName} is not yet active`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-black text-white rounded-xl p-6 w-full max-w-[860px] mx-auto my-auto flex flex-col justify-center items-center">
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
              {t === "trade" ? "Trade" : "Flowboard"}
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
              <p className="text-sm text-gray-400">Click below to activate this county token.</p>
              <button
                onClick={handleCreate}
                disabled={working === "create" || !account}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 text-black font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {working === "create" ? "Creating…" : "Create Token"}
              </button>
            </div>
          )
        ) : (
          <CountyDealflowTable fipsCode={fipsCode} />
        )}
      </DialogContent>
    </Dialog>
  );
}
