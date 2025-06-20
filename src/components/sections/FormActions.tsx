import React from "react";
import { DealInput } from "../../types/DealInput";

interface Props {
  handleSubmit: (e: React.FormEvent) => void;
  handleSave: () => void;
  handleClear: () => void;
  saveSuccess: boolean;
  walletAddress: string;
  currentDealId: string | null;
  formData: DealInput;
  handleChange: (e: React.ChangeEvent<any>) => void;
}

export default function FormActions({
  handleSubmit,
  handleSave,
  handleClear,
  saveSuccess,
  walletAddress,
  currentDealId,
  formData,
  handleChange,
}: Props) {
  return (
    <>
      {saveSuccess && (
        <div className="text-green-500 text-center font-medium">
          ✔ Deal saved successfully!
        </div>
      )}

      <div className="flex justify-center gap-4 border-t border-neutral-800 pt-6 flex-wrap">
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          Calculate
        </button>
        <button
          type="button"
          onClick={handleSave}
          className={`px-6 py-2 rounded-full transition ${
            walletAddress
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!walletAddress}
        >
          {currentDealId ? "Update" : "Save"}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition"
        >
          Clear
        </button>
      </div>
    </>
  );
}
