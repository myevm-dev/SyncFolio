// components/ScriptModal.tsx
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./Dialog";
import { DealInput } from "../types/DealInput";
import { Pencil, X } from "lucide-react";

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
    hint: "Understand how the property was used."
  },
  {
    label: "What’s got the seller looking to let it go right now?",
    field: "notes",
    hint: "Understand the seller's motivation."
  },
  {
    label: "Is it currently occupied? And assuming it’s cleaned up or updated, what would you estimate market rent at?",
    field: "rentalValue",
    hint: "Get an estimate for potential rental income."
  },
  {
    label: "What kind of updates would a new buyer need to plan for?",
    field: "rehabCost",
    hint: "Get them to provide the cost to repair."
  },
  {
    label: "Do you happen to know what the taxes and HOA run?",
    fields: ["taxes", "hoa"],
    hint: "Collect ongoing cost estimates."
  },
  {
    label: "Have any comps come in recently? Or what do you think ARV would look like if it's updated?",
    field: "arv",
    hint: "Estimate after repair value."
  },
  {
    label: "Depending on what’s owed and how the numbers look, we sometimes come in with creative offers like seller finance or subject-to. Is the seller open to something like that if it nets them what they want?",
    field: "method",
    hint: "Gauge seller openness to creative financing."
  },
  {
    label: "Do you know what’s owed or the current mortgage balance?",
    field: "mortgageBalance",
    hint: "Find out how much is owed."
  },
  {
    label: "Do you know the original loan amount, interest rate, or monthly payment?",
    fields: ["loanAmount", "interestRate", "loanPayment"],
    hint: "Learn more about financing details."
  }
];

export default function ScriptModal({ open, onClose, formData, setFormData }: Props) {
  const [agentConsent, setAgentConsent] = useState("text");
  const [timelineResponse, setTimelineResponse] = useState("");
  const [contactValue, setContactValue] = useState("");
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [customLabels, setCustomLabels] = useState<string[]>(questions.map((q) => q.label));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    field: keyof DealInput
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleEditChange = (index: number, value: string) => {
    const updated = [...customLabels];
    updated[index] = value;
    setCustomLabels(updated);
  };

  const resetToDefault = (index: number) => {
    const confirmed = window.confirm("Reset question to default?");
    if (confirmed) {
      const updated = [...customLabels];
      updated[index] = questions[index].label;
      setCustomLabels(updated);
    }
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

    if (contactValue.trim()) {
      notesParts.push(`${agentConsent}: ${contactValue}`);
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
        <DialogTitle className="text-lg font-semibold text-[#6e5690] mb-4 text-center">
          Discovery Call Script
        </DialogTitle>

        <div className="space-y-6">
          {formData.agentPhone && (
            <div className="text-center text-3xl font-bold text-white">
              {formData.agentPhone}
            </div>
          )}

          <div className="bg-zinc-800 p-4 rounded-md border border-neutral-700">
            <p className="text-base text-cyan-400">
              Hi, I’m calling about <span className="font-semibold text-white">{formData.address || "[Property]"}</span> are you the listing agent on that one?
            </p>
          </div>

          {questions.map((q, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-start gap-2">
                {editingQuestion === index ? (
                  <input
                    value={customLabels[index]}
                    placeholder={q.hint || "Edit question"}
                    onChange={(e) => handleEditChange(index, e.target.value)}
                    onBlur={() => setEditingQuestion(null)}
                    autoFocus
                    className="flex-1 bg-zinc-800 border border-neutral-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="font-medium text-base text-cyan-400 flex-1">{customLabels[index]}</p>
                )}
                <div className="flex gap-1">
                  <button onClick={() => setEditingQuestion(index)} className="text-cyan-400">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => resetToDefault(index)} className="text-red-400">
                    <X size={16} />
                  </button>
                </div>
              </div>
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
            <div className="flex items-start gap-2">
              <p className="font-medium text-base text-cyan-400 flex-1">If I put something together that made sense, is it okay to shoot you a text first or do you prefer email?</p>
              <div className="flex gap-1">
                <button onClick={() => setEditingQuestion(9)} className="text-cyan-400">
                  <Pencil size={16} />
                </button>
                <button onClick={() => resetToDefault(9)} className="text-red-400">
                  <X size={16} />
                </button>
              </div>
            </div>
            <select
              value={agentConsent}
              onChange={(e) => setAgentConsent(e.target.value)}
              className="w-full bg-zinc-800 border border-neutral-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
            </select>
            <input
              placeholder={`Enter ${agentConsent} (if provided)`}
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              className="w-full bg-zinc-800 border border-neutral-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <p className="font-medium text-base text-cyan-400 flex-1">Thanks, I’ll include proof of funds and a short credibility packet with a few of our recent closings.</p>
              <div className="flex gap-1">
                <button onClick={() => setEditingQuestion(10)} className="text-cyan-400">
                  <Pencil size={16} />
                </button>
                <button onClick={() => resetToDefault(10)} className="text-red-400">
                  <X size={16} />
                </button>
              </div>
            </div>
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
