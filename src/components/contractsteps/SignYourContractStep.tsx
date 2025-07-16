import React from "react";

interface Props {
  index: number;
  currentStep: number;
  showForm: boolean;
  setShowForm: (value: boolean) => void;
  hasSignature: boolean;
  setShowSignaturePad: (value: boolean) => void;
  formData: {
    [key: string]: string;
  };
  setFormData: (data: any) => void;
  handleDownload: () => void;
}

export default function SignYourContractStep({
  index,
  currentStep,
  showForm,
  setShowForm,
  hasSignature,
  setShowSignaturePad,
  formData,
  setFormData,
  handleDownload,
}: Props) {
  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS",
    "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY",
    "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV",
    "WI", "WY",
  ];

  if (index > currentStep) return null;

  return (
    <>
      <div className="w-[250px] md:w-[440px]">
        <button
          onClick={() => setShowForm(true)}
          className="w-full px-6 py-4 rounded bg-neutral-800 border border-cyan-500 hover:bg-cyan-600 hover:text-black text-white text-center font-semibold transition"
        >
          Sign and Download
        </button>
      </div>

      {showForm && index === currentStep && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-white text-center">Sign Your Contract</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData).map(([key, value]) => {
                if (["earnestMoney", "balanceDue", "closingDate", "dueDiligenceDays", "state", "daysToClose"].includes(key)) {
                  return null;
                }

                const label = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());

                return (
                  <input
                    key={key}
                    className="p-2 rounded bg-neutral-800 text-white text-sm"
                    placeholder={label}
                    value={value}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                  />
                );
              })}

              {/* Earnest Money and Balance Due */}
              <input
                key="earnestMoney"
                className="p-2 rounded bg-neutral-800 text-white text-sm"
                placeholder="Earnest Money"
                value={formData.earnestMoney}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    earnestMoney: e.target.value,
                  }))
                }
              />
              <div className="relative">
                <input
                  key="balanceDue"
                  className="p-2 rounded bg-neutral-800 text-sm text-gray-400 italic w-full pr-8"
                  placeholder="Balance Due (auto)"
                  value={formData.balanceDue}
                  disabled
                />
                <div className="pointer-events-none absolute right-2 top-2 text-white text-sm">🔒</div>
              </div>

              {/* Closing Date and Days to Close */}
              <div className="relative">
                <input
                  type="date"
                  value={formData.closingDate}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      closingDate: e.target.value,
                    }))
                  }
                  className="p-2 w-full rounded bg-neutral-800 text-white text-sm appearance-none"
                />
                <div className="pointer-events-none absolute right-3 top-2.5 text-white text-sm">📅</div>
              </div>
              <input
                key="daysToClose"
                className="p-2 rounded bg-neutral-800 text-white text-sm"
                placeholder="Days to Close (30 Days?)"
                value={formData.daysToClose || ""}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    daysToClose: e.target.value,
                  }))
                }
              />

              {/* Due Diligence and State */}
              <input
                key="dueDiligenceDays"
                className="p-2 rounded bg-neutral-800 text-white text-sm"
                placeholder="Inspection Days (7+)"
                value={formData.dueDiligenceDays}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    dueDiligenceDays: e.target.value,
                  }))
                }
              />
              <select
                key="state"
                className="p-2 rounded bg-neutral-800 text-white text-sm"
                value={formData.state}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    state: e.target.value,
                  }))
                }
              >
                <option value="" disabled>
                  Select State
                </option>
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {!hasSignature && (
              <div className="mt-4 col-span-2">
                <button
                  type="button"
                  onClick={() => setShowSignaturePad(true)}
                  className="w-full px-4 py-2 rounded bg-white text-black font-semibold hover:bg-gray-200 transition"
                >
                  Create Signature
                </button>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="text-white px-4 py-1 hover:underline"
              >
                Cancel
              </button>
              <div className="w-[250px] md:w-[320px]">
                <button
                  onClick={handleDownload}
                  className="w-full px-6 py-3 rounded bg-neutral-800 border border-cyan-500 hover:bg-cyan-600 hover:text-black text-white text-center font-semibold transition"
                  disabled={!hasSignature}
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
