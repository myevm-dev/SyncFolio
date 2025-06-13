import React, { useState } from "react";
import { BuyBox } from "../types/BuyBox";

interface Props {
  form: BuyBox;
  setForm: React.Dispatch<React.SetStateAction<BuyBox>>;
  onNext: () => void;
  onClose: () => void;
}

const StepOneBuyBoxForm: React.FC<Props> = ({ form, setForm, onNext, onClose }) => {
  const [citiesInput, setCitiesInput] = useState(form.cities?.join(", ") || "");

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
      <input
        name="cities"
        placeholder="Cities: Comma Separated (20-mile radius)*"
        value={citiesInput}
        onChange={(e) => setCitiesInput(e.target.value)}
        onBlur={() => {
          const parsed = citiesInput
            .split(",")
            .map((c) => c.trim())
            .filter((c) => c.length > 0);

          setForm((prev) => ({ ...prev, cities: parsed }));
        }}
        className="input"
      />

      <input
        name="county"
        placeholder="County (optional)"
        value={form.county || ""}
        onChange={handleChange}
        className="input"
      />

      <select
        name="propertyType"
        value={form.propertyType}
        onChange={handleChange}
        className="input"
      >
        <option value="single family">Single Family</option>
        <option value="multi family">Multi Family</option>
      </select>

      <input
        type="number"
        name="bedMin"
        placeholder="Min Bedrooms*"
        value={form.bedMin ?? ""}
        onChange={handleChange}
        className="input"
      />

      <input
        type="number"
        name="bathMin"
        placeholder="Min Bathrooms*"
        value={form.bathMin ?? ""}
        onChange={handleChange}
        className="input"
      />

      <input
        type="number"
        name="yearBuiltMin"
        placeholder="Min Year Built"
        value={form.yearBuiltMin ?? ""}
        onChange={handleChange}
        className="input"
      />

      <input
        type="number"
        name="sqftMin"
        placeholder="Min Square Footage*"
        value={form.sqftMin ?? ""}
        onChange={handleChange}
        className="input"
      />

      <input
        type="number"
        name="sqftMax"
        placeholder="Max Square Footage"
        value={form.sqftMax ?? ""}
        onChange={handleChange}
        className="input"
      />

      <input
        type="number"
        name="arvPercentMax"
        placeholder="Max ARV %"
        value={form.arvPercentMax ?? ""}
        onChange={handleChange}
        className="input"
      />

      <input
        type="number"
        name="maxRehabCost"
        placeholder="Max Rehab Cost"
        value={form.maxRehabCost ?? ""}
        onChange={handleChange}
        className="input"
      />

      <input
        type="number"
        name="maxPrice"
        placeholder="Max Purchase Price"
        value={form.maxPrice ?? ""}
        onChange={handleChange}
        className="input"
      />

      <input
        name="foundation"
        placeholder="Foundation Type"
        value={form.foundation || ""}
        onChange={handleChange}
        className="input"
      />

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="hoa"
          checked={form.hoa || false}
          onChange={handleChange}
        />
        <span>HOA</span>
      </label>

      {/* Pricing note below city input */}
      <div className="sm:col-span-2 text-sm text-gray-400 -mt-2">
        $500 refundable deposit per city or unlock unlimited cities with a $2,500 deposit (Step 3)
      </div>

      <div className="sm:col-span-2 flex justify-end gap-2 pt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600"
        >
          Cancel
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded hover:bg-cyan-500"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepOneBuyBoxForm;
