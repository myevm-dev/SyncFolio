import React from "react";
import { DealInput } from "../../types/DealInput";

interface Props {
  formData: DealInput;
  renderField: (name: keyof DealInput, label: string, span?: number) => JSX.Element;
  handleChange: (e: React.ChangeEvent<any>) => void;
}

export default function PropertySection({ formData, renderField, handleChange }: Props) {
  return (
    <>
      <h2 className="text-center text-xl font-semibold text-[#6e5690] mt-4">Property Details</h2>

      <div className="grid grid-cols-1 gap-4">{renderField("zillowUrl", "Zillow URL", 2)}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderField("address", "Address")}
        {renderField("sqft", "Square Footage")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderField("beds", "Number of Beds")}
        {renderField("baths", "Number of Baths")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderField("listingPrice", "Listing Price")}
        {renderField("yearBuilt", "Year Built")}
      </div>
    </>
  );
}
