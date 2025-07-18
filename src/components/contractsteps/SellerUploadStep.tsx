import React, { useRef, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../lib/firebase";
import { useParams } from "react-router-dom";
import { useActiveAccount } from "thirdweb/react";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";

interface Props {
  index: number;
}

export default function SellerUploadStep({ index }: Props) {
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [inspectionDate, setInspectionDate] = useState("");
  const [inspectionTime, setInspectionTime] = useState("");
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const { id: contractId } = useParams();
  const account = useActiveAccount();
  const walletAddress = account?.address;

  const handleSubmit = async () => {
    if (!walletAddress || !contractId || !file || !inspectionDate || !inspectionTime || !timezone) {
      alert("Please complete all fields.");
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Only PDF files allowed.");
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `contracts/${walletAddress}/${contractId}/signed_contract.pdf`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const local = new Date(`${inspectionDate}T${inspectionTime}`);
      const zoned = new Date(
        new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          hour12: false,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }).formatToParts(local)
          .map(({ value }) => value)
          .join(" ")
      );

      const isoString = new Date(zoned).toISOString();

      await updateDoc(doc(db, `users/${walletAddress}/contracts/${contractId}`), {
        sellerSignedUrl: url,
        inspectionEndsAt: isoString,
        inspectionEndsTimezone: timezone,
      });

      alert("Uploaded and saved.");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to upload.");
    } finally {
      setUploading(false);
    }
  };

  if (index < 1) return null;

  return (
    <>
      <div className="w-[250px] md:w-[440px] bg-black border border-cyan-500 rounded-xl p-6 shadow-md flex flex-col text-center">
        <p className="text-white font-semibold text-lg mb-4">Seller Signature Upload</p>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="w-full py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-black transition"
        >
          Upload Signed Contract
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
          <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md text-white">
            <h2 className="text-xl font-bold mb-4 text-center text-cyan-400">Upload PDF & Set Inspection End</h2>

            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mb-4 block w-full text-sm text-white"
            />

            <label className="text-sm block mb-1">Inspection End Date</label>
            <div className="relative mb-4">
              <input
                type="date"
                value={inspectionDate}
                onChange={(e) => setInspectionDate(e.target.value)}
                className="w-full p-2 pr-10 rounded bg-neutral-800 border border-cyan-500 text-white"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-white"
                onClick={() => {
                  document.querySelector<HTMLInputElement>('input[type="date"]')?.showPicker?.();
                }}
              >
                <CalendarIcon className="h-5 w-5" />
              </button>
            </div>



            <div className="relative mb-4">
              <input
                type="time"
                value={inspectionTime}
                onChange={(e) => setInspectionTime(e.target.value)}
                className="w-full p-2 pr-10 rounded bg-neutral-800 border border-cyan-500 text-white"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-white"
                onClick={() => {
                  document.querySelector<HTMLInputElement>('input[type="time"]')?.showPicker?.();
                }}
              >
                <ClockIcon className="h-5 w-5" />
              </button>
            </div>


            <label className="text-sm block mb-1">Time Zone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-neutral-800 border border-cyan-500 text-white"
            >
              <option value="">Select Timezone</option>
              <option value="Pacific/Honolulu" className="text-purple-400">Hawaii</option>
              <option value="America/Anchorage" className="text-rose-400">Alaska</option>
              <option value="America/Los_Angeles" className="text-orange-400">Pacific</option>
              <option value="America/Denver" className="text-yellow-400">Mountain</option>
              <option value="America/Chicago" className="text-green-400">Central</option>
              <option value="America/New_York" className="text-cyan-400">Eastern</option>
              <option value="UTC" className="text-white">UTC</option>
            </select>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded w-full mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded w-full ml-2"
              >
                {uploading ? "Uploading..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
