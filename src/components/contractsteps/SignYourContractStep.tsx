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
    "WI", "WY"
  ];

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        disabled={index !== currentStep}
        className={`text-xs px-4 py-1 rounded font-semibold w-max ${
          index === currentStep
            ? "bg-cyan-500 text-black"
            : "bg-neutral-700 text-white opacity-60 cursor-not-allowed"
        }`}
      >
        Sign and Download
      </button>

      {showForm && index === currentStep && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-white text-center">Sign Your Contract</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData).map(([key, value]) => {
                const label =
                  key === "dueDiligenceDays"
                    ? "Inspection Period"
                    : key === "closingDate"
                    ? "Closing Date"
                    : key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());

                if (key === "closingDate") {
                  return (
                    <div key={key} className="relative">
                      <input
                        type="date"
                        value={value}
                        onChange={(e) =>
                          setFormData((prev: any) => ({ ...prev, closingDate: e.target.value }))
                        }
                        className="p-2 w-full rounded bg-neutral-800 text-white text-sm appearance-none"
                      />
                      <div className="pointer-events-none absolute right-3 top-2.5 text-white text-sm">
                        📅
                      </div>
                    </div>
                  );
                }

                if (key === "state") {
                  return (
                    <React.Fragment key={key}>
                      <select
                        className="p-2 rounded bg-neutral-800 text-white text-sm w-full"
                        value={value}
                        onChange={(e) =>
                          setFormData((prev: any) => ({ ...prev, state: e.target.value }))
                        }
                      >
                        <option value="" disabled>Select State</option>
                        {states.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        className="bg-white text-black px-4 py-2 rounded text-sm font-semibold w-full"
                        type="button"
                        onClick={() => {
                          if (hasSignature) {
                            alert("Signature already saved. Proceeding...");
                          } else {
                            setShowSignaturePad(true);
                          }
                        }}
                      >
                        {hasSignature ? "Sign" : "Create Signature"}
                      </button>
                    </React.Fragment>
                  );
                }

                return (
                  <input
                    key={key}
                    className="p-2 rounded bg-neutral-800 text-white text-sm"
                    placeholder={label}
                    value={value}
                    onChange={(e) =>
                      setFormData((prev: any) => ({ ...prev, [key]: e.target.value }))
                    }
                    disabled={key === "balanceDue"}
                  />
                );
              })}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="text-white px-4 py-1">
                Cancel
              </button>
              <button
                onClick={handleDownload}
                className="bg-green-500 text-black font-bold px-6 py-2 rounded"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
