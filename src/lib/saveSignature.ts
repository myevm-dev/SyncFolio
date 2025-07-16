// src/lib/saveSignature.ts
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function saveSignature(walletAddress: string, dataUrl: string) {
  if (!walletAddress || !dataUrl) throw new Error("Missing wallet or dataUrl");

  const db = getFirestore();
  const ref = doc(db, `users/${walletAddress}/signatures/default`);
  await setDoc(ref, {
    image: dataUrl,
    updatedAt: serverTimestamp(),
  });
}
