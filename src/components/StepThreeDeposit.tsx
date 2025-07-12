import React, { useState, useEffect } from "react";
import { BuyBox } from "../types/Buybox";

interface Props {
  form: BuyBox;
  confirmed: boolean;
  setConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  onBack: () => void;
  onSubmit: () => void;
}

const StepThreeDeposit: React.FC<Props> = ({
  form,
  confirmed,
  setConfirmed,
  onBack,
  onSubmit,
}) => {
  const [agreeChecked, setAgreeChecked] = useState(confirmed);

  const handleToggle = () => {
    setAgreeChecked(!agreeChecked);
    setConfirmed(!agreeChecked);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-cyan-400">What’s Next</h3>

      <ol className="list-decimal list-inside text-sm text-gray-300 space-y-2">
        <li>When you press submit, it will be added to the buybox directory.</li>
        <li>Boost your buybox on a county level in the deal flow dashboard.</li>
        <li>
          <span className="text-yellow-400 font-medium">Coming Soon:</span>{" "}
          Deploy an AI deal analyzer to claim deals that match your buybox when away.
        </li>
      </ol>


      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!agreeChecked}
          className={`px-4 py-2 font-semibold rounded ${
            agreeChecked
              ? "bg-cyan-600 hover:bg-cyan-500 text-white"
              : "bg-zinc-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default StepThreeDeposit;
