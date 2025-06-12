// components/ScriptModal.tsx
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./Dialog";
import { DealInput } from "../types/DealInput";

interface Props {
  open: boolean;
  onClose: () => void;
  formData: DealInput;
  setFormData: React.Dispatch<React.SetStateAction<DealInput>>;
}

const questions = [
  {
    label: "Has this been a rental or owner-occupied?",
    field: "occupancyStatus",
  },
  {
    label: "What’s got the seller looking to let it go right now?",
    field: "notes",
  },
  {
    label: "Is it currently occupied? And assuming it’s cleaned up or updated, what would you estimate market rent at?",
    field: "rentalValue",
  },
  {
    label: "What kind of updates would a new buyer need to plan for?",
    field: "rehabCost",
  },
  {
    label: "Do you happen to know what the taxes and HOA run?",
    fields: ["taxes", "hoa"],
  },
  {
    label: "Have any comps come in recently? Or what do you think ARV would look like if it's updated?",
    field: "arv",
  },
  {
    label: "Depending on what’s owed and how the numbers look, we sometimes come in with creative offers like seller finance or subject-to. Is the seller open to something like that if it nets them what they want?",
    field: "method",
  },
  {
    label: "Do you know what’s owed or the current mortgage balance?",
    field: "mortgageBalance",
  },
  {
    label: "Do you know the original loan amount, interest rate, or monthly payment?",
    fields: ["loanAmount", "interestRate", "loanPayment"],
  },
];

export default function ScriptModal({ open, onClose, formData, setFormData }: Props) {
  const [agentConsent, setAgentConsent] = useState("text");
  const [timelineResponse, setTimelineResponse] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    field: keyof DealInput
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleDone = () => {
    const notesParts: string[] = [];

    if (formData.notes?.trim()) {
      notesParts.push(formData.notes);
    }

    if (formData.method) {
      notesParts.push(`Creative offer response: ${formData.method}`);
    }

    if (agentConsent) {
      notesParts.push(`${agentConsent} offer`);
    }

    if (timelineResponse) {
      notesParts.push(`Include credibility packet: ${timelineResponse}`);
    }

    setFormData((prev) => ({
      ...prev,
      notes: notesParts.join("\n"),
    }));

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-zinc-900 text-white w-[95vw] max-w-2xl p-6 rounded-xl">
        <DialogTitle className="text-lg font-semibold text-[#6e5690] mb-4">
          Call Script  Discovery Questions
        </DialogTitle>

        <div className="space-y-6">
          <div className="bg-zinc-800 p-4 rounded-md border border-neutral-700">
            <p className="text-sm text-cyan-400">
              Hi, I’m calling about <span className="font-semibold text-[#6e5690]">{formData.address || "[XYZ Property]"}</span>  are you the listing agent on that one?
            </p>
          </div>

          {questions.map((q, index) => (
            <div key={index} className="space-y-2">
              <p className="font-medium text-sm text-cyan-400">{q.label}</p>
              {q.field === "occupancyStatus" ? (
                <select
                  name="occupancyStatus"
                  value={formData.occupancyStatus || ""}
                  onChange={(e) => handleChange(e, "occupancyStatus")}
                  className="w-full bg-zinc-800 border border-neutral-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="vacant">Vacant</option>
                  <option value="rented">Rented</option>
                  <option value="owner occupied">Owner Occupied</option>
                </select>
              ) : q.field && !q.fields ? (
                <input
                  name={q.field}
                  value={formData[q.field as keyof DealInput] || ""}
                  onChange={(e) => handleChange(e, q.field as keyof DealInput)}
                  className="w-full bg-zinc-800 border border-neutral-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : q.fields && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(q.fields as (keyof DealInput)[]).map((f) => (
                    <input
                      key={f}
                      name={f}
                      placeholder={f.replace(/([A-Z])/g, ' $1')}
                      value={formData[f] || ""}
                      onChange={(e) => handleChange(e, f)}
                      className="w-full bg-zinc-800 border border-neutral-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="space-y-2">
            <p className="font-medium text-sm text-cyan-400">If I put something together that made sense, is it okay to shoot you a text first or do you prefer email?</p>
            <select
              value={agentConsent}
              onChange={(e) => setAgentConsent(e.target.value)}
              className="w-full bg-zinc-800 border border-neutral-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div className="space-y-2">
            <p className="font-medium text-sm text-cyan-400">Thanks, I’ll include proof of funds and a short credibility packet with a few of our recent closings.</p>

          </div>

          <div className="flex justify-center pt-6">
            <button
              onClick={handleDone}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              Done
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
