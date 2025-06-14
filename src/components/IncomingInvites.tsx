import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../lib/firebase";

declare global {
  interface Window {
    multiavatar: (seed: string) => string;
  }
}

interface Props {
  walletAddress: string;
  onUpdateTeam: () => void;
}

export default function IncomingInvites({ walletAddress, onUpdateTeam }: Props) {
  const [invites, setInvites] = useState<
    { id: string; from: string; displayName: string }[]
  >([]);

  useEffect(() => {
    const loadInvites = async () => {
      if (!walletAddress) return;

      const snapshot = await getDocs(
        collection(db, "users", walletAddress, "teamInvites")
      );

      const pending = snapshot.docs
        .filter((doc) => doc.data().status === "pending")
        .map((doc) => ({ id: doc.id, ...doc.data() }));

      const enriched = await Promise.all(
        pending.map(async (invite) => {
          const fromRef = doc(db, "users", invite.from);
          const fromSnap = await getDoc(fromRef);
          const displayName = fromSnap.exists()
            ? fromSnap.data().displayName || invite.from
            : invite.from;

          return {
            id: invite.id,
            from: invite.from,
            displayName,
          };
        })
      );

      setInvites(enriched);
    };

    loadInvites();
  }, [walletAddress]);

  const updateStatus = async (
    inviteId: string,
    from: string,
    status: "accepted" | "rejected" | "hidden"
  ) => {
    const ref = doc(db, "users", walletAddress, "teamInvites", inviteId);
    await updateDoc(ref, { status });

    if (status === "accepted") {
      const myRef = doc(db, "users", walletAddress);
      const theirRef = doc(db, "users", from);
      await updateDoc(myRef, { team: arrayUnion(from) });
      await updateDoc(theirRef, { team: arrayUnion(walletAddress) });

      // ✅ Update the inviter's sentInvites record to reflect acceptance
      const sentRefSnapshot = await getDocs(collection(db, "users", from, "sentInvites"));
      const match = sentRefSnapshot.docs.find(
        (doc) => doc.data().to?.toLowerCase() === walletAddress.toLowerCase()
      );
      if (match) {
        await updateDoc(doc(db, "users", from, "sentInvites", match.id), {
          status: "accepted",
        });
      }

      onUpdateTeam();
    }

    setInvites((prev) => prev.filter((i) => i.id !== inviteId));
  };

  if (!invites.length) return null;

  return (
    <div className="mt-8 max-w-2xl mx-auto text-white">
      <h3 className="text-lg font-bold mb-2">Team Invites</h3>
      {invites.map((invite) => (
        <div
          key={invite.id}
          className="bg-zinc-800 rounded p-3 mb-3 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12"
              dangerouslySetInnerHTML={{
                __html: window.multiavatar(`${invite.displayName}-${invite.from}`),
              }}
            />
            <div>
              <p className="text-sm">Invite from:</p>
              <p className="font-semibold text-accent">{invite.displayName}</p>
              <p className="text-xs text-gray-400 break-all">{invite.from}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => updateStatus(invite.id, invite.from, "accepted")}
              className="bg-green-600 px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              Accept
            </button>
            <button
              onClick={() => updateStatus(invite.id, invite.from, "rejected")}
              className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Reject
            </button>
            <button
              onClick={() => updateStatus(invite.id, invite.from, "hidden")}
              className="bg-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-700"
            >
              Hide
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
