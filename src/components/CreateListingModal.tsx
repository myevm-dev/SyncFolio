import React, { useState } from "react";

interface Listing {
  address: string;
  method: string;
  price: string;
  buyNowPrice: string;
  currentBid: string;
  returnValue: string;
  monthlyCashflow: string;
  daysLeft?: number;
  imageUrl: string;
}

interface Props {
  onClose: () => void;
  onSubmit: (listing: Listing) => void;
}

const CreateListingModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState<Listing>({
    address: "",
    method: "Seller Finance",
    price: "",
    buyNowPrice: "",
    currentBid: "",
    returnValue: "",
    monthlyCashflow: "",
    daysLeft: undefined,
    imageUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "daysLeft" ? (value ? parseInt(value) : undefined) : value,
    }));
  };

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

        <select
          name="method"
          value={form.method}
          onChange={handleChange}
          className="input w-full"
        >
          <option value="Seller Finance">Seller Finance</option>
          <option value="Takeover">Mortgage Takeover</option>
          <option value="Morby Method">Morby Method</option>
          <option value="Cash">Cash</option>
        </select>

        <input
          name="price"
          placeholder="Asking Price*"
          value={form.price}
          onChange={handleChange}
          className="input w-full"
        />
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
