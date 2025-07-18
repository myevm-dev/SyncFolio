import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

interface Props {
  walletAddress: string;
  onUpdateTeam: () => void;
}

interface Invite {
  id: string;
  from: string;
  status: string;
}

export default function InvitesSection({ walletAddress, onUpdateTeam }: Props) {
  const [invites, setInvites] = useState<Invite[]>([]);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchInvites = async () => {
      const snapshot = await getDocs(
        collection(db, "users", walletAddress, "teamInvites")
      );
      const pending: Invite[] = snapshot.docs
        .map((doc) => ({ id: doc.id, ...(doc.data() as { from: string; status: string }) }))
        .filter((invite) => invite.status === "pending");

      setInvites(pending);
    };

    fetchInvites();
  }, [walletAddress]);

  const respond = async (inviteId: string, from: string, accept: boolean) => {
    const ref = doc(db, "users", walletAddress, "teamInvites", inviteId);
    await updateDoc(ref, { status: accept ? "accepted" : "rejected" });

    if (accept) {
      const myRef = doc(db, "users", walletAddress);
      const theirRef = doc(db, "users", from);

      await updateDoc(myRef, { team: arrayUnion(from) });
      await updateDoc(theirRef, { team: arrayUnion(walletAddress) });

      // ✅ Update their sentInvites entry if found
      const sentSnapshot = await getDocs(collection(db, "users", from, "sentInvites"));
      const match = sentSnapshot.docs.find(
        (doc) => (doc.data() as any).to?.toLowerCase() === walletAddress.toLowerCase()
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

  return (
    <div className="mt-6 text-left max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-white mb-2">Team Invites</h3>
      {invites.length === 0 ? (
        <p className="text-gray-500">No pending invites</p>
      ) : (
        invites.map((invite) => (
          <div
            key={invite.id}
            className="bg-zinc-800 p-3 rounded mb-2 flex justify-between items-center"
          >
            <p className="text-white text-sm break-all">{invite.from}</p>
            <div className="flex gap-2">
              <button
                onClick={() => respond(invite.id, invite.from, true)}
                className="text-green-500 text-sm"
              >
                Accept
              </button>
              <button
                onClick={() => respond(invite.id, invite.from, false)}
                className="text-red-500 text-sm"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
