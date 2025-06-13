// StepThreeDeposit.tsx
import React, { useState } from "react";

interface Props {
  confirmed: boolean;
  setConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  onBack: () => void;
  onSubmit: () => void;
}

const StepThreeDeposit: React.FC<Props> = ({ confirmed, setConfirmed, onBack, onSubmit }) => {
  const [agreeChecked, setAgreeChecked] = useState(confirmed);

  const handleToggle = () => {
    setAgreeChecked(!agreeChecked);
    setConfirmed(!agreeChecked);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-cyan-400">Refundable Deposit</h3>
      <p className="text-sm text-gray-300">
        To be verified as a serious buyer, we require a <strong>$1,500 refundable deposit</strong>. This deposit is
        locked for 3 months and signals that you are ready to transact. You will be prioritized for high-quality deal flow.
      </p>

      <label className="flex items-center space-x-2">
        <input type="checkbox" checked={agreeChecked} onChange={handleToggle} />
        <span>I agree to the deposit terms</span>
      </label>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600">
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!agreeChecked}
          className={`px-4 py-2 font-semibold rounded ${
            agreeChecked ? "bg-green-600 hover:bg-green-500 text-white" : "bg-zinc-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Confirm & Submit
        </button>
      </div>
    </div>
  );
};

export default StepThreeDeposit;
