import { useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { initFirebaseAuth } from "../lib/firebaseAuth";

export function AuthGate() {
  const account = useActiveAccount();

  useEffect(() => {
    if (!account?.address) return;

    initFirebaseAuth()
      .then((uid) => {
        console.log("✅ Firebase signed in. UID:", uid);
      })
      .catch((err) => {
        console.error("❌ Firebase Auth error", err);
      });
  }, [account?.address]);

  return null;
}
