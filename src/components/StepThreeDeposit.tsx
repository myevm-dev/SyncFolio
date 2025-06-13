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

  const cityCount = form.cities?.length || 0;
  const depositAmount = cityCount > 5 ? 2500 : cityCount * 500;

  useEffect(() => {
    if (depositAmount === 0) {
      setConfirmed(false);
      setAgreeChecked(false);
    }
  }, [depositAmount, setConfirmed]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-cyan-400">Refundable Deposit</h3>

      <p className="text-sm text-gray-300">
        You selected <strong>{cityCount}</strong> {cityCount === 1 ? "city" : "cities"}.
        Your required deposit is <strong>${depositAmount.toLocaleString()}</strong>.
        {cityCount > 5 ? (
          <> You qualify for unlimited city access at the flat rate of $2,500.</>
        ) : (
          <> ($500 per city)</>
        )}
      </p>

      <p className="text-sm text-gray-400">
        Your deposit is <strong>fully refundable</strong>. You may withdraw your BuyBox and get your deposit back at any time.
        This ensures that only serious buyers are prioritized for premium off-market opportunities.
        <br /><br />
        <strong>Bonus:</strong> After completing 10 verified deals, no deposit will be required for future BuyBoxes.
      </p>

      <label className="flex items-center space-x-2">
        <input type="checkbox" checked={agreeChecked} onChange={handleToggle} />
        <span>I agree to the deposit terms</span>
      </label>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600"
        >
          Back
        </button>
        <button
          disabled
          className="px-4 py-2 font-semibold rounded bg-zinc-700 text-gray-400 cursor-not-allowed"
        >
          Coming Soon
        </button>
      </div>
    </div>
  );
};

export default StepThreeDeposit;
