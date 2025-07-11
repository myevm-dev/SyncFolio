import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export interface Agent {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  region?: string;
  rating: number;
  ratingCount: number;
}

export const loadGlobalAgents = async (): Promise<Agent[]> => {
  const snapshot = await getDocs(collection(db, "agents"));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name ?? "Unknown",
      phone: data.phone ?? "",
      email: data.email ?? "",
      region: data.region ?? "",
      rating: data.ratingTotal && data.ratingCount
        ? data.ratingTotal / data.ratingCount
        : 0,
      ratingCount: data.ratingCount ?? 0,
    };
  });
};
