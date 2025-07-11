import React, { useState, useEffect } from "react";
import { DealInput } from "../../types/DealInput";
import { doc, setDoc, serverTimestamp, increment } from "firebase/firestore";
import { db } from "../../lib/firebase";

interface Props {
  formData: DealInput;
  handleChange: (e: React.ChangeEvent<any>) => void;
  setFormData: React.Dispatch<React.SetStateAction<DealInput>>;
}

/** Strip non-digits and take last 10 digits */
const normalizePhone = (raw = ""): string => raw.replace(/\D/g, "").slice(-10);

/** Create agent ID from email or fallback to name+phone */
function agentKey(name = "", phone = "", email = "") {
  const cleanedEmail = email?.trim().toLowerCase();
  if (cleanedEmail) return cleanedEmail;
  const digits = normalizePhone(phone);
  if (!name.trim() && !digits) return "unknown";
  return `${name.trim().toLowerCase()}-${digits}`;
}

export default function ContactInfoSection({ formData, handleChange, setFormData }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const ratingCommitted = formData.agentRating ?? 0;
  const display = hover ?? ratingCommitted;

  const commitRating = async (val: number) => {
    setFormData((prev) => ({ ...prev, agentRating: val }));

    const key = agentKey(formData.agentName, formData.agentPhone, formData.agentEmail);
    const phone = normalizePhone(formData.agentPhone);

    try {
      await setDoc(
        doc(db, "agents", key),
        {
          name: formData.agentName || "Unknown",
          phone,
          email: formData.agentEmail?.trim().toLowerCase() || undefined,
          timezone: formData.agentTimezone || undefined,
          lastRating: val,
          ratingCount: increment(1),
          ratingTotal: increment(val),
          updatedAt: serverTimestamp(),
          // createdAt: serverTimestamp(), // Optional: Only on new doc (needs extra logic)
        },
        { merge: true }
      );
    } catch (err) {
      console.error("⚠️ agent rating save failed:", err);
    }
  };

  useEffect(() => setHover(null), [ratingCommitted]);

  return (
    <>
      <h2 className="text-center text-xl font-semibold text-[#6e5690] mt-8">2. Contact Info</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["agentName", "agentPhone", "agentEmail"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium mb-1 capitalize">
              {field.replace("agent", "Agent ")}
            </label>
            <input
              name={field}
              value={(formData as any)[field] || ""}
              onChange={handleChange}
              className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2"
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium mb-1">Agent Timezone</label>
          <select
            name="agentTimezone"
            value={formData.agentTimezone || ""}
            onChange={handleChange}
            className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2"
          >
            <option value="">Select Timezone</option>
            {["Hawaii", "Pacific", "Mountain", "Central", "Eastern"].map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 text-center select-none">
        <label className="block text-sm font-medium mb-2">Rate this Agent</label>
        <div className="flex justify-center items-center gap-2" title="Click a star to rate">
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => i + 1).map((v) => (
              <svg
                key={v}
                onMouseEnter={() => setHover(v)}
                onMouseLeave={() => setHover(null)}
                onClick={() => commitRating(v)}
                className={`h-6 w-6 cursor-pointer transition-colors ${
                  v <= display
                    ? "fill-yellow-400"
                    : "fill-gray-500 hover:fill-yellow-300"
                }`}
                viewBox="0 0 22 20"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-white w-10 text-left">{ratingCommitted} / 5</span>
        </div>
      </div>
    </>
  );
}
