import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useActiveAccount } from "thirdweb/react";

export const usePlatformCredits = () => {
  const [credits, setCredits] = useState<number>(0);
  const account = useActiveAccount();

  useEffect(() => {
    const fetchCredits = async () => {
      if (!account?.address) return;
      const userDoc = await getDoc(doc(db, "users", account.address));
      const data = userDoc.data();
      const creditValue = data?.balances?.platform?.CREDITS || 0;
      setCredits(creditValue);
    };

    fetchCredits();
  }, [account?.address]);

  return credits;
};
