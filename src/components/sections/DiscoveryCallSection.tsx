import React from "react";
import { DealInput } from "../../types/DealInput";

interface Props {
  showScriptModal: boolean;
  setShowScriptModal: React.Dispatch<React.SetStateAction<boolean>>;
  formData: DealInput;
  setFormData: React.Dispatch<React.SetStateAction<DealInput>>;
}

export default function DiscoveryCallSection({
  showScriptModal,
  setShowScriptModal,
  formData,
  setFormData,
}: Props) {
  return (
    <>
      <h2 className="text-center text-xl font-semibold text-[#6e5690] mt-8">Discovery Call</h2>

      <div className="flex justify-center mt-2 mb-4">
        <button
          type="button"
          onClick={() => setShowScriptModal(true)}
          className="px-4 py-1 text-sm bg-cyan-700 text-white rounded hover:bg-purple-800 transition"
        >
          Open Call Script
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Monthly Rental Value</label>
          <input
            name="rentalValue"
            value={formData.rentalValue || ""}
            onChange={(e) => setFormData({ ...formData, rentalValue: e.target.value })}
            className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Occupancy Status</label>
          <select
            name="occupancyStatus"
            value={formData.occupancyStatus || ""}
            onChange={(e) => setFormData({ ...formData, occupancyStatus: e.target.value })}
            className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2"
          >
            <option value="">Select Status</option>
            <option value="vacant">Vacant</option>
            <option value="rented">Rented</option>
            <option value="owner occupied">Owner Occupied</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div>
          <label className="block text-sm font-medium mb-1">Estimated Rehab Cost</label>
          <input
            name="rehabCost"
            value={formData.rehabCost || ""}
            onChange={(e) => setFormData({ ...formData, rehabCost: e.target.value })}
            className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">After Repair Value (ARV)</label>
          <input
            name="arv"
            value={formData.arv || ""}
            onChange={(e) => setFormData({ ...formData, arv: e.target.value })}
            className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div>
          <label className="block text-sm font-medium mb-1">Monthly Taxes</label>
          <input
            name="taxes"
            value={formData.taxes || ""}
            onChange={(e) => setFormData({ ...formData, taxes: e.target.value })}
            className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Monthly HOA</label>
          <input
            name="hoa"
            value={formData.hoa || ""}
            onChange={(e) => setFormData({ ...formData, hoa: e.target.value })}
            className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Monthly Insurance Estimate</label>
          <input
            name="insurance"
            value={formData.insurance || ""}
            onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
            className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">High Risk Area?</label>
          <select
            name="highRiskArea"
            value={formData.highRiskArea || ""}
            onChange={(e) => setFormData({ ...formData, highRiskArea: e.target.value })}
            className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
      </div>

      <div className="border-t border-neutral-800 pt-6">
        <label className="block text-sm font-medium mb-1">Notes / Why Are They Selling?</label>
        <textarea
          name="notes"
          value={formData.notes || ""}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          maxLength={1000}
          rows={4}
          className="w-full bg-zinc-900 text-white border border-neutral-700 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="text-right text-xs text-gray-400">
          {(formData.notes?.length || 0)}/1000
        </div>
      </div>
    </>
  );
}