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
          className="min-w-[160px] px-6 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition"
        >
          See Offers
        </button>

        <button
          type="button"
          onClick={handleSave}
          className={`min-w-[160px] px-6 py-2 rounded-full font-semibold transition ${
            walletAddress
              ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-300 hover:to-orange-400"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!walletAddress}
        >
          {currentDealId ? "Update" : "Save"}
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="min-w-[160px] px-6 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-400 hover:to-gray-600 transition"
        >
          Clear
        </button>
      </div>
    </>
  );
}
