import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import multiavatar from "@multiavatar/multiavatar";

export default function ProfilePage() {
  const account = useActiveAccount();
  const walletAddress = account?.address || "";

  const [displayName, setDisplayName] = useState("New User");
  const [isEditing, setIsEditing] = useState(false);
  const [inputName, setInputName] = useState(displayName);
  const [avatarSvg, setAvatarSvg] = useState("");

  useEffect(() => {
    setAvatarSvg(multiavatar(isEditing ? inputName : displayName));
  }, [displayName, inputName, isEditing]);

  const saveName = () => {
    if (inputName.trim()) {
      setDisplayName(inputName.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 text-white" style={{ backgroundColor: "#0B1519" }}>
      <div className="max-w-2xl mx-auto text-center space-y-6">
        {/* Avatar */}
        <div
          className="w-32 h-32 mx-auto rounded-full border-4 border-[#044a4b] bg-white p-1 overflow-hidden"
          dangerouslySetInnerHTML={{ __html: avatarSvg }}
        />

        {/* Display Name Section */}
        <div className="text-lg font-semibold flex justify-center items-center gap-2 flex-wrap">
          {isEditing ? (
            <>
              <input
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="px-2 py-1 rounded bg-zinc-800 text-white border border-zinc-600"
              />
              <button
                onClick={saveName}
                className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <span>{displayName}</span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-blue-400 hover:underline"
                title="Edit display name"
              >
                ✏️
              </button>
            </>
          )}
        </div>

        {/* Wallet Info */}
        {walletAddress ? (
          <p className="text-gray-400 break-all">Account: {walletAddress}</p>
        ) : (
          <p className="text-gray-500">Please sign in to view your profile.</p>
        )}
      </div>
    </div>
  );
}
