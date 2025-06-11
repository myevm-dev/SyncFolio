import React, { useState } from "react";

export type BuyBox = {
  city: string;
  county?: string;
  propertyType: string;
  bedMin: number;
  bathMin: number;
  yearBuiltMin?: number;
  sqftMin: number;
  sqftMax?: number;
  arvPercentMax?: number;
  maxRehabCost?: number;
  maxPrice?: number;
  hoa?: boolean;
  foundation?: string;
};

interface Props {
  onClose: () => void;
  onSubmit: (buybox: BuyBox) => void;
}

const SubmitBuyboxModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState<BuyBox>({
    city: "",
    propertyType: "single family",
    bedMin: 1,
    bathMin: 1,
    sqftMin: 0,
    hoa: false,
  });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
        const checked = (e.target as HTMLInputElement).checked;
        setForm((prev) => ({
        ...prev,
        [name]: checked,
        }));
    } else {
        setForm((prev) => ({
        ...prev,
        [name]: type === "number" ? +value : value,
        }));
    }
    };


  const handleSubmit = () => {
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-[#0B1519] text-white p-6 rounded-xl border border-cyan-400 w-full max-w-2xl space-y-4">
        <h2 className="text-2xl font-bold text-cyan-400">Submit Your BuyBox</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="city" placeholder="City*" value={form.city} onChange={handleChange} className="input" />
          <input name="county" placeholder="County (optional)" value={form.county || ""} onChange={handleChange} className="input" />

          <select name="propertyType" value={form.propertyType} onChange={handleChange} className="input">
            <option value="single family">Single Family</option>
            <option value="multi family">Multi Family</option>
            <option value="land">Land</option>
            <option value="mobile home">Mobile Home</option>
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
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600">Cancel</button>
          <button disabled className="px-4 py-2 bg-zinc-600 text-gray-300 font-semibold rounded cursor-not-allowed">
            Submit (Coming Soon)
            </button>

        </div>
      </div>
    </div>
  );
};

export default SubmitBuyboxModal;
