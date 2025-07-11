import { XCircleIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
import { Deal } from "../types/deal";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

interface TeamMember {
  address: string;
  displayName: string;
}

const ADMIN_NAME = "0xNateZ";
const ADMIN_ADDRESS = "0x91706ECbA7af59616D4005F37979528226532E6B";

declare global {
  interface Window {
    multiavatar: (id: string) => string;
  }
}

export default function TeamShareModal({
  teamMembers = [],
  selectedDeal,
  walletAddress,
  onClose,
  setDeals,
  fetchSharedUsers,
}: {
  teamMembers?: TeamMember[];
  selectedDeal: Deal | null;
  walletAddress: string;
  onClose: () => void;
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
  fetchSharedUsers: (deals: Deal[]) => Promise<void>;
}) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const modalContent = document.getElementById("team-share-modal-content");
      if (modalContent && !modalContent.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const shortenAddress = (address: string) =>
    address.slice(0, 6) + "..." + address.slice(-4);

  const getAvatarSvg = (name: string, address: string) => {
    return window.multiavatar(`${name}-${address}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div
        id="team-share-modal-content"
        className="bg-[#0B1519] border border-neutral-700 text-white rounded-xl shadow-2xl p-6 max-w-md w-full relative"
      >
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-gray-500 hover:text-red-600"
        >
          <XCircleIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-[#6e5690]">
          Share Deal with your Connections
        </h2>

        {/* Admin Profile */}
        <div className="mb-4 border border-neutral-700 rounded-md p-4 bg-[#050505]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full overflow-hidden"
                dangerouslySetInnerHTML={{
                  __html: getAvatarSvg(ADMIN_NAME, ADMIN_ADDRESS),
                }}
              />
              <div>
                <p className="text-sm font-semibold text-white">{ADMIN_NAME}</p>
                <p className="text-xs text-gray-400">{shortenAddress(ADMIN_ADDRESS)}</p>
              </div>
            </div>
            <button
              disabled
              className="bg-gray-600 text-white text-xs px-3 py-1 rounded cursor-not-allowed"
              title="Coming Soon"
            >
              JV with us
            </button>
          </div>
        </div>

        {/* Team Members */}
        {teamMembers.length === 0 ? (
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-4">
              You don’t have any connections yet.
            </p>
            <a href="/profile" className="text-sm text-[#068989] hover:underline">
              Add Connections
            </a>
          </div>
        ) : (
          <>
            <ul className="space-y-3">
              {teamMembers.map((member) => (
                <li
                  key={member.address}
                  className="flex justify-between items-center bg-[#050505] border border-neutral-700 p-4 rounded-md hover:bg-[#6e5690] hover:text-black transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full overflow-hidden"
                      dangerouslySetInnerHTML={{
                        __html: getAvatarSvg(member.displayName, member.address),
                      }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {member.displayName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {shortenAddress(member.address)}
                      </p>
                    </div>
                  </div>
                  <button
                    disabled={!selectedDeal}
                    className={`text-xs px-3 py-1 rounded text-white transition ${
                      selectedDeal
                        ? "bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
                        : "bg-gray-600 cursor-not-allowed"
                    }`}
                    onClick={async () => {
                      if (!selectedDeal) return;

                      try {
                        const ref = doc(
                          db,
                          `users/${member.address}/deals`,
                          selectedDeal.id
                        );

                        await setDoc(
                          ref,
                          {
                            ...selectedDeal,
                            sharedBy: walletAddress,
                            sharedAt: serverTimestamp(),
                          },
                          { merge: true }
                        );

                        const senderRef = doc(
                          db,
                          `users/${walletAddress}/deals`,
                          selectedDeal.id
                        );
                        const senderSnap = await getDoc(senderRef);
                        const prevSharedWith: string[] = senderSnap.exists()
                          ? (senderSnap.data().sharedWith as string[]) ?? []
                          : [];

                        const updatedSharedWith = Array.from(
                          new Set([...prevSharedWith, member.address])
                        );

                        await updateDoc(senderRef, {
                          sharedWith: updatedSharedWith,
                          sharedAt: serverTimestamp(),
                        });

                        setDeals((prev) =>
                          prev.map((deal) =>
                            deal.id === selectedDeal.id
                              ? {
                                  ...deal,
                                  sharedWith: updatedSharedWith,
                                  sharedAt: new Date(),
                                }
                              : deal
                          )
                        );

                        await fetchSharedUsers([
                          {
                            ...selectedDeal,
                            sharedWith: updatedSharedWith,
                          },
                        ]);

                        onClose();
                      } catch (err) {
                        console.error("Error sharing deal:", err);
                        alert("Failed to share deal.");
                      }
                    }}
                  >
                    Send
                  </button>
                </li>
              ))}
            </ul>

            <div className="text-center mt-6">
              <a
                href="/profile"
                className="inline-block px-4 py-2 text-sm font-medium bg-[#068989] text-white rounded hover:bg-[#06a5a5]"
              >
                Add Connections
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
