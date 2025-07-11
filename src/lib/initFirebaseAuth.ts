// src/lib/firebaseAuth.ts
import { signInAnonymously } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function initFirebaseAuth(walletAddress?: string): Promise<string> {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }

  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("❌ Firebase Auth: No UID found");

  if (walletAddress) {
    await setDoc(doc(db, "users", uid), { walletAddress }, { merge: true });
  }

  return uid;
}
