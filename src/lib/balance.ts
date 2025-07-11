// src/lib/balance.ts
import { doc, setDoc, updateDoc, increment, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

interface UpdateBalanceProps {
  uid: string;
  currency: "usd" | "folio" | "credits";
  amount: number;
  type: "deposit" | "withdrawal" | "transfer";
  metadata?: Record<string, any>;
}

export async function updateBalanceAndLogTransaction({
  uid,
  currency,
  amount,
  type,
  metadata = {}
}: UpdateBalanceProps) {
  const balanceRef = doc(db, "users", uid, "balances", currency);
  const txnRef = collection(db, "users", uid, "transactions");

  // Create or update balance
  await setDoc(balanceRef, { amount: 0 }, { merge: true }); // create if not exists
  await updateDoc(balanceRef, {
    amount: increment(type === "withdrawal" ? -amount : amount)
  });

  // Log transaction
  await addDoc(txnRef, {
    type,
    amount,
    currency,
    timestamp: serverTimestamp(),
    metadata
  });
}
