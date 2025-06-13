// StepOneBuyBoxForm.tsx
import React from "react";
import { BuyBox } from "../types/BuyBox";

interface Props {
  form: BuyBox;
  setForm: React.Dispatch<React.SetStateAction<BuyBox>>;
  onNext: () => void;
  onClose: () => void;
}

const StepOneBuyBoxForm: React.FC<Props> = ({ form, setForm, onNext, onClose }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "number" ? +value : value,
      }));
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input name="city" placeholder="City*" value={form.city} onChange={handleChange} className="input" />
      <input name="county" placeholder="County (optional)" value={form.county || ""} onChange={handleChange} className="input" />
      <select name="propertyType" value={form.propertyType} onChange={handleChange} className="input">
        <option value="single family">Single Family</option>
        <option value="multi family">Multi Family</option>
      </select>
      <input type="number" name="bedMin" placeholder="Min Beds*" value={form.bedMin} onChange={handleChange} className="input" />
      <input type="number" name="bathMin" placeholder="Min Baths*" value={form.bathMin} onChange={handleChange} className="input" />
      <input type="number" name="yearBuiltMin" placeholder="Min Year Built" value={form.yearBuiltMin || ""} onChange={handleChange} className="input" />
      <input type="number" name="sqftMin" placeholder="Min Sqft*" value={form.sqftMin} onChange={handleChange} className="input" />
      <input type="number" name="sqftMax" placeholder="Max Sqft" value={form.sqftMax || ""} onChange={handleChange} className="input" />
      <input type="number" name="arvPercentMax" placeholder="ARV % Max" value={form.arvPercentMax || ""} onChange={handleChange} className="input" />
      <input type="number" name="maxRehabCost" placeholder="Max Rehab Cost" value={form.maxRehabCost || ""} onChange={handleChange} className="input" />
      <input type="number" name="maxPrice" placeholder="Max Price" value={form.maxPrice || ""} onChange={handleChange} className="input" />
      <input name="foundation" placeholder="Foundation Type" value={form.foundation || ""} onChange={handleChange} className="input" />
      <label className="flex items-center space-x-2">
        <input type="checkbox" name="hoa" checked={form.hoa || false} onChange={handleChange} />
        <span>HOA</span>
      </label>

      <div className="sm:col-span-2 flex justify-end gap-2 pt-4">
        <button onClick={onClose} className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600">Cancel</button>
        <button onClick={onNext} className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded hover:bg-cyan-500">
          Next
        </button>
      </div>
    </div>
  );
};

export default StepOneBuyBoxForm;
