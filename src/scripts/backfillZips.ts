import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export async function backfillAgentZips(walletAddress: string) {
  const agentsRef = collection(db, `users/${walletAddress}/agents`);
    const snapshot = await getDocs(agentsRef);

      for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
              const address = data?.lastRatedAddress || data?.address;
                  const zip = address?.match(/\b\d{5}\b/)?.[0];

                      console.log(`Agent: ${data.name}, ZIP found: ${zip}`);

                          if (zip) {
                                await updateDoc(doc(db, `users/${walletAddress}/agents`, docSnap.id), {
                                        zip,
                                              });
                                                    console.log(`✅ Updated ${docSnap.id} with ZIP ${zip}`);
                                                        } else {
                                                              console.log(`❌ No ZIP found for ${docSnap.id}`);
                                                                  }
                                                                    }
                                                                    }
                                                                    