import { getAuth, signInAnonymously } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function initFirebaseAuth(walletAddress?: string): Promise<string> {
  const auth = getAuth();

  // Sign in anonymously if not already signed in
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }

  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("❌ Firebase Auth: No UID found");

  // Store the wallet address inside the user's doc
  if (walletAddress) {
    await setDoc(doc(db, "users", uid), { walletAddress }, { merge: true });
  }

  return uid;
}
