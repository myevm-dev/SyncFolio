import React, { useState, useEffect } from "react";

import { Dialog, DialogContent, DialogTitle } from "./Dialog";
import { DealInput } from "../types/DealInput";
import { Pencil, X, ArrowUp, ArrowDown } from "lucide-react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useActiveAccount } from "thirdweb/react";

import { rehabCategories, calculateRehabCost } from "../calculations/repairestimates";


interface Props {
  open: boolean;
  onClose: () => void;
  formData: DealInput;
  setFormData: React.Dispatch<React.SetStateAction<DealInput>>;
}


const defaultQuestions = [
  {
    label: "Has this been a rental or owner-occupied? Is it currenly occupied?",
    field: "occupancyStatus",
    hint: "Understand how the property was used."
  },
  {
    label: "This place as a lot of opportunity, what’s got the seller looking to let it go right now?",
    field: "notes",
    hint: "Understand the seller's motivation."
  },
  {
    label: "Any idea what it could bring in rent if we had it looking nice?",
    field: "rentalValue",
    hint: "Get an estimate for potential rental income."
  },
  {
    label: "Is there any defered maintainence or repairs I cant see in the pictures?",
    field: "rehabCost",
    hint: "Get them to provide the cost to repair."
  },
  {
    label: "Do you happen to know what the annual taxes and monthly HOA are?",
    fields: ["taxes", "hoa"],
    hint: "Collect ongoing cost estimates."
  },
  {
    label: "What are updated homes going for recently? (What’s the ARV?)",
    field: "arv",
    hint: "Estimate after repair value."
  },
  {
    label: "Do you have any comps picked out? (if any):",
    field: "arvComps",
    hint: "List any comparable properties shared by the seller."
  },
  {
    label: "Depending on how the numbers look, we sometimes come in with creative offers like seller finance or mortgage takeover via trust acquisition. Is the seller open to something like that if it nets them what they want?",
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
  const [tempLabel, setTempLabel] = useState("");
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
    setFormData((prev) => {
      const value = e.target.value;
      const updatedValue = field === "taxes" ? (parseFloat(value) / 12).toFixed(2) : value;
      return { ...prev, [field]: updatedValue };
    });
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
          <a
            href={`tel:${formData.agentPhone}`}
            className="inline-block text-4xl font-extrabold text-blue-400 hover:underline hover:text-blue-300"
          >
            {formData.agentPhone}
          </a>
          <div className="text-sm text-neutral-400 mt-1">Tap to call</div>
          {formData.agentName && (
            <div className="text-2xl text-white mt-1 font-semibold">
              {formData.agentName}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-4xl font-extrabold text-white mb-4">
          No phone provided
        </div>
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
            Hi, I’m calling about{" "}
            <span className="font-semibold text-white">
              {formData.address || "[Property]"}
            </span>{" "}
            are you the listing agent on this property?
          </p>
        </div>

        {questionOrder.map((questionIndex) => {
          const q = defaultQuestions[questionIndex];

            // Skip mortgage-related questions unless seller is open to creative financing
            if (
              (q.field === "mortgageBalance" || q.fields?.includes("loanAmount")) &&
              formData.method !== "yes"
            ) {
              return null;
            }

          return (
            <div key={questionIndex} className="space-y-2 mt-6">
              <div className="flex items-start gap-2">
                <p className="font-medium text-base text-cyan-400 flex-1">
                  {q.label.includes("what’s got the seller looking") ? (
                    <>
                      This looks like it has potential and you have it for{" "}
                      <span className="text-white font-semibold">
                        ${formData.listingPrice || "[price]"}
                      </span>
                      , what’s got the seller looking to let it go right now?
                    </>
                  ) : (
                    customLabels[questionIndex]
                  )}
                </p>

                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      setQuestionOrder((prev) => {
                        const idx = prev.indexOf(questionIndex);
                        if (idx > 0) {
                          const newOrder = [...prev];
                          [newOrder[idx], newOrder[idx - 1]] = [
                            newOrder[idx - 1],
                            newOrder[idx],
                          ];
                          return newOrder;
                        }
                        return prev;
                      })
                    }
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() =>
                      setQuestionOrder((prev) => {
                        const idx = prev.indexOf(questionIndex);
                        if (idx < prev.length - 1) {
                          const newOrder = [...prev];
                          [newOrder[idx], newOrder[idx + 1]] = [
                            newOrder[idx + 1],
                            newOrder[idx],
                          ];
                          return newOrder;
                        }
                        return prev;
                      })
                    }
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingQuestion(questionIndex);
                      setTempLabel(customLabels[questionIndex]);
                    }}
                    className="text-cyan-400"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() =>
                      setCustomLabels((prev) =>
                        prev.map((l, i) =>
                          i === questionIndex
                            ? defaultQuestions[questionIndex].label
                            : l
                        )
                      )
                    }
                    className="text-red-400"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {editingQuestion === questionIndex && (
                <div className="flex flex-col gap-2">
                  <input
                    value={tempLabel}
                    onChange={(e) => setTempLabel(e.target.value)}
                    placeholder={!tempLabel ? q.hint : ""}
                    className="w-full bg-zinc-800 border border-cyan-500 text-white rounded px-3 py-2"
                  />
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() => {
                        setCustomLabels((prev) =>
                          prev.map((l, i) =>
                            i === questionIndex ? tempLabel : l
                          )
                        );
                        setEditingQuestion(null);
                      }}
                    >
                      Save
                    </button>
                    <button
                      className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                      onClick={() => {
                        setEditingQuestion(null);
                        setTempLabel("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {q.field && !q.fields ? (
                q.field === "occupancyStatus" ? (
                  <select
                    value={formData.occupancyStatus || ""}
                    onChange={(e) => handleChange(e, "occupancyStatus")}
                    className="w-full bg-zinc-800 border border-neutral-700 text-white rounded px-3 py-2"
                  >
                    <option value="">Select Status</option>
                    <option value="vacant">Vacant</option>
                    <option value="rented">Rented</option>
                    <option value="owner occupied">Owner Occupied</option>
                  </select>
                ) : q.field === "method" ? (
                  <select
                    value={formData.method || ""}
                    onChange={(e) => handleChange(e, "method")}
                    className="w-full bg-zinc-800 border border-neutral-700 text-white rounded px-3 py-2"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes — open to creative financing</option>
                    <option value="no">No — not open to creative financing</option>
                  </select>
                ) : q.field === "rehabCost" ? (
                  <>
                    <label className="block text-sm mb-1 text-white">
                      Select Repairs Needed{" "}
                      <span className="text-yellow-500 text-xs font-semibold">
                        *highlighted items need attention based on age
                      </span>
                    </label>


                    <div className="space-y-1">
                      {rehabCategories.map((cat) => {
                        const isChecked = formData.repairKeys?.includes(cat.key) || false;
                        const yearBuilt = Number(formData.yearBuilt || 0);
                        const currentYear = new Date().getFullYear();
                        const age = currentYear - yearBuilt;

                        const isAttentionItem = (
                          cat.key === "foundation" ||
                          (cat.key === "electrical" && age >= 45) ||
                          (cat.key === "plumbing" && age >= 45) ||
                          (cat.key === "hvac" && age >= 20) ||
                          (cat.key === "roof" && age >= 25) ||
                          (cat.key === "windowsDoors" && age >= 25)
                        );



                        return (
                          <div
                            key={cat.key}
                            className={`text-sm ${isAttentionItem ? "bg-yellow-800 text-yellow-200 rounded-md px-2 py-1" : "text-white"}`}
                          >

                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  const prevKeys = formData.repairKeys || [];
                                  const updatedKeys = isChecked
                                    ? prevKeys.filter((k) => k !== cat.key)
                                    : [...prevKeys, cat.key];

                                  const updatedTotal = calculateRehabCost(
                                    updatedKeys,
                                    Number(formData.sqft || 0)
                                  );

                                  setFormData((prev) => ({
                                    ...prev,
                                    repairKeys: updatedKeys,
                                    rehabCost: updatedTotal.toFixed(0),
                                  }));
                                }}
                              />
                              {cat.label} (${cat.avgCostPerSqFt ?? 0}/sqft)
                            </label>

                            {cat.key === "foundation" && isChecked && (
                              <div className="ml-6 mt-1 space-y-1">
                                <p className="text-sm text-red-400 font-medium">
                                  Dealbreaker Red Flags:
                                </p>
                                {[
                                  "Horizontal cracks in walls",
                                  "Water intrusion in basement",
                                  "Sloping floors",
                                  "Doors/windows not closing properly",
                                  "Previous foundation repair attempts",
                                ].map((item) => {
                                  const selected =
                                    formData.foundationFlags || [];
                                  const included = selected.includes(item);
                                  return (
                                    <label
                                      key={item}
                                      className="flex items-center gap-2 text-sm text-white"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={included}
                                        onChange={() => {
                                          const updated = included
                                            ? selected.filter((v) => v !== item)
                                            : [...selected, item];
                                          setFormData((prev) => ({
                                            ...prev,
                                            foundationFlags: updated,
                                          }));
                                        }}
                                      />
                                      {item}
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-sm text-neutral-400 mt-2">
                      Estimated Total: ${formData.rehabCost}{" "}
                      <span className="text-xs text-neutral-500 italic">
                        *US Average Cost per sqft
                      </span>
                    </p>
                  </>
                ) : (
                  <input
                    value={(formData as any)[q.field] || ""}
                    onChange={(e) => handleChange(e, q.field)}
                    className="w-full bg-zinc-800 border border-neutral-700 text-white rounded px-3 py-2"
                  />
                )
              ) : null}

              {q.fields && (
                <div
                  className={`grid gap-4 ${
                    q.fields.length === 3
                      ? "grid-cols-1 md:grid-cols-3"
                      : "grid-cols-1 md:grid-cols-2"
                  }`}
                >
                  {q.fields.map((f: string) => (
                    <input
                      key={f}
                      name={f}
                      placeholder={f.replace(/([A-Z])/g, " $1")}
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
          <label className="text-cyan-400 block font-medium">
            Preferred Contact Method
          </label>
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
          Awesome, thanks for your time today. We’ll likely reach out with an
          offer and include proof of funds along with a credibility packet showing
          properties we’ve purchased over the last couple years.
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