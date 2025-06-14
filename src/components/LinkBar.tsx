import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

interface Link {
  name: string;
  url: string;
  id?: string;
}

export default function LinkBar({ walletAddress }: { walletAddress: string }) {
  const [links, setLinks] = useState<Link[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newLink, setNewLink] = useState<Link>({ name: "", url: "" });

  useEffect(() => {
    const fetchLinks = async () => {
      if (!walletAddress) return;
      try {
        const snapshot = await getDocs(
          collection(db, `users/${walletAddress}/links`)
        );
        const data = snapshot.docs.map((doc) => ({
          ...(doc.data() as Link),
          id: doc.id,
        }));
        setLinks(data);
      } catch (err) {
        console.error("Error fetching links:", err);
      }
    };

    fetchLinks();
  }, [walletAddress]);

  const handleAddLink = async () => {
    if (!newLink.name || !newLink.url || links.length >= 7) return;
    try {
      const docRef = await addDoc(
        collection(db, `users/${walletAddress}/links`),
        newLink
      );
      setLinks([...links, { ...newLink, id: docRef.id }]);
      setNewLink({ name: "", url: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Failed to add link:", err);
    }
  };

  const handleDelete = async (id: string) => {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50";

    modal.innerHTML = `
      <div class='bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl max-w-sm w-full text-center'>
        <h2 class='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>Confirm Delete</h2>
        <p class='text-sm text-gray-700 dark:text-gray-300 mb-6'>Are you sure you want to remove this link?</p>
        <div class='flex justify-center gap-4'>
          <button id='confirmYes' class='px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700'>Yes</button>
          <button id='confirmNo' class='px-4 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'>Cancel</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    return new Promise<void>((resolve) => {
      modal.querySelector("#confirmYes")?.addEventListener("click", async () => {
        try {
          await deleteDoc(doc(db, `users/${walletAddress}/links`, id));
          setLinks((prev) => prev.filter((link) => link.id !== id));
        } catch (err) {
          console.error("Failed to delete link:", err);
        } finally {
          modal.remove();
          resolve();
        }
      });

      modal.querySelector("#confirmNo")?.addEventListener("click", () => {
        modal.remove();
        resolve();
      });
    });
  };

  return (
    <div className="w-full flex flex-col items-center gap-2 px-6 py-2 bg-gray-100 dark:bg-black border-b border-gray-300 dark:border-gray-700">
      <div className="flex flex-wrap justify-center gap-4">
        {links.map((link) => (
          <div key={link.id} className="relative group">
            <button
              onClick={() => window.open(link.url, "_blank")}
              className="px-3 py-1 bg-[#044a4b] text-white rounded-full hover:brightness-110 text-sm"
            >
              {link.name}
            </button>
            <button
              onClick={() => handleDelete(link.id!)}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hidden group-hover:block"
              title="Remove"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {links.length < 7 && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {showForm && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 mt-2 w-full max-w-md">
          <input
            type="text"
            placeholder="Name"
            value={newLink.name}
            onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
            className="flex-1 px-2 py-1 border rounded text-sm bg-gray-800 text-white placeholder-gray-400 w-full"
          />
          <input
            type="url"
            placeholder="https://example.com"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            className="flex-1 px-2 py-1 border rounded text-sm bg-gray-800 text-white placeholder-gray-400 w-full"
          />
          {walletAddress ? (
            <button
              onClick={handleAddLink}
              className="px-4 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 w-full md:w-auto"
            >
              Add
            </button>
          ) : (
            <button
              disabled
              className="px-4 py-1 bg-gray-700 text-gray-400 text-sm rounded cursor-not-allowed w-full md:w-auto"
              title="Sign in to save links"
            >
              Login to add quick links
            </button>
          )}
        </div>
      )}
    </div>
  );
}
