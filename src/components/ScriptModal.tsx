import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "./Dialog";
import { DealInput } from "../types/DealInput";
import { Pencil, X, ArrowUp, ArrowDown } from "lucide-react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useActiveAccount } from "thirdweb/react";

interface Props {
  open: boolean;
  onClose: () => void;
  formData: DealInput;
  setFormData: React.Dispatch<React.SetStateAction<DealInput>>;
}

const defaultQuestions = [
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
    label: "What would market rent be fore this property if we had it looking nice?",
    field: "rentalValue",
    hint: "Get an estimate for potential rental income."
  },
  {
    label: "Is there any defered maintainence or repairs I cant see in the pictures?",
    field: "rehabCost",
    hint: "Get them to provide the cost to repair."
  },
  {
    label: "Do you happen to know what the taxes and HOA run?",
    fields: ["taxes", "hoa"],
    hint: "Collect ongoing cost estimates."
  },
  {
    label: "What are updated homes going for recently? Do you have any comps picked out?",
    field: "arv",
    hint: "Estimate after repair value."
  },
  {
    label: "Please list the comps the seller provided (if any):",
    field: "arvComps",
    hint: "List any comparable properties shared by the seller."
  },
  {
    label: "Depending on what’s owed and how the numbers look, we sometimes come in with creative offers like seller finance or mortgage takeover. Is the seller open to something like that if it nets them what they want?",
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
  const account = useActiveAccount();
  const walletAddress = account?.address;
  const [agentConsent, setAgentConsent] = useState("text");
  const [timelineResponse, setTimelineResponse] = useState("");
  const [contactValue, setContactValue] = useState("");
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [customLabels, setCustomLabels] = useState<string[]>(defaultQuestions.map((q) => q.label));
  const [questionOrder, setQuestionOrder] = useState<number[]>(defaultQuestions.map((_, idx) => idx));

  const getTimeInAgentTimezone = (timezoneLabel: string): string => {
    const timezoneMap: { [key: string]: string } = {
      Hawaii: "Pacific/Honolulu",
      Pacific: "America/Los_Angeles",
      Mountain: "America/Denver",
      Central: "America/Chicago",
      Eastern: "America/New_York",
    };
    const tz = timezoneMap[timezoneLabel];
    if (!tz) return "";
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: tz,
    }).format(new Date());
  };

  useEffect(() => {
    if (!walletAddress) return;
    const ref = doc(db, "scripts", walletAddress);
    const load = async () => {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        if (data.labels) setCustomLabels(data.labels);
        if (data.order) setQuestionOrder(data.order);
      }
    };
    load();
  }, [walletAddress]);

  useEffect(() => {
    if (!walletAddress) return;
    const ref = doc(db, "scripts", walletAddress);
    setDoc(ref, { labels: customLabels, order: questionOrder }, { merge: true });
  }, [customLabels, questionOrder]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    field: keyof DealInput | string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleDone = () => {
    const notesParts: string[] = [];
    if (formData.notes?.trim()) notesParts.push(formData.notes);
    if (formData.method) notesParts.push(`Creative offer response: ${formData.method}`);
    if ((formData as any).arvComps?.trim()) notesParts.push(`Comps provided: ${(formData as any).arvComps.trim()}`);
    if (agentConsent === "text" || agentConsent === "email" || agentConsent === "call") {
      notesParts.push(`${agentConsent} offer`);
      if (contactValue.trim()) {
        notesParts.push(`${agentConsent}: ${contactValue}`);
      }
    }
    if (timelineResponse) notesParts.push(`Include credibility packet: ${timelineResponse}`);
    setFormData((prev) => ({ ...prev, notes: notesParts.join("\n") }));
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-zinc-900 text-white w-full max-w-2xl p-6 rounded-xl mx-auto">
        {formData.agentPhone ? (
          <div className="text-center mb-4">
            <a href={`tel:${formData.agentPhone}`} className="inline-block text-4xl font-extrabold text-blue-400 hover:underline hover:text-blue-300">
              {formData.agentPhone}
            </a>
            <div className="text-sm text-neutral-400 mt-1">Tap to call</div>
          </div>
        ) : (
          <div className="text-center text-4xl font-extrabold text-white mb-4">No phone provided</div>
        )}

        {formData.agentTimezone && (
          <div className="text-center text-md text-neutral-400 mb-2">
            Local Time: {getTimeInAgentTimezone(formData.agentTimezone)}
          </div>
        )}

        <DialogTitle className="text-lg font-semibold text-[#6e5690] mb-4 text-center">
          Discovery Call Script
        </DialogTitle>

        <div className="bg-zinc-800 p-4 rounded-md border border-neutral-700 mb-4">
          <p className="text-base text-cyan-400">
            Hi, I’m calling about <span className="font-semibold text-white">{formData.address || "[Property]"}</span> are you the listing agent on this property?
          </p>
        </div>

        {questionOrder.map((questionIndex) => {
          const q = defaultQuestions[questionIndex];
          return (
            <div key={questionIndex} className="space-y-2">
              <div className="flex items-start gap-2">
                <p className="font-medium text-base text-cyan-400 flex-1">{customLabels[questionIndex]}</p>
                <div className="flex gap-1">
                  <button onClick={() => setQuestionOrder((prev) => {
                    const idx = prev.indexOf(questionIndex);
                    if (idx > 0) {
                      const newOrder = [...prev];
                      [newOrder[idx], newOrder[idx - 1]] = [newOrder[idx - 1], newOrder[idx]];
                      return newOrder;
                    }
                    return prev;
                  })}><ArrowUp size={16} /></button>
                  <button onClick={() => setQuestionOrder((prev) => {
                    const idx = prev.indexOf(questionIndex);
                    if (idx < prev.length - 1) {
                      const newOrder = [...prev];
                      [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
                      return newOrder;
                    }
                    return prev;
                  })}><ArrowDown size={16} /></button>
                  <button onClick={() => setEditingQuestion(questionIndex)} className="text-cyan-400">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => setCustomLabels((prev) => prev.map((l, i) => i === questionIndex ? defaultQuestions[questionIndex].label : l))} className="text-red-400">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {editingQuestion === questionIndex && (
                <input
                  value={customLabels[questionIndex]}
                  onChange={(e) => setCustomLabels((prev) => prev.map((l, i) => i === questionIndex ? e.target.value : l))}
                  className="w-full bg-zinc-800 border border-neutral-700 text-white rounded px-3 py-2"
                />
              )}

              {q.field && (
                <input
                  value={(formData as any)[q.field] || ""}
                  onChange={(e) => handleChange(e, q.field)}
                  className="w-full bg-zinc-800 border border-neutral-700 text-white rounded px-3 py-2"
                />
              )}

              {q.fields && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.fields.map((f: string) => (
                    <input
                      key={f}
                      name={f}
                      placeholder={f.replace(/([A-Z])/g, ' $1')}
                      value={(formData as any)[f] || ""}
                      onChange={(e) => handleChange(e, f)}
                      className="w-full bg-zinc-800 border border-neutral-700 text-white rounded px-3 py-2"
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div className="space-y-4 mt-6">
          <label className="text-cyan-400 block font-medium">Preferred Contact Method</label>
          <select
            value={agentConsent}
            onChange={(e) => {
              setAgentConsent(e.target.value);
              if (e.target.value === "call" && formData.agentPhone) {
                setContactValue(formData.agentPhone);
              } else {
                setContactValue("");
              }
            }}
            className="w-full bg-zinc-800 border border-neutral-700 text-white rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option value="text">Text</option>
            <option value="email">Email</option>
          </select>

          {agentConsent && (
            <input
              placeholder={`Enter ${agentConsent} (if provided)`}
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              className="w-full bg-zinc-800 border border-neutral-700 text-white rounded px-3 py-2"
            />
          )}
        </div>

        <p className="mt-14 text-base text-cyan-400">
          Awesome, thanks for your time today. We’ll likely reach out with an offer and include proof of funds along with a credibility packet showing properties we’ve purchased over the last couple years.
        </p>

        <div className="pt-6 text-center">
          <button
            onClick={handleDone}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Done
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
