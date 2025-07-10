import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import { X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface TeamSectionProps {
  walletAddress: string;
  reloadFlag: number;
}

const TeamSection: React.FC<TeamSectionProps> = ({ walletAddress, reloadFlag }) => {
  const [newMember, setNewMember] = useState("");
  const [teamProfiles, setTeamProfiles] = useState<
    { address: string; displayName: string; status: "accepted" | "pending" }[]
  >([]);
  const [activeX, setActiveX] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;
    loadTeamAndInvites();
  }, [walletAddress, reloadFlag]);

  const loadTeamAndInvites = async () => {
    const ref = doc(db, "users", walletAddress);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};
    const team: string[] = data.team || [];

    const invitesSnapshot = await getDocs(collection(db, "users", walletAddress, "sentInvites"));
    const pendingSent = invitesSnapshot.docs
      .filter((d) => d.data().status === "pending")
      .map((d) => d.data().to);

    const acceptedProfiles = await Promise.all(
      team.map(async (addr) => {
        const teammateRef = doc(db, "users", addr);
        const teammateSnap = await getDoc(teammateRef);
        const displayName = teammateSnap.exists()
          ? teammateSnap.data().displayName || addr
          : addr;
        return { address: addr, displayName, status: "accepted" as const };
      })
    );

    const pendingProfiles = await Promise.all(
      pendingSent.map(async (addr) => {
        const teammateRef = doc(db, "users", addr);
        const teammateSnap = await getDoc(teammateRef);
        const displayName = teammateSnap.exists()
          ? teammateSnap.data().displayName || addr
          : addr;
        return { address: addr, displayName, status: "pending" as const };
      })
    );

    const allProfiles = [...acceptedProfiles, ...pendingProfiles].filter(
      (profile, index, self) =>
        index === self.findIndex((p) => p.address === profile.address)
    );

    setTeamProfiles(allProfiles);
  };

  const sendInvite = async () => {
    if (!newMember || !walletAddress) return;

    const toRef = doc(db, "users", newMember);
    const toSnap = await getDoc(toRef);
    if (!toSnap.exists()) return alert("User not found.");
    if (teamProfiles.some((t) => t.address === newMember)) return;

    const inviteRef = doc(collection(db, "users", newMember, "teamInvites"));
    await setDoc(inviteRef, {
      from: walletAddress,
      to: newMember,
      status: "pending",
      createdAt: new Date(),
    });

    const sentRef = doc(collection(db, "users", walletAddress, "sentInvites"));
    await setDoc(sentRef, {
      to: newMember,
      status: "pending",
      createdAt: new Date(),
    });

    alert("Invite sent.");
    setNewMember("");
    loadTeamAndInvites();
  };

  const removeTeamMember = async (memberAddress: string) => {
    if (!window.confirm("Remove this team member?")) return;

    try {
      await updateDoc(doc(db, "users", walletAddress), { team: arrayRemove(memberAddress) });
      await updateDoc(doc(db, "users", memberAddress), { team: arrayRemove(walletAddress) });

      const sentInvitesCol = collection(db, "users", walletAddress, "sentInvites");
      const sentInvitesSnap = await getDocs(sentInvitesCol);
      const sentMatch = sentInvitesSnap.docs.find(doc => doc.data().to === memberAddress);
      if (sentMatch) await deleteDoc(sentMatch.ref);

      const teamInvitesCol = collection(db, "users", memberAddress, "teamInvites");
      const teamInvitesSnap = await getDocs(teamInvitesCol);
      const teamMatch = teamInvitesSnap.docs.find(doc => doc.data().from === walletAddress);
      if (teamMatch) await deleteDoc(teamMatch.ref);

      setTeamProfiles((prev) => prev.filter((m) => m.address !== memberAddress));
    } catch (err) {
      console.error("Failed to remove team member:", err);
    }
  };

  return (
    <div className="mt-4 text-left max-w-2xl mx-auto">
      <h2 className="text-xl mt-10 font-bold text-white mb-2">Team Members</h2>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="0xAccountNumber"
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
          className="bg-zinc-800 px-3 py-1 rounded text-sm w-full"
        />
        <button
          onClick={sendInvite}
          className="border border-white px-4 py-1 rounded text-sm hover:bg-accent hover:text-black"
        >
          Invite
        </button>
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        {teamProfiles.map((member) => {
          const svg = window.multiavatar(`${member.displayName}-${member.address}`);
          const isActive = activeX === member.address;

          return (
            <div
              key={member.address}
              className="relative text-center"
              onClick={() =>
                member.status === "accepted"
                  ? setActiveX(isActive ? null : member.address)
                  : null
              }
            >
              {/* Top corners */}
              {isActive && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTeamMember(member.address);
                    }}
                    className="absolute -top-2 -left-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition"
                    title="Remove Member"
                  >
                    <X size={12} />
                  </button>

                    <Link
                      to={`/profile/${member.displayName}`}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute -top-2 -right-2 bg-green-600 text-white hover:bg-green-700 rounded-full p-1 hover:scale-110 transition"
                      title="View Profile"
                    >

                    <ArrowRight size={12} />
                  </Link>
                </>

              )}

              {/* Avatar */}
              <div
                className="w-16 h-16 mx-auto"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
              <p className="text-xs mt-1 text-gray-400 break-all max-w-[4rem] truncate">
                {member.displayName}
              </p>
              {member.status === "pending" && (
                <p className="text-[10px] text-yellow-400 italic mt-1">Pending</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamSection;
