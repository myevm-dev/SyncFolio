import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";

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
          <div key={idx} className="text-center">
            <div
              className="w-16 h-16"
              dangerouslySetInnerHTML={{
                __html: window.multiavatar(member.displayName),
              }}
            />
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
