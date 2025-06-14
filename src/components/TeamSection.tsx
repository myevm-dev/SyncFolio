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
} from "firebase/firestore";
import { X } from "lucide-react";

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

    // ✅ Only keep sent invites still pending
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

    // ✅ Prevent duplicates if same address ends up in both lists
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
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50";

    modal.innerHTML = `
      <div class='bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl max-w-sm w-full text-center'>
        <h2 class='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>Confirm Removal</h2>
        <p class='text-sm text-gray-700 dark:text-gray-300 mb-6'>Are you sure you want to remove this team member?</p>
        <div class='flex justify-center gap-4'>
          <button id='confirmYes' class='px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700'>Yes</button>
          <button id='confirmNo' class='px-4 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'>Cancel</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector("#confirmYes")?.addEventListener("click", async () => {
      try {
        const ref = doc(db, "users", walletAddress);
        await updateDoc(ref, { team: arrayRemove(memberAddress) });

        const theirRef = doc(db, "users", memberAddress);
        await updateDoc(theirRef, { team: arrayRemove(walletAddress) });

        setTeamProfiles((prev) => prev.filter((m) => m.address !== memberAddress));
      } catch (err) {
        console.error("Failed to remove team member:", err);
      } finally {
        modal.remove();
      }
    });

    modal.querySelector("#confirmNo")?.addEventListener("click", () => {
      modal.remove();
    });
  };

  return (
    <div className="mt-10 text-left max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-white mb-2">Team Members</h2>
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
        {teamProfiles.map((member, idx) => (
          <div
            key={idx}
            className="relative text-center cursor-pointer"
            onClick={() =>
              member.status === "accepted"
                ? setActiveX(activeX === member.address ? null : member.address)
                : null
            }
          >
            <div
              className="w-16 h-16"
              dangerouslySetInnerHTML={{
                __html: window.multiavatar(`${member.displayName}-${member.address}`),
              }}
            />
            {activeX === member.address && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeTeamMember(member.address);
                }}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                title="Remove"
              >
                <X size={12} />
              </button>
            )}
            <p className="text-xs mt-1 text-gray-400 break-all max-w-[4rem] truncate">
              {member.displayName}
            </p>
            {member.status === "pending" && (
              <p className="text-[10px] text-yellow-400 italic mt-1">Pending</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSection;
