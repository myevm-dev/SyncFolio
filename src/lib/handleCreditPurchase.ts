// lib/handleCreditPurchase.ts
import { db } from "../lib/firebase";
import { doc, increment, serverTimestamp, updateDoc, arrayUnion, setDoc } from "firebase/firestore";

export async function handleCreditPurchase(
  uid: string,
  tier: "starter" | "pro" | "elite"
) {
  const creditValues: Record<typeof tier, number> = {
    starter: 10_000,
    pro: 60_000,
    elite: 350_000,
  };

  const amount = creditValues[tier];

  const balanceRef = doc(db, `users/${uid}/balances/credits`);
  await setDoc(
    balanceRef,
    { amount: increment(amount) },
    { merge: true }
  );

  const txnRef = doc(db, `users/${uid}/transactions/${crypto.randomUUID()}`);
  await setDoc(txnRef, {
    type: "deposit",
    amount,
    currency: "credits",
    timestamp: serverTimestamp(),
    metadata: { tier },
  });
}
