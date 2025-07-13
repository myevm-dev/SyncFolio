import React, { useState } from "react";

interface Listing {
  address: string;
  methods: string[];
  price: string;
  buyNowPrice: string;
  currentBid: string;
  returnValue: string;
  monthlyCashflow: string;
  mortgageOwed: string;
  daysLeft?: number;
  imageUrl: string;
}

interface Props {
  onClose: () => void;
  onSubmit: (listing: Listing) => void;
}

const financingOptions = ["Seller Finance", "Mortgage Takeover", "Morby Method", "Cash"];

const CreateListingModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState<Listing>({
    address: "",
    methods: [],
    price: "",
    buyNowPrice: "",
    currentBid: "",
    returnValue: "",
    monthlyCashflow: "",
    mortgageOwed: "",
    daysLeft: undefined,
    imageUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "daysLeft" ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const toggleMethod = (method: string) => {
    setForm((prev) => ({
      ...prev,
      methods: prev.methods.includes(method)
        ? prev.methods.filter((m) => m !== method)
        : [...prev.methods, method],
    }));
  };

  const loanToValuePercent = (() => {
    const price = parseFloat(form.price.replace(/[^0-9.]/g, ""));
    const owed = parseFloat(form.mortgageOwed.replace(/[^0-9.]/g, ""));
    if (!price || price <= 0) return 0;
    return Math.min(100, (owed / price) * 100);
  })();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-[#0B1519] text-white p-6 rounded-xl border border-cyan-400 w-full max-w-xl space-y-4 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold text-cyan-400 text-center">Create Listing</h2>

        <input
          name="address"
          placeholder="Property Address*"
          value={form.address}
          onChange={handleChange}
          className="input w-full"
        />

        {/* Financing Options */}
        <div>
          <label className="block mb-1 font-medium text-sm text-cyan-300">Open to these methods:</label>
          <div className="grid grid-cols-2 gap-2">
            {financingOptions.map((option) => (
              <label key={option} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.methods.includes(option)}
                  onChange={() => toggleMethod(option)}
                  className="accent-cyan-400"
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <input
          name="price"
          placeholder="Asking Price*"
          value={form.price}
          onChange={handleChange}
          className="input w-full"
        />

        <input
          name="mortgageOwed"
          placeholder="Amount Owed on Mortgage"
          value={form.mortgageOwed}
          onChange={handleChange}
          className="input w-full"
        />

        {/* LTV Progress Bar */}
        <div>
          <label className="block text-sm font-medium mb-1 text-cyan-300">
            Loan to Value: {isNaN(loanToValuePercent) ? "--" : `${loanToValuePercent.toFixed(1)}%`}
          </label>
          <div className="relative w-full bg-zinc-800 rounded-full h-2 mb-1">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300"
              style={{ width: `${Math.min(100, loanToValuePercent)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-zinc-400 px-1">
            <span>$0</span>
            <span>Mortgage</span>
            <span>{form.price || "Price"}</span>
          </div>
        </div>

        <input
          name="buyNowPrice"
          placeholder="Buy Now Price"
          value={form.buyNowPrice}
          onChange={handleChange}
          className="input w-full"
        />
        <input
          name="currentBid"
          placeholder="Current Bid"
          value={form.currentBid}
          onChange={handleChange}
          className="input w-full"
        />
        <input
          name="returnValue"
          placeholder="Return Value (e.g. 28.5%)"
          value={form.returnValue}
          onChange={handleChange}
          className="input w-full"
        />
        <input
          name="monthlyCashflow"
          placeholder="Monthly Cashflow"
          value={form.monthlyCashflow}
          onChange={handleChange}
          className="input w-full"
        />
        <input
          type="number"
          name="daysLeft"
          placeholder="Days left to accept offers (e.g. 7)"
          value={form.daysLeft ?? ""}
          onChange={handleChange}
          className="input w-full"
        />
        <input
          name="imageUrl"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={handleChange}
          className="input w-full"
        />

        <div className="flex justify-between pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600"
          >
            Cancel
          </button>
          <button
            disabled
            className="px-4 py-2 bg-zinc-700 text-gray-400 cursor-not-allowed font-semibold rounded"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateListingModal;
