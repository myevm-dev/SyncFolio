import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { X } from "lucide-react";

interface TeamSectionProps {
  walletAddress: string;
}

const TeamSection: React.FC<TeamSectionProps> = ({ walletAddress }) => {
  const [newMember, setNewMember] = useState("");
  const [team, setTeam] = useState<string[]>([]);
  const [teamProfiles, setTeamProfiles] = useState<{
    address: string;
    displayName: string;
  }[]>([]);
  const [allNames, setAllNames] = useState<string[]>([]);
  const [activeX, setActiveX] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;
    loadTeam();
    loadAllDisplayNames();
  }, [walletAddress]);

  const loadAllDisplayNames = async () => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const names: string[] = [];
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.displayName) {
        names.push(data.displayName);
      }
    });
    setAllNames(names);
  };

  const loadTeam = async () => {
    const ref = doc(db, "users", walletAddress);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      const rawTeam: string[] = data.team || [];

      const profilePromises = rawTeam.map(async (addr) => {
        const teammateRef = doc(db, "users", addr);
        const teammateSnap = await getDoc(teammateRef);
        const teammateData = teammateSnap.exists() ? teammateSnap.data() : {};
        return {
          address: addr,
          displayName: teammateData.displayName || addr,
        };
      });

      const resolvedProfiles = await Promise.all(profilePromises);
      setTeam(rawTeam);
      setTeamProfiles(resolvedProfiles);
    }
  };

  const addTeamMember = async () => {
    if (!newMember || !walletAddress) return;
    if (team.includes(newMember)) return;
    const teammateRef = doc(db, "users", newMember);
    const teammateSnap = await getDoc(teammateRef);
    if (!teammateSnap.exists()) return;

    const teammateData = teammateSnap.data();
    const newName = teammateData.displayName;
    if (!newName || allNames.filter(name => name === newName).length > 1) {
      alert("Display name must be unique. This one is already used.");
      return;
    }

    const ref = doc(db, "users", walletAddress);
    const updatedTeam = [...team, newMember];
    await setDoc(ref, { team: updatedTeam }, { merge: true });
    setNewMember("");
    loadTeam();
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
        const updatedTeam = team.filter((addr) => addr !== memberAddress);
        await updateDoc(ref, { team: updatedTeam });
        setTeam(updatedTeam);
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
          onClick={addTeamMember}
          className="border border-white px-4 py-1 rounded text-sm hover:bg-accent hover:text-black"
        >
          Add
        </button>
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        {teamProfiles.map((member, idx) => (
          <div
            key={idx}
            className="relative text-center cursor-pointer"
            onClick={() => setActiveX(activeX === member.address ? null : member.address)}
          >
            <div
              className="w-16 h-16"
              dangerouslySetInnerHTML={{
                __html: window.multiavatar(member.displayName),
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSection;
