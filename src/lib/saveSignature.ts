// ✅ FILE: src/lib/saveSignature.ts
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "./firebase"; // ensure this path is correct

export async function saveSignature(walletAddress: string, dataUrl: string) {
  const sigRef = ref(storage, `signatures/${walletAddress}.png`);
  await uploadString(sigRef, dataUrl, "data_url");
  const downloadURL = await getDownloadURL(sigRef);

  await setDoc(
    doc(db, "signatures", walletAddress),
    {
      walletAddress,
      signatureURL: downloadURL,
      signedAt: serverTimestamp(),
    },
    { merge: true } // ✅ prevents overwriting existing data
  );
}
