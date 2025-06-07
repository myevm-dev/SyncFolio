import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import multiavatar from "@multiavatar/multiavatar";

export default function ProfilePage() {
  const account = useActiveAccount();
  const walletAddress = account?.address || "";

  const [displayName, setDisplayName] = useState("User");
  const [inputName, setInputName] = useState("User");
  const [isEditing, setIsEditing] = useState(false);
  const [avatarSvg, setAvatarSvg] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!walletAddress) return;
      const docRef = doc(db, "users", walletAddress);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const name = docSnap.data().displayName || "User";
        setDisplayName(name);
        setInputName(name);
        setAvatarSvg(multiavatar(name));
      }
    };
    loadProfile();
  }, [walletAddress]);

  useEffect(() => {
    setAvatarSvg(multiavatar(inputName));
  }, [inputName]);

  const saveName = async () => {
    if (!walletAddress || !inputName.trim()) return;
    await setDoc(doc(db, "users", walletAddress), { displayName: inputName.trim() }, { merge: true });
    setDisplayName(inputName.trim());
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#0B1519] text-white px-4 py-10 flex flex-col items-center">
      <div
        className="w-28 h-28 rounded-full overflow-hidden mb-4 border border-gray-500"
        dangerouslySetInnerHTML={{ __html: avatarSvg }}
      />
      {!walletAddress ? (
        <p className="text-gray-400">Please log in</p>
      ) : (
        <>
          <div className="mb-4 text-center">
            {!isEditing ? (
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-xl font-semibold">{displayName}</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-blue-400 hover:underline"
                >
                  ✎
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <input
                  className="px-3 py-1 rounded bg-gray-800 border border-gray-600 text-white"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                />
                <button
                  onClick={saveName}
                  className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Update Name
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-400 break-all">Account: {walletAddress}</p>
        </>
      )}
    </div>
  );
}
